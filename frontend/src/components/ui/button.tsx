import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline"; // 추가 가능한 variant 옵션 정의
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  ...props
}) => {
  const variantStyles =
    variant === "outline"
      ? "border border-gray-500 text-gray-500 bg-white"
      : "bg-blue-500 text-white";

  return (
    <button className={`px-4 py-2 rounded ${variantStyles}`} {...props}>
      {children}
    </button>
  );
};
