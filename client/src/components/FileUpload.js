import React, { useState } from "react";
import axios from "axios";
export const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);


  const handleFileChange = (e) => {
    let file = e.target.files
    setSelectedFiles(file);


  };

  const handleUpload = async () => {
    const selectedFilesArray = [...selectedFiles];
    const formData = new FormData();
    selectedFilesArray.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post('http://localhost:3001/upload', formData);
      console.log(response.data);

    } catch (error) {
      console.error(error);

    }
  };
  console.log(selectedFiles);
  return (
    <div className="flex flex-col gap-y-6">
      <label className="block">
        <span className="sr-only">Choose Audio File</span>
        <input
          onChange={handleFileChange}
          type="file"
          className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-500 file:text-white
          hover:file:bg-blue-600
        "/>
      </label>
      <button
        onClick={handleUpload}
        className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-black hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        Upload
      </button>
    </div>
  );
};
