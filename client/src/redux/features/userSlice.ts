'use client'
import {createSlice} from '@reduxjs/toolkit'

export interface UserSlice {
    id: string
}

const initialState: UserSlice = {
    id: ''
}

export const userReducer = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setId: (state, action) => {
            state.id = action.payload.id
        }
    }


})


export const { setId } = userReducer.actions
export default userReducer.reducer