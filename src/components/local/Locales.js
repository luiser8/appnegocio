import React, { useEffect, useState, useRef, Fragment } from 'react';
import Moment from 'moment';
import { useForm, Controller } from 'react-hook-form';
import '../../utils/Config';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { AddCircle, Delete, Edit, Check, Block, RestoreFromTrash } from '@material-ui/icons';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
    Form, FormControl, Input, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Row,
    IconButton,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Breadcrumbs,
    Link,
    Card,
    CardContent,
    Paper,
    Typography,
    ListItem,
    List,
    Chip, TextField, Snackbar, Collapse, Box, FormGroup,
} from '@material-ui/core';

const Locales = ({ user }) => {
    const { register, control, formState, handleSubmit, errors } = useForm({mode: "onChange"});
    var [rolUser] = useState(window.localStorage.getItem('RolId'));
    var [cadenaUser] = useState(window.localStorage.getItem('CadenaId'));
    var classes = useStyles();
    var [locales, setLocales] = useState([]);
    var [cadenas, setCadenas] = useState([]);
    var [rol, setRol] = useState();
    var [open, setOpen] = useState(false);
    var [localId, setLocalId] = useState('');
    var [cadenaId, setCadenaId] = useState('');
    var [nombre, setNombre] = useState('');
    var [descripcion, setDescripcion] = useState('');
    var [openDLocal, setOpenDLocal] = useState(false);
    var [openDelEstado, setOpenDelEstado] = useState(false);
    var [messages, setMessages] = useState('');
    var [severity, setSeverity] = useState('');
    var [alerta, setAlerta] = useState('');
    var [btnAdd, setBtnAdd] = useState(true);
    var [success, setSuccess] = useState(false);

    //Iniciaizamos los inputs para hacerles resets
    const initialInputs = () => {
        setCadenaId(''); setNombre(''); setDescripcion('');
    }

    const handleCancelD = (value) => {
        setOpenDelEstado(!value);setBtnAdd(!value);initialInputs();
    }

    const handleDisable = (local, msj) => {
        if (local) {
            setLocalId(local);setMessages(msj);setOpenDelEstado(true);
        }else {
            setOpenDelEstado(false);setLocalId('');//setMessages('');
        }
    }

    const editHandle = (local) => {
        setBtnAdd(false);setOpenDLocal(true);
        setLocalId(local.LocalId); setCadenaId(local.CadenaId); setNombre(local.Nombre); setDescripcion(local.Descripcion);
    }

    //Consultamos lista de Roles desde el api
    const getRoles = async () => {
        var result = await fetch(`${global.config.appConfig.url.dev}PPC_Rol`, {
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
            return promise(result)
        }
    }
//Obtener los datos dependiendo de donde lo llamo, para establecer el rol
    const promise = async (req) => {
        (await Promise.all([req])).map((items) => {
            if (items) {
                items.forEach((item) => {
                    if (item.Jerarquia === 2) {
                        setRol(item.RolId);
                    }
                })
            }
        })
    }
    //Consultamos lista de Cadenas desde el api
    const getCadenas = async () => {
        var result = await fetch(`${global.config.appConfig.url.dev}PPC_Cadena/${cadenaUser}`, {
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
            return setCadenas(result)
        }
    }
//Consultamos lista de Locales desde el api
    const getLocales = async () => {
        var result = await fetch(`${global.config.appConfig.url.dev}PPN_Local?cadena=${cadenaUser}`, {
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
//Agregar neuvos locales
    const addLocales = async (data) => {
        await fetch(`${global.config.appConfig.url.dev}PPN_Local`, {
            method: 'POST',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify(data),
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}PPN_Local`)
                .then(response => response.json())
                .then(res => {
                    return setLocales(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        initialInputs();setOpenDLocal(false);setSuccess(true);setMessages('Local creado satisfactoriamente!');
        setTimeout(() => {
            setMessages('');setSuccess(false);
        }, 3000)
    }
//Actualizar locales
    const updateLocales = async (data) => {
        await fetch(`${global.config.appConfig.url.dev}PPN_Local/${localId}`, {
            method: 'PUT',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify(
                {
                    'LocalId': localId,
                    'CadenaId': data.CadenaId,
                    'Nombre': data.Nombre,
                    'Descripcion': data.Descripcion
                }
            ),
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}PPN_Local`)
                .then(response => response.json())
                .then(res => {
                    return setLocales(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        initialInputs();setBtnAdd(true); setOpenDLocal(false);setSuccess(true); setMessages('Local actualizado satisfactoriamente!');
        setTimeout(() => {
            setMessages('');setSuccess(false);
        }, 3000)
    }
//Cambios de estados, activado y desactivado
    const toggleEstado = async (local) => {
        setOpenDelEstado(false);
        await fetch(`${global.config.appConfig.url.dev}PPN_Local/${local}`, {
            method: 'DELETE',
            headers: global.config.appConfig.headers.dev,
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}PPN_Local`)
                .then(response => response.json())
                .then(res => {
                    return setLocales(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        setSuccess(true);setMessages(`Cambio establecido!`);
        setTimeout(() => {
            setSuccess(false);
        }, 3000)
    }

    useEffect(() => {
        getLocales();
        getCadenas();
        getRoles();
    }, [])

//Funcionalidad para generar un detalle de tipo Accordion en las tablas
const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

function Row(props) {
    const { row } = props;
    const [open, setOpen] = useState(false);
    const classes = useRowStyles();

    return (
        <Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="left">{row.Nombre}</TableCell>
                <TableCell align="right">
                    <IconButton onClick={() => editHandle(
                        {
                            'LocalId': row.LocalId,
                            'CadenaId': row.CadenaId,
                            'Nombre': row.Nombre,
                            'Descripcion': row.Descripcion
                        }
                    )}
                    ><Edit fontSize="large" /></IconButton>
                {rol === rolUser ?
                    <>
                        {row.Estado === 1 ? (
                            <IconButton onClick={() => handleDisable(row.LocalId, 'desactivar')}><Delete fontSize="large" /></IconButton>
                        ) : (
                            <IconButton onClick={() => handleDisable(row.LocalId, 'activar')}><RestoreFromTrash fontSize="large" /></IconButton>
                        )}
                    </>
                    :
                    <>
                        <IconButton><Block fontSize="large" /></IconButton>
                    </>
                }
                </TableCell>
            </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                            Detalles - <small>Cadena: {row.Cadena}</small>
                        </Typography>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Descripción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableCell>{row.Descripcion}</TableCell>
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
        </Fragment >
    );
}

    return (
        <Card variant="outlined">
            <CardContent>
                <Grid container spacing={0}>
                    <Grid item xs={10} md={8} lg={8}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link color="inherit" href="#" >Locales</Link>
                            {false ? (
                                <Link color="inherit" href="#" >Categorías</Link>
                            ) : (
                                    <Link color="inherit" href="#" ></Link>
                                )}
                        </Breadcrumbs>
                    </Grid>
                    <Grid item xs={2} md={2} lg={2}>
                    {rol === rolUser ? (
                        <IconButton>
                            <AddCircle fontSize="large" onClick={() => setOpenDLocal(true)} />
                        </IconButton>
                    ) : (
                        <></>
                    )}  
                    </Grid>
                </Grid>
                <Grid container spacing={0}>
                    
                        <Grid item xs={12} md={8} lg={8}>
                            {/* Form new Local */}

                            {openDLocal ? (
                                <form onSubmit={btnAdd ? handleSubmit(addLocales) : handleSubmit(updateLocales)}>
                                    <FormControl margin="normal" fullWidth variant="filled">
                                        <InputLabel htmlFor="CadenaId">Selecciona Cadena</InputLabel>
                                        <Controller
                                            control={control}
                                            name="CadenaId"
                                            as={
                                                <Select
                                                    name="CadenaId"
                                                    margin="normal"
                                                    variant="outlined"
                                                    error={!!errors.CadenaId}
                                                    inputProps={{
                                                        name: "CadenaId",
                                                        ref: register({
                                                            required: true,
                                                        })
                                                    }}
                                                    open={open}
                                                    onClose={() => setOpen(false)}
                                                    onOpen={() => setOpen(true)}
                                                    
                                                >
                                                    {/* {Object.keys(cadenas).map((key, c) => ( */}
                                                        <MenuItem value={cadenaUser}>{cadenas.Nombre}</MenuItem>
                                                    {/* ))} */}
                                                </Select>
                                            }
                                            rules={{ required: true }}
                                            defaultValue={cadenaId}
                                        >
                                            
                                        </Controller>
                                        {(errors.CadenaId) ?
                                                <Alert severity="error">
                                                    <AlertTitle>Error</AlertTitle>
                                                    <strong>{errors.CadenaId && 'Debes selecionar una cadena'}</strong>
                                                </Alert>
                                                :
                                                <></>
                                            }
                                    </FormControl>

                                    <FormControl margin="normal" fullWidth variant="filled">
                                        <TextField
                                            id="outlined-email-input-required"
                                            label="Nombre local"
                                            type="text"
                                            name="Nombre"
                                            autoComplete="Nombre"
                                            margin="normal"
                                            variant="outlined"
                                            error={!!errors.Nombre}
                                            defaultValue={nombre}
                                            inputRef={register({
                                                required: true
                                            })}
                                        />
                                        {(errors.Nombre) ?
                                            <Alert severity="error">
                                                <AlertTitle>Error</AlertTitle>
                                                <strong>{errors.Nombre && 'Debes colocar nombre del local'}</strong>
                                            </Alert>
                                            :
                                            <></>
                                        }

                                    </FormControl>

                                    <FormControl margin="normal" fullWidth variant="filled">
                                        <TextField
                                            id="outlined-descripcion-input-required"
                                            label="Descripcion local"
                                            type="text"
                                            name="Descripcion"
                                            autoComplete="Descripcion"
                                            margin="normal"
                                            variant="outlined"
                                            error={!!errors.Descripcion}
                                            defaultValue={descripcion}
                                            inputRef={register({
                                                required: true
                                            })}
                                        />
                                        {(errors.Descripcion) ?
                                            <Alert severity="error">
                                                <AlertTitle>Error</AlertTitle>
                                                <strong>{errors.Descripcion && 'Debes colocar la descripcion del local'}</strong>
                                            </Alert>
                                            :
                                            <></>
                                        }
                                    </FormControl>

                                    <Button
                                        onClick={() => setOpenDLocal(false)}
                                        variant="contained"
                                    >
                                        Cancelar
                                    </Button>
                                    {btnAdd ? (
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="secondary"
                                            disabled={!formState.isValid}>
                                            Guardar
                                        </Button>
                                    ) : (
                                            <Button
                                                type="submit"
                                                //onClick={() => updateLocales(false)}
                                                variant="contained"
                                                color="secondary"
                                                disabled={!formState.isValid}>
                                                Actualizar
                                            </Button>
                                        )}

                                </form>
                            ) : (
                                <>
                                {(Object.keys(locales).length !== 0) ?
                                    <TableContainer component={Paper}>
                                        <Table size="small" aria-label="collapsible table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell />
                                                    <TableCell align="left">Descripción</TableCell>
                                                    <TableCell align="right">Opciones</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {locales.map((key, item) => (
                                                    <Row key={locales[item].LocalId} row={locales[item]} />
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    :
                                    <Grid
                                        container
                                        spacing={0}
                                        alignItems="center"
                                        justify="center"
                                        style={{ minHeight: "70vh" }}
                                    >
                                        <CircularProgress size={100} disableShrink color="secondary" />
                                    </Grid>
                                }
                                </>
                                )}

                        </Grid>
                        
                </Grid>
            </CardContent>
                    {/* Snackbar */}
                    {success ? (
                        <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
                            <Alert onClose={() => setSuccess(false)} severity="success">
                                {messages}
                            </Alert>
                        </Snackbar>
                    ) : (
                        <></>
                    )}
                    
            {/* Dialog cambiar estado */}
            <Dialog
                open={openDelEstado}
                onClose={() => handleCancelD(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{`Estas seguro que deseas ${messages} este local?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {/* Si desactivas este local los clientes no lo podran ver */}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        variant="contained"
                        color="secondary"
                        onClick={() => setOpenDelEstado(false)} >
                        Cancelar
                    </Button>
                    <Button 
                        variant="contained"
                        color="secondary"
                        onClick={() => toggleEstado(localId)}>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '36ch',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    }
}));

export default Locales;