"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LawyerAvailabilityPage() {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch already saved availability
  useEffect(() => {
    const fetchAvailability = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          "http://localhost:5000/api/profile/availability",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.availability) {
          setAvailability(data.availability);
        }
      } catch (error) {
        console.error("Error fetching availability");
      }
    };

    fetchAvailability();
  }, []);

  const addSlot = () => {
    if (!selectedDate || !timeSlot) {
      alert("Select date and time");
      return;
    }

    const existingDate = availability.find(
      (a) => a.date === selectedDate
    );

    if (existingDate) {
      if (!existingDate.slots.includes(timeSlot)) {
        existingDate.slots.push(timeSlot);
      }
      setAvailability([...availability]);
    } else {
      setAvailability([
        ...availability,
        { date: selectedDate, slots: [timeSlot] },
      ]);
    }

    setTimeSlot("");
  };

  const saveAvailability = async () => {
    const token = localStorage.getItem("token");

    if (availability.length === 0) {
      alert("Add at least one time slot");
      return;
    }

    setLoading(true);

    try {
      await fetch("http://localhost:5000/api/profile/availability", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ availability }),
      });

      alert("Availability saved!");
      router.push("/lawyer-dashboard");
    } catch (error) {
      alert("Error saving availability");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-lg space-y-6">

        <h1 className="text-2xl font-bold text-center">
          Set Date & Time Availability
        </h1>

        {/* Date Picker */}
        <input
          type="date"
          className="w-full border p-3 rounded-lg"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        {/* Time Picker */}
        <input
          type="time"
          className="w-full border p-3 rounded-lg"
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
        />

        <button
          onClick={addSlot}
          className="w-full bg-purple-600 text-white py-2 rounded-lg"
        >
          Add Time Slot
        </button>

        {/* Preview */}
        {availability.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Your Availability:</h3>

            {availability.map((item, index) => (
              <div key={index} className="bg-gray-200 p-3 rounded">
                <p className="font-medium">{item.date}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.slots.map((slot, i) => (
                    <span
                      key={i}
                      className="bg-white px-2 py-1 rounded text-sm"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={saveAvailability}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          {loading ? "Saving..." : "Save Availability"}
        </button>
      </div>
    </div>
  );
}
