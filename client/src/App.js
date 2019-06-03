
import React, { Component} from "react";
import { hot } from "react-hot-loader";
import Form from '../src/views/components/Form';

class App extends Component{
  render(){
    return(
      <div className="App">
        <h1> Hello, World! </h1>
        <Form />
      </div>
    );
  }
}

export default hot(module)(App);