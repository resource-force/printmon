import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import styles from "./App.module.scss";
import {
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider,
  Classes,
  Alignment,
  Button
} from "@blueprintjs/core";

class App extends Component {
  render() {
    return (
      <div className={`bp3-dark ${styles.background}`}>
        <Navbar color="dark">
          <NavbarGroup align={Alignment.LEFT}>
            <NavbarHeading>AB Printing</NavbarHeading>
            <NavbarDivider />
            <Button className={Classes.MINIMAL} icon="home" text="Home" />
            <Button className={Classes.MINIMAL} icon="book" text="About" />
          </NavbarGroup>
        </Navbar>
        <main className={styles.main}>
          <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/about" exact component={About} />
            </Switch>
          </BrowserRouter>
        </main>
      </div>
    );
  }
}

export default App;
