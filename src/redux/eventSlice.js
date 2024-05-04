import { createSlice } from "@reduxjs/toolkit";

const eventSlice = createSlice({
    name: "event",
    initialState: {
        eventProfile:{
            getEvent: null,
            isFetching: false,
            error: false
        },
        hospital:{
            getHospital: null,
            isFetching: false,
            error: false
        }
    },
    reducers: {
        eventProfileStart: (state) => {
            state.eventProfile.isFetching = true;
        },
        eventProfileSuccess: (state, action) => {
            state.eventProfile.isFetching = false;
            state.eventProfile.getEvent = action.payload;
            state.eventProfile.error = false;
        },
        eventProfileFailed: (state) => {
            state.eventProfile.isFetching = false;
            state.eventProfile.error = true;
        },

        hospitalStart: (state) => {
            state.hospital.isFetching = true;
        },
        hospitalSuccess: (state, action) => {
            state.hospital.isFetching = false;
            state.hospital.getHospital = action.payload;
            state.hospital.error = false;
        },
        hospitalFailed: (state) => {
            state.hospital.isFetching = false;
            state.hospital.error = true;
        },
    }
});

export const {
    eventProfileStart,
    eventProfileSuccess,
    eventProfileFailed,
    hospitalStart,
    hospitalSuccess,
    hospitalFailed
} = eventSlice.actions;

export default eventSlice.reducer;