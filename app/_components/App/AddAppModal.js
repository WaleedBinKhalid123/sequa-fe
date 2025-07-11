import { useEffect, useRef, useState } from "react";
import IconPickerModal from "../Common/IconPickerModal";
import { useDispatch } from "react-redux";
import { addApp } from "../../_lib/features/app/appSlice";
import AppForm from "../Common/AppForm";

export default function AddAppModal({ open, onClose }) {
  const dispatch = useDispatch();

  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [appName, setAppName] = useState("");
  const [iconName, setIconName] = useState("");
  const [iconNameExtension, setIconNameExtension] = useState("");
  const [appUrl, setAppUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [appNameError, setAppNameError] = useState("");
  const [iconNameError, setIconNameError] = useState("");

  const appNameRef = useRef(null);
  const appUrlRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);

    if (!open) return;
    return () => {
      setAppName("");
      setIconName("");
      setIconNameExtension("");
      setAppUrl("");
      setIconFile(null);
      setSelectedIconId(null);
      setIconPreview(null);
      setAppNameError("");
      setIconNameError("");
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  if (!open) return null;

  const handleIconSelect = ({ iconId, iconName, iconImageUrl, iconFile }) => {
    setSelectedIconId(iconId);

    if (iconFile) {
      setIconFile(iconFile);
      setIconName("");
      setIconNameExtension("");
      setIconPreview(URL.createObjectURL(iconFile));
    } else {
      setIconName(iconName.split(".")[0]);
      setIconNameExtension(iconName.substring(iconName.lastIndexOf(".")));
      setIconPreview(iconImageUrl);
      setIconFile(null);
    }

    setTimeout(() => appNameRef.current?.focus(), 0);
  };

  const handleAppNameChange = (e) => {
    const value = e.target.value;
    setAppName(value);
    setAppNameError(value.length > 13 ? "App name is max 13 characters" : "");
  };

  const handleIconNameChange = (e) => {
    const value = e.target.value;
    setIconName(value);
    setIconNameError(value.length > 17 ? "Icon Name is max 17 characters" : "");
  };

  const handleAppNameKeyDown = (e) => {
    if (e.key === "Tab" && !e.shiftKey && iconName.trim()) {
      e.preventDefault();
      appUrlRef.current?.focus();
    }
  };

  const normalizeUrl = (url) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(
        addApp({
          appName,
          appUrl: normalizeUrl(appUrl),
          iconName: iconName + iconNameExtension,
          iconId: selectedIconId,
          iconFile,
        })
      ).unwrap();

      onClose();
    } catch (err) {
      console.error("Error adding application", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080] backdrop-blur-sm p-4">
        <div className="bg-white w-29/30 2xl:w-[85vw] p-4 sm:p-6 md:p-7 lg:p-6 relative rounded-[clamp(1.2rem,1.2vw,3.4rem)]">
          <button
            className="absolute top-0 right-4 xl:right-6 text-[clamp(2rem,2vw,6.5rem)] font-medium text-black hover:text-gray-500"
            onClick={onClose}
          >
            &times;
          </button>

          <AppForm
            iconPreview={iconPreview}
            appName={appName}
            iconName={iconName}
            appUrl={appUrl}
            appNameError={appNameError}
            iconNameError={iconNameError}
            loading={loading}
            onSubmit={handleSubmit}
            onAppNameChange={handleAppNameChange}
            onIconNameChange={handleIconNameChange}
            onUrlChange={(e) => setAppUrl(e.target.value)}
            onAppNameKeyDown={handleAppNameKeyDown}
            onIconPickerOpen={() => setIconPickerOpen(true)}
            appNameRef={appNameRef}
            appUrlRef={appUrlRef}
            selectedIconId={selectedIconId}
            iconFile={iconFile}
            buttonLabel="Add App"
          />
        </div>
      </div>

      <IconPickerModal
        open={iconPickerOpen}
        onClose={() => setIconPickerOpen(false)}
        onSelect={handleIconSelect}
      />
    </>
  );
};
