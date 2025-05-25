import React, { useEffect, useState } from "react";
import "./HomePage.css";
import Profile from "./Profile";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Task } from "../models/task.model";
import TaskGrid from "./TaskGrid";

const HomePage: React.FC = () => {
  const { user } = useAuth0();
  const userId = user?.sub;
  console.log(userId);

  const [tasks, setTasks] = useState<Task[]>([]);

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
  }, []);

  return (
    <div className="home-page">
      <h1>Home Page</h1>
      <TaskGrid tasks={tasks}></TaskGrid>
      <Profile></Profile>
    </div>
  );
};

export default HomePage;
