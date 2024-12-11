import React, { useEffect, useState } from "react";
import "./styles.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import userSvg from "../../assets/user.svg";

function Header() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function logout() {
    auth.signOut();
    navigate("/");
  }

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar">
      <p className="navbar-heading">Expensify</p>
      <div className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
        <Link className="navbar-link1" to="/pricing">
          Pricing
        </Link>
        <Link className="navbar-link1" to="/contact">
          Contact-Us
        </Link>
        {user ? (
          <p className="navbar-link" onClick={logout}>
            <span style={{ marginRight: "1rem" }}>
              <img
                src={user.photoURL ? user.photoURL : userSvg}
                width={user.photoURL ? "32" : "24"}
                style={{ borderRadius: "50%" }}
                alt="User avatar"
              />
            </span>
            Logout
          </p>
        ) : (
          <></>
        )}
      </div>
      <button className="navbar-toggle" onClick={toggleMenu}>
        ☰
      </button>
    </div>
  );
}

export default Header;
