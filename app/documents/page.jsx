"use client";

import { useState, useEffect } from "react";
import { Upload, FileText, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DocumentsPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [files, setFiles] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔑 Q&A states
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // 📄 Template Fill States
  const [fields, setFields] = useState([]);
  const [values, setValues] = useState({});

  // ✅ wait for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔐 auth check
  useEffect(() => {
    if (!mounted) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
    }
  }, [mounted, router]);

  // 📄 Load template fields
  useEffect(() => {
    async function loadFields() {
      try {
        const res = await fetch(
          "http://localhost:5000/api/template-fill/fields"
        );
        const data = await res.json();
        setFields(data.fields || []);
      } catch (err) {
        console.error("Failed to load template fields", err);
      }
    }

    loadFields();
  }, []);

  if (!mounted) return null;

  const handleFileUpload = (e) => {
    const uploaded = Array.from(e.target.files);
    setFiles(uploaded);
  };

  const handleRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setAnalysis(null);
    setAnswer("");
    setSelectedDocumentId(null);
  };

  /* =========================
       ANALYZE DOCUMENT
  ========================= */
  const handleAnalyze = async () => {
    if (files.length === 0) {
      alert("Please upload a document first");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      router.push("/auth");
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      setLoading(true);
      setAnalysis(null);
      setAnswer("");

      const res = await fetch(
        "http://localhost:5000/api/documents/analyze",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Analysis failed");
        return;
      }

      setAnalysis(data.analysis);
      setSelectedDocumentId(data.documentId || data._id || null);
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
       ASK QUESTION ABOUT DOC
  ========================= */
  const askQuestion = async () => {
    if (!question) {
      alert("Please type a question");
      return;
    }

    if (!selectedDocumentId) {
      alert("Document not analyzed yet");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/documents/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            documentId: selectedDocumentId,
            question,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to get answer");
        return;
      }

      setAnswer(data.answer);
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  /* =========================
       GENERATE FINAL PDF
  ========================= */
  async function generatePDF() {
    try {
      const res = await fetch(
        "http://localhost:5000/api/template-fill/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ values }),
        }
      );

      const data = await res.json();

      if (!data.downloadUrl) {
        alert("PDF generation failed");
        return;
      }

      // ✅ Open generated PDF
      window.open(data.downloadUrl, "_blank");
    } catch (err) {
      console.error(err);
      alert("Server error while generating PDF");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#13233F] text-white p-4">
        <h1 className="text-xl font-semibold">
          Document Upload & Analysis
        </h1>
        <p className="text-sm opacity-80">
          Upload contracts or legal documents for quick review
        </p>
      </header>

      <main className="flex-1 p-8">
        {/* Upload */}
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

        {/* File List */}
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
                Analyze Document
              </button>
            </div>
          </div>
        )}

        {loading && (
          <p className="mt-6 font-medium">Analyzing document...</p>
        )}

        {/* Analysis */}
        {analysis && (
          <div className="mt-8 bg-white p-6 rounded-md border">
            <h3 className="text-lg font-semibold mb-3">
              AI Analysis
            </h3>
            <pre className="whitespace-pre-wrap text-sm">
              {analysis}
            </pre>
          </div>
        )}

        {/* Ask AI */}
        {analysis && (
          <div className="mt-8 bg-white p-6 rounded-md border">
            <h3 className="text-lg font-semibold mb-3">
              Ask a question about this document
            </h3>

            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Can the landlord increase rent suddenly?"
              className="w-full border p-2 rounded mb-3"
            />

            <button
              onClick={askQuestion}
              className="bg-[#13233F] text-white px-4 py-2 rounded"
            >
              Ask AI
            </button>

            {answer && (
              <div className="mt-4 p-4 bg-slate-100 rounded">
                <strong>Answer:</strong>
                <p>{answer}</p>
              </div>
            )}
          </div>
        )}

        {/* 🧾 Template Fill */}
        {fields.length > 0 && (
          <div className="mt-10 bg-white p-6 rounded-md border">
            <h3 className="text-lg font-semibold mb-4">
              Fill Template & Generate PDF
            </h3>

            {fields.map((field) => (
              <div key={field} className="mb-3">
                <label className="block font-medium mb-1">
                  {field.replaceAll("_", " ")}
                </label>

                <input
                  className="border p-2 w-full rounded"
                  value={values[field] || ""}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      [field]: e.target.value,
                    })
                  }
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}

            <button
              onClick={generatePDF}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              📄 Generate Final PDF
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
