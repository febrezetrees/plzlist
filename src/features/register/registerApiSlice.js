//injecting to apiSlice.js
import { apiSlice } from '../../app/api/apiSlice'

export const regApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //Mutation endpoint 1 - register with server
        registerReq: builder.mutation({
            query: userData => ({
                url: '/register',
                method: 'POST',
                body: { ...userData }
            })
        }),
    })
})

export const {
    useRegisterReqMutation
} = regApiSlice
