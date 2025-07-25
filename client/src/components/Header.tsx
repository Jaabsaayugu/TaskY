import {
  Grid,
  Typography,
  Box,
  Button,
  Divider,
  Stack,
  Avatar,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import useUser from "../store/userStore";

const Header: React.FC = () => {
  const user = useUser((state) => state.user);

  const navLinks = [
    { label: "Tasks", path: "/taskList" },
    { label: "New Task Blog", path: "/newTask" },
    { label: "Completed Tasks", path: "/completedTasks" },
    { label: "Trash", path: "/trash" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <header>
      <Grid
        container
        direction="row"
        bgcolor="#DDDFF0"
        alignItems="center"
        justifyContent="space-between"
        p={2}
      >
        <Typography
          variant="h2"
          component="h1"
          fontFamily="sans-serif"
          fontWeight={900}
        >
          📒Task
          <Typography
            variant="h2"
            component="span"
            fontFamily="sans-serif"
            fontWeight={900}
            color="warning.light"
          >
            Y
          </Typography>
        </Typography>

        {user ? (
          <Stack
            direction="row"
            spacing={3}
            alignItems="center"
            component="nav"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label + link.path}
                to={link.path}
                style={{ textDecoration: "none" }}
              >
                <Typography variant="body1" fontWeight={600} color="secondary">
                  {link.label}
                </Typography>
              </Link>
            ))}
            <Box bgcolor="white" p={1} borderRadius={4}>
              <Typography variant="body1" fontWeight="600" color="secondary">
                Welcome {user.firstName}
              </Typography>
              <Avatar sx={{ bgcolor: "indigo" }}>
                {(user?.firstName?.[0] || "J").toUpperCase()}
                {(user?.lastName?.[0] || "A").toUpperCase()}
              </Avatar>
            </Box>
          </Stack>
        ) : (
          <Box>
            <Button
              variant="outlined"
              sx={{ mr: 2 }}
              onClick={() => (window.location.href = "/login?tab=login")}
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => (window.location.href = "/login?tab=signup")}
            >
              Signup
            </Button>
            {/* <Button variant="text" onClick={() => setTab(0)}>
              Sign Up
            </Button> */}
          </Box>
        )}
      </Grid>

      <Divider sx={{ border: 1, borderRadius: 2, color: "secondary" }} />
    </header>
  );
};

export default Header;
