import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemDetail, updateItem } from '../api/items';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/ItemEdit.css';

function ItemEdit() {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItemDetail = async () => {
      try {
        const data = await getItemDetail(itemId);
        setItem(data);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setStock(data.stock);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchItemDetail();
  }, [itemId]);

  const validateForm = () => {
    const errors = {};
    if (!name) errors.name = '상품명을 입력해주세요.';
    if (!description) errors.description = '상품 설명을 입력해주세요.';
    if (!price) errors.price = '가격을 입력해주세요.';
    if (!stock) errors.stock = '재고를 입력해주세요.';
    if (!image) errors.image = '상품 사진을 등록해주세요.';
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
    formData.append('name', name || item.name); 
    formData.append('description', description || item.description);
    formData.append('price', price || item.price);
    formData.append('stock', stock || item.stock);
    if (image) {
      formData.append('image', image);
    }
    // FormData의 내용을 로그로 출력하기
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }


    try {
      await updateItem(itemId, formData);
      navigate(`/host/item/${itemId}`);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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
        <h3>상품 수정</h3>
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">상품명</label>
            <input
              type="text"
              className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
              id="name"
              placeholder={item.name}
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
              placeholder={item.description}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">가격</label>
            <input
              type="number"
              className={`form-control ${formErrors.price ? 'is-invalid' : ''}`}
              id="price"
              placeholder={item.price}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {formErrors.price && <div className="invalid-feedback">{formErrors.price}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="stock" className="form-label">재고</label>
            <input
              type="number"
              className={`form-control ${formErrors.stock ? 'is-invalid' : ''}`}
              id="stock"
              placeholder={item.stock}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            {formErrors.stock && <div className="invalid-feedback">{formErrors.stock}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="image" className="form-label">상품 사진</label>
            <input
              type="file"
              className={`form-control ${formErrors.image ? 'is-invalid' : ''}`}
              id="image"
              onChange={handleImageChange}
            />
            {formErrors.image && <div className="invalid-feedback">{formErrors.image}</div>}
          </div>
          <button type="submit" className="btn btn-primary">저장</button>
        </form>
      </div>
    </div>
  );
}

export default ItemEdit;
