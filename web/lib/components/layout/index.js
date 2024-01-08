import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Header from "./Header";

function AppLayout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          minHeight: "100vh",
          paddingBottom: "7.5rem",
          position: "relative",
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default AppLayout;
