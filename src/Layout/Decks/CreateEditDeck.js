import React, {useState, useEffect} from "react"
import {Link, useHistory, useParams} from "react-router-dom";

import {createDeck, readDeck, updateDeck} from "../../utils/api/index";

function CreateEditDeck({edit}) {
    let history = useHistory();
    const [loadingContent, setLoadingContent] = useState(<p>Loading...</p>);

    const initialFormData = {name: "", description: ""}
    const [formData, setFormData] = useState({...initialFormData});

    const {deckId} = useParams();
    useEffect(()=>{
        const abortController = new AbortController();
        if(deckId) {
            (async ()=>{
                try {
                    let deck = await readDeck(deckId, abortController.signal);
                    setFormData(deck);
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
        }

        return () => {
            abortController.abort(); // Cancels any pending request or response
        };
    }, [deckId]);

    function handleChange(event) {
        let newFormData = {...formData};
        newFormData[event.target.name] = event.target.value;
        setFormData(newFormData)
    }

    async function handleSubmit(event) {
        event.preventDefault();

        let newDeck;
        if (edit) {
            let deck = {
                name: event.target.name.value,
                description: event.target.description.value,
                id: deckId
            }
            newDeck = await updateDeck(deck);
        }
        else {
            let deck = {
                name: event.target.name.value,
                description: event.target.description.value
            }
            newDeck = await createDeck(deck);
        }
        history.push(`/decks/${newDeck.id}`);
    }


    if (formData.id || !edit) {
        const editOrCreate = edit ? "Edit" : "Create";
        const cancelDestination = edit ? `/decks/${deckId}` : `/`;
        return (
            <div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{editOrCreate} Deck</li>
                    </ol>
                </nav>
    
                <h1>{editOrCreate} Deck</h1>
                <form onSubmit={handleSubmit} className="d-flex flex-column">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" placeholder="Deck Name" required onChange={handleChange} value={formData.name}/>
                    <br/>
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" rows="5" placeholder="Brief description of the deck" onChange={handleChange} value={formData.description}/>
                    <div>
                        <Link to={cancelDestination} className="btn btn-secondary">Cancel</Link>
                        <button type="submit" className="btn btn-primary">Submit</button>
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

export default CreateEditDeck;