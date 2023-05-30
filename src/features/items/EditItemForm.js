import { useState, useEffect } from 'react'
import { useUpdateItemMutation, useDeleteItemMutation } from './itemsApiSlice'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import useAuth from '../../hooks/useAuth'

const EditItemForm = ({ item, users }) => {
    const { isAdmin } = useAuth()

    const [updateItem, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateItemMutation()

    const [deleteItem, {
        //renaming object properties
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteItemMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState(item.title)
    const [text, setText] = useState(item.text)
    const [completed, setCompleted] = useState(item.completed)
    const [userId, setUserId] = useState(item.user)

    // form input reset (after firing isSuccess / isDelSuccess)
    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setTitle('')
            setText('')
            setUserId('')
            navigate('/dash/items')
        }
    }, [isSuccess, isDelSuccess, navigate]) // navigate only included as dependency to remove a warning

    // controlled inputs (via event handlers)
    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)
    const onCompletedChanged = e => setCompleted(prev => !prev)
    const onUserIdChanged = e => setUserId(e.target.value)

    // onSaveItemClicked min reqs (for DOM visibility)
    const canSave = [title, text, userId].every(Boolean) && !isLoading

    const onSaveItemClicked = async (e) => {
        if (canSave) {
            await updateItem({ id: item.id, user: userId, title, text, completed })
        }
    }

    const onDeleteItemClicked = async () => {
        await deleteItem({ id: item.id })
    }

    //setting date/time for create/edit
    const created = new Date(item.createdAt).toLocaleString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

    const updated = new Date(item.updatedAt).toLocaleString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

    //set available users (options for <select> below)
    let options
    if (isAdmin) {
        options = users.map(user => {
            return (
                <option key={user.id} value={user.id}>
                    {user.username}
                </option>
            )
        })
    }

    // Dynamic CSS (error) logic
    const errClass = (isError || isDelError) ? 'errmsg' : 'offscreen'
    const validTitleClass = !title ? 'form__input--incomplete' : ''
    const validTextClass = !text ? 'form__input--incomplete' : ''
    const optionsLabelGate = !isAdmin ? 'offscreen' : 'form__label form__checkbox-container'
    const optionsListGate = !isAdmin ? 'offscreen' : 'form__select'

    // error message min reqs (for DOM visibility)
    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    // onDeleteItemClicked min reqs (for DOM visibility)
    const deleteButton = (
        <button
            className="icon-button"
            title="Delete"
            onClick={onDeleteItemClicked}
        >
            <FontAwesomeIcon icon={faTrashCan} />
        </button>
    )


    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit Item #{item.ticket}</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveItemClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        {deleteButton}
                    </div>
                </div>
                <label className="form__label" htmlFor="item-title">
                    Title:
                </label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id="item-title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label className="form__label" htmlFor="item-text">
                    Text:
                </label>
                <textarea
                    className={`form__input form__input--text ${validTextClass}`}
                    id="item-text"
                    name="text"
                    value={text}
                    onChange={onTextChanged}
                />
                <div className="form__row">
                    <div className="form__divider">
                        <label className="form__label form__checkbox-container" htmlFor="item-completed">
                            WORK COMPLETE:
                            <input
                                className="form__checkbox"
                                id="item-completed"
                                name="completed"
                                type="checkbox"
                                checked={completed}
                                onChange={onCompletedChanged}
                            />
                        </label>
                        <label className={optionsLabelGate} htmlFor="item-username">
                            ASSIGNED TO:
                        </label>
                        <select
                            id="item-username"
                            name="username"
                            className={optionsListGate}
                            value={userId}
                            onChange={onUserIdChanged}
                        >
                            {options}
                        </select>
                    </div>
                    <div className="form__divider">
                        <p className="form__created">Created:<br />{created}</p>
                        <p className="form__created">Updated:<br />{updated}</p>
                    </div>
                </div>
            </form>
        </>
    )
    return content
}

export default EditItemForm