import { Calendar, MapPin, X } from "lucide-react";
import Footer from "../../../component/footer";
import Header from "../../../component/Header";
import { useState } from "react";

export default function DirectHiring() {
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {

    const files = Array.from(e.target.files);
    console.log(files,"gggg")

    const newImages = files.map((file) => URL.createObjectURL(file));

    if (images.length + newImages.length <= 5) {
      setImages((prev) => [...prev, ...newImages]);
    } else {
      alert("You can upload max 5 images.");
    }
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <div className="w-full max-w-6xl mx-auto flex justify-start mb-4">
          <button className="text-green-600 text-sm hover:underline">
            &lt; Back
          </button>
        </div>
        <div className="max-w-2xl mx-auto my-10 bg-white shadow-2xl rounded-xl py-6 px-10">
          <h2 className="text-xl text-center font-bold mb-4">Direct hiring</h2>

          <div>Title</div>
          <input
            type="text"
            placeholder="Enter Title of work"
            className="w-full border rounded-md p-2 mb-4 focus:outline-green-500"
          />

          <div>Platform Fees</div>
          <input
            type="text"
            value="Rs 200.00"
            disabled
            className="w-full border rounded-md p-2 mb-4 bg-gray-100 text-gray-600"
          />

          <div>Description</div>

          <textarea
            rows={3}
            placeholder="Enter description"
            className="w-full border rounded-md p-2 mb-4 focus:outline-green-500"
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s...
          </textarea>

          <div className="flex justify-between">
            <div>Address</div>
            <button className="text-green-600 font-medium ml-2">Edit</button>
          </div>
          <div className="flex items-center border rounded-md p-2 mb-4 justify-between">
            <input
              type="text"
              placeholder="Enter Full Address"
              className="flex-1 focus:outline-none"
            />
            <MapPin className="w-5 h-5 text-gray-500 ml-2" />
          </div>

          <div>Add dead line and time</div>
          <div className="flex items-center border rounded-md p-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-500 mr-2" />
            <input type="date" className="flex-1 focus:outline-none" />
          </div>

          <div className="mb-4">
            <p className="mb-2 text-sm font-medium">Upload (5 Max photos)</p>
            <label className="border rounded-md p-4 text-center text-green-600 cursor-pointer block mb-4">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              Upload Image
            </label>
            <div className="flex gap-3 flex-wrap">
              {images?.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img}
                    alt="Uploaded"
                    className="h-20 w-20 object-cover rounded-md"
                  />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full bg-green-600 text-white font-semibold py-3 rounded-md">
            Hire
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
