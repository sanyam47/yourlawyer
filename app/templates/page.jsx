"use client";

import { useState } from "react";

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("rental");
  const [values, setValues] = useState({});
  const [aiDraft, setAiDraft] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= AI GENERATE ================= */
  const generateFromAI = async () => {
    try {
      setLoading(true);
      setAiDraft("");

      const res = await fetch("http://localhost:5000/api/template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: selectedTemplate,
          partyA: values.partyA || "",
          partyB: values.partyB || "",
          details: `
Purpose: ${values.purpose || ""}
Amount: ${values.amount || ""}
Duration: ${values.duration || ""}
Jurisdiction: ${values.jurisdiction || ""}
          `,
        }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setAiDraft(data.document);
      setEditMode(false);

    } catch {
      alert("AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DOWNLOAD PDF ================= */
  const downloadPDF = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/template/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: aiDraft }),
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "document.pdf";
      a.click();
    } catch {
      alert("PDF download failed");
    }
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        AI Template Generator
      </h1>

      {/* Document Type */}
      <div className="mb-6">
        <label className="font-semibold block mb-1">
          Select Document Type
        </label>
        <select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="rental">Rental Agreement</option>
          <option value="nda">NDA</option>
          <option value="employment">Employment Contract</option>
        </select>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          placeholder="Party A"
          className="border p-2 rounded"
          onChange={(e) =>
            setValues({ ...values, partyA: e.target.value })
          }
        />

        <input
          placeholder="Party B"
          className="border p-2 rounded"
          onChange={(e) =>
            setValues({ ...values, partyB: e.target.value })
          }
        />

        <input
          placeholder="Purpose / Details"
          className="border p-2 rounded"
          onChange={(e) =>
            setValues({ ...values, purpose: e.target.value })
          }
        />

        <input
          placeholder="Amount / Salary / Rent"
          className="border p-2 rounded"
          onChange={(e) =>
            setValues({ ...values, amount: e.target.value })
          }
        />

        <input
          placeholder="Duration / Term"
          className="border p-2 rounded"
          onChange={(e) =>
            setValues({ ...values, duration: e.target.value })
          }
        />

        <input
          placeholder="Location / Jurisdiction"
          className="border p-2 rounded"
          onChange={(e) =>
            setValues({ ...values, jurisdiction: e.target.value })
          }
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={generateFromAI}
        disabled={loading}
        className="bg-purple-600 text-white px-6 py-3 rounded mb-6"
      >
        {loading ? "Generating..." : "Generate Draft (AI)"}
      </button>

      {/* AI Draft */}
      {aiDraft && (
        <div className="bg-white border rounded p-6 mb-4">
          <div className="flex justify-between mb-3">
            <h3 className="font-semibold">
              AI Generated Document
            </h3>

            <button
              onClick={() => setEditMode(!editMode)}
              className="text-sm text-blue-600 underline"
            >
              {editMode ? "Save" : "Edit"}
            </button>
          </div>

          {!editMode ? (
            <pre className="whitespace-pre-wrap text-sm">
              {aiDraft}
            </pre>
          ) : (
            <textarea
              value={aiDraft}
              onChange={(e) => setAiDraft(e.target.value)}
              className="w-full border rounded p-3 min-h-[300px]"
            />
          )}
        </div>
      )}

      {/* Download Button */}
      {aiDraft && (
        <button
          onClick={downloadPDF}
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          Download PDF
        </button>
      )}
    </div>
  );
}
