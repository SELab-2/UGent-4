import { DeadlineCalendar } from '../../src/components/DeadlineCalendar';

describe('DeadlineCalender', () => {

    // TDOO: Fix Error: MUI: Can not find the date and time pickers localization context. 
    // It looks like you forgot to wrap your component in LocalizationProvider.
    // This can also happen if you are bundling multiple versions of the @mui/x-date-pickers package

    const mockProps = {
        deadlines: [new Date()],
    };

    it('renders', () => {
        cy.mount(<DeadlineCalendar {...mockProps} />);
        cy.get('.MuiPaper-root').should('exist');
        cy.get('.MuiTypography-root').should('exist').should('have.text', new Date().toLocaleDateString());
    });

    it('renders with no deadline', () => {
        mockProps.deadlines = [];
        cy.mount(<DeadlineCalendar {...mockProps} />);
        cy.get('.MuiPaper-root').should('exist');
        cy.get('.MuiTypography-root').should('exist').should('have.text', 'No deadline');
    });
});