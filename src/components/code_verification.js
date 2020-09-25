import React, { Component } from 'react';
import Api from './api';
import OtpInput from 'react-otp-input';

class CodeVerification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Code: '',
            sending: false,
            auth: true
        }
    }

    handleChange = otp => this.setState({ Code:otp });

    verifyCode = () => {

        if (this.state.Code === "") {
            alert("Code is required");
        }
        else {
            this.setState({
                sending: true,
            })
            fetch(Api + '/validate/code', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: sessionStorage.getItem("authEmail"),
                    code: this.state.Code,
                })
            })
                .then((response) => response.json())
                .then((responseData) => {
                    if (responseData.message === 'Valid code') {
                        this.setState({
                            sending: false,
                        })
                        this.props.history.push('/setting/up/profile')
                    }
                    else {
                        alert(responseData.message)
                        this.setState({
                            sending: false,
                            auth: false
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

    resendCode = () => {
        this.setState({
            sending: true
        })
        fetch(Api + '/resend/code', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: sessionStorage.getItem("authEmail")
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.message === 'Verification code sended') {
                    this.setState({
                        sending: false,
                    })
                    alert("Check your inbox,code has been resended")
                }
                else {
                    alert(responseData.message)
                    this.setState({
                        sending: false,
                        auth: false
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
                        <h2>We"ve sent you a email</h2>
                        <p>To make a workspace from scratch,please confirm your email address</p>
                        <div className="form-group">
                            <p style={{ color: 'grey' }}>Enter your verification code</p>
                            {/* <input type="email" class="form-control" value={this.state.Code} onChange={this.handleChange.bind(this)} /> */}

                            <OtpInput
                                value={this.state.Code}
                                onChange={this.handleChange}
                                numInputs={6}
                                containerStyle={{
                                    width:"500px"
                                }}
                                separator={<span>-&ensp;</span>}
                            />
                        </div>
                        {
                            this.state.sending ?
                                <div className="spinner-border"></div>
                                :
                                this.state.auth ?
                                    null
                                    :
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <p style={{ color: 'red' }}>Please enter valid verification code</p>
                                        </div>
                                        <div className="col-sm-6">
                                            <p
                                                style={{ color: 'blue' }}
                                                onClick={() => {
                                                    this.resendCode();
                                                }}>Resend code</p>
                                        </div>
                                    </div>
                        }
                        <button type="button" className="btn btn-success"
                            onClick={() => this.verifyCode()}
                        >verify</button>
                    </div>
                </div>

            </div>
        );
    }
}

export default CodeVerification;