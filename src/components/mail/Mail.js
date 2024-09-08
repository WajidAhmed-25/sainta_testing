import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import {
  faEnvelopeOpen,
  faPaperPlane,
  faReply,
  faReplyAll,
  faAt,
  faExclamation,
  faArrowLeft,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Mail.css';

const Mail = ({ users, currentUser, mail, setMail }) => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate('/interface');
  };

  // For replies, new mail, and forwarding, etc.
  const grabTimeAndDate = () => {
    const date = new Date();
    const time = date.getHours() + ':' + date.getMinutes();
    return [date, time];
  };

  const [selectedMail, setSelectedMail] = useState(null);
  const [selectedMailIndex, setSelectedMailIndex] = useState(null); // can be "sent" or "received" or "all"

  const [mailModalOpen, setMailModalOpen] = useState(false);
  const [mailType, setMailType] = useState(null); // can be "new" or "reply" or "forward"

  // For errors
  const [errorType, setErrorType] = useState(null); // can be "recipients" or "subject" or "body"

  const handleNewMail = () => {
    const [date, time] = grabTimeAndDate();
    let last_mail_ID = 0;
    if (mail.length > 0) {
      last_mail_ID = mail[mail.length - 1].id;
    }
    const newMail = {
      id: last_mail_ID + 1,
      parentID: null,
      business_ID: currentUser.business_ID,
      sender_ID: currentUser.id,
      recipient_IDS: [],
      subject: '新メール',
      body: '',
      dateSent: date,
      timeSent: time,
    };

    // Now we need to let the user edit the mail. We will open a modal for this.
    setMailType('new');
    setSelectedMail(newMail);
    setMailModalOpen(true);
  };

  const displayMail = chosenMail => {
    const parseBody = body => {
      // If there are \n\n add <br>, if there is \n one time, just one new line
      const bodyArray = body.split('\n\n');
      const bodyArrayWithBreaks = bodyArray.map(body =>
        body.split('\n').join('<br>'),
      );
      const bodyWithBreaks = bodyArrayWithBreaks.join('<br><br>');
      return <div dangerouslySetInnerHTML={{ __html: bodyWithBreaks }}></div>;
    };

    // if timeSent is for example 19:7, then we need to add a 0 to the minutes
    const timeSentArray = chosenMail.timeSent.split(':');
    if (timeSentArray[1].length === 1) {
      timeSentArray[1] = '0' + timeSentArray[1];
    }
    const timeSent = timeSentArray.join(':');
    chosenMail.timeSent = timeSent;

    // if sender === -829, then it is a system message
    if (chosenMail.sender_ID === -829) {
      // This is a system mail.
      return (
        <>
          <div className="mail-container">
            <div className="mail-header">
              <div className="mail-subject-and-date">
                <div className="mail-subject">{chosenMail.subject}</div>
                <div className="mail-date">
                  {format(chosenMail.dateSent, 'yyyy年MM月dd日')}
                  {chosenMail.timeSent}
                </div>
              </div>
              <div className="mail-sender">送信者: 三田 理志</div>
              <div className="mail-recipients">
                受信者: {currentUser.fullName}
              </div>
            </div>

            <div className="mail-body">{parseBody(chosenMail.body)}</div>
          </div>
        </>
      );
    }

    const sender = users.find(user => user.id === chosenMail.sender_ID);
    const recipients = users.filter(user =>
      chosenMail.recipient_IDS.includes(user.id),
    );

    // Display recipients as a list of names using that user's fullName
    const recipientsList = recipients
      .map(recipient => recipient.fullName)
      .join(', ');

    const body = parseBody(chosenMail.body);
    return (
      <>
        <div className="mail-container">
          <div className="mail-header">
            <div className="mail-subject-and-date">
              <div className="mail-subject">
                {chosenMail.subject === null
                  ? replyMailSubject(chosenMail.parentID)
                  : chosenMail.subject}
              </div>
              <div className="mail-date">
                {format(chosenMail.dateSent, 'yyyy年MM月dd日')}
                {chosenMail.timeSent}
              </div>
            </div>
            <div className="mail-sender">送信者: {sender.fullName}</div>
            <div className="mail-recipients">受信者: {recipientsList}</div>
          </div>

          <div className="mail-body">{body}</div>

          <div className="action-buttons mail">
            <div
              className="action-button mail"
              onClick={() => replyMail(chosenMail, false)}
            >
              <FontAwesomeIcon icon={faReply} style={{ marginRight: '10px' }} />
              返信
            </div>
            <div
              className="action-button mail"
              onClick={() => replyMail(chosenMail, true)}
            >
              <FontAwesomeIcon
                icon={faReplyAll}
                style={{ marginRight: '10px' }}
              />
              全員に返信
            </div>
            <div
              className="action-button mail"
              onClick={() => forwardMail(chosenMail)}
            >
              <FontAwesomeIcon icon={faAt} style={{ marginRight: '10px' }} />
              転送
            </div>
          </div>
        </div>
      </>
    );
  };

  const forwardMail = chosenMail => {
    const [date, time] = grabTimeAndDate();
    let last_mail_ID = 0;
    if (mail.length > 0) {
      last_mail_ID = mail[mail.length - 1].id;
    }

    let subject;
    // if it is a reply, then we need to iterate through the parentMails until we find the first parentMail whose subject is not null
    if (chosenMail.subject === null) {
      // Like a linked list, find the first parent mail whose subject is not null
      let parentMail = mail.find(mail => mail.id === chosenMail.parentID);
      while (parentMail.subject === null) {
        parentMail = mail.find(mail => mail.id === parentMail.parentID);
      }
      subject = 'FW: ' + parentMail.subject;
    } else {
      subject = 'FW: ' + chosenMail.subject;
    }

    let body = 'このメールを転送します。\n===============\n' + chosenMail.body;

    const newMail = {
      id: last_mail_ID + 1,
      parentID: chosenMail.id,
      business_ID: currentUser.business_ID,
      sender_ID: currentUser.id,
      recipient_IDS: [],
      subject: subject,
      body: body,
      dateSent: date,
      timeSent: time,
      isRead: false,
    };

    // Now we need to let the user edit the mail. We will open a modal for this.
    setMailType('forward');
    setSelectedMail(newMail);
    setMailModalOpen(true);
  };

  const replyMail = (chosenMail, toAll) => {
    const [date, time] = grabTimeAndDate();
    let last_mail_ID = 0;
    if (mail.length > 0) {
      last_mail_ID = mail[mail.length - 1].id;
    }

    const allRecipients = [];

    if (toAll) {
      // All recipients of the chosenMail will be recipients of the newMail and sender
      let recipient_list = chosenMail.recipient_IDS;
      recipient_list.push(chosenMail.sender_ID);
      // We need to remove the currentUser.id from the recipient_list
      recipient_list = recipient_list.filter(
        recipient => recipient !== currentUser.id,
      );
      allRecipients.push(...recipient_list);
    } else {
      // Only the first recipient of the chosenMail will be the recipient of the newMail
      const recipient_id = chosenMail.sender_ID;
      allRecipients.push(recipient_id);
    }

    let subject;
    // since it is a reply, we need to add "RE: " to the subject (make sure it has a parent ID)
    if (chosenMail.parentID) {
      // if it is a reply, then we need to iterate through the parentMails until we find the first parentMail whose subject is not null
      let parentMail = mail.find(mail => mail.id === chosenMail.parentID);
      while (parentMail.subject === null) {
        parentMail = mail.find(mail => mail.id === parentMail.parentID);
      }
      subject = 'RE: ' + parentMail.subject;
    } else {
      subject = 'RE: ' + chosenMail.subject;
    }

    const newMail = {
      id: last_mail_ID + 1,
      parentID: chosenMail.id,
      business_ID: currentUser.business_ID,
      sender_ID: currentUser.id,
      recipient_IDS: allRecipients,
      subject: subject,
      body: '',
      dateSent: date,
      timeSent: time,
      isRead: false,
    };

    // Now we need to let the user edit the mail. We will open a modal for this.
    setMailType('reply');
    setSelectedMail(newMail);

    // Also need to set the recipients to the recipients of the chosenMail
    setSelectedRecipients(
      users.filter(user => newMail.recipient_IDS.includes(user.id)),
    );
    setMailModalOpen(true);
  };

  // Return a max of 5 chars + "..." if the string is longer than 5 chars
  const charCutOff = str => {
    if (str && str.length > 5) {
      return str.substring(0, 5) + '...';
    }
    return str;
  };

  const replyMailSubject = parentID => {
    // loop through the parent ids like a linked list and if the mail's subject is null, add as follows
    let parentMail = mail.find(mail => mail.id === parentID);
    while (parentMail.subject === null) {
      parentMail = mail.find(mail => mail.id === parentMail.parentID);
    }
    return 'RE: ' + parentMail.subject;
  };

  // Find recipients by fullName or ID and then show a popup with the recipients and allow the user to select them
  const [filteredRecipients, setFilteredRecipients] = useState(
    users.filter(user => user.id !== currentUser.id),
  );

  const [recipientSearch, setRecipientSearch] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  const handleRecipientSearch = e => {
    const searchTerm = e.target.value;
    setRecipientSearch(searchTerm);

    setFilteredRecipients(
      users.filter(
        user =>
          user.fullName.includes(searchTerm) &&
          user.id !== currentUser.id &&
          !selectedRecipients.find(recipient => recipient.id === user.id),
      ),
    );
  };

  const handleRecipientClick = recipient => {
    if (!selectedRecipients.includes(recipient)) {
      setSelectedRecipients([...selectedRecipients, recipient]);

      // If the recipient is selected, then remove them from the filteredRecipients
      setFilteredRecipients(
        filteredRecipients.filter(rec => rec !== recipient),
      );
    }

    // If all of the recipients are selected, then setFilteredRecipients to an empty array
    if (selectedRecipients.length === users.length - 1) {
      setFilteredRecipients([]);
    }

    // Now we add to the mail.recipient_IDS
    setSelectedMail({
      ...selectedMail,
      recipient_IDS: [...selectedMail.recipient_IDS, recipient.id],
    });
  };
  const recipientPopupRef = useRef(null);

  const handleRemoveRecipient = recipient => {
    setSelectedRecipients(selectedRecipients.filter(rec => rec !== recipient));
    setFilteredRecipients([...filteredRecipients, recipient]);
    setSelectedMail({
      ...selectedMail,
      recipient_IDS: selectedMail.recipient_IDS.filter(
        rec => rec !== recipient.id,
      ),
    });
  };

  useEffect(() => {
    // If there is already a mail from the system, then don't send another one
    let is_system_mail = false;
    mail.forEach(mail => {
      // if there is a mail from the system sent to the currentUser.id, then don't send another one
      if (
        mail.sender_ID === -829 &&
        mail.recipient_IDS.includes(currentUser.id)
      ) {
        is_system_mail = true;
      }
    });

    if (is_system_mail) {
      return;
    } else {
      // We are going to send a system mail to the user that they have a new mail
      const [date, time] = grabTimeAndDate();

      let last_mail_ID = 0;
      if (mail.length > 0) {
        last_mail_ID = mail[mail.length - 1].id;
      }
      const newMail = {
        id: last_mail_ID + 1,
        parentID: null,
        business_ID: currentUser.business_ID,
        sender_ID: -829,
        recipient_IDS: [currentUser.id],
        subject: 'サインタへようこそ。',
        body: '株式会社サインタの社長、三田理志です。\n\nサインタをご利用いただきありがとうございます。サインタをご利用いただき、心より感謝申し上げます。サインタの僕のビジョンについてもう少しお話させていただきたいと思います。僕のソフトウェアを選んでいただき、とても嬉しく思います。小さい頃からずっと、会社を起業したいという夢がありました。ソフトウェアエンジニアの仕事に携わり、物を創造することに常に喜びを感じていました。ある日、ベッドに横たわりながら、サインタのアイデアが生み出されました。そして、このアイデアで成功する本当のチャンスがあると気づいたのです。\n\nサインタのコンセプトはシンプルです。もちろん、同じ目的を達成するための他のソフトウェアも存在します。しかし、サインタに対する僕のビジョンは非常に大きなものです。それが達成可能かどうかに関わらず、僕はその実現に向けて努力を続けるつもりです。ソフトウェアのユーザーの皆さんに個々にメッセージを送ることで、より個人的なレベルで僕を知っていただきたいのです。僕は社長ですが、その前に一人の人間です。\n\n人間として、僕たちは限界を押し広げるチャンスがあります。人生の境界を越えるチャンス、素晴らしいことを成し遂げる機会があるのです。そして僕は、そのような態度で素晴らしい製品を創造したいと願いました。どうすればサインタを競合他社よりも優れたものにできるか考えたとき、直感的で使いやすいユーザーインターフェイスから始めることが良いスタートだと気づきました。\n\n僕は一人でこの会社を始めました。社員もほとんどおらず、資金もほとんどありませんでした。そしてこのメールを書いている時点では、どれだけの成功を収めているかは定かではありません。しかし、成功に関わらず、僕は懸命に努力を続けます。そして、あなたにも同じことを願っています。\n\n世界を変えるチャンスがあなたにもあります。他人の生活にポジティブな影響を与える機会があるのです。それが小さな変化であれ、大きなものであれ、目指し続けるべきことです。努力し続けてください。僕はあなたを応援しています。\n\n今度とも、よろしくお願いいたします。\n三田理志',
        dateSent: date,
        timeSent: time,
        isRead: {
          [currentUser.id]: false,
        },
      };

      // Now send the mail
      setMail([...mail, newMail]);
    }

    function handleClickOutside(event) {
      if (
        recipientPopupRef.current &&
        !recipientPopupRef.current.contains(event.target)
      ) {
        setRecipientPopupOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [recipientPopupRef]);

  // Now a const for the recipient popup that returns a div with the recipients and a search bar
  const recipientPopup = () => {
    return (
      <>
        <div ref={recipientPopupRef} className="recipient-popup">
          <div className="recipient-popup-header">
            <div className="recipient-popup-title">受信者</div>
            <div
              className="recipient-popup-close"
              onClick={() => setRecipientPopupOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
          <div className="recipient-popup-search">
            <input
              type="text"
              value={recipientSearch}
              onChange={e => handleRecipientSearch(e)}
            />
          </div>
          <div className="recipient-popup-list">
            {filteredRecipients.map((recipient, index) => (
              <div
                key={index}
                className="recipient-popup-list-item"
                onClick={() => handleRecipientClick(recipient)}
              >
                {recipient.fullName}
              </div>
            ))}
          </div>
          <div className="recipient-popup-selected">
            {selectedRecipients.map(recipient => (
              <div className="recipient-popup-selected-item">
                {recipient.fullName}
                <div
                  className="recipient-popup-selected-item-remove"
                  onClick={() => handleRemoveRecipient(recipient)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const [recipientPopupOpen, setRecipientPopupOpen] = useState(false);

  // Send mail function
  const sendMail = editingMail => {
    // First, we need to set the recipient_IDS to the selectedRecipients
    editingMail.recipient_IDS = selectedRecipients.map(
      recipient => recipient.id,
    );

    // Now, we need to set the isRead property to false for all recipients
    const isRead = {};
    editingMail.recipient_IDS.forEach(recipient => {
      isRead[recipient] = false;
    });

    // set isRead for the sender to true
    isRead[currentUser.id] = true;
    editingMail.isRead = isRead;

    // Now, we need to update the mail array
    const updatedMail = [...mail, editingMail];
    setMail(updatedMail);

    // Now, we need to close the modal
    setMailModalOpen(false);
  };

  // readMail
  const readMail = chosenMail => {
    // Find the mail in the mail array and set the isRead property to true
    // isRead maps userId to boolean
    const isRead = chosenMail.isRead;
    isRead[currentUser.id] = true;

    // Now, we need to update the mail array
    const updatedMail = mail.map(mail => {
      if (mail.id === chosenMail.id) {
        return { ...mail, isRead: isRead };
      }
      return mail;
    });

    setMail(updatedMail);
    // Now, we need to set the selectedMail to the updatedMail
    setSelectedMail(updatedMail.find(mail => mail.id === chosenMail.id));
  };

  return (
    <>
      <div className="relative_container">
        <div className="title_container">
          <div className="section_title">
            <FontAwesomeIcon className="faIcon" icon={faEnvelopeOpen} />
            メール
          </div>
          <div className="back_button" onClick={handleBackClick}>
            <FontAwesomeIcon className="faIcon back" icon={faArrowLeft} />
            戻る
          </div>
        </div>
      </div>

      <div className="management-container">
        <div className="list mail-types-list">
          <div
            className={`list-item ${
              selectedMailIndex === 'sent' ? 'selected' : ''
            }`}
            onClick={() => {
              setSelectedMailIndex('sent');
              setSelectedMail(null);
            }}
          >
            送信済み{' '}
            {
              // If there are any mails sent by currentUser.id that are unread, then display the number of unread mails
              // That are sent by currentUser.id
              mail.filter(
                mail =>
                  mail.sender_ID === currentUser.id &&
                  !mail.isRead[currentUser.id],
              ).length > 0 && (
                <span className="unread-number">
                  {
                    mail.filter(
                      mail =>
                        mail.sender_ID === currentUser.id &&
                        !mail.isRead[currentUser.id],
                    ).length
                  }
                </span>
              )
            }
          </div>
          <div
            className={`list-item ${
              selectedMailIndex === 'received' ? 'selected' : ''
            }`}
            onClick={() => {
              setSelectedMailIndex('received');
              setSelectedMail(null);
            }}
          >
            受信済み{' '}
            {
              // If there are any mails received by currentUser.id that are unread, then display the number of unread mails
              // That are received by currentUser.id
              mail.filter(
                mail =>
                  mail.recipient_IDS.includes(currentUser.id) &&
                  !mail.isRead[currentUser.id],
              ).length > 0 && (
                <span className="unread-number">
                  {
                    mail.filter(
                      mail =>
                        mail.recipient_IDS.includes(currentUser.id) &&
                        !mail.isRead[currentUser.id],
                    ).length
                  }
                </span>
              )
            }
          </div>
          <div
            className={`list-item ${
              selectedMailIndex === 'all' ? 'selected' : ''
            }`}
            onClick={() => {
              setSelectedMailIndex('all');
              setSelectedMail(null);
            }}
          >
            全て{' '}
            {
              // If there are any sent/recieved mails by currentUser.id that are unread, then display the number of unread mails
              // That are sent/received by currentUser.id
              mail.filter(
                mail =>
                  (mail.sender_ID === currentUser.id ||
                    mail.recipient_IDS.includes(currentUser.id)) &&
                  !mail.isRead[currentUser.id],
              ).length > 0 && (
                <span className="unread-number">
                  {
                    mail.filter(
                      mail =>
                        (mail.sender_ID === currentUser.id ||
                          mail.recipient_IDS.includes(currentUser.id)) &&
                        !mail.isRead[currentUser.id],
                    ).length
                  }
                </span>
              )
            }
          </div>
          <div className="list-item new-button" onClick={() => handleNewMail()}>
            <FontAwesomeIcon
              icon={faPaperPlane}
              style={{ marginRight: '10px' }}
            />
            メール作成
          </div>
        </div>

        {/* display the subjects of the mails as list-items and if selected then will display properly with displayMail */}
        {selectedMailIndex === 'sent' && (
          <>
            <div className="list mail-list">
              {/* map the mails that are sent by currentUser.id */}
              {mail
                .filter(mail => mail.sender_ID === currentUser.id)
                .reverse()
                .map(mail => (
                  <div
                    key={mail.id}
                    className={`list-item ${
                      selectedMail === mail ? 'selected' : ''
                    }`}
                    onClick={() => {
                      setSelectedMail(mail);
                      readMail(mail);
                    }}
                  >
                    {charCutOff(
                      mail.subject === null
                        ? replyMailSubject(mail.parentID)
                        : mail.subject,
                    )}
                    {!mail.isRead[currentUser.id] && (
                      <FontAwesomeIcon
                        icon={faExclamation}
                        style={{ marginLeft: '10px', color: 'red' }}
                      />
                    )}
                  </div>
                ))}
            </div>
          </>
        )}

        {selectedMailIndex === 'received' && (
          <>
            <div className="list mail-list">
              {/* map the mails that are received by currentUser.id, and since subject === null, make subject into RE: + parentMail.subject */}
              {mail
                .filter(mail => mail.recipient_IDS.includes(currentUser.id))
                .reverse()
                .map(mail => (
                  <div
                    key={mail.id}
                    className={`list-item ${
                      selectedMail === mail ? 'selected' : ''
                    }`}
                    onClick={() => {
                      setSelectedMail(mail);
                      readMail(mail);
                    }}
                  >
                    {charCutOff(
                      mail.subject === null
                        ? replyMailSubject(mail.parentID)
                        : mail.subject,
                    )}
                    {!mail.isRead[currentUser.id] && (
                      <FontAwesomeIcon
                        icon={faExclamation}
                        style={{ marginLeft: '10px', color: 'red' }}
                      />
                    )}
                  </div>
                ))}
            </div>
          </>
        )}

        {selectedMailIndex === 'all' && (
          <>
            <div className="list mail-list">
              {mail
                .filter(
                  mail =>
                    mail.sender_ID === currentUser.id ||
                    mail.recipient_IDS.includes(currentUser.id),
                )
                .reverse()
                .map(mail => (
                  <div
                    key={mail.id}
                    className={`list-item ${
                      selectedMail === mail ? 'selected' : ''
                    }`}
                    onClick={() => {
                      setSelectedMail(mail);
                      readMail(mail);
                    }}
                  >
                    {charCutOff(
                      mail.subject === null
                        ? replyMailSubject(mail.parentID)
                        : mail.subject,
                    )}
                    {!mail.isRead[currentUser.id] && (
                      <FontAwesomeIcon
                        icon={faExclamation}
                        style={{ marginLeft: '10px', color: 'red' }}
                      />
                    )}
                  </div>
                ))}
            </div>
          </>
        )}

        {selectedMail && !mailModalOpen && displayMail(selectedMail)}
      </div>

      {/* Modal for creating a new mail */}
      {mailModalOpen && (
        <>
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <button
                  className="close-button"
                  onClick={() => {
                    setMailModalOpen(false);
                    setSelectedMail(null);
                    setSelectedRecipients([]);
                    setErrorType(null);
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="modal-body">
                <h1 className="modal-body-header">
                  {mailType === 'new' && (
                    <>
                      <FontAwesomeIcon
                        icon={faPaperPlane}
                        style={{ marginRight: '15px' }}
                      />
                      メール作成
                    </>
                  )}
                  {mailType === 'reply' && (
                    <>
                      <FontAwesomeIcon
                        icon={faReply}
                        style={{ marginRight: '15px' }}
                      />
                      メール返信
                    </>
                  )}
                  {mailType === 'forward' && (
                    <>
                      <FontAwesomeIcon
                        icon={faAt}
                        style={{ marginRight: '15px' }}
                      />
                      メール転送
                    </>
                  )}
                </h1>
                <p className="modal-body-text">
                  {mailType === 'new' && <>新しいメールを作成します。</>}
                  {mailType === 'reply' && <>メールを返信します。</>}
                  {mailType === 'forward' && <>メールを転送します。</>}
                </p>

                <div className="modal-input-container">
                  <label className="modal-input-label">受信者</label>
                  {!recipientPopupOpen && (
                    <input
                      className="modal-input"
                      type="text"
                      value={selectedRecipients
                        .map(recipient => recipient.fullName)
                        .join(', ')}
                      onClick={() => setRecipientPopupOpen(true)}
                    />
                  )}
                  {recipientPopupOpen && (
                    <input
                      className="modal-input"
                      type="text"
                      value={selectedRecipients
                        .map(recipient => recipient.fullName)
                        .join(', ')}
                      onClick={() => setRecipientPopupOpen(true)}
                    />
                  )}
                  {recipientPopupOpen && recipientPopup()}

                  <label className="modal-input-label">件名</label>
                  <input
                    className="modal-input"
                    type="text"
                    value={selectedMail.subject}
                    onChange={e =>
                      setSelectedMail({
                        ...selectedMail,
                        subject: e.target.value,
                      })
                    }
                  />

                  <label className="modal-input-label">本文</label>
                  <textarea
                    className="modal-input"
                    style={{
                      minHeight: '100px',
                      minWidth: '400px',
                      overflowY: 'scroll',
                    }}
                    type="text"
                    value={selectedMail.body}
                    onChange={e =>
                      setSelectedMail({ ...selectedMail, body: e.target.value })
                    }
                  />

                  {errorType && (
                    <>
                      <div
                        className="modal-input-label-tiny"
                        style={{
                          color: 'red',
                          marginTop: '10px',
                          marginBottom: '10px',
                        }}
                      >
                        {errorType === 'recipients' &&
                          '※ 受信者を選択してください。'}
                        {errorType === 'subject' &&
                          '※ 件名を入力してください。'}
                        {errorType === 'body' && '※ 本文を入力してください。'}
                      </div>
                    </>
                  )}

                  <button
                    className="modal-navigation-button"
                    onClick={() => {
                      if (selectedRecipients.length === 0) {
                        setErrorType('recipients');
                        return;
                      } else if (selectedMail.subject === '') {
                        setErrorType('subject');
                        return;
                      } else if (selectedMail.body === '') {
                        setErrorType('body');
                        return;
                      }
                      // Now, send the mail
                      sendMail(selectedMail);
                      setSelectedRecipients([]);
                    }}
                  >
                    送信
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
export default Mail;
