import React from "react";
import "./Button.css";

interface ButtonProps {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, icon, onClick }) => {
  return (
    <button className="button" onClick={onClick}>
      {icon}

      {title}
    </button>
  );
};

export default Button;
