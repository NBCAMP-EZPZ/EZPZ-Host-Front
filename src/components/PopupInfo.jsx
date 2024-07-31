import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPopupDetail } from '../api/popups';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/PopupInfo.css';

const primaryColor = '#071952';

function PopupInfo() {
  const { id } = useParams();
  const [popup, setPopup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopupDetail = async () => {
      try {
        const data = await getPopupDetail(id);
        setPopup(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPopupDetail();
  }, [id]);

  const handleImageClick = (image) => {
    setSelectedImage(image.url);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <img src={popup.thumbnailUrl} className="card-img-top" alt={popup.name} />
        <div className="card-body">
          <h3 className="card-title">{popup.name}</h3>
          <h5 className="card-text">{popup.description}</h5>
          
          <hr />

          <p className="card-text"><strong>주소:</strong> {popup.address}</p>
          <p className="card-text"><strong>시작 날짜:</strong> {new Date(popup.startDate).toLocaleString()}</p>
          <p className="card-text"><strong>종료 날짜:</strong> {new Date(popup.endDate).toLocaleString()}</p>
          <p className="card-text"><strong>좋아요 수:</strong> {popup.likeCount}</p>

          <div className="popup-images">
            {popup.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={`Popup image ${index + 1}`}
                className="popup-image"
                onClick={() => handleImageClick(image)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-primary"
              style={{ backgroundColor: primaryColor }}
              onClick={() => navigate(`/host/popup/${id}/edit`)}
            >
              수정
            </button>
            <div>
              <button
                className="btn btn-primary me-2"
                style={{ backgroundColor: primaryColor }}
                onClick={() => navigate(`/host/popup/${id}/items`)}
              >
                굿즈 페이지
              </button>
              <button
                className="btn btn-primary"
                style={{ backgroundColor: primaryColor }}
                onClick={() => navigate(`/host/popup/${id}/reservations`)}
              >
                예약 페이지
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Body>
          <img src={selectedImage} alt="Selected" className="img-fluid" />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PopupInfo;
