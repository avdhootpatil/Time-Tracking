import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import React from "react";

function DeleteConfirmDialog({
  open = false,
  onCancel = () => {},
  onConfirm = () => {},
  currentIndex = 0,
}) {
  return (
    <>
      <Dialog open={open} onClose={() => onCancel(false)}>
        <DialogContent>
          <DialogContentText id="dialog-description">
            Are you sure you want to delete the Item?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: " 0px 20px 20px 20px" }}>
          <Button
            variant="outlined"
            color="warning"
            onClick={onConfirm(currentIndex)}
            autoFocus
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onCancel(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DeleteConfirmDialog;
