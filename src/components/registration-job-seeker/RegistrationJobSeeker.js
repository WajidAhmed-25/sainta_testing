import '../../App.css';
import '../../assets/css/InterfaceM.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { faPlus, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import {
  faIdCard,
  faCircleCheck,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';

/*
自分の情報
full name (kanji)
furigana
contact info (email, phone, address - hissu nashi)
birthdate
photo (upload something with a ratio of 600-500px, whats a good ratio? -> 3:4 for vertical, 4:3 for horizontal)
rirekisho, shokumukeirekisho, gakureki, shokai

class for a jobseeker
*/

/*
class JobSeeker [
    ID string (JS + 6 dig random integer)

    PERSONAL INFO
    fullname string
    furigana string
    previous job title string

    PERSONAL CONTACT
    email string
    phone string
    address string

    MORE PERSONAL INFO
    birthdate date (datepicker) string as yyyynen mgetsu hijitu
    area of japan string (select from predefined prefectures)
    photo string pointer to a file (upload)

    SKILLS
    personalstatement string (long to textarea)
    skillsarray array of strings

    FILE
    rirekisho string pointer to a file (upload)
    shokumukeirekisho string pointer to a file (upload)
    soejo or kaba retta string pointer to a file (upload)

    username string
    password string
    passwordconfirm string


    WORK HISTORY
    workhistory array of objects
    [
        {
            company_name string
            job_title string
            start_date date (datepicker) string as yyyynen mgetsu 
            end_date date (datepicker) string as yyyynen mgetsu
            job_description string
        }
    ]
]

class WorkHistory [
    jobseeker_id int
    company_name string
    job_title string
    start_date date (datepicker) string as yyyynen mgetsu 
    end_date date (datepicker) string as yyyynen mgetsu
    job_description string
]

*/
const RegistrationJS = () => {
  useNavigate();

  const areas = [
    '北海道', // Hokkaido
    '青森県', // Aomori
    '岩手県', // Iwate
    '宮城県', // Miyagi
    '秋田県', // Akita
    '山形県', // Yamagata
    '福島県', // Fukushima
    '茨城県', // Ibaraki
    '栃木県', // Tochigi
    '群馬県', // Gunma
    '埼玉県', // Saitama
    '千葉県', // Chiba
    '東京都', // Tokyo
    '神奈川県', // Kanagawa
    '新潟県', // Niigata
    '富山県', // Toyama
    '石川県', // Ishikawa
    '福井県', // Fukui
    '山梨県', // Yamanashi
    '長野県', // Nagano
    '岐阜県', // Gifu
    '静岡県', // Shizuoka
    '愛知県', // Aichi
    '三重県', // Mie
    '滋賀県', // Shiga
    '京都府', // Kyoto
    '大阪府', // Osaka
    '兵庫県', // Hyogo
    '奈良県', // Nara
    '和歌山県', // Wakayama
    '鳥取県', // Tottori
    '島根県', // Shimane
    '岡山県', // Okayama
    '広島県', // Hiroshima
    '山口県', // Yamaguchi
    '徳島県', // Tokushima
    '香川県', // Kagawa
    '愛媛県', // Ehime
    '高知県', // Kochi
    '福岡県', // Fukuoka
    '佐賀県', // Saga
    '長崎県', // Nagasaki
    '熊本県', // Kumamoto
    '大分県', // Oita
    '宮崎県', // Miyazaki
    '鹿児島県', // Kagoshima
    '沖縄県', // Okinawa
  ];

  const [jobSeeker, setJobSeekers] = useState({
    name: '',
    furigana: '',
    previousJobTitle: '',
    email: '',
    phone: '',
    address: '',
    birthdate: '',
    area: '',
    photo: '',
    personalStatement: '',
    skillsArray: [],
    rirekisho: '',
    shokumukeirekisho: '',
    soejoOrKabaRetta: '',
    username: '',
    password: '',
    passwordConfirm: '',
    workHistory: [],
  });

  const [selectedSection, setSelectedSection] = useState(null); // personalinfo, workhistory, skills and files, confirmation
  const [workHistory, setWorkHistory] = useState({
    company_name: '',
    job_title: '',
    address: '',
    start_date: '',
    end_date: '',
    job_description: '',
  });

  const organizeWorkHistory = () => {
    // organize by date (startdate is reduced to month and year)
    // then by end date
    // then by company name

    // sort by start date
    jobSeeker.workHistory.sort((a, b) => {
      if (a.start_date < b.start_date) {
        return -1;
      }
      if (a.start_date > b.start_date) {
        return 1;
      }
      return 0;
    });

    // sort by end date
    jobSeeker.workHistory.sort((a, b) => {
      if (a.end_date < b.end_date) {
        return -1;
      }
      if (a.end_date > b.end_date) {
        return 1;
      }
      return 0;
    });

    // sort by company name
    jobSeeker.workHistory.sort((a, b) => {
      if (a.company_name < b.company_name) {
        return -1;
      }
      if (a.company_name > b.company_name) {
        return 1;
      }
      return 0;
    });

    return jobSeeker.workHistory;
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setJobSeekers({ ...jobSeeker, [name]: value });
  };

  // to register add onclick on button
  const ActionButtonsRegister = () => {
    return (
      <>
        <div className="action-buttons page" style={{ marginTop: '15px' }}>
          <button>
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

  // const actionButtons add
  const ActionButtonsAdd = () => {
    return (
      <>
        <div className="action-buttons page" style={{ marginTop: '25px' }}>
          <button>
            <FontAwesomeIcon
              icon={faPlus}
              style={{ marginRight: '5px' }}
              fixedWidth
            />
            追加
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
            key="personalinfo"
            className={`list-item ${
              selectedSection === 'personalinfo' ? 'selected' : ''
            }`}
            onClick={() => setSelectedSection('personalinfo')}
          >
            基本情報
          </div>
          <div
            key="workhistory"
            className={`list-item ${
              selectedSection === 'workhistory' ? 'selected' : ''
            }`}
            onClick={() => setSelectedSection('workhistory')}
          >
            職歴
          </div>
          <div
            key="skillsandfiles"
            className={`list-item ${
              selectedSection === 'skillsandfiles' ? 'selected' : ''
            }`}
            onClick={() => setSelectedSection('skillsandfiles')}
          >
            他の情報
          </div>
          <div
            key="confirmation"
            className={`list-item ${
              selectedSection === 'confirmation' ? 'selected' : ''
            }`}
            onClick={() => setSelectedSection('confirmation')}
          >
            確認
          </div>
        </div>

        {selectedSection === 'personalinfo' && (
          // first column = name, furigana, previous job title
          // second column = email, phone, address
          // third column = birthdate, area, photo
          <>
            <div className="form-columns-container">
              <div className="form-column">
                <h3 className="form-header">基本情報</h3>

                <div className="form-group">
                  <label htmlFor="name">氏名</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={jobSeeker.name}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="furigana">フリガナ</label>
                  <input
                    type="text"
                    id="furigana"
                    name="furigana"
                    value={jobSeeker.furigana}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="previousJobTitle">前職</label>
                  <input
                    type="text"
                    id="previousJobTitle"
                    name="previousJobTitle"
                    value={jobSeeker.previousJobTitle}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-column">
                <h3 className="form-header">連絡情報</h3>

                <div className="form-group">
                  <label htmlFor="email">メール</label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={jobSeeker.email}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">電話</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={jobSeeker.phone}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">住所</label>
                  <textarea
                    id="address"
                    name="address"
                    value={jobSeeker.address}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-column">
                <h3 className="form-header">その他</h3>

                <div className="form-group">
                  <label htmlFor="birthdate">生年月日</label>
                  <DatePicker
                    id="birthdate"
                    name="birthdate"
                    selected={jobSeeker.birthdate}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="area">地域</label>
                  <select
                    id="area"
                    name="area"
                    value={jobSeeker.area}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="">選択して下さい</option>
                    {areas.map(area => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="photo">写真</label>
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    value={jobSeeker.photo}
                    onChange={handleInputChange}
                    className="form-control"
                  />

                  {/* // only show if the photo is uploaded */}
                  <button className="download-button">
                    <FontAwesomeIcon
                      icon={faDownload}
                      fixedWidth
                      style={{ marginRight: '5px' }}
                    />
                    表示
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedSection === 'workhistory' && (
          // we will make a custom div in the interface that holds the work history
          // as mini squares with the company name, job title, start date, end date
          // and a button to delete the work history (think an X at the top right corner)
          <>
            <div className="form-columns-container">
              <div className="form-column">
                <h3 className="form-header">会社情報</h3>

                <div className="form-group">
                  <label htmlFor="company_name">会社名</label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={workHistory.company_name}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="job_title">職種</label>
                  <input
                    type="text"
                    id="job_title"
                    name="job_title"
                    value={workHistory.job_title}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                {/* address */}
                <div className="form-group">
                  <label htmlFor="address">住所</label>
                  <textarea
                    id="address"
                    name="address"
                    value={workHistory.address}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="form-column">
                <h3 className="form-header">期間と説明</h3>
                {/* datepickers 2 times with month year and setumei */}
                <div className="form-group">
                  <label htmlFor="start_date">開始日</label>
                  <DatePicker
                    id="start_date"
                    name="start_date"
                    selected={workHistory.start_date}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="end_date">終了日</label>
                  <DatePicker
                    id="end_date"
                    name="end_date"
                    selected={workHistory.end_date}
                    onChange={handleInputChange}
                    className="form-control"
                  />

                  {/* radio to change string to 現在 */}

                  <label
                    htmlFor="current"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <input
                      type="checkbox"
                      id="current"
                      name="current"
                      checked={workHistory.current}
                      onChange={e => {
                        const { name, checked } = e.target;
                        let newValue;
                        newValue = checked;
                        const updatedWorkHistory = {
                          ...workHistory,
                          [name]: newValue,
                        };
                        setWorkHistory(updatedWorkHistory);

                        // disable end date if current is checked
                        if (checked) {
                          document.getElementById('end_date').disabled = true;
                        } else {
                          document.getElementById('end_date').disabled = false;
                        }
                      }}
                      style={{ marginRight: '8px' }}
                    />
                    現在
                  </label>
                </div>

                <div className="form-group">
                  <label htmlFor="job_description">
                    仕事内容
                    <span
                      style={{
                        fontSize: '.75rem',
                        color: '#858585',
                        marginLeft: '5px',
                      }}
                    >
                      (一、二文で)
                    </span>
                  </label>

                  <textarea
                    id="job_description"
                    name="job_description"
                    value={workHistory.job_description}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                {/* add button */}
                <ActionButtonsAdd />
              </div>

              <div className="form-column">
                <h3 className="form-header">職歴</h3>

                <div className="work-history-container">
                  <div className="work-history-box">
                    <div className="work-history-box-header-delete">
                      <FontAwesomeIcon icon={faDeleteLeft} fixedWidth />
                    </div>

                    <div className="work-history-box-header">
                      {/* company name and date is top right corner */}
                      <div className="work-history-box-header-text">
                        <span id="header-company">株式会社サインタ</span>
                        <span id="header-date">8月2023年 - 現在</span>
                      </div>
                    </div>

                    <div className="work-history-box-content">
                      <div className="work-history-box-content-text">
                        <span>社長</span>
                        <span>全てをやります</span>
                      </div>
                    </div>
                  </div>

                  <div className="work-history-box">
                    <div className="work-history-box-header-delete">
                      <FontAwesomeIcon icon={faDeleteLeft} fixedWidth />
                    </div>

                    <div className="work-history-box-header">
                      {/* company name and date is top right corner */}
                      <div className="work-history-box-header-text">
                        <span id="header-company">株式会社アドバンテック</span>
                        <span id="header-date">8月2023年 - 3月2024年</span>
                      </div>
                    </div>

                    <div className="work-history-box-content">
                      <div className="work-history-box-content-text">
                        <span>IOTサポート</span>
                        <span>メールでの対応</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedSection === 'skillsandfiles' && (
          // all files through upload (use previous file structure)
          <>
            <div className="form-columns-container">
              <div className="form-column">
                <h3 className="form-header">必要なファイル</h3>

                <div className="form-group">
                  <label htmlFor="rirekisho">履歴書</label>
                  <input
                    type="file"
                    id="rirekisho"
                    name="rirekisho"
                    value={jobSeeker.rirekisho}
                    onChange={handleInputChange}
                    className="form-control"
                  />

                  <button className="download-button">
                    <FontAwesomeIcon
                      icon={faDownload}
                      fixedWidth
                      style={{ marginRight: '5px' }}
                    />
                    表示
                  </button>
                </div>

                <div className="form-group">
                  <label htmlFor="shokumukeirekisho">職務経歴書</label>
                  <input
                    type="file"
                    id="shokumukeirekisho"
                    name="shokumukeirekisho"
                    value={jobSeeker.shokumukeirekisho}
                    onChange={handleInputChange}
                    className="form-control"
                  />

                  <button className="download-button">
                    <FontAwesomeIcon
                      icon={faDownload}
                      fixedWidth
                      style={{ marginRight: '5px' }}
                    />
                    表示
                  </button>
                </div>

                <div className="form-group">
                  <label htmlFor="soejoOrKabaRetta">添付書類</label>
                  <input
                    type="file"
                    id="soejoOrKabaRetta"
                    name="soejoOrKabaRetta"
                    value={jobSeeker.soejoOrKabaRetta}
                    onChange={handleInputChange}
                    className="form-control"
                  />

                  <button className="download-button">
                    <FontAwesomeIcon
                      icon={faDownload}
                      fixedWidth
                      style={{ marginRight: '5px' }}
                    />
                    表示
                  </button>
                </div>
              </div>

              <div className="form-column">
                {/* personal statement, skill name and add button */}
                <h3 className="form-header">スキル</h3>

                <div className="form-group">
                  <label htmlFor="personalStatement">自己紹介</label>
                  <textarea
                    id="personalStatement"
                    name="personalStatement"
                    value={jobSeeker.personalStatement}
                    onChange={handleInputChange}
                    className="form-control"
                    style={{ height: '200px' }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="skillsArray">スキル</label>
                  <input
                    type="text"
                    id="skillsArray"
                    name="skillsArray"
                    value={jobSeeker.skillsArray}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                {/* add button */}
                <ActionButtonsAdd />
              </div>

              <div className="form-column">
                {/* just like the workhistory boxes */}
                <h3 className="form-header">スキルリスト</h3>

                <div className="skill-container">
                  <div className="skill-list-box">
                    <div className="skill-list-box-header-delete">
                      <FontAwesomeIcon icon={faDeleteLeft} fixedWidth />
                    </div>
                    <div className="skill-name">
                      <span>プログラミング</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default RegistrationJS;

// {
//   <div className="management-container">
//     <div className="list settings-list">
//       <div
//         key="businessSettings"
//         className={`list-item ${
//           selectedPart === "businessSettings" ? "selected" : ""
//         }`}
//         onClick={() => setSelectedPart("businessSettings")}
//       >
//         会社情報
//       </div>
//       <div
//         key="selfinfo"
//         className={`list-item ${selectedPart === "selfinfo" ? "selected" : ""}`}
//         onClick={() => setSelectedPart("selfinfo")}
//       >
//         自分の情報
//       </div>
//       <div
//         key="confirmation"
//         className={`list-item ${
//           selectedPart === "confirmation" ? "selected" : ""
//         }`}
//         onClick={() => setSelectedPart("confirmation")}
//       >
//         確認
//       </div>
//     </div>

//     {selectedPart === "businessSettings" && (
//       <div className="form-columns-container">
//         <div className="form-column">
//           <h3 className="form-header">会社情報</h3>

//           <div className="form-group">
//             <label htmlFor="id">サインタID</label>
//             <input
//               style={{ color: "#858585" }}
//               type="text"
//               id="id"
//               name="id"
//               value={generatedID}
//               onChange={handleInputChange}
//               className="form-control"
//               readOnly
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="name">会社名</label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={businessToCreate.name}
//               onChange={handleInputChange}
//               className="form-control"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="address">住所</label>
//             <textarea
//               id="address"
//               name="address"
//               value={businessToCreate.address}
//               onChange={handleInputChange}
//               className="form-control"
//             />
//           </div>
//         </div>

//         {/* Now registration information (plan year/month bill, etc) */}
//         <div className="form-column">
//           <h3 className="form-header">登録情報</h3>

//           <div className="form-group">
//             <label htmlFor="plan">選んだプラン</label>
//             <input
//               style={{ color: "#858585" }}
//               type="text"
//               id="plan"
//               name="plan"
//               value={businessToCreate.plan}
//               onChange={handleInputChange}
//               className="form-control"
//               readOnly
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="billingCycle">請求周期</label>
//             <input
//               style={{ color: "#858585" }}
//               type="text"
//               id="billingCycle"
//               name="billingCycle"
//               value={businessToCreate.billingCycle}
//               onChange={handleInputChange}
//               className="form-control"
//               readOnly
//             />
//           </div>
//         </div>

//         <div className="form-column">
//           <h3 className="form-header">登録期間</h3>

//           <div className="form-group">
//             <label htmlFor="registrationStart">登録開始</label>
//             <input
//               style={{ color: "#858585" }}
//               type="text"
//               id="registrationStart"
//               name="registrationStart"
//               value={format(
//                 businessToCreate.registrationDate,
//                 "yyyy年MM月dd日",
//                 { locale: ja }
//               )}
//               onChange={handleInputChange}
//               className="form-control"
//               readOnly
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="registrationEnd">登録終了</label>
//             <input
//               style={{ color: "#858585" }}
//               type="text"
//               id="registrationEnd"
//               name="registrationEnd"
//               value={format(
//                 businessToCreate.registrationEnd,
//                 "yyyy年MM月dd日",
//                 { locale: ja }
//               )}
//               onChange={handleInputChange}
//               className="form-control"
//               readOnly
//             />
//           </div>
//         </div>
//       </div>
//     )}

//     {selectedPart === "selfinfo" && (
//       <div className="form-columns-container">
//         <div className="form-column">
//           <h3 className="form-header">自分の情報</h3>

//           <div className="form-group">
//             <label htmlFor="id">
//               従業員ID{" "}
//               <span
//                 style={{
//                   fontSize: ".75rem",
//                   color: "#858585",
//                   marginLeft: "5px",
//                 }}
//               >
//                 (数字のみ)
//               </span>
//             </label>
//             <input
//               type="text"
//               id="id"
//               name="id"
//               value={inputInformation.id}
//               onChange={handleInputChange_UserInfo}
//               className="form-control"
//             />
//           </div>

//           {/* Username */}
//           <div className="form-group">
//             <label htmlFor="fullName">
//               ユーザー名{" "}
//               <span
//                 style={{
//                   fontSize: ".75rem",
//                   color: "#858585",
//                   marginLeft: "5px",
//                 }}
//               >
//                 (最大長12字)
//               </span>
//             </label>
//             <input
//               type="text"
//               id="username"
//               name="username"
//               value={inputInformation.username}
//               onChange={handleInputChange_UserInfo}
//               className="form-control"
//               maxLength="12"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">
//               パスワード{" "}
//               <span
//                 style={{
//                   fontSize: ".75rem",
//                   color: "#858585",
//                   marginLeft: "5px",
//                 }}
//               >
//                 (最大長20字)
//               </span>
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={inputInformation.password}
//               onChange={handleInputChange_UserInfo}
//               className="form-control"
//               maxLength="20"
//             />
//           </div>
//         </div>

//         {/* Now fullName, Furigana, Department */}
//         <div className="form-column">
//           <h3 className="form-header">個人情報</h3>

//           <div className="form-group">
//             <label htmlFor="fullName">氏名</label>
//             <input
//               type="text"
//               id="fullName"
//               name="fullName"
//               value={inputInformation.fullName}
//               onChange={handleInputChange_UserInfo}
//               className="form-control"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="furigana">フリガナ</label>
//             <input
//               type="text"
//               id="furigana"
//               name="furigana"
//               value={inputInformation.furigana}
//               onChange={handleInputChange_UserInfo}
//               className="form-control"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="department">部署</label>
//             <select
//               id="department"
//               name="department"
//               value={inputInformation.department}
//               onChange={handleInputChange_UserInfo}
//               className="form-control"
//             >
//               <option value="">選択して下さい</option>
//               {departments.map((department) => (
//                 <option key={department.id} value={department.name}>
//                   {department.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>
//     )}

//     {selectedPart === "confirmation" && (
//       <>
//         <div className="form-columns-container">
//           <div className="form-column">
//             <h3 className="form-header">会社情報</h3>

//             <div className="form-group">
//               <label htmlFor="id">サインタID</label>
//               <input
//                 style={{ color: "#858585" }}
//                 type="text"
//                 id="id"
//                 name="id"
//                 value={generatedID}
//                 onChange={handleInputChange}
//                 className="form-control"
//                 readOnly
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="name">会社名</label>
//               <input
//                 style={{ color: "#858585" }}
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={businessToCreate.name}
//                 onChange={handleInputChange}
//                 className="form-control"
//                 readOnly
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="address">住所</label>
//               <textarea
//                 style={{ color: "#858585" }}
//                 id="address"
//                 name="address"
//                 value={businessToCreate.address}
//                 onChange={handleInputChange}
//                 className="form-control"
//                 readOnly
//               />
//             </div>
//           </div>

//           <div className="form-column">
//             <h3 className="form-header">自分の情報</h3>

//             <div className="form-group">
//               <label htmlFor="id">従業員ID</label>
//               <input
//                 style={{ color: "#858585" }}
//                 type="text"
//                 id="id"
//                 name="id"
//                 value={inputInformation.id}
//                 onChange={handleInputChange_UserInfo}
//                 className="form-control"
//                 readOnly
//               />
//             </div>

//             {/* Username */}
//             <div className="form-group">
//               <label htmlFor="fullName">ユーザー名</label>
//               <input
//                 style={{ color: "#858585" }}
//                 type="text"
//                 id="username"
//                 name="username"
//                 value={inputInformation.username}
//                 onChange={handleInputChange_UserInfo}
//                 className="form-control"
//                 readOnly
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="password">パスワード</label>
//               <input
//                 style={{ color: "#858585" }}
//                 id="password"
//                 name="password"
//                 value={inputInformation.password}
//                 onChange={handleInputChange_UserInfo}
//                 className="form-control"
//                 readOnly
//               />
//             </div>
//           </div>

//           <div className="form-column">
//             <h3 className="form-header">個人情報</h3>

//             <div className="form-group">
//               <label htmlFor="fullName">氏名</label>
//               <input
//                 style={{ color: "#858585" }}
//                 type="text"
//                 id="fullName"
//                 name="fullName"
//                 value={inputInformation.fullName}
//                 onChange={handleInputChange_UserInfo}
//                 className="form-control"
//                 readOnly
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="furigana">フリガナ</label>
//               <input
//                 style={{ color: "#858585" }}
//                 type="text"
//                 id="furigana"
//                 name="furigana"
//                 value={inputInformation.furigana}
//                 onChange={handleInputChange_UserInfo}
//                 className="form-control"
//                 readOnly
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="department">部署</label>
//               <input
//                 style={{ color: "#858585" }}
//                 id="department"
//                 name="department"
//                 value={inputInformation.department}
//                 onChange={handleInputChange_UserInfo}
//                 className="form-control"
//                 readOnly
//               ></input>
//             </div>

//             {/* span with grey style informing user all the details can be changed later */}
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 flex: 1,
//                 marginTop: "15px",
//                 marginBottom: "20px",
//                 maxWidth: "230px",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: ".75rem",
//                   color: "#858585",
//                   marginLeft: "5px",
//                   marginBottom: "7.5px",
//                 }}
//               >
//                 ※
//                 サインタIDを忘れないようにして下さい。ログインする時に必要です。
//               </span>

//               <span
//                 style={{
//                   fontSize: ".75rem",
//                   color: "#858585",
//                   marginLeft: "5px",
//                 }}
//               >
//                 ※ 後で設定を変更できます。
//               </span>
//             </div>
//             {ActionButtons()}
//           </div>
//         </div>
//       </>
//     )}
//   </div>;
// }
