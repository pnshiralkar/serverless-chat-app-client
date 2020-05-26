import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import FormHelperText from "@material-ui/core/FormHelperText";
import axios from 'axios'
import * as qs from "qs";
import {reactLocalStorage} from 'reactjs-localstorage'
import {AccountCircle} from "@material-ui/icons";
import {baseUrl} from "../../config";

const useStyles = makeStyles(theme => ({
    paper: {
        position: 'relative',
        top: '40vh',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            name: "",
            validUsername: true,
            validName: true,
            errors: ""
        }
    }


    nameChange = (e) => {
        this.setState({name: e.target.value});
        if (!(e.target.value.toString().length >= 8))
            this.setState({validName: false});
        else
            this.setState({validName: true})
    };


    usernameChange = (e) => {
        this.setState({username: e.target.value});
        if (!(e.target.value.toString().length >= 5))
            this.setState({validUsername: false});
        else
            this.setState({validUsername: true})
    };

    submit = (e) => {
        e.preventDefault();
        // Username
        if (!(this.state.username.toString().length >= 5))
            this.setState({validUsername: false});
        else
            this.setState({validUsername: true});

        // Pwd
        if (!(this.state.name.toString().length >= 8))
            this.setState({validName: false});
        else
            this.setState({validName: true});

        if (this.state.validUsername && this.state.validName) {
            let data = {
                username: this.state.username,
                name: this.state.name
            };
            const config = {
                headers: {'Authorization': 'Bearer ' + this.props.auth.idToken}
            };
            axios.post(baseUrl + '/profile', data, config).then(res => {
                this.setState({errors: ""});
                this.props.history.replace('/')
            }).catch(error => {
                if (!error.response) {
                    // network error
                    console.log('Error: Network Error\n' + error);
                } else {
                    let res = error.response.data;
                    let errors = "";
                    for (let i in res)
                        errors += res[i] + "\n";
                    this.setState({errors});
                }
            })
        }
    };

    render() {
        return (
            <div>
                <form className={this.props.classes.form}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                error={!this.state.validUsername}
                                variant="outlined"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                onChange={this.usernameChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={!this.state.validName}
                                variant="outlined"
                                required
                                fullWidth
                                name="name"
                                label="Name"
                                type="text"
                                id="name"
                                onChange={this.nameChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormHelperText error>
                                {this.state.errors}
                            </FormHelperText>
                        </Grid>
                    </Grid>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={this.props.classes.submit}
                        onClick={this.submit}
                    >
                        Create
                    </Button>
                </form>
            </div>
        )
    }
}

export default function CreateProfile(props) {
    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <AccountCircle/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Create Profile
                </Typography>
                <Form classes={classes} {...props}/>
            </div>
        </Container>
    );
}