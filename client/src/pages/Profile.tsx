import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Stack,
  Avatar,
  Button,
  Divider,
} from "@mui/material";
import { PhotoCamera, Logout } from "@mui/icons-material";

import axios from "../api/axios";
import useUser from "../store/userStore";
import { useNavigate } from "react-router-dom";
import type { User } from "../types";
import Footer from "../components/footer";
import { getUserInitials } from "../components/lib/auth";

interface Task {
  id: string;
  title: string;
  description: string;
  dateCreated: string;
  isCompleted: boolean;
}

type MinimalUser = Pick<
  User,
  "firstName" | "lastName" | "username" | "email" | "avatar"
>;

const Profile: React.FC = () => {
  const { user, setUser, logoutUser } = useUser() as {
    user: MinimalUser | null;
    setUser: (user: MinimalUser | null) => void;
    logoutUser: () => void;
  };

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axios.patch("/api/user/avatar", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data as User);
      alert("Avatar updated");
    } catch {
      alert("Failed to upload avatar");
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
          {firstName}'s Profile
        </Typography>
        <Divider sx={{ my: 2 }} />

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

        <Paper
          elevation={4}
          sx={{ p: 3, borderRadius: 3, backgroundColor: "antiquewhite" }}
        >
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

        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            textAlign: "center",
            backgroundColor: "antiquewhite",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Profile Picture
          </Typography>

          <Avatar
            src={user?.avatar}
            sx={{
              width: 120,
              height: 120,
              mx: "auto",
              mb: 2,
              fontSize: "2rem",
            }}
          >
            {getUserInitials(user as any)}
          </Avatar>

          <input
            accept="image/*"
            style={{ display: "none" }}
            id="avatar-upload"
            type="file"
            onChange={handleAvatarUpload}
          />
          <label htmlFor="avatar-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<PhotoCamera />}
              fullWidth
              sx={{ mb: 2 }}
            >
              Upload Photo
            </Button>
          </label>

          <Divider sx={{ my: 2 }} />
        </Paper>

        <Paper
          elevation={4}
          sx={{ p: 3, borderRadius: 3, backgroundColor: "antiquewhite" }}
        >
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
          <Logout sx={{ mr: 1 }} />
          Logout
        </Button>
      </Container>
      <Footer />
    </Box>
  );
};

export default Profile;
