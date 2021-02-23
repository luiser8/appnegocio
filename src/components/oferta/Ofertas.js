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
    Radio, RadioGroup, FormControlLabel, FormControl, Input, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Row,
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

const Ofertas = ({ user }) => {
    var classes = useStyles();
    const { register, control, formState, handleSubmit, errors } = useForm({ mode: "onChange" });
    var [rolUser] = useState(window.localStorage.getItem('RolId'));
    var [localUser] = useState(window.localStorage.getItem('UsuarioLocalId'));
    var [rol, setRol] = useState();
    var [openZona, setOpenZona] = useState(false);
    var [openCalendario, setOpenCalendario] = useState(false);
    var [openProducto, setOpenProducto] = useState(false);
    var [openDOferta, setOpenDOferta] = useState(false);
    var [openDelEstado, setOpenDelEstado] = useState(false);
    var [ofertas, setOfertas] = useState([]);
    var [calendarios, setCalendarios] = useState([]);
    var [zonas, setZonas] = useState([]);
    var [productos, setProductos] = useState([]);
    var [ofertaId, setOfertaId] = useState('');
    var [productoId, setProductoId] = useState('');
    var [zonaId, setZonaId] = useState('');
    var [calendarioId, setCalendarioId] = useState('');
    var [cantidadMinima, setCantidadMinima] = useState('');
    var [cantidadMaxima, setCantidadMaxima] = useState('');
    var [descripcion, setDescripcion] = useState('');
    var [messages, setMessages] = useState('');
    var [severity, setSeverity] = useState('');
    var [alerta, setAlerta] = useState('');
    var [btnAdd, setBtnAdd] = useState(true);
    var [success, setSuccess] = useState(false);

    //Iniciaizamos los inputs para hacerles resets
    const initialInputs = () => {
        setProductoId(''); setZonaId(''); setCalendarioId(''); setCantidadMinima(''); setCantidadMaxima(''); setDescripcion('');
    }

    const handleCancelD = (value) => {
        setOpenDelEstado(!value); setBtnAdd(!value); initialInputs();
    }

    const handleDisable = (oferta, msj) => {
        if (oferta) {
            setOfertaId(oferta); setMessages(msj); setOpenDelEstado(true);
        } else {
            setOpenDelEstado(false); setOfertaId('');
        }
    }

    const editHandle = (oferta) => {
        setBtnAdd(false); setOpenDOferta(true);
        setZonaId(oferta.ZonaId);
        setOfertaId(oferta.OfertaId);
        setProductoId(oferta.ProductoId);
        setCalendarioId(oferta.CalendarioId);
        setCantidadMinima(oferta.CantidadMinima);
        setCantidadMaxima(oferta.CantidadMaxima);
        setDescripcion(oferta.Descripcion);
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
    //Consultamos lista de Ofertas desde el api
    const getOfertas = async () => {
        var result = await fetch(`${global.config.appConfig.url.dev}PPN_Oferta?local=${localUser}`, {
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
            return setOfertas(result)
        }
    }
    //Consultamos lista de Zonas desde el api
    const getZonas = async () => {
        var result = await fetch(`${global.config.appConfig.url.dev}PPN_Zona?local=${localUser}`, {
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
            return setZonas(result)
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
    //Consultamos lista de Productos desde el api
    const getProductos = async () => {
        var result = await fetch(`${global.config.appConfig.url.dev}PPN_Producto?local=${localUser}`, {
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
            return setProductos(result)
        }
    }
//Agregar nuevas ofertas
    const addOfertas = async (data) => {
        await fetch(`${global.config.appConfig.url.dev}PPN_Oferta`, {
            method: 'POST',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify(
            {
                'ProductoId':data.ProductoId,
                'ZonaId':data.ZonaId,
                'CalendarioId':data.CalendarioId,
                'CantidadMinima':data.CantidadMinima,
                'CantidadMaxima':data.CantidadMaxima,
                'Descripcion':data.Descripcion,
                'UsuarioCreacion':user
            }),
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}PPN_Oferta`)
                .then(response => response.json())
                .then(res => {
                    return setOfertas(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        initialInputs();setOpenDOferta(false);setSuccess(true);setMessages('Oferta creado satisfactoriamente!');
        setTimeout(() => {
            setMessages('');setSuccess(false);
        }, 3000)
    }
//Actualizar ofertas
    const updateOfertas = async (data) => {
        await fetch(`${global.config.appConfig.url.dev}PPN_Oferta/${ofertaId}`, {
            method: 'PUT',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify(
                {
                    'OfertaId':ofertaId,
                    'ProductoId':data.ProductoId,
                    'ZonaId':data.ZonaId,
                    'CalendarioId':data.CalendarioId,
                    'CantidadMinima':data.CantidadMinima,
                    'CantidadMaxima':data.CantidadMaxima,
                    'Descripcion':data.Descripcion,
                    'UsuarioCreacion':user,
                    'UsuarioActualizacion':user
                }
            ),
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}PPN_Oferta`)
                .then(response => response.json())
                .then(res => {
                    return setOfertas(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        initialInputs();setBtnAdd(true); setOpenDOferta(false);setSuccess(true); setMessages('Oferta actualizado satisfactoriamente!');
        setTimeout(() => {
            setMessages('');setSuccess(false);
        }, 3000)
    }
//Cambios de estados de ofertas, activado y desactivado
    const toggleEstado = async (oferta) => {
        setOpenDelEstado(false);
        await fetch(`${global.config.appConfig.url.dev}PPN_Oferta/${oferta}`, {
            method: 'DELETE',
            headers: global.config.appConfig.headers.dev,
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}PPN_Oferta`)
                .then(response => response.json())
                .then(res => {
                    return setOfertas(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        setSuccess(true);setMessages(`Cambio establecido!`);
        setTimeout(() => {
            setSuccess(false);
        }, 3000)
    }
    useEffect(() => {
        getRoles();
        getOfertas();
        getZonas();
        getCalendarios();
        getProductos();
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
                            'OfertaId': row.OfertaId,
                            'ProductoId': row.ProductoId,
                            'ZonaId': row.ZonaId,
                            'CalendarioId': row.CalendarioId,
                            'CantidadMaxima': row.CantidadMaxima,
                            'CantidadMinima': row.CantidadMinima,
                            'Descripcion': row.Descripcion
                        }
                    )}
                    ><Edit fontSize="large" /></IconButton>
                {rol === rolUser ?
                    <>
                        {row.Estado === 1 ? (
                            <IconButton onClick={() => handleDisable(row.OfertaId, 'desactivar')}><Delete fontSize="large" /></IconButton>
                        ) : (
                            <IconButton onClick={() => handleDisable(row.OfertaId, 'activar')}><RestoreFromTrash fontSize="large" /></IconButton>
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
                            Detalles - <small>Producto: {row.Descripcion}</small>
                        </Typography>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Descripción</TableCell>
                                    <TableCell>Minimo</TableCell>
                                    <TableCell>Maximo</TableCell>
                                    <TableCell>Fecha de Creación</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableCell>{row.Descripcion}</TableCell>
                                <TableCell>{row.CantidadMinima}</TableCell>
                                <TableCell>{row.CantidadMaxima}</TableCell>
                                <TableCell>{Moment(row.FechaCreacion).format('YYYY-MM-DD hh:mm')}</TableCell>
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
                            <Link color="inherit" href="#" >Ofertas</Link>
                            {false ? (
                                <Link color="inherit" href="#" >Categorías</Link>
                            ) : (
                                    <Link color="inherit" href="#" ></Link>
                                )}
                        </Breadcrumbs>
                    </Grid>
                    <Grid item xs={2} md={2} lg={2}>
                    {rol === rolUser ? (
                        (!openDOferta ? (
                            <IconButton>
                                <AddCircle fontSize="large" onClick={() => setOpenDOferta(true)} />
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
                            {/* Form new Oferta */}

                            {openDOferta ? (
                                <form onSubmit={btnAdd ? handleSubmit(addOfertas) : handleSubmit(updateOfertas)}>
                                    <FormControl margin="normal" fullWidth variant="filled">
                                        <InputLabel htmlFor="ProductoId">Selecciona Producto</InputLabel>
                                        <Controller
                                            control={control}
                                            name="ProductoId"
                                            as={
                                                <Select
                                                    name="ProductoId"
                                                    margin="normal"
                                                    variant="outlined"
                                                    error={!!errors.ProductoId}
                                                    inputProps={{
                                                        name: "ProductoId",
                                                        ref: register({
                                                            required: true,
                                                        })
                                                    }}
                                                    open={openProducto}
                                                    onClose={() => setOpenProducto(false)}
                                                    onOpen={() => setOpenProducto(true)}
                                                    
                                                >
                                                    {Object.keys(productos).map((key, p) => (
                                                        <MenuItem value={productos[p].ProductoId}>{productos[p].Nombre}</MenuItem>
                                                    ))}
                                                </Select>
                                            }
                                            rules={{ required: true }}
                                            defaultValue={productoId}
                                        >
                                            
                                        </Controller>
                                        {(errors.ProductoId) ?
                                                <Alert severity="error">
                                                    <AlertTitle>Error</AlertTitle>
                                                    <strong>{errors.ProductoId && 'Debes selecionar un producto'}</strong>
                                                </Alert>
                                                :
                                                <></>
                                            }
                                    </FormControl>

                                    <FormControl margin="normal" fullWidth variant="filled">
                                        <InputLabel htmlFor="ZonaId">Selecciona Zona</InputLabel>
                                        <Controller
                                            control={control}
                                            name="ZonaId"
                                            as={
                                                <Select
                                                    name="ZonaId"
                                                    margin="normal"
                                                    variant="outlined"
                                                    error={!!errors.ZonaId}
                                                    inputProps={{
                                                        name: "ZonaId",
                                                        ref: register({
                                                            required: true,
                                                        })
                                                    }}
                                                    open={openZona}
                                                    onClose={() => setOpenZona(false)}
                                                    onOpen={() => setOpenZona(true)}
                                                    
                                                >
                                                    {Object.keys(zonas).map((key, z) => (
                                                        <MenuItem value={zonas[z].ZonaId}>{zonas[z].Nombre}</MenuItem>
                                                    ))}
                                                </Select>
                                            }
                                            rules={{ required: true }}
                                            defaultValue={zonaId}
                                        >
                                            
                                        </Controller>
                                        {(errors.ZonaId) ?
                                                <Alert severity="error">
                                                    <AlertTitle>Error</AlertTitle>
                                                    <strong>{errors.ZonaId && 'Debes selecionar una zona'}</strong>
                                                </Alert>
                                                :
                                                <></>
                                            }
                                    </FormControl>

                                    <FormControl margin="normal" fullWidth variant="filled">
                                        <InputLabel htmlFor="CalendarioId">Selecciona Calendario</InputLabel>
                                        <Controller
                                            control={control}
                                            name="CalendarioId"
                                            as={
                                                <Select
                                                    name="CalendarioId"
                                                    margin="normal"
                                                    variant="outlined"
                                                    error={!!errors.CalendarioId}
                                                    inputProps={{
                                                        name: "CalendarioId",
                                                        ref: register({
                                                            required: true,
                                                        })
                                                    }}
                                                    open={openCalendario}
                                                    onClose={() => setOpenCalendario(false)}
                                                    onOpen={() => setOpenCalendario(true)}
                                                    
                                                >
                                                    {Object.keys(calendarios).map((key, c) => (
                                                        <MenuItem value={calendarios[c].CalendarioId}>{calendarios[c].Descripcion}</MenuItem>
                                                    ))}
                                                </Select>
                                            }
                                            rules={{ required: true }}
                                            defaultValue={calendarioId}
                                        >
                                            
                                        </Controller>
                                        {(errors.CalendarioId) ?
                                                <Alert severity="error">
                                                    <AlertTitle>Error</AlertTitle>
                                                    <strong>{errors.CalendarioId && 'Debes selecionar un calendario'}</strong>
                                                </Alert>
                                                :
                                                <></>
                                            }
                                    </FormControl>

                                    <FormControl margin="normal" fullWidth variant="filled">
                                        <TextField
                                            id="outlined-email-input-required"
                                            label="Cantidad minima"
                                            type="number"
                                            name="CantidadMinima"
                                            autoComplete="CantidadMinima"
                                            margin="normal"
                                            variant="outlined"
                                            error={!!errors.CantidadMinima}
                                            defaultValue={cantidadMinima}
                                            inputRef={register({
                                                required: true
                                            })}
                                        />
                                        {(errors.CantidadMinima) ?
                                            <Alert severity="error">
                                                <AlertTitle>Error</AlertTitle>
                                                <strong>{errors.CantidadMinima && 'Debes colocar una cantidad minima'}</strong>
                                            </Alert>
                                            :
                                            <></>
                                        }

                                    </FormControl>
                                    <FormControl margin="normal" fullWidth variant="filled">
                                        <TextField
                                            id="outlined-email-input-required"
                                            label="Cantidad maxima"
                                            type="number"
                                            name="CantidadMaxima"
                                            autoComplete="CantidadMaxima"
                                            margin="normal"
                                            variant="outlined"
                                            error={!!errors.CantidadMaxima}
                                            defaultValue={cantidadMaxima}
                                            inputRef={register({
                                                required: true
                                            })}
                                        />
                                        {(errors.CantidadMaxima) ?
                                            <Alert severity="error">
                                                <AlertTitle>Error</AlertTitle>
                                                <strong>{errors.CantidadMaxima && 'Debes colocar una cantidad maxima'}</strong>
                                            </Alert>
                                            :
                                            <></>
                                        }

                                    </FormControl>
                                    

                                    <FormControl margin="normal" fullWidth variant="filled">
                                        <TextField
                                            id="outlined-descripcion-input-required"
                                            label="Descripcion de oferta"
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
                                                <strong>{errors.Descripcion && 'Debes colocar la descripcion de oferta'}</strong>
                                            </Alert>
                                            :
                                            <></>
                                        }
                                    </FormControl>

                                    <Button
                                        onClick={() => setOpenDOferta(false)}
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
                                                variant="contained"
                                                color="secondary"
                                                disabled={!formState.isValid}>
                                                Actualizar
                                            </Button>
                                        )}

                                </form>
                            ) : (
                                <>
                                {(Object.keys(ofertas).length !== 0) ?
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
                                                {ofertas.map((key, item) => (
                                                    <Row key={ofertas[item].OfertaId} row={ofertas[item]} />
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
                <DialogTitle id="alert-dialog-title">{`Estas seguro que deseas ${messages} esta oferta?`}</DialogTitle>
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
                        onClick={() => toggleEstado(ofertaId)}>
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
export default Ofertas;