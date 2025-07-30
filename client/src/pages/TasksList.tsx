
import { Typography, Box, Grid, Stack } from "@mui/material";
import Task from "../components/tasks";
import Loader from "../components/loader";
import axiosInstance from "../api/axios";
import { useQuery } from "@tanstack/react-query";
import Footer from "../components/footer";

interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isDeleted: boolean;
}

function TaskList() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<Task[]>({
    queryKey: ["Get-all-Tasks"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/tasks");
      console.log(" data from /tasks:", response.data);
      return response.data as Task[];
    },
  });
  if (isError) {
    return (
      <Stack component="section" p={7}>
        <Typography variant="h4" textAlign="center" fontWeight="bold">
          {" "}
          Something went Wrong! Try Again!
        </Typography>
      </Stack>
    );
  }
  if (isLoading) {
    return <Loader message="Loading Please wait..." />;
  }
  return (
    <Box component="section" mt={2}>
      <Grid
        container
        justifyContent="center"
        spacing={4}
        mt={3}
        px={5}
        height={200}
      >
        {Array.isArray(data) &&
          data.map((task: Task) => (
            <Task
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              isCompleted={task.isCompleted}
              isDeleted={task.isDeleted}
            />
          ))}
        {/* <Task id="256" title="Come home" description="Lorem5" isCompleted={false} isDeleted={false}/> */}
        {/* <Task id="256" title="Come home" description="Lorem5" isCompleted={false} isDeleted={false}/> */}
        {/* <Task id="256" title="Come home" description="Lorem5" isCompleted={false} isDeleted={false}/> */}
        {/* <Task id="256" title="Come home" description="Lorem5" isCompleted={false} isDeleted={false}/> */}
        {/* <Task id="256" title="Come home" description="Lorem5" isCompleted={false} isDeleted={false}/> */}
      </Grid>
      <Footer />
    </Box>
  );
}
export default TaskList;
