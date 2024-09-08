/* さなだ　りし　*/
/* PAYMENT COMPONENT */
/*
    支払い情報を入力するためのコンポーネントです。
    カード情報、支払い方法、支払い回数などを入力します。

    This is the component for entering payment information.
    You will enter card information, payment method, payment frequency, etc.
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  faTimes,
  faCreditCard,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Payment() {
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false); // This is the payment success modal
  const [selectedSection, setSelectedSection] = useState('payment-information'); // payment-information, payment-confirmation

  const handleBackClick = () => {
    // Handle back click here
    navigate('/');
  };

  const [paymentInformation, setPaymentInformation] = useState({
    cardNumber: '',
    formattedCardNumber: '',
    expirationDate: '',
    formattedExpirationDate: '',
    cvv: '',
    cardHolderName: '',
    paymentMethod: 'creditcard', // creditcard
  });

  const handleInputChange = e => {
    const { name, value } = e.target;
    setPaymentInformation({
      ...paymentInformation,
      [name]: value,
    });
  };

  const handleCardNumberChange = e => {
    // Do not add past the 19th digit
    if (e.target.value.length > 19) {
      return;
    }
    // Remove all spaces from the input first to normalize the data
    let cardNumber = e.target.value.replace(/\s+/g, '');
    // Initialize a variable to hold the formatted card number
    let newCardNumber = '';
    // Iterate through the card number and add a space after every four digits
    for (let i = 0; i < cardNumber.length; i++) {
      // Check if the index is multiple of 4 and not the first character
      if (i > 0 && i % 4 === 0) {
        newCardNumber += ' '; // Add space before the new set of four digits
      }
      newCardNumber += cardNumber[i];
    }

    // Update the state with the formatted card number
    setPaymentInformation({
      ...paymentInformation,
      cardNumber: cardNumber,
      formattedCardNumber: newCardNumber,
    });
  };

  const handleExpirationDateChange = e => {
    // Do not add past the 5th digit
    if (e.target.value.length > 5) {
      return;
    }
    // Remove all slashes from the input first to normalize the data
    let expirationDate = e.target.value.replace(/\//g, '');
    // Initialize a variable to hold the formatted expiration date
    let newExpirationDate = '';
    // Iterate through the expiration date and add a slash after the second digit
    for (let i = 0; i < expirationDate.length; i++) {
      // Check if the index is 2 and not the first character
      if (i > 0 && i === 2) {
        newExpirationDate += '/'; // Add slash before the new set of two digits
      }
      newExpirationDate += expirationDate[i];
    }

    // Update the state with the formatted expiration date
    setPaymentInformation({
      ...paymentInformation,
      expirationDate: expirationDate,
      formattedExpirationDate: newExpirationDate,
    });
  };

  const handlePayment = () => {
    // Handle payment here
    setIsModalVisible(true); // Show the payment success modal
  };

  return (
    <>
      {/* 
        
        UNCOMMENT THIS OUT ON THE ACTUAL PAGE
        -------------------------------------

        ONLY FOR COMPONENT TESTING PURPOSES

        */}

      {/* <div className="relative_container">
            <div className="title_container">
            <div className="section_title">
                <FontAwesomeIcon className="faIcon" icon={faCreditCard} />
                お支払い
            </div>
            <div className="back_button" onClick={handleBackClick}>
                <FontAwesomeIcon className="faIcon back" icon={faArrowLeft} />
                戻る
            </div>
            </div>
        </div> */}

      <div className="management-container">
        <div className="list payment-information">
          <div
            className={`list-item ${selectedSection === 'payment-information' ? 'selected' : ''}`}
            onClick={() => setSelectedSection('payment-information')}
          >
            支払い情報
          </div>
          <div
            className={`list-item ${selectedSection === 'payment-confirmation' ? 'selected' : ''}`}
            onClick={() => setSelectedSection('payment-confirmation')}
          >
            支払い確認
          </div>
        </div>

        {selectedSection === 'payment-information' && (
          <div className="form-columns-container">
            <div className="form-column">
              <h3 className="form-header">カード情報</h3>
              <div className="form-group">
                <label htmlFor="cardNumber">カード番号</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentInformation.formattedCardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1000 2000 3000 4000"
                />
              </div>
              <div className="form-group">
                <label htmlFor="expirationDate">
                  有効期限
                  <span
                    style={{
                      fontSize: '.75rem',
                      color: '#858585',
                      marginLeft: '10px',
                    }}
                  >
                    (カードに記載の通り)
                  </span>
                </label>
                <input
                  type="text"
                  id="expirationDate"
                  name="expirationDate"
                  value={paymentInformation.formattedExpirationDate}
                  onChange={handleExpirationDateChange}
                  placeholder="08/29"
                />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">セキュリティコード</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={paymentInformation.cvv}
                  onChange={handleInputChange}
                  placeholder="829"
                />
              </div>
            </div>
            <div className="form-column">
              <h3 className="form-header">カード名義人</h3>
              <div className="form-group">
                <label htmlFor="cardHolderName">
                  名前
                  <span
                    style={{
                      fontSize: '.75rem',
                      color: '#858585',
                      marginLeft: '10px',
                    }}
                  >
                    (カードに記載の通り)
                  </span>
                </label>
                <input
                  type="text"
                  id="cardHolderName"
                  name="cardHolderName"
                  value={paymentInformation.cardHolderName}
                  onChange={handleInputChange}
                  placeholder="名前を入力して下さい"
                />
              </div>
              <div className="form-group">
                <label htmlFor="paymentMethod">支払い方法</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={paymentInformation.paymentMethod}
                  onChange={handleInputChange}
                >
                  <option value="creditcard">クレジットカード</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Just the same thing with the disabled tag */}
        {selectedSection === 'payment-confirmation' && (
          <div className="form-columns-container">
            <div className="form-column">
              <h3 className="form-header">
                カード情報
                <span
                  style={{
                    fontSize: '.8rem',
                    color: 'red',
                    marginLeft: '10px',
                  }}
                >
                  (確認)
                </span>
              </h3>
              <div className="form-group">
                <label htmlFor="cardNumber">カード番号</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentInformation.formattedCardNumber}
                  onChange={handleInputChange}
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="expirationDate">有効期限</label>
                <input
                  type="text"
                  id="expirationDate"
                  name="expirationDate"
                  value={paymentInformation.formattedExpirationDate}
                  onChange={handleInputChange}
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="cvv">セキュリティコード</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={paymentInformation.cvv}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
            </div>

            <div className="form-column">
              <h3 className="form-header">
                カード名義人
                <span
                  style={{
                    fontSize: '.8rem',
                    color: 'red',
                    marginLeft: '10px',
                  }}
                >
                  (確認)
                </span>
              </h3>
              <div className="form-group">
                <label htmlFor="cardHolderName">名前</label>
                <input
                  type="text"
                  id="cardHolderName"
                  name="cardHolderName"
                  value={paymentInformation.cardHolderName}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
              <div className="form-group">
                <label htmlFor="paymentMethod">支払い方法</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={paymentInformation.paymentMethod}
                  onChange={handleInputChange}
                  disabled
                >
                  <option value="creditcard">クレジットカード</option>
                </select>
              </div>

              <div
                className="action-buttons page"
                style={{ marginTop: '25px' }}
              >
                <button onClick={handlePayment}>
                  <FontAwesomeIcon icon={faCreditCard} fixedWidth />
                  支払い
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {isModalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <button className="close-button" onClick={() => navigate('/')}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <h1 className="modal-body-header">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  style={{ marginRight: '15px' }}
                />
                支払いが完了しました
              </h1>
              <p className="modal-body-text">
                お支払いが完了しました。ご利用ありがとうございます。
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
