import React from "react";

interface FormInputProps {
  type: string;
  placeholder?: string;
  value?: string;
  name?:string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?:string
}

const FormInput: React.FC<FormInputProps> = ({
  placeholder = "Task**",
  value = "",
  name,
  onChange,
  type,
  className
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      className={`px-4 py-2 outline-none border border-black    rounded-lg ${className}`}
    />
  );
};

export default FormInput;
