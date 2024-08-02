import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSlotReservations } from '../api/slots';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/SlotDetail.css';
 
function SlotDetail() {
  const { popupId, slotId } = useParams();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlotReservations = async () => {
      try {
        const data = await getSlotReservations(popupId, slotId);
        setReservations(data.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSlotReservations();
  }, [popupId, slotId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="container">
      <h3>예약 정보</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>인원 수</th>
            <th>전화번호</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.id}</td>
              <td>{reservation.name}</td>
              <td>{reservation.numberOfPersons}</td>
              <td>{reservation.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SlotDetail;
