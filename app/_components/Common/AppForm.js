// AppForm.jsx
import Image from "next/image";

export default function AppForm({
  iconPreview,
  appName,
  iconName,
  appUrl,
  appNameError,
  iconNameError,
  loading,
  onSubmit,
  onAppNameChange,
  onIconNameChange,
  onUrlChange,
  onAppNameKeyDown,
  onIconPickerOpen,
  appNameRef,
  appUrlRef,
  selectedIconId,
  iconFile,
  buttonLabel = "Add Application",
}) {
  const isDisabled =
    loading ||
    (!iconFile && !selectedIconId) ||
    !appName ||
    !iconName ||
    !appUrl ||
    appNameError ||
    iconNameError;

  return (
    <form
      className="w-full h-full flex flex-col justify-between gap-6 md:gap-8 lg:gap-6 xl:gap-[clamp(1.3rem,1.2vw,3rem)] p-[clamp(0.7rem,1.3vw,4.3rem)]"
      onSubmit={onSubmit}
    >
      <div
        className="grid grid-cols-1 md:[grid-template-columns:auto_1fr_auto] gap-[clamp(1rem,2.2vw,7rem)] border-b-4 border-[#F7F7F8] pb-8 md:py-9 lg:py-10 xl:py-12"
      >
        <div className="order-1 md:order-1 flex flex-col items-center md:items-start self-center md:self-start">
          <span className="text-[clamp(1rem,1.2vw,5.6rem)] mb-[0.25rem] font-semibold text-dashboard-and-form-text">
            App Icon
          </span>
          <div
            className="relative cursor-pointer"
            onClick={onIconPickerOpen}
            title="Click to select icon"
          >
            <Image
              src={iconPreview || "/default-profile.png"}
              alt="App Icon"
              width={160}
              height={160}
              className={`object-contain w-32 md:w-[clamp(7rem,8vw,30rem)] h-32 md:h-[clamp(7rem,8vw,30rem)] ${iconPreview || "bg-neutral-300"}`}
            />
            <span className="absolute -top-3 -right-3 rounded-full p-[0.25rem] bg-white">
              <Image 
                src="/edit-icon.png"
                alt="Edit"
                width={20}
                height={20}
                className="w-[clamp(1.5rem,2vw,5.2rem)]  h-[clamp(1.5rem,2vw,5.2rem)]"
              />
            </span>
          </div>
        </div>

        <div className="order-2 md:order-2 flex flex-col justify-center md:justify-start gap-[clamp(1rem,2vw,5.5rem)]">
          <div className="flex flex-col lg:flex-row gap-[clamp(1rem,2vw,5rem)]">
            <div className="flex-1">
              <label className="block text-[clamp(1rem,1.2vw,5.6rem)] font-semibold mb-[0.25rem] text-dashboard-and-form-text">
                App name
              </label>
              <input
                type="text"
                value={appName}
                onChange={onAppNameChange}
                onKeyDown={onAppNameKeyDown}
                placeholder="E.g. holiday portal"
                ref={appNameRef}
                required
                className={`w-full placeholder:text-[clamp(0.9rem,1vw,4rem)] placeholder:text-slate-400 bg-slate-100 border-[clamp(1px,0.1vw,3px)] rounded-[clamp(0.25rem,0.3vw,0.8rem)] font-semibold text-[clamp(0.8rem,0.9vw,3rem)] text-sky-950 px-[clamp(1rem,1.5vw,2rem)] py-[clamp(0.55rem,1vw,5rem)] focus:outline-none ${
                  appNameError
                    ? "border-red-500"
                    : "border-form-border-color focus:ring-2 focus:ring-blue-500"
                }`}
              />
              {appNameError && (
                <span className="text-red-500 text-[clamp(0.7rem,0.9vw,3rem)] font-bold">{appNameError}</span>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-[clamp(1rem,1.2vw,5.6rem)] font-semibold mb-[0.25rem] text-dashboard-and-form-text">
                Icon name
              </label>
              <input
                type="text"
                value={iconName}
                onChange={onIconNameChange}
                placeholder="E.g. portal-icon"
                required
                className={`w-full placeholder:text-[clamp(0.9rem,1vw,4rem)] placeholder:text-slate-400 bg-slate-100 border-[clamp(1px,0.1vw,3px)] rounded-[clamp(0.25rem,0.3vw,0.8rem)] font-semibold text-[clamp(0.8rem,0.9vw,3rem)] text-sky-950 px-[clamp(1rem,1.5vw,2rem)] py-[clamp(0.55rem,1vw,5rem)] focus:outline-none ${
                  iconNameError
                    ? "border-red-500"
                    : "border-form-border-color focus:ring-2 focus:ring-blue-500"
                }`}
              />
              {iconNameError && (
                <span className="text-red-500 text-[clamp(0.7rem,0.9vw,3rem)] font-bold">{iconNameError}</span>
              )}
            </div>
          </div>

          <div>
            <input
              type="text"
              value={appUrl}
              onChange={onUrlChange}
              placeholder="E.g. https://example.com/your-application"
              ref={appUrlRef}
              required
              className="w-full placeholder:text-[clamp(0.9rem,1vw,4rem)] placeholder:text-slate-400 bg-slate-100 rounded-[clamp(0.25rem,0.3vw,0.8rem)] font-semibold text-[clamp(0.8rem,0.9vw,3rem)] text-sky-950 px-[clamp(1rem,1.5vw,2rem)] py-[clamp(0.55rem,1vw,5rem)] focus:outline-none focus:ring-2 border-[clamp(1px,0.1vw,3px)] border-form-border-color focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="order-3 md:order-3 flex flex-col items-center md:items-start self-center md:self-start md:pt-5 pt-3xl pt-4xl pt-5xl">
          <div className="w-[9.5rem] md:w-[clamp(9rem,9.8vw,34rem)] h-40 md:h-[clamp(8.5rem,9.8vw,34rem)] rounded-[clamp(0.9rem,1.2vw,3rem)] border-[clamp(1px,0.1vw,3px)] border-preview-image-border-color flex flex-col items-center justify-between">
            {iconPreview && (
              <Image
                src={iconPreview}
                alt="Preview"
                width={100}
                height={100}
                className="object-contain w-32 md:w-[clamp(6rem,8vw,38rem)] h-36 md:h-[clamp(6rem,8vw,38rem)] rounded"
              />
            )}
            <span className="text-slate-500 text-center text-[clamp(0.8rem,0.9vw,3rem)] break-words mb-1.5">
              {appName}
            </span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex xl:py-3.5">
        <button
          type="submit"
          className={`ml-auto px-[clamp(1rem,1.5vw,3rem)] py-[clamp(0.58rem,0.8vw,1.6rem)] rounded-[clamp(0.37rem,0.58vw,1.1rem)] font-semibold text-white text-[clamp(1rem,1vw,3rem)] ${
            isDisabled ? "cursor-not-allowed bg-blue-300" : "bg-blue-500"
          }`}
          disabled={isDisabled}
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  );
}
