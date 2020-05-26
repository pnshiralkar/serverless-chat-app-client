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
import NewChatModal from "./newChat";
import GridList from "@material-ui/core/GridList";
import LoadingOverlay from "react-loading-overlay";
import Welcome from "./welcome.component";

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chatList: [],
            currChat: '',
            sendMsg: null,
            loading: false
        }
    }


    componentDidMount() {
        this.getChats();
    }

    getChats = async () => {
        if (this.props.auth.is_loggedIn) {
            this.setState({loading: true})
            try {
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
            } catch (e) {
                if (e.response && e.response.status === 403)
                    this.props.auth.login();
            }
            finally {
                this.setState({loading: false})
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
                    {this.props.auth.is_loggedIn &&
                    <LoadingOverlay
                        active={this.state.loading}
                        spinner
                        className="loading"
                        text='Fetching your chats...'
                    >
                    <Paper className="home-paper" elevation={4} style={{background: '#fff'}}>
                        <Grid container style={{height: '100%'}}>
                            <Grid item xs={4} style={{position: 'relative'}}>
                                <div style={{position: 'absolute', height: '85vh', width: '100%'}}>
                                    {!this.state.loading && <NewChatModal auth={this.props.auth} getChats={this.getChats}/>}
                                </div>
                                <ChatList classname="chat-list" dataSource={this.state.chatList}
                                          onClick={this.handleChatClick}/>
                            </Grid>
                            <Grid item xs={8} style={{height: '100%'}}>
                                {<ChatGrid currChat={this.state.currChat} chatList={this.state.chatList}
                                           setData={this.setData} getChats={this.getChats} {...this.props}  style={{height: '100%'}}/>}
                            </Grid>
                        </Grid>
                    </Paper>
                    </LoadingOverlay>
                    }
                    {!this.props.auth.is_loggedIn &&
                    <Welcome auth={this.props.auth}/>
                    }
                </Container>
            </main>
        </div>)
    }
}