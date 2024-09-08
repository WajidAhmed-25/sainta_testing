import { useState } from 'react';
// import { startOfWeek } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  faSave,
  faBoxes,
  faTrashAlt,
  faArrowLeft,
  faPlusCircle,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  updateProducts,
  selectAllproducts,
} from '../../store/slices/product/productSlice';
import 'react-datepicker/dist/react-datepicker.css';

const ProductManagement = ({ currentUser, inventory, setProducts }) => {
  let products = useSelector(selectAllproducts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log({ products });

  // Product types
  const [productTypes] = useState([
    {
      id: 1,
      productType: '物理的製品',
      canHaveItems: true,
    },
    {
      id: 2,
      productType: '消耗品',
      canHaveItems: true,
    },
    {
      id: 3,
      productType: 'サービス商品',
      canHaveItems: false,
    },
    {
      id: 4,
      productType: 'デジタル製品',
      canHaveItems: false,
    },
    {
      id: 5,
      productType: '他の商品',
      canHaveItems: false,
    },
  ]);

  // Edit permis
  const hasEditPermission =
    (currentUser && currentUser.permissions === 'admin') ||
    currentUser.permissions === 'moderator';

  // For selection
  const [selectedProduct, setSelectedProduct] = useState(null);

  // For canHaveItems
  const canSelectProductHaveItems = selectedProduct => {
    if (selectedProduct) {
      // Find the productType that matches the selectedProduct's productType
      const productType = productTypes.find(
        productType => productType.productType === selectedProduct.productType,
      );
      return productType.canHaveItems;
    }
    return false;
  };

  // For the inventory menu
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);

  // For the selectedDate to view sales per week, etc.
  // const [selectedDate, setSelectedDate] = useState(() =>
  //   startOfWeek(new Date(), { weekStartsOn: 1 }),
  // );

  // For the view type (we have either product_details or inventory_details)
  const [viewType, setViewType] = useState('product_details'); // product_details, inventory_details

  // HandlebackClick
  const handleBackClick = () => {
    navigate('/interface');
  };

  // Placeholder function that should calculate the product cost
  const unitConversions = {
    g: 1, // grams to grams
    kg: 1000, // kilograms to grams
    mg: 1 / 1000, // milligrams to grams
    ml: 1, // milliliters to milliliters
    L: 1000, // liters to milliliters
  };

  // Convert the volume value from the specified unit to grams or milliliters
  const convertToBaseUnit = (value, unit) => {
    return value * (unitConversions[unit] || 1);
  };

  const calculateProductCost = productObj => {
    const product = JSON.parse(JSON.stringify({ ...productObj }));
    if (product && !product.autoSetCost) {
      return product.productCost || 0;
    } else if (product && product.inventoryUsed && product.autoSetCost) {
      return product.inventoryUsed.reduce((totalCost, itemUsage) => {
        const inventoryItem = inventory.find(
          invItem => invItem.id === itemUsage.id,
        );

        if (inventoryItem) {
          // Convert both the used volume and the item's volume per item to the same unit before calculating the cost
          const usedVolumeInBaseUnit = convertToBaseUnit(
            itemUsage.volumeUsed,
            itemUsage.volumeUnit,
          );
          const volumePerItemInBaseUnit = convertToBaseUnit(
            inventoryItem.volumePerItem,
            inventoryItem.volumeUnit,
          );

          // Now calculate the cost proportionally
          const costForUsedVolume =
            (usedVolumeInBaseUnit / volumePerItemInBaseUnit) *
            inventoryItem.costPrice;

          let newCost;
          newCost = totalCost + costForUsedVolume;
          newCost = Math.round((newCost + Number.EPSILON) * 100) / 100;

          // Save the new cost to the product
          product.productCost = newCost;
          return newCost;
        }

        // round to 2 decimal places
        return totalCost;
      }, 0);
    }
    return 0;
  };

  // Now we would use this method to set the product cost for each product.
  // This might typically occur after retrieval of the list of products or upon adding/updating an item.
  products = products.map(prod => ({
    ...prod,
    productCost: calculateProductCost(prod),
  }));

  // All the infoChange functions (first productInfo)
  const handleProductInfoChange = event => {
    const { name, value } = event.target;
    setSelectedProduct({
      ...selectedProduct,
      [name]: value,
    });
  };

  // Now handleSaveProductInfo  & handleDeleteProductInfo
  const handleSaveProductInfo = () => {
    // Save the product info & update the product list as well as the selectedProduct
    const updatedProducts = products.map(product => {
      if (product.id === selectedProduct.id) {
        return selectedProduct;
      }
      return product;
    });
    dispatch(updateProducts(updatedProducts)); // updating product list
    setProducts(updatedProducts);
    setSelectedProduct(selectedProduct);
  };

  const handleDeleteProductInfo = () => {
    // Delete the product info & update the product list as well as the selectedProduct
    const updatedProducts = products.filter(
      product => product.id !== selectedProduct.id,
    );
    dispatch(updateProducts(updatedProducts)); // updating product list aftre delete
    setProducts(updatedProducts);
    setSelectedProduct(null);
  };

  // Now, adding the actionButtons
  const ActionButtonsPI = () => {
    return (
      <>
        <div className="action-buttons" style={{ marginTop: '20px' }}>
          <button className="action-button" onClick={handleSaveProductInfo}>
            <FontAwesomeIcon icon={faSave} style={{ marginRight: '10px' }} />
            保存
          </button>
          <button className="action-button" onClick={handleDeleteProductInfo}>
            <FontAwesomeIcon
              icon={faTrashAlt}
              style={{ marginRight: '10px' }}
            />
            削除
          </button>
        </div>
      </>
    );
  };

  // now actionButtons for II, with save, delete & view product info
  const ActionButtonsII = () => {
    return (
      <>
        <div className="action-buttons" style={{ marginTop: '20px' }}>
          <button
            className="action-button"
            onClick={() => updateInventoryInfo(selectedInventoryItem)}
          >
            <FontAwesomeIcon icon={faSave} style={{ marginRight: '10px' }} />
            保存
          </button>
          <button
            className="action-button"
            onClick={() => removeInventoryItem(selectedInventoryItem)}
          >
            <FontAwesomeIcon
              icon={faTrashAlt}
              style={{ marginRight: '10px' }}
            />
            削除
          </button>
          <button
            className="action-button"
            onClick={() => {
              setViewType('product_details');
              setSelectedInventoryItem(null);
            }}
          >
            <FontAwesomeIcon
              icon={faCircleInfo}
              style={{ marginRight: '10px' }}
            />
            商品情報
          </button>
        </div>
      </>
    );
  };

  // Now for the updateInventoryInfo (updates the product's inventory_used with the proper parameters)
  const updateInventoryInfo = inventoryItem => {
    const updatedInventoryUsed = selectedProduct.inventoryUsed.map(
      itemUsage => {
        if (itemUsage.id === inventoryItem.id) {
          return inventoryItem;
        }
        return itemUsage;
      },
    );
    setSelectedProduct({
      ...selectedProduct,
      inventoryUsed: updatedInventoryUsed,
    });

    // Save the product
    const updatedProducts = products.map(product => {
      if (product.id === selectedProduct.id) {
        return selectedProduct;
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  // Now for removeInventoryItem
  const removeInventoryItem = inventoryItem => {
    const updatedInventoryUsed = selectedProduct.inventoryUsed.filter(
      itemUsage => itemUsage.id !== inventoryItem.id,
    );
    setSelectedProduct({
      ...selectedProduct,
      inventoryUsed: updatedInventoryUsed,
    });

    // Also, set the selectedInventoryItem to null
    setSelectedInventoryItem(null);

    // Also, set the viewType to product_details
    setViewType('product_details');
  };

  // Now for the handleNewProduct
  const handleNewProduct = () => {
    // Create a new product with the name 新規商品, grab the last id and add 1 to it
    let newID = 1;
    if (products.length > 0) {
      newID = products[products.length - 1].id + 1;
    }

    const newProduct = {
      id: newID,
      business_ID: currentUser.business_ID,
      productName: '新規商品',
      productType: '物理的製品',
      productDescription: '新しく作成された商品',
      productCost: null,
      autoSetCost: true,
      productPrice: 0,
      totalSales: null,
      salesWeek: {},
      totalRevenue: null,
      profitWeek: {},
      inventoryUsed: [],
    };

    // Add the new product to the products list
    const updatedProducts = [...products, newProduct];
    dispatch(updateProducts(updatedProducts)); // update product list
    setProducts(updatedProducts);

    // Set the selectedProduct to the new product
    setSelectedProduct(newProduct);

    // Set the viewType to product_details
    setViewType('product_details');
  };

  // Now for handleNewInventoryItem
  const handleNewInventoryItem = () => {
    // Create a new inventoryItem which is going to be the first possible item that is not currently used in
    // the product's inventory list. If there are none, we return (since we can't add a new inventory item)
    const inventoryItemIDsUsed = selectedProduct.inventoryUsed.map(
      itemUsage => itemUsage.id,
    );
    const inventoryItemIDsNotUsed = inventory.filter(
      inventoryItem => !inventoryItemIDsUsed.includes(inventoryItem.id),
    );
    if (inventoryItemIDsNotUsed.length === 0) {
      return;
    }

    const newInventoryItem = {
      id: inventoryItemIDsNotUsed[0].id,
      volumeUsed: 0,
      volumeUnit: 'g',
    };

    // Add the new inventoryItem to the product's inventoryUsed list
    const updatedInventoryUsed = [
      ...selectedProduct.inventoryUsed,
      newInventoryItem,
    ];
    setSelectedProduct({
      ...selectedProduct,
      inventoryUsed: updatedInventoryUsed,
    });

    // Save the product
    const updatedProducts = products.map(product => {
      if (product.id === selectedProduct.id) {
        return selectedProduct;
      }
      return product;
    });
    dispatch(updateProducts(updatedProducts)); // updating product list
    setProducts(updatedProducts);

    // Set the selectedInventoryItem to the new inventoryItem and set the viewType to inventory_details
    setSelectedInventoryItem(newInventoryItem);
    setViewType('inventory_details');
  };

  // Calculate total of product with tax
  const calculateTotalPrice = product => {
    if (product) {
      // using parseFloats
      // grab the percentage or fixed
      const taxTotal = parseFloat(product.taxTotal);
      const productPrice = parseFloat(product.productPrice);
      // if the tax type is percentage
      if (product.taxType === 'percentage') {
        return productPrice + productPrice * (taxTotal / 100);
      }
      // if the tax type is fixed
      else if (product.taxType === 'fixed') {
        return productPrice + taxTotal;
      }
    }
    return 0;
  };

  return (
    <>
      <div className="relative_container">
        <div className="title_container">
          <div className="section_title">
            <FontAwesomeIcon className="faIcon" icon={faBoxes} />
            商品管理
          </div>
          <div className="back_button" onClick={handleBackClick}>
            <FontAwesomeIcon className="faIcon back" icon={faArrowLeft} />
            戻る
          </div>
        </div>
      </div>

      <div className="management-container">
        {/* Product List */}
        <div className="list products-list">
          {products.map(product => (
            <div
              key={product.id}
              className={`list-item ${
                selectedProduct && selectedProduct.id === product.id
                  ? 'selected'
                  : ''
              }`}
              onClick={() => setSelectedProduct(product)}
            >
              {product.productName}
            </div>
          ))}
          {hasEditPermission && (
            <>
              <div className="list-item new-button" onClick={handleNewProduct}>
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  style={{ marginRight: '10px' }}
                />
                新規商品
              </div>
            </>
          )}
        </div>

        {/* If a product is selected, display the inventoryList that is used for that product */}
        {/* // add if the productType that the selectedProduct is linked to can have items, then display the inventoryList */}
        {selectedProduct && canSelectProductHaveItems(selectedProduct) && (
          <>
            <div className="list inventory-list">
              {selectedProduct.inventoryUsed.map(inventoryItem => (
                <div
                  key={inventoryItem.id}
                  className={`list-item ${
                    selectedInventoryItem &&
                    selectedInventoryItem.id === inventoryItem.id
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedInventoryItem(inventoryItem);
                    setViewType('inventory_details');
                  }}
                >
                  {/* display the inventoryItem.itemName that === that id */}
                  {
                    inventory.find(invItem => invItem.id === inventoryItem.id)
                      .itemName
                  }
                </div>
              ))}
              {hasEditPermission && (
                <>
                  <div
                    className="list-item new-button"
                    onClick={handleNewInventoryItem}
                  >
                    <FontAwesomeIcon
                      icon={faPlusCircle}
                      style={{ marginRight: '10px' }}
                    />
                    新規在庫
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* If an inventoryItem is selected, and the viewType is inventory_details, display the inventory_details menu */}
        {selectedProduct &&
          selectedInventoryItem &&
          viewType === 'inventory_details' && (
            <>
              <div className="form-columns-container">
                <div className="form-column">
                  <h3 className="form-header">在庫情報</h3>
                  {/* a selector to select the item */}
                  <div className="form-group">
                    <label htmlFor="inventoryItem">商品名</label>
                    <select
                      id="inventoryItem"
                      name="inventoryItem"
                      value={selectedInventoryItem.id}
                      onChange={event => {
                        // Need to change the selectedInventoryItem to the new inventoryItem, as well as modifying
                        // the product's inventoryUsed list to reflect the change

                        // First, get the new inventoryItem
                        const newInventoryItem = inventory.find(
                          invItem =>
                            invItem.id === parseInt(event.target.value),
                        );

                        // Now, update the selectedInventoryItem
                        setSelectedInventoryItem({
                          ...selectedInventoryItem,
                          id: newInventoryItem.id,
                          volumeUnit: newInventoryItem.volumeUnit,
                        });

                        // Now, update the product's inventoryUsed list
                        const updatedInventoryUsed =
                          selectedProduct.inventoryUsed.map(itemUsage => {
                            if (itemUsage.id === selectedInventoryItem.id) {
                              return {
                                ...itemUsage,
                                id: newInventoryItem.id,
                                volumeUnit: newInventoryItem.volumeUnit,
                              };
                            }
                            return itemUsage;
                          });

                        // Now, update the selectedProduct
                        setSelectedProduct({
                          ...selectedProduct,
                          inventoryUsed: updatedInventoryUsed,
                        });

                        // Now, update the products list
                        const updatedProducts = products.map(product => {
                          if (product.id === selectedProduct.id) {
                            return selectedProduct;
                          }
                          return product;
                        });

                        // Now, update the products list
                        dispatch(updateProducts(updatedProducts)); // updating product list
                        setProducts(updatedProducts);
                      }}
                      disabled={!hasEditPermission}
                    >
                      {inventory.map(inventoryItem => (
                        <option key={inventoryItem.id} value={inventoryItem.id}>
                          {inventoryItem.itemName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="volumeUsed">使用量</label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      {' '}
                      {/* Adjust styling as needed */}
                      <input
                        type="number"
                        id="volumeUsed"
                        name="volumeUsed"
                        value={selectedInventoryItem.volumeUsed}
                        step="0.01"
                        onChange={e => {
                          const { name, value } = e.target;
                          const updatedInventoryItem = {
                            ...selectedInventoryItem,
                            [name]: value,
                          };
                          setSelectedInventoryItem(updatedInventoryItem);

                          // Now, update the product's inventoryUsed list
                          const updatedInventoryUsed =
                            selectedProduct.inventoryUsed.map(itemUsage => {
                              if (itemUsage.id === selectedInventoryItem.id) {
                                return updatedInventoryItem;
                              }
                              return itemUsage;
                            });

                          // Now, update the selectedProduct
                          setSelectedProduct({
                            ...selectedProduct,
                            inventoryUsed: updatedInventoryUsed,
                          });

                          // Now, update the products list
                          const updatedProducts = products.map(product => {
                            if (product.id === selectedProduct.id) {
                              return selectedProduct;
                            }
                            return product;
                          });

                          // Now, update the products list
                          dispatch(updateProducts(updatedProducts)); // updating product list
                          setProducts(updatedProducts);
                        }}
                        disabled={!hasEditPermission}
                        style={{ marginRight: '10px', flexGrow: '3' }}
                      />
                      <select
                        id="volumeUnit"
                        name="volumeUnit"
                        value={selectedInventoryItem.volumeUnit}
                        onChange={e => {
                          const { name, value } = e.target;
                          const updatedInventoryItem = {
                            ...selectedInventoryItem,
                            [name]: value,
                          };
                          setSelectedInventoryItem(updatedInventoryItem);
                        }}
                        style={{ flexGrow: '.5' }}
                        disabled={!hasEditPermission}
                      >
                        <option value="mg">mg</option>
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="ml">ml</option>
                        <option value="L">l</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        {/* If a product is selected and the current_view is product_details, display the product details menu */}
        {selectedProduct &&
          !selectedInventoryItem &&
          viewType === 'product_details' && (
            <>
              <div className="form-columns-container">
                <div className="form-column">
                  <h3 className="form-header">基本情報</h3>
                  <div className="form-group">
                    <label htmlFor="productName">商品名</label>
                    <input
                      type="text"
                      id="productName"
                      name="productName"
                      value={selectedProduct.productName}
                      onChange={handleProductInfoChange}
                      disabled={!hasEditPermission}
                      placeholder="商品名を入力して下さい"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="productType">商品タイプ</label>
                    <select
                      id="productType"
                      name="productType"
                      value={selectedProduct.productType}
                      onChange={handleProductInfoChange}
                      disabled={!hasEditPermission}
                    >
                      {productTypes.map(productType => (
                        <option
                          key={productType.id}
                          value={productType.productType}
                        >
                          {productType.productType}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="productDescription">商品説明</label>
                    <textarea
                      id="productDescription"
                      name="productDescription"
                      value={selectedProduct.productDescription}
                      onChange={handleProductInfoChange}
                      disabled={!hasEditPermission}
                      placeholder="商品説明を入力して下さい"
                    />
                  </div>
                </div>

                <div className="form-column">
                  <h3 className="form-header">費用と価格</h3>
                  <div className="form-group">
                    <label htmlFor="productCost">費用</label>
                    <input
                      type="number"
                      id="productCost"
                      name="productCost"
                      value={
                        calculateProductCost(selectedProduct) ||
                        selectedProduct.productCost
                      }
                      onChange={handleProductInfoChange}
                      disabled={!hasEditPermission}
                      placeholder="商品の費用を入力して下さい"
                    />
                  </div>

                  {/* a radio button to auto-set cost turn on */}
                  <div className="form-group">
                    <label
                      htmlFor="autoSetCost"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '10px',
                        marginBottom: '10px',
                      }}
                    >
                      <input
                        type="checkbox"
                        id="autoSetCost"
                        name="autoSetCost"
                        checked={selectedProduct.autoSetCost}
                        disabled={!hasEditPermission}
                        onChange={e => {
                          const { name, checked } = e.target;
                          let newValue;
                          newValue = checked;
                          const updatedProduct = {
                            ...selectedProduct,
                            [name]: newValue,
                          };
                          setSelectedProduct(updatedProduct);
                        }}
                        style={{ marginRight: '8px' }}
                      />
                      費用を自動設定
                    </label>
                  </div>

                  <div className="form-group">
                    <label htmlFor="productPrice">価格</label>
                    <input
                      type="number"
                      id="productPrice"
                      name="productPrice"
                      value={selectedProduct.productPrice}
                      disabled={!hasEditPermission}
                      onChange={handleProductInfoChange}
                      placeholder="商品の価格を入力して下さい"
                    />
                  </div>
                </div>

                <div className="form-column">
                  <h3 className="form-header">税金情報</h3>
                  {/* form-group one is type so 計算方法, then its a dropdown with 百分率 or 固定値  */}
                  {/* then form-group two has a currency label input either '%' or '¥' based off the previous slider with a label */}
                  {/* then total price which is calculated off the tax total + the product sellikng price */}
                  <div className="form-group">
                    <label htmlFor="taxType">計算方法</label>
                    <select
                      id="taxType"
                      name="taxType"
                      value={selectedProduct.taxType}
                      onChange={e => {
                        const { name, value } = e.target;
                        const updatedProduct = {
                          ...selectedProduct,
                          [name]: value,
                        };
                        setSelectedProduct(updatedProduct);
                      }}
                      disabled={!hasEditPermission}
                    >
                      <option value="percentage">百分率</option>
                      <option value="fixed">固定値</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="taxTotal">税金</label>
                    <div className="currency-input-group">
                      <span className="currency-label">
                        {selectedProduct.taxType === 'percentage' ? '%' : '¥'}
                      </span>
                      <input
                        id="taxTotal"
                        name="taxTotal"
                        type="number"
                        value={selectedProduct.taxTotal}
                        onChange={handleProductInfoChange}
                        disabled={!hasEditPermission}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="totalPrice">合計価格</label>
                    <input
                      type="number"
                      id="totalPrice"
                      name="totalPrice"
                      value={calculateTotalPrice(selectedProduct)}
                      disabled
                    />
                  </div>

                  <ActionButtonsPI />
                </div>
              </div>
            </>
          )}
      </div>
    </>
  );
};
export default ProductManagement;
