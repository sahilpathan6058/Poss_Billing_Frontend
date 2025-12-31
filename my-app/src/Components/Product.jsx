
import React, { useEffect, useState } from "react";
import "./Product.css";
import axios from "axios";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; // correct import
import { FaRegFilePdf } from "react-icons/fa";



function Product() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [useMessage, setUseMessage] = useState("");

    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productImage, setProductImage] = useState(null);
    const [active, setActive] = useState(true);
    const [categoryId, setCategoryId] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [editingRow, setEditingRow] = useState(null);
    const [editData, setEditData] = useState({});
    const [searchProd, setSearchProd] = useState("");
    const [itemsToShow, setItemsToShow] = useState(10);
    const [limitedProducts, setLimitedProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/category/allcategory");
            setCategories(response.data);
        } catch (error) {
            console.log("Error fetching categories!..", error);
        }
    };

    // Fetch products
    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/product/allproduct");
            setProducts(response.data);
        } catch (error) {
            console.log("Error fetching products!..", error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);


    useEffect(() => {
        const filteredProducts = products.filter((prod) =>
            prod.productName.toLowerCase().includes(searchProd.toLowerCase()) ||
            String(prod.productId).includes(searchProd)
        );

        const limited = itemsToShow === "all" ? filteredProducts : filteredProducts.slice(0, Number(itemsToShow));
        setLimitedProducts(limited);
    }, [products, searchProd, itemsToShow]);

    const handleProduct = async (e) => {
        e.preventDefault();
        if (!selectedCategory) {
            alert("Please select a category before adding product");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("productName", productName);
            formData.append("description", description);
            formData.append("productPrice", productPrice);
            if (productImage) formData.append("productImage", productImage);
            formData.append("active", active);
            formData.append("categoryId", selectedCategory);

            await axios.post("http://localhost:8080/api/product/addproduct", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Product added successfully!");
            setProductName("");
            setDescription("");
            setProductPrice("");
            setProductImage(null);
            setActive(true);
            setSelectedCategory("");
            fetchProducts();
            setShowForm(false);
        } catch (error) {
            if (error.response && error.response.data) {
                setUseMessage(
                    error.response.data.message || JSON.stringify(error.response.data)
                );
            } else {
                setUseMessage("Server error");
            }
            console.error(error);
        }
    };


    const inlineEditing = (prod) => {
        setEditingRow(prod.productId);
        setEditData({
            productName: prod.productName,
            description: prod.description,
            productPrice: prod.productPrice,
            categoryId: prod.category?.categoryId || "",
            active:prod.active,
            productImage: null,
        });
    };

    const handleUpdate = async (productId) => {
        try {
            const formData = new FormData();
            formData.append("productName", editData.productName);
            formData.append("description", editData.description);
            formData.append("productPrice", editData.productPrice);
            formData.append("productImage", editData.productImage);
            formData.append("categoryId", editData.categoryId);
            formData.append("active", editData.active);

            await axios.put(
                `http://localhost:8080/api/product/updateproduct/${productId}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            alert("Product updated successfully!");
            setEditingRow(null);
            fetchProducts();
        } catch (error) {
            console.error("Error updating product!..", error);
            alert("Update failed!");
        }
    };

    const handleDelete = async (productId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8080/api/product/deleteproduct/${productId}`);
            alert("Product deleted successfully!");
            fetchProducts();
        } catch (error) {
            console.log("Error deleting product!..", error);
        }
    };

    //   const exportToPDF = () => {
    //     if (products.length === 0) {
    //         alert("No products to export!");
    //         return;
    //     }

    //     const doc = new jsPDF();
    //     doc.setFontSize(18);
    //     doc.text("Product List", 14, 20);

    //     const tableColumn = ["ID", "Category", "Name", "Description", "Price", "Status"];
    //     const tableRows = products.map((prod) => [
    //         prod.productId,
    //         prod.category?.categoryName || "",
    //         prod.productName,
    //         prod.description,
    //         `₹${prod.productPrice}`,
    //         prod.active ? "Active" : "Inactive",
    //     ]);

    //    autoTable(doc, {
    //   head: [tableColumn],
    //             body: tableRows,
    //             startY: 30,
    //             styles: { fontSize: 10 },
    //             headStyles: { fillColor: [52, 73, 94] },
    // });

    //     doc.save("ALL_PRODUCTS_2025.pdf");
    // };




    const exportToPDF = () => {
        if (products.length === 0) {
            alert("No products to export!");
            return;
        }

        const doc = new jsPDF();

        // Use a font that supports ₹
        doc.setFont("helvetica", "normal"); // helvetica supports ₹ in recent jsPDF versions
        doc.setFontSize(18);
        doc.text("Product List", 14, 20);

        const tableColumn = ["ID", "Category", "Name", "Description", "Price", "Status"];
        const tableRows = products.map((prod) => [
            prod.productId,
            prod.category?.categoryName || "",
            prod.productName,
            prod.description,
            prod.productPrice, // now ₹ should render correctly
            prod.active ? "Active" : "Inactive",
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [52, 73, 94] },
        });

        doc.save("ALL_PRODUCTS_2025.pdf");
    };



    return (
        <div className="product-container">
            <h1>Product Management</h1>
            <button type="button" className="add-product-btn" onClick={() => setShowForm(!showForm)}>
                {showForm ? "✖ Close Form" : "+ Add Product"}
            </button>

            <div className="toolbar">
                <div className="toolbar-left">
                    <div className="dropdown-limit-container">
                        <label>Show:</label>
                        <select value={itemsToShow} onChange={(e) => setItemsToShow(e.target.value)} className="dropdown-limit">
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="all">All</option>
                        </select>
                    </div>


                </div>

                <div className="toolbar-right">
                    <button onClick={exportToPDF} className="btn btn-primary">
                        <FaRegFilePdf /> PDF
                    </button>


                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search Product..."
                            value={searchProd}
                            onChange={(e) => setSearchProd(e.target.value)}
                        />
                    </div>

                </div>
            </div>

            <div className={`product-wrapper ${showForm ? "blur-bg" : ""}`}>
                <div className="product-table-wrapper">
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Product Id</th>
                                <th>Category Name</th>
                                <th>Product Name</th>
                                <th>Display Image</th>
                                <th>Description</th>
                                <th>Display Price</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {limitedProducts.length > 0 ? (
                                limitedProducts.map((prod) => (
                                    <tr
                                        key={prod.productId}
                                        className={editingRow === prod.productId ? "editing-row" : ""}
                                    >
                                        <td>{prod.productId}</td>
                                        <td>
                                            {editingRow === prod.productId ? (
                                                <select
                                                    value={editData.categoryId}
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, categoryId: e.target.value })
                                                    }
                                                    style={{ width: '120px', padding: '5px 8px', fontSize: '14px' }} // fixed size

                                                >
                                                    <option value="">-- Select Category --</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat.categoryId} value={cat.categoryId}>
                                                            {cat.categoryName}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                prod.category?.categoryName
                                            )}
                                        </td>
                                        {/* <td>
                      {editingRow === prod.productId ? (
                        <input
                          type="text"
                          value={editData.productName}
                          onChange={(e) =>
                            setEditData({ ...editData, productName: e.target.value })
                          }
                        />
                      ) : (
                        prod.productName 
                      )}
                    </td> */}

                                        <td>
                                            {editingRow === prod.productId ? (
                                                <input
                                                    type="text"
                                                    value={editData.productName}
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, productName: e.target.value })
                                                    }
                                                    style={{ width: '150px', padding: '5px 8px', fontSize: '14px' }} // fixed size

                                                />
                                            ) : (
                                                <span style={{ fontWeight: 'bold' }}>{prod.productName}</span>
                                            )}
                                        </td>
                                        <td>
                                            {editingRow === prod.productId ? (
                                                <input
                                                    type="file"
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, productImage: e.target.files[0] })
                                                    }
                                                    style={{ width: '150px' }} // optional fixed width

                                                />

                                            ) : (
                                                <img
                                                    src={`http://localhost:8080/image/${prod.productImage}`}
                                                    height="100px"
                                                    width="100px"
                                                />
                                            )}
                                        </td>
                                        <td>

                                            {editingRow === prod.productId ? (
                                                <input
                                                    type="text"
                                                    value={editData.description}
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, description: e.target.value })
                                                    }
                                                    style={{ width: '200px', padding: '5px 8px', fontSize: '14px' }} // fixed size

                                                />
                                            ) : (
                                                prod.description
                                            )}
                                        </td>
                                        <td>
                                            {editingRow === prod.productId ? (
                                                <input
                                                    type="number"
                                                    value={editData.productPrice}
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, productPrice: e.target.value })
                                                    }
                                                    style={{ width: '100px', padding: '5px 8px', fontSize: '14px' }} // fixed size

                                                />
                                            ) : (
                                                <span style={{ fontWeight: 'bold' }}>₹{prod.productPrice}</span>
                                            )}
                                        </td>

                                        <td>
                                            {editingRow === prod.productId ? (
                                                <div>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name={`status-${prod.productId}`}
                                                            checked={editData.active === true}
                                                            onChange={() => setEditData({ ...editData, active: true })}
                                                        /> Active
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name={`status-${prod.productId}`}
                                                            checked={editData.active === false}
                                                            onChange={() => setEditData({ ...editData, active: false })}
                                                        /> Inactive
                                                    </label>
                                                </div>
                                            ) : prod.active ? "Active" : "Inactive"}
                                        </td>

                                        <td>
                                            {editingRow === prod.productId ? (
                                                <>
                                                    <button
                                                        className="btn btn-edit"
                                                        onClick={() => handleUpdate(prod.productId)}
                                                    >
                                                        SAVE
                                                    </button>
                                                    <button
                                                        className="btn btn-delete"
                                                        onClick={() => setEditingRow(null)}
                                                    >
                                                        CANCEL
                                                    </button>

                                                </>
                                            ) : (
                                                <>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="btn btn-edit"
                                                            onClick={() => inlineEditing(prod)}
                                                        >
                                                            <HiMiniPencilSquare style={{ fontSize: "24px" }} />
                                                        </button>
                                                        <button
                                                            className="btn btn-delete"
                                                            onClick={() => handleDelete(prod.productId)}
                                                        >
                                                            <MdDelete style={{ fontSize: "24px" }} />
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">No products found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div >

            {showForm && (
                <div className="product-overlay">
                    <div className="product-form-popup">
                        <h3>Add Product</h3>
                        <form onSubmit={handleProduct} className="product-form">
                            <select
                                className="form-control"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                required
                            >
                                <option value="">-- Select Category --</option>
                                {categories.map((cat) => (
                                    <option key={cat.categoryId} value={cat.categoryId}>
                                        {cat.categoryName}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="Enter Product Name"
                                className="form-control"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />

                            <textarea
                                placeholder="Enter Description"
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                            <input
                                type="number"
                                placeholder="Enter Price"
                                className="form-control"
                                value={productPrice}
                                onChange={(e) => setProductPrice(e.target.value)}
                            />

                            <input
                                type="file"
                                className="form-control"
                                onChange={(e) => setProductImage(e.target.files[0])}
                            />

                            <p>Select Status:</p>
                            <div className="status-options">
                                <label>
                                    <input
                                        type="radio"
                                        name="status"
                                        checked={active === true}
                                        onChange={() => setActive(true)}
                                    />{" "}
                                    Active
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="status"
                                        checked={active === false}
                                        onChange={() => setActive(false)}
                                    />{" "}
                                    Inactive
                                </label>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    style={{ width: "140px", padding: "14px 22px", fontSize: "17px" }}

                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    style={{ width: "140px", padding: "14px 22px", fontSize: "17px" }}
                                    className="btn btn-danger"
                                    onClick={() => {
                                        setProductName("");
                                        setDescription("");
                                        setProductPrice("");
                                        setProductImage(null);
                                        setActive(true);
                                        setSelectedCategory("");
                                        setShowForm(false);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                            {useMessage && <p className="error">{useMessage}</p>}
                        </form>
                    </div>
                </div>

            )}
        </div>
    );
}

export default Product;
