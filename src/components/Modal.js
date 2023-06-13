import { useState } from 'react'
import Login from '../features/auth/Login'
import Register from '../features/register/Register'

const Modal = ({ isOpen, closeModal, selectedValue /*handleFormChange*/ }) => {

    //start on logon
    const [logTabColour, setLogTabColour] = useState(true)
    const [regTabColour, setRegTabColour] = useState(false)
    const [bodyType, setBodyType] = useState(true) //true = login. false = register

    /*<div className='overlay'>
        <div className='modalContainer'>
            <p>modalContainer</p>
            <button onClick={onClose} className="modalExitButtonRight">
                X
            </button>
            <div className="modal__tabs">
                <button className="modal__tabs--left">
                    <p>Login button left</p>
                </button>
                <button className="odal__tabs--right">
                    <p>Register button right</p>
                </button>
                <p>Login</p>
            </div>
            <div className="modalBody">
                <p>Login deets/register deets - conditional CSS</p>
            </div>
        </div>
    </div>*/

    // CSS selector for error, user guide and pwd guide JSX elements
    const toggleTab = () => {
        setBodyType(!bodyType)
        setLogTabColour(!logTabColour)
        setRegTabColour(!regTabColour)
    }

    // tab css to be DEFINED IN CSS
    const logColourType = logTabColour ? "modal__content-tab" : "modal__content-tab subdued"
    const regColourType = regTabColour ? "modal__content-tab" : "modal__content-tab subdued"

    let content

    if (!isOpen) return

    if (isOpen) {

        content = (
            <dialog className="modal__overlay" open={isOpen}>
                <div className="modal__container">
                    <div className="modal__content">
                        <div classname="modal__content-row1">
                            {<button
                                className={logColourType}
                                onClick={toggleTab}>
                                <header className={logColourType}>
                                    <h2>Login</h2>
                                </header>
                            </button>}
                            {<button
                                className={regColourType}
                                onClick={toggleTab}>
                                <header className={regColourType}>
                                    <h2>Register</h2>
                                </header>
                            </button>}
                        </div>
                        <div className="modal__content-row2">
                            <Login bodyType={bodyType} />
                            <Register bodyType={bodyType} />
                        </div>
                    </div>
                    <div className="modal__exit">
                        <button className="modal__exit-btn" onClick={() => closeModal(selectedValue)}>
                            X
                        </button>
                    </div>
                </div>
            </dialog>
        )
    }

    return content
}

export default Modal