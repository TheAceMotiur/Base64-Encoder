"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";

export default function Home() {
  const [textInput, setTextInput] = useState("");
  const [textOutput, setTextOutput] = useState("");
  const [activeTab, setActiveTab] = useState("textEncoder");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Text encoding/decoding functions
  const encodeText = () => {
    try {
      const encoded = window.btoa(textInput);
      setTextOutput(encoded);
    } catch (error) {
      setTextOutput("Error: Could not encode text. Make sure it's valid UTF-8.");
    }
  };

  const decodeText = () => {
    try {
      const decoded = window.atob(textInput);
      setTextOutput(decoded);
    } catch (error) {
      setTextOutput("Error: Could not decode. Invalid Base64 string.");
    }
  };

  // Image handling functions
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      // Extract the base64 part (remove the data:image/xxx;base64, prefix)
      const base64String = result.split(',')[1];
      setImageBase64(base64String);
    };
    
    reader.readAsDataURL(file);
  };

  const handleImageDecode = () => {
    try {
      if (!textInput.trim()) {
        setImagePreview(null);
        return;
      }
      
      // Try to determine image type or default to png
      let imageType = "image/png";
      
      // Check if it starts with data:image/ format (already has header)
      if (textInput.startsWith("data:image/")) {
        setImagePreview(textInput);
        return;
      }
      
      // Create data URL
      const dataUrl = `data:${imageType};base64,${textInput}`;
      setImagePreview(dataUrl);
    } catch (error) {
      console.error("Failed to decode image:", error);
      setImagePreview(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // UI rendering
  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 max-w-7xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Base64 Encoder/Decoder</h1>
        <p className="text-sm sm:text-base opacity-80">
          Easily encode or decode text and images to/from Base64 format
        </p>
      </header>

      <div className="mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-4 py-2 ${
              activeTab === "textEncoder"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("textEncoder")}
          >
            Text Encoder/Decoder
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "imageEncoder"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("imageEncoder")}
          >
            Image Base64
          </button>
        </div>
      </div>

      <main className="flex flex-1 flex-col">
        {activeTab === "textEncoder" ? (
          <div className="flex flex-col space-y-4">
            <div>
              <label
                htmlFor="input"
                className="block mb-1 text-sm font-medium"
              >
                Input Text
              </label>
              <textarea
                id="input"
                className="w-full h-40 p-3 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 font-mono text-sm"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text to encode or Base64 to decode..."
              />
            </div>

            <div className="flex space-x-2 justify-center">
              <button
                onClick={encodeText}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                Encode to Base64
              </button>
              <button
                onClick={decodeText}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
              >
                Decode from Base64
              </button>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label
                  htmlFor="output"
                  className="block text-sm font-medium"
                >
                  Output
                </label>
                {textOutput && (
                  <button
                    onClick={() => copyToClipboard(textOutput)}
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    Copy
                  </button>
                )}
              </div>
              <textarea
                id="output"
                readOnly
                className="w-full h-40 p-3 border rounded-md bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 font-mono text-sm"
                value={textOutput}
                placeholder="Result will appear here..."
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="max-w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-60 max-w-full mx-auto rounded"
                    />
                  </div>
                  <button
                    onClick={triggerFileInput}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                  >
                    Choose Another Image
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <svg
                    className="w-12 h-12 mx-auto text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click to upload an image or drag and drop
                  </p>
                  <button
                    onClick={triggerFileInput}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                  >
                    Select Image
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">
                  Image as Base64
                </label>
                {imageBase64 && (
                  <button
                    onClick={() => copyToClipboard(imageBase64)}
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    Copy
                  </button>
                )}
              </div>
              <textarea
                className="w-full h-32 p-3 border rounded-md bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 font-mono text-xs"
                value={imageBase64 || ""}
                readOnly
                placeholder="Upload an image to see its Base64 representation..."
              />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-5 mt-2">
              <p className="text-sm font-medium mb-2">Decode Base64 to Image</p>
              <textarea
                className="w-full h-32 p-3 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 font-mono text-xs mb-3"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste Base64 image data here..."
              />
              <button
                onClick={handleImageDecode}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
              >
                Preview Image
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 py-4 border-t text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Base64 Encoder/Decoder Tool © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
