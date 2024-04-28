import { Button as BaseButton } from '@mui/material'

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

export default Button
