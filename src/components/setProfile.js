import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Api from './api';

class SetProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Company: '',
            Location: '',
            Employee: "",
            Domain: "",
            sending: false
        }
    }

    handleChange(event) {
        this.setState({
            Company: event.target.value,
        })
    }

    handleChange1(event) {
        this.setState({
            Location: event.target.value,
        })
    }

    handleChange2(event) {
        this.setState({
            Employee: event.target.value,
        })
    }

    handleChange3(event) {
        this.setState({
            Domain: event.target.value,
        })
    }

    addProfile = async () => {

       if(this.state.Company===''){
         alert("Company name cannot be empty")
       }else if(this.state.Location===""){
        alert("Loaction cannot be empty")
       }else if(this.state.Employee===""){
        alert("Emloyees cannot be empty")
       }else if(this.state.Domain===""){
        alert("Domain cannot be empty")
       }else{
        this.setState({
            sending: true,
        })
        fetch(Api + '/setting/up/profile', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: sessionStorage.getItem("authEmail"),
                company: await this.state.Company,
                location: await this.state.Location,
                employee: await this.state.Employee,
                domain: await this.state.Domain+".intranet.com"
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.message === 'Profile Setted') {
                    this.setState({
                        sending: false,
                    })
                    this.props.history.push('/setting/password')
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
                            <h3 style={{ color: '#4CAF50',marginTop:"10px",marginBottom:0 }}>SA-INTRANET</h3>
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
                        <h2>Setup your application</h2>
                        <p>To make a workspace from scratch,please confirm your email address</p>
                        <div className="form-group">
                            <p style={{ color: 'grey' }}>Company Name</p>
                            <input type="text" class="form-control" value={this.state.Company}
                            placeholder="SquashApps"
                            onChange={this.handleChange.bind(this)} />
                        </div>
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <p style={{ color: 'grey' }}>Location</p>
                                <input type="text" class="form-control" value={this.state.Location} 
                                placeholder="coimbatore"
                                onChange={this.handleChange1.bind(this)} />
                            </div>
                            <div className="col-md-6 form-group">
                                <p style={{ color: 'grey' }}>No. of employees</p>
                                <input type="number" class="form-control" value={this.state.Employee} 
                                placeholder="256"
                                onChange={this.handleChange2.bind(this)} />
                            </div>
                        </div>
                        <p style={{ color: 'grey' }}>Domian</p>

                        <div class="input-group">
                       
                            <input type="text" class="form-control" value={this.state.Domian} 
                            placeholder="Customize your domain name"
                            onChange={this.handleChange3.bind(this)} />
                            <div class="input-group-btn">
                                <button class="btn btn-default" type="submit">
                                    <span>.intranet.com</span>
                                </button>
                            </div>
                        </div>
                        <br></br>
                        {
                            this.state.sending ?
                                <button type="button" className="btn btn-success" disabled
                                ><div className="spinner-border"></div>Next</button>
                                :
                                <button type="button" className="btn btn-success"
                                    onClick={() => this.addProfile()}
                                >Next</button>

                        }
                    </div>
                </div>

            </div>
        );
    }
}

export default SetProfile;