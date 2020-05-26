import React from "react";
import * as axios from "axios";
import {baseUrl, websocketUrl} from "../../config";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import {Avatar, MessageBox, MessageList, Navbar} from "react-chat-elements";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import {DropzoneDialogExample} from "./fileUpload.component";
import LoadingOverlay from 'react-loading-overlay';


export default class ChatGrid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            msgList: [],
            newMsg: "",
            loading: false
        }

        this.msgListElement = React.createRef();

        this.socket = new WebSocket(`${websocketUrl}?Authorization=Bearer ${props.auth.idToken}`)
        this.socket.onopen = (e) => {
            console.log('Socket Connected')
            console.log(e)
        }
        this.socket.onclose = () => {
            this.socket = new WebSocket(`${websocketUrl}?Authorization=Bearer ${props.auth.idToken}`)
        }
        this.socket.onmessage = (e) => {
            if (JSON.parse(e.data).item) {
                if (JSON.parse(e.data).item.from === this.props.currChat.username || JSON.parse(e.data).item.to === this.props.currChat.username) {
                    const msg = JSON.parse(e.data).item
                    let msgs = this.state.msgList
                    if (msg.type === 'photo') {
                        msgs.push({
                            position: (msg.from === this.props.auth.user.username ? 'right' : 'left'),
                            type: 'photo',
                            text: msg.message,
                            date: Date.parse(msg.createdAt),
                            data: {
                                uri: msg.photoUrl,
                                ...msg
                            }
                        })
                    } else {
                        msgs.push({
                            position: (msg.from === this.props.auth.user.username ? 'right' : 'left'),
                            type: 'text',
                            text: msg.message,
                            date: Date.parse(msg.createdAt),
                            data: msg
                        })
                    }
                    this.setState({msgList: msgs})
                    this.props.chatList[this.props.currChat.index].lastMsg = msg
                    this.props.chatList[this.props.currChat.index].subtitle = msg.message
                    this.props.chatList[this.props.currChat.index].date = Date.parse(msg.createdAt)
                    this.props.chatList[this.props.currChat.index].unread = 0
                    console.log(this.props.chatList)
                    this.props.setData(this.props.chatList)
                } else {
                    this.props.getChats();
                }
            }
            console.log(e)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.currChat !== '' && this.props.chatList[this.props.currChat.index].unread > 0) {
            this.props.chatList[this.props.currChat.index].unread = 0
            this.props.setData(this.props.chatList)
            this.socket.send(JSON.stringify({
                action: 'seenMsg',
                to: this.props.currChat.username
            }))
        }

        const f = async () => {
            if (this.props.currChat !== '' && this.props.currChat !== prevProps.currChat) {
                this.setState({loading: true})

                const res = await axios.get(baseUrl + `/chats/${this.props.currChat.username}`, {headers: {'Authorization': 'Bearer ' + this.props.auth.idToken}})
                let msgs = []
                for (let i in res.data) {
                    const msg = res.data[i];
                    if (msg.type === 'photo') {
                        msgs.push({
                            position: (msg.from === this.props.auth.user.username ? 'right' : 'left'),
                            type: 'photo',
                            text: msg.message,
                            date: Date.parse(msg.createdAt),
                            data: {
                                uri: msg.photoUrl,
                                ...msg
                            }
                        })
                    } else {
                        msgs.push({
                            position: (msg.from === this.props.auth.user.username ? 'right' : 'left'),
                            type: 'text',
                            text: msg.message,
                            date: Date.parse(msg.createdAt),
                            data: msg
                        })
                    }
                }
                this.setState({msgList: msgs})
                this.setState({loading: false})
            }
        }
        f();
        const node = this.msgListElement.current
        if (node)
            node.setState({scrollBottom: node.getBottom(node.mlistRef)}, node.checkScroll.bind(node));
    }

    handleSend = () => {
        this.sendMsg('text', this.state.newMsg)
    }

    sendMsg = (type, msg, path) => {
        this.setState({newMsg: ""})
        this.socket.send(JSON.stringify({
            action: 'sendMsg',
            type,
            to: this.props.currChat.username,
            msg,
            path
        }))
    }

    handleNewMsgChange = (e) => {
        this.setState({newMsg: e.target.value})
    }

    keyPress = (e) => {
        if (!e.shiftKey && e.key === "Enter") {
            this.handleSend();
            e.preventDefault()
        }
    }

    render() {
        if (this.props.currChat !== '') {
            return (
                <GridList direction={'column'} cellHeight={1} style={{height: '100%'}}>
                    <LoadingOverlay
                        active={this.state.loading}
                        spinner
                        className="loading"
                        text='Loading chats...'
                    >
                        <GridListTile rows={60} cols={2}>
                            <Navbar
                                left={
                                    <Avatar
                                        src={'https://ssl.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png'}
                                        alt={'logo'}
                                        size="large"
                                        type="circle"
                                        className={'chat-top-bar-avatar'}
                                    />
                                }
                                center={
                                    <Typography type={'h6'}>
                                        {this.props.currChat.name}
                                    </Typography>
                                }
                                right={
                                    <div/>
                                }/>
                        </GridListTile>
                        <GridListTile rows={721} cols={2}>
                            <MessageList
                                ref={this.msgListElement}
                                className='message-list'
                                lockable={true}
                                toBottomHeight={'100%'}
                                dataSource={this.state.msgList}
                                downButton/>
                        </GridListTile>
                        <GridListTile rows={55} cols={2} className={'send-msg-container'}>
                            <Grid container>
                                <Grid item xs={10}>
                                    <TextField
                                        id="outlined-full-width"
                                        placeholder="Start typing..."
                                        margin="normal"
                                        fullWidth
                                        multiline
                                        rowsMax={6}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        size={'medium'}
                                        className={'send-msg-text-input'}
                                        onChange={this.handleNewMsgChange}
                                        onKeyDown={this.keyPress}
                                        value={this.state.newMsg}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <IconButton style={{marginTop: 2, marginLeft: 5}} onClick={this.handleSend}>
                                        <SendIcon/>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={1}>
                                    <DropzoneDialogExample sendMsg={this.sendMsg} {...this.props}/>
                                </Grid>
                            </Grid>
                        </GridListTile>
                    </LoadingOverlay>
                </GridList>
        )
        } else {
            return (<div/>)
        }
    }
}
