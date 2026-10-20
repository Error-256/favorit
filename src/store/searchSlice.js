import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchBrands, fetchOffers } from "../api/priceApi";

export const searchBrands = createAsyncThunk(
  "search/brands",
  (number) => fetchBrands(number),
  {
    condition: (number, { getState }) => {
      const { query, brands } = getState().search;
      return !(query === number && brands.status === "loading");
    },
  },
);

export const searchOffers = createAsyncThunk(
  "search/offers",
  ({ number, brand }) => fetchOffers(number, brand),
);

const initialState = {
  number: "",
  query: "", // номер
  brands: { items: [], status: "idle", error: null, requestId: null },
  selectedBrand: null,
  offers: { items: [], status: "idle", error: null, requestId: null },
};

const addAsyncCases = (builder, thunk, key) => {
  builder
    .addCase(thunk.pending, (state, action) => {
      state[key] = {
        items: [],
        status: "loading",
        error: null,
        requestId: action.meta.requestId,
      };
    })
    .addCase(thunk.fulfilled, (state, action) => {
      if (state[key].requestId !== action.meta.requestId) return;
      state[key].items = action.payload;
      state[key].status = "success";
    })
    .addCase(thunk.rejected, (state, action) => {
      if (state[key].requestId !== action.meta.requestId) return;
      state[key].status = "error";
      state[key].error = action.error.message || "Неизвестная ошибка";
    });
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setNumber(state, action) {
      state.number = action.payload;
    },
    selectBrand(state, action) {
      state.selectedBrand = action.payload;
    },
    reset() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    addAsyncCases(builder, searchBrands, "brands");
    addAsyncCases(builder, searchOffers, "offers");
    builder.addMatcher(searchBrands.pending.match, (state, action) => {
      state.query = action.meta.arg;
      state.selectedBrand = null;
      state.offers = initialState.offers;
    });
  },
});

export const { setNumber, selectBrand, reset } = searchSlice.actions;
export default searchSlice.reducer;
