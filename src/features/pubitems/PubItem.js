import { useState } from "react"

const PubItem = ({ pubItem, handleCheck, onTextChangeToParent, handleDelete }) => {
    const [liveText, setLiveText] = useState(pubItem.pubNewItemText)
    const [isEditing, setIsEditing] = useState(false)


    const handleLabelClick = () => {
        setIsEditing(true)
    }

    const handleInputChange = (e) => {
        setLiveText(e.target.value)
        onTextChangeToParent(liveText, pubItem.id)// calls the callback function to pass data back to parent
    }

    const handleInputBlur = () => {
        setIsEditing(false)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            e.target.blur()
        }
    }

    return (
        <li className="pubItem">
            <input
                type="checkbox"
                onChange={() => handleCheck(pubItem.id)}
                checked={pubItem.checked}
            />
            {isEditing ? (
                <input
                    type="text"
                    value={liveText}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            ) : (
                <label
                    style={(pubItem.checked) ? { textDecoration: 'line-through' } : null}
                    onClick={handleLabelClick}
                >
                    {liveText}
                </label>
            )}
            <p
                onClick={() => handleDelete(pubItem.id)}
                role="button"
                tabIndex="0"
            >TRASHBUTTON</p>
        </li>
    )
}

export default PubItem