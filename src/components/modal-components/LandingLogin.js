/* さなだ　りし　*/
/* LANDING LOGIN COMPONENT */
/*
    このコンポーネントは、ログイン画面を表示するためのコンポーネントです。
    ログイン画面は、モーダルとして表示されます。ここから、ログインフォーム
    に入力し、ログインボタンを押すことで、ログイン処理が行われます。

    This component is a component to display the login screen.
    The login screen is displayed as a modal. From here, enter
    the login form and press the login button to log in.
*/

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

import apiCalls from '../../api';
import storage from '../../auth/storage';
import { useNotification } from '../../hooks/useNotification';
import { getURLSearchParams } from '../../utils/getURLSearchParams';

const LandingLogin = ({ setIsLoginModalVisible }) => {
  const navigate = useNavigate();
  const { displayNotification } = useNotification();

  // The state that tracks the visibility of the modal
  const [isModalVisible, setIsModalVisible] = useState(true);

  // The state for the OTP that is triggered after login
  const [isOTPVisible, setIsOTPVisible] = useState(false);

  // The state for forgot password that is shown if the user forgets
  const [isFPVisible, setIsFPVisible] = useState(false);

  // The state for the OTP being incorrect
  const [otp, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [otp_verified, setOtp_verified] = useState('No'); // Yes/No
  const [isOTPIncorrect, setIsOTPIncorrect] = useState(false);

  // The default state that tracks the login information
  // Feel free to change or modify it to track additional
  // information.
  const [loginInfo, setLoginInfo] = useState({
    businessID: '',
    programType: 'gyoumu', // Can either be gyoumu (for sainta gyoumu - erp)
    // boshuu_p (boshuu poster)
    // boshuu_u (boshuu user/job seeker)
    // rabo (lab - for sainta lab)
    username: '',
    password: '',
  });

  // Handling the password forget if it is sent
  const [resetSent, setResetSent] = useState(false);

  // Handling the mail-address for the password forget
  const [mailAddress, setMailAddress] = useState('');

  // Just to display an error message if the login information is incorrect
  const [incorrectInfo, setIncorrectInfo] = useState('none'); // Can also be mail
  const [businessIdIsValid, setBusinessIdIsValid] = useState(false);
  const [passwordIsValid, setPasswordIsValid] = useState(false);

  // Login handler
  const handleLogin = async () => {
    const { businessID, username, password } = loginInfo;
    if (businessID === '' || username === '' || password === '') {
      // setIncorrectInfo('bid');
      // setIncorrectInfo('userpass');

      setIncorrectInfo('emptyfields');
      setBusinessIdIsValid(false);
      setPasswordIsValid(false);
      return;
    }
    // If all data provided
    setIncorrectInfo('none');
    const params = await getURLSearchParams({
      username,
      password,
      businessId: businessID,
      otp_verified,
      otp,
    });

    try {
      setLoading(true);
      const res = await apiCalls.login(params);
      if (res) {
        if (res.status === 200 && res.data.success === 1) {
          setIsOTPVisible(true);
          setLoading(false);
          displayNotification({
            message: res?.data?.message,
            type: 'success',
          });
        } else if (res.status === 201 && res.data.success === 1) {
          const { token } = res.data?.data;
          storage.set('sainta-auth-token', token);

          setTimeout(() => {
            setLoading(false);
            navigate('/interface');
          }, 500);

          displayNotification({
            message: res.data.message,
            type: 'success',
          });
        } else if (res.status === 400 && res.data.success === 0) {
          setLoading(false);
          displayNotification({
            message: res?.data?.message,
            type: 'error',
          });
        } else if (res.status === 500 && res.data.success === 0) {
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
          message: 'Network Error',
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

  // Handle OTP function
  const handleOTP = () => {
    if (!otp) {
      setIsOTPIncorrect(true);
      return;
    }
    setIsOTPIncorrect(false);

    setLoading(true);
    handleLogin(); // calling Login function
  };

  // Handle Password Forgot function
  const handleFP = () => {
    // Fix this function to actually handle the password forgot
    // via email or some other method
    if (mailAddress === '' || !mailAddress.includes('@')) {
      setIncorrectInfo('mail');
      return;
    } else {
      setIncorrectInfo('none');
    }
    console.log('Forgot Password');
    // TODO...

    setResetSent(true); // Set this to true if the reset is sent
  };

  const Error = props => (
    <span
      style={{
        color: 'red',
        fontSize: '0.8em',
        display: 'inline',
        marginLeft: '5px',
      }}
    >
      {props.text}
    </span>
  );

  return (
    <>
      {isModalVisible && isFPVisible && resetSent && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <button
                className="close-button"
                onClick={() => {
                  setIsFPVisible(false);
                  setIsLoginModalVisible(false);
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <h1 className="modal-body-header">
                <FontAwesomeIcon
                  icon={faRightToBracket}
                  style={{ marginRight: '15px' }}
                />
                メールに送信済み
              </h1>
              <p className="modal-body-text">
                このメールアドレスに紐付くアカウントが存在する場合、パスワードリセットの手順をメールでお送りしました。リンクは24時間で期限切れとなりますので、指示に従ってパスワードをリセットしてください。
              </p>

              <div className="modal-input-container">
                <button
                  className="modal-navigation-button"
                  onClick={() => setResetSent(false)}
                >
                  承知
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isModalVisible && isFPVisible && !resetSent && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <button
                className="close-button"
                onClick={() => {
                  setIsFPVisible(false);
                  setIsLoginModalVisible(false);
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <h1 className="modal-body-header">
                <FontAwesomeIcon
                  icon={faRightToBracket}
                  style={{ marginRight: '15px' }}
                />
                パスワードのリセット
              </h1>
              <p className="modal-body-text">
                パスワードをリセットするために、あなたのメールアドレスを入力してください。
              </p>
              <div className="modal-input-container">
                <label className="modal-input-label">メールアドレス</label>
                <input
                  className="modal-input"
                  type="text"
                  onChange={e => setMailAddress(e.target.value)}
                />

                {incorrectInfo !== 'none' && (
                  <>
                    <div
                      className="modal-input-label-tiny"
                      style={{
                        color: 'red',
                        marginTop: '10px',
                        marginBottom: '10px',
                      }}
                    >
                      {incorrectInfo === 'mail' &&
                        '※ メールアドレスを入力してください。'}
                    </div>
                  </>
                )}
                <button
                  className="modal-navigation-button"
                  onClick={() => handleFP()}
                >
                  送信
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isModalVisible && !isOTPVisible && !isFPVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <button
                className="close-button"
                onClick={() => {
                  setIsModalVisible(false);
                  setIsLoginModalVisible(false);
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <h1 className="modal-body-header">
                <FontAwesomeIcon
                  icon={faRightToBracket}
                  style={{ marginRight: '15px' }}
                />
                ログイン
              </h1>
              <p className="modal-body-text">
                あなたのログイン情報を入力してください。
              </p>
              {/* a bunch of input fields with labels above them that have KAISHA ID, username, password */
              /* also have fields for renewing plan */}
              <div className="modal-input-container">
                {/* Choose the service, GYOUMU, BOSHUU, OR LAB */}
                <label className="modal-input-label">
                  サービスを選択してください
                </label>
                <select
                  className="modal-input"
                  onChange={e =>
                    setLoginInfo({
                      ...loginInfo,
                      programType: e.target.value,
                    })
                  }
                  disabled
                >
                  <option value="gyoumu">サインタ・業務</option>
                  <option value="boshuu_p">サインタ・募集 （企業）</option>
                  <option value="boshuu_u">サインタ・募集 （聖職者）</option>
                  <option value="rabo">サインタ・ラボ</option>
                </select>

                {/* businessID IF part of sainta-gyoumu */}
                {loginInfo.programType === 'gyoumu' && (
                  <>
                    <label className="modal-input-label">
                      会社の業務 ID{' '}
                      <span
                        style={{
                          fontSize: '.75rem',
                          color: '#858585',
                          marginLeft: '5px',
                        }}
                      >
                        {' '}
                        (6桁番号)
                      </span>
                    </label>
                    <input
                      className="modal-input"
                      type="number"
                      onChange={e =>
                        setLoginInfo({
                          ...loginInfo,
                          businessID: e.target.value,
                        })
                      }
                      onKeyUp={e => {
                        setBusinessIdIsValid(
                          loginInfo?.businessID?.toString().length < 6,
                        );
                      }}
                    />
                  </>
                )}

                {/* businessID IF part of sainta-boshuu */}
                {loginInfo.programType === 'boshuu_p' && (
                  <>
                    <label className="modal-input-label">
                      会社の募集 ID{' '}
                      <span
                        style={{
                          fontSize: '.75rem',
                          color: '#858585',
                          marginLeft: '5px',
                        }}
                      >
                        {' '}
                        (4/6桁番号) (業務ユーザーであれば、同じ6桁番号)
                      </span>
                    </label>
                    <input
                      className="modal-input"
                      type="text"
                      onChange={e =>
                        setLoginInfo({
                          ...loginInfo,
                          businessID: e.target.value,
                        })
                      }
                    />
                  </>
                )}

                <label className="modal-input-label">ユーザー名</label>
                <input
                  className="modal-input"
                  type="text"
                  onChange={e =>
                    setLoginInfo({ ...loginInfo, username: e.target.value })
                  }
                />

                <label className="modal-input-label">パスワード</label>
                <input
                  className="modal-input"
                  type="password"
                  onChange={e =>
                    setLoginInfo({ ...loginInfo, password: e.target.value })
                  }
                  onKeyUp={e => {
                    setPasswordIsValid(loginInfo?.password?.length < 6);
                  }}
                />

                {/* ALL THE LOGIN-MODAL ERROR MESSAGES */}
                <div
                  className="modal-input-label-tiny"
                  style={{
                    color: 'red',
                    marginTop: '10px',
                    marginBottom: '10px',
                  }}
                >
                  {businessIdIsValid && (
                    <Error text="※ 6桁のビジネスIDを入力してください。" />
                  )}
                  {/* Add a space between (\n char) for display purposes */}
                  {businessIdIsValid && <br />}
                  {passwordIsValid && (
                    <Error text="※ パスワードは6文字以上である必要があります。" />
                  )}
                </div>

                {incorrectInfo !== 'none' && (
                  <>
                    <div
                      className="modal-input-label-tiny"
                      style={{
                        color: 'red',
                        marginTop: '10px',
                        marginBottom: '10px',
                      }}
                    >
                      {incorrectInfo === 'bid' &&
                        '※ ビジネスIDが存在しません。'}
                      {incorrectInfo === 'userpass' &&
                        '※ ユーザー名またはパスワードが間違っています。'}
                      {incorrectInfo === 'emptyfields' &&
                        '※ すべてのフィールドに記入してください。'}
                    </div>
                  </>
                )}

                <button
                  className="modal-navigation-button"
                  onClick={() => setIsFPVisible(true)}
                >
                  パスワードを忘れました
                </button>

                <button
                  className="modal-navigation-button"
                  onClick={() => handleLogin()}
                >
                  ログイン
                </button>

                {/* <LoadingButton
                  loading={loading}
                  className="loading-login"
                  loadingPosition="start"
                  startIcon={
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      style={{
                        width: '14px',
                        color: 'black',
                        visibility: 'hidden',
                      }}
                      fixedWidth
                    />
                  }
                  onClick={() => handleLogin()}
                >
                  <span style={{ color: 'black' }}>ログイン</span>
                </LoadingButton> */}
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalVisible && isOTPVisible && (
        <>
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <button
                  className="close-button"
                  onClick={() => {
                    setIsOTPVisible(false);
                    setIsLoginModalVisible(false);
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className="modal-body">
                <h1 className="modal-body-header">
                  <FontAwesomeIcon
                    icon={faRightToBracket}
                    style={{ marginRight: '15px' }}
                  />
                  二段階認証
                </h1>
                <p className="modal-body-text">
                  ログインのための一時的パスワード「サインタ鍵」を、追加の認証のためにあなたのメール
                  に送信しました。
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: '#858585',
                      marginTop: '20px',
                      display: 'block',
                    }}
                  >
                    ※
                    この認証を完了すれば、現在のデバイスから直接ログインできるようになります。
                    デバイスを変更した場合は、新たなコードが生成されます。
                  </span>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: '#858585',
                      marginTop: '10px',
                      display: 'block',
                    }}
                  >
                    ※
                    もしメールからコードを正しく受け取れていない場合は、システム管理者にメールの設定を依頼するか、
                    サインタサポートに連絡してください。
                  </span>
                </p>

                {isOTPIncorrect && (
                  <>
                    <div
                      className="modal-input-label-tiny"
                      style={{
                        color: 'red',
                        marginTop: '10px',
                        marginBottom: '10px',
                      }}
                    >
                      有効なOTPを入力してください
                    </div>
                  </>
                )}
                <div className="modal-input-container">
                  <label className="modal-input-label">
                    サインタ鍵
                    <span
                      style={{
                        fontSize: '.75rem',
                        color: '#858585',
                        marginLeft: '5px',
                      }}
                    >
                      (4桁番号)
                    </span>
                  </label>
                  <input
                    className="modal-input"
                    type="text"
                    onChange={e => {
                      setOtp_verified('Yes');
                      setOTP(e.target.value);
                    }}
                    value={otp}
                  />

                  <button
                    className="modal-navigation-button"
                    onClick={() => handleOTP()}
                  >
                    確認
                  </button>

                  {/* <LoadingButton
                    loading={loading}
                    className="loading-login"
                    loadingPosition="start"
                    startIcon={
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        style={{
                          width: '14px',
                          color: 'black',
                          visibility: 'hidden',
                        }}
                        fixedWidth
                      />
                    }
                    onClick={() => handleOTP()}
                  >
                    <span style={{ color: 'black' }}>確認</span>
                  </LoadingButton> */}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LandingLogin;
