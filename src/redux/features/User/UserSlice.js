import { createSlice } from '@reduxjs/toolkit'

const UserSlice = createSlice({
    name: 'user',
    initialState: {
        isAuthentication: false,
        user: {},
        permission: [],
        // accounts: [],
        // users: [],
        token: '',
    },
    reducers: {
        setAuthenication (state, action) {
            return {...state,
            isAuthentication : true,
            user : action.payload.user,
            token: action.payload.token
            }
        },
        setDeAuthenication (state, action) {
            return {...state,
                isAuthentication : false,
                user : {},
                token: ''
            }
        },
        updateUserPersonalInfo (state, action) {
            return {user: action.payload.user, token: action.payload.token}
        }
    }
})

export default UserSlice.reducer
export const { setAuthenication, setDeAuthenication, updateUserPersonalInfo }  = UserSlice.actions
