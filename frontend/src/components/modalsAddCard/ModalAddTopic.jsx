import { useState } from "react";
import "./style.css"
import {createPortal} from 'react-dom'
import { createTopic } from "../../api/auth";

const ModalAddTopic = ({onClose}) => {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        setMessage("");
    
        try {
            
          await createTopic({
            name: title,
            description,
            category_id: 1,
            });
        } catch (error) {
          setMessage(error.message || "Ошибка добавления темы");
        }
      };


    return createPortal ( 
        <div open className='dialog'>
            
            <div className="dialog-content">
                <button type="button" onClick={onClose} className="modal-close" aria-label="Закрыть модальное окно">⤫</button>
                <h2 className="title-modal">Создание темы</h2>
                <form className="field-text-input" onSubmit={handleSubmit}>
                    <h3 className="text-modal">Название темы</h3>
                    <input
                    className='input-modal'
                    type="text"
                    placeholder="Введите название темы"
                    value={title}
                    onChange={(event)=>setTitle(event.target.value)}
                    ></input>
                    <h3 className="text-modal">Описание темы</h3>
                    <textarea
                    className='input-modal input-modal-description'
                    type="text"
                    value={description}
                    placeholder="Введите описание темы"
                    onChange={(event)=>setDescription(event.target.value)}
                    ></textarea>
                    <button className='button-create' title={title}>Создать</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
        ,
        document.getElementById('modal')
     );
    }
 
export default ModalAddTopic;