"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LawyerDashboardPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // AUTH + FETCH BOOKINGS
  // ===============================
  useEffect(() => {
    const token = localStorage.getItem("yl_token");
    const user = JSON.parse(localStorage.getItem("user"));

    // 🔐 Auth protection
    if (!token || !user) {
      router.push("/auth/login");
      return;
    }

    if (user.role !== "lawyer") {
      router.push("/dashboard");
      return;
    }

    fetch("http://localhost:5000/api/bookings/lawyer", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          setBookings([]);
        }
      })
      .catch(() => {
        setBookings([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  // ===============================
  // UPDATE BOOKING STATUS
  // ===============================
  const updateStatus = async (bookingId, status) => {
    const token = localStorage.getItem("yl_token");

    if (!token) {
      alert("Session expired. Please login again.");
      router.push("/auth/login");
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/bookings/${bookingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!res.ok) {
      alert("Failed to update booking status");
      return;
    }

    // Update UI instantly
    setBookings((prev) =>
      prev.map((b) =>
        b._id === bookingId ? { ...b, status } : b
      )
    );
  };

  // ===============================
  // LOADING STATE
  // ===============================
  if (loading) {
    return (
      <p className="text-center mt-10 text-slate-600">
        Loading lawyer dashboard...
      </p>
    );
  }

  // ===============================
  // UI
  // ===============================
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">
        Lawyer Dashboard
      </h1>

      {bookings.length === 0 ? (
        <p className="text-slate-600">
          No client bookings yet.
        </p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <p className="font-semibold">
                Client: {booking.client?.name || "Unknown"}
              </p>

              <p className="text-sm text-slate-600 mt-1">
                {booking.caseDescription}
              </p>

              <p className="mt-2 text-sm">
                Status:{" "}
                <span className="font-medium capitalize">
                  {booking.status}
                </span>
              </p>

              {booking.status === "pending" && (
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() =>
                      updateStatus(booking._id, "accepted")
                    }
                    className="bg-green-600 text-white px-4 py-1 rounded"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(booking._id, "rejected")
                    }
                    className="bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}

              {booking.status === "accepted" && (
                <button
                  onClick={() =>
                    router.push(`/chat/${booking._id}`)
                  }
                  className="mt-3 bg-black text-white px-4 py-1 rounded"
                >
                  Open Chat
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
