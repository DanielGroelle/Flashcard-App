import React, {useState} from "react"
import {Link, useHistory} from "react-router-dom";

import {createDeck} from "../../utils/api/index";

function CreateDeck() {
    let history = useHistory();

    const initialFormData = {name: "", description: ""}
    const [formData, setFormData] = useState({...initialFormData});
    
    function handleChange(event) {
        let newFormData = {...formData};
        newFormData[event.target.name] = event.target.value;
        setFormData(newFormData)
    }

    async function handleSubmit(event) {
        event.preventDefault();
        
        let deck = {
            name: event.target.name.value,
            description: event.target.description.value
        }
        let newDeck = await createDeck(deck);
        history.push(`/decks/${newDeck.id}`);
    }
    
    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Create Deck</li>
                </ol>
            </nav>

            <h1>Create Deck</h1>
            <form onSubmit={handleSubmit} className="d-flex flex-column">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Deck Name" required onChange={handleChange} value={formData.name}/>
                <br/>
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" rows="5" placeholder="Brief description of the deck" onChange={handleChange} value={formData.description}/>
                <div>
                    <Link to="/" className="btn btn-secondary">Cancel</Link>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>

        </div>
    );
}

export default CreateDeck;