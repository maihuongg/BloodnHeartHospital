import { createSlice } from "@reduxjs/toolkit";

const hospitalSlice = createSlice({
    name: "hospital",
    initialState: {
        profile:{
            gethospital: null,
            isFetching: false,
            error: false
        },
    },
    reducers: {
        hospitalprofileStart: (state) => {
            state.profile.isFetching = true;
        },
        hospitalprofileSuccess: (state, action) => {
            state.profile.isFetching = false;
            state.profile.gethospital = action.payload;
            state.profile.error = false;
        },
        hospitalrofileFailed: (state) => {
            state.profile.isFetching = false;
            state.profile.error = true;
        },
    }
});

export const {
    hospitalprofileStart,
    hospitalprofileSuccess,
    hospitalrofileFailed
} = hospitalSlice.actions;

export default hospitalSlice.reducer;