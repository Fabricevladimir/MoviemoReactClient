import React from 'react';
import { NavLink } from 'react-router-dom';
import {Navbar, NavbarBrand} from 'reactstrap';


const NavMenu = () => (
    <Navbar color="dark" dark expand="md">
    <NavbarBrand tag={NavLink} className="navbar-brand mb-0 h1" to="/">
      Moviemo
    </NavbarBrand>
  </Navbar>
);

export default NavMenu;
