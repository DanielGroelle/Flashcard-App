import React from "react";
import {Switch, Route, Link} from "react-router-dom";

import Header from "./Header";
import NotFound from "./NotFound";
import Decks from "./Decks//Decks";
import StudyDeck from "./Decks/StudyDeck";
import CreateEditDeck from "./Decks/CreateEditDeck";
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
                        <CreateEditDeck edit={false} />
                    </Route>
                    <Route path="/decks/:deckId/edit" exact>
                        <CreateEditDeck edit={true} />
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