import { useParams } from 'react-router-dom'
import EditItemForm from './EditItemForm'
import { useGetItemsQuery } from './itemsApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const EditItem = () => {
    useTitle('EditItem')

    const { id } = useParams()

    const { username, isAdmin } = useAuth()

    // Identify item for editing
    const { item } = useGetItemsQuery("itemsList", {
        selectFromResult: ({ data }) => ({
            item: data?.entities[id]
        })
    })
    //Identify users for that item
    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        })
    })
    console.log(users)

    //Loading bar
    if (!item || !users?.length) return <PulseLoader color={"#FFF"} />

    // Check req against auth state (from accessToken)
    if (!isAdmin) {
        if (item.username !== username) {
            return <p className="errmsg">No access</p>
        }
    }

    const content = <EditItemForm item={item} users={users} />


    return content
}

export default EditItem