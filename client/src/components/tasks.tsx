import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Stack,
  Button,
  Divider,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

import { FaRegClock } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaTrashRestore } from "react-icons/fa";
import { MdDoneOutline } from "react-icons/md";
import { MdUndo } from "react-icons/md";
import { Box } from "lucide-react";

type CardProps = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isDeleted: boolean;
  dateCreated: string;
  dateUpdated: string;
  onTaskUpdate?: () => void; 
};

function Task({
  id,
  title,
  description,
  isCompleted,
  isDeleted,
  dateCreated,
  dateUpdated,
  onTaskUpdate,
}: CardProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/tasks/update/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to move this task to trash?")) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axiosInstance.delete(`/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const successAlert = document.createElement("div");
      successAlert.innerHTML = "Task moved to trash!";
      successAlert.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 9999;
        background: #4caf50; color: white; padding: 12px 24px;
        border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      `;
      document.body.appendChild(successAlert);
      setTimeout(() => document.body.removeChild(successAlert), 3000);

      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (error: any) {
      console.error("Failed to delete task:", error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      
      alert("Failed to delete task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const endpoint = isCompleted ? "incomplete" : "complete";
      await axiosInstance.patch(`/api/tasks/${endpoint}/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const action = isCompleted ? "incomplete" : "completed";
      
      const successAlert = document.createElement("div");
      successAlert.innerHTML = `Task marked as ${action}!`;
      successAlert.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 9999;
        background: #4caf50; color: white; padding: 12px 24px;
        border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      `;
      document.body.appendChild(successAlert);
      setTimeout(() => document.body.removeChild(successAlert), 3000);

      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (error: any) {
      console.error("Failed to toggle task completion:", error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      
      alert("Failed to update task status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axiosInstance.patch(`/api/tasks/${id}/restore`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const successAlert = document.createElement("div");
      successAlert.innerHTML = "Task restored successfully!";
      successAlert.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 9999;
        background: #4caf50; color: white; padding: 12px 24px;
        border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      `;
      document.body.appendChild(successAlert);
      setTimeout(() => document.body.removeChild(successAlert), 3000);

      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (error: any) {
      console.error("Failed to restore task:", error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      
      alert("Failed to restore task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Card
        elevation={3}
        sx={{
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          bgcolor: isCompleted ? "#e8f5e8" : isDeleted ? "#ffebee" : "#fff",
          border: isCompleted ? "2px solid #4caf50" : isDeleted ? "2px solid #f44336" : "1px solid #e0e0e0",
          opacity: isDeleted ? 0.8 : 1,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{ 
              textDecoration: isCompleted ? "line-through" : "none",
              color: isDeleted ? "#f44336" : isCompleted ? "#4caf50" : "inherit"
            }}
          >
            {isCompleted && "✅ "}
            {isDeleted && "🗑️ "}
            {title}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Paper sx={{ backgroundColor: "antiquewhite", p: 2 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ 
                textDecoration: isCompleted ? "line-through" : "none",
                minHeight: 60
              }}
            >
              {description.length > 100 ? description.substring(0, 100) + "..." : description}
            </Typography>
          </Paper>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={1} alignItems="center" mb={1} mt={2}>
            <FaCalendarAlt />
            <Typography variant="body2" fontWeight={600}>
              Created: {new Date(dateCreated).toLocaleDateString()}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <FaRegClock />
            <Typography variant="body2" fontWeight={600}>
              Updated: {new Date(dateUpdated).toLocaleDateString()}
            </Typography>
          </Stack>
          {isCompleted && (
            <Typography variant="body2" color="success.main" fontWeight={600}>
              Status: Completed ✅
            </Typography>
          )}
        </CardContent>
        
        {isDeleted ? (
          <CardActions sx={{ justifyContent: "center", px: 2, pb: 2 }}>
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<FaTrashRestore />}
              onClick={handleRestore}
              disabled={loading}
              fullWidth
            >
              {loading ? "Restoring..." : "Restore"}
            </Button>
          </CardActions>
        ) : (
          <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2, flexWrap: "wrap", gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<FaEdit />}
              onClick={handleEdit}
              disabled={loading}
              sx={{ minWidth: 80 }}
            >
              Edit
            </Button>

            <Button
              size="small"
              variant="contained"
              color={isCompleted ? "warning" : "success"}
              startIcon={isCompleted ? <MdUndo /> : <MdDoneOutline />}
              onClick={handleToggleComplete}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? "Updating..." : isCompleted ? "Mark Incomplete" : "Mark Complete"}
            </Button>

            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<FaTrashAlt />}
              onClick={handleDelete}
              disabled={loading}
              sx={{ minWidth: 80 }}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </CardActions>
        )}
      </Card>
    </Box>
  );
}

export default Task;