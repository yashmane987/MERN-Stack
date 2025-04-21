import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate(`/${res.data.user.role.toLowerCase()}`);
    } catch (err) {
      setError("Login failed. Please register first if you're a new user.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <br></br>
      <input
        className="form-control mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="form-control mb-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Paragraph with register suggestion */}
      <p>
        If you're not registered, please <Link to="/register">register here</Link> first.
      </p>

      {/* Optional error message */}
      {error && <div className="text-danger mb-2">{error}</div>}

      <button className="btn btn-primary" onClick={login}>
        Login
      </button>
    </div>
  );
}

export default Login;
