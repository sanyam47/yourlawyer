"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LawyerProfilePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    specialization: "",
    experience: "",
    bio: "",
    consultationFee: "",
    profileImage: null,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (
      !form.specialization ||
      !form.experience ||
      !form.bio ||
      !form.consultationFee ||
      !form.profileImage
    ) {
      alert("All fields including profile photo are required.");
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);

    const formData = new FormData();
    formData.append("specialization", form.specialization);
    formData.append("experience", form.experience);
    formData.append("bio", form.bio);
    formData.append("consultationFee", form.consultationFee);
    formData.append("profileImage", form.profileImage);

    try {
      const res = await fetch(
        "http://localhost:5000/api/profile/update",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        alert("Profile update failed");
        return;
      }

      alert("Profile updated successfully!");
      router.push("/lawyer-dashboard");
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5">

        <h1 className="text-2xl font-bold text-center">
          Complete Your Profile
        </h1>

        {/* Specialization */}
        <input
          required
          placeholder="Specialization (e.g. Criminal Law)"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
          onChange={(e) =>
            setForm({ ...form, specialization: e.target.value })
          }
        />

        {/* Experience */}
        <input
          type="number"
          required
          placeholder="Years of Experience"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
          onChange={(e) =>
            setForm({ ...form, experience: e.target.value })
          }
        />

        {/* Bio */}
        <textarea
          required
          placeholder="Short Professional Bio"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
          rows={3}
          onChange={(e) =>
            setForm({ ...form, bio: e.target.value })
          }
        />

        {/* Fee */}
        <input
          type="number"
          required
          placeholder="Consultation Fee (₹)"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
          onChange={(e) =>
            setForm({ ...form, consultationFee: e.target.value })
          }
        />

        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Upload Profile Photo *
          </label>
          <input
            type="file"
            accept="image/*"
            required
            className="w-full border p-2 rounded-lg"
            onChange={(e) =>
              setForm({ ...form, profileImage: e.target.files[0] })
            }
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
<h3 className="mt-6 text-lg font-semibold">
  Reviews ({lawyer.reviews?.length || 0})
</h3>

{lawyer.reviews?.length > 0 ? (
  <div className="mt-4 space-y-4">
    {lawyer.reviews.map((r, index) => (
      <div key={index} className="border p-3 rounded">
        <p className="text-yellow-500">
          {"★".repeat(r.rating)}
        </p>
        <p className="text-gray-600">{r.comment}</p>
      </div>
    ))}
  </div>
) : (
  <p className="text-gray-500 mt-2">No reviews yet</p>
)}
