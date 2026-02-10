"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LawyerDashboardPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotData, setSlotData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      router.replace("/auth");
      return;
    }

    if (user.role !== "lawyer") {
      router.replace("/dashboard");
      return;
    }

    fetch("http://localhost:5000/api/bookings/lawyer", {
  headers: { Authorization: `Bearer ${token}` },
})

      .then((res) => res.json())
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [router]);

const updateBooking = async (bookingId, status) => {
  const token = localStorage.getItem("token");

  if (status === "confirmed") {
    const selectedDate = slotData[bookingId]?.date;
    const selectedTime = slotData[bookingId]?.timeSlot;

    if (!selectedDate || !selectedTime) {
      alert("Please select date and time slot");
      return;
    }
  }

  const payload =
    status === "confirmed"
      ? {
          status: "confirmed",
          date: slotData[bookingId].date,
          timeSlot: slotData[bookingId].timeSlot,
        }
      : { status: "rejected" };

  try {
    const res = await fetch(
      `http://localhost:5000/api/bookings/${bookingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to update booking");
      return;
    }

    setBookings((prev) =>
      prev.map((b) => (b._id === bookingId ? data.booking : b))
    );
  } catch (error) {
    alert("Server error");
  }
};


  if (loading) {
    return (
      <p className="text-center mt-10 text-slate-600">
        Loading lawyer dashboard...
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          ⚖️ Lawyer Dashboard
        </h1>

        <button
          onClick={() => {
            localStorage.clear();
            router.replace("/auth");
          }}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 mb-10">
        <button
          onClick={() => router.push("/lawyer-profile")}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Edit Profile
        </button>

        <button
          onClick={() => router.push("/lawyer-availability")}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Set Availability
        </button>
      </div>

      {/* BOOKINGS SECTION */}
      <h2 className="text-xl font-semibold mb-4">
        Client Booking Requests
      </h2>

      {bookings.length === 0 ? (
        <p className="text-gray-600">
          No client booking requests yet.
        </p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border rounded-lg p-6 bg-white shadow"
            >
              <p className="font-semibold text-lg">
                Client: {booking.client?.name}
              </p>

              <p className="mt-2">
                Status:{" "}
                <span className="capitalize font-medium">
                  {booking.status}
                </span>
              </p>

              {/* PENDING */}
              {booking.status === "pending" && (
                <div className="mt-4 space-y-3">

                  <input
                    type="date"
                    className="border p-2 rounded w-full"
                    onChange={(e) =>
                      setSlotData((prev) => ({
                        ...prev,
                        [booking._id]: {
                          ...prev[booking._id],
                          date: e.target.value,
                        },
                      }))
                    }
                  />

                  <input
                    type="text"
                    placeholder="Time Slot (e.g. 3:00 PM)"
                    className="border p-2 rounded w-full"
                    onChange={(e) =>
                      setSlotData((prev) => ({
                        ...prev,
                        [booking._id]: {
                          ...prev[booking._id],
                          timeSlot: e.target.value,
                        },
                      }))
                    }
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        updateBooking(booking._id, "confirmed")
                      }
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Confirm
                    </button>

                    <button
                      onClick={() =>
                        updateBooking(booking._id, "rejected")
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {/* CONFIRMED */}
              {booking.status === "confirmed" && (
                <div className="mt-4">
                  <p>
                    Confirmed for:{" "}
                    {new Date(booking.date).toDateString()} |{" "}
                    {booking.timeSlot}
                  </p>

                  <button
                    onClick={() =>
                      router.push(`/chat/${booking._id}`)
                    }
                    className="mt-3 bg-black text-white px-4 py-2 rounded"
                  >
                    Open Chat
                  </button>
                </div>
              )}

              {/* REJECTED */}
              {booking.status === "rejected" && (
                <p className="mt-4 text-red-600">
                  Booking Rejected
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
