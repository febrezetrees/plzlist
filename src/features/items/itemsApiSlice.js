import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit"
import { apiSlice } from '../../app/api/apiSlice'

const itemsAdapter = createEntityAdapter({
    //sort [ids] so on entity retrieval the 'completed' entities are at the botton of ItemsList
    sortComparer: (a, b) => (a.completed === b.completed) ? 0
        : a.completed ? 1
            : -1
})

const initialState = itemsAdapter.getInitialState()

export const itemsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        // QUERY 1 - getItems
        getItems: builder.query({
            query: () => ({
                url: '/items',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError // workaround by manually overriding 'response' and 'result' args to address Redux quirk
                }
            }),
            // convert _id (Mongo) to .id (for passing into normalised initialState)
            transformResponse: responseData => {
                const loadedItems = responseData.map(item => {
                    item.id = item._id
                    return item
                })
                return itemsAdapter.setAll(initialState, loadedItems)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        //bulk id tag
                        { type: 'Item', id: 'LIST' },
                        //entity id tag
                        ...result.ids.map(id => ({ type: 'Item', id }))
                    ]
                } else return [{ type: 'Item', id: 'LIST' }]
            }
        }),
        // MUTATION 1 - addNewItem
        addNewItem: builder.mutation({
            query: initialItem => ({
                url: '/items',
                method: 'POST',
                body: {
                    ...initialItem
                }
            }),
            invalidatesTags: [
                { type: 'Item', id: 'LIST' }
            ]
        }),
        // MUTATION 2 - updateItem
        updateItem: builder.mutation({
            query: initialItem => ({
                url: '/items',
                method: 'PATCH',
                body: {
                    ...initialItem
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Item', id: arg.id }
            ]
        }),
        // MUTATION 3 - deleteItem
        deleteItem: builder.mutation({
            query: ({ id }) => ({
                url: '/items',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Item', id: arg.id }
            ]
        })
    })
})

//Export API endpoint hooks
export const {
    useGetItemsQuery,
    useAddNewItemMutation,
    useUpdateItemMutation,
    useDeleteItemMutation
} = itemsApiSlice

//Export selectors for relevant slice of normalised state (getItems)
export const selectItemsResult = itemsApiSlice.endpoints.getItems.select()

//Define memoised selector function wrap (for the above normalised state)
const selectItemsData = createSelector(
    selectItemsResult,
    itemsResult => itemsResult.data
)

//Rename and export default RTK selectors (for reading the normalised state)
export const {
    selectAll: selectAllItems,
    selectById: selectItemById,
    selectIds: selectItemIds
} = itemsAdapter.getSelectors(state => selectItemsData(state) ?? initialState)