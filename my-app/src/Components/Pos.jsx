import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Pos.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



function Pos() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchProd, setSearchProd] = useState("");

    const [customerName, setCustomerName] = useState("");
    const [customerContact, setCustomerContact] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [allCustomers, setAllCustomers] = useState([]);
    const [searchedCustomer, setSearchedCustomer] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchCustomerName, setSearchCustomerName] = useState("");
    const [newCustomerName, setNewCustomerName] = useState("");
    const [newCustomerContact, setNewCustomerContact] = useState("");
    const [newCustomerAddress, setNewCustomerAddress] = useState("");
    const [discount, setDiscount] = useState(0);
    const [gstAmt, setGstAmt] = useState(0);
    const [serviceCharge, setServiceCharge] = useState(0);
    const [paymentMode, setPaymentMode] = useState("CASH");
    const [totalAmt, setTotalAmt] = useState(0);
    const [totalNetAmt, setTotalNetAmt] = useState(0);
    const [showCustomerForm, setShowCustomerForm] = useState(false);
    const [useMessage, setUseMessage] = useState("");

    // Fetch Data
    const fetchCategories = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/category/allcategory");
            setCategories(res.data || []);
        } catch (err) {
            console.log("Error fetching categories!", err);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/product/allproduct");
            setProducts(res.data || []);
            setFilteredProducts(res.data);
        } catch (err) {
            console.log("Error fetching products!", err);
        }
    };

    const fetchCustomers = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/customer/allcustomer");
            setAllCustomers(res.data);
        } catch (err) {
            console.log("Error fetching customers!", err);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts();
        fetchCustomers();
    }, []);

    // Filter Products
    useEffect(() => {
        const search = searchProd.toLowerCase().trim();

        const filtered = products.filter((prod) => {
            const nameMatch = (prod.productName || "").toLowerCase().includes(search);
            const idMatch = String(prod.productId).includes(search);
            const priceMatch = String(prod.productPrice).includes(search);

            const categoryMatch =
                selectedCategory === "all" ||
                prod.category?.categoryId === Number(selectedCategory);

            return (nameMatch || idMatch || priceMatch) && categoryMatch;
        });

        setFilteredProducts(filtered);
    }, [searchProd, selectedCategory, products]);

    // Cart functions
    const addToCart = (product) => {
        setCart((prevCart) => {
            const existing = prevCart.find((item) => item.productId === product.productId);

            if (existing) {
                // Increase quantity if product already exists
                return prevCart.map((item) =>
                    item.productId === product.productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Add new product with quantity 1
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };


    const removeFromCart = (productId) =>
        setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));

    const updateQuantity = (productId, qty) => {
        if (qty < 1) return;
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.productId === productId
                    ? { ...item, quantity: qty }
                    : item
            )
        );
    };

    const increaseQuantity = (productId) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.productId === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decreaseQuantity = (productId) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.productId === productId
                    ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
                    : item
            )
        );
    };

    // Handle Customer
    const addCustomer = async (e) => {
        e.preventDefault();
        const name = newCustomerName.trim();
        let contact = newCustomerContact.trim();
        const address = newCustomerAddress.trim();

        if (!name || !contact || !address) {
            toast.error("⚠️ Please fill in all fields: Name, Contact, and Address.");
            return;
        }

        const nameRegex = /^[A-Za-z\s]{3,50}$/;
        if (!nameRegex.test(name)) {
            toast.error("❌ Invalid Name: Use only letters and spaces (min 3 characters).");
            return;
        }

        const contactRegex = /^[6-9]\d{9}$/;
        if (!contactRegex.test(contact)) {
            toast.error("❌ Invalid Contact Number: Enter a valid 10-digit mobile number.");
            return;
        }

        const addressRegex = /^[A-Za-z0-9\s,.\-#\/]{1,}$/;
        if (!addressRegex.test(address)) {
            toast.error("❌ Invalid Address: Please enter a valid address (min 1 characters).");
            return;
        }

        try {
            const params = new URLSearchParams();
            params.append("customerName", name);
            params.append("customerContact", contact);
            params.append("customerAddress", address);

            const res = await axios.post(
                "http://localhost:8080/api/customer/addcustomer",
                params,
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            );

            const newCust = res.data;

            setAllCustomers(prev => [...prev, newCust]);
            setSelectedCustomer(newCust);
            setSearchCustomerName(newCust.customerName);
            setCustomerContact(newCust.customerContact);
            setCustomerAddress(newCust.customerAddress);
            setSearchedCustomer([newCust]);

            setNewCustomerName("");
            setNewCustomerContact("");
            setNewCustomerAddress("");

            alert("Customer added successfully!");
            setShowCustomerForm(false);

        } catch (error) {
            console.error(error);
            toast.error("Error adding customer!");
        }
    };

    useEffect(() => {
        if (!searchCustomerName) {
            setSearchedCustomer([]);
            return;
        }

        const results = allCustomers.filter(cust =>
            (cust.customerName || "").toLowerCase().includes(searchCustomerName.toLowerCase()) ||
            String(cust.customerContact || "").includes(searchCustomerName)
        );

        setSearchedCustomer(results);
    }, [searchCustomerName, allCustomers]);

    const CustomerSearch = (e) => {
        setSearchCustomerName(e.target.value);
        setSelectedCustomer(null);
    };

    const selectCustomer = (cust) => {
        setSelectedCustomer(cust);
        setSearchCustomerName(`${cust.customerName} (${cust.customerContact})`);
        setCustomerContact(cust.customerContact);
        setCustomerAddress(cust.customerAddress);
        setSearchedCustomer([]);
    };

    // Handle TotalAmt

    const handleDiscountChange = (e) => {
        let value = e.target.value.trim();

        // if (value === "") {
        //     toast.error("Discount field cannot be empty");
        //     setDiscount(0);
        //     return;
        // }

        value = parseFloat(value);

        if (isNaN(value)) {
            toast.error("Please enter a valid number for Discount");
            value = 0;
        } else if (value < 0) {
            toast.error("Discount cannot be negative");
            value = 0;
        } else if (value > 100) {
            toast.error("Discount cannot be more than 100%");
            value = 100;
        }

        setDiscount(value);
    };

    const handleGstAmtChange = (e) => {
        let value = e.target.value.trim();

        if (value === "") {
            toast.error("GST field is empty");
            setGstAmt(0);
            return;
        }

        value = parseFloat(value);

        if (isNaN(value)) {
            toast.error("Please enter a valid number for GST");
            value = 0;
        } else if (value < 0) {
            toast.error("GST cannot be negative");
            value = 0;
        } else if (value > 28) {
            toast.error("GST cannot be more than 28%");
            value = 28;
        }

        setGstAmt(value);
    };

    const handleServiceChargeChange = (e) => {
        let value = e.target.value.trim();

        // if (value === "") {
        //     toast.error("Service Charge field cannot be empty");
        //     setServiceCharge(0);
        //     return;
        // }

        value = parseFloat(value);

        if (isNaN(value)) {
            toast.error("Please enter a valid number for Service Charge");
            value = 0;
        } else if (value < 0) {
            toast.error("Service Charge cannot be negative");
            value = 0;
        } else if (value > 51) {
            toast.error("Service Charge cannot be more than 50%");
            value = 51;
        }

        setServiceCharge(value);
    };

    const calculateTotalAmount = (discount, totalAmt, gstAmt, serviceCharge) => {
        if (totalAmt > 0) {
            const disAmt = totalAmt * (discount / 100);
            const totalDis = totalAmt - disAmt;
            const totalNet = totalDis + Number(gstAmt) + Number(serviceCharge);

            setTotalNetAmt(totalNet);
        } else {
            setTotalNetAmt(0);
        }
    };
    useEffect(() => {
        calculateTotalAmount(discount, totalAmt, gstAmt, serviceCharge);
    }, [discount, totalAmt, gstAmt, serviceCharge]);

    useEffect(() => {
        const totalAmtCalc = cart.reduce(
            (acc, item) => acc + (item.productPrice || 0) * item.quantity,
            0
        );
        setTotalAmt(totalAmtCalc);
    }, [cart]);

    const handleBillSubmit = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            toast.error("Cart is empty! Add products before placing a bill.", {
                position: "bottom-right",
                autoClose: 2000,
                theme: "colored",
            });
            return;
        }

        if (!selectedCustomer) {
            toast.error("Please select a customer.", {
                position: "bottom-right",
                autoClose: 2000,
                theme: "colored",
            });
            return;
        }

        // if (!discount) {
        //     toast.error("Please select Discount %.", { position: "bottom-right", autoClose: 2000, theme: "colored" });
        //     return;
        // }

        // Validate GST
        if (!gstAmt) {
            toast.error("GST field cannot be empty", { position: "bottom-right", autoClose: 2000, theme: "colored" });
            return;
        }

        // Validate Service Charge
        // if (!serviceCharge) {
        //     toast.error("Service Charge field cannot be empty", { position: "bottom-right", autoClose: 2000, theme: "colored" });
        //     return;
        // }
        const productList = cart.map((item) => ({
            product: {
                productId: item.productId,
                productName: item.productName,
                productPrice: item.productPrice,
                productStock: item.productStock,
            },
            quantity: item.quantity,
        }));

        const payload = {
            totalAmount: totalAmt,
            taxAmount: gstAmt,
            discount,
            serviceCharge,
            customer: selectedCustomer.customerId,
            paymentMode,
            productList,
        };

        console.log("Sending bill payload:", payload);

        try {
            const response = await axios.post(
                "http://localhost:8080/api/bill/addBill",
                payload
            );

            if (response.status === 200 || response.status === 201) {
                toast.success("Bill added successfully!", {
                    position: "bottom-right",
                    autoClose: 2000,
                    theme: "colored",
                });
                //handlePrint();
                handlePlaceOrder();

                setCart([]);
                setSelectedCustomer(null);
                setCustomerName("");
                setCustomerContact("");
                setCustomerAddress("");
                setDiscount(0);
                setGstAmt(0);
                setServiceCharge(0);
                setTotalAmt(0);
                setTotalNetAmt(0);
            } else {
                console.error("Unexpected response:", response);
                toast.error("Failed to add bill. Try again.", {
                    position: "bottom-right",
                    autoClose: 2000,
                    theme: "colored",
                });
            }
        } catch (error) {
            console.error("Error adding bill:", error);
            if (error.response && error.response.data) {
                toast.error(`Error: ${error.response.data}`, {
                    position: "bottom-right",
                    autoClose: 3000,
                    theme: "colored",
                });
            } else {
                toast.error("An unexpected error occurred.", {
                    position: "bottom-right",
                    autoClose: 3000,
                    theme: "colored",
                });
            }
        }
    };

    //     const handlePrint = () => {
    //     if (!selectedCustomer || cart.length === 0) {
    //         toast.error("No bill to print!");
    //         return;
    //     }

    //     // Create bill HTML
    //   const billWindow = window.open("", "PrintWindow", "width=400,height=600"); // smaller width for compact invoice

    //   const billHTML = `
    //     <html>
    //       <head>
    //         <title>Invoice</title>
    //         <style>
    //           body { 
    //             font-family: Arial, sans-serif; 
    //             font-size: 12px; 
    //             color: #333; 
    //             margin: 0; 
    //             padding: 10px; 
    //             width: 350px; /* Compact receipt width */
    //           }
    //         h2{
    //          text-align: center; 
    //             color: #e74c3c; 
    //             margin: 5px 0; 
    //         }
    //           h2 { 
    //             text-align: center; 
    //             color: #e74c3c; 
    //             margin: 5px 0; 
    //           }
    //           p { margin: 2px 0; }
    //           table { 
    //             width: 100%; 
    //             border-collapse: collapse; 
    //             margin-top: 5px; 
    //           }
    //           th, td { 
    //             border: 1px solid #ccc; 
    //             padding: 4px; 
    //             text-align: center; 
    //           }
    //           th { 
    //             background-color: #f8f9fa; /* Light table heading */ 
    //             color: #333; 
    //           }
    //           .totals { 
    //             margin-top: 5px; 
    //             font-weight: bold; 
    //           }
    //           .totals p { margin: 2px 0; }
    //           .footer { text-align: center; font-size: 10px; color: #555; margin-top: 5px; }
    //         </style>
    //       </head>
    //       <body>
    //       <h1>HOTEL MAHARAJA</h1>
    //         <h2>INVOICE</h2>

    //         <p><strong>Customer Name:</strong> ${selectedCustomer.customerName || ""} (${selectedCustomer.customerContact || ""})</p>
    //         <p><strong>Official Address:</strong> ${selectedCustomer.customerAddress || ""}</p>

    //         <table>
    //           <thead>
    //             <tr>
    //               <th>Name</th>
    //               <th>Price</th>
    //               <th>Qty</th>
    //               <th>Total</th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             ${cart.map(item => `
    //               <tr>
    //                 <td>${item.productName}</td>
    //                 <td>₹${item.productPrice}</td>
    //                 <td>${item.quantity}</td>
    //                 <td>₹${item.productPrice * item.quantity}</td>
    //               </tr>
    //             `).join("")}
    //           </tbody>
    //         </table>

    //         <div class="totals">
    //           <p>Total: ₹${totalAmt}</p>
    //           <p>Discount: ${discount}%</p>
    //           <p>GST: ₹${gstAmt}</p>
    //           <p>Net Amount: ₹${totalNetAmt}</p>
    //         </div>

    //         <div class="footer">
    //           <p>Thank you for your purchase!</p>
    //         </div>
    //       </body>
    //     </html>
    //   `;

    //   billWindow.document.write(billHTML);
    //   billWindow.document.close();
    //   billWindow.print();
    // };


    // Function to show invoice popup
    const showInvoicePopup = ({
        hotelName = "हॉटेल महाराज",
        customerName = "Customer",
        customerContact = "",
        customerAddress = "",
        gst = 0,
        discount = 0,
        serviceCharge = 0,
        total = 0,
        net = 0,
        cart = []
    }) => {
        const popup = window.open("", "InvoiceWindow", "width=600px,height=700px,scrollbars=yes,resizable=yes");
        const currentDate = new Date().toLocaleDateString("en-IN");

        const cartRows = cart
            .map((item, index) => {
                const price = Number(item.productPrice) || 0;
                const totalPrice = price * (item.quantity || 1);
                return `
        <tr>
          <td>${index + 1}</td>
          <td>${item.productName}</td>
          <td>${item.quantity || 1}</td>
          <td>₹${price.toFixed(2)}</td>
          <td>₹${totalPrice.toFixed(2)}</td>
        </tr>
      `;
            })
            .join("");

        const invoiceHTML = `
     <style>
            body {
        font-family: Arial, sans-serif;
        padding: 20px;
        color: #333;
        text-align: center; /* Center everything by default */
      }

      .logo-container {
        margin-bottom: 10px;
      }

      .logo-container img {
        max-width: 120px;
        height: auto;
        margin-bottom: 5px;
      }

      h1 {
        color: #e67e22;
        margin: 5px 0;
      }

      h2 {
        color: #555;
        font-size: 18px;
        margin: 5px 0 15px 0;
      }

      .hotel-info,
      .details {
        font-size: 14px;
        margin-bottom: 10px;
      }

      .details p {
        margin: 2px 0;
      }

      table {
        width: 80%;
        margin: 0 auto; /* Center the table */
        border-collapse: collapse;
        font-size: 14px;
        margin-top: 15px;
      }

      th,
      td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: center;
      }

      th {
        background-color: #f4f4f4;
      }

      .totals {
        margin-top: 15px;
        font-size: 15px;
        text-align: right;
        width: 80%;
        margin-left: auto;
        margin-right: auto;
      }

      .net-amount {
        font-weight: bold;
        font-size: 18px;
        color: #2c3e50;
      }

      .buttons {
        margin-top: 25px;
        text-align: center;
      }

      button {
        padding: 10px 20px;
        margin: 5px;
        border: none;
        border-radius: 5px;
        font-weight: bold;
        cursor: pointer;
      }

      .print-btn {
        color: white;
        background: #371ea9ff;
      }

      .close-btn {
        background-color: #e74c3c;
        color: white;
      }

      @media print {
        .buttons {
          display: none;
        }
        body {
          padding: 0;
          margin: 0;
        }
      }
    </style>
      <body>
       <div class="logo-container">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuQcwOWSHXpSMx7VF9TnfAvq8ENpPbXaHEUg&s" alt="${hotelName} Logo" />
    </div>
        <h1>${hotelName}</h1>
        <h2>INVOICE</h2>
        <div class="details">
          <p><strong>Date:</strong> ${currentDate}</p>
          <p><strong>Customer:</strong> ${customerName} </p>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>${cartRows}</tbody>
        </table>
        <div class="totals">
          <p>Total Amount: ₹${total.toFixed(2)}</p>
          <p>Discount: ${discount}%</p>
          <p>GST: ₹${gst.toFixed(2)}</p>
          <p class="net-amount">Net Amount: ₹${net.toFixed(2)}</p>
        </div>
        <div class="buttons">
          <button class="print-btn" onclick="window.print()"> Print</button>
          <button class="close-btn" onclick="window.close()"> Close</button>
        </div>
      </body>
    </html>
  `;

        popup.document.write(invoiceHTML);
        popup.document.close();
    };

    // Usage in handlePlaceOrder
    const handlePlaceOrder = () => {
        const currentCart = [...cart];
        if (currentCart.length === 0) return;

        const name = selectedCustomer?.customerName || "Customer";
        const contact = selectedCustomer?.customerContact || "";
        const address = selectedCustomer?.customerAddress || "";

        const total = currentCart.reduce((sum, i) => sum + i.productPrice * i.quantity, 0);
        const discountAmt = total * (discount / 100);
        const gst = total * (gstAmt / 100);
        const net = total - discountAmt + gst + Number(serviceCharge);

        showInvoicePopup({
            hotelName: "हॉटेल महाराज",
            customerName: name,
            customerContact: contact,
            customerAddress: address,
            gst,
            discount,
            serviceCharge,
            total,
            net,
            cart: currentCart,
        });
    };


    return (
        <>
            <div className="pos-container">
                <div className="pos-left">
                    <div className="pos-filters">
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option value="all">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Search Product..."
                            value={searchProd}
                            onChange={(e) => setSearchProd(e.target.value)}
                        />
                    </div>
                    <div className="product-list-scroll">
                        <div className="product-grid">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((prod) => {
                                    const isInCart = cart.some(
                                        (item) => item.productId === prod.productId
                                    );
                                    return (
                                        <div
                                            key={prod.productId}
                                            className={`product-card ${isInCart ? "active" : ""}`}
                                            onClick={() => addToCart(prod)}
                                        >
                                            <img
                                                src={`http://localhost:8080/image/${prod.productImage}`}
                                                alt={prod.productName}
                                            />
                                            <h4>{prod.productName}</h4>
                                            <p>₹{prod.productPrice}</p>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="no-product">🚫 Product Not Found</div>
                            )}
                        </div>
                    </div>

                </div>


                <div className="pos-right">

                    <div className="customer-section">
                        {/* Search Customer */}
                        <input
                            type="text"
                            placeholder="Search Customer..."
                            value={searchCustomerName}
                            onChange={CustomerSearch}
                        />

                        {/* Dropdown of searched customers */}
                        {searchedCustomer.length > 0 && (
                            <ul className="customer-dropdown">
                                {searchedCustomer.map(cust => (
                                    <li key={cust.customerId} onClick={() => selectCustomer(cust)}>
                                        {cust.customerName} - {cust.customerContact}
                                    </li>
                                ))}
                            </ul>
                        )}


                        <button
                            className="add-customer-btn"
                            onClick={() => setShowCustomerForm(true)}>
                            + Add Customer
                        </button>

                    </div>

                    {/* Add Customer Overlay Form */}
                    {showCustomerForm && (
                        <div className="product-overlay">
                            <div className="product-form-popup">

                                <h3>Add Customer</h3>
                                <form onSubmit={addCustomer} className="product-form">
                                    <input
                                        type="text"
                                        placeholder="Customer Name"
                                        value={newCustomerName}
                                        onChange={(e) => setNewCustomerName(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Contact"
                                        value={newCustomerContact}
                                        onChange={(e) => setNewCustomerContact(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Address"
                                        value={newCustomerAddress}
                                        onChange={(e) => setNewCustomerAddress(e.target.value)}
                                    />

                                    <div className="form-actions">
                                        <button
                                            type="submit"
                                            className="btn btn-success"
                                            style={{ width: "140px", padding: "14px 22px", fontSize: "18px" }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => {
                                                setNewCustomerName("");
                                                setNewCustomerContact("");
                                                setNewCustomerAddress("");
                                                setShowCustomerForm(false);
                                            }}
                                            style={{ width: "140px", padding: "14px 22px", fontSize: "17px" }}
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                    {useMessage && (
                                        <p className="error">{useMessage}</p>
                                    )}
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="cart-container">
                        <h3 style={{ textAlign: "center", color: "#2c3e50", fontWeight: "bold", marginBottom: "15px" }}>
                            Bill Cart
                        </h3>
                        <div className="cart-table-wrapper">
                            <table>
                                <thead>
                                    <tr style={{  background: "linear-gradient(90deg, var(--primary),  var(--primary))", color: "white", textAlign: "center", fontWeight: "bold" }}>
                                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
                                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>Price</th>
                                        <th style={{ padding: "10px", border: "1px solid #ddd", width: "60px" }}>Qty</th>
                                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>Total</th>
                                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>Action</th>
                                    </tr>
                                </thead>


                                <tbody>
                                    {cart.length === 0 ? (
                                        <tr className="empty-row">
                                            <td colSpan="5">Cart is empty</td>
                                        </tr>
                                    ) : (
                                        cart.map(item => (
                                            <tr key={item.productId}>
                                                <td>{item.productName}</td>
                                                <td>₹{item.productPrice}</td>
                                                <td style={{ width: "60px" }}>
                                                    <div className="qty-controls">
                                                        <button
                                                            onClick={() => decreaseQuantity(item.productId)}
                                                            disabled={item.quantity <= 1}
                                                            style={{ background: "red", color: "white" }}
                                                        >
                                                            -
                                                        </button>

                                                        <input
                                                            type="number"
                                                            value={item.quantity}
                                                            min="1"
                                                            onChange={(e) =>
                                                                updateQuantity(item.productId, Number(e.target.value))
                                                            }
                                                            style={{ width: "40px", textAlign: "center" }}
                                                        />

                                                        <button onClick={() => increaseQuantity(item.productId)} style={{ background: "green", color: "white" }}
                                                        >+</button>  </div>
                                                </td>
                                                <td>₹{item.productPrice * item.quantity}</td>
                                                <td >
                                                    <button
                                                        onClick={() => removeFromCart(item.productId)}
                                                        style={{
                                                            backgroundColor: "#e74c3c",
                                                            color: "white",
                                                            border: "none",
                                                            padding: "5px 10px",
                                                            borderRadius: "5px",
                                                            cursor: "pointer",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                </td>

                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>


            <div className="pos-footer">
                <div className="footer-field">
                    <label>Discount</label>
                    <select id="btn_id" className="form-select" onChange={handleDiscountChange} value={discount}>
                        <option value="">% Discount</option>
                        <option value="5">% 5</option>
                        <option value="12">% 12</option>
                        <option value="18">% 18</option>
                    </select>
                </div>


                <div className="footer-field">
                    <label>GST</label>
                    <select
                        value={gstAmt}
                        onChange={handleGstAmtChange}
                    >
                        <option value=""> GST %</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                    </select>
                </div>


                <div className="footer-field">
                    <label>Service Tip</label>
                    <input
                        type="number"
                        value={serviceCharge}
                        onChange={handleServiceChargeChange}   // ✅ using validation handler
                    />
                </div>

                <div className="footer-field">
                    <label>Payment Mode</label>
                    <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                        <option value="CASH">CASH</option>
                        <option value="UPI">UPI</option>
                        <option value="CARD">CARD</option>
                    </select>
                </div>

                <div className="footer-totals">
                    <span>Total: ₹{totalAmt}</span>
                    <span>Net: ₹{totalNetAmt}</span>
                    {selectedCustomer ? (
                        <span>Customer: {selectedCustomer.customerName}</span>
                    ) : (
                        <span>No Customer Selected</span>
                    )}
                    <div className="cart-buttons">
                        <button
                            onClick={() => {
                                setCart([]);
                                setSelectedCustomer(null);
                                setCustomerName("");
                                setCustomerContact("");
                                setCustomerAddress("");
                                setSearchCustomerName("");
                                setDiscount("");
                                setGstAmt("");
                                setServiceCharge("");
                            }}
                            className="clear-btn"
                        >
                            Clear All
                        </button>            </div>
                    <button className="place-order-btn" onClick={handleBillSubmit}>Place Order</button>
                </div>
            </div>

            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

        </>
    );
}

export default Pos;
