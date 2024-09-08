/* 真田理志 */
/* メーンコンポーネントテストファイルである。
　　なので、新しいコンポーネントを作成したら、
　　こっちでテストすることができます。
　　重要：ちゃんとインポートし、useStateの
   selectedComponentを変更してください。

   This is the main component test file.
   So, when you create a new component,
   you can test it here.
   IMPORTANT: Be sure to import it properly
   and change the selectedComponent in useState.
*/

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicroscope } from '@fortawesome/free-solid-svg-icons';

// Component Info File to grab the information about the component
import ComponentInfo from './ComponentInfo';

// The current component to test the component playground
// import LandingLogin from '../modal-components/LandingLogin';
// import RegistrationNew from '../registration/RegistrationNew';
// import ForgotPassword from "../modal-components/ResetPassword";
// import Payment from '../payment/Payment';
import EmployeeModal from '../modal-components/NewEmployee';

const ComponentTest = () => {
  const [currentMode, setCurrentMode] = useState('component_info'); // Displays the current information

  // 重要！：このコンポーネントは、コンポーネントの情報を表示するためのコンポーネントです。
  // IMPORTANT! Before testing a component, change the state to the literal
  // name of the component you want to test.
  // const [selectedComponent, setSelectedComponent] = useState('Payment');
  // const [selectedComponent, setSelectedComponent] = useState('EmployeeModal');
  // const [selectedComponent, setSelectedComponent] = useState('Payment');
  const [selectedComponent, setSelectedComponent] = useState('EmployeeModal');
  // const [selectedComponent, setSelectedComponent] = useState('LandingLogin');
  // const [selectedComponent, setSelectedComponent] = useState('RegistrationNew');

  return (
    <>
      <div className="relative_container">
        <div className="title_container">
          <div className="section_title">
            <FontAwesomeIcon className="faIcon" icon={faMicroscope} />
            コンポーネントテスト
            <span style={{ fontSize: '0.7em', marginLeft: '10px' }}>
              (サインタ•プレイグラウンド)
            </span>
          </div>
        </div>
      </div>

      <div className="management-container">
        <div className="list test-list">
          <div
            className={`list-item ${
              currentMode === 'component_info' ? 'selected' : ''
            }`}
            onClick={() => setCurrentMode('component_info')}
          >
            コンポーネント情報
          </div>
          <div
            className={`list-item ${
              currentMode === 'component_test' ? 'selected' : ''
            }`}
            onClick={() => setCurrentMode('component_test')}
          >
            コンポーネント実行
          </div>
          <div
            className={`list-item ${
              currentMode === 'component_run' ? 'selected' : ''
            }`}
          >
            テスト画面
          </div>
        </div>

        {currentMode === 'component_info' && (
          <ComponentInfo selectedComponent={selectedComponent} />
        )}

        {currentMode === 'component_test' && (
          <div className="form-columns-container">
            <div className="form-column">
              <div className="form-group">
                <label>コンポーネント選択</label>
                <select
                  value={selectedComponent}
                  onChange={e => setSelectedComponent(e.target.value)}
                >
                  <option value="manual">自分で選択</option>
                </select>
              </div>

              <div className="form-group">
                <label>コンポーネント実行</label>
                <button
                  className="button-s"
                  onClick={() => setCurrentMode('component_run')}
                >
                  コンポーネント実行
                </button>
              </div>
            </div>
          </div>
        )}

        {/*
                    重要：ここにコンポーネントを追加してください。
                    IMPORTANT: Add the component here.
                */}

        {currentMode === 'component_run' && <EmployeeModal />}
      </div>
    </>
  );
};

export default ComponentTest;
