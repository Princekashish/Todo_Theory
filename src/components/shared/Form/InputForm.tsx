// InputForm.tsx
import React, { useState } from "react";
import FormInput from "../../base/FormInput";
import FormButton from "../../base/FormButton";
import AuthStatus from "../../custom/AuthStatus";
import LoginForm from "./LoginForm";

interface Submit {
  onSubmit: (task: string) => void;
  className: string;
}

const InputForm: React.FC<Submit> = ({ onSubmit, className }) => {
  const [task, setTask] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isUser, setIsUser] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isUser) {
      setShowLoginPopup(true);
    } else {
      if (task.trim()) {
        onSubmit(task);
        setTask("");
      }
    }
  };

  return (
    <div>
      <AuthStatus onAuthChange={setIsUser} />
      <form onSubmit={handleSubmit} className={`${className} w-full flex gap-5`}>
        <FormInput
          type="input"
          name="task"
          placeholder="Enter the task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-1/2 "
        />
        <FormButton label="submit " className="rounded-lg bg-black text-white font-medium" />
      </form>
      {showLoginPopup && <LoginForm onClose={() => setShowLoginPopup(false)} />}
    </div>
  );
};

export default InputForm;
