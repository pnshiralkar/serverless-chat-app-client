import React, {useEffect} from 'react';
import Paper from "@material-ui/core/Paper";
import './home.css'
import 'react-chat-elements/dist/main.css';
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Avatar, ChatList, MessageList, Navbar} from "react-chat-elements";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import GridList from "@material-ui/core/GridList";
import GridListTile from '@material-ui/core/GridListTile';
import IconButton from "@material-ui/core/IconButton";
import SendIcon from '@material-ui/icons/Send';
import ChatGrid from "../chatGrid/chatGrid.component";
import * as axios from "axios";
import {websocketUrl} from "../../config";

const useStyles = makeStyles(theme => ({
    appBarSpacer: theme.mixins.toolbar,
    paperMarginTop: {
        marginTop: theme.spacing(4)
    }
}))

export default function Home(props) {
    const classes = useStyles();



    const handleChatClick = (e) => {
        setCurrChat(e.title);
    }

    //temporary
    let chats = [];

    if (props.auth.user) {
        for (let i in props.auth.user.chats) {
            chats.push({
                title: props.auth.user.chats[i],
            })
        }
    }

    const [chatList, setChatList] = React.useState(chats)
    const [currChat, setCurrChat] = React.useState('')

    useEffect(()=>{

    }, [currChat])

    return (<div>
        <CssBaseline/>
        <main>
            <div className={classes.appBarSpacer}/>
            <div className={classes.paperMarginTop}/>
            <Container>
                <Paper className="home-paper" elevation={4}>
                    <Grid container>
                        <Grid item xs={4}>
                            <ChatList classname="chat-list" dataSource={chatList} onClick={handleChatClick}/>
                        </Grid>
                        <Grid item xs={8}>
                            {<ChatGrid currChat={currChat} {...props}/>}
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </main>
    </div>)
}