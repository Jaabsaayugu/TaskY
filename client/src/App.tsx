import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";
import axios from "axios";
import useUser from "./store/userStore";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Authentication";
import Header from "./components/Header";
import TasksList from "./pages/TasksList";

function App() {
  const setUser = useUser((state) => state.setUser);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:4000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const data = res.data as { user: any };
          setUser(data.user);
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, []);
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/taskList" element={<TasksList />} />
      </Routes>
    </Router>
  );
}

export default App;
