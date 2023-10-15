"use client"

import { createSlice } from '@reduxjs/toolkit'

export interface JwtSlice {
    user: any,
    tokena: string
    posts: any
}

const initialState: JwtSlice = {
    user: {},
    tokena: '',
    posts: []
}

export const jwtReducer = createSlice({
    name: 'jwt',
    initialState,
    reducers: {
        setLoginRedux: (state, action) => {
            state.user = action.payload.user
            state.tokena = action.payload.token
          },
        setLogout: (state) => {
            state.user = {};
            state.tokena = '';
            state.posts = [];
          },
          setPosts: (state, action) => {
            state.posts = action.payload.feedPosts
          }
    }


})


export const { setLoginRedux, setLogout, setPosts } = jwtReducer.actions
export default jwtReducer.reducer