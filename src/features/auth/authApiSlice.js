//injecting to apiSlice.js
import { apiSlice } from '../../app/api/apiSlice'
import { logOut, setCredentials } from './authSlice'

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //Mutation endpoint 1 - login
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        //Mutation endpoint 2 - logout
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log(data)
                    dispatch(logOut())
                    setTimeout(() => { //setTimeout wrap to circumvent RTK bug (giving RTK 1s to realise components have unmounted, before it runs resetApiState())
                        dispatch(apiSlice.util.resetApiState())
                    }, 1000)
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        //Mutation endpoint 3 - new access token
        refresh: builder.mutation({
            query: () => ({
                url: 'auth/refresh',
                method: 'GET' //req will include http-only cookie
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log(data)
                    const { accessToken } = data
                    dispatch(setCredentials({ accessToken }))
                } catch (err) {
                    console.log(err)
                }
            }
        })
    })
})

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation
} = authApiSlice
