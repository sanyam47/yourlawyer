"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ViewLawyerPage() {
  const { id } = useParams();
  const router = useRouter();

  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(false);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ================= FETCH LAWYER ================= */
  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/lawyers/${id}`
        );

        if (!res.ok) throw new Error();

        const data = await res.json();
        setLawyer(data);
      } catch (error) {
        console.error("Error fetching lawyer:", error);
      }
    };

    if (id) fetchLawyer();
  }, [id]);

  /* ================= SUBMIT RATING ================= */
  const submitRating = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login required");
      return;
    }

    if (!rating) {
      alert("Please select rating");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/lawyers/${lawyer._id}/rate`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating, review }),
        }
      );

      if (!res.ok) throw new Error();

      alert("⭐ Rating submitted!");

      // Refresh data
      const updated = await fetch(
        `http://localhost:5000/api/lawyers/${id}`
      );
      const updatedData = await updated.json();
      setLawyer(updatedData);

      setRating(0);
      setReview("");

    } catch (error) {
      alert("Rating failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading lawyer details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">

        {/* PROFILE */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={
              lawyer.profileImage
                ? `http://localhost:5000${lawyer.profileImage}`
                : "/default-avatar.png"
            }
            alt="Lawyer"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />

          <h1 className="text-2xl font-bold">{lawyer.name}</h1>

          <div className="mt-2 text-yellow-500 text-lg">
            {"★".repeat(Math.round(lawyer.averageRating || 0))}
          </div>

          <p className="text-sm text-gray-500">
            {lawyer.totalRatings || 0} Reviews
          </p>
        </div>

        <p className="text-gray-600 mb-2">
          Specialization: {lawyer.specialization || "Not specified"}
        </p>

        <p className="text-gray-600 mb-2">
          Experience: {lawyer.experience || 0} years
        </p>

        <p className="text-gray-600 mb-6">
          Consultation Fee: ₹{lawyer.consultationFee || 0}
        </p>

        {/* ================= RATING FORM ================= */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold mb-3">
            Rate This Lawyer
          </h3>

          <div className="flex gap-2 mb-3">
            {[1,2,3,4,5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl ${
                  rating >= star
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review..."
            className="w-full border p-2 rounded mb-3"
          />

          <button
            onClick={submitRating}
            disabled={submitting}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {submitting ? "Submitting..." : "Submit Rating"}
          </button>
        </div>

        {/* ================= SHOW REVIEWS ================= */}
        {lawyer.reviews && lawyer.reviews.length > 0 && (
          <div className="mt-10 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              Reviews ({lawyer.reviews.length})
            </h3>

            {lawyer.reviews.map((rev, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 mb-4 bg-gray-50"
              >
                <div className="text-yellow-500">
                  {"★".repeat(rev.rating)}
                </div>

                <p className="text-gray-700 mt-2">
                  {rev.comment}
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="mt-6 w-full border py-2 rounded-lg"
        >
          Back
        </button>

      </div>
    </div>
  );
}
