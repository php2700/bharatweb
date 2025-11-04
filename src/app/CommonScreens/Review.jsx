import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import defaultImage from "../../assets/default-image.jpg";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Review({ orderId, type }) {
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchReviewData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/user/getOrderReview/${orderId}/${type}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("bharat_token")}`,
            },
          }
        );

        if (response.data.status) {
          setReviewData(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch review data.");
        }
      } catch (err) {
        setError("Error fetching review data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId && type) {
      fetchReviewData();
    } else {
      setError("Invalid review parameters.");
      setLoading(false);
    }
  }, [orderId, type]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-500 font-semibold">{error}</div>
    );
  }

  if (!reviewData) {
    return (
      <div className="text-center p-6 text-gray-500">No review found.</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">Review Details</h2>

      {/* Reviewer Info */}
      <div className="flex flex-col items-center mb-4">
        <img
          src={reviewData.reviewer?.image || defaultImage}
          alt={reviewData.reviewer?.name}
          className="w-20 h-20 rounded-full object-cover border mb-2"
        />
        <h3 className="text-lg font-semibold">{reviewData.reviewer?.name}</h3>
      </div>

      {/* Review Details */}
      <div className="text-left bg-[#FFF2F2] rounded-lg p-4 mb-4">
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Project ID:</span>{" "}
          {reviewData.project_id}
        </p>
        {/*<p className="text-gray-600 mb-2">
          <span className="font-semibold">Order ID:</span> {reviewData.order_id}
        </p>*/}
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Order Type:</span>{" "}
          {reviewData.order_type}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Rating:</span>{" "}
          {"⭐".repeat(reviewData.rating)} ({reviewData.rating}/5)
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Review:</span> {reviewData.review}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Date:</span>{" "}
          {formatDate(reviewData.createdAt)}
        </p>
      </div>

      {/* Review Images */}
      {reviewData.images?.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-2">Review Images</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {reviewData.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`review-img-${index}`}
                className="w-32 h-32 rounded-lg object-cover shadow-md hover:scale-105 transition-transform duration-200"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
