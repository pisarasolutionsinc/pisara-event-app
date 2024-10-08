import { useRef, useState } from "react";

const usePropsContext2 = () => {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (
    e: React.DragEvent,
    onFileUpload: (files: File[]) => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const imageFile = files[0]; // Get the first file for image preview
      if (imageFile && imageFile.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(imageFile);
        setSelectedImage(imageUrl); // Update the image URL for preview
      }
      onFileUpload(files);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the input
      }
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    onFileUpload: (files: File[]) => void,
    variant = "default"
  ) => {
    const files = e.target.files; // Get the files from the input

    if (variant === "image") {
      const file = files?.[0] || null; // Use optional chaining to safely access the first file
      if (file) {
        const imageUrl = URL.createObjectURL(file); // Create a URL for the selected file
        setSelectedImage(imageUrl); // Update state with the image URL
        onFileUpload([file]); // Call your upload function with the file in an array
      }
    } else {
      if (files && files.length > 0) {
        // Ensure files is not null and has length
        onFileUpload(Array.from(files)); // Convert FileList to array and upload
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset the input
        }
      }
    }
  };

  return {
    dragging,
    setDragging,
    fileInputRef,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    selectedImage,
  };
};

export default usePropsContext2;
