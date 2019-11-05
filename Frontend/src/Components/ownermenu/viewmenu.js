import React, {Component} from 'react';
import cookie, { setRawCookie } from 'react-cookies';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import NavBarLogin from "../navbarlogin";
import "../dashboard/userdashboard.css";
import axios from 'axios';
import {rooturl} from '../../config';

class ViewMenu extends Component{
    constructor(props){
        super(props);
        this.state = {
            restname : localStorage.getItem("cookierestname"),
            menu : [],
            menuCheck : ""
        }
    }

    componentWillMount(){
        // let restname = cookie.load('cookierestname');
        // console.log(cookie.load('cookierestname'));
        // this.setState({
        //     restname : restname
        // })
        console.log(this.state.restname);
        const data = {
            restname : this.state.restname
        }
        console.log(data);
        axios.defaults.headers.common["Authorization"] = localStorage.getItem("token") ? localStorage.getItem("token") : "";
        axios.post(rooturl + '/GetMenu', data)
        .then(response => {
            console.log("Response Status: " + response.status);
            if(response.status === 200){
                console.log(response.data);
                this.setState({
                    menu : response.data,
                    menuCheck : true
                })
                //console.log(this.state.menu);
            } else {
                this.setState({
                    menuCheck : false
                })
                console.log("No Items found");
            }
        })
    }

    defaultSrc = (e) => {
        e.target.src = rooturl + '/uploads/download.png';
    }

    render(){

        var itemDetails = (items) => {
            var rows = items.map(itm => {
                return (
                    <tr key={itm.itemname}>
                    <td><img src={rooturl + '/uploads/' + itm.imglink} style={{ height: 50, width: 50 }} onError={this.defaultSrc}/></td>
                    <td>{itm.itemname}</td>
                    <td>{itm.itemdescription}</td>
                    <td>{itm.itemprice}</td>
                    </tr>
                )
            })
            return rows;
        }

        var menuDetails = this.state.menu.map(result => {
            return(
                <tbody key={result.section}>
                <tr><th>{result.section}</th></tr>
                {itemDetails(result.items)}
                </tbody>
            );
        });


        return(
            <div>
                <NavBarLogin />
                <div class="vertical-nav bg-danger" id="sidebar">
                <p class="text-gray font-weight-bold text-uppercase px-3 small pb-4 mb-0">Dashboard</p>
                <ul class="nav flex-column bg-white mb-0">
                <li class="nav-item">
                    <a href="/OwnerProfile" class="nav-link text-dark font-italic bg-light">
                    <i class="fa fa-th-large mr-3 text-primary fa-fw"></i>Profile
                    </a>
                </li>
                <li class="nav-item">
                    <a href="/ViewMenu" class="nav-link text-dark font-italic bg-light">
                    <i class="fa fa-th-large mr-3 text-primary fa-fw"></i>Restaurant Menu
                    </a></li> 
                    <li class="nav-item">
                    <a href="/MenuUpdate" class="nav-link text-dark font-italic bg-light">
                    <i class="fa fa-th-large mr-3 text-primary fa-fw"></i>Update Menu
                    </a></li>
                </ul>
                </div>

                <div class="page-content p-5" id="content">
                <h3>{this.state.restname}</h3>

                <table class="table table-hover">
                    <thead>
                    </thead>
                    {menuDetails}        
                </table>

                </div>
            </div>
        )
    }
}

export default ViewMenu;