import { useEffect, useState } from 'react';
import { ja } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker, { registerLocale } from 'react-datepicker';
import {
  faSave,
  faUsers,
  faTrashAlt,
  faArrowLeft,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  addCustomer,
  removeCustomer,
  updateCustomers,
  addCustomerToDb,
  selectAllcustomers,
  getAllCustomers,
} from '../../store/slices/customer/customerSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// importing css
import '../../assets/css/InterfaceM.css';
import 'react-datepicker/dist/react-datepicker.css';

// utility functions and notification hook
import { useNotification } from '../../hooks/useNotification';
import { formatDateFromString } from '../../utils/utilityFunctions';
import { getURLSearchParams } from '../../utils/getURLSearchParams';

// Define a new customer state (initial)
const initialState = {
  furigana: '',
  phone: '',
  email: '',
  // reconnaisance details 1 pg1
  address: '',
  company: '',
  position: '',
  // reconnaisance details 2 pg1
  dateMet: formatDateFromString('1969年12月31日'),
  lastContact: formatDateFromString('1969年12月31日'),
  nextContact: formatDateFromString('1969年12月31日'),
  // cultural details pg2
  dayBirth: formatDateFromString('1969年12月31日'),
  languagePreference: '日本語',
  preferredContactMethod: '電話',
  // support details pg2
  supportRequired: 'なし',
  supportDetails: '',
  supportSatisfaction: 0,
  // more details, how met, hear about pg2
  methodMet: '紹介',
  hearAbout: '紹介',
  notes: '',
};

export default function CustomerManagement({ currentUser, setCustomers }) {
  // redux-toolkit usage
  const customers = useSelector(selectAllcustomers);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { displayNotification } = useNotification();

  registerLocale('ja', ja); // registering local with the name you want

  // Define customer states and page states
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Define all navigation states
  const handleBackClick = () => navigate('/interface');

  // Edit permis
  const hasEditPermission =
    (currentUser && currentUser?.permissions === 'admin') ||
    currentUser?.permissions === 'moderator';

  // Input changenot
  const handleInputChange = e => {
    const { name, value, type } = e.target;
    let newValue;
    switch (type) {
      case 'number':
        newValue = value === '' ? '' : parseFloat(value);
        break;
      case 'checkbox':
        newValue = e.target.checked;
        break;
      // Add more cases as needed for different types
      case 'text':
      case 'textarea':
      case 'select-one': // for <select> without multiple attribute
      case 'select-multiple': // for <select> with multiple attribute
      default:
        newValue = value;
        break;
    }
    setSelectedCustomer(prevSelectedCustomer => ({
      ...prevSelectedCustomer,
      [name]: newValue,
    }));
  };

  const generateCustomerState = () => {
    if (customers?.length === 0) {
      return {
        id: 1,
        // personal details/basic info pg1
        name: '新顧客',
        business_ID: currentUser.business_ID,
        ...initialState,
      };
    }
    const lastCustomerId = customers[customers?.length - 1].id;
    return {
      id: lastCustomerId + 1,
      // personal details/basic info pg1
      name: '新顧客',
      business_ID: currentUser.business_ID,
      ...initialState,
    };
  };

  const handleNewCustomer = () => {
    const newCustomer = generateCustomerState();
    setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
    dispatch(addCustomer(newCustomer)); // adding new customer;
    setSelectedCustomer(newCustomer);
  };

  const handleSelectCustomer = customerId => {
    const customer = customers.find(c => c.id === customerId);
    setSelectedCustomer(customer);
  };

  const handleSave = async ({ customerToSave }) => {
    const updatedCustomers = customers.map(customer => {
      if (customer.id === customerToSave.id) {
        return customerToSave;
      }
      return customer;
    });
    dispatch(updateCustomers(updatedCustomers)); // adding updated customers
    setCustomers(updatedCustomers);

    // Save to database
    let newObj = { ...customerToSave };
    delete newObj['business_ID'];
    delete newObj['id'];
    delete newObj['dateMet'];
    delete newObj['lastContact'];
    delete newObj['nextContact'];
    delete newObj['dayBirth'];

    const params = await getURLSearchParams({
      customerId: customerToSave?.id,
      dateMet: new Date(customerToSave?.dateMet).toISOString(),
      lastContact: new Date(customerToSave?.lastContact).toISOString(),
      nextContact: new Date(customerToSave?.nextContact).toISOString(),
      dayBirth: new Date(customerToSave?.dayBirth).toISOString(),
      ...newObj,
    });
    dispatch(addCustomerToDb(params));
  };

  const handleDelete = ({ customerToDelete }) => {
    const updatedCustomers = customers.filter(
      customer => customer.id !== customerToDelete.id,
    );
    dispatch(removeCustomer(customerToDelete.id)); // deleting customer
    setCustomers(updatedCustomers);
    setSelectedCustomer(null);
    // TODO: Delete from database
  };

  // Action buttons
  const actionButtons = () => {
    const dimOutCurrentPageButton = pageNumber => {
      if (pageNumber === currentPage) {
        return { opacity: '0.5' };
      }
      return {};
    };
    return (
      <>
        <div className="action-buttons" style={{ marginTop: '25px' }}>
          <button
            onClick={() => handleSave({ customerToSave: selectedCustomer })}
            disabled={!hasEditPermission}
          >
            <FontAwesomeIcon icon={faSave} fixedWidth />
            保存
          </button>
          <button
            onClick={() => handleDelete({ customerToDelete: selectedCustomer })}
            disabled={!hasEditPermission}
          >
            <FontAwesomeIcon icon={faTrashAlt} fixedWidth />
            削除
          </button>
        </div>
        <div className="action-buttons page" style={{ marginTop: '15px' }}>
          <button
            onClick={() => setCurrentPage(1)}
            style={dimOutCurrentPageButton(1)}
          >
            1
          </button>
          <button
            onClick={() => setCurrentPage(2)}
            style={dimOutCurrentPageButton(2)}
          >
            2
          </button>
        </div>
      </>
    );
  };

  // Define page 1's details and page 2's details
  function initialDetails({ customers, setCustomers }) {
    return (
      <>
        <div className="form-columns-container">
          <div className="form-column">
            <h3 className="form-header">基本情報</h3>
            <div className="form-group">
              <label htmlFor="name">名前</label>
              <input
                id="name"
                name="name"
                type="text"
                value={selectedCustomer.name}
                onChange={handleInputChange}
                disabled={!hasEditPermission}
              />
            </div>
            <div className="form-group">
              <label htmlFor="furigana">ふりがな</label>
              <input
                id="furigana"
                name="furigana"
                type="text"
                value={selectedCustomer.furigana}
                onChange={handleInputChange}
                disabled={!hasEditPermission}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">電話番号</label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={selectedCustomer.phone}
                onChange={handleInputChange}
                disabled={!hasEditPermission}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">メールアドレス</label>
              <input
                id="email"
                name="email"
                type="text"
                value={selectedCustomer.email}
                onChange={handleInputChange}
                disabled={!hasEditPermission}
              />
            </div>
          </div>

          <div className="form-column">
            <h3 className="form-header">調査情報</h3>
            <div className="form-group">
              <label htmlFor="address">住所</label>
              <textarea
                id="address"
                name="address"
                value={selectedCustomer.address}
                onChange={handleInputChange}
                disabled={!hasEditPermission}
              />
            </div>
            <div className="form-group">
              <label htmlFor="company">会社名</label>
              <input
                id="company"
                name="company"
                type="text"
                value={selectedCustomer.company}
                onChange={handleInputChange}
                disabled={!hasEditPermission}
              />
            </div>
            <div className="form-group">
              <label htmlFor="position">役職</label>
              <input
                id="position"
                name="position"
                type="text"
                value={selectedCustomer.position}
                onChange={handleInputChange}
                disabled={!hasEditPermission}
              />
            </div>
          </div>

          <div className="form-column">
            <h3 className="form-header">お問い合わせ情報</h3>
            <div className="form-group">
              <label htmlFor="dateMet">初対面日</label>
              <DatePicker
                id="dateMet"
                name="dateMet"
                selected={selectedCustomer.dateMet}
                onChange={date =>
                  handleInputChange({
                    target: { name: 'dateMet', value: date },
                  })
                }
                dateFormat="yyyy年MM月dd日"
                locale="ja"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                className="form-control"
                disabled={!hasEditPermission}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastContact">最終連絡日</label>
              <DatePicker
                id="lastContact"
                name="lastContact"
                selected={selectedCustomer.lastContact}
                onChange={date =>
                  handleInputChange({
                    target: { name: 'lastContact', value: date },
                  })
                }
                dateFormat="yyyy年MM月dd日"
                locale="ja"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                className="form-control"
                disabled={!hasEditPermission}
              />
            </div>
            <div className="form-group">
              <label htmlFor="nextContact">次回連絡日</label>
              <DatePicker
                id="nextContact"
                name="nextContact"
                selected={selectedCustomer.nextContact}
                onChange={date =>
                  handleInputChange({
                    target: { name: 'nextContact', value: date },
                  })
                }
                dateFormat="yyyy年MM月dd日"
                locale="ja"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                className="form-control"
                disabled={!hasEditPermission}
              />
            </div>
            {actionButtons({ customers, setCustomers })}
          </div>
        </div>
      </>
    );
  }

  function otherDetails({ customers, setCustomers }) {
    return (
      <>
        <div className="form-columns-container">
          <div className="form-column">
            <h3 className="form-header">文化情報</h3>
            <div className="form-group">
              <label htmlFor="dayBirth">生年月日</label>
              <DatePicker
                id="dayBirth"
                name="dayBirth"
                selected={selectedCustomer.dayBirth}
                onChange={date =>
                  handleInputChange({
                    target: { name: 'dayBirth', value: date },
                  })
                }
                dateFormat="yyyy年MM月dd日"
                locale="ja"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                className="form-control"
                disabled={!hasEditPermission}
              />
            </div>
            <div className="form-group">
              <label htmlFor="languagePreference">優先言語</label>
              <select
                id="languagePreference"
                name="languagePreference"
                value={selectedCustomer.languagePreference}
                onChange={handleInputChange}
                disabled={!hasEditPermission}
              >
                <option value="日本語">日本語</option>
                <option value="英語">英語</option>
                <option value="中国語">中国語</option>
                <option value="韓国語">韓国語</option>
                <option value="スペイン語">スペイン語</option>
                <option value="フランス語">フランス語</option>
                <option value="ドイツ語">ドイツ語</option>
                <option value="その他">その他</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="preferredContactMethod">優先連絡方法</label>
              <select
                id="preferredContactMethod"
                name="preferredContactMethod"
                value={selectedCustomer.preferredContactMethod}
                onChange={handleInputChange}
                disabled={!hasEditPermission}
              >
                <option value="電話">電話</option>
                <option value="メール">メール</option>
                <option value="訪問">訪問</option>
                <option value="その他">その他</option>
              </select>
            </div>
          </div>

          <div className="form-column">
            <h3 className="form-header">サポート情報</h3>
            <div className="form-group">
              <label htmlFor="supportRequired">サポート</label>
              <select
                id="supportRequired"
                name="supportRequired"
                value={selectedCustomer.supportRequired}
                onChange={handleInputChange}
                disabled={!hasEditPermission}
              >
                <option value="なし">なし</option>
                <option value="あり">あり</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="supportDetails">サポート詳細</label>
              <textarea
                id="supportDetails"
                name="supportDetails"
                value={selectedCustomer.supportDetails}
                onChange={handleInputChange}
                disabled={!hasEditPermission}
              />
            </div>
            <div className="form-group">
              <label htmlFor="supportSatisfaction">満足度</label>
              <input
                id="supportSatisfaction"
                name="supportSatisfaction"
                type="number"
                max={10}
                min={0}
                step={0.5}
                value={selectedCustomer.supportSatisfaction}
                onChange={handleInputChange}
                disabled={!hasEditPermission}
              />
            </div>
          </div>

          <div className="form-column">
            <h3 className="form-header">その他情報</h3>
            <div className="form-group">
              <label htmlFor="methodMet">出会い</label>
              <select
                id="methodMet"
                name="methodMet"
                value={selectedCustomer.methodMet}
                onChange={handleInputChange}
                disabled={!hasEditPermission}
              >
                <option value="紹介">紹介</option>
                <option value="訪問">訪問</option>
                <option value="ネット">ネット</option>
                <option value="その他">その他</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="hearAbout">知った</label>
              <select
                id="hearAbout"
                name="hearAbout"
                value={selectedCustomer.hearAbout}
                onChange={handleInputChange}
                disabled={!hasEditPermission}
              >
                <option value="紹介">紹介</option>
                <option value="訪問">訪問</option>
                <option value="ネット">ネット</option>
                <option value="その他">その他</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="notes">メモ</label>
              <textarea
                id="notes"
                name="notes"
                value={selectedCustomer.notes}
                onChange={handleInputChange}
                disabled={!hasEditPermission}
              />
            </div>
            {actionButtons({ customers, setCustomers })}
          </div>
        </div>
      </>
    );
  }

  useEffect(() => {
    dispatch(getAllCustomers()); // fetching all customers
  }, [dispatch]);

  console.log({ customers });
  console.log({ selectedCustomer });

  return (
    <>
      <div className="relative_container">
        <div className="title_container">
          <div className="section_title">
            <FontAwesomeIcon className="faIcon" icon={faUsers} />
            顧客管理
          </div>
          <div className="back_button" onClick={handleBackClick}>
            <FontAwesomeIcon className="faIcon back" icon={faArrowLeft} />
            戻る
          </div>
        </div>
      </div>

      <div className="management-container">
        <div className="list customer-list">
          {customers.map(customer => (
            <div
              key={customer.id}
              className={`list-item ${
                selectedCustomer && selectedCustomer.id === customer.id
                  ? 'selected'
                  : ''
              }`}
              onClick={() => handleSelectCustomer(customer.id)}
            >
              {customer.name}
            </div>
          ))}
          <div className="list-item new-button" onClick={handleNewCustomer}>
            <FontAwesomeIcon
              icon={faPlusCircle}
              style={{ marginRight: '10px' }}
            />
            新規顧客
          </div>
        </div>
        {selectedCustomer &&
          currentPage === 1 &&
          initialDetails({ customers, setCustomers })}
        {selectedCustomer &&
          currentPage === 2 &&
          otherDetails({ customers, setCustomers })}
      </div>
    </>
  );
}
