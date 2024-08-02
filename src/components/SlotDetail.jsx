import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSlot } from '../api/slots';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/SlotDetail.css';
 

function SlotDetail() {
  const { popupId, slotId } = useParams();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlotDetails = async () => {
      setLoading(true);
      try {
        const data = await getSlot(popupId, slotId);
        setReservations(data);
        setError(null);
      } catch (error) {
        if (error.response && error.response.data.errorType === "RESERVATION_NOT_FOUND") {
          setError("예약 내역이 없습니다!");
        } else {
          setError("Failed to fetch reservations.");
        }
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlotDetails();
  }, [popupId, slotId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      {error && <div className="text-center text-danger mb-3">{error}</div>}
      {reservations.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
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
      )}
    </div>
  );
}

export default SlotDetail;
