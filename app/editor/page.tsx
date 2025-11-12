"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function EditorPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setProcessedImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      // Convert base64 to blob
      const response = await fetch(selectedImage);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("image", blob);

      const apiResponse = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      if (!apiResponse.ok) {
        throw new Error("Failed to process image");
      }

      const data = await apiResponse.json();
      setProcessedImage(data.processedImage);
    } catch (error) {
      console.error("Error processing image:", error);
      setError("Failed to process image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "faceprivacy-anonymized.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setSelectedImage(null);
    setProcessedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                FacePrivacy
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-slate-700 hover:text-slate-900">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Face Privacy Editor
          </h1>
          <p className="text-xl text-slate-600">
            Upload a photo and our AI will automatically blur background faces
          </p>
        </div>

        {!selectedImage ? (
          /* Upload Section */
          <div className="max-w-2xl mx-auto">
            <div
              className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-colors ${
                dragActive
                  ? "border-purple-500 bg-purple-50"
                  : "border-slate-300 hover:border-slate-400 bg-white"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-8xl mb-6">📸</div>
                <div>
                  <p className="text-2xl font-semibold text-slate-900 mb-3">
                    Drop your photo here
                  </p>
                  <p className="text-lg text-slate-600 mb-4">
                    or click to browse
                  </p>
                  <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold">
                    Choose Photo
                  </div>
                  <p className="text-sm text-slate-500 mt-4">
                    Supports JPG, PNG, HEIC • Max 10MB
                  </p>
                </div>
              </label>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-4 mt-12">
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="text-3xl mb-2">🔒</div>
                <p className="text-sm font-semibold text-slate-900 mb-1">Privacy First</p>
                <p className="text-xs text-slate-600">
                  Processed securely, never stored
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="text-3xl mb-2">⚡</div>
                <p className="text-sm font-semibold text-slate-900 mb-1">Instant Results</p>
                <p className="text-xs text-slate-600">
                  Processing takes seconds
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="text-3xl mb-2">✨</div>
                <p className="text-sm font-semibold text-slate-900 mb-1">High Quality</p>
                <p className="text-xs text-slate-600">
                  Natural-looking blur
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Preview & Process Section */
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Original Image */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-slate-700">ORIGINAL</p>
                  <button
                    onClick={reset}
                    className="text-sm text-slate-600 hover:text-slate-900"
                  >
                    ← Change Photo
                  </button>
                </div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <img
                    src={selectedImage}
                    alt="Original"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Processed Image */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">
                  PROCESSED {processedImage && "✓"}
                </p>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {processedImage ? (
                    <div className="relative">
                      <img
                        src={processedImage}
                        alt="Processed"
                        className="w-full h-auto"
                      />
                      {/* Watermark overlay visible on preview */}
                      <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded text-xs font-semibold text-slate-700">
                        FacePrivacy.ai
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[4/3] flex items-center justify-center bg-slate-50">
                      {loading ? (
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                          <p className="text-slate-600 font-medium">
                            AI is detecting and blurring faces...
                          </p>
                          <p className="text-sm text-slate-500 mt-2">
                            This may take 10-30 seconds
                          </p>
                        </div>
                      ) : (
                        <div className="text-center p-8">
                          <div className="text-6xl mb-4">🤖</div>
                          <p className="text-slate-600">
                            Click "Process Image" to start
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {!processedImage ? (
                <button
                  onClick={processImage}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Process Image"}
                </button>
              ) : (
                <>
                  <button
                    onClick={downloadImage}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    Download Image (with watermark)
                  </button>
                  <button
                    onClick={reset}
                    className="px-8 bg-white text-slate-900 py-4 rounded-xl text-lg font-semibold border-2 border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    Process Another
                  </button>
                </>
              )}
            </div>

            {/* Upgrade CTA */}
            {processedImage && (
              <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-2">
                  Want images without watermark?
                </h3>
                <p className="text-purple-100 mb-4">
                  Upgrade to Premium for $19/month and get watermark-free images plus batch
                  processing
                </p>
                <button
                  disabled
                  className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold cursor-not-allowed opacity-50"
                >
                  Coming Soon
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
