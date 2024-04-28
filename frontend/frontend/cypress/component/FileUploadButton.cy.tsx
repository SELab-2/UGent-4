import InputFileUpload from '../../src/components/FileUploadButton';
import fixtures from '../fixtures/fixtures.json';

describe('FileUploadButton', () => {
    const mockProps = {
        name: fixtures.name,
        tooltip: fixtures.tooltip,
        onFileChange: () => {},
        fileTypes: ['pdf'],
        path: '../fixtures/test.pdf',
    };

    it('renders', () => {
        cy.mount(<InputFileUpload {...mockProps} />);
        cy.get('#uploadButton').should('exist').should('have.text', fixtures.name);
        cy.get('input[type=file]').should('exist');
        cy.contains(fixtures.tooltip).should('not.exist');
        cy.get('#uploadButton').trigger('mouseover');
        cy.contains(fixtures.tooltip).should('be.visible');
        cy.get('#uploadButton').trigger('mouseout');
        cy.contains(fixtures.tooltip).should('not.exist');
        cy.get('#clearButton').should('exist');
    });

    it('no path', () => {
        mockProps.path = '';
        cy.mount(<InputFileUpload {...mockProps} />);
        cy.get('#uploadButton').should('exist').should('have.text', fixtures.name);
        cy.get('#clearButton').should('not.exist');
    });

});