import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import './LoginForm.css';

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const history = useHistory()

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const handleDemo1 = async (e) => {
    e.preventDefault();
    let demoEmail = "demo@aa.io";
    let demoPass = "password";
    await dispatch(login(demoEmail, demoPass));
  };
  const handleDemo2 = async (e) => {
    e.preventDefault();
    let demoEmail = "matt@aa.io";
    let demoPass = "password";
    await dispatch(login(demoEmail, demoPass));
  };


  const handleNotAUser = async () => {
    history.push("/signup")
  }


  return (
    <>
    <div className="auth-container">
      <h1 className="auth-h1">Log In</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <ul className="auth-ul">
          {errors.map((error, idx) => (
            <li key={idx} className="auth-li">{error}</li>
          ))}
        </ul>
        <label className="auth-label">
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
        </label>
        <label className="auth-label">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
        </label>
        <button type="submit" className="auth-button">Log In</button>
        <button onClick={handleNotAUser} className="auth-button">Not a user?</button>
        <button onClick={handleDemo1} className="auth-button-demo">Demo Login #1</button>
        <button onClick={handleDemo2} className="auth-button-demo">Demo Login #2</button>
      </form>
      </div>
    </>
  );
}

export default LoginFormPage;
