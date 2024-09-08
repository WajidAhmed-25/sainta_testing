import { useState } from 'react';
import { ja } from 'date-fns/locale';
import {
  faBoxes,
  faSave,
  faTrashAlt,
  faPlusCircle,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker, { registerLocale } from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../../assets/css/InterfaceM.css'; // Re-use styles from Customer Management
import 'react-datepicker/dist/react-datepicker.css';

import {
  addInventory,
  updateInventory,
  addInventoryType,
  selectAllinventory,
  selectAllinventoryTypes,
  updateInventoryType,
} from '../../store/slices/inventory/inventorySlice';

const InventoryManagement = ({
  currentUser,
  setInventory,
  setInventoryTypes,
}) => {
  const inventoryTypes = useSelector(selectAllinventoryTypes);
  const inventory = useSelector(selectAllinventory);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  registerLocale('ja', ja); // registering local with the name you want

  console.log({ inventoryTypes, inventory });

  const [selectedType, setSelectedType] = useState(null); // inventoryTypes[0] if you want to set a default
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewType, setViewType] = useState('type_information'); // 'type_information', 'inventory_information'

  const hasEditPermission =
    (currentUser && currentUser?.permissions === 'admin') ||
    currentUser?.permissions === 'moderator';

  const handleSelectItem = itemId => {
    // Set the view type to inventory_information
    setViewType('inventory_information');

    // Find the item in the inventory list and set it as the selected item
    const item = inventory.find(item => item.id === itemId);
    setSelectedItem(item);

    // Find the type in the inventory types list and set it as the selected type
    const type = inventoryTypes.find(type => type.name === item.inventoryType);
    setSelectedType(type);
  };

  const handleNewInventoryType = () => {
    // Grab the last id of the inventory type list and + 1 or 1 if empty
    const newId =
      inventoryTypes.length > 0
        ? inventoryTypes[inventoryTypes.length - 1].id + 1
        : 1;
    const newInventoryType = {
      id: newId,
      business_ID: currentUser.business_ID,
      name: '新規在庫種類',
      description: '新しく追加された種類',
    };
    setInventoryTypes(prevInventoryTypes => [
      ...prevInventoryTypes,
      newInventoryType,
    ]);
    dispatch(addInventoryType(newInventoryType)); // adding new InventoryType;
    setSelectedType(newInventoryType);

    // set the view type to type_information
    setViewType('type_information');
  };

  const handleNewItem = () => {
    // Grab the last id of the inventory list and + 1 or 1 if empty
    const newId =
      inventory.length > 0 ? inventory[inventory.length - 1].id + 1 : 1;
    const newItem = {
      id: newId,
      business_ID: currentUser.business_ID,
      inventoryType: selectedType.name,
      itemName: '新規在庫',
      stockQuantity: 0,
      volumePerItem: 0.0,
      volumeUnit: 'g',
      costPrice: 0.0,
      sellingPrice: 0.0,
    };
    setInventory(prevInventory => [...prevInventory, newItem]);
    dispatch(addInventory(newItem)); // adding new Inventory;
    setSelectedItem(newItem);

    // set the view type to inventory_information
    setViewType('inventory_information');
  };

  const handleInputChange = e => {
    setSelectedItem({
      ...selectedItem,
      [e.target.name]:
        e.target.type === 'number'
          ? parseFloat(e.target.value)
          : e.target.value,
    });
  };

  const saveItem = () => {
    // Save the item to the inventory list
    const itemIndex = inventory.findIndex(item => item.id === selectedItem.id);
    const newInventory = [...inventory];
    newInventory[itemIndex] = selectedItem;
    dispatch(updateInventory(newInventory)); // updating inventory item
    setInventory(newInventory);

    // TODO: Save the inventory list to the database
  };

  const deleteItem = () => {
    // Delete the item from the inventory list
    const itemIndex = inventory.findIndex(item => item.id === selectedItem.id);
    const newInventory = [...inventory];
    newInventory.splice(itemIndex, 1);
    dispatch(updateInventory(newInventory)); // updating inventory after delete
    setInventory(newInventory);
    setSelectedItem(null);

    // TODO: Save the inventory list to the database
  };

  const handleBackClick = () => navigate('/interface'); // Use the correct path

  // SavetypeInfo and deleteType are only for the inventory type
  const saveTypeInfo = () => {
    // Save the item to the inventory list
    const typeIndex = inventoryTypes.findIndex(
      type => type.id === selectedType.id,
    );
    const newInventoryTypes = [...inventoryTypes];
    newInventoryTypes[typeIndex] = selectedType;
    dispatch(updateInventoryType(newInventoryTypes)); // updating inventory types
    setInventoryTypes(newInventoryTypes);
  };

  const deleteType = () => {
    // first, find all items that have the type we are deleting, and set their type to the first type in the list or null if empty
    const newInventory = JSON.parse(JSON.stringify([...inventory]));
    newInventory.forEach(item => {
      if (item.inventoryType === selectedType.name) {
        // set the inventoryType to the first type's name in the list or null if empty
        const newType =
          inventoryTypes.length > 0 ? inventoryTypes[0].name : null;
        item.inventoryType = newType;
      }
    });
    dispatch(updateInventory(newInventory)); // updating inventory item
    setInventory(newInventory);

    // Delete the item from the inventory list
    const typeIndex = inventoryTypes.findIndex(
      type => type.id === selectedType.id,
    );
    const newInventoryTypes = [...inventoryTypes];
    newInventoryTypes.splice(typeIndex, 1);
    dispatch(updateInventoryType(newInventoryTypes)); // updating inventory type after delete
    setInventoryTypes(newInventoryTypes);
    setSelectedType(null);
  };

  console.log({ selectedType });

  return (
    <>
      <div className="relative_container">
        <div className="title_container">
          <div className="section_title">
            <FontAwesomeIcon className="faIcon" icon={faBoxes} />
            在庫管理
          </div>
          <div className="back_button" onClick={handleBackClick}>
            <FontAwesomeIcon className="faIcon back" icon={faArrowLeft} />
            戻る
          </div>
        </div>
      </div>

      <div className="management-container">
        <div className="list inventory-types">
          {inventoryTypes.map(type => (
            <div
              key={type.id}
              className={`list-item ${
                type.id === selectedType?.id ? 'selected' : ''
              }`}
              onClick={() => {
                setSelectedType(type);
                setSelectedItem(null);
                setViewType('type_information');
              }}
            >
              {type.name}
            </div>
          ))}

          {hasEditPermission && (
            <>
              <div
                className="list-item new-button"
                onClick={() => handleNewInventoryType()}
              >
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  style={{ marginRight: '10px' }}
                />
                新規在庫タイプ
              </div>
            </>
          )}
        </div>

        {selectedType && (
          <div className="list inventory-items">
            {inventory
              .filter(item => item.inventoryType === selectedType.name)
              .map(item => (
                <div
                  key={item.id}
                  className={`list-item ${
                    item.id === selectedItem?.id ? 'selected' : ''
                  }`}
                  onClick={() => handleSelectItem(item.id)}
                >
                  {item.itemName}
                </div>
              ))}
            {hasEditPermission && (
              <>
                <div
                  className="list-item new-button"
                  onClick={() => handleNewItem()}
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

        {selectedType && viewType === 'type_information' && (
          <div className="form-columns-container">
            <div className="form-column">
              <h3 className="form-header">在庫タイプ情報</h3>
              <div className="form-group">
                <label htmlFor="name">在庫タイプ名</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={selectedType.name}
                  onChange={e => {
                    // All the invnetory items that have the old type name, change to the new type name
                    const newInventory = [...inventory];
                    newInventory.forEach(item => {
                      if (item.inventoryType === selectedType.name) {
                        item.inventoryType = e.target.value;
                      }
                    });
                    dispatch(updateInventory(newInventory)); // updating inventory type
                    setInventory(newInventory);

                    // Set the new type name
                    setSelectedType({ ...selectedType, name: e.target.value });
                  }}
                  disabled={!hasEditPermission}
                  placeholder="在庫タイプ名を入力して下さい"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">在庫タイプ説明</label>
                <textarea
                  style={{ height: '100px' }}
                  id="description"
                  name="description"
                  value={selectedType.description}
                  onChange={e =>
                    setSelectedType({
                      ...selectedType,
                      description: e.target.value,
                    })
                  }
                  disabled={!hasEditPermission}
                />
              </div>

              {/* save and delete buttons only that onClick -> saveTypeInfo() and deleteType() */}
              <div className="action-buttons" style={{ marginTop: '25px' }}>
                <button
                  onClick={() => saveTypeInfo()}
                  disabled={!hasEditPermission}
                >
                  <FontAwesomeIcon icon={faSave} fixedWidth />
                  保存
                </button>
                <button
                  onClick={() => deleteType()}
                  disabled={!hasEditPermission}
                >
                  <FontAwesomeIcon icon={faTrashAlt} fixedWidth />
                  削除
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedItem && viewType === 'inventory_information' && (
          <div className="form-columns-container">
            <div className="form-column">
              <h3 className="form-header">商品情報</h3>
              <div className="form-group">
                <label htmlFor="itemName">商品名</label>
                <input
                  type="text"
                  id="itemName"
                  name="itemName"
                  value={selectedItem.itemName}
                  onChange={handleInputChange}
                  disabled={!hasEditPermission}
                  placeholder="商品名を入力して下さい"
                />
              </div>

              <div className="form-group">
                <label htmlFor="inventoryType">在庫タイプ</label>
                <select
                  id="inventoryType"
                  name="inventoryType"
                  value={selectedItem.inventoryType}
                  onChange={handleInputChange}
                  disabled={!hasEditPermission}
                >
                  {inventoryTypes.map(type => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="stockQuantity">在庫数</label>
                <input
                  type="number"
                  id="stockQuantity"
                  name="stockQuantity"
                  value={selectedItem.stockQuantity}
                  onChange={handleInputChange}
                  disabled={!hasEditPermission}
                />
              </div>

              <div className="form-group">
                <label htmlFor="volumePerItem">
                  単位量
                  <span
                    style={{
                      fontSize: '.75rem',
                      color: '#858585',
                      marginLeft: '5px',
                    }}
                  >
                    (単位重量 / 単位体積)
                  </span>
                </label>
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
                    id="volumePerItem"
                    name="volumePerItem"
                    value={selectedItem.volumePerItem}
                    step="0.01"
                    onChange={handleInputChange}
                    disabled={!hasEditPermission}
                    style={{ marginRight: '10px', flexGrow: '3' }}
                  />
                  <select
                    id="volumeUnit"
                    name="volumeUnit"
                    value={selectedItem.volumeUnit}
                    onChange={handleInputChange}
                    style={{ flexGrow: '.5' }}
                    disabled={!hasEditPermission}
                  >
                    <option value="mg">mg</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-column">
              <h3 className="form-header">注文情報</h3>
              <div className="form-group">
                <label htmlFor="costPrice">原価</label>
                <div className="currency-input-group">
                  <span className="currency-label">¥</span>
                  <input
                    type="number"
                    id="costPrice"
                    name="costPrice"
                    value={selectedItem.costPrice}
                    onChange={handleInputChange}
                    disabled={!hasEditPermission}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="supplierDetails">供給者詳細</label>
                <textarea
                  id="supplierDetails"
                  name="supplierDetails"
                  value={selectedItem.supplierDetails}
                  onChange={handleInputChange}
                  disabled={!hasEditPermission}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastOrdered">最終注文日</label>
                <DatePicker
                  selected={selectedItem.lastOrdered}
                  onChange={date =>
                    setSelectedItem({ ...selectedItem, lastOrdered: date })
                  }
                  locale="ja"
                  dateFormat="yyyy年MM月dd日"
                  className="date-picker"
                  placeholderText="クリックして選択して下さい"
                  disabled={!hasEditPermission}
                />
              </div>

              <div className="action-buttons" style={{ marginTop: '25px' }}>
                <button onClick={saveItem} disabled={!hasEditPermission}>
                  <FontAwesomeIcon icon={faSave} fixedWidth />
                  保存
                </button>
                <button onClick={deleteItem} disabled={!hasEditPermission}>
                  <FontAwesomeIcon icon={faTrashAlt} fixedWidth />
                  削除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InventoryManagement;
