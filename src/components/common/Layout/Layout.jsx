import React from 'react';
import { Container } from 'reactstrap';

import NavMenu from '../NavMenu/NavMenu';

const Layout = (props) => {
  return ( 
      <>
        <NavMenu />
        <Container className="mt-4">{props.children}</Container>
      </> );
}
 
export default Layout;
