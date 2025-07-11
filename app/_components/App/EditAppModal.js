import { useEffect, useRef, useState } from "react";
import IconPickerModal from "../Common/IconPickerModal";
import AppForm from "../Common/AppForm";

export default function EditAppModal({
  open,
  onClose,
  initialValues = {},
  onSubmit,
  loading = false,
}) {
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState(null);
  const [iconPreview, setIconPreview] = useState("/default-icon.png");
  const [appName, setAppName] = useState("");
  const [iconName, setIconName] = useState("");
  const [appUrl, setAppUrl] = useState("");
  const [iconFile, setIconFile] = useState(null);

  const [appNameError, setAppNameError] = useState("");
  const [iconNameError, setIconNameError] = useState("");

  const appNameRef = useRef(null);
  const appUrlRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const icon = initialValues.iconName || "";
    const dotIdx = icon.lastIndexOf(".");

    setSelectedIconId(initialValues.iconId || null);
    setIconPreview(initialValues.iconImageUrl || "/default-icon.png");
    setAppName(initialValues.appName || "");
    setIconName(dotIdx !== -1 ? icon.substring(0, dotIdx) : icon);
    setAppUrl(initialValues.appUrl || "");
    setIconFile(null);
    setAppNameError("");
    setIconNameError("");

    return () => {
      setSelectedIconId(null);
      setIconPreview("/default-icon.png");
      setAppName("");
      setIconName("");
      setAppUrl("");
      setIconFile(null);
      setAppNameError("");
      setIconNameError("");
    };
  }, [open, initialValues]);

  const handleIconSelect = ({ iconId, iconName, iconImageUrl, iconFile }) => {
    setSelectedIconId(iconId);

    if (iconFile) {
      setIconFile(iconFile);
      setIconName("");
      setIconPreview(URL.createObjectURL(iconFile));
    } else if (iconName) {
      const dotIdx = iconName.lastIndexOf(".");
      setIconName(dotIdx !== -1 ? iconName.substring(0, dotIdx) : iconName);
      setIconFile(null);
      setIconPreview(iconImageUrl || "/default-icon.png");
    } else {
      setIconName("");
      setIconFile(null);
      setIconPreview("/default-icon.png");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (appNameError || iconNameError) return;

    let fullIconName = iconName;
    if (!iconFile && initialValues.iconName) {
      const dotIdx = initialValues.iconName.lastIndexOf(".");
      if (dotIdx !== -1) {
        fullIconName += initialValues.iconName.substring(dotIdx);
      }
    }

    onSubmit({
      appName,
      iconName: fullIconName,
      appUrl,
      iconFile,
      iconId: selectedIconId,
    });
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/60 backdrop-blur-sm p-4">
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
            buttonLabel="Edit App"
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
