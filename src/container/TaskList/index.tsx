import React, { useEffect, useState } from "react";
import AddItems from "../../view/AddItems";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import AuthStatus from "../../components/custom/AuthStatus";

interface Task {
  id: string;
  task: string;
  completed: boolean;
  userEmail: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isUser, setIsUser] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState<string>("");

  useEffect(() => {
    if (userEmail) {
      fetchTasks(userEmail);
    }
  }, [userEmail]);

  // Fetch tasks from Firestore
  const fetchTasks = async (email: string) => {
    try {
      const q = query(collection(db, "tasks"), where("userEmail", "==", email));
      const taskSnapshot = await getDocs(q);
      const tasksFromDB: Task[] = [];

      taskSnapshot.forEach((doc) => {
        tasksFromDB.push({ id: doc.id, ...doc.data() } as Task);
      });

      setTasks(tasksFromDB);
    } catch (err) {
      console.error("Error fetching tasks: ", err);
    }
  };

  // Handle authentication status changes
  const handleAuthChange = (
    isAuthenticated: boolean,
    email?: string | null
  ) => {
    setIsUser(isAuthenticated);
    setUserEmail(email || null);

    if (isAuthenticated && email) {
      fetchTasks(email);
    } else {
      setTasks([]); // Clear tasks when logged out
    }
  };

  // Handle task submission
  const handleSubmit = async (task: string) => {
    if (!userEmail) return;
    await saveTask(task);
  };

  // Save a new task to Firestore
  const saveTask = async (task: string) => {
    const docID = Date.now().toString();
    const newTask: Task = {
      id: docID,
      task,
      completed: false,
      userEmail: userEmail || "",
    };

    try {
      await setDoc(doc(db, "tasks", docID), newTask);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  // Toggle task completion
  const toggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      await updateDoc(doc(db, "tasks", id), updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === id ? updatedTask : t))
      );
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // Handle editing the task
  const editTask = (task: Task) => {
    setEditingTaskId(task.id); 
    setEditingTaskText(task.task); 
  };

  // Save the edited task
  const saveEditedTask = async (id: string) => {
    try {
      const updatedTask = tasks.find((task) => task.id === id);
      if (updatedTask) {
        const newTaskData = { ...updatedTask, task: editingTaskText }; 
        await updateDoc(doc(db, "tasks", id), newTaskData);
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === id ? newTaskData : task))
        );
        setEditingTaskId(null); // Exit edit mode
      }
    } catch (error) {
      console.error("Error saving edited task: ", error);
    }
  };

  // Handle keypress when editing
  const handleEditKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string
  ) => {
    if (e.key === "Enter") {
      saveEditedTask(id); 
    }
  };

  return (
    <div className="flex bg-zinc-900 h-screen justify-center items-center">
      <AuthStatus onAuthChange={handleAuthChange} />
      {isUser && userEmail ? (
        <div>
          <AddItems handleSubmit={handleSubmit} />
          {tasks.length === 0 ? (
            <div className="flex justify-center items-center pt-4 text-red-600">
              <h1>Add some tasks</h1>
            </div>
          ) : (
            <ul className="mt-5 space-y-2 rounded-lg bg-gray-200 h-[430px] overflow-hidden overflow-y-scroll">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex justify-between p-3 text-black gap-6 items-center"
                >
                  <div className="flex gap-4">
                    {/* Checkbox for marking task as complete */}
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id)}
                      className="cursor-pointer flex flex-wrap"
                    />
                    {/* If editing, show input; otherwise, show task description */}
                    {editingTaskId === task.id ? (
                      <input
                        type="text"
                        value={editingTaskText}
                        onChange={(e) => setEditingTaskText(e.target.value)}
                        onKeyPress={(e) => handleEditKeyPress(e, task.id)}
                        className="border px-2 py-1 rounded"
                      />
                    ) : (
                      <span
                        onClick={() => toggleComplete(task.id)}
                        className={`cursor-pointer ${
                          task.completed ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {task.task}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-center items-center gap-3">
                    {/* Button to edit task */}
                    <button onClick={() => editTask(task)}>📕</button>
                    {/* Button to delete task */}
                    <button onClick={() => deleteTask(task.id)}>❌</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <AddItems handleSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default TaskList;
