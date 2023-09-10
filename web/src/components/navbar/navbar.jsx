import React from "react";
import "./navbar.css";
import * as Icon from "react-bootstrap-icons";

const Navbar = () => {
  return (
    <nav>
      <div className="logo">
        <h1>
          Creative MIND <Icon.Chat />{" "}
        </h1>
      </div>
      <div className="searchBar">
        <label htmlFor="search">
          <Icon.Search />
        </label>
        <input type="text" id="search" />
      </div>
    </nav>
  );
};

export default Navbar;
