import { GroupsPage } from "../../../src/pages/groupsPage/GroupsPage";
import { BrowserRouter } from "react-router-dom";
import fixtures from "../../fixtures/fixtures.json";

describe("GroupsPage", () => {
  it("renders", () => {
    cy.mount(<BrowserRouter><GroupsPage/></BrowserRouter>);
    cy.get("#logo").should("exist");
    cy.get("#userMenu").should("exist");
    cy.contains("Project 1: groepen");
  });
});