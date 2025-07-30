import { Typography, Box, Grid, Stack, Container } from "@mui/material";
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
      const response = await axiosInstance.get("/tasks");
      console.log(" data from /tasks:", response.data);
      return response.data as Task[];
    },
  });
  if (isError) {
    return (
      <Stack component="section" p={7}>
        <Typography variant="h4" textAlign="center" fontWeight="bold">
          {" "}
          You are cooked! Try Again!
        </Typography>
      </Stack>
    );
  }
  if (isLoading) {
    return <Loader message="Loading Please wait..." />;
  }
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box component="main" flex="1" bgcolor="antiquewhite">
        <Container maxWidth={false} sx={{ minHeight: "100vh" }}>
          <Box mt={2}>
            <Grid container justifyContent="center" spacing={4} mt={3} px={5}>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((task: Task) => (
                  <Task
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    isCompleted={task.isCompleted}
                    isDeleted={task.isDeleted}
                  />
                ))
              ) : (
                <Typography variant="h6" textAlign="center">
                  No tasks found. Create your first task!
                </Typography>
              )}
              {/* <Task
                id="256"
                title="Come home"
                description="lorem30 ljkdvdjbjsd kjsdv jkn ljksnd jnls JN LS lj lJD SLJLJN S jnlj blsdhb ljs lbn lvj lan dflb aifdj lkn alfdiv iaj dlfnd libadlfi ladn lia dfln b;idzfz lankdlfn ldjnzf ;inad;fj ;adkf ;k"
                isCompleted={false}
                isDeleted={false}
              /> */}
              {/* <Task id="256" title="Come home" description="Lorem5" isCompleted={false} isDeleted={false}/> */}
              {/* <Task
                id="256"
                title="Come home"
                description="Lorem5"
                isCompleted={false}
                isDeleted={false}
              /> */}
              {/* <Task id="256" title="Come home" description="Lorem5" isCompleted={false} isDeleted={false}/> */}
              {/* <Task
                id="256"
                title="Come home"
                description="Lorem5"
                isCompleted={false}
                isDeleted={false}
              /> */}
            </Grid>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
export default TaskList;
