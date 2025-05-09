import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EmployeePanel() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [customerName, setCustomerName] = useState("");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");

    navigate("/");
  }
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get("http://localhost:5000/products", {
        headers: { Authorization: localStorage.getItem("token") }
      });
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  const placeOrder = async () => {
    await axios.post("http://localhost:5000/orders", {
      customerName,
      product: selectedProduct
    }, {
      headers: { Authorization: localStorage.getItem("token") }
    });
    alert("Order placed!");
  };

  return (
    <div>
      <h2>Employee Panel</h2>
      <input className="form-control mb-2" placeholder="Customer Name" onChange={e => setCustomerName(e.target.value)} />
      <select className="form-control mb-2" onChange={e => setSelectedProduct(e.target.value)}>
        <option>Select Product</option>
        {products.map(p => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>
      <button className="btn btn-primary me-2" onClick={placeOrder}>Place Order</button>
      <button className="btn btn-warning" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default EmployeePanel;
