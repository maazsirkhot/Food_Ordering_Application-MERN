import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import NavBarLogin from "../navbarlogin";
import "./userdashboard.css";
import axios from 'axios';
import {rooturl} from '../../config';

class ViewRestaurant extends Component {
    constructor(props){
        super(props);
        this.state = {
            restname : localStorage.getItem("restname"),
            menu : [],
            menuCheck : "",
            postStatus : "",
            totalprice : 0,
            orderplaced : ""
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.onsubmit = this.onsubmit.bind(this);
        this.placeorder = this.placeorder.bind(this);
    }

    componentWillMount(){
        //console.log(this.props.location.state.restname);
        let username = localStorage.getItem("cookieemail");
        this.setState({
            user : username
        })
        console.log(this.state.user);
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

    changeHandler = (e) => {
        this.setState({
                [e.target.name] : [e.target.name, e.target.value, e.target.id]
        })
        //console.log(this.state);
    }

    onsubmit(e){
        e.preventDefault();
        if(this.state.totalprice == 0){
            alert("Please select an item");
        }  else {
        console.log("Inside Cart Submit");
        //console.log(this.state);
        var carts = [];
        var element;
        for (element in this.state){
            if(element == "restname" || element == "menu" || element == "menuCheck" || element == "user" || element == "postStatus" || element == "totalprice" || element == "orderplaced"){
                continue;
            } else {
                var cartitem = {
                    username : this.state.user,
                    restname : this.state.restname,
                    itemname : element,
                    quantity : this.state[element][1],
                    itemprice : this.state[element][2],
                    totalprice : this.state.totalprice
                }
                carts.push(cartitem);
            }
        }

        carts = carts.filter(itm => {
            return itm.quantity != ""
        })

        console.log(carts);
        
        if(carts.length == 0){
            this.setState({
                totalprice : 0
            })
            alert("Please select an item");
        } else {
            const data = {
                data : carts
            }
            console.log(data);
            axios.defaults.headers.common["Authorization"] = localStorage.getItem("token") ? localStorage.getItem("token") : "";
            axios.post(rooturl + "/Orders", data)
            .then(response => {
                console.log("Response Status: " + response.status);
                if(response.status === 200){
                    //console.log("Cart ID: " + response.data.responseMessage.cartid);
                    localStorage.setItem('cartid', response.data.responseMessage.cartid);
                    alert("Order Placed Successfully");
                    this.setState({
                        postStatus : true,
                        totalprice : response.data.responseMessage.totalprice,
                        orderplaced : "true"
                    })
                    
                    //console.log(this.state.totalprice);
                    
                } else {
                    this.setState({
                        postStatus : false
                    })
                    console.log("No Items found");
                }
            })
        }
        
    }

    }

    placeorder(e){
            var total = 0;
            var element;
            for (element in this.state){
                if(element == "restname" || element == "menu" || element == "menuCheck" || element == "user" || element == "postStatus" || element == "totalprice" || element == "orderplaced"){
                    continue;
                } else {
                    var quantity = this.state[element][1];
                    var itemprice = this.state[element][2];
                    var price = quantity * itemprice;
                    total = total + price;
                }
            }
            this.setState({
                totalprice : total
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
                    <td><input type="number" className="form-control" name={itm.itemname} onChange = {this.changeHandler} placeholder="Quantity" id={itm.itemprice} min="0"/></td>
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

        let redirectVar = null;
        if (this.state.orderplaced == "true" && localStorage.getItem("cartid")) {
            redirectVar = <Redirect to="/UserOrders" />;
        }


        return (
            <div>
            
                <NavBarLogin />
                {redirectVar}
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
                <div class="page-content p-5" id="content">
                <h3>{this.state.restname}</h3>
                
                <table class="table table-hover">
                    <thead>
                    </thead>
                    {menuDetails}        
                </table>
                
                <button type = "submit"  onClick = {this.placeorder} class="btn btn-danger">Calculate Total</button>
                <h3>Order Total : {this.state.totalprice}</h3>
                <button type = "submit"  onClick = {this.onsubmit} class="btn btn-danger">Place Order</button>  
                </div>


            </div>
        )
    }
}

export default ViewRestaurant;