import React, {useState} from 'react';
import {Route, Switch, useHistory, withRouter} from "react-router-dom";
import MenuAppBar from "./components/app-bar/app-bar.component";
import './App.css';
import Auth from "./auth";
import Home from "./components/home/home.component";

function App() {
    const history = useHistory();
    const [auth] = useState(new Auth(history))

    return (
        <div>
            <MenuAppBar title={"Serverless Chat App"} history={history} auth={auth}/>
            <Switch>
                <Route
                    path="/callback"
                    render={props => {
                        auth.handleAuthentication(props)
                        return <div/>
                    }}
                />
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </div>
    );
}

export default withRouter(App);