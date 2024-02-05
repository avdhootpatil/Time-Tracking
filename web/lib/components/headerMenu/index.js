"use client";
import { Avatar, Box, IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";

export default function HeaderMenu({ user = null, onLogout = () => {} }) {
  const ROUTER = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 0, marginLeft: "20px" }}>
      <IconButton sx={{ p: 0 }} onClick={handleClick} size="small">
        <Avatar sx={{ backgroundColor: "#EEEEC4", color: "black" }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {user ? (
          <MenuItem onClick={onLogout}>Logout</MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              ROUTER.push("/register");
            }}
          >
            Register
          </MenuItem>
        )}
        {user ? null : (
          <MenuItem
            onClick={() => {
              ROUTER.push("/login");
            }}
          >
            Login
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}
