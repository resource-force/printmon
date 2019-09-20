import React from "react";
import {
  Route,
  Switch,
  withRouter,
  RouteComponentProps
} from "react-router-dom";
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

function App({ history }: RouteComponentProps<{}>) {
  return (
    <div>
      <Navbar>
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading>AB Printing</NavbarHeading>
          <NavbarDivider />
          <Button
            className={Classes.MINIMAL}
            onClick={() => history.push("/")}
            icon="home"
            text="Home"
          />
          <Button
            className={Classes.MINIMAL}
            onClick={() => history.push("/about")}
            icon="book"
            text="About"
          />
        </NavbarGroup>
      </Navbar>
      <main className={styles.main}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" exact component={About} />
        </Switch>
      </main>
    </div>
  );
}

export default withRouter(App);
