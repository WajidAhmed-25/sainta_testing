/* さなだ　りし　*/
/* ALL COMPONENT INFO */
/*
    このファイルは、コンポーネントの情報を表示するためのファイルです。

    This file is a file to display information about the component.
    It is used for Component_Test.js.
*/

export default function ComponentInfo({ selectedComponent }) {
  // Add the component information here
  // ここにコンポーネント情報を追加してください。
  const componentInfo = {
    LandingLogin: {
      componentTitle: 'LandingLogin',
      componentDescription:
        'このコンポーネントは、ランディングページのログイン画面を表示するためのコンポーネントです。',
      componentFile: 'src/components/modal-components/LandingLogin.js',
    },
    RegistrationNew: {
      componentTitle: 'RegistrationNew',
      componentDescription:
        'このコンポーネントは、登録画面を表示するためのコンポーネントです。',
      componentFile: 'src/components/registration/RegistrationNew.js',
    },
    ForgotPassword: {
      componentTitle: 'ForgotPassword',
      componentDescription:
        'このコンポーネントは、パスワードを忘れた場合に、パスワードをリセットするためのコンポーネントです。',
      componentFile: 'src/components/modal-components/ForgotPassword.js',
    },
    Payment: {
      componentTitle: 'Payment',
      componentDescription:
        'このコンポーネントは、支払い情報を入力するためのコンポーネントです。',
      componentFile: 'src/components/payment/Payment.js',
    },
    EmployeeModal: {
      componentTitle: 'EmployeeModal',
      componentDescription:
        'このコンポーネントは、新しい従業員を追加するためのコンポーネントです。',
      componentFile: 'src/components/modal-components/NewEmployee.js',
    },
  };

  return (
    <>
      <div className="form-columns-container">
        <div className="form-column">
          <div className="form-group">
            <label>コンポーネント名</label>
            <input
              type="text"
              value={componentInfo[selectedComponent].componentTitle}
              readOnly
            />
          </div>

          <div className="form-group">
            <label>コンポーネントファイル</label>
            <input
              type="text"
              value={componentInfo[selectedComponent].componentFile}
              readOnly
            />
          </div>
        </div>

        <div className="form-column">
          <div className="form-group">
            <label>コンポーネント説明</label>
            <textarea
              style={{ height: '120px' }}
              value={componentInfo[selectedComponent].componentDescription}
              readOnly
            />
          </div>
        </div>
      </div>
    </>
  );
}
