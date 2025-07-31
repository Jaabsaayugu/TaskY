import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Stack,
  Paper,
  Alert,
  Box,
} from "@mui/material";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import { useMutation } from "@tanstack/react-query";

interface NewTask {
  title: string;
  description: string;
}

const NewTask: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { isPending, mutate } = useMutation({
    mutationKey: ["create-task"],
    mutationFn: async (newTask: NewTask) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await axiosInstance.post("/api/tasks", newTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      setTitle("");
      setDescription("");
      setFormError(null);
      setSuccessMessage("Task created successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/taskList");
      }, 2000);
    },
    onError: (err: any) => {
      console.error("Create task error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (err.response?.data?.error) {
        setFormError(err.response.data.error);
      } else if (err.message === "No authentication token found") {
        navigate("/login");
      } else {
        setFormError("An unexpected error occurred! Please try again.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim() || !description.trim()) {
      setFormError("Title and description are required");
      return;
    }

    mutate({
      title: title.trim(),
      description: description.trim(),
    });
  };

  const handleCancel = () => {
    navigate("/taskList");
  };

  return (
    <>
      <Container
        maxWidth="md"
        sx={{ bgcolor: "#fffbe6", p: 3, minHeight: "80vh" }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Create New Task
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {formError && <Alert severity="error">{formError}</Alert>}

              <TextField
                label="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
                placeholder="Enter a title for your task"
                disabled={isPending}
                error={!title.trim() && formError !== null}
                helperText={
                  !title.trim() && formError !== null ? "Title is required" : ""
                }
              />

              <TextField
                label="Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                minRows={5}
                required
                fullWidth
                placeholder="Describe your task in detail..."
                disabled={isPending}
                error={!description.trim() && formError !== null}
                helperText={
                  !description.trim() && formError !== null
                    ? "Description is required"
                    : ""
                }
              />
              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isPending}
                  size="large"
                  sx={{ minWidth: 150 }}
                >
                  {isPending ? "Creating..." : "Create Task"}
                </Button>

                <Button
                  type="button"
                  variant="outlined"
                  size="large"
                  onClick={handleCancel}
                  disabled={isPending}
                  sx={{ minWidth: 100 }}
                >
                  Cancel
                </Button>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default NewTask;
