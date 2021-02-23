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

const Precios = ({ user }) => {
    const { register, control, formState, handleSubmit, errors } = useForm({mode: "onChange"});
    var [rolUser] = useState(window.localStorage.getItem('RolId'));
    var [localIdUser] = useState(window.localStorage.getItem('UsuarioLocalId'));
    var classes = useStyles();
    var [listaPrecios, setListaPrecios] = useState([]);
    var [productos, setProductos] = useState([]);
    var [precios, setPrecios] = useState([]);
    var [rol, setRol] = useState();
    var [openDPrecios, setOpenDPrecios] = useState(false);
    var [openListaPrecios, setOpenListaPrecios] = useState(false);
    var [openProducto, setOpenProducto] = useState(false);
    var [openDProducto, setOpenDProducto] = useState(false);
    var [openDListaPrecios, setOpenDListaPrecios] = useState(false);
    var [precioId, setPrecioId] = useState('');
    var [productoId, setProductoId] = useState('');
    var [listaPrecioId, setListaPrecioId] = useState('');
    var [monto, setMonto] = useState('');
    var [iva, setIva] = useState('');
    var [ice, setIce] = useState('');
    var [descripcion, setDescripcion] = useState('');
    var [openDelEstado, setOpenDelEstado] = useState(false);
    var [messages, setMessages] = useState('');
    var [severity, setSeverity] = useState('');
    var [alerta, setAlerta] = useState('');
    var [btnAdd, setBtnAdd] = useState(true);
    var [success, setSuccess] = useState(false);

//Iniciaizamos los inputs para hacerles resets
const initialInputs = () => {
    setPrecioId(''); setListaPrecioId(''); setProductoId(''); setMonto(''); setIva(''); setIce(''); setDescripcion('');
}

const handleCancelD = (value) => {
    setOpenDelEstado(!value);setBtnAdd(!value);initialInputs();
}

const handleDisable = (precio, msj) => {
    if (precio) {
        setPrecioId(precio);setMessages(msj);setOpenDelEstado(true);
    }else {
        setOpenDelEstado(false);setPrecioId('');
    }
}

const editHandle = (precio) => {
    setBtnAdd(false);setOpenDPrecios(true);
    setPrecioId(precio.PrecioId); 
    setListaPrecioId(precio.ListaPrecioId); 
    setProductoId(precio.ProductoId); 
    setMonto(precio.Monto); 
    setIva(precio.Iva); 
    setIce(precio.Ice); 
    setDescripcion(precio.Descripcion);
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
//Consultamos lista de Productos desde el api
const getProductos = async () => {
    var result = await fetch(`${global.config.appConfig.url.dev}PPN_Producto?local=${localIdUser}`, {
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
//Consultamos lista de ListaPrecios desde el api
const getListaPrecios = async () => {
    var result = await fetch(`${global.config.appConfig.url.dev}PPC_ListaPrecio`, {
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
        return setListaPrecios(result)
    }
}
//Consultamos lista de Precios desde el api
const getPrecios = async () => {
    var result = await fetch(`${global.config.appConfig.url.dev}PPN_Precio`, {
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
        return setPrecios(result)
    }
}
//Agregar nuevos precios
    const addPrecios = async (data) => {
        await fetch(`${global.config.appConfig.url.dev}PPN_Precio`, {
            method: 'POST',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify({
                'ProductoId':data.ProductoId,
                'ListaPrecioId':data.ListaPrecioId,
                'Monto':data.Monto,
                'Iva':data.Iva,
                'Ice':data.Ice,
                'Descripcion':data.Descripcion,
                'UsuarioCreacion':user
            }),
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}PPN_Precio`)
                .then(response => response.json())
                .then(res => {
                    return setPrecios(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        initialInputs();setOpenDPrecios(false);setSuccess(true);setMessages('Precio creado satisfactoriamente!');
        setTimeout(() => {
            setMessages('');setSuccess(false);
        }, 3000)
    }
//Actualizar precios
    const updatePrecios = async (data) => {
        await fetch(`${global.config.appConfig.url.dev}PPN_Precio/${precioId}`, {
            method: 'PUT',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify(
                {
                    'PrecioId':precioId,
                    'ProductoId':data.ProductoId,
                    'ListaPrecioId':data.ListaPrecioId,
                    'Monto':data.Monto,
                    'Iva':data.Iva,
                    'Ice':data.Ice,
                    'Descripcion':data.Descripcion,
                    'UsuarioCreacion':user,
                    'UsuarioActualizacion':user
                }
            ),
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}PPN_Precio`)
                .then(response => response.json())
                .then(res => {
                    return setPrecios(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        initialInputs();setBtnAdd(true); setOpenDPrecios(false);setSuccess(true); setMessages('Precio actualizado satisfactoriamente!');
        setTimeout(() => {
            setMessages('');setSuccess(false);
        }, 3000)
    }
//Cambios de estados, activado y desabilitado
    const toggleEstado = async (precio) => {
        setOpenDelEstado(false);
        await fetch(`${global.config.appConfig.url.dev}PPN_Precio/${precio}`, {
            method: 'DELETE',
            headers: global.config.appConfig.headers.dev,
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}PPN_Precio`)
                .then(response => response.json())
                .then(res => {
                    return setPrecios(res)
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
        getListaPrecios();
        getProductos();
        getPrecios();
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
                            'PrecioId':row.PrecioId,
                            'ProductoId':row.ProductoId,
                            'ListaPrecioId':row.ListaPrecioId,
                            'Monto':row.Monto,
                            'Iva':row.Iva,
                            'Ice':row.Ice,
                            'Descripcion':row.Descripcion
                        }
                    )}
                    ><Edit fontSize="large" /></IconButton>
                {rol === rolUser ?
                    <>
                        {row.Estado === 1 ? (
                            <IconButton onClick={() => handleDisable(row.PrecioId, 'desactivar')}><Delete fontSize="large" /></IconButton>
                        ) : (
                            <IconButton onClick={() => handleDisable(row.PrecioId, 'activar')}><RestoreFromTrash fontSize="large" /></IconButton>
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
                                    <TableCell>Monto</TableCell>
                                    <TableCell>Iva</TableCell>
                                    <TableCell>Ice</TableCell>
                                    <TableCell>Fecha de Creación</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableCell>${row.Monto}</TableCell>
                                <TableCell>{row.Iva}%</TableCell>
                                <TableCell>{row.Ice}%</TableCell>
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
                            <Link color="inherit" href="#" >Precios</Link>
                            <Link color="inherit" href="#" ></Link>
                        </Breadcrumbs>
                    </Grid>
                    <Grid item xs={2} md={2} lg={2}>
                    {rol === rolUser ? (
                        (!openDPrecios ? (
                            <IconButton>
                                <AddCircle fontSize="large" onClick={() => setOpenDPrecios(true)} />
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
                            {/* Form new Categoria */}

                            {openDPrecios ? (
                                <form onSubmit={btnAdd ? handleSubmit(addPrecios) : handleSubmit(updatePrecios)}>
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
                                        <InputLabel htmlFor="ListaPrecioId">Selecciona Lista de Precio</InputLabel>
                                        <Controller
                                            control={control}
                                            name="ListaPrecioId"
                                            as={
                                                <Select
                                                    name="ListaPrecioId"
                                                    margin="normal"
                                                    variant="outlined"
                                                    error={!!errors.ListaPrecioId}
                                                    inputProps={{
                                                        name: "ListaPrecioId",
                                                        ref: register({
                                                            required: true,
                                                        })
                                                    }}
                                                    open={openListaPrecios}
                                                    onClose={() => setOpenListaPrecios(false)}
                                                    onOpen={() => setOpenListaPrecios(true)}
                                                    
                                                >
                                                    {Object.keys(listaPrecios).map((key, lp) => (
                                                        <MenuItem value={listaPrecios[lp].ListaPrecioId}>{listaPrecios[lp].Nombre}</MenuItem>
                                                    ))}
                                                </Select>
                                            }
                                            rules={{ required: true }}
                                            defaultValue={listaPrecioId}
                                        >
                                            
                                        </Controller>
                                        {(errors.ListaPrecioId) ?
                                                <Alert severity="error">
                                                    <AlertTitle>Error</AlertTitle>
                                                    <strong>{errors.ListaPrecioId && 'Debes selecionar una lista de precio'}</strong>
                                                </Alert>
                                                :
                                                <></>
                                            }
                                    </FormControl>
                                    
                                    <FormControl margin="normal" fullWidth variant="filled">
                                        <TextField
                                            id="outlined-email-input-required"
                                            label="Monto de producto"
                                            type="text"
                                            name="Monto"
                                            autoComplete="Monto"
                                            margin="normal"
                                            variant="outlined"
                                            error={!!errors.Monto}
                                            defaultValue={monto}
                                            inputRef={register({
                                                required: true
                                            })}
                                        />
                                        {(errors.Monto) ?
                                            <Alert severity="error">
                                                <AlertTitle>Error</AlertTitle>
                                                <strong>{errors.Monto && 'Debes colocar monto'}</strong>
                                            </Alert>
                                            :
                                            <></>
                                        }

                                    </FormControl>
                                    <FormControl margin="normal" fullWidth variant="filled">
                                        <TextField
                                            id="outlined-iva-input-required"
                                            label="Iva del precio"
                                            type="text"
                                            name="Iva"
                                            autoComplete="Iva"
                                            margin="normal"
                                            variant="outlined"
                                            error={!!errors.Iva}
                                            defaultValue={iva}
                                            inputRef={register({
                                                required: true
                                            })}
                                        />
                                        {(errors.Iva) ?
                                            <Alert severity="error">
                                                <AlertTitle>Error</AlertTitle>
                                                <strong>{errors.Iva && 'Debes colocar el iva del precio'}</strong>
                                            </Alert>
                                            :
                                            <></>
                                        }
                                    </FormControl>
                                    <FormControl margin="normal" fullWidth variant="filled">
                                        <TextField
                                            id="outlined-ice-input-required"
                                            label="Ice del precio"
                                            type="text"
                                            name="Ice"
                                            autoComplete="Ice"
                                            margin="normal"
                                            variant="outlined"
                                            error={!!errors.Ice}
                                            defaultValue={ice}
                                            inputRef={register({
                                                required: true
                                            })}
                                        />
                                        {(errors.Ice) ?
                                            <Alert severity="error">
                                                <AlertTitle>Error</AlertTitle>
                                                <strong>{errors.Ice && 'Debes colocar el ice del precio'}</strong>
                                            </Alert>
                                            :
                                            <></>
                                        }
                                    </FormControl>
                                    <FormControl margin="normal" fullWidth variant="filled">
                                        <TextField
                                            id="outlined-descripcion-input-required"
                                            label="Descripcion del precio"
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
                                                <strong>{errors.Descripcion && 'Debes colocar la descripcion del precio'}</strong>
                                            </Alert>
                                            :
                                            <></>
                                        }
                                    </FormControl>

                                    <Button
                                        onClick={() => setOpenDPrecios(false)}
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
                                {(Object.keys(precios).length !== 0) ?
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
                                                {precios.map((key, item) => (
                                                    <Row key={precios[item].PrecioId} row={precios[item]} />
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
                <DialogTitle id="alert-dialog-title">{`Estas seguro que deseas ${messages} esta precio?`}</DialogTitle>
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
                        onClick={() => toggleEstado(precioId)}>
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

export default Precios;