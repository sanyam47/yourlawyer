"use client";

import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";

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

  const handleGenerate = () => {
    if (!templateType) {
      alert("Please select a template type first!");
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      // Mock output for now
      setGeneratedText(
        `This is a preview of your generated ${templateType} between ${formData.partyA || "Party A"} and ${
          formData.partyB || "Party B"
        } dated ${formData.date || "_____"}. The purpose is ${
          formData.purpose || "not specified"
        }. (AI will replace this with a real legal draft later.)`
      );
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-inter p-8">
      {/* Header */}
      <header className="bg-[#13233F] text-white p-4 rounded-md mb-6 shadow">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <FileText size={22} /> Template Generator
        </h1>
        <p className="text-sm opacity-80">
          Choose a document type and fill in the details to generate a draft
        </p>
      </header>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
        <div className="mb-4">
          <label className="block text-slate-700 font-medium mb-2">
            Template Type
          </label>
          <select
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value)}
            className="border border-slate-300 rounded-md p-2 w-full"
          >
            <option value="">-- Select a Template --</option>
            <option value="Non-Disclosure Agreement (NDA)">NDA</option>
            <option value="Rental Agreement">Rental Agreement</option>
            <option value="Demand Letter">Demand Letter</option>
            <option value="Employment Contract">Employment Contract</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-slate-700 font-medium mb-2">Party A</label>
            <input
              type="text"
              name="partyA"
              value={formData.partyA}
              onChange={handleChange}
              placeholder="Enter Party A name"
              className="border border-slate-300 rounded-md p-2 w-full"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-2">Party B</label>
            <input
              type="text"
              name="partyB"
              value={formData.partyB}
              onChange={handleChange}
              placeholder="Enter Party B name"
              className="border border-slate-300 rounded-md p-2 w-full"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-slate-700 font-medium mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border border-slate-300 rounded-md p-2 w-full"
          />
        </div>

        <div className="mb-6">
          <label className="block text-slate-700 font-medium mb-2">Purpose / Details</label>
          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            placeholder="Describe the purpose or key details"
            className="border border-slate-300 rounded-md p-2 w-full"
            rows="3"
          />
        </div>

        <button
          onClick={handleGenerate}
          className="bg-[#13233F] text-white px-6 py-2 rounded-md hover:bg-[#1a2b55] transition flex items-center gap-2"
          disabled={isGenerating}
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

      {/* Output Section */}
      {generatedText && (
        <div className="mt-6 bg-white border border-slate-200 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-[#13233F] mb-2">
            Generated Template Preview
          </h2>
          <p className="whitespace-pre-line text-slate-800">{generatedText}</p>
        </div>
      )}
    </div>
  );
}
