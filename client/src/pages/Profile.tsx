import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Stack,
  Button,
  // Drawer,
  // CssBaseline,
  // List,
  // ListItem,
  // ListItemButton,
  // ListItemIcon,
  // ListItemText,
  // IconButton,
  // Toolbar,
  // AppBar,
  Divider,
} from "@mui/material";
// import {
//   // Inbox as InboxIcon,
//   Delete as DeleteIcon,
//   Add as AddIcon,
//   Logout as LogoutIcon,
//   // Assignment as TaskIcon,
//   AccountCircle,
//   Menu as MenuIcon,
// } from "@mui/icons-material";
import axios from "../api/axios";
import useUser from "../store/userStore";
import { useNavigate } from "react-router-dom";
import type { User } from "../types";
import Footer from "../components/footer";

interface Task {
  id: string;
  title: string;
  description: string;
  dateCreated: string;
  isCompleted: boolean;
}

const Profile: React.FC = () => {
  const { user, setUser, logoutUser } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  // const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    axios
      .get<Task[]>("/api/user/tasks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTasks(res.data);
        } else {
          console.error("Unexpected response:", res.data);
        }
      })
      .catch((err) => console.error("Failed to fetch user tasks", err));
  }, []);

  // const handleDrawerToggle = () => {
  //   setMobileOpen(!mobileOpen);
  // };

  // const drawer = (
  //   <div>
  //     <Toolbar />
  //     <Divider />
  //     <IconButton
  //       color="inherit"
  //       edge="start"
  //       onClick={handleDrawerToggle}
  //       sx={{ ml: 2, m: 4 }}
  //     >
  //       <MenuIcon />
  //       <Typography variant="h6" noWrap color="navy">
  //         Dashboard
  //       </Typography>
  //     </IconButton>

  //     <List>
  //       <ListItemButton onClick={() => navigate("/newTask")}>
  //         <ListItemIcon>
  //           <AddIcon />
  //         </ListItemIcon>
  //         <ListItemText primary="New Task" />
  //       </ListItemButton>
  //       <ListItemButton onClick={() => navigate("/trash")}>
  //         <ListItemIcon>
  //           <DeleteIcon />
  //         </ListItemIcon>
  //         <ListItemText primary="Trash" />
  //       </ListItemButton>
  //       <ListItemButton onClick={() => navigate("/profile")}>
  //         <ListItemIcon>
  //           <AccountCircle />
  //         </ListItemIcon>
  //         <ListItemText primary="Profile" />
  //       </ListItemButton>
  //       <ListItemButton
  //         onClick={() => {
  //           localStorage.removeItem("token");
  //           navigate("/login");
  //         }}
  //       >
  //         <ListItemIcon>
  //           <LogoutIcon />
  //         </ListItemIcon>
  //         <ListItemText primary="Logout" />
  //       </ListItemButton>
  //     </List>
  //   </div>
  // );

  const handleUserUpdate = async () => {
    try {
      const res = await axios.patch(
        "/api/user",
        { firstName, lastName, email, username },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setUser(res.data as User);
      alert("Profile updated");
    } catch {
      alert("Failed to update user info");
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      await axios.patch(
        "/api/user/password",
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      alert("Password updated");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      alert("Failed to update password");
    }
  };

  return (
    <Box sx={{ backgroundColor: "#fdfdfd", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md" sx={{ mb: 5 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Your Profile
        </Typography>
        <Divider sx={{ my: 2 }} />

        {/* === Task List === */}
        <Typography variant="h4" color="primary" gutterBottom>
          Your Tasks
        </Typography>
        {tasks.length === 0 ? (
          <Typography>You don’t have any tasks yet.</Typography>
        ) : (
          <Stack spacing={2} mb={4}>
            {tasks.map((task) => (
              <Paper key={task.id} sx={{ p: 2, bgcolor: "whitesmoke" }}>
                <Typography variant="h6">{task.title}</Typography>
                <Typography>{task.description}</Typography>
                <Typography variant="caption" color="secondary">
                  📅 {new Date(task.dateCreated).toLocaleDateString()} •{" "}
                  {task.isCompleted ? "✅ Completed" : "🕗 Pending"}
                </Typography>
              </Paper>
            ))}
          </Stack>
        )}

        <Divider sx={{ my: 4 }} />

        {/* === Update Info === */}
        <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h5" color="secondary" gutterBottom>
            Update Info
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handleUserUpdate} variant="contained">
              Save Changes
            </Button>
          </Stack>
        </Paper>

        <Divider sx={{ my: 4 }} />

        {/* === Change Password === */}
        <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h5" color="secondary" gutterBottom>
            Change Password
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button
              onClick={handlePasswordUpdate}
              variant="contained"
              color="secondary"
            >
              Update Password
            </Button>
          </Stack>
        </Paper>

        {/* === Logout === */}
        <Button
          sx={{ mt: 4 }}
          variant="contained"
          color="error"
          onClick={() => {
            logoutUser();
            navigate("/login");
          }}
        >
          Logout
        </Button>
      </Container>
      <Footer />
    </Box>
  );
};

export default Profile;
