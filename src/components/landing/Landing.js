import { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  faIdCard,
  faTimes,
  faRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Import css files
import './Landing.css';
import '../../App.css';
import '../../assets/css/Modals.css';
import '../../assets/css/InterfaceM.css';

// furigana component
import Furigana from './Furigana';

// Import images
import gy1 from '../../assets/images/gyoumu1.png';
import gy2 from '../../assets/images/gyoumu2.png';
import gy3 from '../../assets/images/gyoumu3.png';
import gy4 from '../../assets/images/gyoumu4.png';
import gy5 from '../../assets/images/gyoumu5.png';

import bs1 from '../../assets/images/boshuu1.png';
import bs2 from '../../assets/images/boshuu2.png';
import bs3 from '../../assets/images/boshuu3.png';

import lb1 from '../../assets/images/rabo1.png';
import lb2 from '../../assets/images/rabo2.png';
import lb3 from '../../assets/images/rabo3.png';
import vs1 from '../../assets/images/vision1.png';

import logoSmall from '../../assets/images/saintaLOGO_S.png';
import LandingLogin from '../modal-components/LandingLogin';

// To create random floating words (class words is the class for the floating words)
const possibleWordTexts = [
  '効率ゲット！',
  'ビジネス最適化！',
  '使いやすい！',
  '情報整理！',
  'スムーズ！',
  'はっきり！',
  '柔軟！',
  '時短マジック！',
  '快適操作！',
  '直感ナビ！',
  'クリアビュー！',
  '瞬時解決！',
];

// Define landing component
const Landing = ({
  users,
  currentUser,
  setCurrentUser,
  businessSettings,
  setBusinessSettings,
  currentBusiness,
  setCurrentBusiness,
}) => {
  const navigate = useNavigate();

  // create a bottomNavbar component, this will be responsible for modal generation for registering, login, and renewing registration
  const BottomNavbar = ({
    users,
    currentUser,
    setCurrentUser,
    businessSettings,
    currentBusiness,
    setCurrentBusiness,
  }) => {
    // Define states
    const [registrationInfo, setRegistrationInfo] = useState({
      businessID: '',
      plan: 'コ',
      planDuration: 'month',
      renrakuEmail: '',
    });

    const [loginInfo, setLoginInfo] = useState({
      businessID: null,
      username: null,
      password: null,
    });

    const [emailIsValid, setEmailIsValid] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const [isRegistrationModalVisible, setIsRegistrationModalVisible] =
      useState(false);

    const [willRegister, setWillRegister] = useState(true); // This will be used to determine if the user wants to register or renew their registration
    const [incorrectInfo, setIncorrectInfo] = useState('none'); // This is for the login, can be "bid", "userpass", or "none"
    const [selectedService, setSelectedService] = useState(null); // Can be "gyoumu", "boshuu", or "labo"

    const handleRegisterModal = () => {
      // Pop up a register modal that handles all the Stripe stuff
      // Each payment has its own unique API, whatnot.
      // If payment is successful, navigate to Registration.js to handle the rest of the registration process,
      setIsRegistrationModalVisible(true);
    };

    const handleLoginModal = () => {
      // Basically check if the company exists (ID wise), and then the list of users, if the user which is linked to the company
      // Then use their username and password, set to CurrentUser, and navigate to ./Interface.js
      // setModalVisible to true
      setIsLoginModalVisible(true);
    };

    const handleLogin = () => {
      // Grab the businessID from the input
      let businessID = loginInfo.businessID;
      // change businessID to a number
      businessID = parseInt(businessID);
      // Grab the username from the input
      const username = loginInfo.username;
      // Grab the password from the input
      const password = loginInfo.password;

      // See if the businessID exists in the businessSettings
      const business = businessSettings.find(
        business => business.businessID === businessID,
      );

      // change businessID to a number
      if (business) {
        // If it does, then check if the username and password match a user
        const user = users.find(
          user => user.username === username && user.password === password,
        );

        if (user) {
          // Set the currentBusiness to the business location in the businessSettings array
          // so like businessSettings[0], etc.
          // alert what business is
          // alert(business.businessID);
          if (setCurrentBusiness) {
            setCurrentBusiness(business.businessID);
          }

          // We need to grab the user and set the currentUser to that user and isLoggedin to true
          const currentUser = users.find(
            user => user.username === username && user.password === password,
          );
          currentUser.isLoggedIn = true;
          setCurrentUser(currentUser);

          navigate('/interface');
        } else {
          // If it doesn't, then alert the user
          setIncorrectInfo('userpass');
        }
      } else {
        // If the business does not exist, inform the user
        setIncorrectInfo('bid');
      }
    };

    const setRegisterInfo = event => {
      const { name, value } = event.target; // Get the name and value of the changed input
      setRegistrationInfo(prevState => ({
        ...prevState,
        [name]: value,
      }));
    };

    // Needs to be done -> links to stripe and then handles the payment
    const handleRegistration = () => {
      // console log the registrationInfo for debug
      // console.log("plan: " + registrationInfo.plan + ", paymentMethod: " + registrationInfo.paymentMethod);

      // This variable will be judged to redirect to the registration component or not
      // let successfullPayment = false;

      // Handle the stripe redirection to the proper pages, grab the success code for payment, and update that business with
      // the folllowing: id should be null, but the selected plan and then the yearly/monthly, and then the start date should be
      // a new date from today, where as the end date should be the start date + 1 year or 1 month depending on the plan

      if (selectedService === 'gyoumu') {
        // Set the business info as per the Stripe payment
        // CODE HERE

        // Navigate to the registration page
        if (!registrationInfo?.renrakuEmail) {
          setEmailError(true);
          setEmailIsValid(false);
        } else {
          console.log({ registrationInfo });
          navigate('/registration');
        }
      }
    };

    return (
      <>
        {isRegistrationModalVisible &&
          ReactDOM.createPortal(
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <button
                    className="close-button"
                    onClick={() => setIsRegistrationModalVisible(false)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <div className="modal-body">
                  <h1 className="modal-body-header">
                    <FontAwesomeIcon
                      icon={faIdCard}
                      style={{ marginRight: '15px' }}
                    />
                    登録
                  </h1>
                  <p className="modal-body-text">
                    必要な情報を入力してください。あとで決済ページにリダイレクトされます。
                  </p>

                  <div className="modal-input-label-tiny">
                    新規顧客向けに、サインタ業務の初月を
                    <span
                      style={{
                        color: 'red',
                        marginLeft: '5px',
                        marginRight: '5px',
                        fontWeight: 'bold',
                      }}
                    >
                      15000円
                    </span>
                    オフで提供するプロモーションを実施中です。決済時にプロモーションコード「SAINTA60」をご利用いただき、この特典をお受け取りください。
                  </div>

                  <div className="modal-input-container">
                    {/* now, we will put choose which service you are interested in */}
                    <label className="modal-input-label">
                      サービスを選んでください：
                    </label>
                    <div className="modal-input-button-container">
                      <div
                        className="icon-word-display"
                        onClick={() => setSelectedService('gyoumu')}
                      >
                        <img
                          className="logoSmall"
                          src={logoSmall}
                          alt="サインタ"
                        />
                        <span>業務</span>
                      </div>
                      <div
                        className="icon-word-display"
                        onClick={() => setSelectedService('boshuu')}
                      >
                        <img
                          className="logoSmall"
                          src={logoSmall}
                          alt="サインタ"
                        />
                        <span>募集</span>
                      </div>
                      <div
                        className="icon-word-display"
                        onClick={() => setSelectedService('labo')}
                      >
                        <img
                          className="logoSmall"
                          src={logoSmall}
                          alt="サインタ"
                        />
                        <span>ラボ</span>
                      </div>
                    </div>
                  </div>

                  {selectedService === 'gyoumu' && (
                    <>
                      {/* kikan, company name, renraku email */}
                      <p
                        className="modal-body-text"
                        style={{ fontWeight: 'bold' }}
                      >
                        サインタ業務の登録情報を入力してください。
                      </p>
                      <div className="modal-input-container">
                        <label className="modal-input-label">期間</label>
                        <select
                          className="modal-input"
                          onChange={setRegisterInfo}
                          name="planDuration"
                          value={registrationInfo?.planDuration}
                        >
                          <option value="month">月間契約</option>
                          <option value="year">年間契約</option>
                        </select>
                      </div>
                      <div className="modal-input-container">
                        {/* renraku email */}
                        <label className="modal-input-label">
                          連絡用メールアドレス
                        </label>
                        <input
                          className="modal-input"
                          type="text"
                          onChange={setRegisterInfo}
                          onKeyUp={() => {
                            setEmailIsValid(
                              !registrationInfo?.renrakuEmail.includes('@'),
                            );
                            setEmailError(false);
                          }}
                          name="renrakuEmail"
                          value={registrationInfo?.renrakuEmail}
                        />

                        <>
                          <div
                            className="modal-input-label-tiny"
                            style={{
                              color: 'red',
                              marginTop: '10px',
                              marginBottom: '10px',
                            }}
                          >
                            {emailIsValid && (
                              <span>
                                有効なメールアドレスを入力してください。
                              </span>
                            )}
                            {emailError && (
                              <span>メールアドレスを入力してください。</span>
                            )}
                          </div>
                        </>

                        <button
                          className="modal-navigation-button"
                          onClick={() => handleRegistration()}
                        >
                          次へ
                        </button>
                      </div>
                    </>
                  )}

                  {selectedService === 'boshuu' && (
                    // basically just asking for if the user is seeking a job or posting a job
                    <>
                      <p
                        className="modal-body-text"
                        style={{ fontWeight: 'bold' }}
                      >
                        サインタ募集の登録情報を入力してください。
                      </p>
                      <div className="modal-input-container">
                        {/* are you looking for a job or posting a job */}
                        <label className="modal-input-label">
                          求職者か求人者かを選んでください：
                        </label>
                        {/* just a dropdown */}
                        <select
                          className="modal-input"
                          onChange={e =>
                            setWillRegister(e.target.value === 'true')
                          }
                          name="willRegister"
                          value={willRegister}
                        >
                          <option value="true">求職者</option>
                          <option value="false">求人者</option>
                        </select>

                        <button
                          className="modal-navigation-button"
                          onClick={() => handleRegistration()}
                        >
                          次へ
                        </button>
                      </div>
                    </>
                  )}

                  {selectedService === 'labo' && (
                    // will ask for a contact email and then a description of the project textarea
                    <>
                      <p
                        className="modal-body-text"
                        style={{ fontWeight: 'bold' }}
                      >
                        サインタラボの登録情報を入力してください。
                      </p>
                      <div className="modal-input-container">
                        {/* contact email */}
                        <label className="modal-input-label">
                          連絡用メールアドレス
                        </label>
                        <input
                          className="modal-input"
                          type="text"
                          onChange={setRegisterInfo}
                          name="renrakuEmail"
                          value={registrationInfo?.renrakuEmail}
                        />
                      </div>
                      <div className="modal-input-container">
                        {/* description of the project */}
                        <label className="modal-input-label">
                          プロジェクトの説明
                        </label>
                        <textarea
                          className="modal-input"
                          onChange={setRegisterInfo}
                          name="projectDescription"
                          value={registrationInfo?.projectDescription}
                          style={{ height: '100px' }}
                        />

                        <button
                          className="modal-navigation-button"
                          onClick={() => handleRegistration()}
                        >
                          次へ
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>,
            document.body,
          )}

        {false &&
          isLoginModalVisible &&
          ReactDOM.createPortal(
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <button
                    className="close-button"
                    onClick={() => setIsLoginModalVisible(false)}
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
                  {/* a bunch of input fields with labels above them that have KAISHA ID, username, password */}
                  {/* also have fields for renewing plan */}
                  <div className="modal-input-container">
                    <label className="modal-input-label">
                      あなたの会社のサインタID
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
                          {incorrectInfo === 'bid' &&
                            '※ ビジネスIDが存在しません。'}
                          {incorrectInfo === 'userpass' &&
                            '※ ユーザー名またはパスワードが間違っています。'}
                        </div>
                      </>
                    )}

                    <button
                      className="modal-navigation-button"
                      onClick={() => handleLogin()}
                    >
                      ログイン
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )}

        {isLoginModalVisible && (
          <LandingLogin setIsLoginModalVisible={setIsLoginModalVisible} />
        )}

        <div className="bottomNavbar">
          <div
            className="bottomNavbarSelectable"
            onClick={() => handleRegisterModal()}
          >
            <FontAwesomeIcon className="bottomNavbarIcon" icon={faIdCard} />
            <span>登録</span>
          </div>
          <div
            className="bottomNavbarSelectable"
            onClick={() => handleLoginModal()}
          >
            <FontAwesomeIcon
              className="bottomNavbarIcon"
              icon={faRightToBracket}
            />
            <span>ログイン</span>
          </div>
        </div>
      </>
    );
  };

  const createWords = useCallback(function createWords() {
    const text_ =
      possibleWordTexts[Math.floor(Math.random() * possibleWordTexts.length)];
    const word_element = document.createElement('div');
    word_element.classList.add('words');
    word_element.innerHTML = text_;

    // Set initial position randomly across width of the screen
    word_element.style.left = `${Math.random() * 100}%`;

    // Pick a random part from 75% of the page up to the bottom to the very bottom
    word_element.style.bottom = `${Math.random() * 75}%`;

    // Apply random size between .75em and 1.75
    const size = Math.random() * 1 + 0.75;
    word_element.style.fontSize = `${size}em`;

    // Add to container
    document.querySelector('.floating-words').appendChild(word_element);

    // Remove after animation ends
    setTimeout(() => {
      word_element.remove();
    }, 7500);
  }, []);

  // UseEffect to set CurrentUser to null
  useEffect(() => {
    setCurrentUser(null);
    setCurrentBusiness(null);

    // Now create the interval when the component is mounted
    const interval = setInterval(() => {
      createWords();
    }, 1500);

    return () => clearInterval(interval);
  }, [createWords, setCurrentBusiness, setCurrentUser]);

  const [currentMode, setCurrentMode] = useState('gyoumu'); // gyoumu, boshuu, labo

  return (
    <>
      <div className="landing-container">
        <div className="landing-nav-bar">
          <div
            className="landing-nav-button"
            onClick={() => setCurrentMode('gyoumu')}
          >
            <img className="landing-nav-logo" src={logoSmall} alt="サインタ" />
            業務
          </div>
          <div
            className="landing-nav-button"
            onClick={() => setCurrentMode('boshuu')}
          >
            <img className="landing-nav-logo" src={logoSmall} alt="サインタ" />
            募集
          </div>
          <div
            className="landing-nav-button"
            onClick={() => setCurrentMode('labo')}
          >
            <img className="landing-nav-logo" src={logoSmall} alt="サインタ" />
            ラボ
          </div>
          <div
            className="landing-nav-button"
            onClick={() => setCurrentMode('vision')}
          >
            <img className="landing-nav-logo" src={logoSmall} alt="サインタ" />
            ビジョン
          </div>
        </div>
        <div className="floating-words"></div> {/* for the floating words */}
        {currentMode === 'gyoumu' && (
          <>
            <div className="landing-side-container">
              <img className="landing-side-image" src={gy1} alt="イメージ" />
              <div className="landing-side-text-container">
                <div className="landing-header">
                  あらゆるビジネスニーズに対応する、多機能ビジネスツール群。
                </div>
                <div className="landing-body">
                  サインタは、顧客管理、営業管理、従業員管理、在庫管理、商品管理など、さまざまなツールを搭載しており、ビジネス運営に必要な全てを網羅しています。
                  直感的で使いやすいユーザーインターフェイスにより、情報の整理・管理・変更がこれまでになく簡単に。サインタがあれば、日々の業務はよりスムーズに、
                  効率的に運びます。あなたのビジネスを最適化し、成功に導くための最強のパートナーです。
                </div>
              </div>
            </div>

            <div className="landing-side-container">
              <img className="landing-side-image" src={gy2} alt="イメージ" />
              <div className="landing-side-text-container">
                <div className="landing-header">
                  さまざまな業界に対応する多用途システム。
                </div>
                <div className="landing-body">
                  当社のシステムは、飲食店、小売店、運送サービス、IT業界など、さまざまな業種のビジネスフローを最適化するための豊富なツールを提供します。販売管理から顧客関係管理、
                  在庫・商品管理まで、一元的に管理することが可能です。また、経費管理や従業員のタイムシート管理といった機能も備えており、効率的な運営が実現できます。どのような業態に
                  も柔軟に対応可能で、ビジネスを次のレベルへと導く強力なサポートを提供致します。
                </div>
              </div>
            </div>

            <div className="landing-side-container">
              <img className="landing-side-image" src={gy3} alt="イメージ" />
              <div className="landing-side-text-container">
                <div className="landing-header">
                  企業の全従業員が利用できるソフトウェア。
                </div>
                <div className="landing-body">
                  当社では無制限のユーザーサポートを提供しており、追加費用なしで御社の全従業員を追加することが可能です。1ユーザーごとに料金がかかる他のERPシステムとは異なり、
                  効率的なユーザー管理によってコストを削減します。システム内で彼らを追加する限り、御社の全従業員がすぐにシステムの使用を開始できます。これにより、組織全体で
                  情報共有や業務の効率化を実現し、ビジネス運営をスムーズに進めることができます。
                </div>
              </div>
            </div>

            <div className="landing-side-container">
              <img className="landing-side-image" src={gy4} alt="イメージ" />
              <div className="landing-side-text-container">
                <div className="landing-header">妥協のないデータの安全性。</div>
                <div className="landing-body">
                  サインタではクラウドストレージと暗号化技術の利用により、すべてのユーザーデータ及び企業データを完全に安全で保護された状態に保ちます。最先端の暗号化アルゴリズム
                  やセキュリティプロトコルを駆使することで、データの漏洩や不正アクセスのリスクを極限まで低減。さらに、常に最新のセキュリティ対策を適用し、システムの脆弱性をチェック
                  し続けることで、お客様の貴重なデータを守り続けます。信頼性の高いクラウドインフラを基盤とし、データのバックアップと復旧プロセスも万全。お客様のビジネス運営に
                  欠かせないデータを、あらゆる事態から守るための堅牢なシステムを提供いたします。
                </div>
              </div>
            </div>

            <div className="landing-side-container final">
              <img className="landing-side-image" src={gy5} alt="イメージ" />
              <div className="landing-side-text-container">
                <div className="landing-header">
                  今日から始める、ビジネスの効率化！
                </div>
                <div className="landing-body">
                  複雑な分析機能、社内メールシステム、ファイル追跡、人材募集、効率的なカスタマーサポートなど、さまざまな機能を利用してビジネス管理の革新を実現します！
                  お客様を第一に考え、素晴らしいビジネス管理体験を提供したいと考えています。当社のソフトウェアは月額
                  <span
                    style={{
                      color: 'red',
                      marginLeft: '5px',
                      marginRight: '5px',
                      fontWeight: 'bold',
                    }}
                  >
                    25,000円
                  </span>
                  で利用可能ですが、新規ユーザーには初月を特別価格の
                  <span
                    style={{
                      color: 'red',
                      marginLeft: '5px',
                      marginRight: '5px',
                      fontWeight: 'bold',
                    }}
                  >
                    10,000円
                  </span>
                  で提供しています！今すぐ当社のサービスを試してみてください。
                  <br></br>
                  <br></br>割引コード：
                  <span
                    style={{
                      color: 'red',
                      marginLeft: '5px',
                      marginRight: '5px',
                      fontWeight: 'bold',
                    }}
                  >
                    SAINTA60
                  </span>
                </div>
              </div>
            </div>

            <div className="separator">separator</div>
          </>
        )}
        {currentMode === 'boshuu' && (
          <>
            <div className="landing-side-container">
              <img className="landing-side-image" src={bs1} alt="イメージ" />
              <div className="landing-side-text-container">
                <div className="landing-header">
                  今日中に理想の企業を見つけよう！
                </div>
                <div className="landing-body">
                  高度なマッチングアルゴリズムを利用して、サインタのサービスを活用するさまざまな会社とマッチング！適切な企業を探す困難なプロセスをサインタが代行し、効率的にあなたに最適な企業を紹介します。
                  あなたのキャリアに最適なパートナーを見つけるまで全力を尽くします。サインタは、あなたが望む理想の職場に一歩近づけるよう、今こそ、新たなキャリアの扉を開く一歩を踏み出しましょう。
                </div>
              </div>
            </div>

            <div className="landing-side-container">
              <img className="landing-side-image" src={bs2} alt="イメージ" />
              <div className="landing-side-text-container">
                <div className="landing-header">
                  企業と直接にコミュニケーションを！
                </div>
                <div className="landing-body">
                  サインタ募集を利用することで、様々な企業と直接連絡を取り、情報を送信することができます。サインタを通じて、求職者と企業の間の架け橋となり、よりスムーズで直接的なコミュニケーションを実現します。
                  これにより、求職活動の効率が大幅に向上し、個々のニーズに合ったより適切なマッチングを実現します。
                </div>
              </div>
            </div>

            <div className="landing-side-container">
              <img className="landing-side-image" src={bs3} alt="イメージ" />
              <div className="landing-side-text-container">
                <div className="landing-header">手ごろな価格で利用可能！</div>
                <div className="landing-body">
                  このサービスは月額
                  <span
                    style={{
                      color: 'red',
                      marginLeft: '5px',
                      marginRight: '5px',
                      fontWeight: 'bold',
                    }}
                  >
                    2500円
                  </span>
                  でご利用いただけます！サインタはあなたが企業を見つけるお手伝いを確実にし、あなたがすべきは印象に集中することだけです！
                  サインタ業務を既に利用している企業には、サインタ募集へのアクセスが無料です！
                  <br></br>
                  <br></br>
                  サインタ募集に別途登録を希望する企業の場合、費用は月額
                  <span
                    style={{
                      color: 'red',
                      marginLeft: '5px',
                      marginRight: '5px',
                      fontWeight: 'bold',
                    }}
                  >
                    10,000円
                  </span>
                  となります。このお手頃な価格設定により、より多くの企業と求職者がお互いを見つけ、
                  成功への一歩を踏み出すチャンスを提供します。ビジネスの可能性を広げ、新たな才能を発掘する絶好の機会を、ぜひサインタで体験してください。
                </div>
              </div>
            </div>

            <div className="separator">separator</div>
          </>
        )}
        {currentMode === 'labo' && (
          <>
            <div className="landing-side-container">
              <img className="landing-side-image" src={lb1} alt="イメージ" />
              <div className="landing-side-text-container">
                <div className="landing-header">
                  ビジネス向けコンテンツ制作をお手伝いします！
                </div>
                <div className="landing-body">
                  ウェブページから広告、チラシまで、必要なものは何でも作成をサポートします！サインタのデザイナーがあなたのスタイルを見つけ、ビジネスを向上させるお手伝いをします。
                  サインタは高品質な作業を提供し、サインタはあなたのビジネスが魅力的なビジュアルによって、より多くの人々に伝わることを願っています。あなたのアイデアやビジョンを実現するために、
                  クリエイティブなチームが一丸となってサポートします。ブランドの価値を高めるプロフェッショナルなコンテンツで、ターゲットオーディエンスに印象づけましょう。サインタと共に、
                  あなたのビジネスを次のステップへと進めてください。
                </div>
              </div>
            </div>

            <div className="landing-side-container">
              <img className="landing-side-image" src={lb2} alt="イメージ" />
              <div className="landing-side-text-container">
                <div className="landing-header">
                  特別な才能とあなたをつなぎます。
                </div>
                <div className="landing-body">
                  サインタは高品質な才能を雇用し、あなたの企業が望むプロジェクトに割り当てます。サインタは仕事に最も適した人材を見つけ、あなたが望むビジョンの実現を支援します。プロジェクトの終了まで、
                  選ばれたサインタの従業員があなたのサポートを受けることができます。サインタは、ビジネスの目標やプロジェクトの成功に不可欠な、特別な才能を提供することにより、
                  あなたの企業の課題を解決し、成長を加速させることを目指しています。
                </div>
              </div>
            </div>

            <div className="landing-side-container">
              <img className="landing-side-image" src={lb3} alt="イメージ" />
              <div className="landing-side-text-container">
                <div className="landing-header">
                  今すぐ無料で見積もりを取得しよう！
                </div>
                <div className="landing-body">
                  ご連絡いただき、詳細をご提供いただければ、サインタは要件を分析し、2～3営業日以内に見積もりを提供します。お支払い後、従業員があなたのプロジェクトに割り当てられ、望ましい結果が得られるまでフルタイム
                  で作業を行います。サインタは高品質なカスタマーサービスを提供し、あなたがビジョンを拡大できるようサポートしたいと願っています。サインタでは、あなたのプロジェクトやビジネスのニーズに応じたカスタマイズ
                  されたソリューションを提供し、目標達成への道を共に歩みます。
                </div>
              </div>
            </div>

            <div className="separator">separator</div>
          </>
        )}
        {currentMode === 'vision' && (
          <>
            <div className="landing-side-container">
              <img className="landing-side-image" src={vs1} alt="イメージ" />
              <div className="landing-side-text-container">
                <div className="landing-header">株式会社サインタのビジョン</div>
                <div className="landing-body">
                  こちらのメッセージは、株式会社サインタの代表取締役社長よりお届けいたします。透明性を重視し、自己紹介とともに当社のビジョンについて少し
                  お話させていただきたいと思います。
                  <br></br> <br></br>
                  真田理志と申します。現在は社長を務めておりますが、過去には日本の企業にて勤めさせていただいておりました。ソフトウェア開発者として活動していた際、
                  日本製のソフトウェアを利用する機会を得て、ERPツールと考えられる多種多様なツールが存在することに気がつきましたが、使い勝手が限られていることやソフトウェアデザインが不十分であることに課題を感じました。
                  <br></br> <br></br>
                  使いやすく、効率的で、成長を目指す日本の企業を支援する最新技術を搭載したツールをいかにして作成できるかを考えました。ユーザーが容易に操れる、
                  直感的なシステムを作りたいという想いから、サインタを創業いたしました。
                  <br></br> <br></br>
                  新しい会社でございますが、今後も機能拡張を図りながら、新たな特長を提供し、ソフトウェアを継続的にアップデートして、サインタに投資してくださる
                  お客様にさらなる品質向上を提供できるよう努めて参ります。
                  <br></br> <br></br>
                  何卒、よろしくお願い申し上げます。
                  <span className="landing_signature">
                    <Furigana furigana="さなだ" kanji="真田" />
                    <Furigana furigana="りし" kanji="理志" />
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <BottomNavbar
        users={users}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        businessSettings={businessSettings}
        setBusinessSettings={setBusinessSettings}
        currentBusiness={currentBusiness}
        setCurrentBusiness={setCurrentBusiness}
      />
    </>
  );
};
export default Landing;
