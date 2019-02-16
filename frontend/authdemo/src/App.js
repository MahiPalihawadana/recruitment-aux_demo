import React, { Component } from "react";
import "./App.css";
//import { runInThisContext } from "vm";
const jsonwebtoken = require("jsonwebtoken");
const request = require("request");

class App extends Component {
  state = {
    token: "",
    email: "",
    password: "",
    loggedIn: false,
    showError: false,
    showNullError: false
  };

  changehandleremail = event => {
    this.setState({
      email: event.target.value
    });
  };

  changehandlerpass = event => {
    this.setState({
      password: event.target.value
    });
  };

  componentDidMount() {
    var jwt = localStorage.getItem("jwt");
    console.log("comp mount");
    console.log(jwt);
    try {
      var tk = jsonwebtoken.verify(jwt, "authdemo");
      if (tk) {
        console.log("loged in");
        this.setState({
          loggedIn: true,
          email:tk.email
        });
      }
    } catch (error) {
      console.log("not logged in" + error);
      
      this.setState({
        loggedIn: false
      });
    }
  }

  btn1handler = e => {
    e.preventDefault();

    console.log("cliking");

    if (this.state.email === "" || this.state.password === "") {
      console.log(this.state.email + "   " + this.state.password);
      console.log("wtf");
      this.setState({
        loggedIn: false,
        showError: false,
        showNullError: true
      });
    } else {
      console.log("sending..............");
      console.log(this.state.email + this.state.password);
      request.post(
        "http://localhost:3001/usr/login1",
        {
          form: {
            email: this.state.email,
            password: this.state.password
          }
        },
        (err, res, body) => {
          console.log("errr - " + err);
          console.log("response - " + res);
          console.log("body - " + body);

          if (body !== "false") {
            console.log("body - " + body);
            var newdata = body.slice(1, -1);

            console.log(newdata);

            localStorage.setItem("jwt", body);

            this.setState({
              loggedIn: true,
              showError: false,
              showNullError: false
            });
          } else {
            console.log(err);
            this.setState({
              loggedIn: false,
              showError: true,
              showNullError: false
            });
          }

          // this.setState({ email: data.email, id: data.id });
        }
      );
    }
  };

  render() {
    const { email, password, showError, loggedIn, showNullError } = this.state;

    if (!loggedIn) {
      return (
        <div className="App">
          <h1> hi this is auth demo </h1>
          <label> enter username </label>
          <input
            type="text"
            name="uname"
            onChange={this.changehandleremail}
            placeholder="enter user name"
          />
          <br />
          <label> enter password </label>
          <input
            type="text"
            name="pass"
            placeholder="enter password"
            onChange={this.changehandlerpass}
          />
          <br />
          <input
            type="button"
            name="btn1"
            value="login"
            onClick={this.btn1handler}
          />
          {showNullError && (
            <div>
              <p>The username or password cannot be null.</p>
            </div>
          )}

          {showError && (
            <div>
              <p>The username or password is incorrect dude XD.</p>
            </div>
          )}
        </div>
      );
    } else {
      return <div> you are logged in as {this.state.email}</div>;
    }
  }
}

export default App;
