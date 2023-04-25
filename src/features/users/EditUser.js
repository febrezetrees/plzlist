import { useParams } from 'react-router-dom'
import EditUserForm from './EditUserForm'
import useTitle from '../../hooks/useTitle'

import { useGetUsersQuery } from './usersApiSlice'
import { PulseLoader } from 'react-spinners'

const EditUser = () => {
    useTitle('EditUser')

    const { id } = useParams() // id for user from URL

    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[id]
        })
    })

    if (!user) return <PulseLoader color={"#FFF"} />

    //Otherwise, if user id exists
    const content = <EditUserForm user={user} />

    return content
}

export default EditUser