import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';


const useStyles = makeStyles(theme => ({
    root: {
        marginTop: '100px',
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 4),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
}));

export default function Welcome(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <main>
                <div className={classes.heroContent}>
                    <Container maxWidth="md">
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom
                                    style={{marginBottom: '50px'}}>
                            Serverless Chat Application
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph style={{textAlign: 'center'}}>
                            This is a simple chat app built using Node, and deployed in serverless environment on AWS.<br/><br/>
                            Key features of the app :
                            <li>Secured Authentication using Auth0 and OAuth.</li>
                            <li>Supports sharing of images.</li>
                            <li>User friendly UI and UX</li>
                            <br />
                            To get started, Login and click on (+) icon to start a new chat.
                        </Typography>
                        <div className={classes.heroButtons}>
                            <Grid container spacing={2} justify="center">
                                <Grid item>
                                    <Button variant="contained" color="primary" onClick={()=>{props.auth.login()}}>
                                        Login
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                        <br/><br/>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph style={{textAlign: 'center'}}>
                            For more, do visit <Link target="_blank" href="https://github.com/pnshiralkar/serverless-chat-app">Github repo</Link>.
                        </Typography>
                    </Container>
                </div>

            </main>
        </div>
    );
}