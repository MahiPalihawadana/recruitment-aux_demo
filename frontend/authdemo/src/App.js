import React, { Component } from "react";
import './App.css';
const request = require("request");
const jwt = require("jsonwebtoken");

class App extends Component {
  state = {
    token: "",
    email: "",
    id: ""
  };

  btn1handler = e => {
    console.log(e.target.name);

    const uname = document.querySelector("#uname").value;
    const pass = document.querySelector("#pass").value;

    console.log(uname + pass);
    request.post(
      "http://localhost:3001/usr/login1",
      { form: { email: uname, password: pass } },
      (err, res, body) => {
        console.log("body - " + body);
        var newdata = body.slice(1, -1);
        //newdata

        console.log(newdata);

        this.setState({ token: newdata });

        var data = jwt.verify(newdata, "authdemo");

        console.log(data);

        this.setState({ email: data.email, id: data.id });
        localStorage.setItem({jwtoken:newdata})



      }
    );
  };

  render() {
    return (
      <div className="App">
        <h1> hi this is auth demo </h1>
        <label> enter username </label>
        <input
          type="text"
          name="uname"
          placeholder="enter user name"
          id="uname"
        />
        <br />
        <label> enter password </label>
        <input type="text" name="pass" placeholder="enter password" id="pass" />
        <br />
        <input
          type="button"
          name="btn1"
          value="login"
          onClick={this.btn1handler}
        />
      </div>
    );
  }
}

export default App;
