import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/LoginForm.css';

function SignupForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,}$/;
    return passwordPattern.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setMessage('비밀번호는 최소 10자 이상이어야 하며, 영문 대소문자, 숫자, 특수문자를 최소 1글자씩 포함해야 합니다.');
      return;
    }

    try {
      await signup({ username, password, companyName, email, businessNumber });
      setMessage('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      navigate('/host/login'); // 회원가입 성공 후 로그인 페이지로 이동
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message); // 서버에서 받은 에러 메시지를 설정
      } else {
        setMessage('회원가입에 실패했습니다. 정보를 확인하고 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow custom-card">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">회원가입</h2>
          <form onSubmit={handleSignup}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                아이디
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                비밀번호
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="companyName" className="form-label">
                기업명
              </label>
              <input
                type="text"
                className="form-control"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                이메일
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="businessNumber" className="form-label">
                사업자 번호
              </label>
              <input
                type="text"
                className="form-control"
                id="businessNumber"
                value={businessNumber}
                onChange={(e) => setBusinessNumber(e.target.value)}
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn custom-btn">
                회원가입
              </button>
            </div>
          </form>
          {message && <p className="mt-3 text-center text-danger">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
