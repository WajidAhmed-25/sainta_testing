import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse } from 'date-fns';
import { ja } from 'date-fns/locale';
import {
  faWallet,
  faPlusCircle,
  faArrowLeft,
  faTrashAlt,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Expenses = ({
  currentUser,
  expenses,
  setExpenses,
  expenseCategories,
  setExpenseCategories,
  employees,
  setEmployees,
}) => {
  const navigate = useNavigate();

  const hasEditPermission =
    currentUser &&
    (currentUser.permissions === 'admin' ||
      currentUser.permissions === 'moderator');

  const initialExpenseState = {
    name: '新規経費',
    cost: 0,
    businessID: currentUser.businessID,
    fullPayment: false,
    paidAmount: 0,
    incurredDate: new Date(),
    dueDate: new Date(),
    settlementDate: new Date(),
    category: expenseCategories[0],
    taxInformation: '',
    receipt: '',
    approver: '',
    reimbursable: false,
    remarks: '',
  };

  const handleFullPaymentChange = e => {
    if (e.target.checked) {
      setSelectedExpense({
        ...selectedExpense,
        fullPayment: true,
        paidAmount: selectedExpense.cost,
        settlementDate: new Date(),
      });
    } else {
      setSelectedExpense({
        ...selectedExpense,
        fullPayment: false,
        settlementDate: null,
        paidAmount: 0,
      });
    }
  };

  const groupExpensesByMonthYear = expenses => {
    const groups = {};

    expenses.forEach(expense => {
      const monthYear = format(expense.incurredDate, 'yyyy年MM月', {
        locale: ja,
      });
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(expense);
    });

    return groups;
  };

  const orderedMonthYears = () => {
    const groups = groupExpensesByMonthYear(expenses);
    return Object.keys(groups).sort((a, b) => {
      const aDate = parse(a, 'yyyy年MM月', new Date(), { locale: ja });
      const bDate = parse(b, 'yyyy年MM月', new Date(), { locale: ja });
      return aDate > bDate ? -1 : 1;
    });
  };

  const [selectedMonthYear, setSelectedMonthYear] = useState(null);

  const handleMonthYearClick = monthYear => {
    setSelectedMonthYear(monthYear);
    const monthlyExpenses = groupExpensesByMonthYear(expenses)[monthYear];
    setSelectedExpense(monthlyExpenses[0]);
  };

  const monthYearList = orderedMonthYears();

  const handleBackClick = () => {
    navigate('/interface');
  };

  const handleSelectExpense = expenseId => {
    const expense = expenses.find(expense => expense.id === expenseId);
    setSelectedExpense(
      expense ? { ...expense } : { ...initialExpenseState, id: expenseId },
    );
  };

  const handleNewExpense = () => {
    let last_ID = 0;
    if (expenses.length > 0) {
      last_ID = expenses[expenses.length - 1].id;
    }
    const newExpense = { ...initialExpenseState, id: last_ID + 1 };
    setExpenses([...expenses, newExpense]);
    setSelectedExpense(newExpense);
    // select the month-year of the new expense
    const monthYear = format(newExpense.incurredDate, 'yyyy年MM月', {
      locale: ja,
    });
    setSelectedMonthYear(monthYear);
  };

  const handleInputChange = e => {
    // Handle forms such as input, select, checkbox, datepicker
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setSelectedExpense({ ...selectedExpense, [name]: newValue });
  };

  const saveExpense = () => {
    console.log('Saving...', selectedExpense);

    // Update State
    const index = expenses.findIndex(
      expense => expense.id === selectedExpense.id,
    );
    const newExpenses = [...expenses];
    newExpenses[index] = selectedExpense;
    setExpenses(newExpenses);

    // Update Database (TO;DO)
  };

  const deleteExpense = () => {
    console.log('Deleting...', selectedExpense.id);

    const index = expenses.findIndex(
      expense => expense.id === selectedExpense.id,
    );
    const newExpenses = [...expenses];
    newExpenses.splice(index, 1);
    setExpenses(newExpenses);
    setSelectedExpense(null);

    // If the last expense of a month-year was deleted, clear the selectedMonthYear
    if (
      !newExpenses.some(
        e =>
          format(e.incurredDate, 'yyyy年MM月', { locale: ja }) ===
          selectedMonthYear,
      )
    ) {
      setSelectedMonthYear(null);
    }

    // Update Database (TODO)
  };

  const [selectedExpense, setSelectedExpense] = useState(null);

  // Action Buttons
  const ActionButtons = ({ handleSave, handleDelete, setCurrentPage }) => {
    const dimOutCurrentPageButton = pageNumber => {
      if (pageNumber === currentPage) {
        return { opacity: '0.5' };
      }
      return {};
    };

    return (
      <>
        <div className="action-buttons" style={{ marginTop: '25px' }}>
          <button onClick={handleSave} disabled={!hasEditPermission}>
            <FontAwesomeIcon icon={faSave} fixedWidth />
            保存
          </button>
          <button onClick={handleDelete} disabled={!hasEditPermission}>
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
        </div>
      </>
    );
  };

  // Page setting
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <div className="relative_container">
        <div className="title_container">
          <div className="section_title">
            <FontAwesomeIcon className="faIcon" icon={faWallet} />
            経費
          </div>
          <div className="back_button" onClick={handleBackClick}>
            <FontAwesomeIcon className="faIcon back" icon={faArrowLeft} />
            戻る
          </div>
        </div>
      </div>

      <div className="management-container">
        <div className="list month-year-list">
          {monthYearList.map(monthYear => (
            <div
              key={monthYear}
              className={`list-item ${
                selectedMonthYear === monthYear ? 'selected' : ''
              }`}
              onClick={() => handleMonthYearClick(monthYear)}
            >
              {monthYear}
            </div>
          ))}
          {hasEditPermission && (
            <>
              <div className="list-item new-button" onClick={handleNewExpense}>
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  style={{ marginRight: '10px' }}
                />
                新規経費
              </div>
            </>
          )}
        </div>

        {selectedMonthYear && (
          <div className="list expenses-list">
            {groupExpensesByMonthYear(expenses)[selectedMonthYear] ? (
              groupExpensesByMonthYear(expenses)[selectedMonthYear].map(
                expense => (
                  <div
                    key={expense.id}
                    className={`list-item ${
                      selectedExpense && selectedExpense.id === expense.id
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() => handleSelectExpense(expense.id)}
                  >
                    {expense.name}
                  </div>
                ),
              )
            ) : (
              <></>
            )}
          </div>
        )}

        {selectedExpense && currentPage === 1 && (
          <>
            <div className="form-columns-container">
              <div className="form-column">
                <h3 className="form-header">費用概要</h3>
                <div className="form-group">
                  <label htmlFor="name">名称</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={selectedExpense.name}
                    onChange={handleInputChange}
                    disabled={!hasEditPermission}
                    placeholder="費用名称を入力して下さい"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cost">金額</label>
                  <div className="currency-input-group">
                    <span className="currency-label">¥</span>
                    <input
                      type="number"
                      id="cost"
                      name="cost"
                      value={selectedExpense.cost}
                      disabled={!hasEditPermission}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label
                    htmlFor="fullPayment"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <input
                      type="checkbox"
                      id="fullPayment"
                      name="fullPayment"
                      checked={selectedExpense.fullPayment}
                      onChange={handleFullPaymentChange}
                      disabled={!hasEditPermission}
                      style={{ marginRight: '8px' }}
                    />
                    全額支払い
                    <span
                      style={{
                        fontSize: '.75rem',
                        color: '#858585',
                        marginLeft: '5px',
                      }}
                    >
                      （全額支払済み）
                    </span>
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="paidAmount">支払額</label>
                  <div className="currency-input-group">
                    <span className="currency-label">¥</span>
                    <input
                      type="number"
                      id="paidAmount"
                      name="paidAmount"
                      value={selectedExpense.paidAmount}
                      onChange={handleInputChange}
                      disabled={
                        selectedExpense.fullPayment || !hasEditPermission
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="form-column">
                <h3 className="form-header">時間枠</h3>
                <div className="form-group">
                  <label htmlFor="incurredDate">発生日</label>
                  <DatePicker
                    id="incurredDate"
                    name="incurredDate"
                    selected={selectedExpense.incurredDate}
                    onChange={date =>
                      handleInputChange({
                        target: { name: 'incurredDate', value: date },
                      })
                    }
                    dateFormat="yyyy年MM月dd日"
                    locale="ja"
                    disabled={!hasEditPermission}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dueDate">期限日</label>
                  <DatePicker
                    id="dueDate"
                    name="dueDate"
                    selected={selectedExpense.dueDate}
                    onChange={date =>
                      handleInputChange({
                        target: { name: 'dueDate', value: date },
                      })
                    }
                    dateFormat="yyyy年MM月dd日"
                    locale="ja"
                    disabled={!hasEditPermission}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="settlementDate">完済日</label>
                  <DatePicker
                    id="settlementDate"
                    name="settlementDate"
                    selected={selectedExpense.settlementDate}
                    onChange={date =>
                      handleInputChange({
                        target: { name: 'settlementDate', value: date },
                      })
                    }
                    dateFormat="yyyy年MM月dd日"
                    locale="ja"
                    disabled={!hasEditPermission}
                  />
                </div>
              </div>

              <div className="form-column">
                <h3 className="form-header">経理情報</h3>
                <div className="form-group">
                  <label htmlFor="category">カテゴリ</label>
                  <select
                    id="category"
                    name="category"
                    value={selectedExpense.category}
                    onChange={handleInputChange}
                    disabled={!hasEditPermission}
                  >
                    {expenseCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="taxInformation">税情報</label>
                  <input
                    type="text"
                    id="taxInformation"
                    name="taxInformation"
                    value={selectedExpense.taxInformation}
                    onChange={handleInputChange}
                    disabled={!hasEditPermission}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="receipt">領収書・契約書</label>
                  <input
                    type="file"
                    id="receipt"
                    name="receipt"
                    value={selectedExpense.receipt}
                    onChange={handleInputChange}
                    disabled={!hasEditPermission}
                  />
                </div>

                {ActionButtons({
                  handleSave: saveExpense,
                  handleDelete: deleteExpense,
                  setCurrentPage: setCurrentPage,
                })}
              </div>
            </div>
          </>
        )}

        {selectedExpense && currentPage === 2 && (
          <>
            <div className="form-columns-container">
              <div className="form-column">
                <h3 className="form-header">承認プロセス</h3>
                <div className="form-group">
                  <label htmlFor="approver">承認者</label>
                  <select
                    id="approver"
                    name="approver"
                    value={selectedExpense.approver}
                    onChange={handleInputChange}
                    disabled={!hasEditPermission}
                  >
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  className="form-group"
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <label htmlFor="reimbursable">
                    <input
                      type="checkbox"
                      id="reimbursable"
                      name="reimbursable"
                      checked={selectedExpense.reimbursable}
                      onChange={handleInputChange}
                      disabled={!hasEditPermission}
                      style={{ marginRight: '8px' }}
                    />
                    返金対象
                    <span
                      style={{
                        fontSize: '.75rem',
                        color: '#858585',
                        marginLeft: '5px',
                      }}
                    >
                      （返金対象あり）
                    </span>
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="remarks">備考</label>
                  <textarea
                    id="remarks"
                    name="remarks"
                    value={selectedExpense.remarks}
                    disabled={!hasEditPermission}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                {ActionButtons({
                  handleSave: saveExpense,
                  handleDelete: deleteExpense,
                  setCurrentPage: setCurrentPage,
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default Expenses;
