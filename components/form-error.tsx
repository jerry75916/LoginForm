"use client";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React from "react";
interface FormErrorProps {
  message: string | undefined;
}
export const FormError = ({ message }: FormErrorProps) => {
  if (!message) {
    return null;
  } else {
    return (
      <div className=" bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <p>{message}</p>
      </div>
    );
  }
};
