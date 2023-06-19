import React, {useState, useEffect} from "react"
import {Link, useHistory, useParams} from "react-router-dom";

import {readDeck, createCard, readCard, updateCard} from "../../utils/api/index";

function CreateEditCard({edit = false}) {
    const {deckId, cardId} = useParams();
    let history = useHistory();

    const [loadingContent, setLoadingContent] = useState(<p>Loading...</p>);

    const initialFormData = {name: "", description: ""}
    const [formData, setFormData] = useState({...initialFormData});
    const [deck, setDeck] = useState({id: 0});
    const [card, setCard] = useState({id: 0});

    useEffect(()=>{
        const abortController = new AbortController();
        //fetch deck
        (async ()=>{
            try {
                let newDeck = await readDeck(deckId, abortController.signal);
                setDeck(newDeck);
            }
            catch(error) {
                if (error.name === "AbortError") {
                    // Ignore `AbortError`
                    console.log("Aborted");
                }
                else if (error.message === "404 - Not Found") {
                    setLoadingContent(<h1>Deck not found.</h1>);
                }
                else {
                    throw error;
                }
            }
        })();
        
        //if we're editing a card
        if(edit) {
            //fetch card
            (async ()=>{
                try {
                    let newCard = await readCard(cardId, abortController.signal);
                    setCard(newCard);
                    setFormData({front: newCard.front, back: newCard.back})
                }
                catch(error) {
                    if (error.name === "AbortError") {
                        // Ignore `AbortError`
                        console.log("Aborted");
                    }
                    else if (error.message === "404 - Not Found") {
                        setLoadingContent(<h1>Card not found.</h1>);
                    }
                    else {
                        throw error;
                    }
                }
            })();
        }

        return () => {
            abortController.abort(); // Cancels any pending request or response
        };
    }, [deckId, cardId, edit]);

    function handleChange(event) {
        let newFormData = {...formData};
        newFormData[event.target.name] = event.target.value;
        setFormData(newFormData);
    }

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
        history.push(`/decks/${deckId}`);
    }

    //checking if the deck exists and we're adding a card, OR if the deck exists and the card exists while editing
    if (deck.id && (!edit || card.id)) {
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
    else {
        return (
            <div>
                {loadingContent}
            </div>
        );
    }
}

export default CreateEditCard;