import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Api from './api';

class SignupEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Email: '',
            sending: false
        }
    }

    handleChange(event) {
        this.setState({
            Email: event.target.value,
        })
    }

    sendCode = () => {
// eslint-disable-next-line
        var mailformat = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
        if (this.state.Email === "") {
            alert("Email is required");
        } else if (!this.state.Email.match(mailformat)) {
            alert("enter a valid email pattern")
        }
        else {
            this.setState({
                sending: true,
            })
            fetch(Api + '/user/register/sending/code', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.Email,
                })
            })
                .then((response) => response.json())
                .then((responseData) => {
                    if (responseData.message === 'Code Sended') {
                        this.setState({
                            sending: false,
                        })
                        sessionStorage.setItem("authEmail", responseData.email)
                        this.props.history.push('/code/verification')
                    }
                    else {
                        alert(JSON.stringify(responseData.message))
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

    }
    render() {
        return (
            <div>
                <nav className="navbar navbar-default" style={{ backgroundColor: 'white' }}>
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <h3 style={{ color: '#4CAF50' ,marginTop:"10px",marginBottom:0}}>SA-INTRANET</h3>
                        </div>
                        <ul className="nav navbar-nav navbar-right">
                            <li><Link to="/login" style={{ color: '#4CAF50' }}>LOGIN</Link></li>
                            <li><a href="mailto:support@squashapps.com"><span class="glyphicon glyphicon-envelope"></span>&ensp;support@squashapps.com</a></li>
                        </ul>
                    </div>
                </nav>

                <div className="row" style={{ marginTop: "10%",marginLeft:"10%",marginRight:"10%" }}>
                    <div className="col-sm-6">
                        <img src={require('../assets/register.png')} alt='squashapps' 
                        />
                    </div>
                    <div className="col-sm-6">
                        <h2>Make Your Life Easy With Intranet</h2>
                        <p>To make a workspace from scratch,please confirm your email address</p>
                        <div className="form-group">
                            <p style={{ color: 'grey' }}>Email address</p>
                            <input type="email" class="form-control" value={this.state.Email} 
                            placeholder="name@gmail.com"
                            onChange={this.handleChange.bind(this)} />
                        </div>
                        {
                            this.state.sending ?
                                <button type="button" className="btn btn-success" disabled
                                ><div className="spinner-border"></div>Confirm Email</button>
                                :
                                <button type="button" className="btn btn-success"
                                    onClick={() => this.sendCode()}
                                >Confirm Email</button>

                        }
                    </div>
                </div>

            </div>
        );
    }
}

export default SignupEmail;