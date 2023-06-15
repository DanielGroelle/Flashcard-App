import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";

import {readDeck} from "../../utils/api/index";
import Card from "../Cards/Card";

function ViewDeck() {
    const {deckId} = useParams();
    const initialDeck = {cards: [{front: "", back: "", id: 0}]}
    const [deck, setDeck] = useState({...initialDeck});
    //content to display while page is loading or if deck cant be found
    const [loadingContent, setLoadingContent] = useState(<p>Loading...</p>);

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
                        <button className="btn btn-primary">Add Cards</button>
                    </div>
                    <div>
                        <button className="btn btn-danger">Delete</button>
                    </div>
                </div>
    
                <div className="my-3">
                    <h2>Cards</h2>
                    {deck.cards.map((card)=> {
                        return <Card card={card} key={card.id}/>}
                    )}
                </div>
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

export default ViewDeck;