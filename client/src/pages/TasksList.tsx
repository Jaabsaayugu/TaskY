import {
  Grid,
  Box,
  Typography,
  Drawer,
  // CssBaseline,
  List,
  // ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Toolbar,
  // AppBar,
  Divider,
  Card,
  CardContent,
  Stack,
  Button,
  Container,
} from "@mui/material";
import {
  // Inbox as InboxIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
  // Assignment as TaskIcon,
  AccountCircle,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/footer";

interface Task {
  id: string;
  title: string;
  description: string;
  dateCreated: string;
  isDeleted: boolean;
  isCompleted: boolean;
}

const drawerWidth = 240;

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await axios.get("/api/tasks");

        const taskData = res.data as unknown;

        let tasks: Task[] = [];

        if (Array.isArray(taskData)) {
          tasks = taskData as Task[];
        } else if (
          typeof taskData === "object" &&
          taskData !== null &&
          "tasks" in taskData &&
          Array.isArray((taskData as any).tasks)
        ) {
          tasks = (taskData as any).tasks as Task[];
        }

        const activeTasks = tasks.filter(
          (task) => !task.isDeleted && !task.isCompleted,
        );

        setTasks(activeTasks);
        console.log("Fetched tasks:", tasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    }

    fetchTasks();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <IconButton
        color="inherit"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ ml: 2, m: 4 }}
      >
        <MenuIcon />
        <Typography variant="h6" noWrap color="navy">
          Dashboard
        </Typography>
      </IconButton>

      <List>
        <ListItemButton onClick={() => navigate("/newTask")}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="New Task" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/trash")}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary="Trash" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/profile")}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </div>
  );

  if (tasks.length === 0) {
    return (
      <>
        <Container
          maxWidth={false}
          sx={{ bgcolor: "antiquewhite", p: 4, m: 0, height: "100vh" }}
        >
          <Typography variant="h5" textAlign="center">
            You are cooked! You don’t have any tasks 😎
          </Typography>

          {/* <CssBaseline /> */}

          {/* <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Task Dashboard
          </Typography>
        </Toolbar>
      </AppBar> */}

          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
          >
            {drawer}
          </Drawer>
        </Container>
      </>
    );
  }

  return (
    <>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Your Tasks
      </Typography>
      <Container sx={{ mt: 6 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Your Tasks
        </Typography>
        <Grid container spacing={4}>
          {tasks.map((task) => (
            <Box
              key={task.id}
              sx={{
                width: { xs: "100%", sm: "48%", md: "30%" },
                mb: 4,
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {task.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {task.description.length > 100
                      ? task.description.substring(0, 100) + "..."
                      : task.description}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="secondary"
                    fontWeight={800}
                    mt={1}
                  >
                    📆 {new Date(task.dateCreated).toLocaleDateString()}
                  </Typography>

                  <Stack direction="row" spacing={1} mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`/tasks/update/${task.id}`}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={async () => {
                        try {
                          await axios.delete(`/api/tasks/${task.id}`);
                          setTasks((prev) =>
                            prev.filter((t) => t.id !== task.id),
                          );
                        } catch (error) {
                          console.error("Failed to delete task", error);
                        }
                      }}
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
}
