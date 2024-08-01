import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPopups } from '../api/popups';
import { getSlots } from '../api/slots';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/SlotList.css';

const primaryColor = '#071952';

function SlotList() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [popupId, setPopupId] = useState('all');
  const [popups, setPopups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const data = await getPopups('APPROVED', 'all');
        setPopups(data.content || []);
      } catch (error) {
        console.error('Failed to fetch popups:', error);
      }
    };

    fetchPopups();
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const data = await getSlots(popupId, page);
        setSlots(data.content);
        setTotalPages(data.totalPages);
        setError(null);
      } catch (error) {
        setError("Request failed with status code " + (error.response ? error.response.status : error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [page, popupId]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePopupIdChange = (e) => {
    setPopupId(e.target.value);
    setPage(0);
  };

  const handleSlotEdit = (slotId) => {
    navigate(`/host/reservations/slot/${popupId}/${slotId}/edit`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const startPage = Math.floor(page / 10) * 10;
  const endPage = Math.min(startPage + 10, totalPages);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-4">
        <select className="form-select custom-dropdown" value={popupId} onChange={handlePopupIdChange} style={{ width: '200px' }}>
          <option value="all">전체 팝업</option>
          {popups.map((popup) => (
            <option key={popup.popupId} value={popup.popupId}>{popup.name}</option>
          ))}
        </select>
        {popupId !== 'all' && (
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/host/reservations/create?popupId=${popupId}`)}
            style={{ backgroundColor: primaryColor, color: '#fff' }}
          >
            슬롯 등록
          </button>
        )}
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Slot Date</th>
            <th>Slot Time</th>
            <th>Reserved Count</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot) => (
            <tr key={slot.id}>
              <td>{slot.slotDate}</td>
              <td>{slot.slotTime}</td>
              <td>{slot.reservedCount}</td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleSlotEdit(slot.id)}
                  style={{ backgroundColor: primaryColor, color: '#fff' }}
                >
                  슬롯 수정
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default SlotList;
