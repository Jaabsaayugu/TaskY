import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import useUser from "./store/userStore";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Authentication";
// import Header from "./components/Header";
import TasksList from "./pages/TasksList";
import NewTask from "./pages/NewTask";
import Profile from "./pages/Profile";
import CompletedTasks from "./pages/CompletedTasks";
import Trash from "./pages/Trash";
import Layout from "./components/layout";

function App() {
  const setUser = useUser((state) => state.setUser);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
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
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/taskList" element={<Layout><TasksList /></Layout>} />
        <Route path="/newTask" element={<Layout><NewTask /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/completedTasks" element={<Layout><CompletedTasks /></Layout>} />
        <Route path="/trash" element={<Layout><Trash /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
