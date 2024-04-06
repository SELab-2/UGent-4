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
        cy.get('.MuiButton-root').should('exist').should('have.text', fixtures.name);
        cy.get('input[type=file]').should('exist');
        cy.contains(fixtures.tooltip).should('not.exist');
        cy.get('.MuiButton-root').trigger('mouseover');
        cy.contains(fixtures.tooltip).should('be.visible');
        // check the delete button
    });
});