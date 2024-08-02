import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import PopupList from './components/PopupList';
import PopupDetail from './components/PopupDetail';
import OrderList from './components/OrderList'; 
import PopupEdit from './components/PopupEdit';
import OrderInfo from './components/OrderInfo';
import ItemList from './components/ItemList';
import ItemInfo from './components/ItemInfo';
import ItemEdit from './components/ItemEdit';
import ItemCreate from './components/ItemCreate';
import PopupCreate from './components/PopupCreate';
import SlotList from './components/SlotList'; 
import ReservationList from './components/ReservationList';
import SlotCreate from './components/SlotCreate';
import SlotUpdate from './components/SlotUpdate';
import SlotDetail from './components/SlotDetail';
import PrivateRoute from './components/PrivateRoute'; // PrivateRoute import

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

  useEffect(() => {
    // 로컬 스토리지에서 토큰 확인
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/host/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/host/signup" element={<SignupForm />} />
        
        <Route path="/*" element={<PrivateRoute isLoggedIn={isLoggedIn}>
          <Routes>
            <Route path="/host" element={<PopupList />} />
            <Route path="/host/popup/:id" element={<PopupDetail />} />
            <Route path="/host/popup/:id/edit" element={<PopupEdit />} />
            <Route path="/host/orders" element={<OrderList />} />
            <Route path="/host/order/:orderId" element={<OrderInfo />} />
            <Route path="/host/reservations" element={<SlotList />} />
            <Route path="/host/items" element={<ItemList />} />
            <Route path="/host/item/:itemId" element={<ItemInfo />} />
            <Route path="/host/item/:itemId/edit" element={<ItemEdit />} />
            <Route path="/host/item/create" element={<ItemCreate />} />
            <Route path="/host/popup/create" element={<PopupCreate />} />
            <Route path="/host/reservations/create" element={<SlotCreate />} />
            <Route path="/host/reservations/slot/:popupId/:slotId/edit" element={<SlotUpdate />} />
            <Route path="/host/popup/slots" element={<SlotList />} />
            <Route path="/host/popup/:popupId/slot/:slotId" element={<ReservationList />} />
            <Route path="/host/reservations/slot/:popupId/:slotId" element={<SlotDetail />} />
          </Routes>
        </PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
