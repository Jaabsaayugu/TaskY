import {
  Grid,
  Typography,
  Box,
  Button,
  Divider,
  Stack,
  // Avatar,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import useUser from "../store/userStore";

const Header: React.FC = () => {
  const user = useUser((state) => state.user);

  // const getInitials = (firstName?: string, lastName?: string) => {
  //   if (!firstName || !lastName) return "U";
  //   return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  // };

  const navLinks = [
    { label: "Tasks", path: "/taskList" },
    { label: "New Task", path: "/newTask" },
    { label: "Completed Tasks", path: "/completedTasks" },
    { label: "Trash", path: "/trash" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1300, // above drawers
        backgroundColor: "#DDDFF0",
        boxShadow: 3,
      }}
    >
      <Grid
        container
        direction="row"
        bgcolor="#DDDFF0"
        alignItems="center"
        justifyContent="space-between"
        p={2}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <Typography
            variant="h2"
            component="h1"
            fontFamily="sans-serif"
            fontWeight={900}
            color="inherit"
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
        </Link>

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
                <Typography
                  variant="body1"
                  fontWeight={600}
                  color="secondary"
                  sx={{
                    "&:hover": {
                      color: "primary.main",
                      textDecoration: "underline",
                    },
                  }}
                >
                  {link.label}
                </Typography>
              </Link>
            ))}

            <Box
              bgcolor="white"
              p={1}
              borderRadius={4}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Typography variant="body1" fontWeight="600" color="secondary">
                Welcome back {user.firstName}
              </Typography>
              {/* <Avatar 
                sx={{ 
                  bgcolor: "primary.main",
                  width: 32,
                  height: 32,
                  fontSize: "0.875rem"
                }}
              >
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  getInitials(user?.firstName, user?.lastName)
                )}
              </Avatar> */}
            </Box>
          </Stack>
        ) : (
          <Box>
            <Button
              variant="outlined"
              sx={{ mr: 2 }}
              component={Link}
              to="/login?tab=login"
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/login?tab=signup"
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Grid>

      <Divider sx={{ border: 1, borderRadius: 2, color: "secondary" }} />
    </Box>
  );
};

export default Header;
