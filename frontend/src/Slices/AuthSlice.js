import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getUser = createAsyncThunk('auth/getUser', async (userId) => {
    return await fetch(`http://localhost:5000/get-user/${userId}`)
        .then(res => res.json()).catch(err => console.log(err))
})

const AuthSlice = createSlice({
    name: 'auth',
    initialState: {
        status: null,
        url: 'http://localhost:5000/',
        isLoggedin: null,
        user: {},
        userId: ''
    },
    extraReducers: {
        [getUser.pending]: (state, action) => { state.status = 'pending' },
        [getUser.fulfilled]: (state, action) => {
            state.status = 'fullfilled';
            state.user = action.payload;
        },
        [getUser.rejected]: (state, action) => { state.status = 'rejected' }
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedin = true
            state.user = action.payload
            state.userId = action.payload._id
            localStorage.setItem('lsUserId',JSON.stringify(action.payload._id))
        },
        logout: state => {
            state.isLoggedin = false
            state.user = {}
            state.userId = ''
            localStorage.removeItem('lsUserId')
        },
        sessionLogin: (state, action) => {
            state.isLoggedin = true
            state.user = action.payload
            state.userId = action.payload._id
        }
    }
})

export const { login, logout, sessionLogin } = AuthSlice.actions
export default AuthSlice.reducer