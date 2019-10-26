import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Home from './home/home';
import UserSignUp from "./usersignup/usersignup";
import OwnerSignUp from './ownersignup/ownersignup';
import UserLogin from './userlogin/userlogin';
import OwnerLogin from './ownerlogin/ownerlogin';
import UserProfile from './userprofile/userprofile';
import OwnerProfile from './ownerprofile/ownerprofile';
import UserDashboard from './dashboard/userdashboard';
import OwnerDashboard from './dashboard/ownerdashboard'
import ViewRestaurant from './dashboard/viewrestaurant';
import MenuUpdate from './ownermenu/menuupdate';
import ViewMenu from './ownermenu/viewmenu';
import UserOrders from './orders/userorders';
import OwnerOrders from './orders/ownerorders';
import cookie from 'react-cookies';

class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route exact path='/' component={Home} />
                
                <Route path="/UserSignUp" component={UserSignUp}/>
                <Route path="/OwnerSignUp" component={OwnerSignUp}/>
                <Route path="/UserLogin" component={UserLogin}/>
                <Route path="/OwnerLogin" component={OwnerLogin}/>
                <Route path="/UserProfile" component={UserProfile}/>
                <Route path="/OwnerProfile" component={OwnerProfile}/>
                <Route path="/UserDashboard" component={UserDashboard}/>
                <Route path="/OwnerDashboard" component={OwnerDashboard}/>
                <Route path="/ViewRestaurant" component={ViewRestaurant}/>
                <Route path="/ViewMenu" component={ViewMenu}/>
                <Route path="/MenuUpdate" component={MenuUpdate}/>
                <Route path="/UserOrders" component={UserOrders}/>
                <Route path="/OwnerOrders" component={OwnerOrders}/>
                
            </div>
        )
    }
}


//Export The Main Component
export default Main;