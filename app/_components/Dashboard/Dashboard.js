"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchApps,
  editApp,
} from "@/app/_lib/features/app/appSlice";
import {
  fetchFavoriteAppIds,
  addFavoriteApp,
  removeFavoriteApp,
} from "@/app/_lib/features/userFavoriteApp/userFavoriteAppSlice";

import AppComponent from "@/app/_components/App/AppComponet";
import AddAppModal from "@/app/_components/App/AddAppModal";
import EditAppModal from "@/app/_components/App/EditAppModal";
import Splash from "@/app/_components/Common/Splash";

export default function Dashboard() {
  const dispatch = useDispatch();

  const { apps, loading, error } = useSelector((state) => state.app);
  const {
    favoriteAppIds,
    favoritesLoading,
    favoritesError,
  } = useSelector((state) => state.userFavoriteApp);

  const [initialLoadStarted, setInitialLoadStarted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAppData, setEditAppData] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [menuOpenFor, setMenuOpenFor] = useState(null);

  useEffect(() => {
    dispatch(fetchApps());
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) {
      dispatch(fetchFavoriteAppIds(user.id));
    }
    setInitialLoadStarted(true);
  }, [dispatch]);

  const favoriteApps = apps.filter((app) => favoriteAppIds.includes(app.id));
  const otherApps = apps.filter((app) => !favoriteAppIds.includes(app.id));

  const handleEditApp = async ({ appName, iconName, appUrl, iconFile, iconId }) => {
    setEditLoading(true);
    try {
      await dispatch(
        editApp({
          appId: Number(editAppData?.appId),
          appName,
          appUrl,
          iconName,
          iconId,
          iconFile,
        })
      ).unwrap();
      setShowEditModal(false);
    } catch (err) {
      console.error(err.message || "Error updating application");
    } finally {
      setEditLoading(false);
    }
  };

  const handleAddFavorite = (appId) => dispatch(addFavoriteApp({ appId }));
  const handleRemoveFavorite = (appId) => dispatch(removeFavoriteApp({ appId }));

  const overallLoading = loading || favoritesLoading;
  const overallError = error || favoritesError;

  if (!initialLoadStarted || overallLoading) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-white">
        <Splash />
      </div>
    );
  }

  if (overallError) {
    return <p className="text-red-500 text-center">{overallError}</p>;
  }

  return (
    <div className="relative overflow-x-hidden">
      <div className="flex flex-col gap-[clamp(1rem,2vw,10rem)] px-[clamp(0.8rem,3vw,10rem)] pt-[clamp(0.8rem,3vw,10rem)] pb-[clamp(0.7rem,2.2vw,6.8rem)]">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[clamp(1rem,2vw,10rem)]">
          {favoriteApps.map((app) => (
            <AppComponent
              key={app.id}
              appId={app.id}
              appName={app.appName}
              appUrl={app.appUrl}
              appImageUrl={app.icon.iconImageUrl}
              onEdit={() => {
                setEditAppData({
                  appId: app.id,
                  appName: app.appName,
                  appUrl: app.appUrl,
                  iconId: app.icon?.id || null,
                  iconName: app.icon?.iconName || "",
                  iconImageUrl: app.icon?.iconImageUrl || "",
                });
                setShowEditModal(true);
              }}
              onRemove={() => {
                console.log(`Remove ${app.appName}`);
              }}
              onAddFavorite={handleAddFavorite}
              onRemoveFavorite={handleRemoveFavorite}
              menuOpenFor={menuOpenFor}
              setMenuOpenFor={setMenuOpenFor}
              isFavorite={true}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[clamp(1rem,2vw,10rem)]">
          {otherApps.map((app) => (
            <AppComponent
              key={app.id}
              appId={app.id}
              appName={app.appName}
              appUrl={app.appUrl}
              appImageUrl={app.icon.iconImageUrl}
              onEdit={() => {
                setEditAppData({
                  appId: app.id,
                  appName: app.appName,
                  appUrl: app.appUrl,
                  iconId: app.icon?.id || null,
                  iconName: app.icon?.iconName || "",
                  iconImageUrl: app.icon?.iconImageUrl || "",
                });
                setShowEditModal(true);
              }}
              onRemove={() => {
                console.log(`Remove ${app.appName}`);
              }}
              onAddFavorite={handleAddFavorite}
              menuOpenFor={menuOpenFor}
              setMenuOpenFor={setMenuOpenFor}
              isFavorite={false}
            />
          ))}
        </div>

        <div className="flex justify-between items-center px-[clamp(0.2rem,0.5vw,2.5rem)] text-button-text">
          <button className="flex flex-col items-center justify-center text-[clamp(1.2rem,1.2vw,24rem)] px-button-px py-button-py transition-shadow duration-200 hover:bg-hover-button-bg hover:text-hover-button-text font-button-weight hover:font-button-weight-sm hover:rounded-[clamp(0.5rem,0.6vw,2rem)]">
            Removed
          </button>

          <button
            className="flex flex-col items-center justify-center text-[clamp(1.2rem,1.2vw,24rem)] px-button-px py-button-py transition-shadow duration-200 hover:bg-hover-button-bg hover:text-hover-button-text font-button-weight hover:font-button-weight-sm hover:rounded-[clamp(0.5rem,0.6vw,2rem)] text-nowrap"
            onClick={() => setShowModal(true)}
          >
            Add App
          </button>
        </div>
      </div>

      <AddAppModal open={showModal} onClose={() => setShowModal(false)} />
      <EditAppModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        initialValues={editAppData}
        onSubmit={handleEditApp}
        loading={editLoading}
        submitLabel="Edit Application"
      />
    </div>
  );
}
