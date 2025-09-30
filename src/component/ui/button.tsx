import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  let base =
    "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none";
  let styles = "";

  switch (variant) {
    case "primary":
      styles = "bg-blue-600 text-white hover:bg-blue-700";
      break;
    case "secondary":
      styles = "bg-gray-200 text-gray-700 hover:bg-gray-300";
      break;
    case "outline":
      styles = "border border-gray-300 text-gray-700 hover:bg-gray-100";
      break;
  }

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
};
