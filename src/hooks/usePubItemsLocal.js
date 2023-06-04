import { useState, useEffect } from 'react'

const usePubItemsLocal = () => {
    const [pubItemsLocal, setPubItemsLocal] = useState(JSON.parse(localStorage.getItem("pubItemsLocal")) || false)

    useEffect(() => {
        localStorage.setItem("pubItemsLocal", JSON.stringify(pubItemsLocal))
    }, [pubItemsLocal])

    return [pubItemsLocal, setPubItemsLocal]
}

export default usePubItemsLocal