import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import axios from 'axios';

const TransactionDetail = () => {
  const [transactions, setTransactions] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`/getTransactions/${id}`);
        setTransactions(response.data.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [id]);

  const handleAddTransaction = () => {
    navigate(`/transaction/add/${id}`);
  };

  return (
    <div>
      <h2>Transactions for Customer ID: {id}</h2>
      <Button variant="outlined" color="primary" onClick={handleAddTransaction}>
        Add Transaction
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Transaction ID</TableCell>
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
          {transactions.map((transaction) => (
            <TableRow key={transaction.TranId}>
              <TableCell>{transaction.TranId}</TableCell>
              <TableCell>{transaction.TrayDelivered}</TableCell>
              <TableCell>{transaction.TrayCollected}</TableCell>
              <TableCell>{transaction.TotalAmount}</TableCell>
              <TableCell>{transaction.PaidAmount}</TableCell>
              <TableCell>{transaction.BalanceAmount}</TableCell>
              <TableCell>{transaction.DelivereyPerson}</TableCell>
              <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionDetail;
