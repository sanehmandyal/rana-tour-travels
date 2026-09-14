import { useRef, useState } from "react";
import { Upload, Loader2, ImageOff } from "lucide-react";
import client from "../api/client";

export default function ImageUploader({ value, onChange, label = "Image" }) {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await client.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.url);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <span className="text-xs font-semibold text-navy/60 block mb-1">{label}</span>
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 rounded-lg bg-sky border overflow-hidden flex items-center justify-center shrink-0">
          {value ? <img src={value} alt="" className="w-full h-full object-cover" /> : <ImageOff size={20} className="text-teal/40" />}
        </div>
        <label className="btn-outline !py-1.5 !px-3 text-xs cursor-pointer flex items-center gap-1.5">
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? "Uploading..." : "Upload"}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-xs text-red-500 font-semibold">
            Remove
          </button>
        )}
      </div>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}
