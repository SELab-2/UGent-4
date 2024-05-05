import {
    Button as BaseButton,
    Card as BaseCard,
    Divider as BaseDivider,
} from '@mui/material'
import theme from '../Theme.ts'

export const Button = ({ children, ...props }: any) => {
    return (
        <BaseButton
            variant="contained"
            disableElevation
            size="large"
            sx={{
                maxHeight: '35px',
                bgcolor: 'primary.main',
                textTransform: 'none',
                color: 'primary.contrastText',
                '&:hover': {
                    backgroundColor: 'secondary.main',
                    color: 'secondary.contrastText',
                },
            }}
            {...props}
        >
            {children}
        </BaseButton>
    )
}

export const Card = ({ children, ...props }: any) => {
    return (
        <BaseCard
            elevation={0}
            style={{
                border: `3px solid ${theme.palette.primary.dark}`,
                borderRadius: 12,
                backgroundColor: `${theme.palette.background.paper}`,
            }}
            {...props}
        >
            {children}
        </BaseCard>
    )
}

export const Divider = ({ children, ...props }: any) => {
    return (
        <BaseDivider
            sx={{
                border: '1px solid',
                borderColor: 'text.primary',
                borderRadius: 5,
            }}
            {...props}
        >
            {children}
        </BaseDivider>
    )
}

export default { Button, Card, Divider }
