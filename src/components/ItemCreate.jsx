import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../api/items'; // getPopups 함수 추가
import { getPopups } from '../api/popups';
import 'bootstrap/dist/css/bootstrap.min.css';
 
function ItemCreate() {
  const navigate = useNavigate();
  const [popups, setPopups] = useState([]);
  const [selectedPopupId, setSelectedPopupId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const data = await getPopups('APPROVED', 'all');
        setPopups(data.content);
        if (data.content.length > 0) {
          setSelectedPopupId(data.content[0].popupId); // 기본으로 첫 번째 팝업 선택
        }
      } catch (error) {
        console.error("Failed to fetch popups", error);
      }
    };

    fetchPopups();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!name) errors.name = '상품명을 입력해주세요.';
    if (!description) errors.description = '상품 설명을 입력해주세요.';
    if (!price) errors.price = '가격을 입력해주세요.';
    if (!stock) errors.stock = '재고를 입력해주세요.';
    if (!image) errors.image = '상품 사진을 등록해주세요.';
    return errors;
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
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
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('popupId', selectedPopupId); // 선택된 팝업 ID 추가
    if (image) {
      formData.append('image', image);
    }

    try {
      await createItem(selectedPopupId, formData);
      alert('Item created successfully');
      navigate('/host/items'); // Navigate back to item list page after successful creation
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
        <h3>상품 등록</h3>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label htmlFor="popupId" className="form-label">팝업 선택</label>
            <select
              className="form-select"
              id="popupId"
              value={selectedPopupId}
              onChange={(e) => setSelectedPopupId(e.target.value)}
              required
            >
              {popups.map((popup) => (
                <option key={popup.popupId} value={popup.popupId}>
                  {popup.name}
                </option>
              ))}
            </select>
          </div>
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
            <label htmlFor="price" className="form-label">가격</label>
            <input
              type="number"
              className={`form-control ${formErrors.price ? 'is-invalid' : ''}`}
              id="price"
              name="price"
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            {formErrors.price && <div className="invalid-feedback">{formErrors.price}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="stock" className="form-label">재고</label>
            <input
              type="number"
              className={`form-control ${formErrors.stock ? 'is-invalid' : ''}`}
              id="stock"
              name="stock"
              onChange={(e) => setStock(e.target.value)}
              required
            />
            {formErrors.stock && <div className="invalid-feedback">{formErrors.stock}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="image" className="form-label">상품 사진</label>
            <input
              type="file"
              className={`form-control ${formErrors.image ? 'is-invalid' : ''}`}
              id="image"
              name="image"
              onChange={handleFileChange}
              required
            />
            {formErrors.image && <div className="invalid-feedback">{formErrors.image}</div>}
          </div>
          <button type="submit" className="btn btn-primary">등록</button>
        </form>
      </div>
    </div>
  );
}

export default ItemCreate;
