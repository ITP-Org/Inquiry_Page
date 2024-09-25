import React, { useState } from 'react';
import './contactUS.css'; // CSS for styling
import axios from 'axios'; // Import axios to make HTTP requests
import ContactImage from './assets/ContactImage.jpeg';

const ContactUs = () => {
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    subject: '',
    email: '',
    phone: '',
    message: '',
  });

  // UI state
  const [loading, setLoading] = useState(false); // State for loading spinner or button text
  const [responseMessage, setResponseMessage] = useState(''); // To display feedback after submission
  const [errorMessage, setErrorMessage] = useState(''); // Error message display

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the field is phone, ensure it contains only numbers
    if (name === 'phone') {
      const numericValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setResponseMessage(''); // Clear any previous success messages
    setErrorMessage(''); // Clear any previous error messages
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Show loading state

    try {
      // Send data to the backend API
      const res = await axios.post('http://localhost:5000/inquiries/add', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // If success, display a success message
      setResponseMessage('Inquiry submitted successfully!');

      // Clear form after successful submission
      setFormData({
        fullName: '',
        subject: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting inquiry:', error.response || error);
      
      // Set an error message if something goes wrong
      setErrorMessage(
        error.response?.data?.message || 'Failed to submit inquiry. Please try again later.'
      );
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="contact-wrapper">
      {/* Left side image */}
      <div className="contact-image">
        <img src={ContactImage} alt="Contact Us" />
      </div>

      {/* Right side form */}
      <div className="form">
        <h2 id="topic">Contact Us</h2>
        <h5 id="detail">Fill out the form and we will get back to you promptly</h5>
        <div className="contact-container">
          <form onSubmit={handleSubmit}>
            <label htmlFor="fullName">Full Name*</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <label htmlFor="subject">Subject*</label>
            <input
              type="text"
              name="subject"
              id="subject"
              placeholder="Enter your subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email*</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="[0-9]*" // Allow only numbers
                  inputMode="numeric" // Bring up numeric keyboard on mobile
                />
              </div>
            </div>

            <label htmlFor="message">Message*</label>
            <textarea
              name="message"
              id="message"
              placeholder="Type your message here"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </button>

            <div className="contact-info">
    <div className="info-item">
      <div className="icon-circle">
        <i className="fas fa-envelope"></i> {/* Gmail Icon */}
      </div>
      <a href="mailto:saumikasenanayake@gmail.com" className="info-link">saumikasenanayake@gmail.com</a>
    </div>
    <div className="info-item">
      <div className="icon-circle">
        <i className="fas fa-phone-alt phone-icon"></i> {/* Phone Icon with a custom class for rotation */}
      </div>
      <a href="tel:+94773002244" className="info-link">+94 773 000 244</a>
    </div>
  </div>
          </form>

          {/* Display success or error messages */}
          {responseMessage && <p className="success-message">{responseMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
