import React, {useState, useEffect} from "react";
import {useParams, useHistory, Link} from "react-router-dom";

import {readDeck} from "../../utils/api/index";

function StudyDeck() {
    const initialDeck = {cards: [{front: "", back: ""}]}
    const {deckId} = useParams();
    const [deck, setDeck] = useState({...initialDeck});
    const [currentCard, setCurrentCard] = useState(1);
    const [backOrFront, setBackOrFront] = useState("front");
    //content to display while page is loading or if deck cant be found
    const [loadingContent, setLoadingContent] = useState(<p>Loading...</p>);

    let history = useHistory();

    useEffect(()=>{
        const abortController = new AbortController();
        (async ()=>{
            try {
                let newDeck = await readDeck(deckId);
                setDeck({...newDeck});
            }
            catch (error) {
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
        })()

        return () => {
            abortController.abort(); // Cancels any pending request or response
        };
    }, [deckId]);

    function handleFlip() {
        setBackOrFront( backOrFront === "front" ? "back" : "front" );
    }

    function handleNext() {
        //checking if we are at the end of the deck to go back to start
        if (currentCard === deck.cards.length) {
            let message = "Restart cards?\nClick 'cancel' to return to the home page.";
            if (window.confirm(message)) {
                setCurrentCard(1);
                handleFlip();
            }
            else {
                history.push("/")
            }
        }
        else {
            setCurrentCard(currentCard + 1);
            handleFlip();
        }
    }

    //making sure the deck has 3 or more cards
    let content;
    if (deck.cards.length < 3) {
        content = (
            <div>
                <h2>Not enough cards.</h2>
                <p>You need at least 3 cards to study. There are {deck.cards.length} cards in this deck.</p>
                {/*!!!!!!!! todo make this link to add cards screen !!!!!!!!!!!*/}
                <Link to="/" className="btn btn-primary">Add Cards</Link>
            </div>
        );
    }
    else {
        content = (
            <div className="card" style={{width: "auto"}}>
                <div className="card-body">
                    <h5 className="card-title">Card {currentCard} of {deck.cards.length}</h5>
                    <p className="card-text">{deck.cards[currentCard-1][backOrFront]}</p>
                    <button onClick={handleFlip} className="btn btn-secondary">Flip</button>
                    {/* conditionally show the next button with a ternary */}
                    {backOrFront === "back" ? (<button onClick={handleNext} className="btn btn-primary">Next</button>) : ("")}
                </div>
            </div>
        );
    }

    //if the deck has been fetched yet
    if (deck.id) {
        return (
            <div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>{deck.name}</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Study</li>
                    </ol>
                </nav>
    
                <h1>Study: {deck.name}</h1>
    
                {content}
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

export default StudyDeck;