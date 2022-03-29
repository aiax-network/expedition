import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";

export const lightTheme = responsiveFontSizes(createMuiTheme({
  props: {
    MuiAppBar: {
      position: "sticky",
    },
    MuiCard: {
      elevation: 0,
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        background: "#fff !important",
      },
    },
    MuiLinearProgress: {
      root: {
        backgroundColor: "#e7e7e7 !important",
        height: '7px',
        borderRadius: '4px',
      }
    }
  },
  palette: {
    primary: {
      main: "#33B968"
    },
    background: {
      default: "#F4F4F4",
    },
  },
  typography: {
    fontFamily: [
      '"Montserrat"',
      'sans-serif'
    ].join(','),
    fontSize: 16,
    fontWeightRegular: 400,
    body2: {
      fontSize: '0.875rem'
    }
  },
}));

export const darkTheme = responsiveFontSizes(createMuiTheme({
  props: {
    MuiAppBar: {
      position: "sticky",
    },
    MuiCard: {
      elevation: 0,
    },
  },
  palette: {
    type: "dark",
    background: {
      default: grey[900],
      paper: grey[800],
    },
  },
  overrides: {
    MuiTable: {
      root: {
        background: "transparent !important",
      },
    },
    MuiTypography: {
      root: {
        color: grey[400],
      },
    },
  },
  typography: {
    fontFamily: [
      '"Montserrat"',
      'sans-serif'
    ].join(','),
    fontSize: 16,
    fontWeightRegular: 400,
    body2: {
      fontSize: '0.875rem'
    }
  },
}));

export default {
  darkTheme,
  lightTheme,
};
