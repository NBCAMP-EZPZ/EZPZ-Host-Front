import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderDetail } from '../api/orders';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/OrderInfo.css';

function OrderInfo() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const data = await getOrderDetail(orderId);
        setOrder(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card order-card">
        <div className="card-body">
          <h3 className="card-title">주문 번호 : <span className="order-id">{order.orderId}</span></h3>
          <p className="card-text">총 주문 금액 : <span className="order-info">{order.totalPrice}</span></p>
          <p className="card-text">주문 상태 : <span className="order-info">{order.orderStatus}</span></p>
          <h5 className="mt-4">주문한 아이템</h5>
          <div className="ordered-items">
            {order.orderedItems.map((item) => (
              <div key={item.itemId} className="order-item card mb-3">
                <div className="card-body">
                  <p className="card-text">아이템 ID : <span className="order-info">{item.itemId}</span></p>
                  <p className="card-text">수량 : <span className="order-info">{item.quantity}</span></p>
                  <p className="card-text">주문 가격 : <span className="order-info">{item.orderPrice}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderInfo;
