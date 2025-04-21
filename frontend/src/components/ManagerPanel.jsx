import React, { useEffect, useState } from "react";
import axios from "axios";

function ManagerPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/orders", {
          headers: { Authorization: localStorage.getItem("token") }
        });
        console.log("Fetched orders:", res.data);
        setOrders(res.data);
      } catch (err) {
        setError("Failed to fetch orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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
              <strong>{order.customerName}</strong> ordered{" "}
              <strong>{order.product?.name || "Unknown Product"}</strong> - Status:{" "}
              <span className="badge bg-secondary">{order.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ManagerPanel;
