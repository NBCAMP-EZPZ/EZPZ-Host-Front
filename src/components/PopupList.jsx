import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPopups } from '../api/popups';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/PopupList.css';

const primaryColor = '#071952';

function PopupList() {
  const [popups, setPopups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupStatus, setPopupStatus] = useState('all');
  const [approvalStatus, setApprovalStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopups = async () => {
      setLoading(true);
      setError(null);  // 에러 상태 초기화
      try {
        const data = await getPopups(approvalStatus, popupStatus, page);
        setPopups(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        if (error.response && (error.response.data.errorType === "EMPTY_PAGE_ELEMENTS" || error.response.data.errorType === "PAGE_NOT_FOUND")) {
          setError("조회할 팝업 스토어가 없습니다!");
        } else {
          setError("Request failed with status code " + (error.response ? error.response.status : error.message));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPopups();
  }, [approvalStatus, popupStatus, page]);

  const handlePopupStatusChange = (e) => {
    setPopupStatus(e.target.value);
    setPage(0); // 상태 변경 시 페이지 번호를 초기화
    setError(null); // 에러 상태 초기화
  };

  const handleApprovalStatusChange = (e) => {
    setApprovalStatus(e.target.value);
    setPage(0); // 상태 변경 시 페이지 번호를 초기화
    setError(null); // 에러 상태 초기화
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setError(null); // 에러 상태 초기화
  };

  const handleCardClick = (id) => {
    navigate(`/host/popup/${id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const startPage = Math.floor(page / 10) * 10;
  const endPage = Math.min(startPage + 10, totalPages);

  return (
    <div className="container">
      <h3 className="mb-4 title-spacing">팝업 목록 조회</h3>
      <div className="dropdown-container mb-4">
        <div className="dropdown-item">
          <select className="form-select custom-dropdown" value={popupStatus} onChange={handlePopupStatusChange}>
            <option value="all">전체 보기</option>
            <option value="in_progress">진행 중</option>
            <option value="scheduled">오픈 전</option>
            <option value="completed">종료</option>
            <option value="canceled">취소</option>
          </select>
        </div>
        <div className="dropdown-item">
          <select className="form-select custom-dropdown" value={approvalStatus} onChange={handleApprovalStatusChange}>
            <option value="all">전체 보기</option>
            <option value="reviewing">심사 중</option>
            <option value="approved">승인 완료</option>
            <option value="rejected">반려</option>
          </select>
        </div>
      </div>
      <div className="popup-list">
        {error ? (
          <div>{error}</div>
        ) : (
          popups.map((popup) => (
            <div 
              key={popup.popupId} 
              className="popup-card card mb-3 shadow-sm"
              onClick={() => handleCardClick(popup.popupId)}
              style={{ cursor: 'pointer' }}
            >
              <img src={popup.thumbnail} className="card-img-top" alt={popup.name} />
              <div className="card-body">
                <h5 className="card-title">{popup.name}</h5>
                <p className="card-text">Company: {popup.companyName}</p>
                <p className="card-text">Likes: {popup.likeCount}</p>
              </div>
            </div>
          ))
        )}
      </div>
      {!error && (
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
      )}
    </div>
  );
}

export default PopupList;
