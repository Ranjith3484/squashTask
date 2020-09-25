import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Api from './api';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Email: '',
            Password: "",
            sending: false
        }
    }

    handleChange(event) {
        this.setState({
            Email: event.target.value,
        })
    }

    handleChange1(event) {
        this.setState({
            Password: event.target.value,
        })
    }


    logMeIn = async () => {

        this.setState({
            sending: true,
        })
        fetch(Api + '/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: await this.state.Email,
                password: await this.state.Password
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.message === "Login successful") {
                    this.setState({
                        sending: false,
                    })
                    alert(responseData.message);
                    sessionStorage.setItem("userId", responseData.userid);
                    sessionStorage.setItem("userToken", responseData.token);
                    sessionStorage.setItem("userEmail", responseData.email);
                    sessionStorage.setItem("userName", responseData.name);
                    this.props.history.push('/home/dashboard')
                }
                else {
                    alert(responseData.message)
                    this.setState({
                        sending: false,
                    })
                }

            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    sending: false,
                })
            })

    }
    render() {
        return (
            <div>
                <nav className="navbar navbar-default" style={{ backgroundColor: 'white' }}>
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <h3 style={{ color: '#4CAF50',marginTop:"10px",marginBottom:0 }}>SA-INTRANET</h3>
                        </div>
                        <ul className="nav navbar-nav navbar-right">
                            <li><a href="mailto:support@squashapps.com"><span class="glyphicon glyphicon-envelope"></span>&ensp;support@squashapps.com</a></li>
                        </ul>
                    </div>
                </nav>

                <div className="row" style={{ marginTop: "10%", marginLeft: "10%", marginRight: "10%" }}>
                    <div className="col-sm-6">
                        <img src={require('../assets/register.png')} alt='squashapps' />
                    </div>
                    <div className="col-sm-6">
                        <h2>Login to your app</h2>
                        <p>To make a workspace from scratch,please confirm your email address</p>
                        <div className="form-group">
                            <p style={{ color: 'grey' }}>User Name</p>
                            <input type="email" class="form-control" value={this.state.Email}
                                placeholder="Enter your Username"
                                onChange={this.handleChange.bind(this)} />
                        </div>
                        <div className="form-group">
                            <p style={{ color: 'grey' }}>Password</p>
                            <input type="email" class="form-control" value={this.state.Password}
                                placeholder="Enter your Password"
                                onChange={this.handleChange1.bind(this)} />
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div class="checkbox">
                                    <label><input type="checkbox" /> Remember me</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                               <div class="checkbox">
                                    <Link to="/" color="blue" style={{textAlign:'right'}}>Forgot Password?</Link>
                                </div>
                            </div>

                        </div>
                        {
                            this.state.sending ?
                                <button type="button" className="btn btn-success" disabled
                                ><div className="spinner-border"></div>Sign In</button>
                                :
                                <button type="button" className="btn btn-success"
                                    onClick={() => this.logMeIn()}
                                >Sign In</button>

                        }
                    </div>
                </div>

            </div>
        );
    }
}

export default LoginPage;