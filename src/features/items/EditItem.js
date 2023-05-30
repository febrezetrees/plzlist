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
    console.log(username)

    // Identify item for editing
    const { item } = useGetItemsQuery("itemsList", {
        selectFromResult: ({ data }) => ({
            item: data?.entities[id]
        })
    })
    console.log(`line 22: ${JSON.stringify(item)}`)

    //Identify users for that item
    /*SHOWS THE DATA FROM CACHE KEY 'USERSLIST' and 'ITEMSLIST'): 
    const { data } = useGetUsersQuery("usersList")
    console.log(data)*/
    /*SHOWS THE DATA FROM CACHE KEY 'ITEMSLIST'):
    const { data } = useGetItemsQuery("itemsList")
    console.log(data)*/

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(dataId => data?.entities[dataId])
        })
        //returns a users ARRAY
    })

    let filteredUsers
    if (isAdmin) {
        filteredUsers = users // prepare ids array of all cached entities ('usersList')
    } else {
        filteredUsers = users.filter(id => id.username === username) // prepare ids array of cached entities ('notesList') that match the accessToken in state. NOTE ids array gets filtered against the entities that have the correct 'username'. Returned ids array then includes NOTE ids of NOTE entities with the 'username' 
        console.log(filteredUsers)
    }

    //Loading bar
    if (!item || !filteredUsers?.length) return <PulseLoader color={"#FFF"} />

    // Check req against auth state (from accessToken)
    if (!isAdmin) {
        if (item.username !== username) {
            return <p className="errmsg">No access</p>
        }
    }

    const content = <EditItemForm item={item} users={filteredUsers} />


    return content
}

export default EditItem