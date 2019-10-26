import React, { Component } from 'react';
import cookie from 'react-cookies';
import {Link, Redirect} from 'react-router-dom';
import bootstrap from 'bootstrap';


class NavBar extends Component{
    handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
    }
    constructor(props){
        super(props);
        this.state = {
            userLogin : "",
            userSignUp : "",
            ownerLogin : "",
            ownerSignUp : ""
        }
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler = (e) => {
        this.setState({
            [e.target.id] : true
        })
    }

    render() {


        return (
            <div>
                <nav class="navbar navbar-expand-sm bg-danger navbar-dark fixed-top">
	            <div class="container">
                <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="navbar-nav ml-auto">
                <li class="nav-item"><Link to="/UserLogin"><button type="button" class="btn btn-danger" id = "userLogin">Login</button></Link></li>
                <li class="nav-item"><Link to="/UserSignUp"><button type="button" class="btn btn-danger" id = "userSignUp">Signup</button></Link></li>
                </ul>
                </div>
	            </div>
	            </nav>
                <nav class="navbar navbar-expand-sm bg-danger navbar-dark fixed-bottom">
	            <div class="container">
                <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="navbar-nav ml-auto">
                <li class="nav-item"><Link to="/OwnerLogin"><button type="button" class="btn btn-danger" id = "ownerLogin">Owner Login</button></Link></li>
                <li class="nav-item"><Link to="/OwnerSignUp"><button type="button" class="btn btn-danger" id = "ownerSignUp">Owner Signup</button></Link></li>
                </ul>
                </div>
	            </div>
	            </nav>
            </div>
        )
    }

}

export default NavBar;