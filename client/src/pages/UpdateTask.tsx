// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Container,
//   TextField,
//   Button,
//   Typography,
//   Stack,
//   Paper,
//   Box,
// } from "@mui/material";
// import axios from "../api/axios";
// import Footer from "../components/footer";

// interface Task {
//   id: string;
//   title: string;
//   description: string;
//   isCompleted: boolean;
//   dateCreated: string;
//   dateUpdated: string;
// }

// const UpdateTask: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [task, setTask] = useState<Task | null>(null);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTask = async () => {
//       try {
//         const response = await axios.get(`/api/tasks/${id}`);
//         const taskData = response.data;
//         setTask(taskData);
//         setTitle(taskData.title);
//         setDescription(taskData.description);
//         setLoading(false);
//       } catch (error) {
//         console.error("Failed to fetch task:", error);
//         alert("Failed to fetch task");
//         navigate("/taskList");
//       }
//     };

//     if (id) {
//       fetchTask();
//     }
//   }, [id, navigate]);

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await axios.patch(`/api/tasks/${id}`, {
//         title,
//         description,
//       });
//       alert("Task updated successfully");
//       navigate("/taskList");
//     } catch (error) {
//       console.error("Failed to update task:", error);
//       alert("Failed to update task");
//     }
//   };

//   const handleToggleComplete = async () => {
//     if (!task) return;

//     try {
//       const endpoint = task.isCompleted ? "incomplete" : "complete";
//       await axios.patch(`/api/tasks/${endpoint}/${id}`);

//       const action = task.isCompleted ? "incomplete" : "completed";
//       alert(`Task marked as ${action}`);
//       navigate("/taskList");
//     } catch (error) {
//       console.error("Failed to toggle task completion:", error);
//       alert("Failed to update task status");
//     }
//   };

//   if (loading) {
//     return (
//       <Container maxWidth="md" sx={{ bgcolor: "#fffbe6", p: 3 }}>
//         <Typography variant="h5" textAlign="center">
//           Loading task...
//         </Typography>
//       </Container>
//     );
//   }

//   if (!task) {
//     return (
//       <Container maxWidth="md" sx={{ bgcolor: "#fffbe6", p: 3 }}>
//         <Typography variant="h5" textAlign="center">
//           Task not found
//         </Typography>
//       </Container>
//     );
//   }

//   return (
//     <>
//       <Container maxWidth="md" sx={{ bgcolor: "#fffbe6", p: 3, minHeight: "80vh" }}>
//         <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
//           Update Task
//         </Typography>

//         <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
//           <form onSubmit={handleUpdate}>
//             <Stack spacing={3}>
//               <TextField
//                 label="Task Title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 required
//                 fullWidth
//               />

//               <TextField
//                 label="Task Description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 multiline
//                 minRows={5}
//                 required
//                 fullWidth
//               />

//               <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   sx={{ minWidth: 150 }}
//                 >
//                   Update Task
//                 </Button>

//                 <Button
//                   type="button"
//                   variant="contained"
//                   color={task.isCompleted ? "warning" : "success"}
//                   onClick={handleToggleComplete}
//                   sx={{ minWidth: 200 }}
//                 >
//                   {task.isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
//                 </Button>

//                 <Button
//                   type="button"
//                   variant="outlined"
//                   color="secondary"
//                   onClick={() => navigate("/taskList")}
//                   sx={{ minWidth: 100 }}
//                 >
//                   Cancel
//                 </Button>
//               </Box>
//             </Stack>
//           </form>
//         </Paper>

//         <Typography variant="body2" color="text.secondary">
//           Created: {new Date(task.dateCreated).toLocaleDateString()}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           Last Updated: {new Date(task.dateUpdated).toLocaleDateString()}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           Status: {task.isCompleted ? "Completed" : "Incomplete"}
//         </Typography>
//       </Container>
//       <Footer />
//     </>
//   );
// };

// export default UpdateTask;
