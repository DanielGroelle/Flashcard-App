import React from "react";
import {Switch, Route, Link} from "react-router-dom";

import Header from "./Header";
import NotFound from "./NotFound";
import Decks from "./Decks//Decks";
import StudyDeck from "./Decks/StudyDeck";
import CreateDeck from "./Decks/CreateDeck";
import EditDeck from "./Decks/EditDeck"
import ViewDeck from "./Decks/ViewDeck";

function Layout() {
    return (
        <React.Fragment>
            <Header />
            <div className="container">
                <Switch>
                    <Route path="/" exact>
                        <Link to="/decks/new" className="btn btn-secondary">Create Deck</Link>
                        <Decks />
                    </Route>
                    <Route path="/decks/new" exact>
                        <CreateDeck />
                    </Route>
                    <Route path="/decks/:deckId/edit" exact>
                        <EditDeck />
                    </Route>
                    <Route path="/decks/:deckId" exact>
                        <ViewDeck />
                    </Route>
                    <Route path="/decks/:deckId/study" exact>
                        <StudyDeck />
                    </Route>
                    <Route path="*">
                        <NotFound />
                    </Route>
                </Switch>
            </div>
        </React.Fragment>
    );
}

export default Layout;