import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Header from "./Header";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { tTheme } from "../theme";
import PunchClockIcon from "@mui/icons-material/PunchClock";

function AppLayout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header />
      {/* <Drawer
        sx={{
          width: "200px",
          flexShrink: 0,
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "center",
            minWidth: "200px",
          }}
        >
          <Link href="/" style={{ textDecoration: "none", width: "100%" }}>
            <Typography
              noWrap
              component="div"
              sx={{
                color: `${tTheme.palette.orange}`,
                fontWeight: "bold",
                fontSize: "16px",
                width: "100px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <PunchClockIcon />
            </Typography>
          </Link>
        </Toolbar>
        <Divider />
        <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon></ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer> */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 7,
          minHeight: "100vh",
          paddingBottom: "7.5rem",
          position: "relative",
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          zoom: "90%",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default AppLayout;
