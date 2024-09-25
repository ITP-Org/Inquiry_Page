import React, { useState, useEffect } from "react";
import "./AdminInquiryPage.css";
import { FiEdit, FiArrowRight, FiSearch, FiTrash, FiFileText } from "react-icons/fi";
import axios from "axios";
import jsPDF from "jspdf";

const AdminInquiryPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [reply, setReply] = useState("");
  const [replyIndex, setReplyIndex] = useState(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.get("http://localhost:5000/inquiries/getAll");
        setInquiries(response.data.inquiries);
        setFilteredInquiries(response.data.inquiries);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      }
    };

    fetchInquiries();
  }, []);

  const fetchInquiryById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/inquiries/get/${id}`);
      setSelectedInquiry(response.data.inquiry);
    } catch (error) {
      console.error("Error fetching inquiry by ID:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = inquiries.filter(
      (inquiry) =>
        inquiry.fullName.toLowerCase().includes(query) ||
        inquiry.subject.toLowerCase().includes(query)
    );
    setFilteredInquiries(filtered);
  };

  const handleReply = () => {
    if (!reply || !selectedInquiry || !selectedInquiry._id) return;
    axios
      .post(`http://localhost:5000/inquiries/addReply/${selectedInquiry._id}`, {
        reply,
      })
      .then((response) => {
        setInquiries(
          inquiries.map((inquiry) =>
            inquiry._id === selectedInquiry._id
              ? response.data.inquiry
              : inquiry
          )
        );
        setSelectedInquiry(response.data.inquiry);
        setReply("");
        setReplyIndex(null);
      })
      .catch((error) => {
        console.error("Error adding reply to inquiry:", error);
      });
  };

  const handleUpdateReply = () => {
    if (replyIndex === null || !reply) return;
    axios
      .post(`http://localhost:5000/inquiries/updateReply/${selectedInquiry._id}`, {
        replyIndex,
        newReply: reply,
      })
      .then((response) => {
        setInquiries(
          inquiries.map((inquiry) =>
            inquiry._id === selectedInquiry._id
              ? response.data.inquiry
              : inquiry
          )
        );
        setSelectedInquiry(response.data.inquiry);
        setReply("");
        setReplyIndex(null);
      })
      .catch((error) => {
        console.error("Error updating reply:", error);
      });
  };

  const handleDeleteReply = (index) => {
    axios
      .post(`http://localhost:5000/inquiries/deleteReply/${selectedInquiry._id}`, {
        reply: selectedInquiry.replies[index],
      })
      .then((response) => {
        const updatedInquiries = inquiries.map((inquiry) => {
          if (inquiry._id === selectedInquiry._id) {
            return {
              ...inquiry,
              replies: inquiry.replies.filter((_, i) => i !== index),
            };
          }
          return inquiry;
        });
        setInquiries(updatedInquiries);
        setSelectedInquiry(response.data.inquiry);
        setReply("");
        setReplyIndex(null);
      })
      .catch((error) => {
        console.error("Error deleting reply:", error);
      });
  };

  const generateReport = () => {
    if (!selectedInquiry) return;

    const doc = new jsPDF();
    doc.setFontSize(12);
    
    // Add inquiry details to PDF
    doc.text(`Inquiry Details Report`, 10, 10);
    doc.text(`Name: ${selectedInquiry.fullName}`, 10, 20);
    doc.text(`Email: ${selectedInquiry.email}`, 10, 30);
    doc.text(`Phone: ${selectedInquiry.phone}`, 10, 40);
    doc.text(`Subject: ${selectedInquiry.subject}`, 10, 50);
    doc.text(`Message: ${selectedInquiry.message}`, 10, 60);
    
    // Add replies if any
    if (selectedInquiry.replies.length > 0) {
      doc.text(`Replies:`, 10, 70);
      selectedInquiry.replies.forEach((reply, index) => {
        doc.text(`Reply ${index + 1}: ${reply}`, 10, 80 + (index * 10));
      });
    } else {
      doc.text(`No replies available.`, 10, 70);
    }

    doc.save("inquiry_report.pdf");
  };

  return (
    <>
    <h2 style={{ color: '#744ecd', textAlign: 'left', marginLeft: '153px' }}>Inquiry Management</h2>
    <div className="admin-container">
      <div className="inquiry-list">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search by name or subject..."
            className="search-bar"
            value={searchQuery}
            onChange={handleSearch}
          />
          <div className="search-icon-container">
            <FiSearch className="search-icon" />
          </div>
        </div>
        {filteredInquiries.length === 0 ? (
          <p className="no-inquiries-message">No inquiries found</p>
        ) : (
          filteredInquiries.map((inquiry) => (
            <div
              key={inquiry._id}
              className={`inquiry-item ${
                selectedInquiry && selectedInquiry._id === inquiry._id
                  ? "active"
                  : ""
              }`}
            >
              <div className="inquiry-profile">
                <img
                  src={inquiry.profilePic}
                  alt="Profile"
                  className="profile-img"
                />
                <div className="inquiry-info">
                  <h3>{inquiry.fullName}</h3>
                  <p>{inquiry.subject}</p>
                  <span className="inquiry-date">
                    {new Date(inquiry.Date).toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <div className="arrow-icon-container">
                <FiArrowRight
                  className="view-icon"
                  title="View inquiry details"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents the inquiry item's handler from firing
                    fetchInquiryById(inquiry._id);
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="content-area">
        {selectedInquiry ? (
          <>
            <div className="inquiry-header">
              <img
                src={selectedInquiry.profilePic}
                alt="Profile"
                className="selected-profile-img"
              />
              <div className="inquiry-header-info">
                <h3>{selectedInquiry.fullName}</h3>
                <p>Email: {selectedInquiry.email}</p>
                <p>Phone: {selectedInquiry.phone}</p>
              </div>
            </div>

            <h4>Subject: {selectedInquiry.subject}</h4>
            <p>Message: {selectedInquiry.message}</p>

            <div className="replies">
              {selectedInquiry.replies.length > 0 && (
                <>
                  <h5>Replies:</h5>
                  {selectedInquiry.replies.map((rep, index) => (
                    <div key={index} className="reply-message">
                      <p>{rep}</p>
                      <div className="reply-icons">
                        <FiEdit
                          className="edit-icon"
                          onClick={() => {
                            setReply(rep);
                            setReplyIndex(index);
                          }}
                          title="Edit reply"
                        />
                        <FiTrash
                          className="delete-icon"
                          onClick={() => handleDeleteReply(index)}
                          title="Delete reply"
                        />
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="reply-area">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your response here..."
              />
              <div className="action-buttons">
                <button
                  className="discard-btn"
                  onClick={() => {
                    setReply("");
                    setReplyIndex(null);
                  }}
                >
                  Discard
                </button>
                <button
                  className="reply-btn"
                  onClick={replyIndex !== null ? handleUpdateReply : handleReply}
                >
                  {replyIndex !== null ? "Update" : "Reply"}
                </button>
              </div>
            </div>

            {/* Generate Report Button with PDF Icon on the right side */}
            <div className="generate-report-container">
              <button className="generate-report-btn" onClick={generateReport}>
                <FiFileText className="pdf-icon" />
                Generate Report
              </button>
            </div>
          </>
        ) : (
          <p>Please select an inquiry to view details.</p>
        )}
      </div>
    </div>
    </>
  );
};

export default AdminInquiryPage;
