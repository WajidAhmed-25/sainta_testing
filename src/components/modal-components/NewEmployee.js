/* さなだ　りし　*/
/* ADD NEW EMPLOYEE */
/*
    このコンポーネントは新しい従業員を追加する機能を提供し、追加された
    従業員にEメールを送信することで従業員認証プロセスを開始します。

    This component provides the functionality to add a new 
    employee and start the employee authentication process
    by sending an email to the added employee.
*/

import { useState } from 'react';
import { faCircleUser, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EmployeeModal = ({ setEmployeeModalVisible }) => {
  const createNewEmployee = async () => {
    console.log('to be implemented');
  };

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

  const Example = ({ text }) => (
    <span
      style={{
        color: '#858585',
        fontSize: '0.8em',
        display: 'inline',
        marginLeft: '5px',
      }}
    >
      {text}
    </span>
  );

  const InfoCheck = () => {
    // Checks all the info and then undisables the button
    if (
      newEmployeeData.fullname.length > 0 &&
      newEmployeeData.email.length > 0 &&
      newEmployeeData.email.includes('@') &&
      newEmployeeData.email.includes('.') &&
      newEmployeeData.username.length > 0 &&
      newEmployeeData.password.length > 5 &&
      newEmployeeData.password === newEmployeeData.passwordConfirm
    ) {
      return false;
    }
    return true;
  };

  const [newEmployeeData, setNewEmployeeData] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
  });

  return (
    <>
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <button
              className="close-button"
              onClick={() => setEmployeeModalVisible(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="modal-body">
            <h1 className="modal-body-header">
              <FontAwesomeIcon
                icon={faCircleUser}
                style={{ marginRight: '15px' }}
              />
              従業員追加
            </h1>
            <p className="modal-body-text">
              下記に必要な情報を全て入力して新しい従業員を作成してください。この従業員が作成された後、追加情報の修正が可能です。
            </p>

            <div className="modal-input-container">
              <label className="modal-input-label">
                氏名
                <Example text="(例: 中田 幸子)" />
                <Required />
              </label>

              <input
                className="modal-input"
                type="text"
                value={newEmployeeData.fullname}
                onChange={e =>
                  setNewEmployeeData({
                    ...newEmployeeData,
                    fullname: e.target.value,
                  })
                }
              />

              <label className="modal-input-label">
                メールアドレス
                <Example text="(例: nakatasachiko@sainta.co.jp)" />
                <Required />
              </label>

              <input
                className="modal-input"
                type="text"
                value={newEmployeeData.email}
                onChange={e =>
                  setNewEmployeeData({
                    ...newEmployeeData,
                    email: e.target.value,
                  })
                }
              />

              <label className="modal-input-label">
                ユーザー名
                <Example text="(例: nakasako)" />
                <Required />
              </label>

              <input
                className="modal-input"
                type="text"
                value={newEmployeeData.username}
                onChange={e =>
                  setNewEmployeeData({
                    ...newEmployeeData,
                    username: e.target.value,
                  })
                }
              />

              <label className="modal-input-label">
                パスワード
                {/* ６文字以上 */}
                <Example text="(6文字以上)" />
                <Required />
              </label>

              <input
                className="modal-input"
                type="password"
                value={newEmployeeData.password}
                onChange={e =>
                  setNewEmployeeData({
                    ...newEmployeeData,
                    password: e.target.value,
                  })
                }
              />

              <label className="modal-input-label">
                パスワード
                <Example text="(確認)" />
                <Required />
              </label>

              <input
                className="modal-input"
                type="password"
                value={newEmployeeData.passwordConfirm}
                onChange={e =>
                  setNewEmployeeData({
                    ...newEmployeeData,
                    passwordConfirm: e.target.value,
                  })
                }
              />
            </div>

            <div className="modal-input-container">
              <button
                className="modal-navigation-button"
                onClick={() => createNewEmployee()}
                disabled={InfoCheck()}
              >
                追加
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeModal;
