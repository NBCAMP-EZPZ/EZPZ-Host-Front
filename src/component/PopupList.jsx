// src/components/PopupList.jsx

import React, { useState, useEffect } from 'react';
import { getPopupListApi } from '../api/popup'; // API 함수를 import 합니다.

const PopupList = () => {
  const [popups, setPopups] = useState([]);

  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const response = await getPopupListApi();
        setPopups(response.data.data.content); // 데이터의 content 배열을 설정합니다.
        console.log("hihi");
      } catch (error) {
        console.error('Error fetching popups:', error);
      }
    };

    fetchPopups();
  }, []);

  return (
    <div>
      <h1>Popup List</h1>
      <ul>
        {popups.map((popup) => (
          <li key={popup.popupId}>
            <h2>{popup.name}</h2>
            <p>Company: {popup.companyName}</p>
            <p>Likes: {popup.likeCount}</p>
            <img src={popup.thumbnail} alt={popup.name} width="100" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopupList;
