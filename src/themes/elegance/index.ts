import { buildCustomColorScheme } from 'themes/utils';

/** An elegant dark color scheme with deep charcoal backgrounds and gold accents. */
const theme = buildCustomColorScheme({
    palette: {
        background: {
            default: '#0d0d0f',
            paper: '#18181e'
        },
        primary: {
            main: '#c9a227'
        },
        secondary: {
            main: '#8b6dce'
        },
        error: {
            main: '#cf6679'
        },
        starIcon: {
            main: '#c9a227'
        },
        AppBar: {
            defaultBg: '#12121a'
        },
        SnackbarContent: {
            bg: '#28282f',
            color: 'rgba(240, 237, 230, 0.87)'
        }
    }
});

export default theme;
