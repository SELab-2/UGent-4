import { StudentsView } from "../../../src/pages/scoresPage/StudentsView";
import { BrowserRouter } from "react-router-dom";
import fixtures from "../../fixtures/fixtures.json";

describe("StudentsView", () => {

    const mockProps = {
        project: fixtures.fullProject,
        groepen: fixtures.scoreGroups,
        setGroepen: () => {},
        changeScore: () => {},
    };

  it("renders", () => {
    cy.mount(<BrowserRouter><StudentsView {...mockProps}/></BrowserRouter>);
    for (let i = 0; i < mockProps.groepen.length; i++) {
        cy.get(`#group${mockProps.groepen[i].group_number}`).should('exist');
    }
    });
});