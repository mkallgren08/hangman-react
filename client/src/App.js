import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Articles from "./pages/Articles";

const App = () => (
  <Router>
  <div>
    <Route exact path="/" component={Articles} />
    <Route exact path="/articles" component={Articles} />
    <Route exact path="/articles/:id" component={Articles} />
    {/* <Articles /> */}
  </div>
  </Router>
);


export default App;
