import React, { useCallback, useEffect, useState } from "react";
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
import { Check, Pencil, Trash } from "lucide-react";

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
      const tasksArray: Task[] = taskSnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Task)
      );
      setTasks(tasksArray);
    } catch (err) {
      console.error("Error fetching tasks: ", err);
    }
  };

  // Handle authentication status changes
  const handleAuthChange = useCallback(
    (isAuthenticated: boolean, email?: string | null) => {
      setIsUser(isAuthenticated);
      setUserEmail(email || null);
      if (!isAuthenticated) setTasks([]);
    },
    []
  );

  // Handle task submission
  const handleSubmit = async (task: string) => {
    if (!userEmail) return;
    await saveTask(task);
  };

  // Save a new task to Firestore
  const saveTask = useCallback(
    async (task: string) => {
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
    },
    [userEmail]
  );

  // Toggle task completion
  const toggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      try {
        await updateDoc(doc(db, "tasks", id), updatedTask);
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === id ? updatedTask : t))
        );
      } catch (error) {
        console.error("Error updating task: ", error);
      }
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  // Handle editing the task
  const editTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.task);
  };

  // Save the edited task
  const saveEditedTask = useCallback(
    async (id: string) => {
      const updatedTask = tasks.find((task) => task.id === id);
      try {
        if (updatedTask) {
          const newTaskData = { ...updatedTask, task: editingTaskText };
          await updateDoc(doc(db, "tasks", id), newTaskData);
          setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === id ? newTaskData : task))
          );
          setEditingTaskId(null);
        }
      } catch (error) {
        console.error("Error updating task: ", error);
      }
    },
    [tasks, editingTaskText]
  );

  return (
    <div className="flex  h-[92vh] justify-center p-5 ">
      <AuthStatus onAuthChange={handleAuthChange} />
      {isUser && userEmail ? (
        <div className=" w-full flex  flex-col items-center  ">
          <div className=" ">
            <h1 className="text-neutral-700 text-[40px] font-extrabold">
              My ToDo
            </h1>
          </div>
          <div className="flex mt-6 justify-center items-center   w-full">
            <div className="w-full  ">
              <AddItems
                handleSubmit={handleSubmit}
                className=" flex justify-center items-center "
              />
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="flex justify-center items-center pt-4 text-red-600">
              <h1>Add some tasks</h1>
            </div>
          ) : (
            <div className="mt-5 space-y-2 rounded-lg w-4/5">
              <h1 className="text-neutral-700/50 text-xl font-bold ">
                ToDo List Title
              </h1>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex justify-between items-center p-3 rounded-xl shadow-sm transition-colors duration-300 ${
                    task.completed
                      ? "bg-[#D9EDDD] text-green-600"
                      : "bg-[#F5F5F5] text-black"
                  }`}
                >
                  <div className="flex gap-4 items-center justify-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id)}
                      className={`cursor-pointer text-white w-5 h-5 rounded-full transition-colors duration-300 ${
                        task.completed
                          ? "bg-green-600 border-green-600"
                          : "border-gray-300"
                      }`}
                    />
                    {editingTaskId === task.id ? (
                      <input
                        type="text"
                        value={editingTaskText}
                        onChange={(e) => setEditingTaskText(e.target.value)}
                        className="border px-5 py-2 rounded-xl outline-none w-[330px]"
                      />
                    ) : (
                      <span
                        onClick={() => toggleComplete(task.id)}
                        className={`cursor-pointer text-xl ${
                          task.completed ? "line-through " : ""
                        }`}
                      >
                        {task.task}
                      </span>
                    )}
                  </div>
                  <div
                    className={`flex justify-center items-center gap-3 ${
                      task.completed ? "text-red-600" : ""
                    }`}
                  >
                    <button
                      onClick={() => editTask(task)}
                      className="flex justify-center items-center"
                    >
                      {editingTaskId === task.id ? (
                        <button onClick={() => saveEditedTask(task.id)}>
                          <Check />
                        </button>
                      ) : (
                        <button onClick={() => editTask(task)}>
                          <Pencil />
                        </button>
                      )}
                    </button>
                    <button onClick={() => deleteTask(task.id)}>
                      <Trash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center   w-full">
          <div className="flex flex-col justify-center items-center font-Raleway">
            <h1 className="text-[4em]  font-bold ">
              Your Daily Planner, Simplified.
            </h1>
            <p className=" text-gray-400 ">
              Focus on what matters with easy task management.{" "}
            </p>
          </div>
          <div className="flex mt-6 justify-center items-center  h-[20vh] w-full">
            <div className="w-1/2  ">
              <AddItems
                handleSubmit={handleSubmit}
                className=" flex justify-center items-center "
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TaskList;
