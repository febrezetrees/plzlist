//NOT USED
import { store } from '../../app/store'
import { itemsApiSlice } from '../items/itemsApiSlice'
import { usersApiSlice } from '../users/usersApiSlice'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Prefetch = () => {
    //Manual subscription to the store via thunk function
    useEffect(() => {
        console.log('prefetch1')
        store.dispatch(itemsApiSlice.util.prefetch('getItems', 'itemsList', { force: true }))
        console.log('prefetch2')
        store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
    }, []) //only running when component mounts

    return <Outlet />
}

export default Prefetch