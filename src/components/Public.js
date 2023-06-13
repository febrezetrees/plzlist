
import { useState } from 'react'
import PubItemsList from '../features/pubitems/PubItemsList'
import Modal from './Modal'


const Public = () => {

    const [isOpen, setIsOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')

    const openModal = () => {
        setIsOpen(true)
    }

    const closeModal = (value) => {
        setIsOpen(false)
        setInputValue(value)
    }

    /*const handleFormChange = (e) => {
        setInputValue(e.target.value)
    }*/

    const content = (
        <section className="public">
            <header>
                <h1>plzlist</h1>
            </header>
            <nav>
                <button className="modalTrigger" onClick={openModal}>Modal to Login/Register</button>
                <Modal
                    isOpen={isOpen}
                    closeModal={closeModal}
                    selectedValue={inputValue}
                        /*handleFormChange={handleFormChange}*/ />
            </nav>
            <main className="public__main">
                <p>This is the Public.js component</p>
                <PubItemsList />
            </main>
            <footer>

            </footer>
        </section>
    )
    return content
}

export default Public