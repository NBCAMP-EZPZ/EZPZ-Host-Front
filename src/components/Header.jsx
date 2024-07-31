import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';
import { FaUser, FaBars } from 'react-icons/fa'; // FontAwesome 아이콘 추가
import { Dropdown, DropdownButton } from 'react-bootstrap'; // React Bootstrap 추가
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/Header.css';

function Header({ isLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // 로그아웃 API 호출
      localStorage.removeItem('accessToken'); // localStorage에서 사용자 정보 제거
      navigate('/host/login'); // 로그인 페이지로 리디렉션
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error('로그아웃 실패:', error); // 에러 로그 출력
      // 필요에 따라 사용자에게 에러 메시지 표시
    }
  };

  return (
    <header className="header d-flex justify-content-between align-items-center p-3">
      <h1 className="header-title">
        <Link to="/host" className="header-link">EZPZ</Link>
      </h1>
      <nav className="nav-links">
        {isLoggedIn ? (
          <>
            <DropdownButton className="m-2" title={<><FaUser /> 마이 페이지</>} alignRight>
              <Dropdown.Item as={Link} to="/host/orders">주문 목록 보기</Dropdown.Item>
              <Dropdown.Item as={Link} to="/host/reservations">예약 내역 보기</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
            </DropdownButton>
            <DropdownButton
              alignRight
              title={<FaBars style={{ fontSize: '1.5rem' }} />}
              id="dropdown-menu-align-right"
              variant="secondary"
            >
              <Dropdown.Item onClick={() => navigate('/host')}>팝업 관리</Dropdown.Item>
              <Dropdown.Item onClick={() => navigate('/host/items')}>굿즈 관리</Dropdown.Item>
              <Dropdown.Item onClick={() => navigate('/host/reservations')}>예약 관리</Dropdown.Item>
              <Dropdown.Item onClick={() => navigate('/host/orders')}>주문 관리</Dropdown.Item>
            </DropdownButton>
          </>
        ) : (
          <>
            <Link to="/host/login" className="btn btn-primary m-2">로그인</Link>
            <Link to="/host/signup" className="btn btn-secondary m-2">회원가입</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
