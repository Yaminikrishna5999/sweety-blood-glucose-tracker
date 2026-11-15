import React, { useState } from "react";
import { loginUser, registerUser } from "./services/authService";
import Dashboard from "./components/Dashboard";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (isLogin) {
        const data = await loginUser({ email, password });

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
      } else {
        await registerUser({ name, email, password });

        setMessage("Account created successfully. Please log in.");
        setIsLogin(true);
        setPassword("");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setMessage("");
  };

  if (token) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Sweety</h1>
        <p>Blood Glucose Tracker</p>
      </header>

      <main className="auth-container">
        <div className="auth-card">
          <h2>{isLogin ? "Welcome Back!" : "Create Your Account"}</h2>

          <p className="subtitle">
            {isLogin
              ? "Login to manage your glucose readings."
              : "Sign up to start tracking your glucose levels."}
          </p>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          {message && <p className="message">{message}</p>}

          <p className="toggle-text">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              type="button"
              className="toggle-button"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
              }}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;