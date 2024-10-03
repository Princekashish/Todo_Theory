import React from "react";
import InputForm from "../../components/shared/Form/InputForm";

interface AddItemsProps {
  handleSubmit: (type:string)=>void
}

const AddItems: React.FC<AddItemsProps> = ({ handleSubmit }) => {
  return <InputForm onSubmit={handleSubmit} className=""/>;
};

export default AddItems;
