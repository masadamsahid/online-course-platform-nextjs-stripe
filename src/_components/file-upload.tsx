"use client";

import { type ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import toast from "react-hot-toast";

type FileUploadProps = {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ onChange, endpoint, ...props }: FileUploadProps) => {
  
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        console.log(res);
        onChange(res?.[0].url)
      }}
      onUploadError={(err: Error) => {
        console.log(err);
        toast.error(`${err?.message}`);
      }}
    />
  );
}
