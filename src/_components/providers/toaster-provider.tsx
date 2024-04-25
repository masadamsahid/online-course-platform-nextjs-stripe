"use client";

import { Toaster } from "react-hot-toast";


type ToasterProviderProps = {}

export const ToasterProvider = (props: ToasterProviderProps) => {
  return (
    <Toaster />
  );
}