"use client";

import { useState } from "react";
import { FileText, Loader2, Download } from "lucide-react";
import jsPDF from "jspdf";

export default function TemplateGeneratorPage() {
  const [templateType, setTemplateType] = useState("");
  const [formData, setFormData] = useState({
    partyA: "",
    partyB: "",
    date: "",
    purpose: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!templateType) {
      alert("Please select a template type");
      return;
    }

    const token = localStorage.getItem("yl_token");
    if (!token) {
      alert("Please login first");
      return;
    }

    setIsGenerating(true);
    setGeneratedText("");

    const details = `
Party A: ${formData.partyA}
Party B: ${formData.partyB}
Date: ${formData.date}
Purpose / Details: ${formData.purpose}
`;

    try {
      const res = await fetch(
        "http://localhost:5000/api/templates/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: templateType,
            details,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Template generation failed");
        return;
      }

      setGeneratedText(data.template);
    } catch {
      alert("Server error");
    } finally {
      setIsGenerating(false);
    }
  };

  // ✅ PDF DOWNLOAD FUNCTION
  const downloadPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(generatedText, 180);

    doc.setFont("Times", "Normal");
    doc.setFontSize(12);
    doc.text(lines, 15, 20);

    doc.save(`${templateType.replaceAll(" ", "_")}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-inter p-8">
      <header className="bg-[#13233F] text-white p-4 rounded-md mb-6 shadow">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <FileText size={22} /> Template Generator
        </h1>
      </header>

      <div className="bg-white p-6 rounded-lg shadow border">
        <select
          value={templateType}
          onChange={(e) => setTemplateType(e.target.value)}
          className="border p-2 rounded-md w-full mb-4"
        >
          <option value="">-- Select Template --</option>
          <option value="Non-Disclosure Agreement">NDA</option>
          <option value="Rental Agreement">Rental Agreement</option>
          <option value="Employment Contract">Employment Contract</option>
          <option value="Legal Notice">Legal Notice</option>
        </select>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input
            name="partyA"
            placeholder="Party A"
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
          <input
            name="partyB"
            placeholder="Party B"
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
        </div>

        <input
          type="date"
          name="date"
          onChange={handleChange}
          className="border p-2 rounded-md w-full mb-4"
        />

        <textarea
          name="purpose"
          placeholder="Purpose / Details"
          onChange={handleChange}
          className="border p-2 rounded-md w-full mb-4"
        />

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-[#13233F] text-white px-6 py-2 rounded-md flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Generating...
            </>
          ) : (
            "Generate Template"
          )}
        </button>
      </div>

      {generatedText && (
        <div className="mt-6 bg-white p-6 border rounded-lg shadow">
          <h2 className="font-semibold mb-3">Generated Template</h2>
          <pre className="whitespace-pre-wrap mb-4">
            {generatedText}
          </pre>

          <button
            onClick={downloadPDF}
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Download size={16} /> Download PDF
          </button>
        </div>
      )}
    </div>
  );
}
