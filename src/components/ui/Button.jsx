import React from "react";

const Button = ({
  children,
  type = "button",
  onClick = () => { },
  variant = "primary",
  className = "",
  ...props
}) => {
  let styles =
    "px-4 py-1.5 border-[1.5px] rounded-md font-medium transition duration-300 hover:scale-105 hover:shadow-md hover:shadow-primary ";

  if (variant === "primary") {
    styles += " bg-primary text-white border-primary";
  } else if (variant === "secondary") {
    styles += "bg-base-100 text-base-content border-0 border-base-100";
  } else if (variant === "outline") {
    styles += "text-primary border-primary";
  } else if (variant === "danger") {
    styles += "bg-red-500 text-white border-0 border-red-500 hover:shadow-md";
  } else {
    styles += "bg-gray-200 text-black";
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
