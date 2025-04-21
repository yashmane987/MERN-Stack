import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ManagerPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/orders", {
          headers: { Authorization: localStorage.getItem("token") },
        });

        console.log("Fetched orders:", res.data);

        if (res.data.success) {
          setOrders(res.data.orders);
        } else {
          setError(res.data.message || "Failed to fetch orders");
        }
      } catch (err) {
        setError("Failed to fetch orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem("token")) {
      fetchOrders();
    } else {
      setError("You must be logged in to view orders.");
      setLoading(false);
    }
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Manager Panel</h2>
      <h4 className="mb-3">Team Orders</h4>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="list-group">
          {orders.map((order) => (
            <li key={order._id} className="list-group-item">
              <strong>{order.employee?.name || "Unnamed Employee"}</strong>{" "}
              ordered{" "}
              <strong>{order.product?.name || "Unknown Product"}</strong> -
              Status: <span className="badge bg-secondary">{order.status}</span>
            </li>
          ))}
        </ul>
      )}
      <br></br>
      <button className="btn btn-warning" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default ManagerPanel;
