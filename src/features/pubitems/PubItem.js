const PubItem = ({ pubItem, handleCheck, handleDelete }) => {

    return (
        <li className="pubItem">
            <input
                type="checkbox"
                onChange={() => handleCheck(pubItem.id)}
                checked={pubItem.checked}
            />
            <label
                style={(pubItem.checked) ? { textDecoration: 'line-through' } : null}
                onClick={handleCheck}
                value={pubItem.pubItemText}

            >{pubItem.pubItemText}</label>
            <p
                onClick={() => handleDelete(pubItem.id)}
                role="button"
                tabIndex="0"
            >TRASHBUTTON</p>
        </li>
    )
}

export default PubItem