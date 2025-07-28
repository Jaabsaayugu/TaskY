// import React, { useState } from "react";
// import {
//   Container,
//   TextField,
//   Button,
//   Typography,
//   Stack,
//   Paper,
// } from "@mui/material";
// import axios from "../api/axios";
// import { useNavigate } from "react-router-dom";
// import Footer from "../components/footer";

// const NewTask: React.FC = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//         // console.log("TOKEN:", localStorage.getItem("token"));
//       await axios.post(
//         "http://localhost:4000/api/tasks",
//         { title, description,  },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       navigate("/taskList");
//     } catch (error) {
//       alert("Failed to create task");
//     }
//   };

//   return (
//     <>
//     <Container maxWidth="md" sx={{ bgcolor: "#fffbe6", p: 3 }}>
//       <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
//         Create New Task
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <Stack spacing={2}>
//           <TextField
//             label="Task Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//           <TextField
//             label="Task Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             multiline
//             minRows={5}
//             required
//           />

//           <Button type="submit" variant="contained" sx={{ width: 0.2 }}>
//             Create Task
//           </Button>
//         </Stack>
//       </form>
//     </Container>
//       <Footer />

//       </>
//   );
// };

// export default NewTask;
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Stack,
  Paper,
  Alert,
} from "@mui/material";
import axios from "../api/axios";
import Footer from "../components/footer";

const NewTask: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:4000/api/tasks",
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      // Clear form and show success message
      setTitle("");
      setDescription("");
      setSuccessMessage("Task created successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      alert("Failed to create task");
    }
  };

  return (
    <>
      <Container
        maxWidth="md"
        sx={{ bgcolor: "#fffbe6", p: 3, minHeight: "80vh" }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Create New Task
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
                placeholder="Enter a descriptive title for your task"
              />

              <TextField
                label="Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                minRows={5}
                required
                fullWidth
                placeholder="Describe your task in detail..."
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ width: "fit-content" }}
              >
                Create Task
              </Button>
            </Stack>
          </form>
        </Paper>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          💡 Tip: You can create multiple tasks in a row. The form will reset
          after each successful creation.
        </Typography>
      </Container>
      <Footer />
    </>
  );
};

export default NewTask;
