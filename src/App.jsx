import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import PopupList from './components/PopupList';
import PopupDetail from './components/PopupDetail';
import OrderList from './components/OrderList';
import ReservationList from './components/ReservationList';
import PopupEdit from './components/PopupEdit';
import OrderInfo from './components/OrderInfo';

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
        <Route path="/host/popup/:id/edit" element={<PopupEdit />} />
        <Route path="/host/orders" element={isLoggedIn ? <OrderList /> : <Navigate to="/host/login" />} />
        <Route path="/host/order/:orderId" element={<OrderInfo />} />
        <Route path="/host/reservations" element={isLoggedIn ? <ReservationList /> : <Navigate to="/host/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
