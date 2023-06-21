import React, {useState, useEffect} from "react";
import {Link, useHistory, useParams} from "react-router-dom";

import {createCard, updateCard} from "../../utils/api/index";

function CardForm({edit = false, deck={}, card={}}) {
    let history = useHistory();
    const {deckId, cardId} = useParams();
    
    const initialFormData = {front: "", back: ""};
    const [formData, setFormData] = useState({...initialFormData});
    
    useEffect(()=>{
        if (edit) {
            //load the current card data if we're editing
            setFormData({front: card.front, back: card.back});
        }
    }, [edit, card])

    function handleChange(event) {
        let newFormData = {...formData};
        newFormData[event.target.name] = event.target.value;
        setFormData(newFormData);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (edit) {
            //if we're editing, update the current card
            let card = {
                front: formData.front,
                back: formData.back,
                id: cardId,
                deckId: Number(deckId)
            };
            await updateCard(card);
            history.push(`/decks/${deckId}`); //take user back to current deck screen
        }
        else {
            //if we're adding, create the card with the form data
            let card = {
                front: formData.front,
                back: formData.back
            };
            await createCard(deckId, card);
            setFormData(initialFormData); //reset form to be used again for a new card
        }
    }

    //conditionally render "Edit" or "Add" if we're editing or adding
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
                <textarea id="back" name="back" rows="3" placeholder="Back side of the card" required onChange={handleChange} value={formData.back}/>
                <div className="mt-3">
                    <Link to={`/decks/${deckId}`} className="btn btn-secondary">{edit ? "Cancel" : "Done"}</Link>
                    <button type="submit" className="btn btn-primary">{edit ? "Submit" : "Save"}</button>
                </div>
            </form>
        </div>
    );
}

export default CardForm;