import React, {useState, useEffect} from "react";
import {Link, useHistory, useParams} from "react-router-dom";

import {createCard, updateCard} from "../../utils/api/index";

function CardForm({edit = false, deck={}, card={}}) {
    const {deckId, cardId} = useParams();
    let history = useHistory();
    
    const initialFormData = {front: "", back: ""};
    const [formData, setFormData] = useState({...initialFormData});
    
    useEffect(()=>{
        if (edit) {
            setFormData({front: card.front, back: card.back});
        }
    }, [edit])

    function handleChange(event) {
        let newFormData = {...formData};
        newFormData[event.target.name] = event.target.value;
        setFormData(newFormData);
    }

    let popup;
    async function handleSubmit(event) {
        event.preventDefault();
        if (edit) {
            let card = {
                front: event.target.front.value,
                back: event.target.back.value,
                id: cardId,
                deckId: Number(deckId)
            }
            await updateCard(card);
        }
        else {
            let card = {
                front: event.target.front.value,
                back: event.target.back.value
            }
            await createCard(deckId, card);
        }
        setFormData(initialFormData);
    }

    const editOrAdd = edit ? "Edit" : "Add";
    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>{deck.name}</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{editOrAdd} Card {cardId}</li>
                </ol>
            </nav>

            <h1>{edit ? deck.name + ":" : ""} {editOrAdd} Card</h1>
            <form onSubmit={handleSubmit} className="d-flex flex-column">
                <label htmlFor="front">Front</label>
                <textarea id="front" name="front" rows="3" placeholder="Front side of the card" required onChange={handleChange} value={formData.front}/>
                <br/>
                <label htmlFor="back">Back</label>
                <textarea id="back" name="back" rows="3" placeholder="Back side of the card" onChange={handleChange} value={formData.back}/>
                <div className="mt-3">
                    <Link to={`/decks/${deckId}`} className="btn btn-secondary">{edit ? "Cancel" : "Done"}</Link>
                    <button type="submit" className="btn btn-primary">{edit ? "Submit" : "Save"}</button>
                </div>
            </form>
        </div>
    );
}

export default CardForm;