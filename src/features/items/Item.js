import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

import { useGetItemsQuery } from './itemsApiSlice'

import { memo } from 'react'

const Item = ({ itemId }) => {

    const { item } = useGetItemsQuery("itemsList", {
        selectFromResult: ({ data }) => ({
            item: data?.entities[itemId]
        })
    })

    const navigate = useNavigate()

    if (item) {
        const created = new Date(item.createdAt).toLocaleString('en-AU', {
            day: 'numeric', month: 'long'
        })

        const updated = new Date(item.updatedAt).toLocaleString('en-AU', { day: 'numeric', month: 'long' })

        const handleEdit = () => navigate(`/dash/items/${itemId}`)

        return (
            <tr className="table__row">
                <td className="table__cell item__status">
                    {item.completed
                        ? <span className="item__status--completed">Completed</span>
                        : <span className="item__status--open">Open</span>}
                </td>
                <td className="table__cell item__created">{created}</td>
                <td className="table__cell item__updated">{updated}</td>
                <td className="table__cell item__title">{item.title}</td>
                <td className="table__cell item__username">{item.username}</td>
                <td className="table__cell">
                    <button className="icon-button table__button" onClick={handleEdit}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )
    } else return null
}

const memoizedItem = memo(Item)

export default memoizedItem