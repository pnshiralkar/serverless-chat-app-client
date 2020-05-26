import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import {FormGroup, Paper, TextField} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import Fab from "@material-ui/core/Fab";
import {baseUrl} from "../../config";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(3, 5, 4),
        width: '35%',
    },
    closeBtn: {
        float: 'right',
        padding: '0'
    }
}));

export default function NewChatModal(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [username, setUserName] = React.useState('');
    const [msg, setMsg] = React.useState(0);
    const [errors, setError] = React.useState();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
    };

    const handleMessageChange = (e) => {
        setMsg(e.target.value);
    };

    const handleSubmit = async () => {
        setError('')
        try {
            const res = await axios.post(`${baseUrl}/message`, {
                to: username,
                msg: msg
            }, {headers: {'Authorization': 'Bearer ' + props.auth.idToken}})
            props.getChats();
            setOpen(false)
        } catch (e) {
            console.log(e)
            setError('Invalid username!')
        }
    };

    return (
        <div>
            <Fab color="primary" onClick={handleOpen} aria-label="add"
                 style={{float: 'right', bottom: '10px', position: 'absolute', right: '10px'}}>
                <AddIcon/>
            </Fab>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Paper className={classes.paper}>
                        <IconButton className={classes.closeBtn} onClick={handleClose}>
                            <CloseIcon/>
                        </IconButton>
                        <h1 id="transition-modal-title" style={{textAlign: 'center'}}>New Chat</h1>
                        <FormGroup style={{alignItems: 'center'}}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="Username"
                                name="username"
                                onChange={handleUserNameChange}
                            />
                            <br/>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="Message"
                                name="message"
                                onChange={handleMessageChange}
                            />
                            <Typography style={{color: 'red'}}>
                                {errors}
                            </Typography><br/><br/>
                            <Button variant="contained" style={{width: '50%'}} color="primary" onClick={handleSubmit}>
                                Send Message
                            </Button>
                        </FormGroup>
                    </Paper>
                </Fade>
            </Modal>
        </div>
    );
}