import { useRef } from "react";

const PubNewItem = ({ pubNewItemText, setNewPubItemText, handleSubmit }) => {

    const inputRef = useRef();

    return (
        <form className='publist__additem' onSubmit={(e) => handleSubmit(e)}>
            <label htmlFor='addPubItemInput'>Add Item</label>
            <input
                autoFocus
                ref={inputRef}
                id='addPubItemInput'
                type='text'
                placeholder='Add Item'
                required
                value={pubNewItemText} //links to current state, single source of truth
                onChange={(e) => setNewPubItemText(e.target.value)} //Event listener onChange - updates state, single source of truth
            />
            <button
                type='submit'
                onClick={() => inputRef.current.focus()} //when button clicked, will shift focus back to current 'ref' (e.g. input)
            >
                <p>FAPLUS</p>
            </button>
        </form>
    )
}

export default PubNewItem