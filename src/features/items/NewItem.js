import NewItemForm from './NewItemForm'
import { useGetUsersQuery } from '../users/usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'
import useAuth from '../../hooks/useAuth'

const NewItem = () => {
    useTitle('NewItem')

    const { username, isAdmin } = useAuth()

    //Identify all users (for NewItemForm props)
    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        })
        //returns a users ARRAY
    })

    let filteredUsers
    if (isAdmin) {
        filteredUsers = users // prepare ids array of all cached entities ('notesList')
    } else {
        filteredUsers = users.filter(id => id.username === username) // prepare ids array of cached entities ('notesList') that match the accessToken in state. NOTE ids array gets filtered against the entities that have the correct 'username'. Returned ids array then includes NOTE ids of NOTE entities with the 'username' 
        console.log(filteredUsers)
    }


    if (!filteredUsers?.length) return <PulseLoader color={"#FFF"} />

    const content = <NewItemForm users={filteredUsers} />

    return content
}

export default NewItem