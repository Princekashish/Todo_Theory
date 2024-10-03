import React from "react";

interface FormButtonProps {
  label: string;
  className?: string;
  disabled?: boolean;
  onClick?:()=>void 
}

const FormButton: React.FC<FormButtonProps> = ({ label, className,disabled,onClick }) => {
  return (
    <button
      type="submit"
      className={`px-4 py-2 ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default FormButton;
