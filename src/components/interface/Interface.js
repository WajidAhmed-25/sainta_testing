import ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import '../../assets/css/Modals.css';
import {
  faUsers,
  faHandshake,
  faBoxes,
  faBox,
  faUserFriends,
  faChartBar,
  faWallet,
  faFileInvoiceDollar,
  faBusinessTime,
  faTimes,
  faChevronLeft,
  faChevronRight,
  faSave,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Interface = ({
  currentUser,
  setCurrentUser,
  users,
  setUsers,
  businessSettings,
}) => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => {
    setIsModalVisible(false);

    // Update the user's firstLogin status
    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        return {
          ...user,
          firstLogin: false,
        };
      }
      return user;
    });
    setUsers(updatedUsers);
    setCurrentUser(updatedUsers.find(user => user.id === currentUser.id));
  };

  // The modal to show at the start
  const StartModal = ({ isModalVisible, closeModal }) => {
    // Fixed casing for the component
    const [currentPage, setCurrentPage] = useState(0);

    return isModalVisible
      ? ReactDOM.createPortal(
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <button className="close-button" onClick={closeModal}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className="modal-body">
                {currentPage === 0 && (
                  <>
                    <h1 className="modal-body-header">サインタへようこそ！</h1>
                    <p className="modal-body-text">
                      サインタは企業運営をサポートするためのツールとしてご提供しています。これはチュートリアルというわけではありませんが、基本的な概要をご説明します。
                    </p>
                    <p className="modal-body-text">
                      初めてこのツールをご利用になるかもしれませんが、直感的な操作性で使い勝手が良く、すぐに慣れていただけると思います。
                    </p>
                    <p className="modal-body-text">
                      次のページでは、各機能について詳しく説明していきます。
                    </p>
                  </>
                )}
                {currentPage === 1 && (
                  <>
                    <h1 className="modal-body-header">
                      提供機能{' '}
                      <span
                        style={{
                          color: '#858585',
                          fontSize: '0.6em',
                          marginLeft: '10px',
                        }}
                      >
                        (部分 1/3)
                      </span>
                    </h1>
                    <p className="modal-body-text">
                      サインタは、以下の機能を提供しています。
                    </p>
                    <p className="modal-body-text">
                      <FontAwesomeIcon
                        icon={faUsers}
                        style={{ marginRight: '5px' }}
                      />{' '}
                      顧客管理:
                      顧客に関する様々な情報や商談日程、文化的な詳細なども追跡できます。
                    </p>
                    <p className="modal-body-text">
                      <FontAwesomeIcon
                        icon={faHandshake}
                        style={{ marginRight: '5px' }}
                      />{' '}
                      営業管理: 顧客との商談日程を管理できます。
                    </p>
                    <p className="modal-body-text">
                      <FontAwesomeIcon
                        icon={faUserFriends}
                        style={{ marginRight: '5px' }}
                      />{' '}
                      従業員:
                      社員情報の管理や出勤の追跡、その他様々な関心分野に対応しています。
                    </p>
                  </>
                )}
                {currentPage === 2 && (
                  <>
                    <h1 className="modal-body-header">
                      提供機能{' '}
                      <span
                        style={{
                          color: '#858585',
                          fontSize: '0.6em',
                          marginLeft: '10px',
                        }}
                      >
                        (部分 2/3)
                      </span>
                    </h1>
                    <p className="modal-body-text">
                      <FontAwesomeIcon
                        icon={faFileInvoiceDollar}
                        style={{ marginRight: '5px' }}
                      />{' '}
                      請求書:
                      請求書情報を入力することで、購入に関する様々な情報を記録し、分析に役立てることができます。
                    </p>
                    <p className="modal-body-text">
                      <FontAwesomeIcon
                        icon={faChartBar}
                        style={{ marginRight: '5px' }}
                      />{' '}
                      解析:
                      様々な分析機能にアクセスでき、結果を活用してビジネスの今後の意思決定に役立てることができます。
                    </p>
                    <p className="modal-body-text">
                      <FontAwesomeIcon
                        icon={faBusinessTime}
                        style={{ marginRight: '5px' }}
                      />{' '}
                      タイムシート:
                      簡単に理解できるタイムシートシステムを通じて、出勤、退勤時間の入力や休暇の申請ができます。
                    </p>
                  </>
                )}
                {currentPage === 3 && (
                  <>
                    <h1 className="modal-body-header">
                      提供機能{' '}
                      <span
                        style={{
                          color: '#858585',
                          fontSize: '0.6em',
                          marginLeft: '10px',
                        }}
                      >
                        (部分 3/3)
                      </span>
                    </h1>
                    <p className="modal-body-text">
                      <FontAwesomeIcon
                        icon={faBoxes}
                        style={{ marginRight: '5px' }}
                      />{' '}
                      在庫管理:
                      在庫を整理し、提供中の商品との同期も可能にします。自動計算機能を用いて複雑な分析が行えます。
                    </p>
                    <p className="modal-body-text">
                      <FontAwesomeIcon
                        icon={faBox}
                        style={{ marginRight: '5px' }}
                      />{' '}
                      商品管理:
                      製品面から製品情報を閲覧し、製造コストを自動計算、そして基本データを追跡することができます。
                    </p>

                    <p className="modal-body-text">
                      <FontAwesomeIcon
                        icon={faWallet}
                        style={{ marginRight: '5px' }}
                      />{' '}
                      経費:
                      直感的で分かりやすいインターフェースを通じて、ビジネスに関する全ての経費をここで追跡できます。
                    </p>
                  </>
                )}
                {currentPage === 4 && (
                  <>
                    <h1 className="modal-body-header">
                      留意事項{' '}
                      <span
                        style={{
                          color: '#858585',
                          fontSize: '0.6em',
                          marginLeft: '10px',
                        }}
                      >
                        (部分 1/2)
                      </span>
                    </h1>
                    <p className="modal-body-text">
                      以下のように、サインタはリストベースの情報保存システムを使用しており、リストアイテムをクリックすると、新しいリストが表示されるか、または情報が直接修正可能になります。
                    </p>

                    <p className="modal-body-text">
                      <div className="management-container">
                        <div className="list sample-list">
                          <div className="list-item selected">リスト１</div>
                          <div className="list-item">リスト２</div>
                        </div>

                        <div className="form-columns-container">
                          <div className="form-column">
                            <h3 className="form-header">情報</h3>
                            <div className="form-group">
                              <label htmlFor="dayBirth">サンプルフィルド</label>
                              <input value={'サインタ'} readOnly />
                            </div>
                          </div>
                        </div>
                      </div>
                    </p>
                  </>
                )}
                {currentPage === 5 && (
                  <>
                    <h1 className="modal-body-header">
                      留意事項{' '}
                      <span
                        style={{
                          color: '#858585',
                          fontSize: '0.6em',
                          marginLeft: '10px',
                        }}
                      >
                        (部分 2/2)
                      </span>
                    </h1>
                    <p className="modal-body-text-nomargin">
                      情報の入力や変更を行った後は、必ず保存ボタンをクリックしてください。削除する場合は、削除ボタンをクリックして下さい。これらの手順は正しい使用を保証するために重要です。
                    </p>
                    <p className="modal-body-text">
                      <div className="management-container">
                        <div className="form-columns-container">
                          <div className="form-column">
                            <h3 className="form-header">設定</h3>
                            <div className="form-group">
                              <label htmlFor="dayBirth">サンプルフィルド</label>
                              <input value={'サインタ'} readOnly />
                            </div>

                            <div className="form-group">
                              <label htmlFor="dayBirth">サンプルフィルド</label>
                              <input value={'サインタ'} readOnly />
                            </div>

                            <div
                              className="action-buttons"
                              style={{ marginTop: '25px' }}
                            >
                              <button>
                                <FontAwesomeIcon icon={faSave} fixedWidth />
                                保存
                              </button>
                              <button>
                                <FontAwesomeIcon icon={faTrashAlt} fixedWidth />
                                削除
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </p>
                  </>
                )}
                {currentPage === 6 && (
                  <>
                    <h1 className="modal-body-header">お疲れ様でした！</h1>
                    <p className="modal-body-text">
                      これで、サインタの基本的な操作方法についてご説明しました。これらの機能を使用することで、ビジネスの効率性を向上させることができます。
                    </p>
                    <p className="modal-body-text">
                      ご不明な点がある場合は、お気軽にお問い合わせください。
                    </p>
                    <p className="modal-body-text">
                      これからもサインタをご愛顧いただけることを願っております。
                    </p>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="modal-navigation-button"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                  className="modal-navigation-button"
                  disabled={currentPage === 6}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          </div>,
          document.body, // Target mounting point
        )
      : null;
  };

  // UseEffect to render the modal if the user is new
  useEffect(() => {
    if (currentUser?.firstLogin) {
      setIsModalVisible(true);
    }
  }, [currentUser]);

  return (
    <>
      {/* <TopNavbar /> */}

      <StartModal isModalVisible={isModalVisible} closeModal={closeModal} />

      <div className="main_container_interface">
        <div className="lg_container">
          <div className="button_row">
            <div className="button-item">
              <div
                className="button"
                onClick={() => navigate('/customer-management')}
              >
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="button_displaytext">顧客管理</div>
            </div>
            <div className="button-item">
              <div
                className="button"
                onClick={() => navigate('/sales-management')}
              >
                <FontAwesomeIcon icon={faHandshake} />
              </div>
              <div className="button_displaytext">営業管理</div>
            </div>
            <div className="button-item">
              <div
                className="button"
                onClick={() => navigate('/employee-management')}
              >
                <FontAwesomeIcon icon={faUserFriends} />
              </div>
              <div className="button_displaytext">従業員</div>
            </div>
          </div>
        </div>

        <div className="lg_container">
          <div className="button_row">
            <div className="button-item">
              <div className="button" onClick={() => navigate('/invoices')}>
                <FontAwesomeIcon icon={faFileInvoiceDollar} />
              </div>
              <div className="button_displaytext">請求書</div>
            </div>
            <div className="button-item">
              <div className="button" onClick={() => navigate('/analysis')}>
                <FontAwesomeIcon icon={faChartBar} />
              </div>
              <div className="button_displaytext">解析</div>
            </div>
            <div className="button-item">
              <div className="button" onClick={() => navigate('/timesheet')}>
                <FontAwesomeIcon icon={faBusinessTime} />
              </div>
              <div className="button_displaytext">タイムシート</div>
            </div>
          </div>
        </div>

        <div className="lg_container">
          <div className="button_row">
            <div className="button-item">
              <div
                className="button"
                onClick={() => navigate('/inventory-management')}
              >
                <FontAwesomeIcon icon={faBoxes} />
              </div>
              <div className="button_displaytext">在庫管理</div>
            </div>
            <div className="button-item">
              <div
                className="button"
                onClick={() => navigate('/product-management')}
              >
                <FontAwesomeIcon icon={faBox} />
              </div>
              <div className="button_displaytext">商品管理</div>
            </div>
            <div className="button-item">
              <div className="button">
                <FontAwesomeIcon
                  icon={faWallet}
                  onClick={() => navigate('/expenses')}
                />
              </div>
              <div className="button_displaytext">経費</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Interface;
