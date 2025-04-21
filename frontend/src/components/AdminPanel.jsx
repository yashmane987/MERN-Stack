import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const [team, setTeam] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:5000/team", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setTeam(res.data);
    };
    fetchData();
  }, []);

  const addProduct = async () => {
    await axios.post("http://localhost:5000/products", product, {
      headers: { Authorization: localStorage.getItem("token") },
    });
    alert("Product added!");
  };

  const logout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <h4>Team Members</h4>
      <ul className="list-group mb-4">
        {team.map((member) => (
          <li key={member._id} className="list-group-item">
            {member.name} - {member.role}
          </li>
        ))}
      </ul>

      <h4>Add Product</h4>
      <input
        className="form-control mb-2"
        placeholder="Name"
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
      />
      <input
        className="form-control mb-2"
        placeholder="Description"
        onChange={(e) =>
          setProduct({ ...product, description: e.target.value })
        }
      />
      <input
        className="form-control mb-2"
        placeholder="Price"
        type="number"
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
      />
      <input
        className="form-control mb-2"
        placeholder="Image URL"
        onChange={(e) => setProduct({ ...product, image: e.target.value })}
      />
      <button className="btn btn-info me-2" onClick={addProduct}>
        Add Product
      </button>

      <button className="btn btn-warning" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default AdminPanel;
