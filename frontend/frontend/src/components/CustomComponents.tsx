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
                border: `3px outset ${theme.palette.primary.dark}`,
                borderRadius: 12,
            }}
            {...props}
        >
            {children}
        </BaseCard>
    )
}

export const Divider = () => {
    return (
        <BaseDivider
            sx={{
                border: '1px solid',
                borderColor: 'text.primary',
                borderRadius: 5,
            }}
        ></BaseDivider>
    )
}

export default { Button, Card, Divider }
