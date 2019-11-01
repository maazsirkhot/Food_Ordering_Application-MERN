import React, { Component } from 'react';
import cookie from 'react-cookies';
import {Link} from 'react-router-dom';
import bootstrap from 'bootstrap';
import {Redirect} from 'react-router';

class NavBarLogin extends Component{
    constructor(props){
        super(props);
        this.state = {
            user : ""
        }
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount(){
        let username = cookie.load('cookiename');
        this.setState({
            user : username
        })
        //console.log("Cookie Name : " + this.state.user);
    }

    handleLogout = () => {
        cookie.remove('cookie', { path: '/' });
        cookie.remove('cookieemail', { path: '/' });
        cookie.remove('cookiename', { path: '/' });
        cookie.remove('cookierestname', { path: '/' });
        localStorage.clear();
    }

    render() {
        let redirectVar = null;
        let dashboard = null;
        if (!localStorage.getItem("token") || !cookie.load("cookie")) {
            localStorage.clear();
            redirectVar = <Redirect to="/" />;
        } else {
            if(cookie.load("cookie") == "ownercookie")
                dashboard = "/OwnerDashboard"
            else{
                dashboard = "/UserDashboard"
            }
        }

        
        return (    
            <div>
                {redirectVar}
                <nav class="navbar navbar-expand-sm bg-danger navbar-dark fixed-top">
                <div class="container-fluid">
                <Link to={dashboard}><button type="button" class="btn btn-danger">Home</button></Link>
                <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="nav navbar-nav ml-auto">
                    <li class="nav-item dropdown">
                    <a class="btn btn-danger" data-toggle="dropdown" href="#">Welcome, {this.state.user}</a>
                    
                    </li>
                    <li class="nav-item"><Link to="/" onClick = {this.handleLogout}><button class="btn btn-danger">Logout</button></Link></li>
                </ul>
                </div>
                </div>
	            </nav>
                <nav class="navbar navbar-expand-sm bg-danger navbar-dark fixed-bottom">
	            <div class="container">
                <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="navbar-nav ml-auto">
                <li class="nav-item"><button type="button" class="btn btn-danger" disabled>Thank you</button></li>
                </ul>
                </div>
	            </div>
	            </nav>
            </div>
        )
    }

}

export default NavBarLogin;