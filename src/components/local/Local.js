import React, { useEffect, useState, Fragment } from 'react';
import {
    Button,
    FormControl,
    InputLabel,
    Select,
    Typography,
    Grid,
    Divider,
    MenuItem,
    makeStyles,
} from '@material-ui/core';

const Local = ({ data }) => {
    //Recibimos data desde otros componentes
    //Establecemos definicion de los estados
    var [current_path] = useState(window.location.pathname);
    var [before_path] = useState(document.referrer.split(current_path)[0]);
    var [open, setOpen] = useState(false);
    var [messages, setMessages] = useState('');
    var [severity, setSeverity] = useState('');
    var [alerta, setAlerta] = useState('');
    var [islogo, setIslogo] = useState(true);
    var [locales, setLocales] = useState([]);
    var [local, setLocal] = useState();
    var [seleccionLocal, setSeleccionLocal] = useState(false);
    var [localSeleccionado, setLocalSeleccionado] = useState(false);

    //Consultamos lista de Locales desde el api
    const getLocales = async () => {
        var result = await fetch(`${global.config.appConfig.url.dev}PPN_Local?cadena=${data.cadena}`, {
            method: 'GET',
            headers: global.config.appConfig.headers.dev,
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json()
            }else { // si no se obtiene una respuesta
                response.json().then((json) => { 
                    const { Message, StrackTraceString } = json; 
                    setAlerta('Error'); setSeverity('error'); setMessages(Message);
                });
                return null
            }
        }).catch(e => console.log(e))
        if (result == null) {
            return "Error get";
        } else {
            return setLocales(result)
        }
    }
    //Guardamos el local seleccionado, lo colocamos en las variables de sesion
    const establecerLocal = () => {
        setIslogo(false);
        setSeleccionLocal(false);
        setLocalSeleccionado(true);
        setMessages('');
        window.localStorage.setItem('UsuarioLocalId', local.LocalId);
        window.localStorage.setItem('Local', local.Nombre);
        window.location.assign(before_path);
    }

    useEffect(() => {
        getLocales();
    }, [])

    return (
        <>
            <Grid container justify="center" spacing={0}>
                <Grid item xs={8}>
                    <div style={{ marginTop: 110 }}>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="cadenaId">Selección Local</InputLabel>
                            <Select
                                required
                                labelId="localId"
                                id="localId"
                                open={open}
                                onClose={() => setOpen(false)}
                                onOpen={() => setOpen(true)}
                                value={local}
                                onChange={(event) => setLocal(event.target.value)}
                            >
                                {Object.keys(locales).map((key, c) => (
                                    (locales[c].LocalId === data.local) ?
                                        <MenuItem selected value={locales[c]}>{locales[c].Nombre} - {locales[c].Cadena} *</MenuItem>
                                        :
                                        <MenuItem value={locales[c]}>{locales[c].Nombre} - {locales[c].Cadena}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            onClick={() => establecerLocal()}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="secondary"
                            className={styles.submit}>
                            Continuar
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </>
    );
}
const styles = makeStyles((theme) => ({
    submit: {
        marginTop: theme.spacing() * 3,
    }
}));

export default Local;