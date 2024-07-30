import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PopupList from './component/PopupList.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PopupList />} />
      </Routes>
    </Router>
  );
};

export default App;
