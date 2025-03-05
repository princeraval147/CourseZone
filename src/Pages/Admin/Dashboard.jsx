import React from 'react'
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import SchoolIcon from '@mui/icons-material/School';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';

const NAVIGATION = [
    {
        segment: 'dashboard',
        title: 'Dashboard',
        icon: <DashboardIcon />,
    },
    {
        segment: 'addcourse',
        title: 'Add Course',
        icon: <AddIcon />,
    },
    {
        segment: 'mycourses',
        title: 'My Course',
        icon: <FormatListNumberedIcon />,
    },
    {
        segment: 'studentenrolled',
        title: 'Student Enrolled',
        icon: <SchoolIcon />,
    },
];

const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
});

function DemoPageContent({ pathname }) {
    return (
        <Box
            sx={{
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                width: "100%",
                maxWidth: "1200px",
                mx: "auto",
                overflow: "visible",
            }}
        >
            <Typography>Dashboard content for {pathname}</Typography>
        </Box>
    );
}

DemoPageContent.propTypes = {
    // pathname: PropTypes.string.isRequired,
    Navlink
};

const Dashboard = (props) => {

    const [session, setSession] = React.useState({
        user: {
            name: 'Prince Raval',
            email: 'princeraval147@gmail.com',
            image: 'https://avatars.githubusercontent.com/u/108798860?v=4',
        },
    });

    const authentication = React.useMemo(() => {
        return {
            signIn: () => {
                setSession({
                    user: {
                        name: 'Prince Raval',
                        email: 'princeraval147@gmail.com',
                        image: 'https://avatars.githubusercontent.com/u/108798860?v=4',
                    },
                });
            },
            signOut: () => {
                setSession(null);
            },
        };
    }, []);

    const router = useDemoRouter('/admin');

    const demoWindow = props?.window ?? undefined;

    return (
        <>
            <Box>
                <AppProvider
                    session={session}
                    authentication={authentication}
                    navigation={NAVIGATION}
                    router={router}
                    theme={demoTheme}
                    window={demoWindow}
                    branding={{
                        logo: <img src="https://mui.com/static/logo.png" alt="Adnin Panel" />,
                        title: 'Admin Panel',
                        homeUrl: '/admin',
                    }}
                >
                    <DashboardLayout sx={{ padding: "0px", margin: "0px", width: "100%" }}>
                        <DemoPageContent pathname={router.pathname} />
                    </DashboardLayout>
                </AppProvider>
            </Box>
        </>
    )
}

Dashboard.propTypes = {
    window: PropTypes.func,
};

export default Dashboard
