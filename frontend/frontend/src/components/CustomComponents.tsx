import { darken } from '@mui/system'
import {
    Button as BaseButton,
    Card as BaseCard,
    Divider as BaseDivider,
    Box,
    ButtonProps,
    CardProps,
    DividerProps,
} from '@mui/material'
import theme from '../Theme.ts'
import { ReactNode } from 'react'

interface PrimaryButtonProps extends ButtonProps {
    children: ReactNode
}

export const Button = ({ children, ...props }: PrimaryButtonProps) => {
    return (
        <BaseButton
            variant="contained"
            disableElevation
            size="large"
            sx={{
                maxHeight: '40px',
                backgroundColor: 'primary.main',
                textTransform: 'none',
                color: 'primary.contrastText',
                '&:hover': {
                    backgroundColor: darken(theme.palette.primary.main, 0.5),
                },
            }}
            {...props}
        >
            {children}
        </BaseButton>
    )
}

interface SecondaryButtonProps extends ButtonProps {
    children: ReactNode
}

export const SecondaryButton = ({
    children,
    ...props
}: SecondaryButtonProps) => {
    return (
        <BaseButton
            variant="contained"
            disableElevation
            size="large"
            sx={{
                maxHeight: '40px',
                backgroundColor: 'secondary.main',
                textTransform: 'none',
                color: 'secondary.contrastText',
                '&:hover': {
                    backgroundColor: darken(theme.palette.secondary.main, 0.2),
                },
            }}
            {...props}
        >
            {children}
        </BaseButton>
    )
}

interface CustomCardProps extends CardProps {
    children: ReactNode
}

export const Card = ({ children, ...props }: CustomCardProps) => {
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

interface CustomDividerProps extends DividerProps {
    children?: ReactNode
}

export const Divider = ({ children, ...props }: CustomDividerProps) => {
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

interface EvenlySpacedRowProps {
    items: ReactNode[]
}

export const EvenlySpacedRow = ({ items }: EvenlySpacedRowProps) => {
    return (
        <Box width={'100%'} display="flex" justifyContent={'space-between'}>
            {items.map((item, index) => (
                <Box
                    key={index}
                    width={
                        items.length == 2
                            ? '50%'
                            : index == 0 || index == items.length - 1
                              ? 50 / items.length + '%'
                              : (100 - 100 / items.length) /
                                    (items.length - 2) +
                                '%'
                    }
                    sx={{
                        //border: '1px solid red',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box>{item}</Box>
                </Box>
            ))}
        </Box>
    )
}

export default { Button, Card, Divider, EvenlySpacedRow }
