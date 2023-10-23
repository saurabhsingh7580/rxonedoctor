import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {BASE_URL,API_MODE} from '@env'

const initialState = {
  loading: false,
  selectDate: [],
  error: '',
};

export const fetchAsyncSelectDate = createAsyncThunk(
  'selectDate/fetchAsyncSelectDate',
  params => {
    return axios
      .get(
          `${BASE_URL}patient/list/doc/slots/${API_MODE}/${params.hos_id}/${params.doc_id}/${params.type}/${params.current}`,
        {
          headers: {pt_token: params.pt_token, pt_key: params.pt_key},
        },
      )
      .then(response => response.data);
  },
);

const selectDateSlice = createSlice({
  name: 'selectDate',
  initialState,
  extraReducers: builder => {
    builder.addCase(fetchAsyncSelectDate.pending, state => {
      state.loading = true;
    });
    builder.addCase(fetchAsyncSelectDate.fulfilled, (state, action) => {
      state.loading = false;
      state.selectDate = action.payload;
      state.error = '';
    });
    builder.addCase(fetchAsyncSelectDate.rejected, (state, action) => {
      state.loading = false;
      state.selectDate = [];
      state.error = action.error.message;
    });
  },
});

export default selectDateSlice.reducer;
