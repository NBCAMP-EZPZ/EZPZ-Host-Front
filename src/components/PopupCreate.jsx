import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPopup } from '../api/popups'; // Assuming you have this API function
import 'bootstrap/dist/css/bootstrap.min.css';
 
function PopupCreate() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [managerName, setManagerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [formErrors, setFormErrors] = useState({});

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

  const handleFileChange = (e) => {
    if (e.target.name === 'thumbnail') {
      setThumbnail(e.target.files[0]);
    } else if (e.target.name === 'images') {
      setImages(Array.from(e.target.files));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('address', address);
    formData.append('managerName', managerName);
    formData.append('phoneNumber', phoneNumber);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }
    images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    try {
      await createPopup(formData);
      alert('Popup created successfully');
      navigate('/host'); // Navigate back to popup list page after successful creation
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
        <h3>팝업 등록</h3>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">이름</label>
            <input
              type="text"
              className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
              id="name"
              name="name"
              onChange={(e) => setName(e.target.value)}
              required
            />
            {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">설명</label>
            <textarea
              className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
              id="description"
              name="description"
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              required
            ></textarea>
            {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">주소</label>
            <input
              type="text"
              className={`form-control ${formErrors.address ? 'is-invalid' : ''}`}
              id="address"
              name="address"
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            {formErrors.address && <div className="invalid-feedback">{formErrors.address}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="managerName" className="form-label">담당자 이름</label>
            <input
              type="text"
              className={`form-control ${formErrors.managerName ? 'is-invalid' : ''}`}
              id="managerName"
              name="managerName"
              onChange={(e) => setManagerName(e.target.value)}
              required
            />
            {formErrors.managerName && <div className="invalid-feedback">{formErrors.managerName}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">담당자 번호</label>
            <input
              type="text"
              className={`form-control ${formErrors.phoneNumber ? 'is-invalid' : ''}`}
              id="phoneNumber"
              name="phoneNumber"
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            {formErrors.phoneNumber && <div className="invalid-feedback">{formErrors.phoneNumber}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="startDate" className="form-label">시작 일자</label>
            <input
              type="datetime-local"
              className={`form-control ${formErrors.startDate ? 'is-invalid' : ''}`}
              id="startDate"
              name="startDate"
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            {formErrors.startDate && <div className="invalid-feedback">{formErrors.startDate}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">종료 일자</label>
            <input
              type="datetime-local"
              className={`form-control ${formErrors.endDate ? 'is-invalid' : ''}`}
              id="endDate"
              name="endDate"
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
            {formErrors.endDate && <div className="invalid-feedback">{formErrors.endDate}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="thumbnail" className="form-label">대표 사진</label>
            <input
              type="file"
              className={`form-control ${formErrors.thumbnail ? 'is-invalid' : ''}`}
              id="thumbnail"
              name="thumbnail"
              onChange={handleFileChange}
              required
            />
            {formErrors.thumbnail && <div className="invalid-feedback">{formErrors.thumbnail}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="images" className="form-label">추가 사진</label>
            <input
              type="file"
              className={`form-control ${formErrors.images ? 'is-invalid' : ''}`}
              id="images"
              name="images"
              onChange={handleFileChange}
              multiple
              required
            />
            {formErrors.images && <div className="invalid-feedback">{formErrors.images}</div>}
          </div>
          <button type="submit" className="btn btn-primary">등록</button>
        </form>
      </div>
    </div>
  );
}

export default PopupCreate;
