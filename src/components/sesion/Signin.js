import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
    Link,
    Button,
    FormControl,
    Input,
    InputLabel,
    Paper,
    Typography,
} from '@material-ui/core';
import '../utils/Config';

const Signin = () => {
    const classes = useStyles();
    var [users, setUsers] = useState('');
    var [messages, setMessages] = useState('');
    var [alert, setAlert] = useState('');
    var [severity, setSeverity] = useState('');
    var [btn, setBtn] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const checkEmail = async (event) => {
        await fetch(`${global.config.appConfig.url.dev}Users?email=${event}`, {
            method: 'GET',
            headers: global.config.appConfig.headers.dev,
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return setCheckEmail(event, response.json());
            }
        }).catch(e => console.log(e))
    }

    const setCheckEmail = async (event, req) => {
        (await Promise.all([req])).map((items) => {
            console.log(items)
            if (!items) {
                setBtn(false);
                setEmail(event);
            } else {
                setBtn(true);
                setEmail(event);
                setMessages('Este Email esta usado!');
                setAlert('Error');setSeverity('error');
            }
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await fetch(`${global.config.appConfig.url.dev}Users`, {
            method: 'POST',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify({'FirstName': firstName, 'LastName': lastName, 'Email': email, 'Password': password}),
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json()
            }
        }).catch(e => console.log(e))
        setFirstName(''); setLastName(''); setEmail(''); setPassword(''); 
        setMessages('Se ha creado tu cuenta'); setAlert('Success');setSeverity('success');
        setTimeout(() => {
            setMessages('');
        }, 2000) 
    }

    return (
        <main style={{ width: '40%', margin: '0 auto', marginTop: '50px'}}>
            {(messages !== '') ?
                <Alert severity={severity}>
                    <AlertTitle>{alert}</AlertTitle>
                    {messages}
                </Alert>
                :
                <></>
            }
            <Grid container spacing={0}>
            <Grid item xs={1}></Grid>
                <Grid item xs={10}>
                    {/* <Paper> */}
                    <Typography component="h1" variant="h5">
                        Registro
                    </Typography>
                        <form onSubmit={handleSubmit}>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="nombre">Nombre</InputLabel>
                                <Input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    autoComplete="nombre"
                                    onChange={(event) => setFirstName(event.target.value)}
                                    value={firstName}
                                />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="apellido">Apellido</InputLabel>
                                <Input
                                    id="apellido"
                                    name="apellido"
                                    type="text"
                                    autoComplete="apellido"
                                    onChange={(event) => setLastName(event.target.value)}
                                    value={lastName}
                                />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    onChange={(event) => checkEmail(event.target.value)}
                                    value={email}
                                />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="password">Contraseña</InputLabel>
                                <Input
                                    name="password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={(event) => setPassword(event.target.value)}
                                    value={password}
                                />
                            </FormControl>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={btn}
                            > Guardar
                            </Button>
                        <Typography>Tienes cuenta? <Link style={{color:'#000'}} href="/" > Inicia sesión</Link></Typography>
                        </form>
                    {/* </Paper> */}
                </Grid>
                <Grid item xs={1}></Grid>
            </Grid>
        </main>
    );
}

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: theme.spacing(3),
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing(1),
    },
    divider: {
        margin: theme.spacing(2, 0),
    },
}));

export default Signin;
