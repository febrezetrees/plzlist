import NewItemForm from './NewItemForm'
import { useGetUsersQuery } from '../users/usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const NewItem = () => {
    useTitle('NewItem')

    //Identify all users (for NewItemForm props)
    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        })
    })

    if (!users?.length) return <PulseLoader color={"#FFF"} />

    const content = <NewItemForm users={users} />

    return content
}

export default NewItem