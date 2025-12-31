import React from 'react';
import Navbar from "./Navbar";
import Category from "./Category";
import { Routes, Route } from "react-router-dom";
import Product from './Product';
import Pos from './Pos';
import Dashboard from './Dashboard';
import "./Home.css";




const Home = () => {
  return (
    <>
      <Navbar />
      <div className="home-background">
      <Routes>
      <Route path="/Category" element={<Category />} />
        <Route path="/Product" element={<Product />} />
        <Route path="Pos" element={< Pos/>}/>
        <Route path='Dashboard' element={<Dashboard/>}/>

      </Routes>
</div>
  </>                         
  );
}

export default Home;
