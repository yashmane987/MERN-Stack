import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Employee" });

  const register = async () => {
    await axios.post("http://localhost:5000/register", form);
    alert("User registered!");
  };

  return (
    <div>
      <h2>Register</h2>
      <input className="form-control mb-2" placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input className="form-control mb-2" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input className="form-control mb-2" type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <select className="form-control mb-2" onChange={e => setForm({ ...form, role: e.target.value })}>
        <option value="Employee">Employee</option>
        <option value="Manager">Manager</option>
        <option value="Admin">Admin</option>
      </select>
      <button className="btn btn-success" onClick={register}>Register</button>
    </div>
  );
}

export default Register;
