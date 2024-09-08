import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

import '../../App.css';
import '../../assets/css/InterfaceM.css';

// This is used to ensure companies have unique IDs
const generateRandomID = () => {
  return Math.floor(Math.random() * 900000) + 100000; // generates a random 6 digit ID between 100000 and 999999
};

export default function Registration({
  businessSettings,
  setBusinessSettings,
  users,
  setUsers,
  currentUser,
  setCurrentUser,
  employees,
  setEmployees,
  departments,
  setCurrentBusiness,
}) {
  const navigate = useNavigate();
  const [selectedPart, setSelectedPart] = useState(null);
  const [generatedID] = useState(generateRandomID()); // Generated upon navigating to the page

  // Business to create (which will later be registered) -> USE data from stripe, etc
  const [businessToCreate, setBusinessToCreate] = useState({
    businessID: generatedID,
    name: '',
    plan: 'コ', // 'ko, ki, ka'
    registrationDate: new Date(),
    billingCycle: '年', // '月', '年'
    registrationEnd: new Date() + 1, // say year term
    address: '',
    firstUsage: true,
    userList: [],
  });

  const handleInputChange = e => {
    const { name, value, type } = e.target;
    let newValue;

    switch (type) {
      case 'number':
        newValue = value === '' ? '' : parseFloat(value);
        break;
      case 'checkbox':
        newValue = e.target.checked;
        break;
      // Add more cases as needed for different types
      case 'text':
      case 'textarea':
      case 'select-one': // for <select> without multiple attribute
      case 'select-multiple': // for <select> with multiple attribute
      default:
        newValue = value;
        break;
    }

    setBusinessToCreate({
      ...businessToCreate,
      [name]: newValue,
    });
  };

  const handleInputChange_UserInfo = e => {
    const { name, value, type } = e.target;
    let newValue;

    switch (type) {
      case 'number':
        newValue = value === '' ? '' : parseFloat(value);
        break;
      case 'checkbox':
        newValue = e.target.checked;
        break;
      // Add more cases as needed for different types
      case 'text':
      case 'textarea':
      case 'select-one': // for <select> without multiple attribute
      case 'select-multiple': // for <select> with multiple attribute
      default:
        newValue = value;
        break;
    }

    setInputInformation({
      ...inputInformation,
      [name]: newValue,
    });
  };

  const [inputInformation, setInputInformation] = useState({
    id: '',
    fullName: '',
    furigana: '',
    department: '',
    username: '',
    password: '',
  });

  const handleRegister = () => {
    // Now will register the user (add him/her to employees) and the user list.
    // It will register the business and navigate to Interface, setting the currentUser to the user.
    // It will also set the businessSettings to the businessSettings.
    // It will also set the employees to the employees.
    const companyID = generatedID;

    // Use the businessToCreate to create a newBusinessSettings entry, push to businessSettings
    const newBusinessSettings = {
      businessID: companyID,
      name: businessToCreate.name,
      plan: businessToCreate.plan,
      registrationDate: businessToCreate.registrationDate,
      billingCycle: businessToCreate.billingCycle,
      registrationEnd: businessToCreate.registrationEnd,
      address: businessToCreate.address,
      firstUsage: true,
      userList: [],
    };

    // First, check if all the information is not '' and not null. Loop through inputInformation
    let allFilled = true;
    Object.keys(inputInformation).forEach(key => {
      if (!inputInformation[key]) {
        allFilled = false;
      }
    });

    if (!allFilled) {
      alert('全ての情報を入力してください。');
      return;
    }

    // Now, add the newBusinessSettings to the businessSettings list
    setBusinessSettings([...businessSettings, newBusinessSettings]);
    // Set current business to the ID of the newBusinessSettings
    setCurrentBusiness(companyID);

    // Now, create a new Employee with the information from inputInformation
    const newEmployee = {
      id: inputInformation.id,
      fullName: inputInformation.fullName,
      furigana: inputInformation.furigana,
      department: inputInformation.department,
      username: inputInformation.username,
      password: inputInformation.password,
    };

    // Now, add the newEmployee to the employees list
    setEmployees([...employees, newEmployee]);

    // Now, create a new User with the information from inputInformation
    const newUser = {
      id: inputInformation.id,
      fullName: inputInformation.fullName,
      username: inputInformation.username,
      password: inputInformation.password,
      permissions: 'admin',
      firstLogin: true,
      selectedItem: {
        menu: null,
        selected_id: null,
      },
    };

    // Now, add the newUser to the users list (push to users) and setCurrentUser to the newUser
    setUsers([...users, newUser]);
    // Set current user to the array[] element where new user is (since currentUser is users[something])
    setCurrentUser(newUser);

    // Now, navigate to Interface after 1.2s
    setTimeout(() => {
      navigate('/interface');
    }, 1500);
  };

  const ActionButtons = () => {
    return (
      <>
        <div className="action-buttons page" style={{ marginTop: '15px' }}>
          <button onClick={handleRegister}>
            <FontAwesomeIcon
              icon={faCircleCheck}
              style={{ marginRight: '5px' }}
              fixedWidth
            />
            登録終了
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="relative_container">
        <div className="title_container">
          <div className="section_title">
            <FontAwesomeIcon className="faIcon" icon={faIdCard} />
            登録
          </div>
        </div>
      </div>

      <div className="management-container">
        <div className="list settings-list">
          <div
            key="businessSettings"
            className={`list-item ${
              selectedPart === 'businessSettings' ? 'selected' : ''
            }`}
            onClick={() => setSelectedPart('businessSettings')}
          >
            会社情報
          </div>
          <div
            key="selfinfo"
            className={`list-item ${
              selectedPart === 'selfinfo' ? 'selected' : ''
            }`}
            onClick={() => setSelectedPart('selfinfo')}
          >
            自分の情報
          </div>
          <div
            key="confirmation"
            className={`list-item ${
              selectedPart === 'confirmation' ? 'selected' : ''
            }`}
            onClick={() => setSelectedPart('confirmation')}
          >
            確認
          </div>
        </div>

        {selectedPart === 'businessSettings' && (
          <div className="form-columns-container">
            <div className="form-column">
              <h3 className="form-header">会社情報</h3>

              <div className="form-group">
                <label htmlFor="id">サインタID</label>
                <input
                  style={{ color: '#858585' }}
                  type="text"
                  id="id"
                  name="id"
                  value={generatedID}
                  onChange={handleInputChange}
                  className="form-control"
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">会社名</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={businessToCreate.name}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">住所</label>
                <textarea
                  id="address"
                  name="address"
                  value={businessToCreate.address}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>

            {/* Now registration information (plan year/month bill, etc) */}
            <div className="form-column">
              <h3 className="form-header">登録情報</h3>

              <div className="form-group">
                <label htmlFor="plan">選んだプラン</label>
                <input
                  style={{ color: '#858585' }}
                  type="text"
                  id="plan"
                  name="plan"
                  value={businessToCreate.plan}
                  onChange={handleInputChange}
                  className="form-control"
                  readOnly
                />
              </div>

              <div className="form-group">
                <label htmlFor="billingCycle">請求周期</label>
                <input
                  style={{ color: '#858585' }}
                  type="text"
                  id="billingCycle"
                  name="billingCycle"
                  value={businessToCreate.billingCycle}
                  onChange={handleInputChange}
                  className="form-control"
                  readOnly
                />
              </div>
            </div>

            <div className="form-column">
              <h3 className="form-header">登録期間</h3>

              <div className="form-group">
                <label htmlFor="registrationStart">登録開始</label>
                <input
                  style={{ color: '#858585' }}
                  type="text"
                  id="registrationStart"
                  name="registrationStart"
                  value={format(
                    businessToCreate.registrationDate,
                    'yyyy年MM月dd日',
                    { locale: ja },
                  )}
                  onChange={handleInputChange}
                  className="form-control"
                  readOnly
                />
              </div>

              <div className="form-group">
                <label htmlFor="registrationEnd">登録終了</label>
                <input
                  style={{ color: '#858585' }}
                  type="text"
                  id="registrationEnd"
                  name="registrationEnd"
                  value={format(
                    businessToCreate.registrationEnd,
                    'yyyy年MM月dd日',
                    { locale: ja },
                  )}
                  onChange={handleInputChange}
                  className="form-control"
                  readOnly
                />
              </div>
            </div>
          </div>
        )}

        {selectedPart === 'selfinfo' && (
          <div className="form-columns-container">
            <div className="form-column">
              <h3 className="form-header">自分の情報</h3>

              <div className="form-group">
                <label htmlFor="id">
                  従業員ID{' '}
                  <span
                    style={{
                      fontSize: '.75rem',
                      color: '#858585',
                      marginLeft: '5px',
                    }}
                  >
                    (数字のみ)
                  </span>
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={inputInformation.id}
                  onChange={handleInputChange_UserInfo}
                  className="form-control"
                />
              </div>

              {/* Username */}
              <div className="form-group">
                <label htmlFor="fullName">
                  ユーザー名{' '}
                  <span
                    style={{
                      fontSize: '.75rem',
                      color: '#858585',
                      marginLeft: '5px',
                    }}
                  >
                    (最大長12字)
                  </span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={inputInformation.username}
                  onChange={handleInputChange_UserInfo}
                  className="form-control"
                  maxLength="12"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  パスワード{' '}
                  <span
                    style={{
                      fontSize: '.75rem',
                      color: '#858585',
                      marginLeft: '5px',
                    }}
                  >
                    (最大長20字)
                  </span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={inputInformation.password}
                  onChange={handleInputChange_UserInfo}
                  className="form-control"
                  maxLength="20"
                />
              </div>
            </div>

            {/* Now fullName, Furigana, Department */}
            <div className="form-column">
              <h3 className="form-header">個人情報</h3>

              <div className="form-group">
                <label htmlFor="fullName">氏名</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={inputInformation.fullName}
                  onChange={handleInputChange_UserInfo}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="furigana">フリガナ</label>
                <input
                  type="text"
                  id="furigana"
                  name="furigana"
                  value={inputInformation.furigana}
                  onChange={handleInputChange_UserInfo}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="department">部署</label>
                <select
                  id="department"
                  name="department"
                  value={inputInformation.department}
                  onChange={handleInputChange_UserInfo}
                  className="form-control"
                >
                  <option value="">選択して下さい</option>
                  {departments.map(department => (
                    <option key={department.id} value={department.name}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {selectedPart === 'confirmation' && (
          <>
            <div className="form-columns-container">
              <div className="form-column">
                <h3 className="form-header">会社情報</h3>

                <div className="form-group">
                  <label htmlFor="id">サインタID</label>
                  <input
                    style={{ color: '#858585' }}
                    type="text"
                    id="id"
                    name="id"
                    value={generatedID}
                    onChange={handleInputChange}
                    className="form-control"
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="name">会社名</label>
                  <input
                    style={{ color: '#858585' }}
                    type="text"
                    id="name"
                    name="name"
                    value={businessToCreate.name}
                    onChange={handleInputChange}
                    className="form-control"
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">住所</label>
                  <textarea
                    style={{ color: '#858585' }}
                    id="address"
                    name="address"
                    value={businessToCreate.address}
                    onChange={handleInputChange}
                    className="form-control"
                    readOnly
                  />
                </div>
              </div>

              <div className="form-column">
                <h3 className="form-header">自分の情報</h3>

                <div className="form-group">
                  <label htmlFor="id">従業員ID</label>
                  <input
                    style={{ color: '#858585' }}
                    type="text"
                    id="id"
                    name="id"
                    value={inputInformation.id}
                    onChange={handleInputChange_UserInfo}
                    className="form-control"
                    readOnly
                  />
                </div>

                {/* Username */}
                <div className="form-group">
                  <label htmlFor="fullName">ユーザー名</label>
                  <input
                    style={{ color: '#858585' }}
                    type="text"
                    id="username"
                    name="username"
                    value={inputInformation.username}
                    onChange={handleInputChange_UserInfo}
                    className="form-control"
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">パスワード</label>
                  <input
                    style={{ color: '#858585' }}
                    id="password"
                    name="password"
                    value={inputInformation.password}
                    onChange={handleInputChange_UserInfo}
                    className="form-control"
                    readOnly
                  />
                </div>
              </div>

              <div className="form-column">
                <h3 className="form-header">個人情報</h3>

                <div className="form-group">
                  <label htmlFor="fullName">氏名</label>
                  <input
                    style={{ color: '#858585' }}
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={inputInformation.fullName}
                    onChange={handleInputChange_UserInfo}
                    className="form-control"
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="furigana">フリガナ</label>
                  <input
                    style={{ color: '#858585' }}
                    type="text"
                    id="furigana"
                    name="furigana"
                    value={inputInformation.furigana}
                    onChange={handleInputChange_UserInfo}
                    className="form-control"
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="department">部署</label>
                  <input
                    style={{ color: '#858585' }}
                    id="department"
                    name="department"
                    value={inputInformation.department}
                    onChange={handleInputChange_UserInfo}
                    className="form-control"
                    readOnly
                  ></input>
                </div>

                {/* span with grey style informing user all the details can be changed later */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    marginTop: '15px',
                    marginBottom: '20px',
                    maxWidth: '230px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '.75rem',
                      color: '#858585',
                      marginLeft: '5px',
                      marginBottom: '7.5px',
                    }}
                  >
                    ※
                    サインタIDを忘れないようにして下さい。ログインする時に必要です。
                  </span>

                  <span
                    style={{
                      fontSize: '.75rem',
                      color: '#858585',
                      marginLeft: '5px',
                    }}
                  >
                    ※ 後で設定を変更できます。
                  </span>
                </div>
                {ActionButtons()}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
