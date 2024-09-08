import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfWeek } from 'date-fns';
import { addDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import {
  faBusinessTime,
  faArrowLeft,
  faSearch,
  faFaceTired,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LineChartComponent = ({ data, options }) => {
  // if options is not specified, replace with below
  if (!options) {
    options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    };
  }

  return <Line data={data} options={options} />;
};

const Timesheet = ({ currentUser, employees, setEmployees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  const [currentPage, setCurrentPage] = useState(1); // 1 or 2, to display analytics
  const [daysCanWork, setDaysCanWork] = useState('default'); // default, or weekends too (default is weekdays only)

  // Function to select an employee by ID
  const handleSelectEmployee = employeeId => {
    const employeeDetails = employees.find(e => e.id === employeeId);
    setSelectedEmployee(employeeDetails);
  };

  // if Permissions are admin level
  const isAdmin = currentUser.permissions === 'admin';

  // Permissions to view time if moderator or admin
  const canViewTime =
    currentUser.permissions === 'admin' ||
    currentUser.permissions === 'moderator';

  // Function to save the timesheet
  const handleSave = () => {
    // Update the employee's details in the array
    const updatedEmployees = employees.map(employee => {
      if (employee.id === selectedEmployee.id) {
        return selectedEmployee;
      }
      return employee;
    });
    setEmployees(updatedEmployees);
  };

  const handleDateChange = date => {
    // Adjust the selected date to the start of the week so that
    // people can see the hours worked per week
    const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1 });
    setSelectedWeek(startOfWeekDate);
  };

  const navigate = useNavigate();

  // Navigate back
  const handleBackClick = () => {
    navigate('/interface');
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState(employees);

  useEffect(() => {
    // Filter employees based on the search query
    const lowercasedQuery = searchQuery.toLowerCase();

    const filtered = employees.filter(
      employee =>
        employee.id.toString() === lowercasedQuery ||
        employee.fullName.toLowerCase().includes(lowercasedQuery),
    );

    // Add an alternative in case there's no exact match
    const approximateFiltered = employees.filter(
      employee =>
        employee.id.toString().includes(lowercasedQuery) ||
        employee.fullName.toLowerCase().includes(lowercasedQuery),
    );

    const finalFiltered = filtered.length > 0 ? filtered : approximateFiltered;

    setFilteredEmployees(finalFiltered);

    // If the search query is an exact match for an employee ID, select that employee
    if (filtered.length === 1) {
      setSelectedEmployee(filtered[0]);
    }
  }, [searchQuery, employees]);

  const handleSearch = e => {
    setSearchQuery(e.target.value);
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setSelectedEmployee(prevSelectedEmployee => ({
      ...prevSelectedEmployee,
      [name]: value,
    }));
  };

  const dimOutCurrentPageButton = pageNumber => {
    if (pageNumber === currentPage) {
      return { opacity: '0.5' };
    }
    return {};
  };

  const handleAbsence = () => {
    const absenceReason = document.getElementById('absenceReason').value;
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const absenceString = `${formattedDate}: ${absenceReason}`;

    setSelectedEmployee(prevSelectedEmployee => {
      const updatedAbsenceInstances = prevSelectedEmployee.absenceInstances
        ? prevSelectedEmployee.absenceInstances + '\n' + absenceString // If there's something, prepend \n
        : absenceString; // If blank, just use absenceString

      return {
        ...prevSelectedEmployee,
        daysAbsent: prevSelectedEmployee.daysAbsent + 1,
        absenceInstances: updatedAbsenceInstances,
      };
    });

    handleSave();
  };

  const parseRestTime = timeString => {
    const [hours, minutes] = timeString.split(':').map(parseFloat);
    return (hours + minutes / 60).toFixed(2); // return as a float string
  };

  const doneForTheDay = employeeId => {
    if (!selectedEmployee) {
      return;
    } else {
      // grab the selectedEmployee
      const checkInTime = selectedEmployee.checkIn || '00:00';
      const checkOutTime = selectedEmployee.checkOut || '00:00';
      const hoursOfRest = selectedEmployee.hoursOfRest || '00:00';

      const checkInParts = checkInTime.split(':');
      const checkOutParts = checkOutTime.split(':');

      // Construct date objects for check-in and check-out
      const checkInDate = new Date();
      checkInDate.setHours(
        parseInt(checkInParts[0], 10),
        parseInt(checkInParts[1], 10),
      );
      const checkOutDate = new Date();
      checkOutDate.setHours(
        parseInt(checkOutParts[0], 10),
        parseInt(checkOutParts[1], 10),
      );

      // Calculate worked time in milliseconds.
      const workedMilliseconds = checkOutDate - checkInDate;

      // Fix for handling 'hoursOfRest' as a decimal
      const restHoursParts = hoursOfRest.split(':');
      const restHours = parseInt(restHoursParts[0], 10);
      const restMinutes = parseInt(restHoursParts[1], 10);
      const restMilliseconds = (restHours * 60 + restMinutes) * 60 * 1000;

      // Subtract rest time from worked time.
      const workedTodayHours =
        (workedMilliseconds - restMilliseconds) / (1000 * 60 * 60);

      // Check for negative or NaN values and handle it:
      if (workedTodayHours < 0 || isNaN(workedTodayHours)) {
        alert('勤務時間の計算に失敗しました。時間を再入力してください。');
        return; // Early return, keeping the original state unchanged
      }

      const formattedDate = format(new Date(), 'yyyy年MM月dd日');
      // Make sure to spread the existing dailyHours, then assign the new value
      const dailyHoursUpdated = {
        ...selectedEmployee.dailyHours,
        [formattedDate]: workedTodayHours,
      };

      // alert all dailyhours
      // alert(JSON.stringify(dailyHoursUpdated));

      alert(`今日は ${workedTodayHours} 時間働きました。`);

      // Update the employee regardless
      setSelectedEmployee(prevSelectedEmployee => ({
        ...prevSelectedEmployee,
        checkIn: checkInTime,
        checkOut: checkOutTime,
        hoursOfRest,
        todayHours: workedTodayHours,
        dailyHours: dailyHoursUpdated,
      }));

      // Save all the values to this employee
      handleSave();
      return;
    }
  };

  const weeklyHoursGraph = () => {
    if (!selectedEmployee) {
      return null;
    }

    // Use the locale for formatting dates in Japanese
    const formatter = (date, dateFormat) =>
      format(date, dateFormat, { locale: ja });

    // Determine if weekends should be included
    const includeWeekends = daysCanWork !== 'default'; // Include weekends if 'daysCanWork' is not set to 'default'
    const days = includeWeekends
      ? ['日', '月', '火', '水', '木', '金', '土']
      : ['月', '火', '水', '木', '金'];

    // Determine the first day of the selected week
    const startOfSelectedWeek = startOfWeek(selectedWeek, { locale: ja }); // Use the local week start for Japan

    // Create an array of the days in the selected week
    const daysInWeek = days.map((_, index) =>
      formatter(addDays(startOfSelectedWeek, index), 'yyyy年MM月dd日'),
    );

    // Create an initial hours object with all days set to 0
    let hours = days.reduce((acc, day) => ({ ...acc, [day]: 0 }), {});

    // Assign hours based on the dailyHours data
    daysInWeek.forEach((formattedDate, index) => {
      if (selectedEmployee.dailyHours[formattedDate]) {
        const hoursWorked = selectedEmployee.dailyHours[formattedDate];
        const dayOfWeek = days[index];
        hours[dayOfWeek] += hoursWorked; // Accumulate the hours for each day of the week
      }
    });

    let maxHours = 0;
    for (const day in hours) {
      if (hours[day] > maxHours) {
        maxHours = hours[day];
      }
    }

    // Make the yMax *1.5 to give some space at the top of the graph
    maxHours = Math.ceil(maxHours * 1.25);
    // Round maxHours to the nearest whole number
    maxHours = Math.ceil(maxHours / 5) * 5;

    // Create the data object for the graph
    const data = {
      labels: days,
      datasets: [
        {
          label: '労働時間統計',
          data: days.map(day => hours[day]),
          fill: true,
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 2,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: maxHours,
          ticks: {
            stepSize: 1,
          },
        },
      },
    };

    return <LineChartComponent data={data} options={options} />;
  };

  return (
    <>
      <div className="relative_container">
        <div className="title_container">
          <div className="section_title">
            <FontAwesomeIcon className="faIcon" icon={faBusinessTime} />
            タイムシート
          </div>
          <div className="back_button" onClick={handleBackClick}>
            <FontAwesomeIcon className="faIcon back" icon={faArrowLeft} />
            戻る
          </div>
        </div>
      </div>

      {/* Classic Search Bar */}
      <div className="management-container search">
        <div className="search-container">
          <FontAwesomeIcon
            className="faIcon"
            icon={faSearch}
            style={{ marginRight: '15px' }}
          />
          <input
            type="text"
            placeholder="ID または 名前で検索..."
            value={searchQuery}
            onChange={handleSearch}
            readOnly={!isAdmin}
          />
        </div>
      </div>

      <div className="management-container">
        <div className="list employee-ids-list">
          {/* for nonAdmins, just jibun */}
          {!isAdmin &&
            employees
              .filter(employee => employee.id === currentUser.id)
              .map(employee => (
                <div
                  key={employee.id}
                  className={`list-item ${
                    selectedEmployee?.id === employee.id ? 'selected' : ''
                  }`}
                  onClick={() => handleSelectEmployee(employee.id)}
                >
                  {employee.id}
                </div>
              ))}
          {/* for admins, you too */}
          {isAdmin &&
            filteredEmployees.map(employee => (
              <div
                key={employee.id}
                className={`list-item ${
                  selectedEmployee?.id === employee.id ? 'selected' : ''
                }`}
                onClick={() => handleSelectEmployee(employee.id)}
              >
                {employee.id}
              </div>
            ))}
        </div>
        {selectedEmployee && currentPage === 1 && (
          <>
            <div className="form-columns-container">
              <div className="form-column">
                <h3 className="form-header">基本情報</h3>
                <div className="form-group">
                  <label htmlFor="fullName">名前</label>
                  <input
                    style={{ color: '#858585' }}
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={selectedEmployee.fullName}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="id">ID</label>
                  <input
                    style={{ color: '#858585' }}
                    type="text"
                    id="id"
                    name="id"
                    value={selectedEmployee.id}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="date">日付</label>
                  <input
                    style={{ color: '#858585' }}
                    type="text"
                    id="date"
                    name="date"
                    value={new Date().toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    readOnly
                  />
                </div>
              </div>

              <div className="form-column">
                <h3 className="form-header">出勤</h3>
                <div className="form-group">
                  <label htmlFor="checkIn">今日の出勤</label>
                  <input
                    type="time"
                    id="checkIn"
                    name="checkIn"
                    value={selectedEmployee.checkIn || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="checkOut">今日の退勤</label>
                  <input
                    type="time"
                    id="checkOut"
                    name="checkOut"
                    value={selectedEmployee.checkOut || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="hoursOfRest">
                    休憩時間
                    <span
                      style={{
                        fontSize: '.75rem',
                        color: '#858585',
                        marginLeft: '5px',
                      }}
                    >
                      (何時間)
                    </span>
                  </label>
                  <input
                    type="number"
                    id="hoursOfRest"
                    name="hoursOfRest"
                    min="0"
                    step="0.25"
                    value={
                      selectedEmployee.hoursOfRest
                        ? parseRestTime(selectedEmployee.hoursOfRest)
                        : 0
                    }
                    onChange={e => {
                      // Update the state with formatted time string "HH:MM"
                      const numericValue = parseFloat(e.target.value);
                      const hours = Math.floor(numericValue);
                      const minutes = Math.round((numericValue - hours) * 60);
                      handleInputChange({
                        target: {
                          name: e.target.name,
                          value: `${String(hours).padStart(2, '0')}:${String(
                            minutes,
                          ).padStart(2, '0')}`,
                        },
                      });
                    }}
                  />
                </div>

                <div className="action-buttons" style={{ marginTop: '15px' }}>
                  <button onClick={() => doneForTheDay(selectedEmployee.id)}>
                    <FontAwesomeIcon
                      icon={faClock}
                      fixedWidth
                      style={{ marginRight: '5px' }}
                    />
                    日終わり
                  </button>
                </div>
              </div>

              {/* now a form column for absences */}
              {/* absence input */}
              <div className="form-column">
                <h3 className="form-header">欠勤情報</h3>
                <div className="form-group">
                  <label htmlFor="daysPresent">出勤日数</label>
                  <input
                    style={{ color: '#858585' }}
                    type="text"
                    id="daysPresent"
                    name="daysPresent"
                    value={selectedEmployee.daysPresent || ''}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="daysAbsent">欠勤日数</label>
                  <input
                    style={{ color: '#858585' }}
                    type="text"
                    id="daysAbsent"
                    name="daysAbsent"
                    value={selectedEmployee.daysAbsent || ''}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="absenceReason">欠勤理由</label>
                  <textarea
                    type="text"
                    id="absenceReason"
                    name="absenceReason"
                    value={selectedEmployee.absenceReason || ''}
                    onChange={handleInputChange}
                  />
                </div>

                {/* action button for absence */}
                <div className="action-buttons">
                  <button onClick={handleAbsence}>
                    <FontAwesomeIcon
                      icon={faFaceTired}
                      fixedWidth
                      style={{ marginRight: '5px' }}
                    />
                    欠勤
                  </button>
                </div>

                {canViewTime && (
                  <div
                    className="action-buttons page"
                    style={{ marginTop: '10px' }}
                  >
                    <button
                      onClick={() => setCurrentPage(1)}
                      style={dimOutCurrentPageButton(1)}
                    >
                      1
                    </button>
                    <button
                      onClick={() => setCurrentPage(2)}
                      style={dimOutCurrentPageButton(2)}
                    >
                      2
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {selectedEmployee && currentPage === 2 && (
          <>
            <div className="form-columns-container">
              <div className="form-column">
                <h3 className="form-header">データ</h3>
                {/* display the graph */}
                <div
                  style={{ height: '20em', width: '100%', marginTop: '.5em' }}
                >
                  {weeklyHoursGraph()}
                </div>
              </div>

              <div className="form-column">
                <h3 className="form-header">勤務設定</h3>
                <div className="form-group">
                  <label htmlFor="daysCanWork">スケジュール設定</label>
                  <select
                    id="daysCanWork"
                    name="daysCanWork"
                    value={daysCanWork}
                    onChange={e => setDaysCanWork(e.target.value)}
                  >
                    <option value="default">平日だけ</option>
                    <option value="weekends">週末も</option>
                  </select>
                </div>

                {/* current week */}
                <div className="form-group">
                  <label htmlFor="date">週</label>
                  <DatePicker
                    selected={selectedWeek}
                    onChange={date => handleDateChange(date)}
                    showWeekNumbers
                    dateFormat="yyyy年MM月dd日"
                    locale="ja"
                  />
                </div>

                <div
                  className="action-buttons page"
                  style={{ marginTop: '15px' }}
                >
                  <button
                    onClick={() => setCurrentPage(1)}
                    style={dimOutCurrentPageButton(1)}
                  >
                    1
                  </button>
                  <button
                    onClick={() => setCurrentPage(2)}
                    style={dimOutCurrentPageButton(2)}
                  >
                    2
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Timesheet;
