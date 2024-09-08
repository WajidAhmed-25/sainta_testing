import React, { useState, useEffect } from 'react';
import { ja } from 'date-fns/locale';
import DatePicker, { registerLocale } from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  faSave,
  faSearch,
  faTrashAlt,
  faDownload,
  faArrowLeft,
  faPlusCircle,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'react-datepicker/dist/react-datepicker.css';

import {
  addEmployee,
  addDepartment,
  updateEmployees,
  selectAllemployees,
  selectAlldepartments,
  updateDepartments,
} from '../../store/slices/employee/employeeSlice';
import {
  addUser,
  updateUsers,
  selectAllusers,
} from '../../store/slices/user/userSlice';

const EmployeeManagement = ({
  users,
  setUsers,
  currentUser,
  setCurrentUser,
  employees,
  setEmployees,
  departments,
  setDepartments,
  mail,
  setMail,
}) => {
  const departmentsData = useSelector(selectAlldepartments);
  const employeesData = useSelector(selectAllemployees);
  const usersData = useSelector(selectAllusers);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log({ departmentsData, employeesData, usersData });

  registerLocale('ja', ja); // registering local with the name you want

  const handleBackClick = () => navigate('/interface');

  // Selectors
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // View types
  const [viewType, setViewType] = useState('department_info'); // department_info, employee_info

  // Can Edit Info & // Can modify personal info (admin or if currentUser.id === selectedEmployee.id) & // Can view search bar (admin/moderator)
  const canEditInfo = currentUser && currentUser.permissions === 'admin';
  const canModifyPersonalInfo =
    currentUser &&
    selectedEmployee &&
    (currentUser.permissions === 'admin' ||
      currentUser.id === selectedEmployee.id);
  const canViewSearchBar =
    currentUser &&
    (currentUser.permissions === 'admin' ||
      currentUser.permissions === 'moderator');

  // Search query & search bar
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState(employees);

  useEffect(() => {
    // First, if a selector is defined, select it
    if (currentUser.selectedItem.menu && currentUser.selectedItem.selected_id) {
      // If the selector is an employee, select the employee
      if (currentUser.selectedItem.menu === 'employees') {
        const employee = employees.find(
          employee => employee.id === currentUser.selectedItem.selected_id,
        );
        setSelectedEmployee(employee);
        const department = departments.find(
          department => department.name === employee.department,
        );
        setSelectedDepartment(department);
        setViewType('employee_info');

        // Get rid of the selector
        setCurrentUser(currentUser => {
          const updatedUser = { ...currentUser };
          updatedUser.selectedItem = {
            menu: null,
            selected_id: null,
          };
          return updatedUser;
        });
      }
    }
    // Now for search bar

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
      const department = departments.find(
        department => department.name === filtered[0].department,
      );
      setSelectedDepartment(department);
    }
  }, [searchQuery, employees, currentUser]);

  const handleSearch = e => {
    setSearchQuery(e.target.value);
  };

  const handleNewDepartment = () => {
    // Create a new department with blank settings, name shinki busho
    // Grab last id and add 1 or 1
    const lastId =
      departments.length > 0 ? departments[departments.length - 1].id : 1;
    const newDepartment = {
      id: lastId + 1,
      business_ID: currentUser.business_ID,
      name: '新部署',
      description: '新しく作成された部署',
    };

    // Add to departments
    dispatch(addDepartment(newDepartment)); // adding new department;
    setDepartments(prevDepartments => [...prevDepartments, newDepartment]);
    setSelectedDepartment(newDepartment);
  };

  const handleNewEmployee = () => {
    // Create a new employee with blank settings, name shinki busho
    // Grab last id and add 1 or 1
    const lastId =
      employees.length > 0 ? employees[employees.length - 1].id : 1;
    const newEmployee = {
      id: lastId + 1,
      business_ID: currentUser.business_ID,
      fullName: '新 従業員',
      furigana: 'しんじゅうぎょういん',
      department: selectedDepartment.name,
      telephone: '',
      email: '',
      address: '',
      username: 'sainta',
      password: 'sainta',
    };

    // Create a new user with blank settings, name shinki busho
    const user_id = lastId + 1; // same ID as the employee ID
    const newUser = {
      id: user_id,
      fullName: '新 従業員',
      business_ID: currentUser.business_ID,
      username: 'sainta',
      password: 'sainta',
      permissions: 'user',
      firstLogin: true,
      selectedItem: {
        menu: null,
        selected_id: null,
      },
    };

    // Add to users and employees, and select the employee
    dispatch(addUser(newUser)); // adding new user
    setUsers(prevUsers => [...prevUsers, newUser]);

    dispatch(addEmployee(newEmployee)); // adding new employee
    setEmployees(prevEmployees => [...prevEmployees, newEmployee]);

    setSelectedEmployee(newEmployee);

    // Change view type to employee_info
    setViewType('employee_info');
  };

  // SaveDep info and DeleteDep
  const saveDepartmentInfo = department => {
    // Update the department
    const updatedDepartments = departments.map(dep => {
      if (dep.id === department.id) {
        return department;
      }
      return dep;
    });

    // Update the departments
    dispatch(updateDepartments(updatedDepartments)); // updating departments list
    setDepartments(updatedDepartments);
  };

  const deleteDepartment = department => {
    // Delete the department and set the employees that belong to it to the other existing departments
    // But before that, if there are no other departments, do not delete the department
    if (departments.length === 1) {
      alert('部署を削除することはできません。一つ以上の部署が必要です。');
      return;
    }
    const updatedDepartments = departments.filter(
      dep => dep.id !== department.id,
    );
    const updatedEmployees = employees.map(employee => {
      if (employee.department === department.name) {
        return { ...employee, department: updatedDepartments[0].name };
      }
      return employee;
    });

    // Update the departments and employees
    dispatch(updateDepartments(updatedDepartments)); // updating departments list after delete
    setDepartments(updatedDepartments);

    dispatch(updateEmployees(updatedEmployees)); // updating employees list after delete
    setEmployees(updatedEmployees);
  };

  const [currentPage, setCurrentPage] = useState(1); // First page -> 1

  // HandleInputChange(e) function that handles integers, strings, dates, etc
  const handleInputChange = e => {
    // If we are updating the employee ID, we need to make sure that user ID as well as mail info is all updated
    if (e.target.name === 'id') {
      // Update the mail
      const mailUpdate = mail.map(mail => {
        if (mail.sender_ID === selectedEmployee.id) {
          return { ...mail, sender_ID: e.target.value };
        } else if (mail.recipient_IDS.includes(selectedEmployee.id)) {
          const updatedRecipient_IDS = mail.recipient_IDS.map(recipient_ID => {
            if (recipient_ID === selectedEmployee.id) {
              return e.target.value;
            }
            return recipient_ID;
          });
          return { ...mail, recipient_IDS: updatedRecipient_IDS };
        } else if (
          mail.isRead[selectedEmployee.id] ||
          mail.isRead[selectedEmployee.id] === false
        ) {
          // Preserve the original isRead value and just append it to the new ID
          const updatedIsRead = {
            ...mail.isRead,
            [e.target.value]: mail.isRead[selectedEmployee.id],
          };
          delete updatedIsRead[selectedEmployee.id];
          return { ...mail, isRead: updatedIsRead };
        }
        return mail;
      });
      setMail(mailUpdate);

      // Update the users & the currentUser
      const updatedUsers = users.map(user => {
        if (user.id === selectedEmployee.id) {
          return { ...user, id: e.target.value };
        }
        return user;
      });

      dispatch(updateUsers(updatedUsers)); // updating user list
      setUsers(updatedUsers);

      // Update the currentUser if the currentUser is the employee we are modifying
      if (currentUser.id === selectedEmployee.id) {
        const updatedUser = { ...currentUser, id: e.target.value };
        setCurrentUser(updatedUser);
      }
    }

    // Make sure the selectedEmployee doesn't get mutated -> in the sense that when
    // we change the information, it doesn't change the selectedEmployee
    const updatedEmployee = { ...selectedEmployee };

    // Update the selectedEmployee fields
    if (
      e.target.name === 'salaryAmount' ||
      e.target.name === 'taxDeductionRate' ||
      e.target.name === 'totalDeduction'
    ) {
      // If the input is a number, we need to convert it to a number
      updatedEmployee[e.target.name] = parseInt(e.target.value);
    } else if (
      e.target.name === 'daysPresent' ||
      e.target.name === 'daysAbsent'
    ) {
      // If the input is a number, we need to convert it to a number
      updatedEmployee[e.target.name] = parseInt(e.target.value);
    } else if (e.target.name === 'absenceInstances') {
      // If the input is a number, we need to convert it to a number
      updatedEmployee[e.target.name] = e.target.value;
    } else {
      updatedEmployee[e.target.name] = e.target.value;
    }

    // Update the employees
    const updatedEmployees = employees.map(employee => {
      if (employee.id === selectedEmployee.id) {
        return updatedEmployee;
      }
      return employee;
    });

    dispatch(updateEmployees(updatedEmployees)); // updating employee list
    setEmployees(updatedEmployees);
    setSelectedEmployee(updatedEmployee);

    // We have to make sure for certain variables (like fullname), we update the users as well
    // Update the users
    const updatedUsers = users.map(user => {
      if (user.id === selectedEmployee.id) {
        return { ...user, [e.target.name]: e.target.value };
      }
      return user;
    });

    dispatch(updateUsers(updatedUsers)); // updating user list
    setUsers(updatedUsers);
  };

  const handleDateInputChange = (date, name) => {
    // Make sure the selectedEmployee doesn't get mutated -> in the sense that when
    // we change the information, it doesn't change the selectedEmployee
    const updatedEmployee = { ...selectedEmployee };

    // Update the selectedEmployee
    updatedEmployee[name] = date;

    // Update the employees
    const updatedEmployees = employees.map(employee => {
      if (employee.id === selectedEmployee.id) {
        return updatedEmployee;
      }
      return employee;
    });

    setEmployees(updatedEmployees);
    setSelectedEmployee(updatedEmployee);
  };

  // saveEmployee & deleteEmployee
  const saveEmployeeInfo = employee => {
    // Update the employee
    const updatedEmployees = employees.map(emp => {
      if (emp.id === employee.id) {
        return employee;
      }
      return emp;
    });

    // Update the employees
    dispatch(updateEmployees(updatedEmployees)); // updating employee list
    setEmployees(updatedEmployees);

    // Update the selectedEmployee
    setSelectedEmployee(employee);
  };

  const deleteEmployee = employee => {
    // If the employee that they're selecting is the currentUser, then we tell them they can't delete it
    if (employee.id === currentUser.id) {
      alert('現在ログインしているユーザーを削除することはできません。');
      return;
    }
    // else we need to check if the user that is linked to that employee's isLoggedIn is true, then we say they can't delete it
    else if (users.find(user => user.id === employee.id).isLoggedIn) {
      alert('現在ログインしているユーザーを削除することはできません。');
      return;
    }

    // Window prompt asking if they really want to delete the employee
    if (
      !window.confirm(
        'この従業員のデータを削除すると、元に戻すことはできません。削除を実行してよろしいですか？',
      )
    ) {
      return;
    }

    // Delete the employee
    const updatedEmployees = employees.filter(emp => emp.id !== employee.id);

    // Update the employees
    dispatch(updateEmployees(updatedEmployees)); // updating employee list
    setEmployees(updatedEmployees);

    // Delete the same user from the users list
    const updatedUsers = users.filter(user => user.id !== employee.id);

    // Update the users
    dispatch(updateUsers(updatedUsers));
    setUsers(updatedUsers);

    // Update the selectedDepartment & selectedEmployee
    setSelectedDepartment(null);
    setSelectedEmployee(null);
  };

  const ActionButtons = () => {
    // a function to dim out the current page button
    const dimOutCurrentPageButton = pageNumber => {
      if (pageNumber === currentPage) {
        return { opacity: '0.5' };
      }
      return {};
    };

    return (
      <>
        <div className="action-buttons" style={{ marginTop: '15px' }}>
          <button
            onClick={() => saveEmployeeInfo(selectedEmployee)}
            disabled={!canEditInfo}
          >
            <FontAwesomeIcon icon={faSave} fixedWidth />
            保存
          </button>
          <button
            onClick={() => deleteEmployee(selectedEmployee)}
            disabled={!canEditInfo}
          >
            <FontAwesomeIcon icon={faTrashAlt} fixedWidth />
            削除
          </button>
        </div>
        <div className="action-buttons page" style={{ marginTop: '15px' }}>
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
          <button
            onClick={() => setCurrentPage(3)}
            style={dimOutCurrentPageButton(3)}
          >
            3
          </button>
          <button
            onClick={() => setCurrentPage(4)}
            style={dimOutCurrentPageButton(4)}
          >
            4
          </button>
        </div>
      </>
    );
  };

  // Now handleUserInfoChange -> this will work on the userList directly & the employee info
  const handleUserInfoChange = e => {
    // We need to ask the user if it is permissions, if they really want to change it
    if (e.target.name === 'permissions') {
      // if the currentUser has the same ID as the selectedEmployee, then we can't change the permissions
      // This is b/c permission changing people are admins, so to remove admin privileges from them
      // would cause a problem (especially if there is only ONE admin)
      if (currentUser.id === selectedEmployee.id) {
        alert('自分の権限を変更することはできません。');
        return;
      }
      if (
        !window.confirm(
          '権限の変更により、該当ユーザーが突然アクセスを失うか、またはデータにアクセスして修正できるようになる可能性があります。本当に変更を続行しますか？',
        )
      ) {
        return;
      }
    }

    // We need to change the userList's info, whilst not changing selectedEmployee
    // Update the users
    const updatedUsers = users.map(user => {
      if (user.id === selectedEmployee.id) {
        return { ...user, [e.target.name]: e.target.value };
      }
      return user;
    });

    setUsers(updatedUsers);

    // Now we need to update the selectedEmployee
    const updatedEmployee = {
      ...selectedEmployee,
      [e.target.name]: e.target.value,
    };
    setSelectedEmployee(updatedEmployee);

    // Update the employees
    const updatedEmployees = employees.map(employee => {
      if (employee.id === selectedEmployee.id) {
        return updatedEmployee;
      }
      return employee;
    });

    setEmployees(updatedEmployees);

    // Now we need to update the currentUser if the currentUser is the selectedEmployee
    if (currentUser.id === selectedEmployee.id) {
      const updatedUser = { ...currentUser, [e.target.name]: e.target.value };
      setCurrentUser(updatedUser);
    }
  };

  // HandleFileChange
  const handleFileChange = e => {
    // Make sure to only accept pdf files
    if (e.target.files[0].type !== 'application/pdf') {
      alert('ファイル形式が無効です。PDFファイルを選択してください。');
      return;
    }

    // Make sure the selectedEmployee doesn't get mutated -> in the sense that when
    // we change the information, it doesn't change the selectedEmployee
    const updatedEmployee = { ...selectedEmployee };

    // Update the selectedEmployee
    updatedEmployee[e.target.name] = {
      filetype: 'pdf',
      filename: e.target.files[0].name,
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0]),
    };

    // Update the employees
    const updatedEmployees = employees.map(employee => {
      if (employee.id === selectedEmployee.id) {
        return updatedEmployee;
      }
      return employee;
    });

    setEmployees(updatedEmployees);
    setSelectedEmployee(updatedEmployee);
  };

  // Const downloadFile
  const downloadFile = file => {
    // Create a new anchor element
    const anchor = document.createElement('a');
    anchor.href = file.url;
    anchor.download = file.filename;
    anchor.click();
    URL.revokeObjectURL(file.url);
  };

  return (
    <>
      <div className="relative_container">
        <div className="title_container">
          <div className="section_title">
            <FontAwesomeIcon className="faIcon" icon={faUserFriends} />
            従業員
          </div>
          <div className="back_button" onClick={handleBackClick}>
            <FontAwesomeIcon className="faIcon back" icon={faArrowLeft} />
            戻る
          </div>
        </div>
      </div>

      {canViewSearchBar && (
        <>
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
              />
            </div>
          </div>
        </>
      )}

      <div className="management-container">
        <div className="list departments-list">
          {departments.map((department, index) => (
            <div
              key={index}
              className={`list-item ${
                selectedDepartment === department ? 'selected' : ''
              }`}
              onClick={() => {
                setSelectedDepartment(department);
                setSelectedEmployee(null);
                setViewType('department_info');
              }}
            >
              {department.name}
            </div>
          ))}
          {canEditInfo && (
            <>
              <div
                className="list-item new-button"
                onClick={() => handleNewDepartment()}
              >
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  style={{ marginRight: '10px' }}
                />
                新規部署
              </div>
            </>
          )}
        </div>

        {selectedDepartment && (
          <>
            <div className="list employees-list">
              {employees
                .filter(
                  employee => employee.department === selectedDepartment.name,
                )
                .map(employee => (
                  <div
                    key={employee}
                    className={`list-item ${
                      selectedEmployee === employee ? 'selected' : ''
                    }`}
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setViewType('employee_info');
                    }}
                  >
                    {employee.fullName}
                  </div>
                ))}
              {canEditInfo && (
                <>
                  <div
                    className="list-item new-button"
                    onClick={() => handleNewEmployee()}
                  >
                    <FontAwesomeIcon
                      icon={faPlusCircle}
                      style={{ marginRight: '10px' }}
                    />
                    新規従業員
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {selectedDepartment && viewType === 'department_info' && (
          <>
            <div className="form-columns-container">
              <div className="form-column">
                <h3 className="form-header">部署情報</h3>
                <div className="form-group">
                  <label htmlFor="name">部署名</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={selectedDepartment.name}
                    onChange={e => {
                      // Change the department name and the employees that belong to it's department name
                      const updatedDepartment = {
                        ...selectedDepartment,
                        name: e.target.value,
                      };
                      const updatedEmployees = employees.map(employee => {
                        if (employee.department === selectedDepartment.name) {
                          return { ...employee, department: e.target.value };
                        }
                        return employee;
                      });
                      setSelectedDepartment(updatedDepartment);
                      dispatch(updateEmployees(updatedEmployees)); // updating employee list
                      setEmployees(updatedEmployees);
                    }}
                    disabled={!canEditInfo}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">説明</label>
                  <textarea
                    id="description"
                    name="description"
                    value={selectedDepartment.description}
                    onChange={e =>
                      setSelectedDepartment({
                        ...selectedDepartment,
                        description: e.target.value,
                      })
                    }
                    disabled={!canEditInfo}
                  />
                </div>
                <div className="action-buttons" style={{ marginTop: '15px' }}>
                  <button
                    onClick={() => saveDepartmentInfo(selectedDepartment)}
                  >
                    <FontAwesomeIcon icon={faSave} fixedWidth />
                    保存
                  </button>
                  <button onClick={() => deleteDepartment(selectedDepartment)}>
                    <FontAwesomeIcon icon={faTrashAlt} fixedWidth />
                    削除
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedEmployee &&
          viewType === 'employee_info' &&
          currentPage === 1 && (
            <>
              {/* ID => disabled field regardless, fullName, furigana */}
              <div className="form-columns-container">
                <div className="form-column">
                  <h3 className="form-header">基本情報</h3>
                  <div className="form-group">
                    <label htmlFor="id">ID</label>
                    <input
                      type="text"
                      id="id"
                      name="id"
                      value={selectedEmployee.id}
                      onChange={handleInputChange}
                      disabled={!canEditInfo}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fullName">名前</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={selectedEmployee.fullName}
                      onChange={handleInputChange}
                      disabled={!canEditInfo}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="furigana">フリガナ</label>
                    <input
                      type="text"
                      id="furigana"
                      name="furigana"
                      value={selectedEmployee.furigana}
                      onChange={handleInputChange}
                      disabled={!canEditInfo}
                    />
                  </div>
                </div>
                {/* other info -> gender, nationality , dob -> datepicker */}
                <div className="form-column">
                  <h3 className="form-header">個人情報</h3>
                  <div className="form-group">
                    <label htmlFor="gender">性別</label>
                    <select
                      id="gender"
                      name="gender"
                      value={selectedEmployee.gender}
                      onChange={handleInputChange}
                      disabled={!canEditInfo}
                    >
                      <option value="男性">男性</option>
                      <option value="女性">女性</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="nationality">国籍</label>
                    <input
                      type="text"
                      id="nationality"
                      name="nationality"
                      value={selectedEmployee.nationality}
                      onChange={handleInputChange}
                      placeholder="国籍を入力して下しい"
                      disabled={!canEditInfo}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dateOfBirth">生年月日</label>
                    <DatePicker
                      selected={selectedEmployee.dateOfBirth}
                      onChange={date =>
                        handleDateInputChange(date, 'dateOfBirth')
                      }
                      locale="ja"
                      dateFormat="yyyy年MM月dd日"
                      placeholderText="生年月日を選択して下さい"
                      disabled={!canEditInfo}
                    />
                  </div>
                </div>

                <div className="form-column">
                  <h3 className="form-header">連絡先情報</h3>
                  <div className="form-group">
                    <label htmlFor="telephone">電話番号</label>
                    <input
                      type="text"
                      id="telephone"
                      name="telephone"
                      value={selectedEmployee.telephone}
                      onChange={handleInputChange}
                      placeholder="電話番号を入力して下さい"
                      disabled={!canEditInfo}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">メールアドレス</label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={selectedEmployee.email}
                      onChange={handleInputChange}
                      placeholder="メールアドレスを入力して下さい"
                      disabled={!canEditInfo}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">住所</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={selectedEmployee.address}
                      onChange={handleInputChange}
                      placeholder="住所を入力して下さい"
                      disabled={!canEditInfo}
                    />
                  </div>

                  {/* action buttons and page buttons (which are action buttons-page class) */}
                  <ActionButtons />
                </div>
              </div>
            </>
          )}

        {selectedEmployee &&
          viewType === 'employee_info' &&
          currentPage === 2 && (
            <>
              {/* department, employmentType, position *勤務情報 */}
              <div className="form-columns-container">
                <div className="form-column">
                  <h3 className="form-header">勤務情報</h3>
                  <div className="form-group">
                    <label htmlFor="department">部署</label>
                    <select
                      id="department"
                      name="department"
                      value={selectedEmployee.department}
                      onChange={e => {
                        // Change the employee's department, update the employees list and selectedEmployee & selectedDepartment
                        const updatedEmployee = {
                          ...selectedEmployee,
                          department: e.target.value,
                        };
                        const updatedEmployees = employees.map(employee => {
                          if (employee.id === selectedEmployee.id) {
                            return updatedEmployee;
                          }
                          return employee;
                        });
                        setSelectedEmployee(updatedEmployee);
                        dispatch(updateEmployees(updatedEmployees)); // updating employee list
                        setEmployees(updatedEmployees);
                        setSelectedDepartment(
                          departments.find(
                            department => department.name === e.target.value,
                          ),
                        );
                      }}
                      disabled={!canEditInfo}
                    >
                      {departments.map(department => (
                        <option key={department} value={department.name}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="employmentType">雇用形態</label>
                    <select
                      id="employmentType"
                      name="employmentType"
                      value={selectedEmployee.employmentType}
                      onChange={handleInputChange}
                      disabled={!canEditInfo}
                    >
                      <option value="正社員">正社員</option>
                      <option value="非常勤">非常勤</option>
                      <option value="契約">契約</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="position">役職</label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={selectedEmployee.position}
                      onChange={handleInputChange}
                      placeholder="役職を入力して下さい"
                      disabled={!canEditInfo}
                    />
                  </div>
                </div>

                {/* date of joining, date i get paid, and pay raise history */}
                <div className="form-column">
                  <h3 className="form-header">給与情報</h3>
                  <div className="form-group">
                    <label htmlFor="dateOfJoining">入社日</label>
                    <DatePicker
                      selected={selectedEmployee.dateOfJoining}
                      onChange={date =>
                        handleDateInputChange(date, 'dateOfJoining')
                      }
                      locale="ja"
                      dateFormat="yyyy年MM月dd日"
                      disabled={!canEditInfo}
                      placeholderText="入社日を選択して下さい"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="salaryInterval">給与支払間隔</label>
                    <select
                      id="salaryInterval"
                      name="salaryInterval"
                      value={selectedEmployee.salaryInterval}
                      onChange={handleInputChange}
                      disabled={!canEditInfo}
                    >
                      <option value="時">時</option>
                      <option value="日">日</option>
                      <option value="週">週</option>
                      <option value="月">月</option>
                      <option value="年">年</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="salaryDayOfWeek">給与支払日</label>
                    <select
                      id="salaryDayOfWeek"
                      name="salaryDayOfWeek"
                      value={selectedEmployee.salaryDayOfWeek}
                      onChange={handleInputChange}
                      disabled={!canEditInfo}
                    >
                      <option value="日曜日">日曜日</option>
                      <option value="月曜日">月曜日</option>
                      <option value="火曜日">火曜日</option>
                      <option value="水曜日">水曜日</option>
                      <option value="木曜日">木曜日</option>
                      <option value="金曜日">金曜日</option>
                      <option value="土曜日">土曜日</option>
                    </select>
                  </div>
                </div>

                {/* 経済情報: salary stuff */}
                <div className="form-column">
                  <h3 className="form-header">経済情報</h3>
                  <div className="form-group">
                    <label htmlFor="salaryAmount">
                      給与額{' '}
                      <span
                        style={{
                          fontSize: '.75rem',
                          color: '#858585',
                          marginLeft: '5px',
                        }}
                      >
                        (時給 / 月給 / 年俸)
                      </span>
                    </label>
                    <div className="currency-input-group">
                      <span className="currency-label">¥</span>
                      <input
                        type="number"
                        id="salaryAmount"
                        name="salaryAmount"
                        value={canEditInfo ? selectedEmployee.salaryAmount : -1}
                        onChange={handleInputChange}
                        placeholder="給与額を入力して下さい"
                        disabled={!canEditInfo}
                      />
                    </div>
                  </div>

                  {/* deductions & totaldeductions, use % and ¥ for the currency-input label */}
                  <div className="form-group">
                    <label htmlFor="taxDeductionRate">控除率</label>
                    <div className="currency-input-group">
                      <span className="currency-label">%</span>
                      <input
                        type="number"
                        id="taxDeductionRate"
                        name="taxDeductionRate"
                        disabled={!canEditInfo}
                        value={
                          canEditInfo ? selectedEmployee.taxDeductionRate : -1
                        }
                        onChange={handleInputChange}
                        placeholder="税率を入力して下さい"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="totalDeduction">総控除額</label>
                    <div className="currency-input-group">
                      <span className="currency-label">¥</span>
                      <input
                        type="number"
                        id="totalDeduction"
                        name="totalDeduction"
                        // only show totalDeduction if canChangePerms
                        value={
                          canEditInfo ? selectedEmployee.totalDeduction : -1
                        }
                        onChange={handleInputChange}
                        placeholder="総控除額を入力して下さい"
                        disabled={!canEditInfo}
                      />
                    </div>
                  </div>

                  {/* actionbuttons */}
                  <ActionButtons />
                </div>
              </div>
            </>
          )}

        {selectedEmployee &&
          viewType === 'employee_info' &&
          currentPage === 3 && (
            <>
              {/* insurance information,  保険情報*/}
              <div className="form-columns-container">
                <div className="form-column">
                  <h3 className="form-header">保険情報</h3>
                  <div className="form-group">
                    <label htmlFor="healthInsuranceNumber">健康保険番号</label>
                    <input
                      type="text"
                      id="healthInsuranceNumber"
                      name="healthInsuranceNumber"
                      value={
                        canEditInfo
                          ? selectedEmployee.healthInsuranceNumber
                          : '***'
                      }
                      onChange={handleInputChange}
                      disabled={!canEditInfo}
                      placeholder="健康保険番号を入力して下さい"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="welfarePensionInsuranceNumber">
                      厚生年金保険番号
                    </label>
                    <input
                      type="text"
                      id="welfarePensionInsuranceNumber"
                      name="welfarePensionInsuranceNumber"
                      value={
                        canEditInfo
                          ? selectedEmployee.welfarePensionInsuranceNumber
                          : '***'
                      }
                      onChange={handleInputChange}
                      disabled={!canEditInfo}
                      placeholder="厚生年金保険番号を入力して下さい"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="employmentInsuranceNumber">
                      雇用保険番号
                    </label>
                    <input
                      type="text"
                      id="employmentInsuranceNumber"
                      name="employmentInsuranceNumber"
                      value={
                        canEditInfo
                          ? selectedEmployee.employmentInsuranceNumber
                          : '***'
                      }
                      onChange={handleInputChange}
                      disabled={!canEditInfo}
                      placeholder="雇用保険番号を入力して下さい"
                    />
                  </div>
                </div>

                {/* now, days present, days absent, absence instances (make min height of absence instances little bigger & scroll bar*/}
                <div className="form-column">
                  <h3 className="form-header">出勤情報</h3>
                  <div className="form-group">
                    <label htmlFor="daysPresent">出勤日数</label>
                    <input
                      type="number"
                      id="daysPresent"
                      name="daysPresent"
                      value={canEditInfo ? selectedEmployee.daysPresent : -1}
                      readOnly
                      disabled={!canEditInfo}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="daysAbsent">欠勤日数</label>
                    <input
                      type="number"
                      id="daysAbsent"
                      name="daysAbsent"
                      value={canEditInfo ? selectedEmployee.daysAbsent : -1}
                      readOnly
                      disabled={!canEditInfo}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="absenceInstances">欠勤履歴</label>
                    <textarea
                      style={{
                        minHeight: '100px',
                        maxHeight: '100px',
                        overflowY: 'scroll',
                      }}
                      id="absenceInstances"
                      name="absenceInstances"
                      value={
                        canEditInfo
                          ? selectedEmployee.absenceInstances
                          : '見ることができません。'
                      }
                      onChange={handleInputChange}
                      disabled={!canEditInfo}
                    />
                  </div>
                </div>

                {/* now, performce rating, lastmeeting, other notes (also maxHeighted with scroll) */}
                <div className="form-column">
                  <h3 className="form-header">業績記録</h3>
                  <div className="form-group">
                    <label htmlFor="performanceRating">
                      業績評価
                      <span
                        style={{
                          fontSize: '.75rem',
                          color: '#858585',
                          marginLeft: '5px',
                        }}
                      >
                        (10点満点中)
                      </span>
                    </label>
                    <input
                      type="number"
                      id="performanceRating"
                      name="performanceRating"
                      value={
                        canEditInfo ? selectedEmployee.performanceRating : -1
                      }
                      onChange={handleInputChange}
                      disabled={!canEditInfo}
                      placeholder="業績評価を入力して下さい"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastMeeting">最後の会議日</label>
                    <DatePicker
                      selected={selectedEmployee.lastMeeting}
                      onChange={date =>
                        handleDateInputChange(date, 'lastMeeting')
                      }
                      locale="ja"
                      dateFormat="yyyy年MM月dd日"
                      disabled={!canEditInfo}
                      placeholderText="最後の会議日を選択して下さい"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="otherNotes">その他のメモ</label>
                    <textarea
                      style={{
                        minHeight: '100px',
                        maxHeight: '100px',
                        overflowY: 'scroll',
                      }}
                      id="otherNotes"
                      name="otherNotes"
                      value={
                        canEditInfo
                          ? selectedEmployee.otherNotes
                          : '見ることができません。'
                      }
                      onChange={handleInputChange}
                      disabled={!canEditInfo}
                    />
                  </div>

                  {/* actionbuttons */}
                  <ActionButtons />
                </div>
              </div>
            </>
          )}

        {selectedEmployee &&
          viewType === 'employee_info' &&
          currentPage === 4 && (
            <>
              {/* will be username, password, and permissions. basically, can only view the perms selector if you are an admin */}
              <div className="form-columns-container">
                {/* files, employeement contract, personal information, resume */}
                <div className="form-column">
                  <h3 className="form-header">ファイル</h3>
                  <div className="form-group">
                    <label htmlFor="employmentContract">雇用契約書</label>
                    <input
                      type="file"
                      id="employmentContract"
                      name="employmentContract"
                      onChange={handleFileChange}
                      disabled={!canEditInfo}
                    />

                    {selectedEmployee.employmentContract && (
                      <button
                        className="download-button"
                        onClick={() =>
                          downloadFile(selectedEmployee.employmentContract.file)
                        }
                      >
                        <FontAwesomeIcon
                          icon={faDownload}
                          fixedWidth
                          style={{ marginRight: '5px' }}
                        />
                        表示
                      </button>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="personalInformation">個人情報</label>
                    <input
                      type="file"
                      id="personalInformation"
                      name="personalInformation"
                      onChange={handleFileChange}
                      disabled={!canEditInfo}
                    />

                    {selectedEmployee.personalInformation && (
                      <button
                        className="download-button"
                        onClick={() =>
                          downloadFile(
                            selectedEmployee.personalInformation.file,
                          )
                        }
                      >
                        <FontAwesomeIcon
                          icon={faDownload}
                          fixedWidth
                          style={{ marginRight: '5px' }}
                        />
                        表示
                      </button>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="resume">履歴書</label>
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      onChange={handleFileChange}
                      disabled={!canEditInfo}
                    />

                    {selectedEmployee.resume && (
                      <button
                        className="download-button"
                        onClick={() =>
                          downloadFile(selectedEmployee.resume.file)
                        }
                      >
                        <FontAwesomeIcon
                          icon={faDownload}
                          fixedWidth
                          style={{ marginRight: '5px' }}
                        />
                        表示
                      </button>
                    )}
                  </div>
                </div>

                <div className="form-column">
                  <h3 className="form-header">アカウント情報</h3>
                  <div className="form-group">
                    <label htmlFor="username">ユーザー名</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={
                        canModifyPersonalInfo
                          ? users.find(user => user.id === selectedEmployee.id)
                              .username
                          : '***'
                      }
                      onChange={handleUserInfoChange}
                      disabled={!canModifyPersonalInfo}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">パスワード</label>
                    <input
                      type="text"
                      id="password"
                      name="password"
                      value={
                        canModifyPersonalInfo
                          ? users.find(user => user.id === selectedEmployee.id)
                              .password
                          : '***'
                      }
                      onChange={handleUserInfoChange}
                      disabled={!canModifyPersonalInfo}
                    />
                  </div>

                  {currentUser.permissions === 'admin' && (
                    <>
                      <div className="form-group">
                        <label htmlFor="permissions">権限</label>
                        <select
                          id="permissions"
                          name="permissions"
                          // map to the userList's permissions
                          value={
                            users.find(user => user.id === selectedEmployee.id)
                              .permissions
                          }
                          onChange={handleUserInfoChange}
                          disabled={!canEditInfo}
                        >
                          <option value="admin">管理者</option>
                          <option value="moderator">モデレーター</option>
                          <option value="user">ユーザー</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* actionbuttons */}
                  <ActionButtons />
                </div>
              </div>
            </>
          )}
      </div>
    </>
  );
};

export default EmployeeManagement;
