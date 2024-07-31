// src/components/PopupDetail.jsx

import React from 'react';
import { useParams } from 'react-router-dom';
import PopupInfo from './PopupInfo';
import 'bootstrap/dist/css/bootstrap.min.css';

function PopupDetail() {
  const { id } = useParams();

  return (
    <div>
      <PopupInfo />
    </div>
  );
}

export default PopupDetail;