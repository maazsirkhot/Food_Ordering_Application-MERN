import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import NavBar from "../navbar";
import './userlogin.css';
import { connect } from 'react-redux'; 
import axios from 'axios';
import {rooturl} from '../../config';

function mapStateToProps(state){
    return {
        userLoginData: state.userLoginData
    }
}

class UserLogin extends Component{
    constructor(props){
        super(props);
        this.state = {
            username : "",
            password : "",
            logincheck : "",
            errorMessage : ""
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    onSubmit(e){
        e.preventDefault();
        if (this.state.username == "" || this.state.password == "") {
            alert("Username and Password cannot be empty");
        }
        else {
            const data = {
                username : this.state.username,
                password : this.state.password
            }
            axios.defaults.withCredentials = true;

            axios.post(rooturl + '/loginUser', data)
            .then(response => {
                console.log("Response Status: " + response.status);
                if(response.status === 200){
                    localStorage.setItem('token', response.data.token);
                    console.log(response.data.responseMessage);
                    console.log(this.state.logincheck);
                    this.setState({
                        logincheck : true
                    })
                } else {
                    this.setState({
                        logincheck : false,
                    })
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    logincheck : false
                })
                alert("Login failed. Try again!");
            })
        }
        

    }

    render() {
        let redirectVar = null;
        if (this.state.logincheck == true || cookie.load("cookie")) {
            redirectVar = <Redirect to="/UserDashboard" />;
        }

        return (
            <div>
                {redirectVar}
                <div class="container">
                <div class="row">
                <div class="col-lg-10 col-xl-9 mx-auto">
                <div class="card card-signin flex-row my-5">
                
                <div class="card-body">
                <h5 class="card-title text-center">User Login</h5>
                <form class="form-signin">
                    
                    
                    <div class="form-label-group">
                    <input type="email" id="email" class="form-control"  onChange = {this.changeHandler} name="username" placeholder="Email address" required/>
                    <label for="email">Email address</label>
                    </div>
                    <hr/>
                    <div class="form-label-group">
                    <input type="password" id="password" class="form-control" onChange = {this.changeHandler} name="password" placeholder="Password" required/>
                    <label for="password">Password</label>
                    </div>              
                    
                    </form>
                
                <button class="btn btn-lg btn-danger text-uppercase" type="submit" onClick = {this.onSubmit}>Login</button>
                </div>
                </div> 
                </div>
                </div> 
                </div>
            </div>
        )
    }

}

export default connect(mapStateToProps)(UserLogin);
