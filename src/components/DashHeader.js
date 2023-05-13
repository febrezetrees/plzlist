import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faFileCirclePlus,
    faFilePen,
    faUserGear,
    faUserPlus,
    faRightFromBracket
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate, Link, useLocation } from 'react-router-dom'

import { useSendLogoutMutation } from '../features/auth/authApiSlice'

import useAuth from '../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'

//pathname tests (with RegEx)
const DASH_REGEX = /^\/dash(\/)?$/
const ITEMS_REGEX = /^\/dash\/items(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

const DashHeader = () => {

    // hooks
    const { isAdmin } = useAuth()
    const navigate = useNavigate()
    const { pathname } = useLocation()

    //API endpoint hook, from authApiSlice
    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    //event handler for API endpoint req
    useEffect(() => {
        if (isSuccess) navigate('/')
    }, [isSuccess, navigate]) //navigate dependency to appears console warnings

    //event handler for button clicks
    const onNewItemClicked = () => navigate('/dash/items/new')
    const onNewUserClicked = () => navigate('/dash/users/new')
    const onItemsClicked = () => navigate('/dash/items')
    const onUsersClicked = () => navigate('/dash/users')

    //build dashboard header with regEx matches
    let dashClass = null
    if (!DASH_REGEX.test(pathname) && !ITEMS_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        dashClass = "dash-header__container--small"
    }

    //determine <Nav> buttons with RegEx matches
    let newUserButton = null
    if (USERS_REGEX.test(pathname)) {
        newUserButton = (
            <button className="icon-button" title="New User" onClick={onNewUserClicked}>
                <FontAwesomeIcon icon={faUserPlus} />
            </button>
        )
    }

    let newItemButton = null
    if (ITEMS_REGEX.test(pathname)) {
        newItemButton = (
            <button className="icon-button" title="New Item" onClick={onNewItemClicked}>
                <FontAwesomeIcon icon={faFileCirclePlus} />
            </button>
        )
    }

    let userButton = null
    if (isAdmin) {
        if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
            userButton = (
                <button className="icon-button" title="Users" onClick={onUsersClicked}>
                    <FontAwesomeIcon icon={faUserGear} />
                </button>
            )
        }
    }

    let itemsButton = null
    if (!ITEMS_REGEX.test(pathname) && pathname.includes('/dash')) {
        itemsButton = (
            <button className="icon-button" title="Items" onClick={onItemsClicked}>
                <FontAwesomeIcon icon={faFilePen} />
            </button>
        )
    }

    //logout button
    const logoutButton = (
        <button
            className="icon-button"
            title="Logout"
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    )

    //error display
    const errClass = isError ? "errmsg" : "offscreen"

    //populate button content
    let buttonContent
    if (isLoading) {
        buttonContent = <PulseLoader color={"#FFF"} />
    } else {
        buttonContent = (
            <>
                {newItemButton}
                {newUserButton}
                {itemsButton}
                {userButton}
                {logoutButton}
            </>
        )
    }

    //populate JSX
    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <header className="dash-header">
                <div className={`dash-header__container ${dashClass}`}>
                    <Link to="/dash">
                        <h1 className="dash-header__title">plzlist</h1>
                    </Link>
                    <nav className="dash-header__nav">
                        {buttonContent}
                    </nav>
                </div>
            </header>
        </>
    )
    return content
}

export default DashHeader