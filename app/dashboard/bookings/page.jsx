"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [ratingData, setRatingData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/bookings", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setBookings(data));
  }, []);

  const handlePayment = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/bookings/${id}/pay`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    setBookings((prev) =>
      prev.map((b) => (b._id === id ? data.booking : b))
    );

    alert("Payment Successful");
  };

  const handleRating = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:5000/api/bookings/${id}/rate`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ratingData[id]),
      }
    );

    alert("Rating Submitted");
  };

  return (
    <div className="p-8 space-y-6">
      {bookings.map((booking) => (
        <div key={booking._id} className="border p-6 rounded">
          <h3>{booking.lawyer?.name}</h3>

          <p>Status: {booking.status}</p>

          {booking.status === "confirmed" &&
            booking.paymentStatus === "unpaid" && (
              <button
                onClick={() => handlePayment(booking._id)}
                className="bg-green-600 text-white px-4 py-2 mt-3"
              >
                Pay Now
              </button>
            )}

          {booking.paymentStatus === "paid" && (
            <>
              <button
                onClick={() =>
                  router.push(`/chat/${booking._id}`)
                }
                className="bg-black text-white px-4 py-2 mt-3"
              >
                Open Chat
              </button>

              {!booking.rating && (
                <div className="mt-4">
                  {[1,2,3,4,5].map((star)=>(
                    <button
                      key={star}
                      onClick={() =>
                        setRatingData((prev)=>({
                          ...prev,
                          [booking._id]: {
                            ...prev[booking._id],
                            rating: star,
                          },
                        }))
                      }
                    >
                      ★
                    </button>
                  ))}

                  <textarea
                    placeholder="Review"
                    onChange={(e)=>
                      setRatingData((prev)=>({
                        ...prev,
                        [booking._id]: {
                          ...prev[booking._id],
                          review: e.target.value,
                        },
                      }))
                    }
                  />

                  <button
                    onClick={()=>handleRating(booking._id)}
                    className="bg-blue-600 text-white px-4 py-2 mt-2"
                  >
                    Submit Review
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
