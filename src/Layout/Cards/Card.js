import React from "react";
import {Link} from "react-router-dom";

function Card({card, deckId, handleDeleteCard}) {
    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex">
                    <p className="card-text w-50 mr-4">{card.front}</p>
                    <p className="card-text w-50 ml-4">{card.back}</p>
                </div>
                <div className="d-flex justify-content-end">
                    <Link to={`/decks/${deckId}/cards/${card.id}/edit`} className="btn btn-secondary">Edit</Link>
                    <button className="btn btn-danger" onClick={()=>handleDeleteCard(card.id)}>Delete</button>
                </div>
            </div>
        </div>
    );
}

export default Card;