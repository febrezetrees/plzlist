import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'

const pubItemsAdapter = createEntityAdapter({ //automatically creates addOne, updateOne and removeOne
    /*sortComparer: (a, b) => b.date.localeCompare(a.date)*/
})

const initialState = pubItemsAdapter.getInitialState({
    pubList: [],
    error: null,
    count: 0
})

const pubItemsSlice = createSlice({
    name: 'pubitems',
    initialState,
    reducers: {
        addPubItem: pubItemsAdapter.addOne, //addOne is included by default. used to add a single entity to the state. It takes the current state and the entity as arguments, and returns the updated state with the added entity
        updatePubItem: pubItemsAdapter.updateOne, //updateOne is included by default. Used to update a single entity in the state. It takes the current state, an object containing the entity's ID, and the partial entity object with updated values. It returns the updated state with the modified entity
        removePubItem: pubItemsAdapter.removeOne, //removeOne is included by default. Used to remove a single entity from the state. It takes the current state and the entity's ID as arguments, and returns the updated state with the entity removed
        removeAllPubItems: (state, action) => {
            state.pubList = null
        }
    }
})

//actions export
export const {
    addPubItem,
    updatePubItem,
    removePubItem,
    removeAllPubItems
} = pubItemsSlice.actions

//reducer export
export default pubItemsSlice.reducer

//selector for the state (i.e. pubItems)
export const selectPubItems = (state) => state.pubitems.pubList

//const [pubItems, setPubItems] = useState([]); // source of state - the initial state we want to load with - with the intiial load via useEffect.