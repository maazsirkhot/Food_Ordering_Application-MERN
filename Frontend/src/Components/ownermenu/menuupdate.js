import React, {Component} from 'react';
import cookie, { setRawCookie } from 'react-cookies';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import NavBarLogin from "../navbarlogin";
import "../dashboard/userdashboard.css";
import axios from 'axios';
import {rooturl} from '../../config';

class MenuUpdate extends Component{
    constructor(props){
        super(props);
        this.state = {
            itemname : "",
            itemdescription : "",
            price : "",
            section : "",
            restname : "",
            updateStatus : "",
            deleteitemname : "",
            deletesection : ""
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onDeleteSection = this.onDeleteSection.bind(this);
    }

    componentWillMount(){
        let restname = localStorage.getItem("cookierestname");
        this.setState({
            restname : restname
        })
        console.log(this.state.restname);
    }
    changeHandler = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    onChange = (e) => {
        this.setState({
            [e.target.name] : e.target.files[0]
        });
    }

    onSubmit(e){
        e.preventDefault();
        if(this.state.itemname == "" || this.state.itemprice == "" || this.state.section == ""){
            alert("Please fill all fields");
        } else {
            const data = {
                itemname : this.state.itemname,
                itemdescription : this.state.itemdescription,
                itemprice : this.state.itemprice,
                section : this.state.section,
                restname : this.state.restname,
                itemstatus : "NEW",
                imglink : this.state.imglink
                
            }

            let profileData = new FormData();
            profileData.append("itemname", data.itemname);
            profileData.append("itemdescription", data.itemdescription);
            profileData.append("itemprice", data.itemprice);
            profileData.append("section", data.section);
            profileData.append("restname", data.restname);
            profileData.append("itemstatus", data.itemstatus);
            profileData.append("imglink", this.state.imglink);
            
            axios.defaults.headers.common["Authorization"] = localStorage.getItem("token") ? localStorage.getItem("token") : "";
            axios.post(rooturl + '/updateMenu', profileData)
            .then(response => {
                console.log("Response Status: " + response.status);
                if(response.status === 200){
                    this.setState({
                        updateStatus : true
                    })
                    alert("Item added Successfully");
                } else {
                    this.setState({
                        updateStatus : false
                    })
                    alert("Error Occurred. Try again!");
                }
            })
        }
        
    }

    onDelete(e){
        e.preventDefault();
        if(this.state.deleteitemname == ""){
            alert("Please provide a valid item");
        } else {
            const data = {
                restname : this.state.restname,
                itemname : this.state.deleteitemname,
                itemstatus : "DELETE"
            }
            console.log(this.state.restname)
            axios.defaults.headers.common["Authorization"] = localStorage.getItem("token") ? localStorage.getItem("token") : "";
            axios.post(rooturl + '/updateMenu', data)
            .then(response => {
                console.log("Response Status: " + response.status);
                if(response.status === 200){
                    this.setState({
                        updateStatus : true
                    })
                    alert("If item exists, it was deleted Successfully");
                } else {
                    this.setState({
                        updateStatus : false
                    })
                    alert("Error Occurred. Try again!");
                }
            })
        }
        
    }

    onDeleteSection(e){
        e.preventDefault();
        if(this.state.deletesection == ""){
            alert("Please provide a valid item");
        } else {
            const data = {
                restname : this.state.restname,
                section : this.state.deletesection,
                itemstatus : "DELETESECTION"
            }
            console.log(this.state.restname)
            axios.defaults.headers.common["Authorization"] = localStorage.getItem("token") ? localStorage.getItem("token") : "";
            axios.post(rooturl + '/updateMenu', data)
            .then(response => {
                console.log("Response Status: " + response.status);
                if(response.status === 200){
                    this.setState({
                        updateStatus : true
                    })
                    alert("If section exists, it was deleted Successfully");
                } else {
                    this.setState({
                        updateStatus : false
                    })
                    alert("Error Occurred. Try again!");
                }
            })
        }
        
    }


    
    render(){

    

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
                <form class="form-horizontal">
                <h3>Add Item</h3>
                <div class="form-group">
                    <div class="col-sm-10">
                        <input type="text" onChange = {this.changeHandler} class="form-control" id="itemname" placeholder="Item Name" name="itemname" required/>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-sm-10">
                        <input type="text" onChange = {this.changeHandler} class="form-control" id="itemdescription" placeholder="Item Description" name="itemdescription" required/>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-sm-10">
                        <input type="number" onChange = {this.changeHandler} class="form-control" id="itemprice" placeholder="Price" name="itemprice"  step="0.01" required/>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-sm-10">
                        <input type="text" onChange = {this.changeHandler} class="form-control" id="section" placeholder="Section" name="section" required/>
                    </div>
                </div>
                <div class="form-group">
                        <label>Item Image</label>
                        <div class="input-group">
                            <span class="input-group-btn">
                                <span class="btn btn-default btn-file">Upload Image<input type="file" id="imgInp" name="imglink" onChange = {this.onChange}/></span> 
                            </span>
                        </div>
                </div>
                <div class="col-sm-offset-2 col-sm-10">
                        <button type="submit" class="btn btn-danger" onClick={this.onSubmit}>Submit</button>
                        <button type="reset" class="btn btn-danger">Clear</button>
                    </div>
                </form>
                <form>
                <h3>Delete Item</h3>
                <div class="form-group">
                    <div class="col-sm-10">
                        <input type="text" onChange = {this.changeHandler} class="form-control" id="itemname" placeholder="Item Name" name="deleteitemname" required/>
                    </div>
                </div>
                <div class="col-sm-offset-2 col-sm-10">
                        <button type="submit" class="btn btn-danger" onClick={this.onDelete}>Delete Item</button>
                        <button type="reset" class="btn btn-danger">Clear</button>
                    </div>
                </form>
                <form>
                <h3>Delete Section</h3>
                <div class="form-group">
                    <div class="col-sm-10">
                        <input type="text" onChange = {this.changeHandler} class="form-control" id="itemname" placeholder="Section Name" name="deletesection" required/>
                    </div>
                </div>
                <div class="col-sm-offset-2 col-sm-10">
                        <button type="submit" class="btn btn-danger" onClick={this.onDeleteSection}>Delete Item</button>
                        <button type="reset" class="btn btn-danger">Clear</button>
                    </div>
                </form>

            </div>

            </div>
        )
    }
}

export default MenuUpdate;
