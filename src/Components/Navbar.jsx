import React, { useState } from "react";
import { navbarStyles } from "../assets/dummyStyle";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiAward } from "react-icons/fi";
import { CiLogin, CiLogout } from "react-icons/ci";

const Navbar = ({ logoSrc }) => {
  const navigate = useNavigate();
  const [loggedIn, setloggedIn] = useState(false);
  const [menuOpen, setmenuOpen] = useState(false);

  const handleLogout=()=>{
    try{
        localStorage.removeItem("authToken")
        localStorage.clear()
    }catch(err){
        console.log("Failed to logout")
        throw new err
    }
    window.dispatchEvent(new CustomEvent('authChanged',{detail:{user:null}}));
    setmenuOpen(false)
    try{
        navigate("/login")
    }catch(err){
        console.log("falied to move to login page",err)
        window.location.href="/login"
    }
  }
  return (
    <nav className={navbarStyles.nav}>
      <div
        style={{ backgroundImage: navbarStyles.decorativePatternBackground }}
        className={navbarStyles.decorativePattern}
      ></div>

      <div className={navbarStyles.bubble1}></div>
      <div className={navbarStyles.bubble2}></div>
      <div className={navbarStyles.bubble3}></div>

      <div className={navbarStyles.container}>
        {/* icon */}
        <div className={navbarStyles.logoContainer}>
          <Link to="/" className={navbarStyles.logoButton}>
            <div className={navbarStyles.logoInner}>
              <img
                src={
                  logoSrc ||
                  "https://yt3.googleusercontent.com/eD5QJD-9uS--ekQcA-kDTCu1ZO4d7d7BTKLIVH-EySZtDVw3JZcc-bHHDOMvxys92F7rD8Kgfg=s900-c-k-c0x00ffffff-no-rj"
                }
                alt="QuizMaster logo"
                className={navbarStyles.logoImage}
              />
            </div>
          </Link>
        </div>
        
        {/* Title */}
        <div className={navbarStyles.titleContainer}>
          <div className={navbarStyles.titleBackground}>
            <h1 className={navbarStyles.titleText}>Dev Sprint</h1>
          </div>
        </div>
        
        {/* results button */}
        <div className={navbarStyles.desktopButtonsContainer}>
          <div className={navbarStyles.spacer}></div>
          <NavLink to={"/result"} className={navbarStyles.resultsButton}>
            <FiAward className={navbarStyles.buttonIcon} />
            My Result
          </NavLink>

          {loggedIn?<button onClick={handleLogout} className={navbarStyles.logoutButton}>
                <CiLogout className={navbarStyles.buttonIcon}/>
                Logout
          </button>:<NavLink to={"/login"} className={navbarStyles.loginButton}>
                <CiLogin className={navbarStyles.buttonIcon}/>
                Login
            </NavLink>}

        </div>

        
        

      </div>
    </nav>
  );
};

export default Navbar;
