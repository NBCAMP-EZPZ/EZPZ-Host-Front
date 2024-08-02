import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemDetail, changeItemStatus } from '../api/items';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/ItemInfo.css';
 
function ItemInfo() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchItemDetail = async () => {
      try {
        const data = await getItemDetail(itemId);
        setItem(data);
        setStatus(data.itemStatus); // Assuming the status is part of the item data
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetail();
  }, [itemId]);

  const handleStatusChange = async () => {
    if (newStatus) {
      try {
        await changeItemStatus(itemId, newStatus);
        alert('Item status updated successfully');
        setStatus(newStatus);
        setNewStatus(''); // Reset the newStatus value
        setShowDropdown(false);
      } catch (error) {
        alert('Failed to update item status: ' + error.message);
      }
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <div className="container mt-5">
      <div className="card">
        <img src={item?.imageUrl} className="card-img-top" alt={item?.name} />
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="card-title">{item?.name}</h3>
            <div className="status-container">
              <span className="item-status">{status}</span>
            </div>
          </div>
          <p className="card-text">Description: {item?.description}</p>
          <p className="card-text">Price: {item?.price}</p>
          <p className="card-text">Stock: {item?.stock}</p>
          <p className="card-text">Like Count: {item?.likeCount}</p>
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="btn btn-primary"
              style={{ minWidth: '60px' }}
              onClick={() => navigate(`/host/item/${itemId}/edit`)}
            >
              수정
            </button>
            <div className="status-change-container">
              {showDropdown && (
                <select
                  className="form-select me-2"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{ maxWidth: '150px' }}
                >
                  <option value="">Select Status</option>
                  <option value="BEFORE_SALE">판매 전</option>
                  <option value="SALE">판매 중</option>
                  <option value="SALE_END">판매 종료</option>
                  <option value="SOLD_OUT">품절</option>
                </select>
              )}
              <button
                className="btn btn-secondary"
                onClick={handleStatusChange}
              >
                상태 변경
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemInfo;
