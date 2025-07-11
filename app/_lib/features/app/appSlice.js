import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const sortApps = (apps) => [...apps].sort((a, b) => a.appName.localeCompare(b.appName));

export const fetchApps = createAsyncThunk(
  'app/fetchApps',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/apps/get-all-added-apps`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch apps");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addApp = createAsyncThunk(
  'app/addApp',
  async ({ appName, appUrl, iconName, iconId, iconFile }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getState().user.token || localStorage.getItem("token");
      let res;
      let fullIconName = iconName; // If you handle extension logic, add it here

      if (iconFile) {
        const formData = new FormData();
        formData.append("appName", appName);
        formData.append("appUrl", appUrl);
        formData.append("iconName", fullIconName);
        formData.append("iconImage", iconFile);

        res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/apps/create`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } else {
        const body = { appName, appUrl, iconName: fullIconName, iconId };
        res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/apps/create`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      }

      const data = await res.json();
      if (!res.ok)  throw new Error(data.message || "Failed to add application");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const editApp = createAsyncThunk(
  'app/editApp',
  async ({ appId, appName, appUrl, iconName, iconId, iconFile }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getState().user.token || localStorage.getItem("token");
      let res;

      if (iconFile) {
        const formData = new FormData();
        formData.append("appId", appId);
        formData.append("appName", appName);
        formData.append("appUrl", appUrl);
        formData.append("iconName", iconName);
        formData.append("iconImage", iconFile);

        res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/apps/update`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } else {
        const body = {
          appId,
          appName,
          appUrl,
          iconName,
          iconId,
        };
        res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/apps/update`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) throw new Error(data.message || "Failed to update application");
      const data = await res.json();

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const appSlice = createSlice({
  name: 'app',
  initialState: {
    apps: [],
    favoriteAppIds: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApps.fulfilled, (state, action) => {
        state.loading = false;
        state.apps = action.payload;
      })
      .addCase(fetchApps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // .addCase(addApp.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      .addCase(addApp.fulfilled, (state, action) => {
        state.loading = false;
        state.apps.push(action.payload);
        state.apps = sortApps(state.apps);
      })
      .addCase(addApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // .addCase(editApp.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      .addCase(editApp.fulfilled, (state, action) => {
        state.loading = false;
        const updatedApp = action.payload;

        const index = state.apps.findIndex(app => app.id === updatedApp.id);
        if (index !== -1) {
          state.apps[index] = updatedApp;
          state.apps = sortApps(state.apps);
        }
      })
      .addCase(editApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default appSlice.reducer;
