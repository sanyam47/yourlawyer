"use client";

import { useState } from "react";

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("rental");
  const [values, setValues] = useState({});
  const [aiDraft, setAiDraft] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------------------
  // AI Generate Draft
  // ---------------------------
  const generateFromAI = async () => {
    try {
      setLoading(true);
      setAiDraft("");
      setDownloadUrl("");

      const res = await fetch(
        "http://localhost:5000/api/template-fill/ai-generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentType: selectedTemplate,
            values,
          }),
        }
      );

      const data = await res.json();
      setAiDraft(data.draft);
      setEditMode(false);
    } catch (err) {
      alert("AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Generate PDF
  // ---------------------------
  const handleGeneratePDF = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/template-fill/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateText: aiDraft,
            values: {},
          }),
        }
      );

      const data = await res.json();
      setDownloadUrl(data.downloadUrl);
    } catch (err) {
      alert("PDF generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        AI Template Generator
      </h1>

      {/* =======================
          BASIC INPUTS
      ======================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Document Type */}
        <div>
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

        {/* Party A */}
        <div>
          <label className="font-semibold block mb-1">
            Party A
          </label>
          <input
            className="border p-2 rounded w-full"
            placeholder="Company / Person Name"
            onChange={(e) =>
              setValues({ ...values, partyA: e.target.value })
            }
          />
        </div>

        {/* Party B */}
        <div>
          <label className="font-semibold block mb-1">
            Party B
          </label>
          <input
            className="border p-2 rounded w-full"
            placeholder="Company / Person Name"
            onChange={(e) =>
              setValues({ ...values, partyB: e.target.value })
            }
          />
        </div>
      </div>

      {/* =======================
          DETAILS INPUTS
      ======================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

      {/* =======================
          GENERATE BUTTON
      ======================= */}
      <button
        onClick={generateFromAI}
        disabled={loading}
        className="bg-purple-600 text-white px-6 py-3 rounded mb-6"
      >
        {loading ? "Generating..." : "Generate Draft (AI)"}
      </button>

      {/* =======================
          AI DRAFT PREVIEW
      ======================= */}
      {aiDraft && (
        <div className="bg-white border rounded p-6 mb-6">
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
              className="w-full border rounded p-3 min-h-[250px]"
            />
          )}
        </div>
      )}

      {/* =======================
          PDF BUTTON
      ======================= */}
      {aiDraft && (
        <button
          onClick={handleGeneratePDF}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          Generate PDF
        </button>
      )}

      {/* =======================
          DOWNLOAD LINK
      ======================= */}
      {downloadUrl && (
        <div className="mt-6">
          <a
            href={downloadUrl}
            target="_blank"
            className="text-blue-600 underline font-semibold"
          >
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
}
