import { Box, Button, Fade, Paper, Popper, Typography } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

export default function DeletePopper({ open, onConfirm, onCancel, anchorEl }) {
  return (
    <Popper open={open} anchorEl={anchorEl} placement="bottom" transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper>
            <Box sx={{ p: 2 }}>
              <Typography>Are you sure you want to delete the Item?</Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "5px",
                }}
              >
                <Button
                  size="small"
                  sx={{ fontWeight: "bold" }}
                  onClick={onConfirm}
                >
                  Confirm
                </Button>
                <Button
                  size="small"
                  sx={{ fontWeight: "bold" }}
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
}
DeletePopper.defaultProps = {
  open: false,
  onConfirm: () => {},
  onCancel: () => {},
  anchorEl: null,
};

DeletePopper.propTypes = {
  open: PropTypes.bool,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  anchorEl: PropTypes.object,
};
