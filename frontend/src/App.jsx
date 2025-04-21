import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminPanel from "./components/AdminPanel";
import ManagerPanel from "./components/ManagerPanel";
import EmployeePanel from "./components/EmployeePanel";
import './app.css'
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <BrowserRouter>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={user?.role === "Admin" ? <AdminPanel /> : <Navigate to="/" />} />
          <Route path="/manager" element={user?.role === "Manager" ? <ManagerPanel /> : <Navigate to="/" />} />
          <Route path="/employee" element={user?.role === "Employee" ? <EmployeePanel /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
