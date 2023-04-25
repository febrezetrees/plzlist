import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../features/auth/authSlice'
import jwtDecode from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken) // state.auth.token
    let isAdmin = false
    let status = "User" //default role

    if (token) { //accessToken in state (containing a UserInfo object property)
        const decoded = jwtDecode(token)
        const { username, roles } = decoded.UserInfo

        isAdmin = roles.includes('Admin') //return true or false

        //if more than one role, order of precedence should be weakest role (top) to strongest role (bottom)
        if (isAdmin) status = "Admin"

        return { username, roles, status, isAdmin }
    }

    return { username: '', roles: [], isAdmin, status }
}

export default useAuth