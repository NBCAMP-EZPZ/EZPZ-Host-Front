import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> {/* setIsLoggedIn 전달 */}
      <Routes>
        <Route path="/host" element={isLoggedIn ? <PopupList /> : <Navigate to="/host/login" />} />
        <Route path="/host/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} /> {/* setIsLoggedIn 전달 */}
        <Route path="/host/signup" element={<SignupForm />} />
        <Route path="/host/popup/:id" element={isLoggedIn ? <PopupDetail /> : <Navigate to="/host/login" />} />
        <Route path="/host/popup/:id/edit" element={isLoggedIn ? <PopupEdit /> : <Navigate to="/host/login" />} />
        <Route path="/host/orders" element={isLoggedIn ? <OrderList /> : <Navigate to="/host/login" />} />
        <Route path="/host/order/:orderId" element={isLoggedIn ? <OrderInfo /> : <Navigate to="/host/login" />} />
        <Route path="/host/reservations" element={isLoggedIn ? <SlotList /> : <Navigate to="/host/login" />} />
        <Route path="/host/items" element={isLoggedIn ? <ItemList /> : <Navigate to="/host/login" />} />
        <Route path="/host/item/:itemId" element={isLoggedIn ? <ItemInfo /> : <Navigate to="/host/login" />} />
        <Route path="/host/item/:itemId/edit" element={isLoggedIn ? <ItemEdit /> : <Navigate to="/host/login" />} />
        <Route path="/host/item/create" element={isLoggedIn ? <ItemCreate /> : <Navigate to="/host/login" />} />
        <Route path="/host/popup/create" element={isLoggedIn ? <PopupCreate /> : <Navigate to="/host/login" />} />
        <Route path="/host/reservations/create" element={isLoggedIn ? <SlotCreate /> : <Navigate to="/host/login" />} />
        <Route path="/host/reservations/slot/:popupId/:slotId/edit" element={isLoggedIn ? <SlotUpdate /> : <Navigate to="/host/login" />} />
        <Route path="/host/popup/slots" element={isLoggedIn ? <SlotList /> : <Navigate to="/host/login" />} />
        <Route path="/host/popup/:popupId/slot/:slotId" element={isLoggedIn ? <ReservationList /> : <Navigate to="/host/login" />} />
        </Routes>
    </Router>
  );
}

export default App;
