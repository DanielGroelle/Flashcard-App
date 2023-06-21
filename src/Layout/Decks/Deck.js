import React from "react";
import {Link} from "react-router-dom";

function Deck({deck, handleDelete}) {
    //individual deck display
    return (
        <div className="card">
            <div className="card-body">
                <div className="card-title d-flex justify-content-between">
                    <h5>{deck.name}</h5>
                    <h6>{deck.cards.length} cards</h6>
                </div>
                <p className="card-text">{deck.description}</p>
                <div className="d-flex w-100">
                    <Link to={`/decks/${deck.id}`} className="btn btn-secondary">View</Link>
                    <Link to={`/decks/${deck.id}/study`} className="btn btn-primary">Study</Link>
                    <div className="d-flex justify-content-end w-100">
                        <button className="btn btn-danger" onClick={() => handleDelete(deck.id)}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Deck;