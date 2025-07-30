import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Tabs,
  Divider,
  Tab,
  Checkbox,
  FormControlLabel,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useUser from "../store/userStore";
import axios from "axios";
// import axiosInstance from "../api/axios";

const Login: React.FC = () => {
  const [tab, setTab] = useState(1);
  const [searchParams] = useSearchParams();
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "login") setTab(1);
    else if (tabParam === "signup") setTab(0);
  }, [searchParams]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          firstName,
          lastName,
          username,
          email: signupEmail,
          password: signupPassword,
        },
      );

      console.log("User registered:", response.data);
      alert("Registration successful!");
      setTab(1);
    } catch (err: any) {
      console.error("Registration failed:", err.response?.data || err.message);
      alert(
        "Registration failed. " + (err.response?.data?.message || err.message),
      );
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<{ token: string; user: any }>(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          identifier: email,
          password,
          rememberMe,
        },
        {
          withCredentials: true,
        },
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);

      setUser(user);
      navigate("/taskList");

      alert("Login successful!");
    } catch (err: any) {
      console.error("Login failed:", err.response?.data || err.message);
      alert("Login failed. " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper
        elevation={6}
        sx={{
          borderRadius: 3,
          p: 4,
          bgcolor: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 4,
          }}
        >
          <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
            {/* <img src="/animation.gif" alt="Animated" style={{ width: 300 }} /> */}
            <DotLottieReact
              src="https://lottie.host/e93e9514-4c0a-411e-8dab-5738f71c0c58/fnRaBQ7M1Z.lottie"
              loop
              autoplay
              style={{ width: 300, height: 300 }}
            />
            {/* <script src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js" type="module"></script>
<dotlottie-wc src="https://lottie.host/e93e9514-4c0a-411e-8dab-5738f71c0c58/fnRaBQ7M1Z.lottie" style="width: 300px;height: 300px" speed="1" autoplay loop></dotlottie-wc> */}

            <Typography
              variant="h3"
              sx={{ color: "black", fontWeight: "bold", m: 3 }}
            >
              Give Yourself the Best Work Experience
            </Typography>
          </Box>

          <Box sx={{ flex: 1, width: "100%" }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
              <Tab label="Sign Up" />
              <Tab label="Log In" />
            </Tabs>

            {tab === 0 && (
              <Box component="form" onSubmit={handleSignup} sx={{ mt: 3 }}>
                <>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    align="center"
                    gutterBottom
                  >
                    Create your TaskY account
                  </Typography>

                  <IconButton
                    sx={{
                      alignContent: "center",
                      width: 400,
                      m: 3,
                      border: "2px solid #d13232ff",
                      borderRadius: 2,
                      p: 2,
                      flex: 1,
                      "&:hover": {
                        borderColor: "#1f0503ff",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <GoogleIcon sx={{ color: "#077739ff" }} />
                  </IconButton>

                  <Divider sx={{ my: 3, position: "relative" }}>
                    <Typography
                      sx={{
                        px: 2,
                        backgroundColor: "cream",
                        color: "grey",
                      }}
                    >
                      OR
                    </Typography>
                  </Divider>

                  <TextField
                    fullWidth
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Sign Up
                  </Button>

                  <Typography align="center" sx={{ mt: 2 }}>
                    Already have an account?{" "}
                    <Link component="button" onClick={() => setTab(1)}>
                      Log In
                    </Link>
                  </Typography>
                </>
              </Box>
            )}

            {tab === 1 && (
              <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  align="center"
                  gutterBottom
                >
                  Welcome back to Tasky
                </Typography>
                <IconButton
                  sx={{
                    alignContent: "center",
                    width: 400,
                    m: 3,
                    border: "2px solid #d13232ff",
                    borderRadius: 2,
                    p: 2,
                    flex: 1,
                    "&:hover": {
                      borderColor: "#1f0503ff",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <GoogleIcon sx={{ color: "#077739ff" }} />
                </IconButton>

                <Divider sx={{ my: 3, position: "relative" }}>
                  <Typography
                    sx={{
                      px: 2,
                      backgroundColor: "cream",
                      color: "grey",
                    }}
                  >
                    OR
                  </Typography>
                </Divider>

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  }
                  label="Remember me"
                  sx={{ mb: 2 }}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Log In
                </Button>

                <Typography align="center" sx={{ mt: 2 }}>
                  Don't have an account?{" "}
                  <Link component="button" onClick={() => setTab(0)}>
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
