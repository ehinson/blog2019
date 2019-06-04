
import React, { Component} from "react";
import { hot } from "react-hot-loader";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Form from '../src/views/components/Register';

function Index() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

class App extends Component{
  render(){
    return(
      <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login/">login</Link>
            </li>
            <li>
              <Link to="/users/">Users</Link>
            </li>
            <li>
              <Link to="/register/">Register</Link>
            </li>
          </ul>
        </nav>

        <Route path="/" exact component={Index} />
        <Route path="/login/" component={About} />
        <Route path="/users/" component={Users} />
        <Route path="/register/" component={Form} />
      </div>
    </Router>
    );
  }
}

export default hot(module)(App);