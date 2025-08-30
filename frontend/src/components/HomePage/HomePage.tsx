import React, { useContext, useEffect, useState } from "react";
import "./HomePage.css";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Task } from "../../models/task.model";
import TaskGrid from "./TaskGrid/TaskGrid";
import Sidebar from "./Sidebar";
import { useCategories } from "../../context/CategoryContext";
import GeminiChatButton from "./GeminiChatButton";

const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();
  const userId = user?.sub;
  console.log(userId);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const { selectedCategory } = useCategories();
  const handleTaskCreated = () => {
    setFetchTrigger((prev) => !prev);
  };

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const createUser = async () => {
      if (!user || !isAuthenticated) return;

      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/users`, {
          auth0Id: user.sub,
          email: user.email,
        });
        console.log("User created or already exists");
      } catch (error) {
        console.error("Failed to create user:", error);
      }
    };

    createUser();
  }, [user, isAuthenticated]);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/tasks?userId=${userId}`
      );
      console.log(res.data);
      setTasks(res.data);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTrigger]);

  return (
    <div className="home-page">
      <Sidebar />
      <div className="main-content">
        <p className="category-title">
          {selectedCategory ? selectedCategory?.title : "All Tasks"}
        </p>
        <TaskGrid tasks={tasks} onTaskCreated={handleTaskCreated} />
      </div>
      <GeminiChatButton onTaskCreated={handleTaskCreated}></GeminiChatButton>
    </div>
  );
};

export default HomePage;
