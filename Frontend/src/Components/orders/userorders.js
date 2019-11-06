import React, {Component} from 'react';
import cookie, { setRawCookie } from 'react-cookies';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import NavBarLogin from "../navbarlogin";
import "../dashboard/userdashboard.css";
import axios from 'axios';
import {rooturl} from '../../config';
import { Modal, Button } from 'react-bootstrap';
import Draggable from 'react-draggable';


const cardstyle = {
    width: '300px',
    
} 

class UserOrders extends Component{
    constructor(props){
        super(props);
        this.state = {
            username : localStorage.getItem("cookieemail"),
            newOrders : "",
            otherOrders : "",
            orderCheck : "",
            showModal: false,
            messages : "",
            newMessage : ""
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.sendMessages = this.sendMessages.bind(this);
    }

    changeHandler = (e) => {
        this.setState({
                [e.target.name] : e.target.value
        })
        //console.log(this.state);
    }

    componentWillMount(){

        const data = {
            username : this.state.username
        }
        console.log(data);
        axios.defaults.headers.common["Authorization"] = localStorage.getItem("token") ? localStorage.getItem("token") : "";
        axios.post(rooturl + '/getUserOrders', data)
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

    sendMessages(e){
        e.preventDefault();
        const data = {
            cartid : this.state.modalCartid,
            username : this.state.username,
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

    
    render(){

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
                <Draggable bounds="body">
                <div className="card" style={cardstyle}>
                    <div className="card-header bg-danger text-white">ID : {result.cartid}<br></br>Total : {result.totalprice}</div>
                    <div className="card-body">
                    <div>
                    
                    </div>
                        {result.restname}<br></br>Status : {result.orderstatus}
                    <div>
                    Items:<br></br>
                    {itemDetails(result.items)}
                    </div>
                    </div>
                    <div className="card-footer">
                      
                    
                    <button className="btn btn-danger" data-toggle="modal" data-target="#myModal" value={result.cartid} onClick={this.handleShow}>Message</button>
                    </div>
                </div>
                </Draggable>
            );
        });

        var otherOrderDetails = this.state.otherOrders.map(result => {
            return(
                <Draggable bounds="body">
                <div className="card" style={cardstyle}>
                    <div className="card-header bg-danger text-white">ID : {result.cartid}<br></br>Total : {result.totalprice}</div>
                    <div className="card-body">
                        {result.restname}<br></br>Status : {result.orderstatus}
                    <div>
                    Items:<br></br>
                    {itemDetails(result.items)}
                    </div>
                    </div>
                </div>
                </Draggable>
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
                <div class="vertical-nav bg-danger" id="sidebar">
                    <p class="text-gray font-weight-bold text-uppercase px-3 small pb-4 mb-0">Dashboard</p>
                    <ul class="nav flex-column bg-white mb-0">
                        <li class="nav-item">
                            <a href="/UserProfile" class="nav-link text-dark font-italic bg-light">
                                <i class="fa fa-th-large mr-3 text-primary fa-fw"></i>Profile
                    </a></li>
                        <li class="nav-item">
                            <a href="/UserOrders" class="nav-link text-dark font-italic bg-light">
                                <i class="fa fa-th-large mr-3 text-primary fa-fw"></i>Orders
                    </a></li>
                    </ul>
                </div>
                <div class="page-content p-5" >
                    <h4>Your Orders</h4>
                    
                    <div class="panel-group" id="accordion">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h4 class="panel-title">
                                    <button class="btn btn-danger" data-toggle="collapse" data-parent="#accordion" data-target="#collapse1">Current Orders</button>
                                </h4>
                            </div>
                            <div id="collapse1" class="panel-collapse collapse in">
                            <div className="card-columns">
                            {newOrderDetails}
                            </div>
                            </div>
                        </div>
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h4 class="panel-title">
                                <button class="btn btn-danger" data-toggle="collapse" data-parent="#accordion" data-target="#collapse2">Past Orders</button>
                                </h4>
                            </div>
                            <div id="collapse2" class="panel-collapse collapse in">
                            <div className="card-columns">
                            {otherOrderDetails}
                            </div>
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

export default UserOrders;