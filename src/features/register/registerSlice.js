// sets up an async thunk (standalone api req, separate to main api) that can be used in a separate component
import { createSlice } from '@reduxjs/toolkit'

const regSlice = createSlice({
    name: 'register',
    initialState: {
        regUser: null,
        regPwdNoHash: null,
        regRole: null
    },
    reducers: {
        setInterimReg: (state, action) => {
            const { accessToken } = action.payload
            state.token = accessToken
            const { username, password, roles } = action.payload
            state.regUser = username
            state.regPwdNoHash = password
            state.regRole = roles
        },
        clearPostLogin: (state, action) => {
            state.regUser = null
            state.regPwdNoHash = null
            state.regRole = null
        },
    }
})
//export actions and reducers, respectively
export const { setInterimReg, clearPostLogin } = regSlice.actions
export default regSlice.reducer

//selectors for external use in broader app components
export const selectRegUsername = (state) => state.register.regUser
export const selectRegPwd = (state) => state.register.regPwd
export const selectRegRole = (state) => state.register.regRole