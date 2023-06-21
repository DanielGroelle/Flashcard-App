import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

import {readDeck} from "../../utils/api/index";
import CardForm from "./CardForm";

function AddCard() {
    const {deckId, cardId} = useParams();

    const [loadingContent, setLoadingContent] = useState(<p>Loading...</p>);
    const [deck, setDeck] = useState({id: 0});

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

        return () => {
            abortController.abort(); // Cancels any pending request or response
        };
    }, [deckId, cardId]);

    //if the deck exists display the CardForm component
    if (deck.id) {
        return (
            <CardForm edit={false} deck={deck}/>
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

export default AddCard;