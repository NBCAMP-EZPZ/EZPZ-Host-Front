import React, { useState, useEffect } from 'react';
import { getItems } from '../api/items';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/ItemList.css';

const primaryColor = '#071952';

function ItemList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [popupId, setPopupId] = useState('all');
  const [itemStatus, setItemStatus] = useState('all');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems(popupId, itemStatus, page);
        setItems(data.content);
        setTotalPages(data.totalPages);
        setError(null); // 에러 상태 초기화
      } catch (error) {
        if (error.response && (error.response.data.errorType === "EMPTY_PAGE_ELEMENTS" || error.response.data.errorType === "PAGE_NOT_FOUND")) {
          setError("조회할 아이템이 없습니다!");
        } else {
          setError("Request failed with status code " + (error.response ? error.response.status : error.message));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [page, popupId, itemStatus]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePopupIdChange = (e) => {
    setPopupId(e.target.value);
    setPage(0); // Reset page number when popupId changes
  };

  const handleItemStatusChange = (e) => {
    setItemStatus(e.target.value);
    setPage(0); // Reset page number when itemStatus changes
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const startPage = Math.floor(page / 10) * 10;
  const endPage = Math.min(startPage + 10, totalPages);

  return (
    <div className="container mt-5">
      <h3 className="mb-4 title-spacing">아이템 목록 조회</h3>
      <div className="dropdown-container mb-4">
        <div className="dropdown-item">
          <select className="form-select custom-dropdown" value={popupId} onChange={handlePopupIdChange}>
            <option value="all">전체 팝업</option>
            {/* 다른 팝업 옵션들 추가 */}
          </select>
        </div>
        <div className="dropdown-item">
          <select className="form-select custom-dropdown" value={itemStatus} onChange={handleItemStatusChange}>
            <option value="all">전체 상태</option>
            <option value="BEFORE_SALE">판매 전</option>
            <option value="SALE">판매 중</option>
            <option value="SALE_END">판매 종료</option>
            <option value="SOLD_OUT">품절</option>
          </select>
        </div>
      </div>
      <div className="item-list">
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          items.map((item) => (
            <div key={item.itemId} className="item-card card mb-3">
              <img src={item.image} className="card-img-top" alt={item.name} />
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">Price: {item.price}</p>
                <p className="card-text">Like Count: {item.likeCount}</p>
              </div>
            </div>
          ))
        )}
      </div>
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

export default ItemList;
