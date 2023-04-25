import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAddNewItemMutation } from './itemsApiSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import useTitle from '../../hooks/useTitle'

const NewItemForm = ({ users }) => {
    useTitle('NewItemForm')

    const [addNewItem, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewItemMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [userId, setUserId] = useState(users[0].id)

    // form input reset (after firing isSuccess)
    useEffect(() => {
        if (isSuccess) {
            setTitle('')
            setText('')
            setUserId('')
            navigate('/dash/items')
        }
    }, [isSuccess, navigate]) // navigate only included as dependency to remove a warning

    // controlled inputs (via event handlers)
    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)
    const onUserIdChanged = e => setUserId(e.target.value)
    const onSaveItemClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewItem({ user: userId, title, text })
        }
    }

    // onSaveItemClicked min reqs (for DOM visibility)
    const canSave = [title, text, userId].every(Boolean) && !isLoading

    //set available users (options for <select> below)
    const options = users.map(user => {
        return (
            <option key={user.id} value={user.id}>
                {user.username}
            </option>
        )
    })

    // Dynamic CSS (error) logic
    const errClass = isError ? "errmsg" : "offscreen"
    const validTitleClass = !title ? 'form__input--incomplete' : ''
    const validTextClass = !text ? 'form__input--incomplete' : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveItemClicked}>
                <div className="form__title-row">
                    <h2>New Item</h2>
                    <div className="form__action-buttons">
                        <button className="icon-button" title="Save" disabled={!canSave}>
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="title">
                    Title:
                </label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id="title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label className="form__label" htmlFor="text">
                    Text:
                </label>
                <textarea
                    className={`form__input form__input--text ${validTextClass}`}
                    id="text"
                    name="text"
                    value={text}
                    onChange={onTextChanged}
                />
                <label className='form__label form__checkbox-container' htmlFor="username">
                    ASSIGNED TO:
                </label>
                <select
                    id="username"
                    name="username"
                    className="form__select"
                    value={userId}
                    onChange={onUserIdChanged}
                >
                    {options}
                </select>
            </form>
        </>
    )

    return content
}

export default NewItemForm