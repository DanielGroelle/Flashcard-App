import React, {useEffect, useState} from "react";
import {Link, useParams, useHistory} from "react-router-dom";

import {readDeck, deleteDeck, deleteCard} from "../../utils/api/index";
import Card from "../Cards/Card";

function ViewDeck() {
    const {deckId} = useParams();
    const initialDeck = {cards: [{front: "", back: "", id: 0}]}
    const [deck, setDeck] = useState({...initialDeck});
    //content to display while page is loading or if deck cant be found
    const [loadingContent, setLoadingContent] = useState(<p>Loading...</p>);

    let history = useHistory();

    useEffect(()=>{
        const abortController = new AbortController();
        (async ()=>{
            try {
                let newDeck = await readDeck(deckId, abortController.signal);
                setDeck({...newDeck});
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

        return () => {
            abortController.abort(); // Cancels any pending request or response
        };
    }, [deckId]);

    async function handleDeleteDeck() {
        let message = "Delete this deck?\nYou will not be able to recover it.";
        if (window.confirm(message)) {
            await deleteDeck(deckId);
            history.push("/");
        }
    }

    async function handleDeleteCard(cardId) {
        let message = "Delete this card?\nYou will not be able to recover it.";
        if (window.confirm(message)) {
            let newDeck = JSON.parse(JSON.stringify(deck));
            newDeck.cards = newDeck.cards.filter((card)=>card.id !== cardId);
            setDeck(newDeck);
            await deleteCard(cardId);
        }
    }

    //if the deck has been fetched yet
    if (deck.id) {
        return (
            <div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{deck.name}</li>
                    </ol>
                </nav>
    
                <h5>{deck.name}</h5>
                <p>{deck.description}</p>
    
                <div className="d-flex justify-content-between">
                    <div>
                        <Link to={`${deck.id}/edit`} className="btn btn-secondary" edit={"true"}>Edit</Link>
                        <Link to={`${deck.id}/study`} className="btn btn-primary">Study</Link>
                        <Link to={`/decks/${deckId}/cards/new`} className="btn btn-primary">Add Cards</Link>
                    </div>
                    <div>
                        <button className="btn btn-danger" onClick={handleDeleteDeck}>Delete</button>
                    </div>
                </div>
    
                <div className="my-3">
                    <h2>Cards</h2>
                    {deck.cards.map((card)=> {
                        return <Card card={card} deckId={deck.id} key={card.id} handleDeleteCard={handleDeleteCard}/>}
                    )}
                </div>
            </div>
        );
    }
    else {
        //if the deck is loading or couldnt be found
        return (
            <div>
                {loadingContent}
            </div>
        );
    }
}

export default ViewDeck;