import mongoose from "mongoose";

// Example function to convert string to ObjectId in the backend
function isValidObjectId(id: string): boolean {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
}

export function convertToObjectId(id: string) {
  if (!isValidObjectId(id)) {
    throw new Error("Invalid ObjectId format");
  }
  return new mongoose.Types.ObjectId(id);
}
