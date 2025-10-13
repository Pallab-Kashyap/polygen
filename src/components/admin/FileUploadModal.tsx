"use client";
import { useState, useRef, useEffect } from "react";
import { FileUp, Loader2 } from "lucide-react";
import Modal from "../shared/Modal";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (formData: FormData) => void;
  loading: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const FileUploadModal = ({
  isOpen,
  onClose,
  onUpload,
  loading,
}: FileUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear file when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      // Check file size
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError("File size exceeds 5MB. Please select a smaller file.");
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      onUpload(formData);
      // Clear file after upload
      setFile(null);
      setError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Upload Products">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
        <FileUp className="mx-auto h-12 w-12 text-gray-400" />
        {file ? (
          <div>
            <p className="mt-2 text-gray-700">{file.name}</p>
            <p className="text-xs text-gray-500 mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div>
            <p className="mt-2 text-gray-500">
             {' Click to select a CSV or Excel file (max 5MB) '}
            </p>
          </div>
        )}
        {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-blue-400"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Upload
        </button>
      </div>
    </Modal>
  );
};

export default FileUploadModal;
