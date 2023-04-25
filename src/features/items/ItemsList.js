import { useGetItemsQuery } from './itemsApiSlice'
import Item from './Item'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const ItemsList = () => {
    useTitle('ItemsList')

    const { username, isAdmin } = useAuth()

    const {
        data: items,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetItemsQuery('itemsList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content
    if (!isLoading) content = <PulseLoader color={"#FFF"} />
    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }
    if (isSuccess) {
        const { ids, entities } = items

        // Identify relevant items for display in DOM
        let filteredIds
        if (isAdmin) {
            filteredIds = [...ids] //prepare ids array of all 'itemsList' cached entities
        } else {
            filteredIds = ids.filter(itemId => entities[itemId].username === username) //prepare ids array of 'itemsList' cached entities that match the accessToken in state
        }
        //Render identified items
        const tableContent = ids?.length && filteredIds.map(itemId => <Item key={itemId} itemId={itemId} />)

        content = (
            <table className="table table--notes">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th note_status">Username</th>
                        <th scope="col" className="table__th note_created">Username</th>
                        <th scope="col" className="table__th note_updated">Username</th>
                        <th scope="col" className="table__th note_title">Username</th>
                        <th scope="col" className="table__th note_username">Username</th>
                        <th scope="col" className="table__th note_edit">Username</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content
}

export default ItemsList