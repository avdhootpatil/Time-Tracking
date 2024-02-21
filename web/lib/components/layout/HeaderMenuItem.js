"use client";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeaderMenuItem({ route }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [isChildren, setIsChildren] = useState(false);

  const ROUTER = useRouter();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => (e) => {
    ROUTER.push(path);
    setAnchorEl(null);
  };

  function subMenu(menuItems) {
    return (
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {menuItems.map((menuItem) => (
          <MenuItem
            onClick={handleMenuItemClick(menuItem.path)}
            key={menuItem.id}
            sx={{
              padding: "10px 10px 10px 10px",
              fontWeight: "bold !important",
            }}
          >
            {menuItem.name}
          </MenuItem>
        ))}
      </Menu>
    );
  }

  return (
    <div key={route.id} sx={{ minWidth: 80 }}>
      {isChildren ? (
        <div>
          <div
            onMouseOver={handleClick}
            style={{ cursor: "pointer", color: "black" }}
          >
            {route.name}
          </div>
          {subMenu(route.children)}
        </div>
      ) : (
        <Link
          href={route.path}
          style={{ textDecoration: "none", fontWeight: "bold" }}
        >
          {route.name}
        </Link>
      )}
    </div>
  );
}
