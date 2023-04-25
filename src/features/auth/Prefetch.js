import { store } from '../../app/store'
import { itemsApiSlice } from '../items/itemsApiSlice'
import { usersApiSlice } from '../users/usersApiSlice'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Prefetch = () => {
    //Manual subscription to the store via thunk function
    useEffect(() => {
        store.dispatch(itemsApiSlice.util.prefetch('getLists'), { force: true })
        store.dispatch(usersApiSlice.util.prefetch('usersList'), { force: true })
    }, []) //only running when component mounts

    return <Outlet />
}

export default Prefetch