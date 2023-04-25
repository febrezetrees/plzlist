import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'

const Welcome = () => {
    const { username, isAdmin } = useAuth()

    useTitle('Welcome')

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    const content = (
        <section className="welcome">
            <p>{today}</p>
            <h1>Welcome {username}</h1>

            <p><Link to="/dash/items">View your items</Link></p>
            <p><Link to="/dash/items/new">Add new item</Link></p>

            {(isAdmin) && <p><Link to="/dash/users">View user settings</Link></p>}
            {(isAdmin) && <p><Link to="/dash/users/new">Add new user</Link></p>}
        </section>
    )

    return content
}

export default Welcome