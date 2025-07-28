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

  useEffect(() => {
    const fetchDeletedTasks = async () => {
      try {
        const response = await axios.get("/api/tasks/deleted");
        const data = response.data;

        console.log("Fetched deleted tasks:", data);

        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          console.warn("Expected an array but got:", data);
          setTasks([]);
        }
      } catch (error) {
        console.error("Failed to fetch deleted tasks:", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeletedTasks();
  }, []);

  const handleRestore = async (taskId: string) => {
    try {
      await axios.patch(`/api/tasks/restore/${taskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      alert("Task restored successfully");
    } catch (error) {
      console.error("Failed to restore task:", error);
      alert("Failed to restore task");
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
