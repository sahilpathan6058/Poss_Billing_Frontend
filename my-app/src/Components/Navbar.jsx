import React, { useState } from 'react';
import "./Navbar.css";
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* <nav className="navbar">
      <div className="nav-left">
        <button className="dashboard-btn">DASHBOARD</button>
      </div>

      <div className="nav-center">
        <button>POS</button>
        <button>CATEGORY</button>
        <button>PRODUCT</button>
        <button>REPORTS</button>
      </div>

      <div className="nav-right">
        <button className="logout-btn" onClick={()=>nevigate("/")} >LOGOUT</button>
      </div>
    </nav> */}

      <nav className="navbar">
        <div className="nav-left">
         <div className="logo">
  {/* <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKAbOVOdWrZa9jQhYZoKveI_7pQMGeoC3KUL6Mm2fFVQn77BdnKTxVfQDHS9YjE2dKWNM&usqp=CAUhttps://maharajhotels.com/img/maharaj-hotels-logo.svg" alt="Logo" className="logo-img" /> */}
  {/* <h2>MAHARAJA</h2> */}
  <span>MAHARAJA</span>
</div>


        </div>


        {/* Hamburger button for mobile */}
        <div className="hamburger-menu" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        <div className={`nav-center ${menuOpen ? "open" : ""}`}>

          <button onClick={() => navigate("/Home/Dashboard")}>DASHBOARD</button>
          <button onClick={() => navigate("/Home/Pos")}>POS</button>
          <button onClick={() => navigate("/Home/Category")}>CATEGORY</button>
          <button onClick={() => navigate("/Home/Product")}>PRODUCT</button>
          <button>REPORTS</button>
          <button className="logout-btn" onClick={() => navigate("/")}>LOGOUT</button>
        </div>

        <div className="nav-right">
          <button className="logout-btn" onClick={() => navigate("/")}>
            LOGOUT
          </button>
        </div>
      </nav>
    </>
  )
}

export default Navbar