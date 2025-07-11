import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchFavoriteAppIds = createAsyncThunk(
  'userFavoriteApp/fetchFavoriteAppIds',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/apps/get-user-favorite-apps/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch favorites");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addFavoriteApp = createAsyncThunk(
  'userFavoriteApp/addFavoriteApp',
  async ({ appId }, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/add-favorite-app`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appId, userId: user.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to add to favorites");
      return data.data.appId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeFavoriteApp = createAsyncThunk(
  'userFavoriteApp/removeFavoriteApp',
  async ({ appId }, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/remove-favorite-app`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appId, userId: user.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to remove from favorites");
      return data.data.appId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const userFavoriteAppSlice = createSlice({
  name: 'userFavoriteApp',
  initialState: {
    favoriteAppIds: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoriteAppIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteAppIds.fulfilled, (state, action) => {
        state.loading = false;
        state.favoriteAppIds = action.payload;
      })
      .addCase(fetchFavoriteAppIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFavoriteApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavoriteApp.fulfilled, (state, action) => {
        state.loading = false;
        const appId = action.payload;
        if (!state.favoriteAppIds.includes(appId)) {
          state.favoriteAppIds.push(appId);
        }
      })
      .addCase(addFavoriteApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFavoriteApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavoriteApp.fulfilled, (state, action) => {
        state.loading = false;
        const appId = action.payload;
        state.favoriteAppIds = state.favoriteAppIds.filter(id => id !== appId);
      })
      .addCase(removeFavoriteApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default userFavoriteAppSlice.reducer;
