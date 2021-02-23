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

const Calendarios = ({ user }) => {
    //Establecemos definicion de los estados
    //Utilizamos la el Hook useForm para validacion de formularios
    const { register, control, formState, handleSubmit, errors } = useForm({ mode: "onChange" });
    var [rolUser] = useState(window.localStorage.getItem('RolId'));
    var [cadenaUser] = useState(window.localStorage.getItem('CadenaId'));
    var [localUser] = useState(window.localStorage.getItem('UsuarioLocalId'));
    var classes = useStyles();
    var [locales, setLocales] = useState([]);
    var [calendarios, setCalendarios] = useState([]);
    var [rol, setRol] = useState();
    var [open, setOpen] = useState(false);
    var [calendarioId, setCalendarioId] = useState('');
    var [localId, setLocalId] = useState('');
    var [nombre, setNombre] = useState('');
    var [fechaHoraLimProdProv, setFechaHoraLimProdProv] = useState('');
    var [fechaHoraDespacho, setFechaHoraDespacho] = useState('');
    var [fechaHoraCierrePedido, setFechaHoraCierrePedido] = useState('');
    var [fechaHoraEntrega, setFechaHoraEntrega] = useState('');
    var [descripcion, setDescripcion] = useState('');
    var [openDCalendario, setOpenDCalendario] = useState(false);
    var [openDelEstado, setOpenDelEstado] = useState(false);
    var [messages, setMessages] = useState('');
    var [severity, setSeverity] = useState('');
    var [alerta, setAlerta] = useState('');
    var [btnAdd, setBtnAdd] = useState(true);
    var [success, setSuccess] = useState(false);

    //Iniciaizamos los inputs para hacerles resets
    const initialInputs = () => {
        setCalendarioId(''); setNombre(''); setFechaHoraLimProdProv(''); setFechaHoraDespacho(''); setFechaHoraCierrePedido(''); setFechaHoraEntrega(''); setDescripcion('');
    }

    //Escuchamos eventos para cancelar en las opciones para desabilitar y activar calendarios
    const handleCancelD = (value) => {
        setOpenDelEstado(!value); setBtnAdd(!value); initialInputs();
    }

    const handleDisable = (calendario, msj) => {
        if (calendario) {
            setCalendarioId(calendario); setMessages(msj); setOpenDelEstado(true);
        } else {
            setOpenDelEstado(false); setCalendarioId('');
        }
    }

    //Tomamos los elementos y se los asignamos a sus estados para llenar los inputs
    const editHandle = (calendario) => {
        setBtnAdd(false); setOpenDCalendario(true);
        setCalendarioId(calendario.CalendarioId);
        setLocalId(calendario.LocalId);
        setNombre(calendario.Nombre);
        setFechaHoraLimProdProv(calendario.FechaHoraLimProdProv);
        setFechaHoraDespacho(calendario.FechaHoraDespacho);
        setFechaHoraCierrePedido(calendario.FechaHoraCierrePedido);
        setFechaHoraEntrega(calendario.FechaHoraEntrega);
        setDescripcion(calendario.Descripcion);
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
    //Consultamos lista de Locales desde el api
    const getLocales = async () => {
        var result = await fetch(`${global.config.appConfig.url.dev}PPN_Local/${localUser}`, {
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
    //Consultamos lista de Calendarios desde el api
    const getCalendarios = async () => {
        var result = await fetch(`${global.config.appConfig.url.dev}PPN_Calendario?local=${localUser}`, {
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
            return setCalendarios(result)
        }
    }
    const getCalendariosAplicar = async () => {
        var inicio = Moment('2020-11-03T12:00:24').format('YYYY-MM-DD  HH:mm:ss');
        var fin = Moment('2020-11-08T12:00:24').format('YYYY-MM-DD  HH:mm:ss');
        var result = await fetch(`${global.config.appConfig.url.dev}PPN_Calendario?inicioSemana=${inicio}&finSemana=${fin}`, {
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
            return setCalendarios(result)
        }
    }
    const addClienteDireccionEntrega = async () => {
        await fetch(`${global.config.appConfig.url.dev}POC_Cliente`, {
            method: 'POST',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify({
                'Latitude':'10.146808297505235',
                'Longitude':'-64.67182730450747',
                'Direccion': 'ok',
                'Referencia': 'ok'
            }),
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json()
            }
            else { // si no se obtiene una respuesta
                response.json().then((json) => {
                    const { Message, StrackTraceString } = json;
                    //setMessages(Message);
                    //toast(Message, 3000)
                });
                return null
            }
        }).catch(e => {console.log(e);});
        initialInputs();//setOpenDZona(false);setSuccess(true);setMessages('Zona creado satisfactoriamente!');
        setTimeout(() => {
            //setMessages('');setSuccess(false);
        }, 3000)
    }
    //Agreamos nuevos calendarios, enviados desde el formulario
    const addCalendarios = async (data) => {
        await fetch(`${global.config.appConfig.url.dev}PPN_Calendario`, {
            method: 'POST',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify({
                // 'UsuarioCreacion': user,
                // 'LocalId': data.LocalId,
                // 'FechaHoraLimProdProv': data.FechaHoraLimProdProv,
                // 'FechaHoraDespacho': data.FechaHoraDespacho,
                // 'FechaHoraCierrePedido': data.FechaHoraCierrePedido,
                // 'FechaHoraEntrega': data.FechaHoraEntrega,
                // 'Descripcion': data.Descripcion
                'UsuarioCreacion': user,
                'LocalId': data.LocalId,
                'FechaHoraLimProdProv': data.FechaHoraLimProdProv,
                'FechaHoraDespacho': data.FechaHoraDespacho,
                'FechaHoraCierrePedido': data.FechaHoraCierrePedido,
                'FechaHoraEntrega': data.FechaHoraEntrega,
                'Descripcion': data.Descripcion,
                'Estado': 1,
                'Productos': [{ id:'11a7e12f-8404-42fd-abe2-1512be8f2785', name: 'Pan' }],
                'Zonas': [{ id:'a388a5b5-a394-4df3-a2ee-3d9327f210af', name: 'Saman'}, {id:'a388a5b5-a394-4df3-a2ee-3d9327f210af', name: 'delicia' }]
            }),
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}PPN_Calendario?local=${localUser}`)
                .then(response => response.json())
                .then(res => {
                    return setCalendarios(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        initialInputs(); setOpenDCalendario(false); setSuccess(true); setMessages('Calendario creado satisfactoriamente!');
        setTimeout(() => {
            setMessages(''); setSuccess(false);
        }, 3000)
    }
    //Actualizamos calendarios, enviados desde el formulario
    const updateCalendarios = async (data) => {
        await fetch(`${global.config.appConfig.url.dev}PPN_Calendario/${calendarioId}`, {
            method: 'PUT',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify(
                {
                    'CalendarioId': calendarioId,
                    'UsuarioCreacion': user,
                    'LocalId': data.LocalId,
                    'Nombre': data.Nombre,
                    'FechaHoraLimProdProv': data.FechaHoraLimProdProv,
                    'FechaHoraDespacho': data.FechaHoraDespacho,
                    'FechaHoraCierrePedido': data.FechaHoraCierrePedido,
                    'FechaHoraEntrega': data.FechaHoraEntrega,
                    'Descripcion': data.Descripcion
                }
            ),
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}PPN_Calendario?local=${localUser}`)
                .then(response => response.json())
                .then(res => {
                    return setCalendarios(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        initialInputs(); setBtnAdd(true); setOpenDCalendario(false); setSuccess(true); setMessages('Calendario actualizado satisfactoriamente!');
        setTimeout(() => {
            setMessages(''); setSuccess(false);
        }, 3000)
    }
    //Activamos / Desactivamos los calendarios
    const toggleEstado = async (calendario) => {
        setOpenDelEstado(false);
        await fetch(`${global.config.appConfig.url.dev}PPN_Calendario/${calendario}`, {
            method: 'DELETE',
            headers: global.config.appConfig.headers.dev,
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}PPN_Calendario`)
                .then(response => response.json())
                .then(res => {
                    return setCalendarios(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        setSuccess(true); setMessages(`Cambio establecido!`);
        setTimeout(() => {
            setSuccess(false);
        }, 3000)
    }
    //Inicializamos los metodos para que esten cargados
    useEffect(() => {
        getLocales();
        getCalendarios();
        getRoles();
        getCalendariosAplicar();
        addClienteDireccionEntrega();
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
                    <TableCell align="left">{row.Descripcion}</TableCell>
                    <TableCell align="right">
                        <IconButton onClick={() => editHandle(
                            {
                                'LocalId': row.LocalId,
                                'CalendarioId': row.CalendarioId,
                                'Nombre': row.Nombre,
                                'FechaHoraLimProdProv': row.FechaHoraLimProdProv,
                                'FechaHoraDespacho': row.FechaHoraDespacho,
                                'FechaHoraCierrePedido': row.FechaHoraCierrePedido,
                                'FechaHoraEntrega': row.FechaHoraEntrega,
                                'Descripcion': row.Descripcion
                            }
                        )}
                        ><Edit fontSize="large" /></IconButton>
                        {rol === rolUser ?
                            <>
                                {row.Estado === 1 ? (
                                    <IconButton onClick={() => handleDisable(row.CalendarioId, 'desactivar')}><Delete fontSize="large" /></IconButton>
                                ) : (
                                    <IconButton onClick={() => handleDisable(row.CalendarioId, 'activar')}><RestoreFromTrash fontSize="large" /></IconButton>
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
                                    Detalles - <small>Local: {row.Local}</small>
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Fecha / Hora - Prod / Prov</TableCell>
                                            <TableCell>Fecha / Hora - Despacho</TableCell>
                                            <TableCell>Fecha / Hora - Cierre Pedido</TableCell>
                                            <TableCell>Fecha / Hora - Entrega</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableCell>{Moment(row.FechaHoraLimProdProv).format('YYYY-MM-DD hh:mm:ss')}</TableCell>
                                        <TableCell>{Moment(row.FechaHoraDespacho).format('YYYY-MM-DD hh:mm:ss')}</TableCell>
                                        <TableCell>{Moment(row.FechaHoraCierrePedido).format('YYYY-MM-DD hh:mm:ss')}</TableCell>
                                        <TableCell>{Moment(row.FechaHoraEntrega).format('YYYY-MM-DD hh:mm:ss')}</TableCell>
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </Fragment>
        );
    }

    return (
        <Card variant="outlined">
            <CardContent>
                <Grid container spacing={0}>
                    <Grid item xs={10} md={8} lg={8}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link color="inherit" href="#" >Calendarios</Link>
                            {false ? (
                                <Link color="inherit" href="#" >Categorías</Link>
                            ) : (
                                    <Link color="inherit" href="#" ></Link>
                                )}
                        </Breadcrumbs>
                    </Grid>
                    <Grid item xs={2} md={2} lg={2}>
                    {rol === rolUser ? (
                        (!openDCalendario ? (
                            <IconButton>
                                <AddCircle fontSize="large" onClick={() => setOpenDCalendario(true)} />
                            </IconButton>
                        ) : (
                            <></>
                        ))
                    ) : (
                            <></>
                    )}
                    </Grid>
                </Grid>
                <Grid container spacing={0}>
                    
                        <Grid item xs={12} md={8} lg={8}>
                            {/* Form new Calendario */}

                            {openDCalendario ? (
                                <form onSubmit={btnAdd ? handleSubmit(addCalendarios) : handleSubmit(updateCalendarios)}>
                                    <FormGroup row={true}>
                                    <FormControl margin="normal" fullWidth variant="filled">
                                        <InputLabel htmlFor="LocalId">Selecciona Local</InputLabel>
                                        <Controller
                                            control={control}
                                            name="LocalId"
                                            as={
                                                <Select
                                                    name="LocalId"
                                                    margin="normal"
                                                    variant="outlined"
                                                    error={!!errors.CadenaId}
                                                    inputProps={{
                                                        name: "LocalId",
                                                        ref: register({
                                                            required: true,
                                                        })
                                                    }}
                                                    open={open}
                                                    onClose={() => setOpen(false)}
                                                    onOpen={() => setOpen(true)}

                                                >
                                                    {/* {Object.keys(locales).map((key, l) => ( */}
                                                        <MenuItem value={locales.LocalId}>{locales.Nombre}</MenuItem>
                                                    {/* ))} */}
                                                </Select>
                                            }
                                            rules={{ required: true }}
                                            defaultValue={localId}
                                        >

                                        </Controller>
                                        {(errors.LocalId) ?
                                            <Alert severity="error">
                                                <AlertTitle>Error</AlertTitle>
                                                <strong>{errors.LocalId && 'Debes selecionar un calendario'}</strong>
                                            </Alert>
                                            :
                                            <></>
                                        }
                                    </FormControl>

                                    <FormControl margin="normal" fullWidth variant="filled">
                                    <InputLabel htmlFor="LocalId">Fecha/Hora/Limite/Prod-Prov</InputLabel>
                                        <TextField
                                            id="outlined-email-input-required"
                                            type="datetime-local"
                                            name="FechaHoraLimProdProv"
                                            autoComplete="FechaHoraLimProdProv"
                                            margin="normal"
                                            variant="outlined"
                                            error={!!errors.FechaHoraLimProdProv}
                                            defaultValue={fechaHoraLimProdProv}
                                            inputRef={register({
                                                required: true
                                            })}
                                        />
                                        {(errors.FechaHoraLimProdProv) ?
                                            <Alert severity="error">
                                                <AlertTitle>Error</AlertTitle>
                                                <strong>{errors.FechaHoraLimProdProv && 'Debes colocar Fecha/Hora/Limite/Prod-Prov del calendario'}</strong>
                                            </Alert>
                                            :
                                            <></>
                                        }

                                    </FormControl>

                                    <FormControl margin="normal" fullWidth variant="filled">
                                    <InputLabel htmlFor="LocalId">Fecha/Hora-Despacho</InputLabel>
                                        <TextField
                                            id="outlined-email-input-required"
                                            type="datetime-local"
                                            name="FechaHoraDespacho"
                                            autoComplete="FechaHoraDespacho"
                                            margin="normal"
                                            variant="outlined"
                                            error={!!errors.FechaHoraDespacho}
                                            defaultValue={fechaHoraDespacho}
                                            inputRef={register({
                                                required: true
                                            })}
                                        />
                                        {(errors.FechaHoraDespacho) ?
                                            <Alert severity="error">
                                                <AlertTitle>Error</AlertTitle>
                                                <strong>{errors.FechaHoraDespacho && 'Debes colocar Fecha/Hora-Despacho del calendario'}</strong>
                                            </Alert>
                                            :
                                            <></>
                                        }

                                    </FormControl>

                                    <FormControl margin="normal" fullWidth variant="filled">
                                    <InputLabel htmlFor="LocalId">Fecha/Hora-CierrePedido</InputLabel>
                                        <TextField
                                            id="outlined-email-input-required"
                                            type="datetime-local"
                                            name="FechaHoraCierrePedido"
                                            autoComplete="FechaHoraCierrePedido"
                                            margin="normal"
                                            variant="outlined"
                                            error={!!errors.FechaHoraCierrePedido}
                                            defaultValue={fechaHoraCierrePedido}
                                            inputRef={register({
                                                required: true
                                            })}
                                        />
                                        {(errors.FechaHoraCierrePedido) ?
                                            <Alert severity="error">
                                                <AlertTitle>Error</AlertTitle>
                                                <strong>{errors.FechaHoraCierrePedido && 'Debes colocar Fecha/Hora-CierrePedido del calendario'}</strong>
                                            </Alert>
                                            :
                                            <></>
                                        }

                                    </FormControl>

                                    <FormControl margin="normal" fullWidth variant="filled">
                                    <InputLabel htmlFor="LocalId">Fecha/Hora-Entrega</InputLabel>
                                        <TextField
                                            id="outlined-email-input-required"
                                            type="datetime-local"
                                            name="FechaHoraEntrega"
                                            autoComplete="FechaHoraEntrega"
                                            margin="normal"
                                            variant="outlined"
                                            error={!!errors.FechaHoraEntrega}
                                            defaultValue={fechaHoraEntrega}
                                            inputRef={register({
                                                required: true
                                            })}
                                        />
                                        {(errors.FechaHoraEntrega) ?
                                            <Alert severity="error">
                                                <AlertTitle>Error</AlertTitle>
                                                <strong>{errors.FechaHoraEntrega && 'Debes colocar Fecha/Hora-Entrega del calendario'}</strong>
                                            </Alert>
                                            :
                                            <></>
                                        }

                                    </FormControl>
                                    <FormControl margin="normal" fullWidth variant="filled">
                                        <TextField
                                            id="outlined-descripcion-input-required"
                                            label="Descripcion calendario"
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
                                                <strong>{errors.Descripcion && 'Debes colocar la descripcion de la calendario'}</strong>
                                            </Alert>
                                            :
                                            <></>
                                        }
                                    </FormControl>

                                    <Button
                                        onClick={() => setOpenDCalendario(false)}
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
                                </FormGroup>
                                </form>
                                
                            ) : (
                                <>
                                {(Object.keys(calendarios).length !== 0) ?
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
                                                {calendarios.map((key, item) => (
                                                    <Row key={calendarios[item].CalendarioId} row={calendarios[item]} />
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
                <DialogTitle id="alert-dialog-title">{`Estas seguro que deseas ${messages} esta calendario?`}</DialogTitle>
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
                        onClick={() => toggleEstado(calendarioId)}>
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

export default Calendarios;