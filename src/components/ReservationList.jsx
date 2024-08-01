import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSlot } from '../api/slots';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/ReservationList.css';

const primaryColor = '#071952';

function ReservationList() {
  const { popupId, slotId } = useParams();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlotDetails = async () => {
      try {
        const data = await getSlot(popupId, slotId);
        setReservations(data);
      } catch (error) {
        setError('예약 정보를 가져오는 중 오류 발생');
      } finally {
        setLoading(false);
      }
    };

    fetchSlotDetails();
  }, [popupId, slotId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h3 className="mb-4">예약 정보 상세 조회</h3>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Reservation ID</th>
              <th>Name</th>
              <th>Number of Persons</th>
              <th>Phone Number</th>
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
    </div>
  );
}

export default ReservationList;
