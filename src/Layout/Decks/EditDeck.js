import React, {useState, useEffect} from "react"
import {Link, useHistory, useParams} from "react-router-dom";

import {readDeck, updateDeck} from "../../utils/api/index";

function EditDeck() {
    let history = useHistory();
    
    const initialFormData = {name: "", description: "", id: 0};
    const [formData, setFormData] = useState({...initialFormData});
    const {deckId} = useParams();
    useEffect(()=>{
        (async ()=>{
            let deck = await readDeck(deckId);
            setFormData(deck);
        })();
    }, [deckId]);
    
    function handleChange(event) {
        let newFormData = {...formData};
        newFormData[event.target.name] = event.target.value;
        setFormData(newFormData)
    }

    async function handleSubmit(event) {
        event.preventDefault();
        
        let deck = {
            name: event.target.name.value,
            description: event.target.description.value,
            id: deckId
        }
        let updatedDeck = await updateDeck(deck);
        history.push(`/decks/${updatedDeck.id}`);
    }
    
    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Edit Deck</li>
                </ol>
            </nav>

            <h1>Edit Deck</h1>
            <form onSubmit={handleSubmit} className="d-flex flex-column">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Deck Name" required onChange={handleChange} value={formData.name}/>
                <br/>
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" rows="5" placeholder="Brief description of the deck" onChange={handleChange} value={formData.description}/>
                <div>
                    <Link to={`/decks/${deckId}`} className="btn btn-secondary">Cancel</Link>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>

        </div>
    );
}

export default EditDeck;