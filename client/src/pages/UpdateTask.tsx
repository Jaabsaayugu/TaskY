import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Stack,
  Paper,
  Box,
  Alert,
} from "@mui/material";
import axios from "../api/axios";
import Footer from "../components/footer";

interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  dateCreated: string;
  dateUpdated: string;
}

const UpdateTask: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get<{ task: Task }>(`/api/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const taskData = response.data.task || response.data;
        setTask(taskData);
        setTitle(taskData.title);
        setDescription(taskData.description);
        setError(null);
      } catch (error: any) {
        console.error("Failed to fetch task:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (error.response?.status === 404) {
          setError("Task not found");
        } else {
          setError("Failed to fetch task. Please try again.");
        }

        setTimeout(() => navigate("/taskList"), 30000);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id, navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.put(
        `/api/tasks/${id}`,
        {
          title: title.trim(),
          description: description.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const successAlert = document.createElement("div");
      successAlert.innerHTML = "Task updated successfully!";
      successAlert.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 9999;
        background: #4caf50; color: white; padding: 12px 24px;
        border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      `;
      document.body.appendChild(successAlert);
      setTimeout(() => document.body.removeChild(successAlert), 2000);

      setTimeout(() => navigate("/taskList"), 2000);
    } catch (error: any) {
      console.error("Failed to update task:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError("Failed to update task. Please try again.");
    }
  };

  const handleToggleComplete = async () => {
    if (!task) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const endpoint = task.isCompleted ? "incomplete" : "complete";
      await axios.patch(
        `/api/tasks/${endpoint}/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const action = task.isCompleted ? "incomplete" : "completed";

      const successAlert = document.createElement("div");
      successAlert.innerHTML = `Task marked as ${action}!`;
      successAlert.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 9999;
        background: #4caf50; color: white; padding: 12px 24px;
        border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      `;
      document.body.appendChild(successAlert);
      setTimeout(() => document.body.removeChild(successAlert), 2000);

      setTimeout(() => navigate("/taskList"), 2000);
    } catch (error: any) {
      console.error("Failed to toggle task completion:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError("Failed to update task status. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{ bgcolor: "#fffbe6", p: 3, minHeight: "80vh" }}
      >
        <Typography variant="h5" textAlign="center">
          Loading task...
        </Typography>
      </Container>
    );
  }

  if (!task) {
    return (
      <>
        <Container
          maxWidth="md"
          sx={{ bgcolor: "#fffbe6", p: 3, minHeight: "80vh" }}
        >
          <Typography variant="h5" textAlign="center" color="error">
            {error || "Task not found"}
          </Typography>
          <Typography variant="body1" textAlign="center" sx={{ mt: 2 }}>
            Redirecting to task list...
          </Typography>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Container
        maxWidth="md"
        sx={{ bgcolor: "#fffbe6", p: 3, minHeight: "80vh" }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Update Task
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <form onSubmit={handleUpdate}>
            <Stack spacing={3}>
              <TextField
                label="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
                error={!title.trim() && error !== null}
                helperText={
                  !title.trim() && error !== null ? "Title is required" : ""
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
                error={!description.trim() && error !== null}
                helperText={
                  !description.trim() && error !== null
                    ? "Description is required"
                    : ""
                }
              />

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ minWidth: 150 }}
                >
                  Update Task
                </Button>

                <Button
                  type="button"
                  variant="contained"
                  color={task.isCompleted ? "warning" : "success"}
                  onClick={handleToggleComplete}
                  sx={{ minWidth: 200 }}
                >
                  {task.isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
                </Button>

                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/taskList")}
                  sx={{ minWidth: 100 }}
                >
                  Cancel
                </Button>
              </Box>
            </Stack>
          </form>
        </Paper>

        <Typography variant="body2" color="text.secondary">
          Created: {new Date(task.dateCreated).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last Updated: {new Date(task.dateUpdated).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Status: {task.isCompleted ? "Completed" : "Incomplete"}
        </Typography>
      </Container>
      <Footer />
    </>
  );
};

export default UpdateTask;
