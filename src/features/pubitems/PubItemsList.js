import { useState } from "react"
import PubItem from './PubItem'
import PubNewItem from './PubNewItem'
import { v4 as uuidv4 } from 'uuid'

import useTitle from '../../hooks/useTitle'

const PubItemsList = () => {
    useTitle('PubItemsList')

    const [pubItems, setPubItems] = useState([])
    const [pubItemText, setPubItemText] = useState('')

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
        if (!pubItemText) {
            console.log('No item text')
            return //if blank value/false, return/exit function
        }
        addPubItem(pubItemText)
    }

    // handle add - state only
    const addPubItem = (pubItemText) => {
        const id = uuidv4(); //sets random id for each list item (helpful for later merging)
        const newPubItem = { key: id, id, checked: false, pubItemText } //LIST ITEM CONTENT
        const revisedPubItems = [...pubItems, newPubItem]
        setPubItems(revisedPubItems)
        setPubItemText('')
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
                pubItemText={pubItemText}
                setPubItemText={setPubItemText}
                handleSubmit={handleSubmit}
            />
            {pubItems.length ? (
                <ul className="publist__ul">
                    {pubItems.map((pubItem) => (
                        <PubItem
                            key={pubItem.id}
                            pubItem={pubItem}
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