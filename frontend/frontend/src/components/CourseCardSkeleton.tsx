import { Card, Skeleton } from '@mui/material'

export const CourseCardSkeleton = () => {
    return (
        <>
            <Card
                elevation={1}
                sx={{
                    width: { xs: '100%', md: '60%' },
                    minWidth: 350,
                    maxWidth: 420,
                    backgroundColor: 'background.default',
                    borderRadius: 5,
                    padding: 0,
                    margin: 1,
                }}
            >
                <Skeleton
                    aria-label={'cardHeader'}
                    height={70}
                    variant={'rectangular'}
                    sx={{ bgcolor: 'secondary.main' }}
                />
                <Skeleton
                    aria-label={'cardContent'}
                    height={150}
                    variant={'rectangular'}
                    sx={{
                        bgcolor: 'background.default',
                        elevation: 1,
                    }}
                />
            </Card>
        </>
    )
}
