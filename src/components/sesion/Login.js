import {
    Button,
    FormControl,
    Input,
    InputLabel,
    Typography,
    Link,
    Grid,
    Divider,
    MenuItem,
    makeStyles,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import React, { useState, useEffect } from 'react';
import Local from '../local/Local';
import '../../utils/Config';
import Splascreen from '../../layout/Splascreen';

const Login = () => {
    var [logo] = useState(`${global.config.appConfig.images.local}/PandemikLogo_S.png`);
    var [islogo, setIslogo] = useState(true);
    var [current_path] = useState(window.location.pathname);
    var [before_path] = useState(document.referrer.split(current_path)[0]);
    var [logeado, setLogeado] = useState(false);
    var [local, setLocal] = useState();
    var [cadenaId, setCadenaId] = useState();
    var [messages, setMessages] = useState('');
    var [severity, setSeverity] = useState('');
    var [alerta, setAlerta] = useState('');
    var [olvide, setOlvide] = useState(false);
    var [desbloqueo, setDesbloqueo] = useState(false);
    var [btnCambiar, setBtnCambiar] = useState(false);
    var [btnVolver, setBtnVolver] = useState(true);
    var [seleccionLocal, setSeleccionLocal] = useState(false);
    var [localSeleccionado, setLocalSeleccionado] = useState(false);
    const [identificador, setIdentificador] = useState('');
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [usuarioId, setUsuarioId] = useState('');
    const [personaId, setPersonaId] = useState('');
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');

    //Funcion para enviar contraseña y contraseña al servidor comprobar datos para iniciar sesion
    const handleLogin = async (event) => {
        event.preventDefault();
        await fetch(`${global.config.appConfig.url.dev}PPN_Usuario/Login`, {
            method: 'POST',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify({ 'Usuario': usuario, 'Contrasena': password }),
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return setLogin(response.json())
            }
            else { // si no se obtiene una respuesta
                response.json().then((json) => { 
                    const { Message, StrackTraceString } = json; 
                    setAlerta('Error'); setSeverity('error'); setMessages(Message);
                });
                return null
            }
        }).catch(e => {
            alert("Error en la llamada: " + e);
            console.log(e);
        })
    }
    //Establecer envio de correo mediante el envio de su Identificador
    const handleRecuperar = async () => {
        await fetch(`${global.config.appConfig.url.dev}PPN_Usuario/Recuperar`, {
            method: 'POST',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify({ 'Identificador': identificador }),
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return setRecuperacion(response.json())
            }
            else { // si no se obtiene una respuesta
                response.json().then((json) => { 
                    const { Message, StrackTraceString } = json; 
                    setAlerta('Error'); setSeverity('error'); setMessages(Message);
                });
                return null
            }
        }).catch(e => console.log(e))
    }
    //Recibe el request para obtener los datos a colocar en la session local
    const setLogin = async (req) => {
        (await Promise.all([req])).map((items) => {
            if (items) {
                if (items.Bloqueado !== 1) {
                    window.localStorage.setItem('UsuarioId', items.UsuarioId);
                    window.localStorage.setItem('Nombres', items.Nombres);
                    window.localStorage.setItem('Apellidos', items.Apellidos);
                    window.localStorage.setItem('RolId', items.RolId);
                    window.localStorage.setItem('Rol', items.Rol);
                    window.localStorage.setItem('UsuarioLocalId', items.LocalId);
                    window.localStorage.setItem('Local', items.Local);
                    window.localStorage.setItem('CadenaId', items.CadenaId);
                    setLogeado(true);
                    setLocal(items.LocalId);
                    setCadenaId(items.CadenaId);
                    setSeleccionLocal(true);
                    if (localSeleccionado) {
                        window.location.assign(before_path)
                    }
                } else {
                    setDesbloqueo(true);
                    setAlerta('Advertencia'); setSeverity('warning'); setMessages('Usuario bloqueado! Por favor ingresa nueva contraseña');
                }
            } else {
                setAlerta('Error'); setSeverity('error'); setMessages('Usuario no encontrado');
            }
        })
    }
    //Establece estado en recuperacion para indicarle al usuario que debe proporcionar su nueva constraseña
    const setRecuperacion = async (req) => {
        (await Promise.all([req])).map((items) => {
            if (items) {
                setUsuarioId(items.UsuarioId); setPersonaId(items.PersonaId);
                setAlerta('Exitoso'); setSeverity('success'); setMessages('Contraseña temporal ha sido enviada a tu correo, sera redirigido para iniciar sesión');
                setTimeout(() => {
                    setMessages('');
                    setOlvide(false);
                }, 4000);
            } else {
                setAlerta('Error'); setSeverity('error'); setMessages('Identificación de Usuario no encontrado');
                setTimeout(() => {
                    setMessages('');
                }, 3000)
            }
        })
    }
    //Establecer nueva contraeña
    const handleNuevaContrasena = async () => {
        await fetch(`${global.config.appConfig.url.dev}PPN_Usuario/CambiarContrasena`, {
            method: 'POST',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify({ 'PersonaId': personaId, 'UsuarioId': usuarioId, 'NuevaContrasena': nuevaContrasena }),
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return setResNuevaContrasena(response.json())
            }else { // si no se obtiene una respuesta
                response.json().then((json) => { 
                    const { Message, StrackTraceString } = json; 
                    setAlerta('Error'); setSeverity('error'); setMessages(Message);
                });
                return null
            }
        }).catch(e => console.log(e))
    }
    //Establece estado para indicar que su contraseña fue cambiada
    const setResNuevaContrasena = async (req) => {
        (await Promise.all([req])).map((items) => {
            if (items) {
                setPassword(''); setNuevaContrasena(''); setBtnCambiar(true); setBtnVolver(false); setAlerta('Exitoso'); setSeverity('success'); setMessages('Contraseña ha sido actualizada, dirigete a iniciar sesión');
                setTimeout(() => {
                    setDesbloqueo(false); setMessages('');
                }, 4000)
            } else {
                setBtnCambiar(false); setBtnVolver(true); setAlerta('Error'); setSeverity('error'); setMessages('Contraseña no ha se ha podido actualizar');
            }
        })
    }

    return (
        <>
        {islogo ? (
            <div style={{width:"fit-content", margin: "0 auto", marginTop: 12 }}><img src={logo}/></div>   
        ) : (
            <></>
        )}
            {!seleccionLocal ? (
                <main style={{ width: '40%', margin: '0 auto', marginTop: '80px' }}>
                    
                    {(messages === '') ?
                        <></>
                        :
                        <>
                            <Alert severity={severity}>
                                <AlertTitle>{alerta}</AlertTitle>
                                <strong>{messages}</strong>
                            </Alert>
                        </>
                    }

                    <Grid container justify="center" spacing={0}>
                   
                        <Grid item xs={12}>
                            
                            {desbloqueo ? (
                                <>
                                    <Typography component="h1" variant="h5">Nueva Contraseña</Typography>
                                    <FormControl margin="normal" required fullWidth>
                                        <InputLabel htmlFor="nuevaContrasena">Nueva Contraseña</InputLabel>
                                        <Input
                                            id="nuevaContrasena"
                                            name="nuevaContrasena"
                                            type="password"
                                            onChange={(event) => setNuevaContrasena(event.target.value)}
                                            value={nuevaContrasena}
                                        />
                                    </FormControl>
                                    <Button
                                        onClick={() => handleNuevaContrasena()}
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        disabled={btnCambiar}
                                        className={styles.submit}>
                                        Cambiar
                            </Button>
                                    <Divider />
                                    <Button
                                        onClick={() => setOlvide(false)}
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        disabled={btnVolver}
                                        className={styles.submit}>
                                        Volver a iniciar sesión
                             </Button>
                                </>
                            ) : (
                                    <>
                                        {!olvide ? (
                                            <>
                                                {!logeado ? (
                                                    <>
                                                        <Typography component="h1" align="center" variant="h5">Ingresar</Typography>
                                                        <form onSubmit={handleLogin}>
                                                            <FormControl margin="normal" required fullWidth>
                                                                <InputLabel htmlFor="usuario">Nombre de Usuario</InputLabel>
                                                                <Input
                                                                    id="usuario"
                                                                    name="usuario"
                                                                    type="text"
                                                                    onChange={(event) => setUsuario(event.target.value)}
                                                                    value={usuario}
                                                                />
                                                            </FormControl>
                                                            <FormControl margin="normal" required fullWidth>
                                                                <InputLabel htmlFor="password">Contraseña</InputLabel>
                                                                <Input
                                                                    name="password"
                                                                    type="password"
                                                                    id="password"
                                                                    onChange={(event) => setPassword(event.target.value)}
                                                                    value={password}
                                                                />
                                                            </FormControl>
                                                            <Button
                                                                type="submit"
                                                                fullWidth
                                                                variant="contained"
                                                                color="secondary"
                                                                className={styles.submit}>
                                                                Ingresar
                                                        </Button>
                                                            <Divider />
                                                            <Typography align="center"><Link style={{ color: '#000' }} href="#" onClick={() => setOlvide(true)}>Olvidé mi contraseña</Link></Typography>
                                                        </form>
                                                    </>
                                                ) : (
                                                    <></>
                                                        // <Splascreen height="0vh"/>
                                                    )}

                                            </>
                                        ) : (
                                                <>
                                                    <Typography component="h1" variant="h5">Recuperación</Typography>
                                                    <FormControl margin="normal" required fullWidth>
                                                        <InputLabel htmlFor="identificacion">Indentificación</InputLabel>
                                                        <Input
                                                            id="identificacion"
                                                            name="identificacion"
                                                            type="text"
                                                            onChange={(event) => setIdentificador(event.target.value)}
                                                            value={identificador}
                                                        />
                                                    </FormControl>
                                                    <Button
                                                        onClick={() => handleRecuperar()}
                                                        type="submit"
                                                        fullWidth
                                                        variant="contained"
                                                        color="secondary"
                                                        className={styles.submit}>
                                                        Recuperar
                                            </Button>
                                                    <Divider />
                                                    <Button
                                                        onClick={() => setOlvide(false)}
                                                        type="submit"
                                                        fullWidth
                                                        variant="contained"
                                                        color="secondary"
                                                        className={styles.submit}>
                                                        Volver
                                            </Button>
                                                </>
                                            )}
                                    </>
                                )}
                        </Grid>
                    </Grid>
                    {/* </Paper> */}
                </main>
            ) : (
                    <Local data={{'local': local, 'cadena': cadenaId}}/>
                )}

        </>
    );
}

const styles = makeStyles((theme) => ({
    main: {
        width: 'auto',
        marginTop: '80px',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing() * 3,
        marginRight: theme.spacing() * 3,
        [theme.breakpoints.up(400 + theme.spacing() * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing() * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing() * 2}px ${theme.spacing() * 3}px ${theme.spacing() * 3}px`,
    },
    avatar: {
        margin: theme.spacing(),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(),
    },
    submit: {
        marginTop: theme.spacing() * 3,
    }
}));

export default Login;