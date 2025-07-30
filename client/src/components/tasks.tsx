import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Stack,
  Button,
  Grid,
  Divider,
} from "@mui/material";

// import { FaRegClock } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaTrashRestore } from "react-icons/fa";

type CardProps = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isDeleted: boolean;
};
function Task({
  //   id,
  title,
  description,
  isCompleted,
  isDeleted,
}: CardProps) {
  return (
    <Grid height={40} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
      <Card
        elevation={3}
        sx={{
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "1000%",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{ textDecoration: isCompleted ? "line-through" : "none" }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{ textDecoration: isCompleted ? "line-through" : "none" }}
          >
            {description}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <FaCalendarAlt />
            <Typography variant="body2" fontWeight={600}>
              DeadLine
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <FaCalendarAlt />
            <Typography variant="body2" fontWeight={600}>
              DeadLineTime
            </Typography>
          </Stack>
        </CardContent>
        {isDeleted ? (
          <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<FaTrashRestore />}
            >
              Restore
            </Button>
          </CardActions>
        ) : (
          <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<FaEdit />}
            >
              Update
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<FaTrashAlt />}
            >
              Delete
            </Button>
          </CardActions>
        )}
      </Card>
    </Grid>
  );
}
export default Task;
