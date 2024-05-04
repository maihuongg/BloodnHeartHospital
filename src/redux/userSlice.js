import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        profile:{
            getUser: null,
            isFetching: false,
            error: false
        },
        allevent:{
            getEvent: null,
            isFetching: false,
            error: false
        }
    },
    reducers: {
        userprofileStart: (state) => {
            state.profile.isFetching = true;
        },
        userprofileSuccess: (state, action) => {
            state.profile.isFetching = false;
            state.profile.getUser = action.payload;
            state.profile.error = false;
        },
        userprofileFailed: (state) => {
            state.profile.isFetching = false;
            state.profile.error = true;
        },

        allEventStart: (state) => {
            state.allevent.isFetching = true;
        },
        allEventSuccess: (state, action) => {
            state.allevent.isFetching = false;
            state.allevent.getEvent = action.payload;
            state.allevent.error = false;
        },
        allEventFailed: (state) => {
            state.allevent.isFetching = false;
            state.allevent.error = true;
        },
    }
});

export const {
    userprofileStart,
    userprofileSuccess,
    userprofileFailed,
    allEventStart,
    allEventSuccess,
    allEventFailed
} = userSlice.actions;

export default userSlice.reducer;