import React, { useState } from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import axios from "axios";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

function App() {
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleFaceScan = async () => {
    try {
      const response = await axios.post('http://localhost:3001/face-scan');
      // Process the response from the server
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#">Face Detection App</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ml-auto">
            <Nav.Link href="#"><i className="fas fa-envelope"></i> Contact Us</Nav.Link>
            <Nav.Link href="#"><i className="fas fa-question-circle"></i> Help</Nav.Link>
            {loggedIn ? (
              <>
                <Nav.Link onClick={handleFaceScan}><i className="fas fa-camera"></i> Scan Face</Nav.Link>
                <Nav.Link onClick={() => setLoggedIn(false)}><i className="fas fa-sign-out-alt"></i> Logout</Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={handleRegisterClick}><i className="fas fa-user-plus"></i> Register</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="container-fluid p-0">
        <div className="bg-dark text-light p-5 text-center position-relative">
          <h1 className="display-4">Welcome to our Face Detection App</h1>
          <p className="lead">Scan your face to access the features</p>
          <div className="position-absolute top-50 start-50 translate-middle">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-5" style={{ background: "linear-gradient(145deg, #f0f2f5, #dfe1e5)" }}>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                {loggedIn ? (
                  <div>
                      <h2 className="text-center mb-4">Welcome!✨ </h2>
                    <h2 className="text-center mb-4"> .Now You can use Face-scan....👍 And Press 'q' to Exit From Scan-Face</h2>
                    <h3 className="text-center mb-4">After Click Scan-Face Wait for 10 seconds </h3>
                    <h5>...Please wait...</h5>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-center mb-4">Login</h2>
                    <LoginForm setLoggedIn={setLoggedIn} />
                  </div>
                )}
                {!loggedIn && !registrationSuccess && showRegister && (
                  <div>
                    <h2 className="text-center mb-4">Register</h2>
                    <RegisterForm setRegistrationSuccess={setRegistrationSuccess} />
                  </div>
                )}
                {registrationSuccess && <div className="alert alert-success mt-4">Successfully registered!</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-dark text-light text-center py-3 mt-5">
        <p>&copy; 2024 Face Detection App. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
