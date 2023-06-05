import { useState } from "react"
import PubItem from './PubItem'
import PubNewItem from './PubNewItem'
import { v4 as uuidv4 } from 'uuid'

import useTitle from '../../hooks/useTitle'

const PubItemsList = () => {
    useTitle('PubItemsList')

    const [pubItems, setPubItems] = useState([])
    const [pubNewItemText, setNewPubItemText] = useState('')

    //if login/registration successful, save list to their username on server//

    /*const {
        data: items,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetItemsQuery('itemsList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })*/

    //handle submit (for use in PubNewItem.js) - state only
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!pubNewItemText) {
            console.log('No item text')
            return //if blank value/false, return/exit function
        }
        addPubItem(pubNewItemText)
    }

    // handle add - state only
    const addPubItem = (pubNewItemText) => {
        const id = uuidv4(); //sets random id for each list item (helpful for later merging)
        const date = new Date()
        const newPubItem = { key: id, id, date, checked: false, pubNewItemText } //LIST ITEM CONTENT
        const revisedPubItems = [...pubItems, newPubItem]
        setPubItems(revisedPubItems)
        setNewPubItemText('')
    }

    //handle edit (based on component)
    const onTextChangeToParent = (text, id) => {
        const revisedPubItems = pubItems.map((pubItem) => pubItem.id === id ? { ...pubItem, pubNewItemText: text } : pubItem)
        setPubItems(revisedPubItems)

    }

    //handle check/strikethrough - state only
    const handleCheck = (id) => {
        const revisedPubItems = pubItems.map((pubItem) => pubItem.id === id ? { ...pubItem, checked: !pubItem.checked } : pubItem)
        setPubItems(revisedPubItems)
    }

    //handle delete - state only
    const handleDelete = (id) => {
        const revisedPubItems = pubItems.filter((pubItem) => pubItem.id !== id)
        setPubItems(revisedPubItems)
    }

    const content = (
        <div className="publist">
            <PubNewItem
                pubNewItemText={pubNewItemText}
                setNewPubItemText={setNewPubItemText}
                handleSubmit={handleSubmit}
            />
            {pubItems.length ? (
                <ul className="publist__ul">
                    {pubItems
                        .sort((a, b) => new Date(b.date) - new Date(a.date)) //sorts by most recent at the top of list
                        .map((pubItem) => (
                            <PubItem
                                key={pubItem.id}
                                pubItem={pubItem}
                                onTextChangeToParent={onTextChangeToParent}
                                handleCheck={handleCheck}
                                handleDelete={handleDelete}
                            />
                        ))}
                </ul>
            ) : (
                <p style={{ marginTop: '2rem' }}>Your list is empty</p>
            )}
        </div>
    )
    return content
}

export default PubItemsList

//memoised relevant?