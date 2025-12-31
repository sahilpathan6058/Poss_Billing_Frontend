import React, { useState } from "react"; // ✅ Import hooks correctly
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Registration from "./Components/Registration";
import Home from "./Components/Home";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";


function App() {
   const [state, setState] = useState(null); // ✅ Inside component
  return (


    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/home/*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;









// import { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./Components/Login"; 
// import Registration from "./Components/Registration";
// import Home from "./Components/Home";
// import "bootstrap/dist/css/bootstrap.min.css";

// function App() {
 
//   return (
//     <>
      
//          <Router>
//           <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route path="/registration" element={<Registration />} />
//             <Route path="/home/*" element={<Home />} />   
//            </Routes>
//         </Router>   
        
      
//     </>
//   )
// }

// export default App
