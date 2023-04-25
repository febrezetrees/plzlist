import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3500',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    //Response handler
    if (result?.error?.status === 403) {
        console.log('sending refresh token')

        //direct request to backend /auth for new access token
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
        //returns 'data'

        if (refreshResult?.data) {
            api.dispatch(setCredentials({ ...refreshResult.data }))
            result = await baseQuery(args, api, extraOptions)
        } else {
            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Refresh token expired"
            }
            return refreshResult //return error
        }
    }

    return result //return result (no error)
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagtypes: ['List', 'User'],
    endpoints: builder => ({})
})