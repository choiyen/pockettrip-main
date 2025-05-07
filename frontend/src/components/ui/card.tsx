import React from "react";

export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="shadow-lg rounded-lg p-4 bg-white">{children}</div>
);

export const CardContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div>{children}</div>;
