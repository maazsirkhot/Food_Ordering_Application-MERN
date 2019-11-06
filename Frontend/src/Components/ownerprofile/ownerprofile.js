import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Link, Redirect} from 'react-router-dom';
import NavBarLogin from "../navbarlogin";
import "./ownerprofile.css";
import axios from 'axios';
import {rooturl} from '../../config';
import { profileupdate } from '../../Redux/Actions/profileAction';
import { connect } from 'react-redux';


function mapStateToProps(state){
    return {
        profileData: state.profileData
    }
}

function mapDispatchToProps(dispatch) {
    return {
        profileupdate : (profiledata) => dispatch(profileupdate(profiledata))
    };
}

class OwnerProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            name : "",
            mob : "",
            email : "",
            restname : "",
            restzip : "",
            cuisine : "",
            updateStatus : ""
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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

    componentWillMount(){
        if(localStorage.getItem("cookieemail")){
            var username = localStorage.getItem("cookieemail");
            this.setState({
                email : username
            })
            console.log("Checking Email : " + this.state.email);
            const data = {
                email : username
            }
            axios.defaults.headers.common["Authorization"] = localStorage.getItem("token") ? localStorage.getItem("token") : "";
            axios.post(rooturl + '/GetOwnerProfile', data)
            .then(response => {
                console.log("Response Status: " + response.status);
                if(response.status === 200){
                    //console.log(response.data)

                    var profileData = {
                        profileupdate : false,
                        getprofile : true
                    }
                    this.props.profileupdate(profileData);

                    this.setState({
                        name : response.data.responseMessage.name,
                        mob : response.data.responseMessage.mob,
                        restname : response.data.responseMessage.restname,
                        restzip : response.data.responseMessage.restzip,
                        cuisine : response.data.responseMessage.cuisine,
                        imglink : rooturl + '/uploads/' + response.data.responseMessage.restimg
                    })
                    console.log(this.state);

                } else {
                    console.log("Error Response");
                    var profileData = {
                        profileupdate : false,
                        getprofile : false
                    }
                    this.props.profileupdate(profileData);
                }
            })
        }
    }

    onSubmit(e){
        e.preventDefault();
            console.log("Updating Profile");

            const data = {
                name : this.state.name,
                mob : this.state.mob,
                restzip : this.state.restzip,
                cuisine : this.state.cuisine,
                email : this.state.email,
                imglink : this.state.imglink
            }

            let profileData = new FormData();
            profileData.append("name", data.name);
            profileData.append("mob", data.mob);
            profileData.append("restzip", data.restzip);
            profileData.append("cuisine", data.cuisine);
            profileData.append("email", data.email);
            profileData.append("imglink", this.state.imglink);

            axios.post(rooturl + '/OwnerProfile', profileData)
            .then(response => {
                console.log("Response Status: " + response.status);
                if(response.status === 200){
                    console.log(response.data.responseMessage)
                    var profileData = {
                        profileupdate : true,
                        getprofile : true
                    }
                    this.props.profileupdate(profileData);
                    this.setState({
                        updateStatus : true
                    })
                    alert("Profile Updated Successfully");

                } else {
                    var profileData = {
                        profileupdate : false,
                        getprofile : true
                    }
                    this.props.profileupdate(profileData);
                    console.log("Error Response");
                }
            })

    }



    render() {

        return (
            <div>
                <NavBarLogin />
                <div>
                <div class="container">
                <img src={this.state.imglink} style={{ height: 250, width: 200 }} alt="Profile Picture"/>
                <h2 >Owner Profile</h2>
                <form class="form-horizontal">
                    <div class="form-group">
                    <label class="control-label col-sm-2" for="Email">Email:</label>
                    <div class="col-sm-10">
                        <input type="text" onChange = {this.changeHandler} value={this.state.email} class="form-control" id="email" placeholder="Email" name="email" disabled/>
                    </div>
                    </div>

                    <div class="form-group">
                    <label class="control-label col-sm-2" for="fname">Name:</label>
                    <div class="col-sm-10">
                        <input type="text" onChange = {this.changeHandler} value={this.state.name} class="form-control" id="name" placeholder="First Name" name="name"/>
                    </div>
                    </div>
                    
                    <div class="form-group">
                    <label class="control-label col-sm-2" for="ownermob">Contact:</label>
                    <div class="col-sm-10">
                        <input type="number" onChange = {this.changeHandler} value={this.state.mob} class="form-control" id="mob" placeholder="Contact" name="mob"/>
                    </div>
                    </div>
                    <div class="form-group">
                    <label class="control-label col-sm-2" for="restname">Restaurant Name:</label>
                    <div class="col-sm-10">
                        <input type="text" onChange = {this.changeHandler} value={this.state.restname} class="form-control" id="restname" placeholder="Restaurant Name" name="restname" disabled/>
                    </div>
                    </div>
                    <div class="form-group">
                    <label class="control-label col-sm-2" for="restzip">Restaurant Zip:</label>
                    <div class="col-sm-10">
                        <input type="text" onChange = {this.changeHandler} value={this.state.restzip} class="form-control" id="restzip" placeholder="Restaurant Zip" name="restzip"/>
                    </div>
                    </div>
                    <div class="form-group">
                    <label class="control-label col-sm-2" for="cuisine">Cuisine:</label>
                    <div class="col-sm-10">
                        <input type="text" onChange = {this.changeHandler} value={this.state.cuisine} class="form-control" id="cuisine" placeholder="cuisine" name="cuisine"/>
                    </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Restaurant Image</label>
                        <div class="input-group">
                            <span class="input-group-btn">
                                <span class="btn btn-default btn-file">Upload Image<input type="file" id="imgInp" name="imglink" onChange = {this.onChange}/></span> 
                            </span>
                        </div>
                    </div>
                    <div class="form-group">        
                    <div class="col-sm-offset-2 col-sm-10">
                        <button type="submit" class="btn btn-danger" onClick={this.onSubmit}>Submit</button>
                        <Link to="/OwnerDashboard"><button type="submit" class="btn btn-danger">Cancel</button></Link>
                    </div>
                    </div>
                </form>
                </div>
                </div>
            </div>
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(OwnerProfile);