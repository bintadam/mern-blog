import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error:null,
    loading:false
}

const userSlice =  createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => { /// action is the information we get back
            state.currentUser = action.payload;
            state.loading = false;
            state.error = action.payload;
        },
        signInFailure: (state, action) => { /// action is the information we get back
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {signInStart, signInSuccess, signInFailure}  = userSlice.actions;

export default userSlice.reducer