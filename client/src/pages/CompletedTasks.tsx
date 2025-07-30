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
import { Link, useNavigate } from "react-router-dom";
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

const CompletedTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get<{ tasks: Task[] }>(
          "/api/tasks/completed",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const tasksData = response.data.tasks || response.data;
        setTasks(Array.isArray(tasksData) ? tasksData : []);
        setError(null);
      } catch (error: any) {
        console.error("Failed to fetch completed tasks:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setError("Failed to load completed tasks. Please try again.");
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedTasks();
  }, [navigate]);

  const handleDelete = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to move this task to trash?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.delete(`/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      setError(null);
    } catch (error: any) {
      console.error("Failed to delete task:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError("Failed to delete task. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ bgcolor: "#fffbe6", p: 4, minHeight: "80vh" }}
      >
        <Typography variant="h5" textAlign="center">
          Loading completed tasks...
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
          Completed Tasks ({tasks.length})
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {tasks.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 8 }}>
            <Typography variant="h5" color="text.secondary">
              No completed tasks yet! 🎯
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Complete some tasks to see them here.
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
                    bgcolor: "#e8f5e8",
                    border: "2px solid #4caf50",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      ✅ {task.title}
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
                      ✅ Completed:{" "}
                      {new Date(task.dateUpdated).toLocaleDateString()}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mt: "auto" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to={`/tasks/update/${task.id}`}
                        size="small"
                      >
                        Edit
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(task.id)}
                        size="small"
                      >
                        Delete
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

export default CompletedTasks;
