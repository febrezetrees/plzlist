import { useRef, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { setInterimReg, clearPostLogin } from './registerSlice'
import { useRegisterReqMutation } from './registerApiSlice'
import { useLoginMutation } from '../../features/auth/authApiSlice'
import { setCredentials } from '../../features/auth/authSlice'
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import usePersist from '../../hooks/usePersist'
import useTitle from '../../hooks/useTitle'
import PulseLoader from 'react-spinners/PulseLoader'

//Minimum username/password standards
const USER_REGEX = /^[A-z0-9]{3,20}$/ //checks for a username that consists of 3 to 20 characters from the English alphabet (both lowercase and uppercase letters) and numbers (0-9)
const PWD_REGEX = /^[A-z0-9!@#$%^&*]{4,12}$/ //checks for a password that consists of 4 to 12 characters. The characters can be from the English alphabet (both lowercase and uppercase letters), numbers (0-9), or the special characters !, @, #, $, %, ^, &, *, and (). No other characters or spaces are allowed in the password.

const Register = () => {
    useTitle('Register')

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useLoginMutation()

    const [registerReq, {
        //renaming object properties
        isLoading: isRegLoading,
        isError: isRegError,
        error: regError
    }] = useRegisterReqMutation()

    const userRef = useRef()
    const errRef = useRef()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [userFocus, setUserFocus] = useState(false)

    const [pwd, setPwd] = useState('')
    const [validPwd, setValidPwd] = useState(false)
    const [pwdFocus, setPwdFocus] = useState(false)

    const [matchPwd, setMatchPwd] = useState('')
    const [validMatch, setValidMatch] = useState(false)
    const [matchFocus, setMatchFocus] = useState(false)

    //for form errors
    const [errMsg, setErrMsg] = useState('')

    //const [success, setSuccess] = useState(false)

    //const [persist, setPersist] = usePersist()

    // focus on input element (for each re-render)
    useEffect(() => {
        userRef.current.focus()
    }, [])

    // validate username
    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    // validate password and matching pword
    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd))
        const match = pwd === matchPwd //boolean to check if pwd (OG) matches the match pwd instance (secondary)
        setValidMatch(match) //set validMatch state with true/false

    }, [pwd, matchPwd])

    // clear error message each re-render of dependencies
    useEffect(() => {
        setErrMsg('')
    }, [username, pwd, matchPwd])

    // PASS NEW DETAIL TO AUTO-LOGIN, AFTER SUCCESSFUL REGISTER
    /*useEffect(() => {
        if (isSuccess) {
            setUsername('')
            setPwd()
            setPassword('')
            navigate('/dash')
            navigate('/dash/users')
        }
    }, [isSuccess, navigate])*/

    //Controlled inputs for user/pwd JSX elements
    const handleUserInput = (e) => setUsername(e.target.value)
    const handlePwdInput = (e) => setPwd(e.target.value)
    const handleValidMatch = (e) => setMatchPwd(e.target.value)
    //const handleToggle = () => setPersist(prev => !prev)

    // CSS selector for error, user guide and pwd guide JSX elements
    const errClass = (errMsg || isError || isRegError) ? "errmsg" : "offscreen"
    const validUserClass = validUsername ? "valid" : "hide"
    const validPwdClass = validPwd ? "valid" : "hide"

    // onRegisterUserClicked min reqs (for DOM visibility)
    const canSave = [validUsername, validPwd, validMatch].every(Boolean) && !isLoading //extra regex hurdles ensure submit button can't be revealed by hack - returns true?

    //REGISTER SECTION
    const onRegisterUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            try {
                var { resUsername, resRole } = await registerReq({ username, pwd }).unwrap() //not selecting the res pwd
                dispatch(setInterimReg({ resUsername, pwd, resRole })) //all registrants will be users. Un-hashed pwd sent to store

            } catch (err) {
                //contemplate errors here
                if (!err.status) {
                    setErrMsg('No Server Response');
                } else if (err.status === 400) {
                    setErrMsg('Username or Password not passed to server')
                } else if (err.status === 401) {
                    setErrMsg('Unauthorised')
                } else if (err.status === 409) {
                    setErrMsg('Username taken')
                } else {
                    setErrMsg(`Registration / auto - login Failed - error: ${err.data?.message}`)
                }
                errRef.current.focus()
                console.log(errMsg)
                console.log(error)
                console.log(regError)
            }
        } else {
            setErrMsg("Invalid username/password for registration")
            return //escape prior to data going to backend
        }

        try {
            let password = pwd
            console.log('1')
            const { accessToken } = await login({ username, password }).unwrap()
            console.log('2')
            dispatch(setCredentials({ accessToken }))
            dispatch(clearPostLogin)

            setUsername('')
            setPwd('')
            setMatchPwd('')
            navigate('/dash')
        } catch (err) {
            console.log(err)
        }

    }

    // register loading prompt
    if (isLoading || isRegLoading) return <PulseLoader color={"#FFF"} />

    const content = (
        <>
            (<section>
                <header>
                    <p ref={errRef} className={errClass}>{errMsg}</p>

                    <h1>Register</h1>
                </header>
                <main>

                    <form className="form__title-row" onSubmit={onRegisterUserClicked}>

                        <label className="form__label" htmlFor="username">
                            Username:
                            <span className={validUserClass}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validUsername || !username ? "hide" : "invalid"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            type="text"
                            id="username" //The id attribute is used to provide a unique identifier for an HTML element on a page
                            name="username" // to identify the data being sent to the server. The value of the name attribute is passed along with the corresponding input's value in the form submission
                            ref={userRef}
                            autoComplete="off"
                            value={username}
                            onChange={handleUserInput}
                            onFocus={() => { setUserFocus(true) }} //triggered when an element gains focus, e.g. clicked or tabbed
                            onBlur={() => { setUserFocus(false) }} //triggered when an element loses focus, typically when another element is clicked or tabbed to.
                        />
                        <p id="usernote" className={userFocus && username && !validUsername ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            3 to 20 characters.<br />
                            Lowercase and uppercase permitted <br />
                            Numbers 0-9 allowed as well. <br />
                        </p>
                        <label htmlFor="password">
                            Password:
                            <span className={validPwdClass}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validPwd || !pwd ? "hide" : "invalid"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            required
                            onChange={handlePwdInput}
                            onFocus={() => { setPwdFocus(true) }}
                            onBlur={() => { setPwdFocus(false) }}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            3 to 20 characters.<br />
                            Lowercase and uppercase permitted <br />
                            Numbers 0-9 allowed as well. <br />
                            4 to 12 characters.<br />
                            Lowercase and uppercase letters permitted <br />
                            Numbers 0-9 and special characters !, @, #, $, %, ^, & and * allowed as well.
                        </p>
                        <label htmlFor="confirm_pwd">
                            Confirm password:
                            <span className={validMatch && matchPwd ? "valid" : "hide"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            value={matchPwd}
                            required
                            onChange={handleValidMatch}
                            onFocus={() => { setMatchFocus(true) }}
                            onBlur={() => { setMatchFocus(false) }}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>
                        <div className="form__action-buttons">
                            <button
                                disabled={!canSave} //i.e. if cansave returns true, its inverse unlocks the button
                                className="icon-button"
                                title="Save"
                            >
                                Save
                            </button>
                        </div>

                    </form>
                </main>
                <footer>
                    <Link to="/">Back to Home</Link>
                </footer>
            </section>
            )
        </>
    )

    return content
}

export default Register