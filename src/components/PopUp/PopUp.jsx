import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

function MyPopup({text, setOpen, open, cb=()=>{}}) {
//   

  const handleClose = () => {
    setOpen(false);
    cb()
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
          <p>{text}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MyPopup;
