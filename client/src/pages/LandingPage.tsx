import {
  Container,
  Stack,
  Box,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import Header from "../components/Header";

function LandingPage() {
  return (
    <>
      {/* Background Section */}
      <Header/>
      <Stack
        sx={{
          backgroundImage:
            "url('https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          height: "100vh",
          width: "100vw",
          opacity: 0.8,
          p: 2,
          m: 2,
        }}
      >
        <Container maxWidth="lg" disableGutters sx={{ px: 3, py: 5 }}>
          <Box
            p={4}
            m={2}
            display="flex"
            flexDirection="row"
            gap={10}
            borderRadius={5}
          >
            <Box
              component="img"
              src="https://images.pexels.com/photos/159865/notepad-pencil-green-black-159865.jpeg"
              alt="TaskY Logo"
              sx={{ width: "30%", height: 500, borderRadius: 4 }}
            />
            <Box>
              <Paper
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                  backdropFilter: "blur(0.2px)",
                  borderRadius: 3,
                  p: 3,
                  width: 600,
                }}
              >
                <Typography
                  variant="h1"
                  color="blue"
                  p={7}
                  fontWeight={900}
                  fontSize={50}
                  textAlign="center"
                >
                  {" | "} Organize Your Day & Find Ease in Your Productivity
                </Typography>
              </Paper>

              <Box p={2} textAlign="center">
                <Button variant="contained" sx={{ bgcolor: "blue" }}>
                  Get Busy
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>

        <Box>
          <Paper>
            <Typography
              variant="h3"
              color="black"
              fontFamily="monospace"
              textAlign="center"
              borderLeft={2}
              borderRadius={10}
              bgcolor="GrayText"
              p={2}
            >
              | Nothing as sweet as completing a Task
            </Typography>
          </Paper>
        </Box>
      </Stack>

      <Stack>
        <Typography
          variant="h2"
          fontFamily="Helvetica Neue"
          p={4}
          textAlign="center"
        >
          Become Proud of Yourself
        </Typography>

        <Box p={4}>
          <Paper
            elevation={4}
            sx={{
              alignItems: "center",
              border: 1,
              bgcolor: "coral",
              p: 3,
              m: 2,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              flexWrap="wrap"
              gap={2}
            >
              <Box flex={1} minWidth={300}>
                <Box sx={{ bgcolor: "#d3a614ff", borderRadius: 2, p: 2 }}>
                  <Typography
                    fontSize={29}
                    fontFamily="monospace"
                    color="#333"
                    fontWeight={900}
                    mb={1}
                  >
                    🕓 To Do
                  </Typography>
                  <ul style={{ paddingLeft: "1em" }}>
                    <li>
                      <input type="checkbox" /> Plan project outline
                    </li>
                    <li>
                      <input type="checkbox" /> Develop Backend
                    </li>
                    <li>
                      <input type="checkbox" /> Set goals
                    </li>
                  </ul>
                </Box>
              </Box>

              <Box flex={1} minWidth={300}>
                <Box sx={{ bgcolor: "#4f6ed6ff", borderRadius: 2, p: 2 }}>
                  <Typography
                    fontSize={29}
                    fontFamily="monospace"
                    color="black"
                    fontWeight={900}
                    mb={1}
                  >
                    ♻ In Progress
                  </Typography>
                  <ul style={{ paddingLeft: "1em", color: "white" }}>
                    <li>
                      <input type="checkbox" checked /> Writing code
                    </li>
                    <li>
                      <input type="checkbox" /> Designing UI
                    </li>
                    <li>
                      <input type="checkbox" /> Working on Authorization
                    </li>
                  </ul>
                </Box>
              </Box>

              <Box flex={1} minWidth={300}>
                <Box sx={{ bgcolor: "#20c997", borderRadius: 2, p: 2 }}>
                  <Typography
                    fontSize={29}
                    fontFamily="monospace"
                    color="black"
                    fontWeight={900}
                    mb={1}
                  >
                    ☑ Done
                  </Typography>
                  <ul style={{ paddingLeft: "2rem", color: "white" }}>
                    <li>
                      <input type="checkbox" checked /> Developing Frontend
                    </li>
                    <li>
                      <input type="checkbox" checked /> TaskY Landing Page
                    </li>
                    <li>
                      <input type="checkbox" checked /> Deploy the App
                    </li>
                  </ul>
                </Box>
              </Box>
            </Box>

            <div
              dangerouslySetInnerHTML={{
                __html: `
              <svg width="100%" height="150">
                <path id="taskPath" d="M 40 100 L 1800 100" stroke="black" fill="none" />
                <rect width="80" height="10" rx="6" ry="5" fill="navy">
                  <animateMotion dur="15s" repeatCount="indefinite" rotate="auto">
                    <mpath href="#taskPath" />
                  </animateMotion>
                </rect>
              </svg>
            `,
              }}
            />
            <Typography textAlign="center" fontWeight={500}>
              As simple as a Working Plan ♦
            </Typography>
          </Paper>
        </Box>
      </Stack>
    </>
  );
}

export default LandingPage;
