import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemDetail } from '../api/items';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/ItemInfo.css';

const primaryColor = '#071952';

function ItemInfo() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItemDetail = async () => {
      try {
        const data = await getItemDetail(itemId);
        setItem(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetail();
  }, [itemId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <img src={item.imageUrl} className="card-img-top" alt={item.name} />
        <div className="card-body">
          <h3 className="card-title">{item.name}</h3>
          <p className="card-text">Description: {item.description}</p>
          <p className="card-text">Price: {item.price}</p>
          <p className="card-text">Stock: {item.stock}</p>
          <p className="card-text">Like Count: {item.likeCount}</p>
          <button className="btn btn-primary" onClick={() => navigate(`/host/item/${itemId}/edit`)}>수정</button>
        </div>
      </div>
    </div>
  );
}

export default ItemInfo;
