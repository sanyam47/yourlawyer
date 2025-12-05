"use client";

import { useState } from "react";
import { Upload, FileText, XCircle } from "lucide-react";

export default function DocumentsPage() {
  const [files, setFiles] = useState([]);

  const handleFileUpload = (e) => {
    const uploaded = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...uploaded]);
  };

  const handleRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = () => {
    alert("Mock analysis started! In the real app, AI will process the uploaded document.");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-inter flex flex-col">
      {/* Header */}
      <header className="bg-[#13233F] text-white p-4 shadow-md">
        <h1 className="text-xl font-semibold">Document Upload & Analysis</h1>
        <p className="text-sm opacity-80">Upload contracts or legal documents for quick review</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-slate-300 rounded-lg bg-white p-10 text-center hover:bg-slate-50 transition">
          <Upload size={32} className="mx-auto mb-3 text-[#13233F]" />
          <p className="text-slate-700 mb-3">
            Drag & drop your files here, or click below to upload
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-block bg-[#13233F] text-white px-5 py-2 rounded-md hover:bg-[#1a2b55] transition"
          >
            Browse Files
          </label>
        </div>

        {/* Uploaded Files List */}
        {files.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-[#13233F] mb-4">
              Uploaded Documents
            </h2>
            <ul className="space-y-3">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-white border border-slate-200 rounded-md p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-[#13233F]" />
                    <span className="text-slate-800 text-sm">{file.name}</span>
                  </div>
                  <button
                    onClick={() => handleRemove(index)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <XCircle size={18} />
                  </button>
                </li>
              ))}
            </ul>

            {/* Analyze Button */}
            <div className="mt-6 text-right">
              <button
                onClick={handleAnalyze}
                className="bg-[#13233F] text-white px-6 py-2 rounded-md hover:bg-[#1a2b55] transition"
              >
                Analyze Documents
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
