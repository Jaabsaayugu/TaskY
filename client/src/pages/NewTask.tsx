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
import axiosInstance from "../api/axios";
import axios from "axios";
import Footer from "../components/footer";
import { useMutation } from "@tanstack/react-query";

interface NewTask {
  title: string;
  description: string;
}

const NewTask: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const { isPending, mutate } = useMutation({
    mutationKey: ["create-task"],
    mutationFn: async (newTask: NewTask) => {
      const res = await axiosInstance.post("/tasks", newTask);
      return res.data;
    },
    onSuccess: () => {
      setTitle("");
      setDescription("");
      setSuccessMessage("Task created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    // onError: (err) => {
    //   if (axios.isAxiosError(err)) {
    //     setFormError(err.response?.data?.message || "Request failed");
    //   } else {
    //     setFormError("An unexpected error occurred!");
    //   }
    // },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    mutate({ title, description });
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
              {formError && <Alert severity="error">{formError}</Alert>}

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
                disabled={isPending}
                size="large"
                sx={{ width: "fit-content" }}
              >
                {isPending ? "Creating..." : "Create Task"}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default NewTask;
