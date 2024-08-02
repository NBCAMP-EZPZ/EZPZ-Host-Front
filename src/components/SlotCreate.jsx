import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createSlot } from '../api/slots'; // Assuming you have this API function
import 'bootstrap/dist/css/bootstrap.min.css';

 
function SlotCreate() {
  const { popupId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const popupIdParam = searchParams.get('popupId') || popupId;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [availableCount, setAvailableCount] = useState('');
  const [totalCount, setTotalCount] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!startDate) errors.startDate = '예약 시작 날짜를 입력해주세요.';
    if (!endDate) errors.endDate = '예약 종료 날짜를 입력해주세요.';
    if (!startTime) errors.startTime = '예약 시작 시간을 입력해주세요.';
    if (!endTime) errors.endTime = '예약 종료 시간을 입력해주세요.';
    if (availableCount < 1 || availableCount > 2) errors.availableCount = '1인 최대 예약 가능 인원 수는 1~2명입니다.';
    if (totalCount < 1) errors.totalCount = '전체 예약 가능 인원은 1명 이상입니다.';
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
    
    const slotData = {
      startDate,
      endDate,
      startTime,
      endTime,
      availableCount,
      totalCount,
    };

    try {
      await createSlot(popupIdParam, slotData);
      alert('Slot created successfully');
      navigate(`/host/reservations?popupId=${popupIdParam}`);
    } catch (error) {
      if (error.response && error.response.data) {
        setFormErrors(error.response.data.errors);
      } else {
        alert('Create failed: ' + error.message);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="form-container">
        <h3>슬롯 등록</h3>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label htmlFor="startDate" className="form-label">예약 시작 날짜</label>
            <input
              type="date"
              className={`form-control ${formErrors.startDate ? 'is-invalid' : ''}`}
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            {formErrors.startDate && <div className="invalid-feedback">{formErrors.startDate}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">예약 종료 날짜</label>
            <input
              type="date"
              className={`form-control ${formErrors.endDate ? 'is-invalid' : ''}`}
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
            {formErrors.endDate && <div className="invalid-feedback">{formErrors.endDate}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="startTime" className="form-label">예약 시작 시간</label>
            <input
              type="time"
              className={`form-control ${formErrors.startTime ? 'is-invalid' : ''}`}
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            {formErrors.startTime && <div className="invalid-feedback">{formErrors.startTime}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="endTime" className="form-label">예약 종료 시간</label>
            <input
              type="time"
              className={`form-control ${formErrors.endTime ? 'is-invalid' : ''}`}
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
            {formErrors.endTime && <div className="invalid-feedback">{formErrors.endTime}</div>}
          </div>
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
          <button type="submit" className="btn btn-primary">등록</button>
        </form>
      </div>
    </div>
  );
}

export default SlotCreate;
