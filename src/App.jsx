import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ContactUs from './ContactUs';
import AdminInquiryPage from './AdminInquiryPage';
import Header from './Header';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={
            <>
              <Header /> {/* This renders the Header only for the Contact Us page */}
              <ContactUs />
            </>
          } />
          <Route path="/admin" element={<AdminInquiryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
