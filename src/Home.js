//access from db

import React, { useState, useEffect } from 'react';
import './Home.css';
// import "./Transaction.css"
import logo from './logo2.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Stack } from "@mui/material";
import { FaTrashAlt } from "react-icons/fa";

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    CustomerId: null,
    CustomerName: "",
    ShopName: "",
    ShopAddress: "",
    Mobile: ""
  });

  const [settlementDetails, setSettlementDetails] = useState({
    CustomerId: null,
    AmountToBePaid: 0,
    TrayToBeCollected: 0
    
  });
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
}, []); // No dependency on `customers` to avoid infinite loops

const fetchCustomers = async () => {
  try {
      const response = await axios.get('https://egg-store-backend.onrender.com/getcustomers');
      setCustomers(response.data.data);
  } catch (error) {
      console.error('Error fetching customers:', error);
  }
};
  const handleAddCustomerClick = () => {
    setShowPopup(true);
  };

  const handleSaveCustomer = async () => {
    const maxId = customers.length > 0 
      ? Math.max(...customers.map(customer => customer.CustomerId || 0)) 
      : 0;
  
    const newCustomer = {
      ...customerDetails,
      CustomerId: maxId + 1
    };

    const newSettlement = {
      ...settlementDetails,
      CustomerId: newCustomer.CustomerId
    };
  
    console.log('Saving Customer:', newCustomer); // Check the data before sending
  
    try {
      const response = await axios.post('https://egg-store-backend.onrender.com/savecustomer', newCustomer);
      const settlementResponse = await axios.post('https://egg-store-backend.onrender.com/savesettlement',newSettlement);
      setCustomers([...customers, response.data.data]);
      setShowPopup(false);
      setCustomerDetails({ ShopName: '', CustomerName: '', ShopAddress: '', Mobile: '' });
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };
  
  

  const handleEditClick = (CustomerId) => {
    navigate(`/edit/${CustomerId}`, { state: { newCustomers: customers } });
  };

  const handleDeleteClick = async (id) => {
    debugger;
    try {
      await axios.delete(`https://egg-store-backend.onrender.com/delete/${id}`);
      setCustomers(customers.filter(customer => customer._id !== id));
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  

  const filteredCustomers = customers.filter(customer => 
    customer.ShopName && customer.ShopName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="main">
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
        <div className="searchBarContainer">
          <input 
            type="text" 
            placeholder="Search..." 
            className="searchBar" 
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span className="searchIcon">&#128269;</span> {/* Unicode for a search icon 128270*/}
        </div>
      </header>

      
      <div className="customerList">
  {filteredCustomers.length > 0 ? (
    filteredCustomers.map((customer) => (
      <div key={customer._id} className="customerItem">
        <h3 className="shopName">{customer.ShopName}</h3>
        <h5 className='shopName'>{customer.CustomerName}</h5>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleEditClick(customer.CustomerId)}>
          Transactions
        </Button>
        <FaTrashAlt
          role="button"
          onClick={() => handleDeleteClick(customer.CustomerId)}
          tabIndex="0"
          aria-label={`Delete ${customer.CustomerId}`}
          className='trash'
        />
      </div>
    ))
  ) : (
    <div className="no-customers">
      No customers available
    </div>
  )}
</div>


      <footer className="footer">
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddCustomerClick}>
          Add Customer
        </Button>
      </footer>

      {showPopup && (
        <div className="popup">
          <div className="popupContent">
            <h3>Add Customer Details</h3>
            <input 
              type="text" 
              name="CustomerName" 
              value={customerDetails.CustomerName} 
              onChange={handleInputChange} 
              placeholder="Enter customer name" 
            />
            <input 
              type="text" 
              name="ShopName" 
              value={customerDetails.ShopName} 
              onChange={handleInputChange} 
              placeholder="Enter shop name" 
            />
            <input 
              type="text" 
              name="ShopAddress" 
              value={customerDetails.ShopAddress} 
              onChange={handleInputChange} 
              placeholder="Enter shop address" 
            />
            <input 
              type="text" 
              name="Mobile" 
              value={customerDetails.Mobile} 
              onChange={handleInputChange} 
              placeholder="Enter mobile number" 
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSaveCustomer}>
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setShowPopup(false)}>
              Cancel
            </Button>
            {/* <button onClick={handleSaveCustomer}>Save</button>
            <button onClick={() => setShowPopup(false)}>Cancel</button> */}
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;

