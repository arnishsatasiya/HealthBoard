import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const authToken = localStorage.getItem('authToken'); // Get the authToken from local storage

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');

    // ...
    
        if (!authToken) {
          // Redirect to '/' if authToken is not found
          window.location.href = '/';
        }
    // Fetch the list of customer IDs from the API
    const fetchCustomerList = async () => {
      try {
        const response = await fetch('BACKEND API/URL', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken, // Include the authToken in the headers
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch customer list');
        }
        const data = await response.json();
        console.log("data ",data);
        const result = data.customer_ids
        console.log("result",result);
        setCustomers(result); // Update the state with the fetched customer IDs
      } catch (error) {
        console.error('Error fetching customer list:', error);
      }
    };

    fetchCustomerList();
  }, [authToken]);

  return (
    <div>
      <h2>Customers List</h2>
      <ul className='list'>
        {customers.length > 0 ? (
          customers.map((customer, index) => (
            <li key={index} className="customer-item">
              <Link to={`/customer/${customer}`} target="_blank" rel="noopener noreferrer">
                {customer}
              </Link>
            </li>
          ))
        ) : (
          <p>No customers available.</p>
        )}
      </ul>
    </div>
  );
};

export default Customers;
