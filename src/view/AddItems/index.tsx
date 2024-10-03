import React from "react";
import InputForm from "../../components/shared/Form/InputForm";

interface AddItemsProps {
  handleSubmit: (type:string)=>void
  className?:string;
}

const AddItems: React.FC<AddItemsProps> = ({ handleSubmit,className }) => {
  return <InputForm onSubmit={handleSubmit} className={`${className} `}/>;
};

export default AddItems;
