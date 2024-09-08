/* さなだ　りし　*/
/* RESET PASSWORD COMPONENT */
/*
    パスワードを忘れた場合に、パスワードをリセットするためのコンポーネントです。

    This is the component for resetting the password when you forget it.
*/

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faUnlock } from '@fortawesome/free-solid-svg-icons';
import { set } from 'date-fns';

const ForgotPassword = () => {
  const [isModalVisible, setIsModalVisible] =
    useState(true); /* Will be turned to true when the modal is visible */

  /* The state for managing user data that is registered to the e-mail */
  const [userData, setUserData] = useState({
    email: 'sample@sample.co.jp', // AUTOFILLED
    username: 'sample_user', // AUTO FILLED
    password: '',
    passwordConfirm: '',
  });

  /* Handling the password reset */
  const handlePasswordReset = () => {
    if (userData.password === '' || userData.passwordConfirm === '') {
      setIncorrectInfo('password');
    } else if (userData.password !== userData.passwordConfirm) {
      setIncorrectInfo('password-match');
    } else {
      /* HANDLE PASSWORD RESETTING HERE */
      setIsReset(true);
    }

    return;
  };

  const [incorrectInfo, setIncorrectInfo] =
    useState('none'); /* Will be turned to "password" when incorrect password */

  const [isReset, setIsReset] =
    useState(false); /* Will be turned to true when the password is reset */

  /* Now the actual JSX */
  return (
    <>
      {isReset === false && isModalVisible && (
        <>
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <button
                  className="close-button"
                  onClick={() => setIsModalVisible(false)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className="modal-body">
                <h1 className="modal-body-header">
                  <FontAwesomeIcon
                    icon={faUnlock}
                    style={{ marginRight: '15px' }}
                  />
                  パスワードをリセット
                </h1>
                <p className="modal-body-text">
                  パスワードをリセットするために、登録したメールアドレスを入力してください。
                </p>

                <div className="modal-input-container">
                  <label className="modal-input-label">
                    メールアドレス
                    <span
                      style={{
                        fontSize: '.75rem',
                        color: '#858585',
                        marginLeft: '5px',
                      }}
                    >
                      (自動入力)
                    </span>
                  </label>
                  <input
                    className="modal-input"
                    type="text"
                    value={userData.email}
                    disabled
                  />

                  <label className="modal-input-label">
                    ユーザー名
                    <span
                      style={{
                        fontSize: '.75rem',
                        color: '#858585',
                        marginLeft: '5px',
                      }}
                    >
                      (自動入力)
                    </span>
                  </label>
                  <input
                    className="modal-input"
                    type="text"
                    value={userData.username}
                    disabled
                  />

                  <label className="modal-input-label">新しいパスワード</label>
                  <input
                    className="modal-input"
                    type="password"
                    onChange={e =>
                      setUserData({ ...userData, password: e.target.value })
                    }
                  />

                  <label className="modal-input-label">
                    新しいパスワード
                    <span
                      style={{
                        fontSize: '.75rem',
                        color: '#858585',
                        marginLeft: '5px',
                      }}
                    >
                      (確認)
                    </span>
                  </label>
                  <input
                    className="modal-input"
                    type="password"
                    onChange={e =>
                      setUserData({
                        ...userData,
                        passwordConfirm: e.target.value,
                      })
                    }
                  />
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
                      {incorrectInfo === 'password' &&
                        '※ パスワードを入力してください。'}
                      {incorrectInfo === 'password-match' &&
                        '※ パスワードが一致しません。'}
                    </div>
                  </>
                )}

                <div className="modal-input-container">
                  <button
                    className="modal-navigation-button"
                    onClick={() => handlePasswordReset()}
                  >
                    修正
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {isReset === true && isModalVisible && (
        <>
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <button
                  className="close-button"
                  onClick={() => setIsModalVisible(false)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className="modal-body">
                <h1 className="modal-body-header">
                  <FontAwesomeIcon
                    icon={faUnlock}
                    style={{ marginRight: '15px' }}
                  />
                  リセット終了
                </h1>
                <p className="modal-body-text">
                  パスワードがリセットされました。新しいパスワードでログインしてください。
                </p>

                <div className="modal-input-container">
                  <button
                    className="modal-navigation-button"
                    onClick={() => setIsModalVisible(false)}
                  >
                    承知
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ForgotPassword;
