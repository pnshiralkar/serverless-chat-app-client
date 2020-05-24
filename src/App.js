import React, {useState} from 'react';
import {Route, Switch, useHistory, withRouter} from "react-router-dom";
import MenuAppBar from "./components/app-bar/app-bar.component";
import './App.css';
import Auth from "./auth";
import Home from "./components/home/home.component";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    appBarSpacer: theme.mixins.toolbar,
    paperMarginTop: {
        marginTop: theme.spacing(4)
    }
}))

function App() {
    const history = useHistory();
    const [auth] = useState(new Auth(history))
    const classes = useStyles();

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
                    <Home auth={auth} classes={classes}/>
                </Route>
            </Switch>
        </div>
    );
}

export default withRouter(App);