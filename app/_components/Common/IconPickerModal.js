import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TbUpload } from "react-icons/tb";
import Splash from "./Splash";

export default function IconPickerModal({ open, onClose, onSelect }) {
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    setLoading(true);
    setSelectedIcon(null);

    const token = localStorage.getItem("token");

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/icons/get-all-icons`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setIcons(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading icons:", err);
        setLoading(false);
      });
  }, [open]);

  if (!open) return null;

  const allowedExtensions = [".ico", ".png", ".svg", ".jpg", ".jpeg", ".webp"];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    if (!allowedExtensions.includes(extension)) {
      alert("Only .ico, .png, .svg, .jpg, .jpeg, .webp formats are allowed.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onSelect({
      iconId: null,
      iconName: file.name,
      iconFile: file,
      iconImageUrl: previewUrl,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/60 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      {loading ? (
        <div className="bg-white rounded-2xl w-2/3 h-2/5 mx-4 flex items-center justify-center">
          <Splash />
        </div>
      ) : (
        <div className="bg-white rounded-2xl w-5/6 md:w-9/10 lg:w-5/7 xl:w-2/3 h-3/5 md:h-2/6 lg:h-4/11 xl:h-3/7 mx-4 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-[clamp(1rem,2vw,4rem)] py-[clamp(1rem,2vw,3rem)]">
            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-10 xl:grid-cols-11 gap-[clamp(1rem,2vw,6.5rem)] place-items-center">
              {icons.map((icon) => (
                <button
                  key={icon.id}
                  type="button"
                  className={`flex flex-col items-center transition rounded-[0.5rem] w-[clamp(4.5rem,6vw,17rem)] h-[clamp(4.5rem,6vw,17rem)] ${
                    selectedIcon?.id === icon.id
                      ? "border border-blue-500 ring-2 ring-blue-200"
                      : "hover:border hover:border-blue-500"
                  }`}
                  onClick={() => setSelectedIcon(icon)}
                >
                  <div className="relative w-[clamp(3.5rem,4.5vw,16rem)] h-[clamp(3.5rem,4.5vw,16rem)] mb-[clamp(0.5rem,0.8vw,1rem)] flex items-center justify-center">
                    <Image
                      src={icon.iconImageUrl}
                      alt={icon.iconName}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[clamp(0.65rem,1vw,2rem)] text-gray-700 font-medium truncate w-full text-center">
                    {icon.iconName?.split(".").slice(0, -1).join(".")}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={allowedExtensions.join(",")}
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex items-center justify-between px-[clamp(1.5rem,3vw,5rem)] py-[clamp(1rem,1.5vw,2rem)]">
            <button
              type="button"
              className="px-[clamp(0.8rem,1.3vw,3rem)] py-[clamp(0.3rem,0.35vw,1rem)] font-semibold rounded-md bg-button-bg text-white text-[clamp(0.5rem,1vw,2.2rem)] flex items-center gap-2"
              onClick={() => fileInputRef.current.click()}
            >
              <TbUpload />
              Upload
            </button>

            <div className="flex gap-[clamp(0.65rem,1.5vw,2rem)]">
              <button
                className="px-[clamp(0.8rem,1.3vw,3rem)] py-[clamp(0.3rem,0.35vw,1rem)] rounded-md font-semibold text-black text-[clamp(0.5rem,1vw,2.2rem)] border border-button-border-color"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className={`px-[clamp(0.8rem,1.3vw,3rem)] py-[clamp(0.3rem,0.35vw,1rem)] rounded-md text-[clamp(0.5rem,1vw,2.2rem)] font-semibold border border-button-border-color ${
                  selectedIcon
                    ? "bg-button-bg text-white"
                    : "text-black/50 cursor-not-allowed"
                }`}
                disabled={!selectedIcon}
                onClick={() => {
                  if (selectedIcon) {
                    onSelect({
                      iconId: selectedIcon.id,
                      iconName: selectedIcon.iconName,
                      iconImageUrl: selectedIcon.iconImageUrl,
                    });
                    onClose();
                  }
                }}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
