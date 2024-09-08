import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { usePDF } from '@react-pdf/renderer';
import { useNavigate } from 'react-router-dom';
import { ja } from 'date-fns/locale'; // import the locale you want
import 'react-datepicker/dist/react-datepicker.css';
import { startOfWeek, format, parse } from 'date-fns';
import DatePicker, { registerLocale } from 'react-datepicker';
import Invoice from './Invoice'; // import Invoice component
import {
  addInvoice,
  updateInvoice,
} from '../../store/slices/invoice/invoiceSlice';
import {
  faFileInvoiceDollar,
  faCircleInfo,
  faPlusCircle,
  faArrowLeft,
  faTrashAlt,
  faSave,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// will add a tax section - apr 5 2024
// tax basically should have state
// can be percentage (百分率　か　固定値)
// state that says (percentage or fixed value)
// all the tax of the items goes into the tax value

const Invoices = ({
  currentUser,
  setCurrentUser,
  customers,
  setCustomers,
  products,
  setProducts,
  invoices,
  setInvoices,
  businessSettings,
}) => {
  const invoicesData = useSelector(state => state.invoice.invoices);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  registerLocale('ja', ja); // registering local with the name you want

  // Defined state
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [taxSetting, setTaxSetting] = useState('percentage'); // or 'fixed' (initially)
  const [taxValue, setTaxValue] = useState(0); // initial tax value
  const [currentPage, setCurrentPage] = useState(1); // page can be 1 or 2
  const [currentView, setCurrentView] = useState('invoice_information');

  // First, we are going to do the list grouping for months and years, similar to Expenses.js
  const [selectedMonthYear, setSelectedMonthYear] = useState(null);

  // Defined Invoice component instance
  const [instance, updateInstance] = usePDF({
    document: (
      <Invoice
        invoicesData={invoicesData}
        products={products}
        invoiceId={selectedInvoice?.id}
        customers={customers}
        businessData={businessSettings}
      />
    ),
  });

  // Regulate invoice download button
  const canDownload =
    Boolean(selectedInvoice?.due_date) && Boolean(selectedInvoice?.status);

  const hasEditPermission =
    (currentUser && currentUser.permissions === 'admin') ||
    currentUser.permissions === 'moderator';

  const handleBackClick = () => navigate('/interface');

  const handleMonthYearClick = monthYear => {
    setSelectedMonthYear(monthYear);

    // Also, set the view back to the invoice information as well as selectedInvoice to null
    handleViewChange('invoice_information');
    setSelectedInvoice(null);

    // Make sure you have data for this month and year
    const monthlyInvoices = groupInvoicesByMonthYear(invoices)[monthYear];

    if (monthlyInvoices && monthlyInvoices.length > 0) {
      // Select first day from the grouped monthly invoices
      setSelectedDay(
        format(monthlyInvoices[0].invoice_date, 'yyyy年MM月dd日', {
          locale: ja,
        }),
      );
    } else {
      // If no invoices for this monthYear, clear selected
      setSelectedDay(null);
    }
  };

  const handleDayClick = day => {
    setSelectedDay(day);
    const dailyInvoices = groupInvoicesByDay(invoices, selectedMonthYear)[day];
    setSelectedInvoice(dailyInvoices[0]);
  };

  const groupInvoicesByMonthYear = invoices => {
    const groups = {};

    invoices.forEach(invoice => {
      const monthYear = format(invoice.invoice_date, 'yyyy年MM月', {
        locale: ja,
      });

      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(invoice);
    });

    return groups;
  };

  const groupInvoicesByDay = (invoices, monthYearFilter) => {
    // Filter invoices for the selected month and year before grouping them by day
    const filteredInvoices = invoices.filter(invoice => {
      const monthYear = format(invoice.invoice_date, 'yyyy年MM月', {
        locale: ja,
      });
      return monthYear === monthYearFilter;
    });

    const groups = {};

    filteredInvoices.forEach(invoice => {
      const day = format(invoice.invoice_date, 'dd日', { locale: ja });

      if (!groups[day]) {
        groups[day] = [];
      }
      groups[day].push(invoice);
    });

    return groups;
  };

  const orderedMonthYears = () => {
    const groups = groupInvoicesByMonthYear(invoices);
    return Object.keys(groups).sort((a, b) => {
      const aDate = parse(a, 'yyyy年MM月', new Date(), { locale: ja });
      const bDate = parse(b, 'yyyy年MM月', new Date(), { locale: ja });
      return aDate > bDate ? -1 : 1;
    });
  };

  const orderedDays = selectedMonthYear => {
    // Ensure that the invoices are first filtered by the selected month/year before grouping
    const monthlyInvoices = invoices.filter(invoice => {
      const monthYear = format(invoice.invoice_date, 'yyyy年MM月', {
        locale: ja,
      });
      return monthYear === selectedMonthYear;
    });
    // Then, group the filtered invoices by day
    const groups = groupInvoicesByDay(monthlyInvoices, selectedMonthYear);
    return Object.keys(groups).sort((a, b) => {
      const aDate = parse(a, `yyyy年MM月dd日`, new Date(), { locale: ja });
      const bDate = parse(b, `yyyy年MM月dd日`, new Date(), { locale: ja });
      return aDate - bDate;
    });
  };

  const monthYearList = orderedMonthYears();
  const dayList = selectedMonthYear ? orderedDays(selectedMonthYear) : [];

  const handleSelectInvoice = invoiceId => {
    // Find the invoice in the parent state array
    const invoice = invoices.find(invoice => invoice.id === invoiceId);

    // Update selectedInvoice with a fresh copy of the invoice data
    setSelectedInvoice(invoice ? { ...invoice } : null);
  };

  const getNewInvoiceState = (invoices, products) => {
    // Get the length of invoices
    const lastinvoice = invoices[invoices.length - 1];
    const id = lastinvoice ? lastinvoice.id + 1 : 1;
    // Return a blank invoice state
    return {
      id,
      customer_id: null,
      invoice_date: new Date(),
      due_date: new Date(),
      subtotal: 0,
      taxes: 0,
      total_amount: 0,
      status: 'Unpaid',
      invoice_items: [],
    };
  };

  const handleNewInvoice = () => {
    // Change the view to invoice_information so as to not bug the state
    handleViewChange('invoice_information');

    const newInvoice = { ...getNewInvoiceState(invoices, products) };
    setInvoices([...invoices, newInvoice]);
    setSelectedInvoice(newInvoice);
    setSelectedMonthYear(
      format(newInvoice.invoice_date, 'yyyy年MM月', { locale: ja }),
    );
    setSelectedDay(format(newInvoice.invoice_date, 'dd日', { locale: ja }));
  };

  const handleDateChange = date => {
    const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1 }); // Ensure the week starts on Monday
    return format(startOfWeekDate, 'yyyy-MM-dd'); // Format the date to use as key
  };

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
        newValue = +value;
        break;
      case 'select-multiple': // for <select> with multiple attribute
      default:
        newValue = value;
        break;
    }

    setSelectedInvoice(prevInvoice => ({
      ...prevInvoice,
      [name]: newValue,
    }));
  };

  const handleInvoiceItemChange = (invoiceItemId, e) => {
    // This is going to be for integers and floats
    // We want to continuously update the quantity of the item in the invoices_items array
    // Which means we will change the state of the invoice_items array

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

    setSelectedInvoice(prevInvoice => ({
      ...prevInvoice,
      invoice_items: prevInvoice.invoice_items.map(item => {
        if (item.product_id === invoiceItemId) {
          return {
            ...item,
            [name]: newValue,
            line_total: newValue * item.unit_price,
          };
        } else {
          return item;
        }
      }),
    }));
  };

  const handleProductSelectionChange = (invoiceItemId, e) => {
    // Remember, we are selecting from a dropdown of names which link directly to the IDS of all products
    // So we want to get the product with the ID of the invoiceItemId
    const product = products.find(
      product => product.id === parseInt(e.target.value),
    );
    // Then, we want to update the invoice_items array with the new product
    setSelectedInvoice(prevInvoice => ({
      ...prevInvoice,
      invoice_items: prevInvoice.invoice_items.map(item => {
        if (item.product_id === invoiceItemId) {
          return {
            ...item,
            product_id: product.id,
            unit_price: product.productPrice,
            line_total: product.productPrice * item.quantity,
          };
        } else {
          return item;
        }
      }),
    }));

    // Also, update the selectedProduct
    setSelectedProduct(product);
  };

  const saveInvoice = invoiceToSave => {
    // Get the start of the week for the invoice_date
    const salesWeekDateKey = handleDateChange(invoiceToSave.invoice_date);

    const updatedProducts = products.map(product => {
      // Find the invoice item that corresponds to this product, if any
      const invoiceItem = invoiceToSave.invoice_items.find(
        item => item.product_id === product.id,
      );
      if (!invoiceItem) {
        // If there is no invoice item for this product, we don't need to update it
        return product;
      }

      // Make an immutable update to the product's salesWeek
      const updatedSalesWeek = {
        ...product.salesWeek,
        [salesWeekDateKey]:
          (product.salesWeek[salesWeekDateKey] || 0) + invoiceItem.quantity,
      };

      return {
        ...product,
        salesWeek: updatedSalesWeek,
      };
    });
    setProducts(updatedProducts);

    // Update the invoice in the parent state array
    const updatedInvoices = invoices.map(inv =>
      inv.id === invoiceToSave.id ? invoiceToSave : inv,
    );
    setInvoices(updatedInvoices);

    // UPDATE Database (TODO)
  };

  const deleteInvoice = invoiceToDelete => {
    // Update the invoice in the parent state array
    const newInvoices = invoices.filter(
      invoice => invoice.id !== invoiceToDelete.id,
    );
    setInvoices(newInvoices);

    // UPDATE Database (TODO)

    // If last expense of a month-year/day is deleted, remove the month-year/day from the list
    if (
      !newInvoices.find(
        invoice =>
          format(invoice.invoice_date, 'yyyy年MM月', { locale: ja }) ===
          selectedMonthYear,
      )
    ) {
      setSelectedMonthYear(null);
    }
    if (
      !newInvoices.find(
        invoice =>
          format(invoice.invoice_date, 'dd日', { locale: ja }) === selectedDay,
      )
    ) {
      setSelectedDay(null);
    }
  };

  // Now, we work on the invoiceTable, which has the product_id, quantity, unit_price, line_total
  const handleNewProduct = () => {
    // if there are any products that are id === null, return (in the invoice_items array)
    const nullProduct = selectedInvoice.invoice_items.find(
      invoiceItem => invoiceItem.product_id === null,
    );
    if (nullProduct) return;

    // New invoice item with the existing product details
    const newInvoiceItem = {
      product_id: null,
      invoice_id: selectedInvoice.id,
      quantity: 1, // Assuming you want to start with a quantity of 1
      unit_price: 0,
      line_total: 0,
    };

    // Add new invoice item to invoice_items
    const newInvoiceItems = [...selectedInvoice.invoice_items, newInvoiceItem];
    setSelectedInvoice({
      ...selectedInvoice,
      invoice_items: newInvoiceItems,
    });

    // Also set this product as the selectedProduct
    // setSelectedProduct(null);

    // Switch to the 'product_information' view to possibly edit the newly added product details
    handleViewChange('product_information');
  };

  const saveProductToInvoice = (product, invoice) => {
    // Check if product is already in invoice
    const invoiceItem = invoice.invoice_items.find(
      invoiceItem => invoiceItem.product_id === product.id,
    );
    // If it is, just change the other qualities without pushing a new invoice item
    if (invoiceItem) {
      const index = invoice.invoice_items.findIndex(
        invoiceItem => invoiceItem.product_id === product.id,
      );
      const newInvoiceItems = [...invoice.invoice_items];
      newInvoiceItems[index] = {
        ...invoiceItem,
        quantity: invoiceItem.quantity,
        line_total: invoiceItem.line_total + product.price,
        tax_type: taxSetting,
        tax_amount: taxValue,
      };
      setSelectedInvoice({
        ...invoice,
        invoice_items: newInvoiceItems,
      });
    } else {
      // If it isn't, push a new invoice item
      const newInvoiceItem = {
        product_id: product.id,
        invoice_id: invoice.id,
        quantity: 1,
        unit_price: product.price,
        line_total: product.price,
        tax_type: taxSetting,
        tax_amount: taxValue,
      };
      setSelectedInvoice({
        ...invoice,
        invoice_items: [...invoice.invoice_items, newInvoiceItem],
      });
    }

    // Call the saveInvoice function to update the invoice in the parent state
    saveInvoice(invoice);
  };

  const removeProductFromInvoice = (product, invoice) => {
    const newInvoiceItems = invoice.invoice_items.filter(
      invoiceItem => invoiceItem.product_id !== product.id,
    );
    const updatedInvoice = {
      ...invoice,
      invoice_items: newInvoiceItems,
    };
    setSelectedInvoice(updatedInvoice);

    // Call the saveInvoice function with updatedInvoice to update the invoice in the parent state
    saveInvoice(updatedInvoice);

    // Set selectedProduct to null
    setSelectedProduct(null);
  };

  const handleProductClick = productID => {
    const product = products.find(p => p.id === productID);

    // Create a null product state
    const nullProduct = {
      id: null,
      productName: '',
      productDescription: '',
      productPrice: 0,
      productStockQuantity: 0,
    };

    if (product) {
      setSelectedProduct(product);
      handleViewChange('product_information');
    } else {
      setSelectedProduct(nullProduct);
      handleViewChange('product_information');
    }
  };

  // add a const calculateTaxOfItem = (invoiceItem) => {
  // need to multiply tax by the quantity of the product
  const calculateTaxOfItem = useCallback(
    invoice => {
      let fullTax = 0;
      // iterate through invoice items, if its auto_tax we need to grab the product that fits the invoice item
      // if not autoset then proceed as normal
      // ONLY USE parseFLOATS
      invoice?.invoice_items?.forEach(invoiceItem => {
        const product = products.find(p => p.id === invoiceItem.product_id);
        if (invoiceItem.auto_tax) {
          if (product.taxType === 'percentage') {
            fullTax += parseFloat(
              (product.taxTotal / 100) *
                product.productPrice *
                invoiceItem.quantity,
            );
          } else {
            fullTax += parseFloat(product.taxTotal * invoiceItem.quantity);
          }
        } else {
          if (invoiceItem.tax_type === 'percentage') {
            fullTax += parseFloat(
              (invoiceItem.tax_amount / 100) *
                invoiceItem.unit_price *
                invoiceItem.quantity,
            );
          } else {
            fullTax += parseFloat(
              invoiceItem.tax_amount * invoiceItem.quantity,
            );
          }
        }
      });

      return fullTax;
    },
    [products],
  );

  const handleViewChange = view => {
    if (view === 'invoice_information') {
      setSelectedProduct(null);
    }
    setCurrentView(view);
  };

  // Now define the actionButtons for the Invoice_Information_View
  const ActionsButtonsII = () => {
    return (
      <>
        <div className="action-buttons" style={{ marginTop: '25px' }}>
          <button
            onClick={() => saveInvoice(selectedInvoice)}
            disabled={!hasEditPermission}
          >
            <FontAwesomeIcon icon={faSave} fixedWidth />
            保存
          </button>
          <button
            onClick={() => deleteInvoice(selectedInvoice)}
            disabled={!hasEditPermission}
          >
            <FontAwesomeIcon icon={faTrashAlt} fixedWidth />
            削除
          </button>

          <a
            href={instance.url}
            download="invoice.pdf"
            className={
              !canDownload
                ? 'button-pdf-download disabled'
                : 'button-pdf-download'
            }
          >
            <FontAwesomeIcon icon={faDownload} fixedWidth />
            ダウンロード
          </a>
        </div>
      </>
    );
  };
  // Same, but for the Product_Information_View
  const ActionButtonsPI = () => {
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
            onClick={() =>
              saveProductToInvoice(selectedProduct, selectedInvoice)
            }
            disabled={!hasEditPermission}
          >
            <FontAwesomeIcon icon={faSave} fixedWidth />
            保存
          </button>
          <button
            onClick={() =>
              removeProductFromInvoice(selectedProduct, selectedInvoice)
            }
            disabled={!hasEditPermission}
          >
            <FontAwesomeIcon icon={faTrashAlt} fixedWidth />
            削除
          </button>
          <button onClick={() => handleViewChange('invoice_information')}>
            <FontAwesomeIcon icon={faCircleInfo} fixedWidth />
            請求書情報
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

  // Last, the calculateLineTotal function, subtotal, and final total
  const calculateLineTotal = (invoice, product) => {
    if (!product) return 0;
    const invoiceItem = invoice.invoice_items?.find(
      invoiceItem => invoiceItem.product_id === product.id,
    );
    const productPrice = product.productPrice;
    const quantity = invoiceItem.quantity;
    return productPrice * quantity;
  };

  const calculateSubtotal = useCallback(() => {
    // Make sure you handle the scenario where product is undefined or null
    const lineTotals = selectedInvoice?.invoice_items?.map(invoiceItem => {
      const product = products.find(p => p.id === invoiceItem.product_id);
      if (product) {
        return calculateLineTotal(selectedInvoice, product);
      }
      return 0;
    });
    return lineTotals?.reduce((a, b) => a + b, 0);
  }, [products, selectedInvoice]);

  const calculateFinalTotal = useCallback(() => {
    return calculateSubtotal() + calculateTaxOfItem(selectedInvoice);
  }, [calculateSubtotal, calculateTaxOfItem, selectedInvoice]);

  // Now, the final touch is the unfiltering of already included items onto my invoice's product list
  const getAvailableProducts = () => {
    // Everything but the disabled option
    return products.filter(product => {
      // If the product is already in the invoice, don't include it
      const invoiceItem = selectedInvoice.invoice_items.find(
        invoiceItem => invoiceItem.product_id === product.id,
      );
      if (invoiceItem) {
        return false;
      }
      // Otherwise, include it
      return true;
    });
  };

  // Now, a useEffect to autoselect the currentUser's selected_item
  useEffect(() => {
    if (
      currentUser &&
      currentUser.selectedItem &&
      currentUser.selectedItem.menu === 'invoices'
    ) {
      // Find the invoice in the parent state array
      const invoice = invoices.find(
        invoice => invoice.id === currentUser.selectedItem.selected_id,
      );

      // Update selectedInvoice with a fresh copy of the invoice data
      setSelectedInvoice(invoice ? { ...invoice } : null);

      // Set the selectedMonthYear and selectedDay
      setSelectedMonthYear(
        format(invoice.invoice_date, 'yyyy年MM月', { locale: ja }),
      );
      setSelectedDay(format(invoice.invoice_date, 'dd日', { locale: ja }));

      // Now update currentUser to remove the selectedItem
      const updatedUser = {
        ...currentUser,
        selectedItem: {
          menu: null,
          selected_id: null,
        },
      };

      // Update the currentUser
      setCurrentUser(updatedUser);
    }
  }, [currentUser, invoices, setCurrentUser]);

  // useEffect to update existing invoice with selected invoice
  useEffect(() => {
    const updatedInvoice = {
      ...selectedInvoice,
      subtotal: calculateSubtotal(),
      taxes: calculateTaxOfItem(selectedInvoice),
      total_amount: calculateFinalTotal(),
    };

    if (
      updatedInvoice?.subtotal &&
      updatedInvoice?.taxes &&
      updatedInvoice?.total_amount
    ) {
      dispatch(updateInvoice(updatedInvoice));
    }
  }, [
    dispatch,
    selectedInvoice,
    calculateFinalTotal,
    calculateSubtotal,
    calculateTaxOfItem,
  ]);

  // useEffect to add new invoice to the list
  useEffect(() => {
    const updatedInvoice = {
      ...selectedInvoice,
      subtotal: calculateSubtotal(),
      taxes: calculateTaxOfItem(selectedInvoice),
      total_amount: calculateFinalTotal(),
    };
    if (updatedInvoice?.subtotal) {
      dispatch(addInvoice(updatedInvoice));
    }
  }, [
    dispatch,
    selectedInvoice,
    calculateFinalTotal,
    calculateSubtotal,
    calculateTaxOfItem,
  ]);

  // useEffect to update invoiceData & invoiceId in Invoice component
  useEffect(() => {
    updateInstance(
      <Invoice
        invoicesData={invoicesData}
        products={products}
        invoiceId={selectedInvoice?.id}
        customers={customers}
        businessData={businessSettings}
      />,
    );
  }, [
    updateInstance,
    invoicesData,
    products,
    selectedInvoice,
    businessSettings,
    customers,
  ]);

  // Going for a four column layout, starting with leftmost being MM月YYYY年, then DD日, then the list of invoices, then the list of products on the invoice, then the details section
  return (
    <>
      <div className="relative_container">
        <div className="title_container">
          <div className="section_title">
            <FontAwesomeIcon className="faIcon" icon={faFileInvoiceDollar} />
            請求書
          </div>
          <div className="back_button" onClick={handleBackClick}>
            <FontAwesomeIcon className="faIcon back" icon={faArrowLeft} />
            戻る
          </div>
        </div>
      </div>

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
              <div className="list-item new-button" onClick={handleNewInvoice}>
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  style={{ marginRight: '10px' }}
                />
                新規請求書
              </div>
            </>
          )}
        </div>

        {selectedMonthYear &&
          groupInvoicesByMonthYear(invoices)[selectedMonthYear] && (
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
          groupInvoicesByDay(invoices, selectedMonthYear)[selectedDay] && (
            <div className="list invoice-list">
              {groupInvoicesByDay(invoices, selectedMonthYear)[selectedDay].map(
                invoice => (
                  <div
                    key={invoice.id}
                    className={`list-item ${
                      selectedInvoice && selectedInvoice.id === invoice.id
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() => handleSelectInvoice(invoice.id)}
                  >
                    {invoice.id}
                  </div>
                ),
              )}
            </div>
          )}

        {selectedInvoice && selectedDay && (
          <div className="list invoice-list-products">
            {selectedInvoice.invoice_items?.map((invoiceItem, index) => {
              const product = products.find(
                p => p.id === invoiceItem.product_id,
              );

              // Conditional rendering based on whether a product has been chosen
              return (
                <div
                  key={index} // It's better to use a unique ID instead of index when possible
                  className={`list-item ${
                    selectedProduct &&
                    selectedProduct.id === invoiceItem.product_id
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => handleProductClick(invoiceItem.product_id)}
                >
                  {/* Display product name or a placeholder if product is not selected */}
                  {product ? product.productName : '商品を選択して下さい'}
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
                  新規商品
                </div>
              </>
            )}
          </div>
        )}

        {selectedInvoice && currentView === 'invoice_information' && (
          <>
            <div className="form-columns-container">
              <div className="form-column">
                <h3 className="form-header">請求書情報</h3>
                <div className="form-group">
                  <label htmlFor="invoice_date">請求日</label>
                  <DatePicker
                    id="invoice_date"
                    name="invoice_date"
                    selected={selectedInvoice.invoice_date}
                    onChange={date =>
                      handleInputChange({
                        target: { name: 'invoice_date', value: date },
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
                  <label htmlFor="due_date">支払期限</label>
                  <DatePicker
                    id="due_date"
                    name="due_date"
                    selected={selectedInvoice.due_date}
                    onChange={date =>
                      handleInputChange({
                        target: { name: 'due_date', value: date },
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
                  <label htmlFor="customer_id">顧客</label>
                  <select
                    id="customer_id"
                    name="customer_id"
                    value={selectedInvoice.customer_id}
                    onChange={handleInputChange}
                    disabled={!hasEditPermission}
                  >
                    <option value={0}>他人</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="status">ステータス</label>
                  <select
                    id="status"
                    name="status"
                    value={selectedInvoice.status}
                    onChange={handleInputChange}
                    disabled={!hasEditPermission}
                  >
                    <option value="Unpaid">未払い</option>
                    <option value="Paid">支払い済み</option>
                    <option value="Overdue">遅延</option>
                    <option value="Cancelled">キャンセル</option>
                  </select>
                </div>
              </div>

              <div className="form-column">
                <h3 className="form-header">請求書金額</h3>
                <div className="form-group">
                  <label htmlFor="subtotal">小計</label>
                  <div className="currency-input-group">
                    <span className="currency-label">¥</span>
                    <input
                      id="subtotal"
                      name="subtotal"
                      type="number"
                      value={calculateSubtotal()}
                      onChange={handleInputChange}
                      disabled={!hasEditPermission}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="taxes">税金</label>
                  <div className="currency-input-group">
                    <span className="currency-label">¥</span>
                    <input
                      id="taxes"
                      name="taxes"
                      type="number"
                      value={calculateTaxOfItem(selectedInvoice) || 0}
                      onChange={handleInputChange}
                      disabled={!hasEditPermission}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="total_amount">合計金額</label>
                  <div className="currency-input-group">
                    <span className="currency-label">¥</span>
                    <input
                      id="total_amount"
                      name="total_amount"
                      type="number"
                      value={calculateFinalTotal()}
                      onChange={handleInputChange}
                      disabled={!hasEditPermission}
                    />
                  </div>
                </div>

                {currentView === 'invoice_information' && <ActionsButtonsII />}
              </div>
            </div>
          </>
        )}

        {selectedProduct &&
          selectedInvoice &&
          currentView === 'product_information' && (
            <>
              {currentPage === 1 && (
                <div className="form-columns-container">
                  <div className="form-column">
                    <h3 className="form-header">購入情報</h3>
                    <div className="form-group">
                      <label htmlFor="product_id">商品</label>
                      <select
                        id="product_id"
                        name="product_id"
                        value={
                          selectedInvoice.invoice_items.find(
                            invoiceItem =>
                              invoiceItem.product_id === selectedProduct.id,
                          )?.product_id || 0
                        }
                        onChange={e =>
                          handleProductSelectionChange(selectedProduct.id, e)
                        }
                        disabled={!hasEditPermission}
                      >
                        {!selectedProduct.id && (
                          <option value="" selected={!selectedProduct}>
                            商品を選択して下さい
                          </option>
                        )}
                        {selectedProduct.id && (
                          <option value={selectedProduct.id}>
                            {selectedProduct.productName}
                          </option>
                        )}
                        {getAvailableProducts().map(product => (
                          <option key={product.id} value={product.id}>
                            {product.productName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="males_purchased">男性購入者</label>
                      <input
                        id="male_count"
                        name="male_count"
                        type="number"
                        step={1}
                        value={
                          selectedInvoice.invoice_items.find(
                            invoiceItem =>
                              invoiceItem.product_id === selectedProduct.id,
                          )?.male_count
                        }
                        onChange={e =>
                          handleInvoiceItemChange(selectedProduct.id, e)
                        }
                        disabled={!hasEditPermission}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="females_purchased">女性購入者</label>
                      <input
                        id="female_count"
                        name="female_count"
                        type="number"
                        step={1}
                        value={
                          selectedInvoice.invoice_items.find(
                            invoiceItem =>
                              invoiceItem.product_id === selectedProduct.id,
                          )?.female_count
                        }
                        onChange={e =>
                          handleInvoiceItemChange(selectedProduct.id, e)
                        }
                        disabled={!hasEditPermission}
                      />
                    </div>
                  </div>

                  <div className="form-column">
                    <h3 className="form-header">金額情報</h3>
                    <div className="form-group">
                      <label htmlFor="quantity">数量</label>
                      <input
                        id="quantity"
                        name="quantity"
                        type="number"
                        value={
                          selectedInvoice.invoice_items.find(
                            invoiceItem =>
                              invoiceItem.product_id === selectedProduct.id,
                          )?.quantity || -1
                        }
                        onChange={e =>
                          handleInvoiceItemChange(selectedProduct.id, e)
                        }
                        disabled={!hasEditPermission}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="unit_price">単価</label>
                      <div className="currency-input-group">
                        <span className="currency-label">¥</span>
                        <input
                          id="unit_price"
                          name="unit_price"
                          type="number"
                          value={selectedProduct.productPrice}
                          onChange={e =>
                            handleInvoiceItemChange(selectedProduct.id, e)
                          }
                          disabled={!hasEditPermission}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="line_total">
                        合計金額{' '}
                        <span
                          style={{
                            fontSize: '.75rem',
                            color: '#858585',
                            marginLeft: '5px',
                          }}
                        >
                          {' '}
                          (税金なし)
                        </span>
                      </label>
                      <div className="currency-input-group">
                        <span className="currency-label">¥</span>
                        <input
                          id="line_total"
                          name="line_total"
                          type="number"
                          value={calculateLineTotal(
                            selectedInvoice,
                            selectedProduct,
                          )}
                          onChange={handleInputChange}
                          disabled={!hasEditPermission}
                        />
                      </div>
                    </div>

                    {currentView === 'product_information' && (
                      <ActionButtonsPI />
                    )}
                  </div>
                </div>
              )}

              {currentPage === 2 && (
                <div className="form-columns-container">
                  <div className="form-column">
                    {/* basically gonna look like autosetcost below, but autosettax from product section, which means it will grab taxTotal: null, // product tax which is autoset in products  */}
                    {/* every one of these is initially set to null, but can be set in products */}
                    <h3 className="form-header">税金情報</h3>
                    <div className="form-group">
                      <label
                        htmlFor="taxSetting"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginTop: '10px',
                          marginBottom: '10px',
                        }}
                      >
                        <input
                          type="checkbox"
                          id="taxSetting"
                          name="taxSetting"
                          // use auto_tax === true of invoice item
                          checked={
                            selectedInvoice.invoice_items.find(
                              invoiceItem =>
                                invoiceItem.product_id === selectedProduct.id,
                            )?.auto_tax
                          }
                          disabled={!hasEditPermission}
                          onChange={e => {
                            setSelectedInvoice(prevInvoice => ({
                              ...prevInvoice,
                              invoice_items: prevInvoice.invoice_items.map(
                                item => {
                                  if (item.product_id === selectedProduct.id) {
                                    return {
                                      ...item,
                                      auto_tax: e.target.checked,
                                    };
                                  } else {
                                    return item;
                                  }
                                },
                              ),
                            }));
                          }}
                          style={{ marginRight: '8px' }}
                        />
                        税金設定
                      </label>
                    </div>

                    {/* now its gonna be a dropdown with labe; 計算方法 and options are 百分率＆固定値 auto set to percentage intiially */}
                    <div className="form-group">
                      <label htmlFor="calculationProcess">計算方法</label>
                      <select
                        id="calculationProcess"
                        name="calculationProcess"
                        value={
                          selectedInvoice.invoice_items.find(
                            invoiceItem =>
                              invoiceItem.product_id === selectedProduct.id,
                          )?.auto_tax
                            ? selectedProduct.taxType
                            : taxSetting
                        }
                        onChange={e => {
                          setTaxSetting(e.target.value);
                          // now we want to update the invoice_items tax_amount and tax_type
                          setSelectedInvoice(prevInvoice => ({
                            ...prevInvoice,
                            invoice_items: prevInvoice.invoice_items.map(
                              item => {
                                if (item.product_id === selectedProduct.id) {
                                  return {
                                    ...item,
                                    tax_amount: taxValue,
                                    tax_type: e.target.value,
                                  };
                                } else {
                                  return item;
                                }
                              },
                            ),
                          }));
                        }}
                        disabled={!hasEditPermission}
                      >
                        <option value="percentage">百分率</option>
                        <option value="fixed">固定値</option>
                      </select>
                    </div>

                    {/* now gonna be 入力 with a span label in grey */}
                    {/* its gonna have the currency input symbol a nd either ¥ or % depending on the setTaxsettings */}
                    <div className="form-group">
                      <label htmlFor="taxValue">税金入力</label>
                      <div className="currency-input-group">
                        <span className="currency-label">
                          {selectedInvoice.invoice_items.find(
                            invoiceItem =>
                              invoiceItem.product_id === selectedProduct.id,
                          )?.auto_tax || taxSetting === 'percentage'
                            ? '%'
                            : '¥'}
                        </span>
                        <input
                          id="taxValue"
                          name="taxValue"
                          type="number"
                          value={
                            selectedInvoice.invoice_items.find(
                              invoiceItem =>
                                invoiceItem.product_id === selectedProduct.id,
                            )?.auto_tax
                              ? selectedProduct.taxTotal
                              : taxValue
                          }
                          onChange={
                            // create a function that grabs the invoice_items tax_amount and tax_type and sets it accordingly
                            e => {
                              setTaxValue(e.target.value);
                              // now we want to update the invoice_items tax_amount and tax_type
                              setSelectedInvoice(prevInvoice => ({
                                ...prevInvoice,
                                invoice_items: prevInvoice.invoice_items.map(
                                  item => {
                                    if (
                                      item.product_id === selectedProduct.id
                                    ) {
                                      return {
                                        ...item,
                                        tax_amount: e.target.value,
                                        tax_type: taxSetting,
                                      };
                                    } else {
                                      return item;
                                    }
                                  },
                                ),
                              }));
                            }
                          }
                          disabled={!hasEditPermission}
                        />
                      </div>
                    </div>

                    {currentView === 'product_information' && (
                      <ActionButtonsPI />
                    )}
                  </div>
                </div>
              )}
            </>
          )}
      </div>
    </>
  );
};

export default Invoices;
