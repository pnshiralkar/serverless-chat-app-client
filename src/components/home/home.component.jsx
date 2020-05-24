import React from 'react';
import Paper from "@material-ui/core/Paper";
import './home.css'
import 'react-chat-elements/dist/main.css';
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import {ChatList} from "react-chat-elements";
import Grid from "@material-ui/core/Grid";
import ChatGrid from "../chatGrid/chatGrid.component";
import * as axios from "axios";
import {baseUrl} from "../../config";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chatList: [],
            currChat: ''
        }
    }

    componentDidMount() {
        this.getChats();
    }

    getChats = async () => {
        if (this.props.auth.is_loggedIn) {
            const res = await axios.get(baseUrl + '/profile', {headers: {'Authorization': 'Bearer ' + this.props.auth.idToken}})
            localStorage.setItem('user', JSON.stringify(res.data[0]));
            let chats = [];
            if (res.data[0]) {
                let c = 0;
                for (let i in res.data[0].chats) {
                    const chat = res.data[0].chats[i]
                    chats.push({
                        title: chat.user.name,
                        subtitle: chat.lastMsg.message,
                        date: Date.parse(chat.lastMsg.createdAt),
                        unread: chat.unreadCount,
                        data: {username: i, index: c, ...(chat.user)}
                    })
                    c += 1;
                }
                this.setState({chatList: chats})
                console.log(chats)
            }
        }
    }

    handleChatClick = (e) => {
        this.setState({currChat: e.data})
    }

    setData = (data) => {
        this.setState({chatList: data})
    }

    render() {
        const {classes} = this.props
        return (<div>
            <CssBaseline/>
            <main>
                <div className={classes.appBarSpacer}/>
                <div className={classes.paperMarginTop}/>
                <Container>
                    <Paper className="home-paper" elevation={4}>
                        <Grid container>
                            <Grid item xs={4} style={{position: 'relative'}}>
                                <div style={{position: 'absolute', height: '85vh', width: '100%'}}>
                                    <Fab color="primary" aria-label="add" style={{float: 'right', bottom: '10px', position: 'absolute', right: '10px'}}>
                                        <AddIcon />
                                    </Fab>
                                </div>
                                <ChatList classname="chat-list" dataSource={this.state.chatList} onClick={this.handleChatClick}/>
                            </Grid>
                            <Grid item xs={8}>
                                {<ChatGrid currChat={this.state.currChat} chatList={this.state.chatList}
                                           setData={this.setData} getChats={this.getChats} {...this.props}/>}
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            </main>
        </div>)
    }
}