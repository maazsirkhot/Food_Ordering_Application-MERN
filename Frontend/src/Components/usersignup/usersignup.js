import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import NavBar from "../navbar";
import './usersignup.css'; 
import axios from 'axios';
import {rooturl} from '../../config';


class UserSignUp extends Component{
    constructor(props){
        super(props);
        this.state = {
            fname : "",
            lname : "",
            username : "",
            password : "",
            confirmpassword : "",
            signupcheck : ""
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
        } else if(this.state.password != this.state.confirmpassword){
            alert("Passwords do not match");
        } else {
            const data = {
                username : this.state.username,
                password : this.state.password,
                name : this.state.fname + " " + this.state.lname
            }
            axios.defaults.withCredentials = true;

            axios.post(rooturl + '/SignUpUser', data)
            .then(response => {
                console.log("Response Status: " + response.status);
                if(response.status === 200){
                    console.log(response.status);
                    this.setState({
                        signupcheck : true
                    })
                } else {
                    this.setState({
                        signupcheck : false
                    })
                    alert("Signup Failed. Please try again!");
                }
            })
            .catch(err => {
                console.log(err);
                alert("Signup Failed. Please try again!");
                this.setState({
                    signupcheck : false
                })
                
            })
        }
    }

    render() {
        let redirectVar = null;
        if(this.state.signupcheck){
            redirectVar = <Redirect to= "/"/>
        }

        return (
            <div>
            {redirectVar}
                <div class="container">
                <div class="row">
                <div class="col-lg-10 col-xl-9 mx-auto">
                <div class="card card-signin flex-row my-5">
                
                <div class="card-body">
                <h5 class="card-title text-center">User Registration</h5>
                <form class="form-signin">
                    <div class="form-label-group">
                    <input type="text" name="fname" onChange={this.changeHandler} class="form-control" placeholder="First Name" id="fname" required />
                    <label for="fname">First Name</label>
                    </div>
                    <div class="form-label-group">
                    <input type="text" name="lname" onChange={this.changeHandler} class="form-control" placeholder="Last Name" id="lname"/>
                    <label for="lname">Last Name</label>
                    </div>
                    <div class="form-label-group">
                    <input type="email" name="username" onChange = {this.changeHandler} class="form-control" placeholder="Email address" required/>
                    <label for="email">Email address</label>
                    </div>
                    <hr/>
                    <div class="form-label-group">
                    <input type="password" name="password" onChange = {this.changeHandler} class="form-control" placeholder="Password" required/>
                    <label for="password">Password</label>
                    </div>              
                    <div class="form-label-group">
                    <input type="password" name="confirmpassword" onChange = {this.changeHandler} class="form-control" placeholder=" Confirm Password"  id="confirmpassword" required/>
                    <label for="confirmpassword">Confirm password</label>
                    </div>
                    <button class="btn btn-lg btn-danger btn-block text-uppercase" type="submit" onClick={this.onSubmit}>SignUp</button>
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

export default UserSignUp;
