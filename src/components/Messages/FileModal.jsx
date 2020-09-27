import React, {useState} from 'react';
import mime from 'mime-types';
import { Modal, Button, Icon, Input } from 'semantic-ui-react';


const isImageFile = (file, fileType) => {
    return fileType.includes(mime.lookup(file.name));
}
const FileModal = ({modal, closeModal, getFile}) => {


    const [file, setFile] = useState(null);
    const fileType = ['image/jpeg', 'image/png'];

    const handleFileInput = e => {
        setFile(e.target.files[0]);
    }

    const sendFile = (e) => {
        e.preventDefault();
        if(file){
            if(isImageFile(file,fileType)){
                getFile(file);
                closeModal();
                setFile(null);
                
            }
        }
    }

    return (
        <Modal basic open={modal} onClose={closeModal}>
            <Modal.Header>Select an Image File</Modal.Header>
            <Modal.Content>
                <Input
                    fluid
                    label="File Types: jpg, png"
                    name="file"
                    type="file"
                    onChange={handleFileInput}
                />
            </Modal.Content>
            <Modal.Actions>
                <Button
                    color="green"
                    inverted
                    onClick={sendFile}
                >
                <Icon name="checkmark" /> Send
                </Button>

                <Button
                    color="red"
                    inverted
                    onClick={closeModal}
                >
                <Icon name="remove" /> Cancel
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

export default FileModal;