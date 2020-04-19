import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";
import { PlayerContextProvider } from "./components/PlayerContext";
import MainView from "./views/MainView";

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

function App() {
  return (
    <PlayerContextProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/">
              <MainView />
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </PlayerContextProvider>
  );
}

export default App;
