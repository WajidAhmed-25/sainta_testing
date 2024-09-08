import { useState, useEffect } from 'react';
import { ja } from 'date-fns/locale'; // import the locale you want
import { format, parse } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  faHandshake,
  faPlusCircle,
  faArrowLeft,
  faCircleInfo,
  faTrashAlt,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addLead, removeLead } from '../../store/slices/sales/salesSlice';

const SalesManagement = ({
  currentBusiness,
  currentUser,
  setCurrentUser,
  employees,
  customers,
  products,
  invoices,
  setInvoices,
  leadInfo,
  setLeadInfo,
}) => {
  const leadData = useSelector(state => state.sale.leads);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  registerLocale('ja', ja); // registering local with the name you want

  // Defined state
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedMonthYear, setSelectedMonthYear] = useState(null);

  // Also for the view changing can be lead_information or product_information
  const [currentView, setCurrentView] = useState('lead_information');

  // Now for the lead Statuses
  const [leadStatus] = useState([
    '見込み客', // Prospective customer or new lead
    'フォロー中', // Currently being followed up or in active engagement
    '成約', // Successfully converted into a sale (closed-won)
    '失注', // Lost lead (closed-lost) or lead that has chosen not to proceed
  ]);

  const hasEditPermission =
    currentUser.permissions === 'admin' ||
    currentUser.permissions === 'moderator';

  const handleBackClick = () => navigate('/interface');

  const groupLeadsByMonthYear = leadInfo => {
    const groups = {};

    leadInfo.forEach(lead => {
      const monthYear = format(lead.dateGenerated, 'yyyy年MM月', {
        locale: ja,
      });

      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(lead);
    });

    return groups;
  };

  const handleMonthYearClick = monthYear => {
    setSelectedMonthYear(monthYear);
    setSelectedLead(null);
    setCurrentView('lead_information'); // Also set view to lead_information
    setSelectedProductOfInterest(null); // And deselect the product of interest

    const monthlyLeads = groupLeadsByMonthYear(leadInfo)[monthYear]; // Make sure you have data for this month and year
    // setSelectedDay(format(monthlyInvoices[0].invoice_date, 'yyyy年MM月dd日', { locale: ja }));

    if (monthlyLeads && monthlyLeads.length > 0) {
      // Select first day from the grouped monthly invoices
      setSelectedDay(monthlyLeads[0].dateGenerated, 'yyyy年MM月dd日', {
        locale: ja,
      });
    } else {
      setSelectedDay(null);
    }
  };

  const handleSelectLead = leadId => {
    setSelectedLead(leadInfo.find(lead => lead.id === leadId));
  };

  const handleDayClick = day => {
    setSelectedDay(day);
    const dailyLeads = groupLeadsByDay(leadInfo, selectedMonthYear)[day];
    setSelectedLead(dailyLeads[0]);
  };

  const groupLeadsByDay = (leadInfo, monthYearFilter) => {
    // Filter leads for the selected month and year before grouping them by day
    const filteredLeads = leadInfo.filter(lead => {
      const monthYear = format(lead.dateGenerated, 'yyyy年MM月', {
        locale: ja,
      });
      return monthYear === monthYearFilter;
    });

    const groups = {};

    filteredLeads.forEach(lead => {
      const day = format(lead.dateGenerated, 'dd日', { locale: ja });

      if (!groups[day]) {
        groups[day] = [];
      }
      groups[day].push(lead);
    });

    return groups;
  };

  const orderedMonthYears = () => {
    const groups = groupLeadsByMonthYear(leadInfo);
    return Object.keys(groups).sort((a, b) => {
      const aDate = parse(a, 'yyyy年MM月', new Date(), { locale: ja });
      const bDate = parse(b, 'yyyy年MM月', new Date(), { locale: ja });
      return aDate > bDate ? -1 : 1; // positive value indicates that aDate should come after bDate
    });
  };

  const orderedDays = selectedMonthYear => {
    // Ensure that leads are first filtered by the selected month/year before grouping
    const monthlyLeads = leadInfo.filter(lead => {
      const monthYear = format(lead.dateGenerated, 'yyyy年MM月', {
        locale: ja,
      });
      return monthYear === selectedMonthYear;
    });

    // Then, group the filtered leads by day
    const groups = groupLeadsByDay(monthlyLeads, selectedMonthYear);
    return Object.keys(groups).sort((a, b) => {
      const aDate = parse(a, 'yyyy年MM月dd日', new Date(), { locale: ja });
      const bDate = parse(b, 'yyyy年MM月dd日', new Date(), { locale: ja });
      return aDate - bDate;
    });
  };

  const monthYearList = orderedMonthYears();
  const dayList = selectedMonthYear ? orderedDays(selectedMonthYear) : [];

  // Now for the products of interest (for the leads)
  const [selectedProductOfInterest, setSelectedProductOfInterest] =
    useState(null);

  // Create a useEffect that tracks the current view.
  // There will be a button to return to the previous view, and the view will change depending on whether a product is selected
  useEffect(() => {
    if (selectedLead && selectedProductOfInterest) {
      setCurrentView('product_information');
    } else {
      setCurrentView('lead_information');
    }
  }, [selectedLead, selectedProductOfInterest]);

  // Now define the actionButtons
  // Now define the actionButtons for the lead_information
  // Create a button to navigate to the invoice or create a invoice
  const ActionButtonsLI = () => {
    return (
      <>
        <div className="action-buttons" style={{ marginTop: '15px' }}>
          <button onClick={() => saveLeadInfo()} disabled={!hasEditPermission}>
            <FontAwesomeIcon icon={faSave} fixedWidth />
            保存
          </button>
          <button
            onClick={() => deleteLeadInfo()}
            disabled={!hasEditPermission}
          >
            <FontAwesomeIcon icon={faTrashAlt} fixedWidth />
            削除
          </button>
        </div>
        <div className="action-buttons page" style={{ marginTop: '15px' }}>
          {selectedLead.linked_invoice_id ? (
            <button onClick={() => navigateToInvoice()}>
              <FontAwesomeIcon icon={faCircleInfo} fixedWidth />
              請求書移動
            </button>
          ) : (
            <button
              onClick={() => createNewInvoiceFromLead()}
              disabled={!hasEditPermission}
            >
              <FontAwesomeIcon icon={faPlusCircle} fixedWidth />
              請求書作成
            </button>
          )}
        </div>
      </>
    );
  };

  // handle SaveLeadInfo
  const saveLeadInfo = () => {
    // Update the leadInfo array
    const newLeadInfo = [...leadInfo];
    const leadIndex = newLeadInfo.findIndex(
      lead => lead.id === selectedLead.id,
    );
    newLeadInfo[leadIndex] = selectedLead;
    setLeadInfo(newLeadInfo);
    dispatch(addLead(newLeadInfo)); // adding new leadInfo
  };

  // handle DeleteLeadInfo
  const deleteLeadInfo = () => {
    // Update the leadInfo array
    const newLeadInfo = [...leadInfo];
    const leadIndex = newLeadInfo.findIndex(
      lead => lead.id === selectedLead.id,
    );
    newLeadInfo.splice(leadIndex, 1);
    setLeadInfo(newLeadInfo);
    dispatch(removeLead(newLeadInfo)); // deleting leadInfo
    setSelectedLead(null); // Update the selected lead
    setSelectedMonthYear(null); // Update selected month year
    setSelectedDay(null); // Update selected day
  };

  // Now to create an invoice
  const createNewInvoiceFromLead = () => {
    // Create a new invoice object, grab the last invoice id and add 1 to it
    let lastInvoiceId = 0;
    if (invoices.length > 0) {
      lastInvoiceId = invoices[invoices.length - 1].id;
    }

    const newInvoice = {
      id: lastInvoiceId + 1,
      customer_id: selectedLead.customer_id,
      business_ID: currentUser.business_ID,
      invoice_date: selectedLead.dateGenerated,
      subtotal: null,
      taxes: 0,
      total_amount: null,
      status: 'Unpaid',
      invoice_items: selectedLead.products_of_interest.map(
        productOfInterest => {
          const product = products.find(
            product => product.id === productOfInterest.product_id,
          );
          return {
            product_id: product.id,
            invoice_id: null,
            quantity: productOfInterest.quantity,
            unit_price: product.productPrice,
          };
        },
      ),
    };

    // Add the new invoice to the invoices array
    const newInvoices = [...invoices];
    newInvoices.push(newInvoice);

    // Update the invoices array
    setInvoices(newInvoices);

    // Update the selected lead
    setSelectedLead({ ...selectedLead, linked_invoice_id: newInvoice.id });

    // Update the leads
    const newLeadInfo = [...leadInfo];
    const leadIndex = newLeadInfo.findIndex(
      lead => lead.id === selectedLead.id,
    );
    newLeadInfo[leadIndex].linked_invoice_id = newInvoice.id;
    setLeadInfo(newLeadInfo);
  };

  const navigateToInvoice = () => {
    // Navigate to the invoice, setting currentUser.selectedItem to the invoice and to that linked invoice ID of the lead
    const newCurrentUser = { ...currentUser };
    newCurrentUser.selectedItem = {
      menu: 'invoices',
      selected_id: selectedLead.linked_invoice_id,
    };

    // Update the currentUser
    setCurrentUser(newCurrentUser);

    // Navigate to the invoice
    navigate('/invoices');
  };

  // Same, but for the Product_Information_View
  const ActionButtonsPI = () => {
    return (
      <>
        <div className="action-buttons" style={{ marginTop: '25px' }}>
          <button
            onClick={() => saveProductToLead()}
            disabled={!hasEditPermission}
          >
            <FontAwesomeIcon icon={faSave} fixedWidth />
            保存
          </button>
          <button
            onClick={() => removeProductFromLead()}
            disabled={!hasEditPermission}
          >
            <FontAwesomeIcon icon={faTrashAlt} fixedWidth />
            削除
          </button>
          <button
            onClick={() => {
              setCurrentView('lead_information');
              setSelectedProductOfInterest(null);
            }}
          >
            <FontAwesomeIcon icon={faCircleInfo} fixedWidth />
            リード情報
          </button>
        </div>
      </>
    );
  };

  // Handle saveProductToLead
  const saveProductToLead = () => {
    // Update the leadInfo array
    const newLeadInfo = [...leadInfo];
    const leadIndex = newLeadInfo.findIndex(
      lead => lead.id === selectedLead.id,
    );
    newLeadInfo[leadIndex] = selectedLead;
    setLeadInfo(newLeadInfo);
  };

  // Handle removeProductFromLead
  const removeProductFromLead = () => {
    // Update the leadInfo array
    const newLeadInfo = [...leadInfo];
    const leadIndex = newLeadInfo.findIndex(
      lead => lead.id === selectedLead.id,
    );
    const productIndex = newLeadInfo[leadIndex].products_of_interest.findIndex(
      productOfInterest =>
        productOfInterest.product_id === selectedProductOfInterest.id,
    );
    newLeadInfo[leadIndex].products_of_interest.splice(productIndex, 1);
    setLeadInfo(newLeadInfo);

    // Selected product of interest null
    setSelectedProductOfInterest(null);
  };

  // Now the inputChange handler
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

    // Save the lead
    setSelectedLead({ ...selectedLead, [name]: newValue });
  };

  // now Handlers for ProductSelectionChange && ProductOfInterestChange (controls quantity)
  const handleProductSelectionChange = (productId, e) => {
    // Get the productOfInterest object from the selected lead, if it exists.
    const productOfInterest =
      selectedLead.products_of_interest.find(
        productOfInterest => productOfInterest.product_id === productId,
      ) || {};

    // Update the productOfInterest object
    productOfInterest.product_id = parseInt(e.target.value);

    // Update the selected lead
    setSelectedLead({ ...selectedLead });

    // Update the selected product
    setSelectedProductOfInterest(
      products.find(product => product.id === parseInt(e.target.value)),
    );
  };

  const handleProductOfInterestChange = (productId, e) => {
    // Get the productOfInterest object from the selected lead
    const productOfInterest = selectedLead.products_of_interest.find(
      productOfInterest => productOfInterest.product_id === productId,
    );

    // Update the productOfInterest object
    productOfInterest.quantity = parseInt(e.target.value);

    // Update the selected lead
    setSelectedLead({ ...selectedLead });
  };

  // Handle new product function (adds a product to the lead products_of_interest array with quantity)
  const handleNewProduct = () => {
    // Create a new product of interest object
    // Get the first id that is not already used in the products_of_interest array, and if there are none, just return
    if (selectedLead.products_of_interest.length === products.length) {
      return;
    }

    const productIds = selectedLead.products_of_interest.map(
      productOfInterest => productOfInterest.product_id,
    );
    const newProductId = products.find(
      product => !productIds.includes(product.id),
    ).id;

    const newProductOfInterest = {
      product_id: newProductId,
      quantity: 1,
    };

    // Add the new product of interest to the selected lead
    const newLead = { ...selectedLead };
    newLead.products_of_interest.push(newProductOfInterest);

    // Update the selected lead
    setSelectedLead(newLead);

    // Update the selected product
    setSelectedProductOfInterest(
      products.find(product => product.id === newProductId),
    );
  };

  // Handle new lead function (adds a lead to the leadInfo array)
  const handleNewLead = () => {
    // Create a new lead object
    const newLead = {
      id: leadInfo.length + 1,
      customer_id: null,
      business_ID: currentUser.business_ID,
      employee_id: null,
      status: '見込み客',
      dateGenerated: new Date(),
      expectedCloseDate: new Date(),
      products_of_interest: [],
      linked_invoice_id: null,
      notes: '',
    };

    // Add the new lead to the leadInfo array
    const newLeadInfo = [...leadInfo];
    newLeadInfo.push(newLead);

    // Update the leadInfo array
    setLeadInfo(newLeadInfo);

    // Update the selected lead
    setSelectedLead(newLead);

    // Update selected month year
    setSelectedMonthYear(
      format(newLead.dateGenerated, 'yyyy年MM月', { locale: ja }),
    );

    // Update selected day
    setSelectedDay(format(newLead.dateGenerated, 'dd日', { locale: ja }));
  };

  return (
    <>
      <div className="relative_container">
        <div className="title_container">
          <div className="section_title">
            <FontAwesomeIcon className="faIcon" icon={faHandshake} />
            営業管理
          </div>
          <div className="back_button" onClick={handleBackClick}>
            <FontAwesomeIcon className="faIcon back" icon={faArrowLeft} />
            戻る
          </div>
        </div>
      </div>

      {/* Going to make a start by months, then days, then ids of the leads to select */}
      <div className="management-container">
        <div className="list month-year-list">
          {monthYearList.map(monthYear => (
            <div
              key={monthYear}
              className={`list-item ${
                selectedMonthYear === monthYear ? 'selected' : ''
              }`}
              onClick={() => handleMonthYearClick(monthYear)}
            >
              {monthYear}
            </div>
          ))}
          {hasEditPermission && (
            <>
              <div className="list-item new-button" onClick={handleNewLead}>
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  style={{ marginRight: '10px' }}
                />
                新規リード
              </div>
            </>
          )}
        </div>

        {selectedMonthYear &&
          groupLeadsByMonthYear(leadInfo)[selectedMonthYear] && (
            <div className="list day-list">
              {dayList.map(day => (
                <div
                  key={day}
                  className={`list-item ${
                    selectedDay === day ? 'selected' : ''
                  }`}
                  onClick={() => handleDayClick(day)}
                >
                  {day}
                </div>
              ))}
            </div>
          )}

        {selectedDay &&
          groupLeadsByDay(leadInfo, selectedMonthYear)[selectedDay] && (
            <div className="list lead-list">
              {groupLeadsByDay(leadInfo, selectedMonthYear)[selectedDay].map(
                lead => (
                  <div
                    key={lead.id}
                    className={`list-item ${
                      selectedLead && selectedLead.id === lead.id
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() => handleSelectLead(lead.id)}
                  >
                    {lead.id}
                  </div>
                ),
              )}
            </div>
          )}

        {/* now we map the products to a product list and onClick changes selected product to */}
        {selectedLead && (
          <>
            <div className="list product-list">
              {selectedLead.products_of_interest.map(productOfInterest => {
                const product = products.find(
                  p => p.id === productOfInterest.product_id,
                );
                return (
                  <div
                    key={productOfInterest.product_id}
                    className={`list-item ${
                      selectedProductOfInterest &&
                      selectedProductOfInterest.id ===
                        productOfInterest.product_id
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() => setSelectedProductOfInterest(product)}
                  >
                    {product ? product.productName : '製品を選択してください'}
                  </div>
                );
              })}

              {/* New product to add to the invoice */}
              {hasEditPermission && (
                <>
                  <div
                    className="list-item new-button"
                    onClick={() => handleNewProduct()}
                  >
                    <FontAwesomeIcon
                      icon={faPlusCircle}
                      style={{ marginRight: '10px' }}
                    />
                    新規製品
                  </div>
                </>
              )}
            </div>

            {/* Now we have the lead information view */}
            {selectedLead && currentView === 'lead_information' && (
              <>
                <div className="form-columns-container">
                  <div className="form-column">
                    {/* contains status, employee responsible for generation, and customer */}
                    <h3 className="form-header">基本情報</h3>
                    <div className="form-group">
                      <label htmlFor="status">ステータス</label>
                      <select
                        id="status"
                        name="status"
                        value={selectedLead.status}
                        onChange={handleInputChange}
                        disabled={!hasEditPermission}
                      >
                        {leadStatus.map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="employee_id">担当者</label>
                      <select
                        id="employee_id"
                        name="employee_id"
                        value={selectedLead.employee_id}
                        onChange={handleInputChange}
                        disabled={!hasEditPermission}
                      >
                        {employees.map(employee => (
                          <option key={employee.id} value={employee.id}>
                            {employee.fullName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="customer_id">顧客</label>
                      <select
                        id="customer_id"
                        name="customer_id"
                        value={selectedLead.customer_id}
                        onChange={handleInputChange}
                        disabled={!hasEditPermission}
                      >
                        {customers.map(customer => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-column">
                    {/* contains date generated, expected close date, and notes */}
                    <h3 className="form-header">営業情報</h3>
                    <div className="form-group">
                      <label htmlFor="dateGenerated">見込み客日</label>
                      <DatePicker
                        id="dateGenerated"
                        name="dateGenerated"
                        selected={selectedLead.dateGenerated}
                        onChange={date =>
                          handleInputChange({
                            target: { name: 'dateGenerated', value: date },
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
                      <label htmlFor="expectedCloseDate">成約予定日</label>
                      <DatePicker
                        id="expectedCloseDate"
                        name="expectedCloseDate"
                        selected={selectedLead.expectedCloseDate}
                        onChange={date =>
                          handleInputChange({
                            target: { name: 'expectedCloseDate', value: date },
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
                      <label htmlFor="notes">ノート</label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={selectedLead.notes}
                        onChange={handleInputChange}
                        disabled={!hasEditPermission}
                      />
                    </div>
                  </div>

                  {/* Now another for invoice 請求書 generation -> linkage, etc */}
                  <div className="form-column limit-size">
                    {/* contains invoice ID linked to, with buttons to create invioce, or navigate to invoice */}
                    <h3 className="form-header">請求書情報</h3>

                    {/* integer input for id */}
                    <div className="form-group">
                      <label htmlFor="linked_invoice_id">請求書ID</label>
                      <input
                        id="linked_invoice_id"
                        name="linked_invoice_id"
                        value={selectedLead.linked_invoice_id || '請求書なし'}
                        onChange={handleInputChange}
                        readOnly
                      />
                    </div>

                    {currentView === 'lead_information' && <ActionButtonsLI />}
                  </div>
                </div>
              </>
            )}

            {/* Now we have the product information view */}
            {selectedLead &&
              selectedProductOfInterest &&
              currentView === 'product_information' && (
                <>
                  <div className="form-columns-container">
                    <div className="form-column">
                      {/* contains status, employee responsible for generation, and customer */}
                      <h3 className="form-header">基本情報</h3>
                      <div className="form-group">
                        <label htmlFor="product_id">商品</label>
                        <select
                          id="product_id"
                          name="product_id"
                          value={
                            selectedLead.products_of_interest.find(
                              productOfInterest =>
                                productOfInterest.product_id ===
                                selectedProductOfInterest.id,
                            )?.product_id || 0
                          }
                          onChange={e =>
                            handleProductSelectionChange(
                              selectedProductOfInterest.id,
                              e,
                            )
                          }
                          disabled={!hasEditPermission}
                        >
                          <option
                            value=""
                            selected={!selectedProductOfInterest}
                          >
                            製品を選択してください
                          </option>
                          {products.map(product => (
                            <option key={product.id} value={product.id}>
                              {product.productName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="quantity">数量</label>
                        <input
                          id="quantity"
                          name="quantity"
                          type="number"
                          value={
                            selectedLead.products_of_interest.find(
                              productOfInterest =>
                                productOfInterest.product_id ===
                                selectedProductOfInterest.id,
                            )?.quantity || -1
                          }
                          onChange={e =>
                            handleProductOfInterestChange(
                              selectedProductOfInterest.id,
                              e,
                            )
                          }
                          disabled={!hasEditPermission}
                        />
                      </div>

                      {currentView === 'product_information' && (
                        <ActionButtonsPI />
                      )}
                    </div>
                  </div>
                </>
              )}
          </>
        )}
      </div>
    </>
  );
};
export default SalesManagement;
