import React from "react";
import {Switch, Route, Link} from "react-router-dom";

import Header from "./Header";
import NotFound from "./NotFound";
import Decks from "./Decks//Decks";
import StudyDeck from "./Decks/StudyDeck";
import CreateEditDeck from "./Decks/CreateEditDeck";
import ViewDeck from "./Decks/ViewDeck";
import AddCard from "./Cards/AddCard";
import EditCard from "./Cards/EditCard";

function Layout() {
    return (
        <React.Fragment>
            <Header />
            <div className="container">
                <Switch>
                    {/* home */}
                    <Route path="/" exact>
                        <Link to="/decks/new" className="btn btn-secondary">Create Deck</Link>
                        <Decks />
                    </Route>
                    {/* create a deck */}
                    <Route path="/decks/new" exact>
                        <CreateEditDeck edit={false} />
                    </Route>
                    {/* edit a deck */}
                    <Route path="/decks/:deckId/edit" exact>
                        <CreateEditDeck edit={true} />
                    </Route>
                    {/* view the selected deck */}
                    <Route path="/decks/:deckId" exact>
                        <ViewDeck />
                    </Route>
                    {/* add a card */}
                    <Route path="/decks/:deckId/cards/new" exact>
                        <AddCard />
                    </Route>
                    {/* edit a card */}
                    <Route path="/decks/:deckId/cards/:cardId/edit" exact>
                        <EditCard />
                    </Route>
                    {/* study a deck */}
                    <Route path="/decks/:deckId/study" exact>
                        <StudyDeck />
                    </Route>
                    {/* if the url path is not found */}
                    <Route path="*">
                        <NotFound />
                    </Route>
                </Switch>
            </div>
        </React.Fragment>
    );
}

export default Layout;