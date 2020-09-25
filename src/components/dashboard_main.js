import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Multiselect } from 'multiselect-react-dropdown';
import Api from './api';

class DashbaordMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sending: false,
            Subject: "",
            Category: "",
            Description: "",
            Notify: "",
            Date: "",
            Time: "",
            Location: "",
            ExpiresOn: "",
            comment: false,
            CommentItem: '',
            Comment: "",
            TotalComments: ""

        }
    }

    componentDidMount() {
        this.webCall();
    }

    webCall = async () => {
        fetch(Api + '/get/all/announcement', {
            method: 'GET',
            headers: {
                'id': await sessionStorage.getItem('userEmail'),
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    datas: responseJson
                })

            })
            .catch((error) => {
                console.error(error);
            });
    }

    webCall1 = async (item) => {
        fetch(Api + '/get/all/comment', {
            method: 'GET',
            headers: {
                'id': item._id,
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    datas1: responseJson,
                    TotalComments: responseJson.length
                })
            })
            .catch((error) => {
                console.error(error);
            });
    }

    onSelect = (selectedList, selectedItem) => {
        this.setState({
            Notify: selectedList
        })
    }

    onRemove = (selectedList, removedItem) => {
        this.setState({
            Notify: selectedList
        })
    }

    handleChange(event) {
        this.setState({
            Subject: event.target.value,
        })
    }
    handleChange1(event) {
        this.setState({
            Date: event.target.value,
        })
    }
    handleChange2(event) {
        this.setState({
            Time: event.target.value,
        })
    }
    handleChange3(event) {
        this.setState({
            Location: event.target.value,
        })
    }
    handleChange4(event) {
        this.setState({
            ExpiresOn: event.target.value,
        })
    }
    handleChange5(event) {
        this.setState({
            Description: event.target.value,
        })
    }
    handleChange15(event) {
        this.setState({
            Comment: event.target.value,
        })
    }
    addAnnouncement = async () => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const d = new Date();

        const month = monthNames[d.getMonth()];
        const date = (d.getDate() < 10 ? '0' : '') + d.getDate();
        const year = d.getFullYear();
        const Time = (d.toLocaleTimeString());

        const d1 = new Date(await this.state.Date);
        const month1 = monthNames[d.getMonth()];
        const date1 = (d1.getDate() < 10 ? '0' : '') + d1.getDate();
        const year1 = d1.getFullYear();

        this.setState({
            sending: true,
        })
        fetch(Api + '/add/new/announcement', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subject: await this.state.Subject,
                category: await this.state.Category,
                description: await this.state.Description,
                notify: await this.state.Notify.toString(),
                date: date1 + " " + month1 + ", " + year1,
                time: await this.state.Time,
                location: await this.state.Location,
                expireson: await this.state.ExpiresOn,
                createdAt: date + " " + month + ", " + year,
                createdTime: Time.slice(0, 4) + Time.slice(8, 11),
                createdBy: sessionStorage.getItem("userEmail")
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.message === "Announcement Sended") {
                    this.webCall();
                    alert(responseData.message)
                    this.setState({
                        sending: false,
                    })
                    this.webCall();
                    this.clearInput();
                }
                else {
                    this.webCall();
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

    clearInput = () => {
        this.setState({
            Subject: "",
            Category: "",
            Description: "",
            Notify: "",
            Date: "",
            Time: "",
            Location: "",
            ExpiresOn: ""
        })
    }

    addComment = async () => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const d = new Date();

        const month = monthNames[d.getMonth()];
        const date = (d.getDate() < 10 ? '0' : '') + d.getDate();
        const year = d.getFullYear();
        const Time = (d.toLocaleTimeString());
        this.setState({
            sending: true,
        })
        fetch(Api + '/add/new/comment', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.state.CommentItem._id,
                description: await this.state.Comment,
                date: date + " " + month + ", " + year,
                time: Time.slice(0, 4) + Time.slice(8, 11),
                createdBy: sessionStorage.getItem("userName")
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.message === "Comment Added") {
                    this.updateAnnouncemnt();
                }
                else {
                    alert(responseData.message)
                    this.setState({
                        sending: false,
                    })
                    this.webCall1(this.state.CommentItem);
                }

            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    sending: false,
                })
            })

    }

    updateAnnouncemnt = async () => {
        fetch(Api + '/update/comments/in/announcements', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: await this.state.CommentItem,
                comment: parseInt(await this.state.TotalComments) + 1
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.message === "Comment Updated") {
                    this.setState({
                        sending: false,
                    })
                    this.webCall1(this.state.CommentItem);
                    this.webCall();
                    alert("Comment Added");
                    this.setState({
                        Comment: ""
                    })
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

    render() {
        var mail = ['ranjith@gmail.com', 'ranjithkumarsv.me16@bitsathy.ac.in',]
        return (
            <div>
                <div className="row" style={{ display: 'flex', marginLeft: 0, marginRight: 0 }}>
                    <div className="col-md-2" style={{ backgroundColor: '#33334d', minHeight: "100vh" }}>
                        <div style={{ justifyContent: 'center', display: 'flex' }}>
                            <h3 style={{ color: '#4CAF50' }}>SA-INTRANET &ensp;
                          <span className="glyphicon glyphicon-menu-hamburger" style={{ color: 'grey' }}></span></h3>
                        </div>
                        <div style={{ justifyContent: 'center', display: 'flex', paddingTop: "40px" }}>
                            <button type="button" className="btn btn-success">
                                <span className="glyphicon glyphicon-bullhorn" style={{ color: 'white' }}> </span>
                                &ensp;  Announcement
                        </button>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <Link to="/" style={{ color: 'white', padding: "40px" }}
                                onClick={() => sessionStorage.clear()}
                            >
                                <span className="glyphicon glyphicon-user" style={{ color: 'white' }}> </span>
                                &ensp;  Log out
                        </Link>
                        </div>
                    </div>
                    <div className={this.state.comment ? "col-md-7" : "col-md-10"}
                        style={{ backgroundColor: '#cccccc', minHeight: "100vh", padding: 0 }}>
                        <div style={{ backgroundColor: 'white', padding: "20px" }}>
                            <h4>Announcement</h4>
                        </div>
                        <div className="row" style={{ paddingTop: "10px" }}>
                            <div className="col-md-6"></div>
                            <div className="col-md-3">
                                {
                                    this.state.modal ?
                                        null
                                        :
                                        <div className="input-group">
                                            <input type="text" class="form-control"
                                                placeholder="Search" />
                                            <div className="input-group-btn">
                                                <button className="btn btn-default" type="submit">
                                                    <span className="glyphicon glyphicon-search"></span>
                                                </button>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div className="col-md-3">
                                <button type="button" className="btn btn-success"
                                    data-toggle="modal" data-target="#myModal"
                                >
                                    <span className="glyphicon glyphicon-plus"></span>&ensp; Add Announcement
                                </button>
                                <div className="modal fade" id="myModal" data-backdrop="static" role="dialog" style={{ marginLeft: "130vh" }}>
                                    <div className="modal-dialog">

                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                                <h4 class="modal-title">Add new Announcement</h4>
                                            </div>
                                            <div className="modal-body container-fluid">
                                                <div className="form-group">
                                                    <p style={{ color: 'grey' }}>Subject</p>
                                                    <input type="text" class="form-control" value={this.state.Subject}
                                                        onChange={this.handleChange.bind(this)} />
                                                </div>
                                                <div className="form-group">
                                                    <p style={{ color: 'grey' }}>Category</p>
                                                    <div className="row" style={{ justifyContent: "space-between" }}>
                                                        <div className="col-md-4">
                                                            {
                                                                this.state.Category === 'Announcement' ?
                                                                    <button className="btn btn-success" style={{ borderRadius: 50 }}>
                                                                        Announcement
                                                                    </button>
                                                                    :
                                                                    <button className="btn btn-default"
                                                                        onClick={() => { this.setState({ Category: "Announcement" }) }}
                                                                        style={{ borderRadius: 50 }}>
                                                                        Announcement
                                                            </button>
                                                            }
                                                        </div>
                                                        <div className="col-md-4">
                                                            {
                                                                this.state.Category === 'Event' ?
                                                                    <button className="btn btn-success" style={{ borderRadius: 50 }}>
                                                                        Event
                                                                    </button>
                                                                    :
                                                                    <button className="btn btn-default"
                                                                        onClick={() => { this.setState({ Category: "Event" }) }}
                                                                        style={{ borderRadius: 50 }}>
                                                                        Event
                                                                    </button>
                                                            }
                                                        </div>
                                                        <div className="col-md-4">
                                                            {
                                                                this.state.Category === 'Remainder' ?
                                                                    <button className="btn btn-success"
                                                                        style={{ borderRadius: 50 }}>
                                                                        Remainder
                                                                    </button>
                                                                    :
                                                                    <button className="btn btn-default"
                                                                        onClick={() => { this.setState({ Category: "Remainder" }) }}
                                                                        style={{ borderRadius: 50 }}>
                                                                        Remainder
                                                                    </button>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    this.state.Category === 'Event' ?
                                                        <div>
                                                            <div className="row">
                                                                <div className="form-group col-md-6">
                                                                    <p style={{ color: 'grey' }}>Date</p>
                                                                    <input type="date" class="form-control" value={this.state.Date}
                                                                        onChange={this.handleChange1.bind(this)} />
                                                                </div>
                                                                <div className="form-group col-md-6">
                                                                    <p style={{ color: 'grey' }}>Time</p>
                                                                    <input type="time" class="form-control" value={this.state.Time}
                                                                        onChange={this.handleChange2.bind(this)} />
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <p style={{ color: 'grey' }}>Location</p>
                                                                <input type="text" class="form-control" value={this.state.Location}
                                                                    onChange={this.handleChange3.bind(this)} />
                                                            </div>
                                                        </div>
                                                        :
                                                        null
                                                }
                                                {
                                                    this.state.Category === 'Remainder' ?
                                                        <div className="form-group">
                                                            <p style={{ color: 'grey' }}>Expires on</p>
                                                            <input type="date" class="form-control" value={this.state.ExpiresOn}
                                                                onChange={this.handleChange4.bind(this)} />
                                                        </div>
                                                        :
                                                        null
                                                }
                                                <div className="form-group">
                                                    <p style={{ color: 'grey' }}>Description</p>
                                                    <textarea class="form-control" value={this.state.Description}
                                                        onChange={this.handleChange5.bind(this)} />
                                                </div>
                                                <div className="form-group">
                                                    <p style={{ color: 'grey' }}>Notify to</p>
                                                    {
                                                        this.state.Category === "" ?
                                                            <div>
                                                                <input type="checkbox" name="type" value="all" />
                                                                &ensp;<label for="all" style={{ color: 'grey' }}>To All Member</label><br></br>
                                                                <input type="checkbox" name="type" value="person" />
                                                                &ensp; <label for="person" style={{ color: 'grey' }}>Choose Persons</label><br></br>
                                                                <input type="checkbox" name="type" value="department" />
                                                                &ensp;<label for="department" style={{ color: 'grey' }}>Choose Departments</label>
                                                            </div>
                                                            :
                                                            <Multiselect
                                                                options={mail} // Options to display in the dropdown
                                                                isObject={false}
                                                                selectedValues={this.state.Notify} // Preselected value to persist in dropdown
                                                                onSelect={this.onSelect} // Function will trigger on select event
                                                                onRemove={this.onRemove}
                                                            />
                                                    }
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <div className="row" style={{ paddingRight: "10px" }}>
                                                    <button type="button" className="btn btn-default" data-toggle="modal"
                                                        data-target="#myModal"
                                                        onClick={() => { this.clearInput(); }}
                                                    >Discard</button>&ensp;
                                               {
                                                        this.state.sending ?
                                                            <button type="button" className="btn btn-success" data-dismiss="modal"
                                                                disabled
                                                            >Sending..</button>
                                                            :
                                                            <button type="button" className="btn btn-success" data-dismiss="modal"
                                                                onClick={() => { this.addAnnouncement(); }}
                                                            >Send</button>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                        {/* list of announcements */}
                        <div style={{ margin: 10 }}>
                            {
                                this.state.datas ?
                                    this.state.datas.map((item, i) =>
                                        <div style={{  backgroundColor: 'white', margin: "10px" }}>
                                            <div className="row" style={{ paddingTop: "20px" }}>
                                                <div className="col-md-2">
                                                    <span
                                                        className="badge"
                                                        style={{
                                                            backgroundColor: item.category === 'Announcement' ? "green" : "purple",
                                                            opacity: '0.6',
                                                            marginLeft: "20px",
                                                            marginTop: "10px",
                                                            height: "50px",
                                                            width: "50px",
                                                            borderRadius: "50%",
                                                            paddingTop: "15px"
                                                        }}
                                                    >
                                                        {item.createdBy.slice(0, 1)}
                                                    </span>
                                                </div>
                                                <div className="col-md-3">
                                                    <h3 style={{ marginTop: 0, marginBottom: 0 }}>{item.subject}</h3>
                                                </div>
                                                <div className="col-md-1">
                                                    <span className="glyphicon glyphicon-pencil" style={{ color: 'grey' }}></span>
                                                </div>
                                                <div className="col-md-1">
                                                    <span className="glyphicon glyphicon-comment" style={{ color: 'grey' }}
                                                        onClick={() => {
                                                            this.setState({
                                                                comment: true,
                                                                CommentItem: item
                                                            })
                                                            this.webCall1(item);
                                                        }}
                                                    >{item.comments}</span>
                                                </div>
                                                <div className="col-md-3">
                                                    <p style={{ color: 'grey', textAlign: 'right', paddingRight: "10px" }}>{item.createdAt}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-2"></div>
                                                <div className="col-md-10">
                                                    <p style={{ textAlign: 'justify', marginRight: "10px" }}>{item.description}</p>
                                                </div>
                                            </div>
                                            {
                                                item.location === "" ? null
                                                    :
                                                    <div>
                                                        <hr></hr>
                                                        <div className="row">
                                                            <div className="col-md-2"></div>
                                                            <div className="col-md-5">
                                                                <span className="glyphicon glyphicon-calendar"
                                                                    style={{ color: 'grey', paddingBottom: "20px", fontSize: '18px' }}
                                                                >
                                                                    {item.date}
                                                                </span>
                                                            </div>
                                                            <div className="col-md-5">
                                                                <span className="glyphicon glyphicon-map-marker"
                                                                    style={{ color: 'grey', paddingBottom: "20px", fontSize: "18px" }}
                                                                >
                                                                    {item.location}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                            }
                                        </div>

                                    )
                                    :
                                    null
                            }
                        </div>
                    </div>
                    {/* comment section */}
                    {
                        this.state.comment ?
                            <div className="col-md-3" style={{ backgroundColor: 'white', minHeight: "100vh",  paddingTop: "55px" }}>
                                <hr></hr>
                                <div className="row">
                                    <div className="col-md-5">
                                        <h3 style={{ marginTop: 0, marginBottom: 0 }}>{this.state.CommentItem.subject}</h3>
                                    </div>
                                    <div className="col-md-6">
                                        <p style={{ color: 'grey' }}>{this.state.CommentItem.createdAt}, {this.state.CommentItem.createdTime}</p>
                                    </div>
                                    <div className="col-md-1">
                                        <span className="glyphicon glyphicon-ban-circle"
                                            onClick={() => { this.setState({ comment: false }) }}
                                            style={{ color: 'grey' }}
                                        ></span>
                                    </div>
                                </div>
                                <hr></hr>
                                <div>
                                    <p style={{ color: 'black' }}>{this.state.CommentItem.description}</p>
                                </div>
                                <hr></hr>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4 style={{ textAlign: 'left' }}>Comments</h4>
                                    </div>
                                    <div className="col-md-6">
                                        {
                                            this.state.TotalComments > 1 ?
                                                <h4 style={{ textAlign: 'right' }}>
                                                    {this.state.TotalComments} replies
                                            </h4>
                                                :
                                                <h4 style={{ textAlign: 'right' }}>
                                                    {this.state.TotalComments} reply
                                        </h4>
                                        }

                                    </div>
                                </div>
                                {/* list of comments */}
                                {
                                    this.state.datas1 ?
                                        this.state.datas1.map((item, i) =>
                                            <div>
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <span style={{
                                                            height: "30px",
                                                            width: "30px",
                                                            backgroundColor: "purple",
                                                            opacity: '0.6',
                                                            borderRadius: "50%",
                                                            display: "inline-block",
                                                            marginTop: 0,
                                                            color: 'white',
                                                            textAlign: 'center',
                                                            textJustify: 'auto',
                                                            paddingTop: "3px"
                                                        }}>
                                                            {item.createdBy.slice(0, 1)}
                                                        </span>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <h4 style={{ marginTop: 0, marginBottom: 0 }}>{item.createdBy}</h4>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p style={{ color: 'grey' }}>{item.date}, {item.time}</p>
                                                    </div>
                                                </div>
                                                <p>{item.description}</p>
                                                <p>{item.status}</p>
                                            </div>

                                        )
                                        :
                                        null
                                }
                                {/* add comment */}
                                <div className="row">
                                    <div className="col-md-10">
                                        <textarea class="form-control" value={this.state.Comment}
                                            placeholder="Enter your comment" onChange={this.handleChange15.bind(this)} />
                                    </div>
                                    <div className="col-md-2">
                                        {
                                            this.state.sending ?
                                                <p>...</p>
                                                :
                                                <span className="glyphicon glyphicon-send"
                                                    onClick={() => { this.addComment() }}
                                                    style={{ color: 'grey' }}
                                                ></span>
                                        }
                                    </div>
                                </div>
                            </div>
                            :
                            null
                    }
                </div>
            </div>
        );
    }
}

export default DashbaordMain;