"use client";
import { routes } from "@/lib/constants";
import { getUserFromLocalStorage } from "@/lib/helperFunctions";
import PunchClockIcon from "@mui/icons-material/PunchClock";
import { Box } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HeaderMenu from "../headerMenu";
import { tTheme } from "../theme";
import HeaderMenuItem from "./HeaderMenuItem";

const Header = () => {
  const [user, setUser] = useState(null);

  const ROUTER = useRouter();
  const PATH_NAME = usePathname();

  useEffect(() => {
    let user = getUserFromLocalStorage();
    if (user) {
      setUser(user);
    }
  }, [PATH_NAME]);

  const handleLogout = (e) => {
    localStorage.removeItem("user");
    setUser(null);
    ROUTER.push("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#fff",
        boxShadow: "0px 0px 0px 0px",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minWidth: "1300px",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", width: "8%" }}>
          <Typography
            noWrap
            component="div"
            sx={{
              color: `${tTheme.palette.orange}`,
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            <PunchClockIcon />
          </Typography>
        </Link>

        <Box
          sx={{
            display: { xs: "flex", sm: "flex", lg: "flex" },
            alignItems: "center",
            textAlign: "center",
            justifyContent: "space-around",
            width: "40%",
            marginRight: "5%",
          }}
        >
          {user
            ? routes.map((route) => (
                <HeaderMenuItem key={route.id} route={route} />
              ))
            : null}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "18%",
          }}
        >
          <Typography
            style={{
              paddingRight: "10px",
              color: `${tTheme.palette.orange}`,
              fontWeight: "bold",
            }}
          >
            {user ? `Welcome ${user?.email}` : ``}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <HeaderMenu user={user} onLogout={handleLogout} />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
