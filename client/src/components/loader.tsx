import { CircularProgress, Stack, Typography } from "@mui/material";
function Loader({ message }: { message: string }) {
  return (
    <Stack p={10} justifyContent="center" alignItems="center">
      <CircularProgress size={100} thickness={10} />
      <Typography variant="h4">{message}</Typography>
    </Stack>
  );
}

export default Loader;
