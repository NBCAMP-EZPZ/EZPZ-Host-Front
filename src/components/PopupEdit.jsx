import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPopupDetail, updatePopup } from '../api/popups';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/PopupEdit.css';

function PopupEdit() {
  const { id } = useParams();
  const [popup, setPopup] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [managerName, setManagerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopupDetail = async () => {
      try {
        const data = await getPopupDetail(id);
        setPopup(data);
        setName(data.name);
        setDescription(data.description);
        setAddress(data.address);
        setManagerName(data.managerName);
        setPhoneNumber(data.phoneNumber);
        setStartDate(data.startDate);
        setEndDate(data.endDate);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPopupDetail();
  }, [id]);

  const validateForm = () => {
    const errors = {};
    if (!name) errors.name = '팝업명을 입력해주세요.';
    if (!description) errors.description = '팝업 설명을 입력해주세요.';
    if (!address) errors.address = '주소를 입력해주세요.';
    if (!managerName) errors.managerName = '담당자 이름을 입력해주세요.';
    if (!phoneNumber) errors.phoneNumber = '담당자 번호를 입력해주세요.';
    if (!startDate) errors.startDate = '시작 일자를 입력해주세요.';
    if (!endDate) errors.endDate = '종료 일자를 입력해주세요.';
    if (!thumbnail) errors.thumbnail = '대표 사진을 등록해주세요.';
    if (images.length < 1 || images.length > 3) errors.images = '추가 사진은 최소 1개, 최대 3개까지 등록 가능합니다.';
    return errors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    
    const formData = new FormData();
    formData.append('name', name || popup.name);
    formData.append('description', description || popup.description);
    formData.append('address', address || popup.address);
    formData.append('managerName', managerName || popup.managerName);
    formData.append('phoneNumber', phoneNumber || popup.phoneNumber);
    formData.append('startDate', startDate || popup.startDate);
    formData.append('endDate', endDate || popup.endDate);
    formData.append('thumbnail', thumbnail || popup.thumbnail);
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    try {
      await updatePopup(id, formData);
      navigate(`/host/popup/${id}`);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleImagesChange = (e) => {
    setImages(Array.from(e.target.files));
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
        <h3>팝업 수정</h3>
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">이름</label>
            <input
              type="text"
              className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
              id="name"
              placeholder={popup.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">설명</label>
            <textarea
              className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
              id="description"
              rows="3"
              placeholder={popup.description}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">주소</label>
            <input
              type="text"
              className={`form-control ${formErrors.address ? 'is-invalid' : ''}`}
              id="address"
              placeholder={popup.address}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {formErrors.address && <div className="invalid-feedback">{formErrors.address}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="managerName" className="form-label">담당자 이름</label>
            <input
              type="text"
              className={`form-control ${formErrors.managerName ? 'is-invalid' : ''}`}
              id="managerName"
              placeholder={popup.managerName}
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
            />
            {formErrors.managerName && <div className="invalid-feedback">{formErrors.managerName}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">담당자 번호</label>
            <input
              type="text"
              className={`form-control ${formErrors.phoneNumber ? 'is-invalid' : ''}`}
              id="phoneNumber"
              placeholder={popup.phoneNumber}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            {formErrors.phoneNumber && <div className="invalid-feedback">{formErrors.phoneNumber}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="startDate" className="form-label">시작 일자</label>
            <input
              type="datetime-local"
              className={`form-control ${formErrors.startDate ? 'is-invalid' : ''}`}
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            {formErrors.startDate && <div className="invalid-feedback">{formErrors.startDate}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">종료 일자</label>
            <input
              type="datetime-local"
              className={`form-control ${formErrors.endDate ? 'is-invalid' : ''}`}
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            {formErrors.endDate && <div className="invalid-feedback">{formErrors.endDate}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="thumbnail" className="form-label">대표 사진</label>
            <input
              type="file"
              className={`form-control ${formErrors.thumbnail ? 'is-invalid' : ''}`}
              id="thumbnail"
              onChange={handleThumbnailChange}
            />
            {formErrors.thumbnail && <div className="invalid-feedback">{formErrors.thumbnail}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="images" className="form-label">추가 사진</label>
            <input
              type="file"
              className={`form-control ${formErrors.images ? 'is-invalid' : ''}`}
              id="images"
              multiple
              onChange={handleImagesChange}
            />
            {formErrors.images && <div className="invalid-feedback">{formErrors.images}</div>}
          </div>
          <button type="submit" className="btn btn-primary">저장</button>
        </form>
      </div>
    </div>
  );
}

export default PopupEdit;
