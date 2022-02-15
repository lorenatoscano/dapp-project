import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type DialogProps = {
  showDialog: boolean;
  handleCloseDialog: () => void;
};


const CreateListDialog = ({ showDialog, handleCloseDialog }: DialogProps) => {
  return (
    <Dialog open={showDialog} onClose={handleCloseDialog}>
      <DialogTitle>Subscribe</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={handleCloseDialog}>Subscribe</Button>
      </DialogActions>
    </Dialog>
  );

};

export { CreateListDialog };