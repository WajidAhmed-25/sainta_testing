/* さなだ　りし　*/
/* REGISTRATION COMPONENT (NEW) */
/*
    このコンポーネントは、サインタを利用いただくための新規登録
    画面を表示するためのコンポーネントです。ここで、ユーザーは
    新規登録を行うことができます。

    This component is a component to display the new
    registration component, made in lieu of the old
    one which includes GYOUMU, BOSHUU, and RABO reg.
*/

import { useState } from 'react';
import { ja } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import DatePicker, { registerLocale } from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

import 'react-datepicker/dist/react-datepicker.css';

import apiCalls from '../../api';
import { useNotification } from '../../hooks/useNotification';

export default function RegistrationNew() {
  const navigate = useNavigate();
  const { displayNotification } = useNotification();

  registerLocale('ja', ja); // registering local with the name you want

  // cool star with 必須
  // display on the same line as other spans
  const Required = () => (
    <span
      style={{
        color: 'red',
        fontSize: '0.8em',
        display: 'inline',
        marginLeft: '5px',
      }}
    >
      ※ 必須
    </span>
  );

  const Error = props => (
    <div className="error-span">
      <span
        style={{
          color: 'red',
          fontSize: '0.8em',
          display: 'block',
          marginLeft: '5px',
        }}
      >
        ※ {props.text}
      </span>
    </div>
  );

  const JidouSentaku = () => (
    <span
      style={{
        color: '#858585',
        fontSize: '0.8em',
        display: 'inline',
        marginLeft: '5px',
      }}
    >
      ※ 自動選択
    </span>
  );

  const JidouSakusei = () => (
    <span
      style={{
        color: '#858585',
        fontSize: '0.8em',
        display: 'inline',
        marginLeft: '5px',
      }}
    >
      ※ 自動生成
    </span>
  );

  const [subscriptionDuration, setSubscriptionDuration] = useState('Monthly'); // can be Monthly or Yearly
  const [registrationPart, setRegistrationPart] = useState('service'); // can be steps "service", "personal_info", "company_info", "project_info"
  const [selectedService, setSelectedService] = useState('Gyoumu'); // can be Gyoumu, BoshuuRecruiter, boshuu_jobseeker, Rabo
  const [passwordIsMatched, setPasswordIsMatched] = useState(false);
  const [userNameIsValid, setUserNameIsValid] = useState(false);
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [phoneIsValid, setPhoneIsValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Unique ID (either 4 digit or 6 digit, generated upon payment)
  const [uniqueID] = useState(Math.floor(100000 + Math.random() * 900000)); // This is for company, so gyoumu/boshuu_recruiter
  const [quoteID] = useState('RB1000'); // This is for rabo (RB-XXXX)
  const [employeeID] = useState(
    Math.floor(Math.random() * (999 - 100 + 1) + 100),
  ); // Default employee ID (needs to be integer) - used for SAINTA gyoumu to identify employees

  // Now, we make the individual states for all information needed for registration
  const [registrationInformation, setRegistrationInformation] = useState({
    // Service Selection
    service: selectedService,
    subscriptionDuration: subscriptionDuration,
    // Personal Information
    name: '',
    furigana: '',
    email: '',

    // Personal Info Pt2
    sex: 'Male',
    birthdate: new Date(),
    phoneNumber: '',

    // Account Information
    username: '',
    password: '',
    confirmPassword: '',

    // Company Information
    companyName: '',
    companyAddress: '',
    companyWebsite: '',

    // Project Information
    projectName: '',
    projectDescription: '',
    projectEstimatedDuration: '',
  });

  // Now, we have the handleInputChange function to handle the input changes
  const handleInputChange = e => {
    const { name, value } = e.target;
    setRegistrationInformation({
      ...registrationInformation,
      [name]: value,
    });
  };

  const params = new URLSearchParams();
  params.append('email', registrationInformation?.email);
  params.append('username', registrationInformation?.username);
  params.append('password', registrationInformation?.password);
  params.append('phone', registrationInformation?.phoneNumber);
  params.append('fullName', registrationInformation?.name);
  params.append('furigana', registrationInformation?.furigana);
  params.append('gender', registrationInformation?.sex);
  params.append('businessId', uniqueID);
  params.append('employeeId', employeeID);
  params.append('companyName', registrationInformation?.companyName);
  params.append('location', registrationInformation?.companyAddress);
  params.append('website', registrationInformation?.companyWebsite);
  params.append('service', registrationInformation?.service);
  params.append(
    'contractPeriod',
    registrationInformation?.subscriptionDuration,
  );
  params.append(
    'dob',
    new Date(registrationInformation?.birthdate).toISOString(),
  );

  // Registration Button
  const toorokuButton = () => {
    const handleRegister = async () => {
      const {
        email,
        username,
        password,
        phoneNumber,
        birthdate,
        name,
        furigana,
        sex,
        companyName,
        companyAddress,
        service,
        subscriptionDuration,
      } = registrationInformation;

      if (
        !email ||
        !username ||
        !password ||
        !phoneNumber ||
        !birthdate ||
        !name ||
        !furigana ||
        !sex ||
        !companyName ||
        !companyAddress ||
        !service ||
        !subscriptionDuration
      ) {
        displayNotification({
          message: '全ての情報を入力してください。',
          type: 'error',
        });
        return;
      }

      try {
        setLoading(true);
        const res = await apiCalls.signUp(params);
        if (res) {
          if (res.status === 200 && res.data.success === 1) {
            displayNotification({
              message: res?.data?.message,
              type: 'success',
            });
            setTimeout(() => {
              setLoading(false);
              navigate('/payment');
            }, 1000);
          } else if (res.status === 400 && res.data.success === 0) {
            console.log(res);
            setLoading(false);
            displayNotification({
              message: res?.data?.message,
              type: 'error',
            });
          } else if (res.status === 500 && res.data.success === 0) {
            console.log(res);
            setLoading(false);
            displayNotification({
              message: res?.data?.message,
              type: 'error',
            });
          }
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
        if (err.message === 'Network Error') {
          displayNotification({
            message: 'ネットワークエラーが発生しました。',
            type: 'error',
          });
        } else {
          displayNotification({
            message: err?.response?.data?.message,
            type: 'error',
          });
        }
      }
    };

    return (
      <>
        <div className="action-buttons page" style={{ marginTop: '15px' }}>
          {/* <button onClick={handleRegister}>
            <FontAwesomeIcon
              icon={faCircleCheck}
              style={{ marginRight: '5px' }}
              fixedWidth
            />
            登録終了
          </button> */}

          <LoadingButton
            size="small"
            className="loading-register"
            loading={loading}
            loadingPosition="start"
            onClick={handleRegister}
            startIcon={
              <FontAwesomeIcon
                icon={faCircleCheck}
                style={{ width: '14px', color: 'black' }}
                fixedWidth
              />
            }
          >
            <span style={{ color: 'black' }}>登録終了</span>
          </LoadingButton>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="management-container">
        <div className="list registration-list">
          <div
            className={`list-item ${
              registrationPart === 'service' ? 'selected' : ''
            }`}
            onClick={() => setRegistrationPart('service')}
          >
            サービス選択
          </div>
          <div
            className={`list-item ${
              registrationPart === 'personal_info' ? 'selected' : ''
            }`}
            onClick={() => setRegistrationPart('personal_info')}
          >
            個人情報
          </div>

          {/* If the user chooses ERP or Recruitment (for signing up their company) */}
          {selectedService === 'Gyoumu' && (
            <div
              className={`list-item ${
                registrationPart === 'company_info' ? 'selected' : ''
              }`}
              onClick={() => setRegistrationPart('company_info')}
            >
              会社情報
            </div>
          )}
          {selectedService === 'BoshuuRecruiter' && (
            <div
              className={`list-item ${
                registrationPart === 'company_info' ? 'selected' : ''
              }`}
              onClick={() => setRegistrationPart('company_info')}
            >
              会社情報
            </div>
          )}
          {/* If the user chose Sainta LAB */}
          {selectedService === 'Rabo' && (
            <div
              className={`list-item ${
                registrationPart === 'project_info' ? 'selected' : ''
              }`}
              onClick={() => setRegistrationPart('project_info')}
            >
              タスク情報
            </div>
          )}
          {/* General Confirmation & Username */}
          <div
            className={`list-item ${
              registrationPart === 'confirm' ? 'selected' : ''
            }`}
            onClick={() => setRegistrationPart('confirm')}
          >
            最終確認
          </div>
        </div>

        {/* Now we have the service selection view */}
        {registrationPart === 'service' && (
          <>
            <div className="form-columns-container">
              <div className="form-column">
                <h3 className="form-header">サービス選択</h3>
                <div className="form-group">
                  <label>
                    サービス選択 <JidouSentaku />
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={selectedService}
                    onChange={e => setSelectedService(e.target.value)}
                    disabled
                  >
                    <option value="Gyoumu">サインタ・業務</option>
                    <option value="BoshuuRecruiter">
                      サインタ・募集（企業）
                    </option>
                    <option value="BoshuuJobseeker">
                      サインタ・募集（求職者）
                    </option>
                    <option value="Rabo">サインタ・ラボ</option>
                  </select>
                </div>

                {/* Now the duration (monthly or yearly sub) */}
                <div className="form-group">
                  <label>契約期間</label>
                  <select
                    id="subscriptionDuration"
                    name="subscriptionDuration"
                    value={subscriptionDuration}
                    onChange={e => setSubscriptionDuration(e.target.value)}
                  >
                    <option value="Monthly">月額</option>
                    <option value="Yearly">年額</option>
                  </select>
                </div>

                {/* Now, just a span with a star to indicate information */}
                {/* Make the max-width of the span div container 230px */}
                <div className="span-container-info">
                  <span className="info-span">
                    ※
                    登録が完了するまで、このタブを閉じないでください。この情報には再度アクセスする
                    ことができません。万が一閉じてしまった場合は、サポートに連絡してください。
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* /* Now we have the personal information view */}
        {registrationPart === 'personal_info' && (
          <>
            <div className="form-columns-container">
              <div className="form-column">
                <h3 className="form-header">個人情報</h3>
                <div className="form-group">
                  <label htmlFor="name">
                    氏名 <Required />
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={registrationInformation.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="furigana">
                    フリガナ <Required />
                  </label>
                  <input
                    id="furigana"
                    name="furigana"
                    type="text"
                    value={registrationInformation.furigana}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    メールアドレス <Required />
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={registrationInformation.email}
                    onChange={handleInputChange}
                    onKeyUp={e => {
                      setEmailIsValid(
                        !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(
                          e.target.value,
                        ),
                      );
                    }}
                    required
                  />
                  {emailIsValid && (
                    <Error text="有効なメールアドレスを入力してください。" />
                  )}
                </div>
              </div>

              <div className="form-column">
                <h3 className="form-header">他の情報</h3>
                <div className="form-group">
                  <label htmlFor="sex">性別</label>
                  <select
                    id="sex"
                    name="sex"
                    value={registrationInformation.sex}
                    onChange={handleInputChange}
                  >
                    <option value="Male">男性</option>
                    <option value="Female">女性</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="birthdate">生年月日</label>
                  <DatePicker
                    id="birthdate"
                    name="birthdate"
                    selected={registrationInformation.birthdate}
                    onChange={date =>
                      handleInputChange({
                        target: {
                          name: 'birthdate',
                          value: date,
                        },
                      })
                    }
                    dateFormat="yyyy年MM月dd日"
                    locale="ja"
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">電話番号</label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    value={registrationInformation.phoneNumber}
                    onChange={handleInputChange}
                    onKeyUp={e => {
                      setPhoneIsValid(
                        !/^(\d{3})[- ]?(\d{3})[- ]?(\d{4})$/.test(
                          e.target.value,
                        ),
                      );
                    }}
                  />
                  {phoneIsValid && (
                    <Error text="有効な電話番号を入力してください。" />
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Now we have the company information view */}
        {registrationPart === 'company_info' && (
          <>
            <div className="form-columns-container">
              <div className="form-column">
                <h3 className="form-header">会社情報</h3>
                <div className="form-group">
                  <label htmlFor="companyName">
                    会社名 <Required />
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={registrationInformation.companyName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="companyAddress">
                    住所 <Required />
                  </label>
                  <input
                    id="companyAddress"
                    name="companyAddress"
                    type="text"
                    value={registrationInformation.companyAddress}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="companyWebsite">ウェブサイト</label>
                  <input
                    id="companyWebsite"
                    name="companyWebsite"
                    type="text"
                    value={registrationInformation.companyWebsite}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Now we have the project information view */}
        {registrationPart === 'project_info' && (
          <>
            <div className="form-columns-container">
              <div className="form-column">
                <h3 className="form-header">タスク情報</h3>
                <div className="form-group">
                  {/* This is where the SAINTA LAB project ID is generated */}
                  <label htmlFor="projectName">
                    タスク ID <JidouSakusei />
                  </label>
                  <input
                    id="projectID"
                    name="projectID"
                    type="text"
                    value={registrationInformation.projectID}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="projectName">
                    タイトル <Required />
                  </label>
                  <input
                    id="projectName"
                    name="projectName"
                    type="text"
                    value={registrationInformation.projectName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="projectEstimatedDuration">
                    見積もり期間 <Required />
                  </label>
                  <input
                    id="projectEstimatedDuration"
                    name="projectEstimatedDuration"
                    type="text"
                    value={registrationInformation.projectEstimatedDuration}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-column">
                <h3 className="form-header">その他の情報</h3>
                <div className="form-group">
                  <label htmlFor="projectDescription">
                    説明 <Required />
                  </label>
                  <textarea
                    style={{ height: '120px' }}
                    id="projectDescription"
                    name="projectDescription"
                    value={registrationInformation.projectDescription}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="span-container-info">
                  <span className="info-span">
                    ※ タスク IDは、自動的に生成されます。ログインするために、
                    このIDを覚えておいてください。
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Now we have the confirmation view */}
        {registrationPart === 'confirm' && (
          <>
            <div className="form-columns-container">
              <div className="form-column">
                <h3 className="form-header">ログイン情報</h3>
                <div className="form-group">
                  <label htmlFor="username">
                    ユーザー名 <Required />
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={registrationInformation.username}
                    onChange={handleInputChange}
                    onKeyUp={e => {
                      setUserNameIsValid(!/^[a-z]{5,}$/.test(e.target.value));
                    }}
                  />
                  {userNameIsValid && (
                    <Error text="有効なユーザー名を入力してください。スペースは使用せず、4文字以上で設定してください。" />
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="password">
                    パスワード <Required />
                    <FontAwesomeIcon
                      icon={faEye}
                      style={{
                        marginLeft: '10px',
                        cursor: 'pointer',
                        fontSize: '0.8em',
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </label>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={registrationInformation.password}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    パスワード確認 <Required />
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={registrationInformation.confirmPassword}
                    onChange={handleInputChange}
                    onKeyUp={e => {
                      setPasswordIsMatched(
                        registrationInformation?.password !== e.target.value,
                      );
                    }}
                  />
                  {passwordIsMatched && (
                    <Error text="パスワードが一致しません。" />
                  )}
                </div>
              </div>

              <div className="form-column">
                {/* Either shows company ID or Rabo ID etc */}
                <h3 className="form-header">その他の情報</h3>
                {selectedService === 'Gyoumu' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="uniqueID">
                        会社 ID <JidouSakusei />
                      </label>
                      <input
                        id="uniqueID"
                        name="uniqueID"
                        type="text"
                        value={uniqueID}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="employeeID">
                        従業員 ID <Required />
                      </label>
                      <input
                        id="employeeID"
                        name="employeeID"
                        type="text"
                        value={employeeID}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="span-container-info">
                      <span className="info-span">
                        ※ 会社 IDは、自動的に生成されます。ログインするために、
                        このIDを覚えておいてください。
                      </span>
                    </div>

                    {/* regi button */}
                    {toorokuButton()}
                  </>
                )}

                {selectedService === 'BoshuuRecruiter' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="uniqueID">
                        会社 ID <JidouSakusei />
                      </label>
                      <input
                        id="uniqueID"
                        name="uniqueID"
                        type="text"
                        value={uniqueID}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>

                    <div className="span-container-info">
                      <span className="info-span">
                        ※ 会社 IDは、自動的に生成されます。ログインするために、
                        このIDを覚えておいてください。
                      </span>
                    </div>

                    {/* regi button */}
                    {toorokuButton()}
                  </>
                )}

                {selectedService === 'Rabo' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="quoteID">
                        見積もり ID <JidouSakusei />
                      </label>
                      <input
                        id="quoteID"
                        name="quoteID"
                        type="text"
                        value={quoteID}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>

                    <div className="span-container-info">
                      <span className="info-span">
                        ※ 見積もり
                        IDは、自動的に生成されます。ログインするために、
                        このIDを覚えておいてください。
                      </span>
                    </div>

                    {/* regi button */}
                    {toorokuButton()}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
