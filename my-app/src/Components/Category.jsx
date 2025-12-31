import React, { useEffect, useState } from "react";
import "./Category.css";
import axios from "axios";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";

function Category() {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [isactive, setIsactive] = useState(true);
  const [categories, setCategories] = useState([]);
  const [useMessage, setUseMessage] = useState("");
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchCat, setSearchCat] = useState("");
  const [itemsToShow, setItemsToShow] = useState(10);
  const [limitedCategories, setLimitedCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/category/allcategory"
      );
      setCategories(response.data);
    } catch (error) {
      console.log("Error fetching categories!..", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(
      (cat) =>
        cat.categoryName.toLowerCase().includes(searchCat.toLowerCase()) ||
        String(cat.categoryId).includes(searchCat)
    );
    const limited =
      itemsToShow === "all" ? filtered : filtered.slice(0, Number(itemsToShow));
    setLimitedCategories(limited);
  }, [categories, searchCat, itemsToShow]);

  const handleCategory = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("categoryName", categoryName);
      if (categoryImage) formData.append("categoryImage", categoryImage);
      formData.append("isactive", isactive);

      await axios.post(
        "http://localhost:8080/api/category/addcategory",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Category added successfully!");
      setCategoryName("");
      setCategoryImage(null);
      setIsactive(true);
      fetchCategory();
      setShowForm(false);
    } catch (error) {
      setUseMessage(
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        "Server error"
      );
      console.error(error);
    }
  };

  const inlineEditing = (cat) => {
    setEditingRow(cat.categoryId);
    setEditData({
      categoryName: cat.categoryName,
      isactive: cat.isactive,
      categoryImage: null,
    });
  };

  const handleUpdate = async (categoryId) => {
    try {
      const formData = new FormData();
      formData.append("categoryName", editData.categoryName);
      if (editData.categoryImage) formData.append("categoryImage", editData.categoryImage);
      formData.append("isactive", editData.isactive);

      await axios.put(
        `http://localhost:8080/api/category/update/${categoryId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Category updated successfully!");
      setEditingRow(null);
      fetchCategory();
    } catch (error) {
      console.error("Error updating category!..", error);
      alert("Update failed!");
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/category/delete/${categoryId}`);
      alert("Category deleted successfully!");
      fetchCategory();
    } catch (error) {
      console.log("Error deleting category!..", error);
    }
  };

  return (
    
    <div className="category-container">
      <h1>Category Management</h1>
      <button
        className="add-category-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "✖ Close Form" : "+ Add Category"}
      </button>

      <div className="toolbar">
        <div className="toolbar-left">
          <label>Show:</label>
          <select
            value={itemsToShow}
            onChange={(e) => setItemsToShow(e.target.value)}
            className="dropdown-limit"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="all">All</option>
          </select>
        </div>

        <div className="toolbar-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search Category..."
              value={searchCat}
              onChange={(e) => setSearchCat(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={`category-wrapper ${showForm ? "blur-bg" : ""}`}>
        <div className="category-table-wrapper">
          <table className="category-table">
            <thead>
              <tr>
                <th>Category Id</th>
                <th>Category Name</th>
                <th>Display Image</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {limitedCategories.length > 0 ? (
                limitedCategories.map((cat) => (
                  <tr
                    key={cat.categoryId}
                    className={editingRow === cat.categoryId ? "editing-row" : ""}
                  >
                    <td>{cat.categoryId}</td>
                    <td>
                      {editingRow === cat.categoryId ? (
                        <input
                          type="text"
                          value={editData.categoryName}
                          onChange={(e) =>
                            setEditData({ ...editData, categoryName: e.target.value })
                          }
                          style={{ width: "150px", padding: "5px 8px", fontSize: "14px" }}
                        />
                      ) : (
                        <span style={{ fontWeight: "bold" }}>{cat.categoryName}</span>
                      )}
                    </td>
                    <td>
                      {editingRow === cat.categoryId ? (
                        <input
                          type="file"
                          onChange={(e) =>
                            setEditData({ ...editData, categoryImage: e.target.files[0] })
                          }
                        />
                      ) : (
                        <img
                          src={`http://localhost:8080/image/${cat.categoryImage}`}
                          height="100px"
                          width="100px"
                          style={{ borderRadius: "20px" }}
                        />
                      )}
                    </td>
                    <td>
                      {editingRow === cat.categoryId ? (
                        <div>
                          <label>
                            <input
                              type="radio"
                              name={`status-${cat.categoryId}`}
                              checked={editData.isactive === true}
                              onChange={() =>
                                setEditData({ ...editData, isactive: true })
                              }
                            />{" "}
                            Active
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`status-${cat.categoryId}`}
                              checked={editData.isactive === false}
                              onChange={() =>
                                setEditData({ ...editData, isactive: false })
                              }
                            />{" "}
                            Inactive
                          </label>
                        </div>
                      ) : cat.isactive ? (
                        "Active"
                      ) : (
                        "Inactive"
                      )}
                    </td>
                    <td>
                      {editingRow === cat.categoryId ? (
                        <>
                          <button
                            className="btn btn-edit"
                             style={{ width: "140px", padding: "14px 22px", fontSize: "17px" }}
                            onClick={() => handleUpdate(cat.categoryId)}
                          >
                            SAVE
                          </button>
                          <button
                            className="btn btn-delete"
                            
                            onClick={() => setEditingRow(null)}
                             style={{ width: "140px", padding: "14px 22px", fontSize: "17px" }}
                          >
                            CANCEL
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="action-buttons">
                            <button
                              className="btn btn-edit"
                              onClick={() => inlineEditing(cat)}
                            >
                              <HiMiniPencilSquare style={{ fontSize: "24px" }} />
                            </button>
                            <button
                              className="btn btn-delete"
                              onClick={() => handleDelete(cat.categoryId)}
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
                  <td colSpan="5">No categories found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="category-overlay">
          <div className="category-form-popup">
            <h3>Add Category</h3>
            <form onSubmit={handleCategory} className="category-form">
              <input
                type="text"
                placeholder="Enter Category Name"
                className="form-control"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
              <input
                type="file"
                className="form-control"
                onChange={(e) => setCategoryImage(e.target.files[0])}
              />
              <p>Select Status:</p>
              <div className="status-options">
                <label>
                  <input
                    type="radio"
                    name="statusAdd"
                    checked={isactive === true}
                    onChange={() => setIsactive(true)}
                  />{" "}
                  Active
                </label>
                <label>
                  <input
                    type="radio"
                    name="statusAdd"
                    checked={isactive === false}
                    onChange={() => setIsactive(false)}
                  />{" "}
                  Inactive
                </label>
              </div>

              <div className="form-actions">
                <button type="submit"  style={{ width: "140px", padding: "14px 22px", fontSize: "17px" }}className="btn btn-success">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-danger" style={{ width: "140px", padding: "14px 22px", fontSize: "17px" }}
                  onClick={() => {
                    setCategoryName("");
                    setCategoryImage(null);
                    setIsactive(true);
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

export default Category;
