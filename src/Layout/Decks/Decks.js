import React, {useState, useEffect} from "react";

import {listDecks, deleteDeck} from "../../utils/api/index";
import Deck from "./Deck";

function Decks() {
    const [decks, setDecks] = useState([])
    useEffect(()=>{
        const abortController = new AbortController();
        (async () => {
            try {
                let newDecks = await listDecks(abortController.signal);
                setDecks([...newDecks]);
            }
            catch (error) {
                if (error.name === "AbortError") {
                    // Ignore `AbortError`
                    console.log("Aborted");
                }
                else {
                    throw error;
                }
            }
        }) ();

        return () => {
            abortController.abort(); // Cancels any pending request or response
        };
    }, []);

    function handleDelete(deckId) {
        let message = "Delete this deck?\nYou will not be able to recover it.";
        if (window.confirm(message)) {
            let newDecks = decks.filter((deck)=>deck.id !== deckId);
            setDecks(newDecks);
            deleteDeck(deckId);
        }
    }

    return (
        <div>
            {decks.map((deck) =>
                <Deck deck={deck} handleDelete={handleDelete} key={deck.id} />
            )}
        </div>
    );
}

export default Decks;