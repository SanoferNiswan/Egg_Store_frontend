import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom'; // Import Routes, Route, and BrowserRouter
import './App.css';
import Customer from './Transaction';
import Home from './Home';

function App() {
  return (
    <>
      <div>
      <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/edit/:id' element={<Customer />}/>
        </Routes>
      </div>
    </>
  );
}

export default App;
