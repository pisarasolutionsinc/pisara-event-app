import React, { useState } from "react";
import {
  removeFileFromCloudinary,
  uploadFileToCloudinary,
} from "../../services/cloudinaryService";

const CloudinaryUploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await uploadFileToCloudinary(selectedFile, "my-folder"); // You can change the folder name
      setUploadedImageUrl(response.secure_url);
      setPublicId(response.public_id);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!publicId) return;

    setLoading(true);
    setError(null);
    try {
      await removeFileFromCloudinary(publicId);
      setUploadedImageUrl(null);
      setPublicId(null);
    } catch (err) {
      setError("Failed to remove the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Cloudinary Upload & Remove</h1>

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading || !selectedFile}>
        {loading ? "Uploading..." : "Upload to Cloudinary"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {uploadedImageUrl && (
        <div>
          <h2>Uploaded Image:</h2>
          <img
            src={uploadedImageUrl}
            alt="Uploaded"
            style={{ width: "300px", height: "auto" }}
          />
          <button onClick={handleRemove} disabled={loading}>
            {loading ? "Removing..." : "Remove Image"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CloudinaryUploadPage;
