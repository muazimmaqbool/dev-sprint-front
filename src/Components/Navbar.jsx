import React from "react";
import { navbarStyles } from "../assets/dummyStyle";

const Navbar = () => {
  return (
    <nav className={navbarStyles.nav}>
      <div
        style={{ backgroundImage: navbarStyles.decorativePatternBackground }}
        className={navbarStyles.decorativePattern}
      ></div>
    </nav>
  );
};

export default Navbar;
