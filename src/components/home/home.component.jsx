import React from 'react';
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

const useStyles = makeStyles(theme => ({
    appBarSpacer: theme.mixins.toolbar,
    paperMarginTop: {
        marginTop: theme.spacing(4)
    }
}))

export default function Home(props) {
    const classes = useStyles();

    //temporary

    let chats = [
        {
            avatar: 'https://media-exp1.licdn.com/dms/image/C5103AQFmxCmPv31DcQ/profile-displayphoto-shrink_200_200/0?e=1595462400&v=beta&t=IAcP_KB6QMn38M3hv0CVCDOZBGKQVpn5SlicrYal9Ik',
            alt: 'Reactjs',
            title: 'Facebook',
            subtitle: 'What are you doing?',
            date: new Date(),
            unread: 2,
        },
    ]
    for (let i = 0; i < 1; i++) {
        chats.push(chats[0])
    }
    let msgs = [
        {
            position: 'right',
            type: 'text',
            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
            date: new Date(),
            notch: true
        },
        {
            position: 'left',
            type: 'text',
            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
            date: new Date(),
        },
    ]
    for (let i = 0; i < 23; i++) {
        msgs.push(msgs[(i % 2)])
    }

    const [chatList, setChatList] = React.useState(chats)
    const [msgList, setMsgList] = React.useState(msgs)
    return (<div>
        <CssBaseline/>
        <main>
            <div className={classes.appBarSpacer}/>
            <div className={classes.paperMarginTop}/>
            <Container>
                <Paper className="home-paper" elevation={4}>
                    <Grid container>
                        <Grid item xs={4}>
                            <ChatList classname="chat-list" dataSource={chatList}/>
                        </Grid>
                        <Grid item xs={8}>
                            <GridList direction={'column'} cellHeight={1}>
                                <GridListTile rows={60} cols={2}>
                                    <Navbar
                                        left={
                                            <Avatar
                                                src={'https://media-exp1.licdn.com/dms/image/C5103AQFmxCmPv31DcQ/profile-displayphoto-shrink_200_200/0?e=1595462400&v=beta&t=IAcP_KB6QMn38M3hv0CVCDOZBGKQVpn5SlicrYal9Ik'}
                                                alt={'logo'}
                                                size="large"
                                                type="circle"
                                                className={'chat-top-bar-avatar'}
                                            />
                                        }
                                        center={
                                            <Typography type={'h6'}>
                                                Prathamesh Shiralkar
                                            </Typography>
                                        }
                                        right={
                                            <div/>
                                        }/>
                                </GridListTile>
                                <GridListTile rows={721} cols={2}>
                                    <MessageList
                                        className='message-list'
                                        lockable={true}
                                        toBottomHeight={'101%'}
                                        dataSource={msgList}
                                        downButton/>
                                </GridListTile>
                                <GridListTile rows={55} cols={2} className={'send-msg-container'}>
                                    <Grid container>
                                        <Grid item xs={11}>
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
                                            />
                                        </Grid>
                                        <Grid item xs={1}>
                                            <IconButton style={{marginTop: 2, marginLeft: 5}}>
                                                <SendIcon/>
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </GridListTile>
                            </GridList>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </main>
    </div>)
}