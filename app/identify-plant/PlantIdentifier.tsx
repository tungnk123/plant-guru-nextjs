import { useState } from "react";
import { Upload } from "lucide-react";

const PlantIdentifier = () => {
  const [image, setImage] = useState<string | null>("/images/img_upload_image.png");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; 
    if (file) {
      setImage(URL.createObjectURL(file)); 
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      <h1 className="text-2xl font-bold text-gray-800 mt-4">Identify Plants for free</h1>
      <p className="text-sm text-gray-600 mt-2 text-center max-w-md">
        Instantly identify plants, flowers, and trees. Explore gardening tips,
        detailed care guides, and the plant world around you.
      </p>

      <div  className="mt-4 p-6 rounded-lg shadow-md flex flex-col items-center w-[600px] bg-[#80FF0022] border-2 border-black">
        <div className="w-[250px] h-[250px] bg-gray-100 flex items-center justify-center rounded-md mb-4">
          {image ? (
            <img
              src={image}
              alt="Uploaded"
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <p className="text-gray-500">No image selected</p>
          )}
        </div>
        <p>or drag and drop an image</p>

        <div className="mt-4">
          <label
            htmlFor="file-upload"
            className="flex items-center gap-2 bg-yellow-300 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 cursor-pointer"
          >
            <Upload className="w-5 h-5" />
            Upload an image
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default PlantIdentifier;
