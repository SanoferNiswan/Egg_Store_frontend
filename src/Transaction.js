import React, { useState, useEffect } from "react";
import "./App.css";
// import "./Home.css";
import logo from './logo2.png';
import "./Transaction.css";
import { TextField, Button, Stack } from "@mui/material";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

axios.defaults.baseURL = "http://localhost:8080/";

const Transaction = () => {
  const [shopName,setShopName] = useState("");
  const [transactionList, setTransactionList] = useState([]);
  const [transactionDetails, setTransactionDetails] = useState({
    CustomerId: null,
    TranId: "",
    CustomerName: "",
    ShopName: "",
    ShopAddress: "",
    Mobile: "",
    TrayDelivered: "",
    TrayCollected: "",
    TotalAmount: "",
    PaidAmount: "",
    BalanceAmount: "",
    DelivereyPerson: "",
  });
  const [settlementDetails, setSettlementDetails] = useState({
    CustomerId: null,
    AmountToBePaid: null,
    TrayToBeCollected: null
  });

  const [currentSettle, setCurrentSettle] = useState({
    Amount: null,
    TrayCount: null
  })

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showSettlementModal, setShowSettlementModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenSettlementModal = () => {
    setShowSettlementModal(true);
  };

  const handleCloseSettlementModal = () => {
    setShowSettlementModal(false);
  };

  useEffect(() => {
    const newCustomers = location.state?.newCustomers || [];
    const selectedCustomer = newCustomers.find(
      (cust) => cust.CustomerId?.toString() === id
    );
    setShopName(selectedCustomer.ShopName)
    if (selectedCustomer) {
      setTransactionDetails((prevState) => ({
        ...prevState,
        CustomerId: id,
        CustomerName: selectedCustomer.CustomerName || "",
        ShopName: selectedCustomer.ShopName || "",
        ShopAddress: selectedCustomer.ShopAddress || "",
        Mobile: selectedCustomer.Mobile || "",
      }));
    } else {
      console.warn(`Customer with id ${id} not found`);
    }
  }, [id, location.state]);

  useEffect(() => {
    fetchTransactions();
    fetchSettlement();
  }, []);


  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`/gettrandetails/${id}`);
      setTransactionList(response.data.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  
const fetchSettlement = async () => {
  try {
    debugger;
    const response = await axios.get(`/getsettlementdetails/${id}`);
    setSettlementDetails(response.data.data[0] || {
      CustomerId: response.data.data.CustomerId,
      AmountToBePaid: response.data.data.AmountToBePaid,
      TrayToBeCollected: response.data.data.TrayToBeCollected,
    });
    // settlementDetailsLst(response.data.data)
  } catch (error) {
    console.error("Error fetching settlement details:", error);
  }
};

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTransactionDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSettlementChange = (event) => {
    debugger;
    const { name, value } = event.target;
    setCurrentSettle((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBlur = () => {
    const value = transactionDetails.TotalAmount - transactionDetails.PaidAmount;
    setTransactionDetails((prevState) => ({
      ...prevState,
      BalanceAmount: value,
    }));
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const data = await axios.post("/savetrans", transactionDetails);
  //     console.log(data);
  //     alert("Transaction saved successfully");
  //     navigate(`/edit/${transactionDetails.CustomerId}`);
  //     setShowModal(false);
  //     fetchTransactions();
  //     setTransactionDetails((prevState) => ({
  //       ...prevState,
  //       CustomerId: transactionDetails.CustomerId,
  //       CustomerName: "",
  //       ShopName: "",
  //       ShopAddress: "",
  //       Mobile: "",
  //     }));
  //   } catch (error) {
  //     console.error("Error saving transaction:", error);
  //     alert("Failed to save transaction");
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      transactionDetails.TranId = Math.floor(Math.random() * 100001)
      const transaction = await axios.post("/savetrans", transactionDetails);
      const updatedSettlement = {
        CustomerId: parseInt(id),
        AmountToBePaid: transactionDetails.BalanceAmount + settlementDetails.AmountToBePaid,
        TrayToBeCollected:
          settlementDetails.TrayToBeCollected + (transactionDetails.TrayDelivered - transactionDetails.TrayCollected),
      };
      await axios.put("/updatesettlement", updatedSettlement);
      alert("Transaction and Settlement saved successfully");
      fetchSettlement();
      fetchTransactions();
      setShowModal(false);
      // Clear input fields
      setTransactionDetails({
        CustomerId: id,
        CustomerName: "",
        ShopName: "",
        ShopAddress: "",
        Mobile: "",
        TrayDelivered: "",
        TrayCollected: "",
        TotalAmount: "",
        PaidAmount: "",
        BalanceAmount: "",
        DelivereyPerson: "",
    });
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Failed to save transaction");
    }
  };
  

  const handleSettlementSubmit = async (event) => {
    event.preventDefault();
    debugger;
    try {
      // Add logic to handle settlement submission
      console.log("Settlement details:", currentSettle);
      const updatedSettlement = {
        CustomerId: parseInt(id),
        AmountToBePaid:  settlementDetails.AmountToBePaid - currentSettle.Amount,
        TrayToBeCollected: settlementDetails.TrayToBeCollected - currentSettle.TrayCount
      };
      await axios.put("/updatesettlement", updatedSettlement);
      // Make an API call if needed to save settlement details
      alert("Settlement recorded successfully");
      fetchSettlement();
      fetchTransactions();
      setShowSettlementModal(false);
    } catch (error) {
      console.error("Error recording settlement:", error);
      alert("Failed to record settlement");
    }
  };

  return (
    <div className="bg1">
      <nav className="navbar">
        <img src={logo} alt="Logo" className="logo" />
        <div className="nav-links">
          <Button className="navlink" color="secondary" onClick={() => window.location.href = '/'}>Home</Button>
          <Button className="navlink" color="secondary" onClick={handleOpenModal}>
            Add Transaction
          </Button>
          <Button className="navlink" color="secondary" onClick={handleOpenSettlementModal}>
            Settlement
          </Button>
        </div>
      </nav>
      <center className="head"><h1>{shopName}</h1></center>
      <h4>Tray Balance: {settlementDetails.TrayToBeCollected}</h4>
      <h4>Amount Balance: {settlementDetails.AmountToBePaid}</h4>
      <div className="table-container">
      
        {transactionList.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell>Transaction ID</TableCell> */}
                <TableCell>Tray Delivered</TableCell>
                <TableCell>Tray Collected</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Paid Amount</TableCell>
                <TableCell>Balance Amount</TableCell>
                <TableCell>Delivered By</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactionList.map((tran) => (
                <TableRow key={tran.TranId}>
                  {/* <TableCell>{tran.TranId}</TableCell> */}
                  <TableCell>{tran.TrayDelivered}</TableCell>
                  <TableCell>{tran.TrayCollected}</TableCell>
                  <TableCell>{tran.TotalAmount}</TableCell>
                  <TableCell>{tran.PaidAmount}</TableCell>
                  <TableCell>{tran.BalanceAmount}</TableCell>
                  <TableCell>{tran.DelivereyPerson}</TableCell>
                  <TableCell>{new Date(tran.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <center><div className="no-transactions">No transactions available</div></center>
        )}
      </div>
      
      
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
                <TextField
                  type="text"
                  variant="outlined"
                  color="secondary"
                  label="Customer Name"
                  name="CustomerName"
                  onChange={handleChange}
                  value={transactionDetails.CustomerName}
                  fullWidth
                  required
                  disabled
                />
                <TextField
                  type="text"
                  variant="outlined"
                  color="secondary"
                  label="Shop Name"
                  name="ShopName"
                  onChange={handleChange}
                  value={transactionDetails.ShopName}
                  fullWidth
                  required
                  disabled
                />
              </Stack>
              <TextField
                type="text"
                variant="outlined"
                color="secondary"
                label="Shop Address"
                onChange={handleChange}
                name="ShopAddress"
                value={transactionDetails.ShopAddress}
                fullWidth
                required
                disabled
                sx={{ mb: 4 }}
              />
              <TextField
                type="text"
                variant="outlined"
                color="secondary"
                label="Mobile Number"
                name="Mobile"
                onChange={handleChange}
                value={transactionDetails.Mobile}
                fullWidth
                required
                disabled
                sx={{ mb: 4 }}
              />
              <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
                <TextField
                  type="number"
                  variant="outlined"
                  color="secondary"
                  label="Tray Delivered"
                  name="TrayDelivered"
                  onChange={handleChange}
                  value={transactionDetails.TrayDelivered}
                  required
                  fullWidth
                />
                <TextField
                  type="number"
                  variant="outlined"
                  color="secondary"
                  label="Tray Collected"
                  name="TrayCollected"
                  onChange={handleChange}
                  value={transactionDetails.TrayCollected}
                  required
                  fullWidth
                />
                
              </Stack>
              <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
                <TextField
                  type="number"
                  variant="outlined"
                  color="secondary"
                  label="Total Amount"
                  name="TotalAmount"
                  onChange={handleChange}
                  value={transactionDetails.TotalAmount}
                  fullWidth
                  required
                />
                <TextField
                  type="number"
                  variant="outlined"
                  color="secondary"
                  label="Paid Amount"
                  name="PaidAmount"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={transactionDetails.PaidAmount}
                  fullWidth
                  required
                />
              </Stack>
              <TextField
                type="number"
                variant="outlined"
                color="secondary"
                label="Balance Amount"
                name="BalanceAmount"
                value={transactionDetails.BalanceAmount}
                fullWidth
                required
                disabled
                sx={{ mb: 4 }}
              />
              <FormControl fullWidth sx={{ mb: 4 }} variant="outlined" required>
                <InputLabel>Delivered By</InputLabel>
                <Select
                  label="Delivered By"
                  name="DelivereyPerson"
                  value={transactionDetails.DelivereyPerson}
                  onChange={handleChange}
                >
                  <MenuItem value="Jawid">Jawid</MenuItem>
                  <MenuItem value="Dad">Dad</MenuItem>
                  <MenuItem value="Driver">Driver</MenuItem>
                </Select>
              </FormControl>
              <Stack spacing={2} direction="row" justifyContent="center">
                <Button variant="contained" color="secondary" type="submit">
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
              </Stack>
            </form>
          </div>
        </div>
      )}

      {showSettlementModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseSettlementModal}>
              &times;
            </button>
            <form onSubmit={handleSettlementSubmit}>
            <TextField
                type="number"
                variant="outlined"
                color="primary"
                label="Amount Paid"
                name="Amount"
                onChange={handleSettlementChange}
                value={currentSettle.Amount}
                fullWidth
                required
                sx={{ mb: 4 }}
              />
              <TextField
                type="number"
                variant="outlined"
                color="secondary"
                label="Tray Settled"
                name="TrayCount"
                onChange={handleSettlementChange}
                value={currentSettle.TrayCount}
                fullWidth
                required
                sx={{ mb: 4 }}
              />
              <Stack spacing={2} direction="row" justifyContent="center">
                <Button variant="contained" color="secondary" type="submit">
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCloseSettlementModal}
                >
                  Cancel
                </Button>
              </Stack>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transaction;
