import { useRef, useState } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { getImageUrl } from "../../utils/image";

// value: a Cloudinary media object { url, public_id, type? } (single image/video)
// or an array of such objects (multiple images). `folder` tells the backend
// which Cloudinary sub-folder to organize the upload under. Pass `allowVideo`
// to also accept video files. Pass `max` to cap how many images a `multiple`
// uploader accepts (e.g. the About section's two-image slots) - the upload
// button hides itself once the cap is reached, every other usage is unbounded
// exactly as before.
const ImageUploader = ({ value, onChange, multiple = false, folder = "assets", allowVideo = false, max = Infinity }) => {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);

  const images = multiple ? value || [] : value?.url ? [value] : [];
  const remaining = Math.max(max - images.length, 0);

  const handleFiles = async (files) => {
    const filesToUpload = multiple ? files.slice(0, remaining) : files;
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("folder", folder);
        const res = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploaded.push({
          url: res.data.url,
          public_id: res.data.public_id,
          ...(allowVideo ? { type: res.data.resource_type } : {}),
        });
      }
      if (multiple) {
        onChange([...(value || []), ...uploaded]);
      } else {
        onChange(uploaded[0]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // Removing an image from the form also deletes it from Cloudinary right
  // away, so nothing orphaned lingers even if the surrounding form is never saved.
  const removeImage = async (idx) => {
    const removed = images[idx];

    if (multiple) {
      onChange(images.filter((_, i) => i !== idx));
    } else {
      onChange(null);
    }

    if (removed?.public_id) {
      try {
        await api.post("/upload/delete", {
          public_id: removed.public_id,
          resource_type: removed.type === "video" ? "video" : "image",
        });
      } catch {
        // Non-fatal - the media will simply become an orphan in Cloudinary.
      }
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((img, i) => (
          <div key={img.public_id || i} className="relative h-24 w-24 border border-espresso/15 overflow-hidden group">
            {img.type === "video" ? (
              <video src={getImageUrl(img)} muted loop playsInline autoPlay className="h-full w-full object-cover" />
            ) : (
              <img src={getImageUrl(img)} alt="" className="h-full w-full object-cover" />
            )}
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 bg-espresso/80 text-ivory p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FiX size={12} />
            </button>
          </div>
        ))}

        {(multiple ? remaining > 0 : images.length === 0) && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="h-24 w-24 flex flex-col items-center justify-center gap-1 border border-dashed border-espresso/25 text-espresso/40 hover:border-camel hover:text-camel transition-colors"
          >
            <FiUpload size={16} />
            <span className="text-[10px]">{uploading ? "Uploading..." : "Upload"}</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={allowVideo ? "image/*,video/*" : "image/*"}
        multiple={multiple}
        hidden
        onChange={(e) => e.target.files.length && handleFiles(Array.from(e.target.files))}
      />
    </div>
  );
};

export default ImageUploader;
