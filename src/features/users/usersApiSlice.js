import { apiSlice } from '../../app/api/apiSlice'
import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit"

const usersAdapter = createEntityAdapter({})

//create normalised entity state object
const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        // QUERY 1 - getUsers
        getUsers: builder.query({
            query: () => ({
                url: '/users',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError // workaround by manually overriding 'response' and 'result' args to address Redux quirk
                }
            }),
            // convert _id (Mongo) to .id (for  normalised initialState), before going to cache
            transformResponse: responseData => {
                const loadedUsers = responseData.map(user => {
                    user.id = user._id
                    return user
                })
                return usersAdapter.setAll(initialState, loadedUsers)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        //bulk id tag
                        { type: 'User', id: 'LIST' },
                        //entity id tag
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        }),
        // MUTATION 1 - addNewUser
        addNewUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'POST',
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags: [
                { type: 'User', id: 'LIST' }
            ]
        }),
        // MUTATION 2 - updateUser
        updateUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'PATCH',
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        }),
        // MUTATION 3 - deleteUser
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: '/users',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        })
    })
})

//Export API endpoint hooks
export const {
    useGetUsersQuery,
    useAddNewUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = usersApiSlice

//Export selectors for relevant slice of normalised state (getUsers)
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

//Define memoised selector function wrap (for the above normalised state)
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data
)

//Rename and export default RTK selectors (for reading the normalised state)
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)

