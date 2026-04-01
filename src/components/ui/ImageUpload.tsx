import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";

interface ImageUploadProps {
  fieldName: string;
  label: string;
  control: any;
  onImageSelect?: (file: File, preview: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  fieldName,
  label,
  control,
  onImageSelect,
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        if (onImageSelect) {
          onImageSelect(file, result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border border-gray-500 rounded p-4">
      <label htmlFor={fieldName} className="block text-gray-300 mb-2 font-semibold">
        {label}
      </label>
      <input
        id={fieldName}
        type="file"
        accept="image/*"
        className="bg-gray-700 p-2 rounded w-full text-gray-300"
        onChange={handleFileChange}
      />
      {preview && (
        <div className="mt-4">
          <p className="text-gray-300 mb-2">Vista previa:</p>
          <img
            src={preview}
            alt="Preview"
            className="max-w-xs h-auto rounded border border-gray-500"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
