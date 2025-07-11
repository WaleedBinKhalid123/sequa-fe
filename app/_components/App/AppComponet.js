import { useRef, useEffect, useState } from "react";
import Image from "next/image";

export default function AppComponent({
  appId,
  appName,
  appUrl,
  appImageUrl,
  onEdit,
  onRemove,
  menuOpenFor,
  setMenuOpenFor,
  onAddFavorite,
  onRemoveFavorite,
  isFavorite,
}) {
  const [editHovered, setEditHovered] = useState(false);
  const [removeHovered, setRemoveHovered] = useState(false);
  const [favoriteHovered, setFavoriteHovered] = useState(false);
  const menuRef = useRef(null);
  const cardRef = useRef(null);
  const [alignLeft, setAlignLeft] = useState(false);

  const showMenu = menuOpenFor === appId;

  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenFor(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu, setMenuOpenFor]);

  const handleContextMenu = (e) => {
    e.preventDefault();

    const rect = cardRef.current?.getBoundingClientRect();

    setTimeout(() => {
      if (rect && menuRef.current) {
        const menuWidth = menuRef.current.offsetWidth;
        setAlignLeft(rect.right + menuWidth > window.innerWidth);
      }
    }, 0);
    setMenuOpenFor(appId);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setMenuOpenFor(null);
    onEdit();
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setMenuOpenFor(null);
    onRemove();
  };

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    setMenuOpenFor(null);
    isFavorite ? onRemoveFavorite(appId) : onAddFavorite(appId);
  };

  const menuButtonClass =
    "group flex gap-2 xl:gap-4 2xl:gap-8 items-center justify-start block w-full text-left rounded-[clamp(0.5rem,0.6vw,2rem)] bg-menu-button-bg hover:bg-menu-button-hover-bg text-[clamp(1.4rem,1.7vw,10rem)] px-[clamp(1rem,1.5vw,10rem)] py-[clamp(0.4rem,1.4vh,4rem)]";

  return (
    <div
      ref={cardRef}
      onClick={() => window.open(appUrl, "_blank")}
      onContextMenu={handleContextMenu}
      className="relative"
    >
      <div
        className={`aspect-square h-full w-full flex flex-col items-center justify-center rounded-[clamp(0.5rem,0.58vw,2rem)] border-[clamp(0.5px,0.07vw,3px)] duration-200 cursor-pointer text-dashboard-and-form-text p-2 ${
          isFavorite
            ? `border-[#D7CBA4] ${showMenu ? "bg-orange-50" : "hover:bg-orange-50" } `
            : `border-[#E8ECEF] ${showMenu ? "bg-indigo-50" : "hover:bg-indigo-50" } `
        }`}
      >
        <div className="relative w-1/2 h-1/2 mb-7">
          <Image
            src={appImageUrl || "/default-icon.png"}
            alt={appName}
            fill
            className="object-contain rounded-lg"
          />
        </div>

        <p className="text-[clamp(1.5rem,1.5vw,6rem)] text-center font-normal w-full truncate">
          {appName}
        </p>
      </div>

      {showMenu && (
        <div
          ref={menuRef}
          className={`absolute z-50 top-4 xl:top-8 2xl:top-10 top-3xl ${
            alignLeft ? "-left-13 md:-left-14 lg:-left-13 xl:-left-25 2xl:-left-42 left-3xl" : "-right-13 md:-right-14 lg:-right-13 xl:-right-25 2xl:-right-42 right-3xl"
          } bg-white rounded-[clamp(0.55rem,0.6vw,2.1rem)] shadow-md 
          w-[clamp(11.5rem,18.5vw,54rem)] 
          aspect-square
          p-[clamp(1rem,2vw,4rem)]
          flex flex-col justify-center 
          gap-y-[clamp(0.5rem,1.5vh,4rem)] 
          text-sky-950`}
        >
          <button
            className={menuButtonClass}
            onClick={handleEdit}
            onMouseEnter={() => setEditHovered(true)}
            onMouseLeave={() => setEditHovered(false)}
          >
            <Image
              src={editHovered ? "/hover-edit.png" : "/edit.png"}
              alt="Edit icon"
              width={20}
              height={20}
              className="w-[clamp(1rem,1.8vw,5.5rem)] h-[clamp(1rem,1.8vw,5.5rem)]"
            />
            Edit
          </button>

          <button
            className={menuButtonClass}
            onClick={handleRemove}
            onMouseEnter={() => setRemoveHovered(true)}
            onMouseLeave={() => setRemoveHovered(false)}
          >
            <Image
              src={removeHovered ? "/hover-delete.png" : "/delete.png"}
              alt="Delete icon"
              width={20}
              height={20}
              className="w-[clamp(1rem,1.8vw,5.5rem)] h-[clamp(1rem,1.8vw,5.5rem)]"
            />
            Remove
          </button>

          <button
            className={menuButtonClass}
            onClick={handleFavoriteToggle}
            onMouseEnter={() => setFavoriteHovered(true)}
            onMouseLeave={() => setFavoriteHovered(false)}
          >
            <Image
              src={favoriteHovered ? "/hover-heart.png" : "/heart.png"}
              alt="Favorite icon"
              width={20}
              height={20}
              className="w-[clamp(1rem,1.8vw,5.5rem)] h-[clamp(1rem,1.8vw,5.5rem)]"
            />
            {isFavorite ? "Unlike" : "Favorite"}
          </button>
        </div>
      )}
    </div>
  );
}
