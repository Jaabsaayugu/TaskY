import { Typography, Box, Grid, Stack, Container, Alert } from "@mui/material";
import Task from "../components/tasks";
import Loader from "../components/loader";
import axiosInstance from "../api/axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";

interface TaskType {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isDeleted: boolean;
  dateCreated: string;
  dateUpdated: string;
}

function TaskList() {
  const navigate = useNavigate();

  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<TaskType[]>({
    queryKey: ["Get-all-Tasks"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axiosInstance.get<
        { tasks: TaskType[] } | TaskType[]
      >("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data) {
  console.warn("No data received from /api/tasks");
  return [];
}
      // console.log("Raw response from /api/tasks:", response.data);

      const tasks = Array.isArray(response.data)
        ? response.data
        : (response.data as { tasks: TaskType[] }).tasks || [];

        if (!Array.isArray(tasks)) {
  console.warn("Tasks is not an array:", tasks);
  return [];
}

return tasks.filter((task: TaskType) => task && !task.isDeleted);
    },
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });

  if (isError && (error as any)?.response?.status === 401) {
    localStorage.removeItem("token");
    navigate("/login");
    return null;
  }

  if (isError) {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Box component="main" flex="1" bgcolor="antiquewhite">
          <Container maxWidth="lg" sx={{ p: 4 }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              Failed to load tasks. Please try again.
            </Alert>
            <Stack component="section" p={7} alignItems="center">
              <Typography variant="h4" textAlign="center" fontWeight="bold">
                Something went wrong!
              </Typography>
              <Typography variant="body1" textAlign="center" sx={{ mt: 2 }}>
                {(error as any)?.message ||
                  "Please refresh the page or try again later."}
              </Typography>
            </Stack>
          </Container>
        </Box>
        <Footer />
      </Box>
    );
  }

  if (isLoading) {
    return <Loader message="Loading tasks, please wait..." />;
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box component="main" flex="1" bgcolor="antiquewhite">
        <Container maxWidth={false} sx={{ minHeight: "100vh" }}>
          <Box mt={2}>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary"
              textAlign="center"
              sx={{ mb: 3 }}
            >
              My Tasks ({data.length})
            </Typography>

            <Grid container justifyContent="center" spacing={4} mt={3} px={5}>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((task: TaskType) => (
                  <Task
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    isCompleted={task.isCompleted}
                    isDeleted={task.isDeleted}
                    dateCreated={task.dateCreated}
                    dateUpdated={task.dateUpdated}
                    onTaskUpdate={refetch}
                  />
                ))
              ) : (
                <Box>
                  <Box sx={{ textAlign: "center", mt: 8 }}>
                    <Typography variant="h5" color="text.secondary">
                      No tasks found. Create your first task! 🚀
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      Click "New Task" to get started.
                    </Typography>
                  </Box>
                </Box>
              )}
            </Grid>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}

export default TaskList;
