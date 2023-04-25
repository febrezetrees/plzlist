import { useEffect } from 'react'

const useTitle = (title) => {

    useEffect(() => {
        const prevTitle = document.title
        document.title = title

        //cleanup function
        return () => document.title = prevTitle

    }, [title])
}

export default useTitle