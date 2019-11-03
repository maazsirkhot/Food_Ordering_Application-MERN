import React, {Component} from 'react';
import cookie, { setRawCookie } from 'react-cookies';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import NavBarLogin from "../navbarlogin";
import "./userdashboard.css";
import axios from 'axios';
import {rooturl} from '../../config';
import Draggable, {DraggableCore} from 'react-draggable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';


const cardstyle = {
    width: '300px',
    
} 
class OwnerDashboard extends Component{
    constructor(props){
        super(props);
        this.state = {
            restname : cookie.load('cookierestname'),
            newOrders : "",
            otherOrders : "",
            orderCheck : "",
            orderStatus : "",
            updateStatus : "",
            showModal: false,
            messages : "",
            newMessage : ""            
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.sendMessages = this.sendMessages.bind(this);
        //this.modalMessages = this.modalMessages.bind(this);
    }

    changeHandler = (e) => {
        this.setState({
                [e.target.name] : e.target.value
        })
        //console.log(this.state);
    }

    componentWillMount(){
        const data = {
            restname : this.state.restname
        }
        console.log(data);
        axios.defaults.headers.common["Authorization"] = localStorage.getItem("token") ? localStorage.getItem("token") : "";
        axios.post(rooturl + '/getOwnerOrders', data)
        .then(response => {
            console.log("Response Status: " + response.status);
            if(response.status === 200){
                console.log(response.data);
                this.setState({
                    newOrders : response.data.responseMessage.newOrders,
                    otherOrders : response.data.responseMessage.otherOrders,
                    orderCheck : true
                })
                //console.log(this.state.menu);
            } else {
                this.setState({
                    orderCheck : false
                })
                console.log("No Items found");
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({
                orderCheck : false
            })
        })
    }

    updateStatus(e){
        e.preventDefault();
        var element;
        for (element in this.state){
            if(element == "restname" || element == "newOrders" || element == "otherOrders" || element == "orderCheck" || element == "orderStatus" || element == "updateStatus" || element == "showModal" || element == "modalCartid" || element == "messages" || element == "newMessage"){
                continue;
            } else {
                if(this.state[element] == "PREPARING" || this.state[element] == "READY" || this.state[element] == "DELIVERED" || this.state[element] == "CANCELLED"){
                    console.log(this.state[element])
                    const data = {
                        cartid : element,
                        orderstatus : this.state[element],
                        restname : this.state.restname
                    }
                    console.log(data);
                    axios.defaults.headers.common["Authorization"] = localStorage.getItem("token") ? localStorage.getItem("token") : "";
                    axios.post(rooturl + "/updateStatus", data)
                    .then(response => {
                        console.log("Response Status: " + response.status);
                        if(response.status === 200){
                            alert("Order Status Updated Successfully");
                            this.setState({
                                orderStatus : true
                            }) 
                        } else {
                            this.setState({
                                orderStatus : false
                            })
                            console.log("No Items found");
                        }
                        window.location.reload(false);
                    })
                } else {
                    alert("Only valid status are PREPARING, READY, DELIVERED, CANCELLED");
                }
            }
        }
    }

    sendMessages(e){
        e.preventDefault();
        const data = {
            cartid : this.state.modalCartid,
            username : this.state.restname,
            message : this.state.newMessage
        }
        console.log(data);

        axios.defaults.headers.common["Authorization"] = localStorage.getItem("token") ? localStorage.getItem("token") : "";
        axios.post(rooturl + '/addMessage', data)
        .then(response => {
            console.log("Response Status: " + response.status);
            if(response.status === 200){
                console.log(response.data);
                alert("Message Sent");
                this.setState({
                    newMessage : "",
                    showModal : false
                })
                //console.log(this.state.menu);
            } else {
                console.log("No Items found");
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({
                newMessage : ""
            })
        })

    }

    handleClose = () => {
        this.setState({
            showModal : false
        })
    };

    handleShow = (e) => {
        this.setState({
            showModal : true,
            modalCartid : e.target.value
        })
        const data = {
            cartid : e.target.value //this.state.modalCartid
        } 
        console.log(data.cartid);
        axios.defaults.headers.common["Authorization"] = localStorage.getItem("token") ? localStorage.getItem("token") : "";
        axios.post(rooturl + '/getMessage', data)
        .then(response => {
            console.log("Response Status: " + response.status);
            if(response.status === 200){
                console.log(response.data);
                var allMessages = response.data.responseMessage;
                this.setState({
                    messages : allMessages
                })
                //console.log(this.state.menu);
            } else {
                console.log("No Items found");
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({
                messages : ""
            })
        })
    };

    
    
    render(){
        let redirectVar = null;
        if(this.state.orderStatus){
            redirectVar = <Redirect to = '/OwnerDashboard'/>
        }

        if(this.state.orderCheck){
            var itemDetails = (items) => {
                var rows = items.map(itm => {
                    return (  
                        <ul key={itm.itemname}>{itm.itemname} - {itm.quantity} X ${itm.itemprice} = {itm.price}</ul> 
                    )
                })
                return rows;
            }
    
            var newOrderDetails = this.state.newOrders.map(result => {
                return(  
                    <div className="card" style={cardstyle}>
                    <div className="card-header bg-danger text-white">ID : {result.cartid}<br></br>Total : {result.totalprice}</div>
                    <div className="card-body">
                    <div>
                    
                    </div>
                        {result.username}<br></br>Status : {result.orderstatus}
                        <br></br>
                        Address : {result.address}
                    <div>
                    Items:<br></br>
                    {itemDetails(result.items)}
                    </div>
                    </div>
                    <div className="card-footer">
                    <input type="text" className="form-control" name={result.cartid} onChange = {this.changeHandler} placeholder="PREPARING, READY, DELIVERED" id={result.cartid}/>
                    <button value={result.cartid} onClick={this.updateStatus} className="btn btn-danger">Update Status</button> <br></br>  
                    
                    <button className="btn btn-danger" data-toggle="modal" data-target="#myModal" value={result.cartid} onClick={this.handleShow}>Message</button>
                    </div>
                    </div>
                    
                    
                );
            });
    
            var otherOrderDetails = this.state.otherOrders.map(result => {
                return(
                    
                    <div className="card" style={cardstyle}>
                    <div className="card-header bg-danger text-white">ID : {result.cartid}<br></br>Total : {result.totalprice}</div>
                    <div className="card-body">
                        {result.username}<br></br>Status : {result.orderstatus}
                        <br></br>
                        Address : {result.address}
                    <div>
                    Items:<br></br>
                    {itemDetails(result.items)}
                    </div>
                    </div>
                    </div>
                    
                );
            });

            
        }

        if(this.state.messages){
            //console.log(this.state.messages);
            var modalMessages = this.state.messages.map(message => {
                return(
                    <div>
                        <p><em>{message.author}</em> : {message.message}</p>
                    </div>
                )
            })
    
        }

        return(
            <div>
            <NavBarLogin />
            {redirectVar}
            <div className="vertical-nav bg-danger" id="sidebar">
            <p className="text-gray font-weight-bold text-uppercase px-3 small pb-4 mb-0">Dashboard</p>
            <ul className="nav flex-column bg-white mb-0">
                <li className="nav-item">
                    <a href="/OwnerProfile" class="nav-link text-dark font-italic bg-light">
                    <i className="fa fa-th-large mr-3 text-primary fa-fw"></i>Profile
                    </a>
                </li>
                <li class="nav-item">
                    <a href="/ViewMenu" className="nav-link text-dark font-italic bg-light">
                    <i className="fa fa-th-large mr-3 text-primary fa-fw"></i>Restaurant Menu
                    </a></li> 
                    <li className="nav-item">
                    <a href="/MenuUpdate" className="nav-link text-dark font-italic bg-light">
                    <i class="fa fa-th-large mr-3 text-primary fa-fw"></i>Update Menu
                    </a></li>
            </ul>
            </div>
            <div class="page-content p-5" id="content">
            
            <h4>Your Orders</h4>
                    <div class="panel-group" id="accordion">
                    <div class="card-deck">
            {/* <Draggable>
            
            <div class="card">
            <button class="btn btn-info">Order1</button>
                <div class="card-body">Content</div>
            </div>
            </Draggable> */}
            
            </div>
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h4 class="panel-title">
                                    <button class="btn btn-danger" data-toggle="collapse" data-parent="#accordion" data-target="#collapse1">Current Orders</button>
                                </h4>
                            </div>
                            <div id="collapse1" class="panel-collapse collapse in">
                            {newOrderDetails}
                            
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                <button className="btn btn-danger" data-toggle="collapse" data-parent="#accordion" data-target="#collapse2">Past Orders</button>
                                </h4>
                            </div>
                            <div id="collapse2" className="panel-collapse collapse">
                            {otherOrderDetails} 
                            {/* <table class="table table-hover">
                                <thead>
                                </thead>
                                       
                             </table> */}
                            </div>
                        </div>
                    </div>


            </div>

            <Modal show={this.state.showModal} onHide={this.handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Messages</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalMessages}
            <div>
            <textarea rows="2" cols="50" name="newMessage" onChange = {this.changeHandler} placeholder="Type Message"></textarea>
            <Button variant="primary btn-danger"  onClick={this.sendMessages}>Send Message</Button>
            </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary btn-info" onClick={this.handleClose}>Close</Button>
            
            </Modal.Footer>
            </Modal>

            </div>
        )
    }
}

export default OwnerDashboard;
