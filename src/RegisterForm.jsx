import React, { useState } from "react";
import axios from "axios";
import './App.css'

function RegisterForm({ setRegistrationSuccess }) {
  const [registrationData, setRegistrationData] = useState({ name:"", email:"", password:"" });
  const [errors, setErrors] = useState({});

  const handleRegistration = async (e) => {
    e.preventDefault();
    
    // Form validation
    const { name, email, password } = registrationData;
    const errors = {};
    if (!name.trim()) {
      errors.name = "Name is required";
    }
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }
    if (!password.trim()) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(
          "http://localhost:3001/register", 
          JSON.stringify(registrationData), 
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        console.log(response.data);
        setRegistrationSuccess(true);
        setRegistrationData({ name:"", email:"", password:"" }); // Clear the form
      } catch (error) {
        // Handle error
        console.error(error);
      }
    } else {
      setErrors(errors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData({ ...registrationData, [name]: value });
    // Clear the error message when the user starts typing
    setErrors({ ...errors, [name]: "" });
  };

  return (
    <form onSubmit={handleRegistration} className="register-form">
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={registrationData.name}
          onChange={handleChange}
          className={`form-control ${errors.name && "is-invalid"}`}
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="text"
          name="email"
          value={registrationData.email}
          onChange={handleChange}
          className={`form-control ${errors.email && "is-invalid"}`}
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={registrationData.password}
          onChange={handleChange}
          className={`form-control ${errors.password && "is-invalid"}`}
        />
        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
      </div>
      <button type="submit" className="btn btn-primary">Register</button>
    </form>
  );
}

export default RegisterForm;
