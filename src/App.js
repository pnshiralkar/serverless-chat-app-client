import React, {useState} from 'react';
import {Route, Switch, useHistory, withRouter} from "react-router-dom";
import MenuAppBar from "./components/app-bar/app-bar.component";
import './App.css';
import Auth from "./auth";
import Home from "./components/home/home.component";
import {makeStyles} from "@material-ui/core/styles";
import CreateProfile from "./components/profile/createprofile.component";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

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
                        return <AuthCallback classes={classes}/>
                    }}
                />
                <Route path={'/createProfile'}>
                    <CreateProfile auth={auth} history={history}/>
                </Route>
                <Route path="/">
                    <Home auth={auth} classes={classes}/>
                </Route>
            </Switch>
        </div>
    );
}

export default withRouter(App);


class AuthCallback extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <CssBaseline/>
                <main>
                    <div className={this.props.classes.appBarSpacer}/>
                    <div className={this.props.classes.paperMarginTop}/>
                    <Container className={'logging-in-wrapper'}>
                        <Typography variant={'h2'} style={{textAlign: 'center', marginBottom: '3vh'}}>
                            Logging In
                        </Typography>
                        <CircularProgress color="#d0d0d0"/>
                    </Container>
                </main>
            </div>
        )
    }
}