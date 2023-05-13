import { Link } from 'react-router-dom'

const Public = () => {
    const content = (
        <section className="public">
            <header>
                <h1>Welcome to plzlist landing page</h1>
            </header>
            <main className="public__main">
                <p>This is the Public.js component</p>
            </main>
            <footer>
                <Link to="/login">Login here</Link>
            </footer>
        </section>
    )
    return content
}

export default Public