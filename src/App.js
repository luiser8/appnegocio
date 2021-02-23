import React, { useMemo, useState, useEffect } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.css';
import Header from './layout/Header';
import Splascreen from './layout/Splascreen';

function App() {
  const classes = useStyles();
  var [loading, setLoading] = useState(true);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: light)');
  var [is_session] = useState(window.localStorage.getItem('UsuarioId'));

  const theme = useMemo(
    () =>
      createMuiTheme({
        overrides:{
          MuiListItem: {
            root:{
              paddingTop: 4,
              paddingbottom: 4
            }
          },
          MuiInputLabel:{
            root:{
              color:'#000',
              "&:hover": {
                color: "#000"
              },
              "&$focused": {
                color: "#000"
              }
            }
          }
          ,
          MuiFilledInput:{
            root:{
              backgroundColor:'#fff',
              "&:hover": {
                backgroundColor: "#fff"
              },
              "&$focused": {
                backgroundColor: "#fff"
              }
            }
          },
          MuiFormControl:{
            marginNormal:{
              marginTop: 9,
              marginBottom: 5,
            }
          },
          MuiInputBase:{
            input:{
              height: `1.6876em`,
            }
          },
          MuiTableCell:{
            head:{
              color: 'mediumblue',
              fontWeight: 'bold',
            }
          }
        },
        palette: {
          type: 'light', //type: prefersDarkMode ? 'dark' : 'light',
          primary: {
            light: '#002884',
            main: '#ffffff',
            dark: '#002884',
            contrastText: '#000',
          },
          secondary: {
            main: '#303f9f',
          }
        },
      }),
    [prefersDarkMode],
  );

  useEffect(() => {
    setTimeout(async () => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      {!is_session ? (
        <>
          {loading ? (
            <Splascreen height="100vh"/>
          ) : (
              <>
               <ThemeProvider theme={theme}>
                <CssBaseline />
                <Header />
               </ThemeProvider> 
             </>
            )}
        </>
      ) : (
          <>
           <ThemeProvider theme={theme}> 
              <CssBaseline />
              <Header />
            </ThemeProvider>
          </>
        )}
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  h1: {
    color: '#ffc107', margin: 0, fontSize: 50
  },
  small: {
    margin: 0, marginTop: -10, float: 'right'
  }
}));

export default App;
