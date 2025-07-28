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
} from "@mui/material";
import axios from "../api/axios";
import { Link } from "react-router-dom";
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

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const response = await axios.get("/api/tasks");
        const completedTasks = (response.data as Task[]).filter(
          (task: Task) => task.isCompleted && !task.isDeleted,
        );
        setTasks(completedTasks);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch completed tasks:", error);
        setLoading(false);
      }
    };

    fetchCompletedTasks();
  }, []);

  const handleDelete = async (taskId: string) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      alert("Task moved to trash");
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Failed to delete task");
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

  if (tasks.length === 0) {
    return (
      <>
        <Container
          maxWidth="lg"
          sx={{ bgcolor: "#fffbe6", p: 4, minHeight: "80vh" }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            Completed Tasks
          </Typography>
          <Typography variant="h5" textAlign="center" sx={{ mt: 8 }}>
            No completed tasks yet! 🎯
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            Complete some tasks to see them here.
          </Typography>
        </Container>
        <Footer />
      </>
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
      </Container>
      <Footer />
    </>
  );
};

export default CompletedTasks;
