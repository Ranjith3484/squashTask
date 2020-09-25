import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Api from './api';

class SetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            FirstName: '',
            LastName:'',
            Password:"",
            sending: false
        }
    }

    handleChange(event) {
        this.setState({
            FirstName: event.target.value,
        })
    }

    handleChange1(event) {
        this.setState({
            LastName: event.target.value,
        })
    }


    handleChange2(event) {
        this.setState({
            Password: event.target.value,
        })
    }


    setPassword = async () => {

            if(this.state.FirstName===""){
                 alert("Firstname cannot be empty")
            }else if(this.state.LastName===''){
                alert("Lastname cannot be empty")
            }else if(this.state.Password===""){
                alert("Password cannot be empty")
            }else{
                this.setState({
                    sending: true,
                })
                fetch(Api + '/setting/up/password', {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: sessionStorage.getItem("authEmail"),
                        firstname: await this.state.FirstName,
                        lastname: await this.state.LastName,
                        password: await this.state.Password
                    })
                })
                    .then((response) => response.json())
                    .then((responseData) => {
                        if (responseData.message === "Done") {
                            this.setState({
                                sending: false,
                            })
                            alert("Completed");
                            sessionStorage.clear();
                            this.props.history.push('/login');
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
                        <img src={require('../assets/register.png')} alt='squashapps' />
                    </div>
                    <div className="col-sm-6">
                        <h2>Create Personal Password</h2>
                        <p>To make a workspace from scratch,please confirm your email address</p>
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <p style={{ color: 'grey' }}>FirstName</p>
                                <input type="text" class="form-control" value={this.state.FirstName}
                                placeholder="john"
                                onChange={this.handleChange.bind(this)} />
                            </div>
                            <div className="col-md-6 form-group">
                                <p style={{ color: 'grey' }}>LastName</p>
                                <input type="text" class="form-control" value={this.state.LastName}
                                placeholder="smith"
                                onChange={this.handleChange1.bind(this)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <p style={{ color: 'grey' }}>Password</p>
                            <input type="email" class="form-control" value={this.state.Password} 
                            placeholder="Enter your password"
                            onChange={this.handleChange2.bind(this)} />
                        </div>
                        {
                            this.state.sending ?
                                <button type="button" className="btn btn-success" disabled
                                ><div className="spinner-border"></div>Complete</button>
                                :
                                <button type="button" className="btn btn-success"
                                    onClick={() => this.setPassword()}
                                >Complete</button>

                        }
                    </div>
                </div>

            </div>
        );
    }
}

export default SetPassword;