// frontend/src/components/ItemList.js
import React, { useState, useEffect } from 'react';

const ItemList = () => {
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the backend
  useEffect(() => {
    fetch('http://localhost:5000/api/inquiries') // Make sure the URL is correct
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setInquiry(data);  // Set the inquiry data
        setLoading(false);  // Stop loading
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);  // Stop loading
      });
  }, []);

  if (loading) {
    return<h1>Loading...</h1>;
  }

//   if (error) {
//     return <h1>Error: {error}</h1>;
//   }

  return (
    <>
 
      <h4 id="sample1">
        {/* Display the fullName from the inquiry data */}
        {inquiry ? inquiry.fullName : 'No data available'}
      </h4>
      <p>Subject: {inquiry ? inquiry.subject : ''}</p>
      <p>Email: {inquiry ? inquiry.email : ''}</p>
      <p>Message: {inquiry ? inquiry.message : ''}</p>
    </>
  );
};

export default ItemList;
