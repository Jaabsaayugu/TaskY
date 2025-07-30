import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Container,
  Alert,
} from "@mui/material";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";

interface Task {
  id: string;
  title: string;
  description: string;
  dateCreated: string;
  dateUpdated: string;
  isDeleted: boolean;
  isCompleted: boolean;
}

const Trash: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeletedTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get<{ tasks: Task[] }>(
          "/api/tasks/deleted",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("Fetched deleted tasks:", response.data);

        const tasksData = response.data.tasks || response.data;

        if (Array.isArray(tasksData)) {
          setTasks(tasksData);
        } else {
          console.warn("Expected an array but got:", tasksData);
          setTasks([]);
        }

        setError(null);
      } catch (error: any) {
        console.error("Failed to fetch deleted tasks:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setError("Failed to load deleted tasks. Please try again.");
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeletedTasks();
  }, [navigate]);

  const handleRestore = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.patch(
        `/api/tasks/${taskId}/restore`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      setError(null);

      const successAlert = document.createElement("div");
      successAlert.innerHTML = "Task restored successfully!";
      successAlert.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 9999;
        background: #4caf50; color: white; padding: 12px 24px;
        border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      `;
      document.body.appendChild(successAlert);
      setTimeout(() => document.body.removeChild(successAlert), 3000);
    } catch (error: any) {
      console.error("Failed to restore task:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError("Failed to restore task. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ bgcolor: "#fffbe6", p: 4, minHeight: "80vh" }}
      >
        <Typography variant="h5" textAlign="center">
          Loading trash...
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{ bgcolor: "#fffbe6", p: 4, minHeight: "80vh" }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Trash 🗑️
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          Items in trash will be deleted after 30 days
        </Alert>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {tasks.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 8 }}>
            <Typography variant="h5" color="text.secondary">
              Trash is empty! 🎉
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              No deleted tasks found.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {tasks.map((task) => (
              <Box key={task.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "#ffebee",
                    border: "2px solid #f44336",
                    opacity: 0.8,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom color="error">
                      🗑️ {task.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {task.description.length > 100
                        ? task.description.substring(0, 100) + "..."
                        : task.description}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      📅 Created:{" "}
                      {new Date(task.dateCreated).toLocaleDateString()}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      🗑️ Deleted:{" "}
                      {new Date(task.dateUpdated).toLocaleDateString()}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mt: "auto" }}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleRestore(task.id)}
                        size="small"
                        fullWidth
                      >
                        Restore
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Grid>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Trash;
