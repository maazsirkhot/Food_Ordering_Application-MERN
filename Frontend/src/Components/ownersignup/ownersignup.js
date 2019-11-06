import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import NavBar from "../navbar";
import './ownersignup.css'; 
import axios from 'axios';
import {rooturl} from '../../config';
import { signup, signin } from '../../Redux/Actions/loginAction';
import { connect } from 'react-redux';

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

class OwnerSignUp extends Component{
    constructor(props){
        super(props);
        this.state = {
            fname : "",
            lname : "",
            email : "",
            password : "",
            confirmpassword : "",
            mob : "",
            restname : "",
            restzip : "",
            cuisine : "",
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
        if (this.state.email == "" || this.state.password == "" || this.state.password != this.state.confirmpassword || this.state.fname == "" || this.state.mob == "" || this.state.restname == "" || this.state.restzip == "" || this.state.cuisine =="") {
            alert("Provide all valid inputs");
        } else {
            const data = {
                email : this.state.email,
                password : this.state.password,
                name : this.state.fname + " " + this.state.lname,
                mob : this.state.mob,
                restname : this.state.restname,
                restzip : this.state.restzip,
                cuisine : this.state.cuisine
            }
            axios.defaults.withCredentials = true;

            axios.post(rooturl + '/SignUpOwner', data)
            .then(response => {
                console.log("Response Status: " + response.status);
                if(response.status === 200){
                    console.log(response.status);
                    var signupdata = {
                        signupstatus : true,
                        signupmessage : "Sign Up Successful"
                    }
                    this.props.signup(signupdata);
                    this.setState({
                        logincheck : true
                    })
                    this.setState({
                        signupcheck : true
                    })
                } else {
                    var signupdata = {
                        signupstatus : false,
                        signupmessage : "Sign Up Unsuccessful"
                    }
                    this.props.signup(signupdata);
                    this.setState({
                        signupcheck : false
                    })
                    alert("Signup Failed. Please try again!");
                }
            })
            .catch(err => {
                console.log(err);
                alert("Signup Failed. Please try again!");
                var signupdata = {
                    signupstatus : false,
                    signupmessage : "Sign Up Unsuccessful"
                }
                this.props.signup(signupdata);
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
                <h5 class="card-title text-center">Owner Registration</h5>
                <form class="form-signin" onSubmit={this.onSubmit}>
                    <div class="form-label-group">
                    <input type="text" name="fname" id="fname" onChange={this.changeHandler} class="form-control" placeholder="First Name" required />
                    <label for="fname">First Name</label>
                    </div>
                    <div class="form-label-group">
                    <input type="text" name="lname" id="lname" onChange={this.changeHandler} class="form-control" placeholder="Last Name"/>
                    <label for="lname">Last Name</label>
                    </div>
                    <div class="form-label-group">
                    <input type="text" name="restname" id="restname" onChange={this.changeHandler} class="form-control" placeholder="Restaurant Name" required/>
                    <label for="restname">Restaurant Name</label>
                    </div>
                    <div class="form-label-group">
                    <input type="number" name="restzip" id="restzip" onChange={this.changeHandler} class="form-control" placeholder="Zip" required/>
                    <label for="restzip">Zip</label>
                    </div>
                    <div class="form-label-group">
                    <input type="text" name="cuisine" id="cuisine" onChange={this.changeHandler} class="form-control" placeholder="Cuisine" required/>
                    <label for="cuisine">Cuisine</label>
                    </div>
                    <div class="form-label-group">
                    <input type="tel" name="mob" id="mob" onChange={this.changeHandler} class="form-control" placeholder="Contact" required/>
                    <label for="mob">Contact</label>
                    </div>
                    <div class="form-label-group">
                    <input type="email" name="email" id="email" onChange={this.changeHandler} class="form-control" placeholder="Email address" required/>
                    <label for="email">Email address</label>
                    </div>
                    <hr/>
                    <div class="form-label-group">
                    <input type="password" name="password" id="password" onChange={this.changeHandler} class="form-control" placeholder="Password" required/>
                    <label for="password">Password</label>
                    </div>              
                    <div class="form-label-group">
                    <input type="password" name="confirmpassword" id="confirmpassword" onChange={this.changeHandler} class="form-control" placeholder="Password" required/>
                    <label for="confirmpassword">Confirm password</label>
                    </div>
                    <button class="btn btn-lg btn-danger btn-block text-uppercase" type="submit">SignUp</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(OwnerSignUp);
