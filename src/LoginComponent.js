import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './LoginComponent.css';
import DashboardComponent from './DashboardComponent.js';
import User from './model/User';
import Session from './model/Session';
import { Button } from 'react-bootstrap';

class LoginComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      validUsername: true,
      validPassword: true,
      validLogin: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    if (event.target.id === 'username') {
      this.setState({
        username: event.target.value
      });
    } else if (event.target.id === 'password') {
      this.setState({
        password: event.target.value
      });
    }
  }

  handleSubmit(event) {
    var validForm = true;
    if (this.state.username === '') {
      this.setState({
        validUsername: false
      });
      validForm = false;
    } else {
      this.setState({
        validUsername: true
      });
    }

    if (this.state.password === '') {
      this.setState({
        validPassword: false
      });
      validForm = false;
    } else {
      this.setState({
        validPassword: true
      });
    }

    if (validForm) {
      this.performLogin(this.state.username, this.state.password);
    }
    event.preventDefault();
  }

  performLogin(username, password) {
    var headers = {
      'Content-Type': 'application/json'
    };

    var credentials = {
      email: username,
      pass: password
    };

    var body = JSON.stringify(credentials);

    fetch("http://localhost:3008/api/login", {
      method: 'post',
      headers: headers,
      body: body
    }).then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.answerPetition === 'Denegated') {
          this.setState({
            validLogin: false
          })
        } else {
          var user = new User()
          user.username = username;
          user.token= 'token';
          var session = Session.getInstance();
          session.user = user;
          ReactDOM.render(
            <DashboardComponent />,
            document.getElementById('root')
          );
        }
      })
      .catch(error => {
        console.error(error);
      })
  }

  render() {
    var { Grid, Row, Col, FormGroup, FormControl, ControlLabel, Alert } = require('react-bootstrap');
    return (
      <div className="fondo">
        <Grid>
          <Row className="white-text justify-content-center">
            <Col lg={6} xsOffset={3}>
              <h1 className="text-center">Inicia Sesión</h1>
              <form className="form" onSubmit={this.handleSubmit}>
                <FormGroup>
                  <ControlLabel htmlFor="username">Correo</ControlLabel>
                  <FormControl id="username" type="text" placeholder="Correo" onChange={this.handleChange} value={this.state.username} pattern="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?" />
                  {!this.state.validUsername &&
                    <Alert bsStyle="warning" className="error">Debes ingresar un correo válido</Alert>
                  }
                </FormGroup>
                <FormGroup>
                  <ControlLabel htmlFor="password">Contraseña</ControlLabel>
                  <FormControl id="password" type="password" placeholder="Contraseña" onChange={this.handleChange} value={this.state.password} />
                  {!this.state.validPassword &&
                    <Alert bsStyle="warning" className="error">Debes introducir una contraseña válida</Alert>
                  }
                </FormGroup>

                {!this.state.validLogin &&
                  <Alert bsStyle="warning">
                    <span className="glyphicon glyphicon-ban-circle"></span> El usuario o contraseña no son correctos!
                    </Alert>
                }

                <FormGroup>
                  <Button bsStyle="success" type="submit" >Ingresar</Button>
                </FormGroup>

                <p>Usuario: user | Password: pass</p>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default LoginComponent;
