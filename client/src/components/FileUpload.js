import React from "react";

export const FileUpload = () => {
  return (
    <div>
      <label className="block">
        <span className="sr-only">Choose Audio File</span>
        <input
          type="file"
          className="block w-full text-sm text-gray-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-md file:border-0
      file:text-sm file:font-semibold
      file:bg-blue-500 file:text-white
      hover:file:bg-blue-600
    "
        />
      </label>
    </div>
  );
};
