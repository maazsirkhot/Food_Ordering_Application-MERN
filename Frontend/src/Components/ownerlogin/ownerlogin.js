import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import NavBar from "../navbar";
import './ownerlogin.css';
import { connect } from 'react-redux'; 
import axios from 'axios';
import {rooturl} from '../../config';
import { signup, signin } from '../../Redux/Actions/loginAction';

function mapStateToProps(state){
    return {
        userLoginData: state.userLoginData
    }
}

function mapDispatchToProps(dispatch) {
    return {
        signup: (signupdata) => dispatch(signup(signupdata)),
        signin: (signindata) => dispatch(signin(signindata))
    };
}

class OwnerLogin extends Component{
    constructor(props){
        super(props);
        this.state = {
            username : "",
            password : "",
            logincheck : ""
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
            

            axios.post(rooturl + '/loginOwner', data)
            .then(response => {
                console.log("Response Status: " + response.status);
                if(response.status === 200){
                    console.log("Response Status: " + response.data);
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('cookie', "ownercookie");
                    localStorage.setItem('cookieemail', response.data.responseMessage.email);
                    localStorage.setItem('cookiename', response.data.responseMessage.name);
                    localStorage.setItem('cookierestname', response.data.responseMessage.restname);
                    console.log(response.data.responseMessage);
                    console.log(response.data.token);

                    var signindata = {
                        signinstatus : true,
                        signinmessage : response.data.responseMessage.name + " signed in"
                    }
                    this.props.signin(signindata);
                    this.setState({
                        logincheck : true
                    })
                } else {
                    var signindata = {
                        signinstatus : false,
                        signinmessage : "Sign In Failed"
                    }
                    this.props.signin(signindata);
                    this.setState({
                        logincheck : false
                    })
                }
            })
            .catch(err => {
                console.log(err);
                var signindata = {
                    signinstatus : false,
                    signinmessage : "Sign In Failed"
                }
                this.props.signin(signindata);
                this.setState({
                    logincheck : false
                })
                console.log(this.state.logincheck);
                alert("Login Failed. Please try again!");
            })
        }
    }

    render() {
        let redirectVar = null;
        if (this.state.logincheck == true) {
            console.log("Checking Login")
            redirectVar = <Redirect to="/OwnerDashboard" />;
        } else {
            console.log("Check did not succeed")
        }

        return (
            <div>
                {redirectVar}
                <div class="container">
                <div class="row">
                <div class="col-lg-10 col-xl-9 mx-auto">
                <div class="card card-signin flex-row my-5">
                
                <div class="card-body">
                <h5 class="card-title text-center">Owner Login</h5>
                <form class="form-signin">
                    
                    
                    <div class="form-label-group">
                    <input type="email" name = "username" id="email" onChange = {this.changeHandler} class="form-control" placeholder="Email address" required/>
                    <label for="email">Email address</label>
                    </div>
                    <hr/>
                    <div class="form-label-group">
                    <input type="password" name = "password" id="password" onChange = {this.changeHandler} class="form-control" placeholder="Password" required/>
                    <label for="password">Password</label>
                    </div>              
                    
                    <button class="btn btn-lg btn-primary btn-block text-uppercase" onClick = {this.onSubmit} type="submit">Login</button>

                </form>
                </div>
                </div> 
                </div>
                </div> 
                </div>
            </div>
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(OwnerLogin);
