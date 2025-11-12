"use client";

import { useState } from "react";
import Link from "next/link";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [contractText, setContractText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

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
    // Check if file is PDF or TXT
    if (file.type === "application/pdf" || file.type === "text/plain") {
      setFile(file);
    } else {
      alert("Please upload a PDF or TXT file");
    }
  };

  const handleAnalyze = async () => {
    if (!file && !contractText) {
      alert("Please upload a file or paste contract text");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      } else {
        formData.append("text", contractText);
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Error analyzing contract:", error);
      alert("Error analyzing contract. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-slate-900">ContractGuard</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-slate-700 hover:text-slate-900">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!analysis ? (
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Analyze Your Contract
              </h1>
              <p className="text-xl text-slate-600">
                Upload your contract or paste the text below for instant AI-powered analysis
              </p>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                  Upload Document
                </h2>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-300 hover:border-slate-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.txt"
                    onChange={handleChange}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-6xl mb-4">📄</div>
                    {file ? (
                      <div>
                        <p className="text-lg font-semibold text-slate-900 mb-2">
                          {file.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setFile(null);
                          }}
                          className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-semibold text-slate-900 mb-2">
                          Drop your contract here or click to browse
                        </p>
                        <p className="text-sm text-slate-500">
                          Supports PDF and TXT files (max 10MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500 font-medium">OR</span>
                </div>
              </div>

              {/* Text Input */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                  Paste Contract Text
                </h2>
                <textarea
                  className="w-full h-64 px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors resize-none"
                  placeholder="Paste your contract text here..."
                  value={contractText}
                  onChange={(e) => setContractText(e.target.value)}
                  disabled={!!file}
                />
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={loading || (!file && !contractText)}
                className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Analyzing Contract...
                  </span>
                ) : (
                  "Analyze Contract"
                )}
              </button>

              <p className="text-center text-sm text-slate-500 mt-4">
                Your contract is analyzed securely. We don't store your documents.
              </p>
            </div>

            {/* Features Preview */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-3xl mb-3">⚠️</div>
                <h3 className="font-semibold text-slate-900 mb-2">Risk Detection</h3>
                <p className="text-sm text-slate-600">
                  Identifies unfair terms and potential legal issues
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-3xl mb-3">💡</div>
                <h3 className="font-semibold text-slate-900 mb-2">Smart Suggestions</h3>
                <p className="text-sm text-slate-600">
                  Get specific language to negotiate better terms
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold text-slate-900 mb-2">Clear Summary</h3>
                <p className="text-sm text-slate-600">
                  Plain English explanation of complex legal terms
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Results Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Analysis Results</h1>
                <button
                  onClick={() => {
                    setAnalysis(null);
                    setFile(null);
                    setContractText("");
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Analyze Another Contract
                </button>
              </div>

              {/* Overall Risk Score */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                      Overall Risk Score
                    </h2>
                    <p className="text-slate-600">
                      Based on our comprehensive analysis
                    </p>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-6xl font-bold ${
                        analysis.riskScore > 70
                          ? "text-red-600"
                          : analysis.riskScore > 40
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {analysis.riskScore}
                    </div>
                    <p className="text-sm text-slate-500 mt-2">out of 100</p>
                  </div>
                </div>
              </div>

              {/* Key Findings */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-6">
                  Key Findings
                </h2>
                <div className="space-y-6">
                  {analysis.findings?.map((finding: any, index: number) => (
                    <div
                      key={index}
                      className={`p-6 rounded-xl border-l-4 ${
                        finding.severity === "high"
                          ? "bg-red-50 border-red-500"
                          : finding.severity === "medium"
                          ? "bg-yellow-50 border-yellow-500"
                          : "bg-blue-50 border-blue-500"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {finding.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            finding.severity === "high"
                              ? "bg-red-200 text-red-800"
                              : finding.severity === "medium"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-blue-200 text-blue-800"
                          }`}
                        >
                          {finding.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-700 mb-4">{finding.description}</p>
                      {finding.recommendation && (
                        <div className="bg-white p-4 rounded-lg">
                          <p className="text-sm font-semibold text-slate-900 mb-1">
                            💡 Recommendation:
                          </p>
                          <p className="text-sm text-slate-700">{finding.recommendation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                  Plain English Summary
                </h2>
                <div className="prose max-w-none text-slate-700">
                  <p>{analysis.summary}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors">
                  Export as PDF
                </button>
                <button className="flex-1 bg-white text-slate-900 py-4 rounded-xl text-lg font-semibold border-2 border-slate-200 hover:border-slate-300 transition-colors">
                  Save to Dashboard
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
