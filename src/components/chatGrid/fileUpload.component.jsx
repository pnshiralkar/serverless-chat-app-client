import React, { Component } from 'react'
import {DropzoneDialog} from 'material-ui-dropzone'
import Button from '@material-ui/core/Button';
import * as axios from "axios";
import {baseUrl} from "../../config";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import IconButton from "@material-ui/core/IconButton";


export class DropzoneDialogExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            files: []
        };
    }

    handleClose() {
        this.setState({
            open: false
        });
    }

    async handleSave(files) {
        //Saving files to state for further use and closing Modal.
        this.setState({
            files: files,
        });
        console.log(files)
        const url = await axios.get(baseUrl + `/media_upload_url/${files[0].name}`, {headers: {'Authorization': 'Bearer ' + this.props.auth.idToken}})
        await axios.put(url.data.url, files[0])
        this.props.sendMsg('photo', 'Photo', url.data.path)
        this.setState({open: false})
    }

    handleOpen() {
        this.setState({
            open: true,
        });
    }

    render() {
        return (
            <div>
                <IconButton onClick={this.handleOpen.bind(this)}>
                    <AttachFileIcon />
                </IconButton>
                <DropzoneDialog
                    open={this.state.open}
                    onSave={this.handleSave.bind(this)}
                    acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                    showPreviews={true}
                    maxFileSize={5000000}
                    onClose={this.handleClose.bind(this)}
                    multiple={false}
                />
            </div>
        );
    }
}