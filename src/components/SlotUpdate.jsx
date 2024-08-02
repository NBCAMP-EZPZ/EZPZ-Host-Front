import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSlot, updateSlot } from '../api/slots';
import 'bootstrap/dist/css/bootstrap.min.css';
 
function SlotUpdate() {
  const { popupId, slotId } = useParams();
  const navigate = useNavigate();
  const [availableCount, setAvailableCount] = useState('');
  const [totalCount, setTotalCount] = useState('');
  const [slotStatus, setSlotStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchSlotDetail = async () => {
      try {
        const data = await getSlot(popupId, slotId);
        setAvailableCount(data.availableCount);
        setTotalCount(data.totalCount);
        setSlotStatus(data.slotStatus);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSlotDetail();
  }, [popupId, slotId]);

  const validateForm = () => {
    const errors = {};
    if (availableCount < 1 || availableCount > 2) errors.availableCount = '1인 최대 예약 가능 인원 수는 1~2명입니다.';
    if (totalCount < 1) errors.totalCount = '전체 예약 가능 인원은 1명 이상입니다.';
    if (!slotStatus) errors.slotStatus = '슬롯 상태를 선택해주세요.';
    return errors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    const formData = {
      availableCount,
      totalCount,
      slotStatus,
    };

    try {
      await updateSlot(popupId, slotId, formData);
      alert('Slot updated successfully');
      navigate(`/host/reservations?popupId=${popupId}`);
    } catch (error) {
      if (error.response && error.response.data) {
        setFormErrors(error.response.data.errors);
      } else {
        alert('Update failed: ' + error.message);
      }
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
      <div className="form-container">
        <h3>슬롯 수정</h3>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label htmlFor="availableCount" className="form-label">1인 최대 예약 가능 인원 수</label>
            <input
              type="number"
              className={`form-control ${formErrors.availableCount ? 'is-invalid' : ''}`}
              id="availableCount"
              value={availableCount}
              onChange={(e) => setAvailableCount(e.target.value)}
              min="1"
              max="2"
              required
            />
            {formErrors.availableCount && <div className="invalid-feedback">{formErrors.availableCount}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="totalCount" className="form-label">전체 예약 가능 인원</label>
            <input
              type="number"
              className={`form-control ${formErrors.totalCount ? 'is-invalid' : ''}`}
              id="totalCount"
              value={totalCount}
              onChange={(e) => setTotalCount(e.target.value)}
              min="1"
              required
            />
            {formErrors.totalCount && <div className="invalid-feedback">{formErrors.totalCount}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="slotStatus" className="form-label">슬롯 상태</label>
            <select
              className={`form-select ${formErrors.slotStatus ? 'is-invalid' : ''}`}
              id="slotStatus"
              value={slotStatus}
              onChange={(e) => setSlotStatus(e.target.value)}
              required
            >
              <option value="">슬롯 상태 선택</option>
              <option value="READY">진행 예정</option>
              <option value="PROCEEDING">진행 중</option>
              <option value="FINISHED">진행 완료</option>
            </select>
            {formErrors.slotStatus && <div className="invalid-feedback">{formErrors.slotStatus}</div>}
          </div>
          <button type="submit" className="btn btn-primary">저장</button>
        </form>
      </div>
    </div>
  );
}

export default SlotUpdate;
