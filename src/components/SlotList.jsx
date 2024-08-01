import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPopups } from '../api/popups';
import { getSlots } from '../api/slots';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/SlotList.css';

const primaryColor = '#071952';

function SlotList() {
  const [popups, setPopups] = useState([]);
  const [selectedPopup, setSelectedPopup] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const data = await getPopups('APPROVED', 'all');
        setPopups(data.content);
      } catch (error) {
        console.error('팝업을 가져오는 중 오류 발생:', error);
      }
    };

    fetchPopups();
  }, []);

  const handlePopupChange = async (e) => {
    const popupId = e.target.value;
    setSelectedPopup(popupId);
    setPage(0);
    fetchSlots(popupId, 0);
  };

  const fetchSlots = async (popupId, page) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSlots(popupId, page);
      setSlots(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError('슬롯을 가져오는 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchSlots(selectedPopup, newPage);
  };

  const handleSlotClick = (popupId, slotId) => {
    navigate(`/host/popup/${popupId}/slot/${slotId}`);
  };

  return (
    <div className="container mt-5">
      <div className="dropdown-container mb-4">
        <select className="form-select" value={selectedPopup} onChange={handlePopupChange}>
          <option value="">팝업 선택</option>
          {popups.map((popup) => (
            <option key={popup.popupId} value={popup.popupId}>{popup.name}</option>
          ))}
        </select>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Slot Date</th>
                <th>Slot Time</th>
                <th>Reserved Count</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot.id} onClick={() => handleSlotClick(selectedPopup, slot.id)} style={{ cursor: 'pointer' }}>
                  <td>{slot.slotDate}</td>
                  <td>{slot.slotTime}</td>
                  <td>{slot.reservedCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="pagination mt-4">
        <button
          className="btn pagination-btn"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
          style={{ backgroundColor: primaryColor, color: '#fff' }}
        >
          이전
        </button>
        {[...Array(totalPages).keys()].map((pageIndex) => (
          <button
            key={pageIndex}
            className={`btn pagination-btn ${pageIndex === page ? 'btn-current' : ''}`}
            onClick={() => handlePageChange(pageIndex)}
            style={{
              backgroundColor: pageIndex === page ? primaryColor : 'transparent',
              color: pageIndex === page ? '#fff' : primaryColor,
            }}
          >
            {pageIndex + 1}
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
