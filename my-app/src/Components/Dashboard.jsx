
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./Dashboard.css";
// import {
//   BsFillArchiveFill,
//   BsFillGrid3X3GapFill,
//   BsPeopleFill,
// } from "react-icons/bs";
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   CartesianGrid,
// //   ResponsiveContainer,
// //   Legend,
// // } from "recharts";

// function Dashboard() {
// //  const[categories,setCategories]=useState(""); 

//   // ====== FETCH TOTAL PRODUCTS ======
//   // useEffect(() => {
//   //   const fetchTotalProducts = async () => {
//   //     try {
//   //       const response = await axios.get("http://localhost:8080/api/product/allproduct");
//   //       setTotalProducts(response.data.length);
//   //     } catch (error) {
//   //       console.error("Error fetching total products:", error);
//   //     }
//   //   };
//   //   fetchTotalProducts();
//   // }, []);

//   // ====== FETCH TOTAL CATEGORIES ======


//   // ====== FETCH TOTAL CUSTOMERS ======
//   // useEffect(() => {
//   //   const fetchCustomers = async () => {
//   //     try {
//   //       const res = await axios.get("http://localhost:8080/api/customer/allcustomer");
//   //       setTotalCustomers(res.data.length);
//   //     } catch (err) {
//   //       console.error("Error fetching customers:", err);
//   //     }
//   //   };
//   //   fetchCustomers();
//   // }, []);

//   //   useEffect(() => {
//   //   const fetchCategories = async () => {
//   //     try {
//   //       const res = await axios.get("http://localhost:8080/api/category/allcategory");
//   //       setCategories(res.data.length);
//   //     } catch (err) {
//   //       console.error("Error fetching categories:", err);
//   //     }
//   //   };
//   //   fetchCategories();
//   // }, []);
// const data = [
//   { name: "Starters", value: 400 },
//   { name: "Main Course", value: 300 },
//   { name: "Desserts", value: 300 },
//   { name: "Drinks", value: 200 },
//   { name: "Snacks", value: 150 },
//   { name: "Biryani", value: 250 },
// ];

//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#E74C3C"];


//   return (
//     <div className="dashboard-container">
//       <h1>📊 Dashboard Overview</h1>

//       {/* ===== Summary Cards ===== */}
//       <div className="dashboard-cards">
//         <div className="card orange">
//           <div className="card-header">
//             <h3>Total Products</h3>
//             <BsFillArchiveFill className="icon" />
//           </div>
//           <h1>{totalProducts}</h1>
//         </div>

//         <div className="card teal">
//           <div className="card-header">
//             <h3>Categories</h3>
//             <BsFillGrid3X3GapFill className="icon" />
//           </div>
//           <h1>{totalCategories}</h1>
//         </div>

//         <div className="card green">
//           <div className="card-header">
//             <h3>Customers</h3>
//             <BsPeopleFill className="icon" />
//           </div>
//           <h1>{totalCustomers}</h1>
//         </div>
//       </div>

//       {/* ===== Charts Section ===== */}
//       <div className="charts-container">
//         <div className="chart-card">
//           <h3>📅 Daily Sales Overview</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={dailySalesData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="total" fill="#FF8C42" barSize={40} name="Total Sales" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
} from "react-icons/bs";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [categoryData, setCategoryData] = useState([]);

  // ===== Fetch all products =====
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/product/allproduct");
        setProducts(res.data);
        setTotalProducts(res.data.length);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // ===== Fetch all categories =====
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/category/allcategory");
        setCategories(res.data);
        setTotalCategories(res.data.length);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // ===== Compute category counts for PieChart =====
 
  
  useEffect(() => {
  if (!products.length || !categories.length) return; // wait until both arrays have data

  const chartData = categories.map((cat) => {
    const count = products.filter((p) => {
      const productCat = p.category;

      // normalize IDs
      const productCatId =
        productCat?.id ?? productCat?.categoryId ?? productCat?.productId ?? p.categoryId;
      const categoryId = cat.id ?? cat.categoryId;

      return productCatId === categoryId;
    }).length;

    return {
      name: cat.categoryName ?? cat.name,
      value: count,
    };
  });

  setCategoryData(chartData); // optionally: .filter(c => c.value > 0)
}, [products, categories]);


  // ===== Fetch total customers =====
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/customer/allcustomer");
        setTotalCustomers(res.data.length);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };
    fetchCustomers();
  }, []);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A569BD",
    "#E74C3C",
    "#2ECC71",
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>📊 Dashboard Overview</h1>
      </header>

      {/* ===== Summary Cards ===== */}
      <div className="dashboard-cards">
        <div className="card orange">
          <div className="card-header">
            <BsFillArchiveFill className="icon" />
            <h3>Total Products</h3>
          </div>
          <h1>{totalProducts}</h1>
        </div>

        <div className="card teal">
          <div className="card-header">
            <BsFillGrid3X3GapFill className="icon" />
            <h3>Categories</h3>
          </div>
          <h1>{totalCategories}</h1>
        </div>

        <div className="card green">
          <div className="card-header">
            <BsPeopleFill className="icon" />
            <h3>Customers</h3>
          </div>
          <h1>{totalCustomers}</h1>
        </div>
      </div>

      {/* ===== Pie Chart Section ===== */}
      <div className="charts-container">
        <div className="chart-card">
          <h3>📈 Category Distribution</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="90%" height={400}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="loading">Loading category data...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
