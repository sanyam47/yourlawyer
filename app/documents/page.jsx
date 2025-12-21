"use client";

import { useState } from "react";
import { Upload, FileText, XCircle } from "lucide-react";

export default function DocumentsPage() {
  const [files, setFiles] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const uploaded = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...uploaded]);
  };

  const handleRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (files.length === 0) {
      alert("Please upload a document first");
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      setLoading(true);
      setAnalysis(null);

      const res = await fetch("http://localhost:5000/api/documents/analyze", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Analysis failed");
        return;
      }

      setAnalysis(data.analysis);
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#13233F] text-white p-4">
        <h1 className="text-xl font-semibold">Document Upload & Analysis</h1>
        <p className="text-sm opacity-80">
          Upload contracts or legal documents for quick review
        </p>
      </header>

      <main className="flex-1 p-8">
        <div className="border-2 border-dashed rounded-lg bg-white p-10 text-center">
          <Upload size={32} className="mx-auto mb-3 text-[#13233F]" />
          <p className="mb-3">Drag & drop files or browse</p>

          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />

          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-[#13233F] text-white px-5 py-2 rounded-md"
          >
            Browse Files
          </label>
        </div>

        {files.length > 0 && (
          <div className="mt-8">
            <ul className="space-y-3">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex justify-between bg-white p-4 rounded-md border"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={20} />
                    <span>{file.name}</span>
                  </div>

                  <button onClick={() => handleRemove(index)}>
                    <XCircle size={18} className="text-red-500" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 text-right">
              <button
                onClick={handleAnalyze}
                className="bg-[#13233F] text-white px-6 py-2 rounded-md"
              >
                Analyze Documents
              </button>
            </div>
          </div>
        )}

        {loading && (
          <p className="mt-6 font-medium">Analyzing document...</p>
        )}

        {analysis && (
          <div className="mt-8 bg-white p-6 rounded-md border">
            <h3 className="text-lg font-semibold mb-3">AI Analysis</h3>
            <pre className="whitespace-pre-wrap text-sm">{analysis}</pre>
          </div>
        )}
      </main>
    </div>
  );
}
