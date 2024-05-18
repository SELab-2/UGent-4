import { darken,lighten } from '@mui/system';
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
                backgroundColor: 'primary.main',
                textTransform: 'none',
                color: 'primary.contrastText',
                '&:hover': {
                    backgroundColor: darken(theme.palette.primary.main,0.5),
                },
            }}
            {...props}
        >
            {children}
        </BaseButton>
    )
}

export const SecundaryButton = ({ children, ...props }: any) => {
    return (
        <BaseButton
            variant="contained"
            disableElevation
            size="large"
            sx={{
                maxHeight: '35px',
                backgroundColor: 'secondary.main',
                textTransform: 'none',
                color: 'secondary.contrastText',
                '&:hover': {
                    backgroundColor: darken(theme.palette.secondary.main,0.2),
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
                border: `1px solid ${theme.palette.primary.dark}`,
                borderRadius: 12,
                backgroundColor: `${theme.palette.background.default}`,
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
``