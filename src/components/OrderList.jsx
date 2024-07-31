import React, { useState, useEffect } from 'react';
import { getOrders } from '../api/orders';
import { getItems } from '../api/items';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/OrderList.css';

const primaryColor = '#071952';
const headerColor = '#5BC8F7'; // 헤더 색상

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchType, setSearchType] = useState('all');
  const [itemId, setItemId] = useState(-1);
  const [orderStatus, setOrderStatus] = useState('all');
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if ((searchType === 'by_item' || searchType === 'by_item_and_status') && itemId === -1) {
        return;
      }
      try {
        const data = await getOrders(page, searchType, itemId, orderStatus);
        setOrders(data.content);
        setTotalPages(data.totalPages);
        setError(null); // 에러 상태 초기화
      } catch (error) {
        if (error.response && (error.response.data.errorType === "EMPTY_PAGE_ELEMENTS" || error.response.data.errorType === "PAGE_NOT_FOUND")) {
          setError("조회할 주문이 없습니다!");
        } else {
          setError("Request failed with status code " + (error.response ? error.response.status : error.message));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, searchType, itemId, orderStatus]);

  useEffect(() => {
    const fetchItems = async () => {
      if (searchType === 'by_item' || searchType === 'by_item_and_status') {
        try {
          const data = await getItems('all', 'all');
          setItems(data.content);
        } catch (error) {
          setError(error.message);
        }
      }
    };

    fetchItems();
  }, [searchType]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setItemId(-1); // Reset itemId when searchType changes
    setOrderStatus('all'); // Reset orderStatus when searchType changes
    setPage(0); // Reset page number when searchType changes
    setOrders([]); // Clear orders when searchType changes
  };

  const handleOrderStatusChange = (e) => {
    setOrderStatus(e.target.value);
    setPage(0); // Reset page number when orderStatus changes
  };

  const handleItemIdChange = (e) => {
    setItemId(e.target.value);
    setPage(0); // Reset page number when itemId changes
    setLoading(true); // Set loading state to true while fetching orders
    setError(null); // Reset error state

    const fetchOrdersForItem = async () => {
      try {
        const data = await getOrders(0, searchType, e.target.value, orderStatus); // Fetch orders for selected item
        setOrders(data.content);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (error) {
        if (error.response && (error.response.data.errorType === "EMPTY_PAGE_ELEMENTS" || error.response.data.errorType === "PAGE_NOT_FOUND")) {
          setError("조회할 주문이 없습니다!");
        } else {
          setError("Request failed with status code " + (error.response ? error.response.status : error.message));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersForItem();
  };

  const handleOrderClick = (orderId) => {  
    navigate(`/host/order/${orderId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const startPage = Math.floor(page / 10) * 10;
  const endPage = Math.min(startPage + 10, totalPages);

  return (
    <div className="container mt-5">
      <h3 className="mb-4 title-spacing">주문 목록 조회</h3>
      <div className="dropdown-container mb-4">
        <div className="dropdown-item">
          <select className="form-select custom-dropdown" value={searchType} onChange={handleSearchTypeChange}>
            <option value="all">전체 보기</option>
            <option value="by_item">아이템 기준</option>
            <option value="by_status">상태 기준</option>
            <option value="by_item_and_status">아이템 및 상태 기준</option>
          </select>
        </div>
        {searchType === 'by_item' || searchType === 'by_item_and_status' ? (
          <div className="dropdown-item">
            <select className="form-select custom-dropdown" value={itemId} onChange={handleItemIdChange}>
              <option value="-1">아이템 선택</option>
              {items.map((item) => (
                <option key={item.itemId} value={item.itemId}>{item.name}</option>
              ))}
            </select>
          </div>
        ) : null}
        {searchType === 'by_status' || searchType === 'by_item_and_status' ? (
          <div className="dropdown-item">
            <select className="form-select custom-dropdown" value={orderStatus} onChange={handleOrderStatusChange}>
              <option value="all">전체 보기</option>
              <option value="ORDER_COMPLETED">주문 완료</option>
              <option value="IN_TRANSIT">배송 중</option>
              <option value="DELIVERED">배송 완료</option>
              <option value="CANCELLED">취소됨</option>
            </select>
          </div>
        ) : null}
      </div>
      <div className="order-list">
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <table className="table">
            <thead>
              <tr className="table-header">
                <th>Order ID</th>
                <th>Total Price</th>
                <th>Order Status</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId} onClick={() => handleOrderClick(order.orderId)}>
                  <td>{order.orderId}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.orderStatus}</td>
                  <td>{order.orderDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="pagination mt-4">
        <button
          className="btn pagination-btn"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
          style={{ backgroundColor: primaryColor, color: '#fff' }}
        >
          이전
        </button>
        {[...Array(endPage - startPage).keys()].map((pageIndex) => (
          <button
            key={startPage + pageIndex}
            className={`btn pagination-btn ${startPage + pageIndex === page ? 'btn-current' : ''}`}
            onClick={() => handlePageChange(startPage + pageIndex)}
            style={{
              backgroundColor: startPage + pageIndex === page ? primaryColor : 'transparent',
              color: startPage + pageIndex === page ? '#fff' : primaryColor,
            }}
          >
            {startPage + pageIndex + 1}
          </button>
        ))}
        <button
          className="btn pagination-btn"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages - 1}
          style={{ backgroundColor: primaryColor, color: '#fff' }}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default OrderList;
