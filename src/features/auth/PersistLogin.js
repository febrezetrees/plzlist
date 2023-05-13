import { Outlet, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from './authSlice'
import PulseLoader from 'react-spinners/PulseLoader'

const PersistLogin = () => {
    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false) //to address react 18 strict mode

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()

    //to address react 18 strict mode
    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
            const verifyRefreshToken = async () => {
                console.log('verifying refresh token')
                try {
                    await refresh() // authApiSlice endpoint to get new accessToken. Endpoint will also dispatch accessToken to store (to 'state.auth.token' via setCredentials slice)
                    setTrueSuccess(true)
                } catch (err) {
                    console.error(err)
                }
            }
            if (!token && persist) verifyRefreshToken()
        }
        return () => effectRan.current = true
        //eslint-disable-next-line
    }, [])

    // lifecycle of api endpoint mutation
    let content
    if (!persist) {
        console.log('no persist')
        content = <Outlet />
    } else if (isLoading) {
        console.log('loading')
        content = <PulseLoader color={"#FFF"} />
    } else if (isError) {
        console.log('error yo. No access token returned. Expired refreshtoken?')
        content = (
            <p className='errMsg'>
                {`${error?.data?.message} - `}
                <Link to="/login">Please login again</Link>
            </p>
        )
    } else if (isSuccess && trueSuccess) {
        console.log('success')
        content = <Outlet />
    } else if (token && isUninitialized) {
        console.log('token and uninitialized (i.e. query hasn\'t started yet')
        console.log(isUninitialized)
        content = <Outlet />
    }

    return content
}

export default PersistLogin