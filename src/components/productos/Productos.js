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

const Productos = ({ user }) => {
    const { register, control, formState, handleSubmit, errors } = useForm({mode: "onChange"});
    var [rolUser] = useState(window.localStorage.getItem('RolId'));
    var [localIdUser] = useState(window.localStorage.getItem('UsuarioLocalId'));
    var classes = useStyles();
    var [locales, setLocales] = useState([]);
    var [unidadMedida, setUnidadMedida] = useState([]);
    var [categorias, setCategorias] = useState([]);
    var [productos, setProductos] = useState([]);
    var [rol, setRol] = useState();
    var [openLocal, setOpenLocal] = useState(false);
    var [openCategoria, setOpenCategoria] = useState(false);
    var [openUnidadMedida, setOpenUnidadMedida] = useState(false);
    var [productoId, setProductoId] = useState('');
    var [categoriaId, setCategoriaId] = useState('');
    var [unidadMedidaId, setUnidadMedidaId] = useState('');
    var [localId, setLocalId] = useState('');
    var [unificado, setUnificado] = useState(1);
    var [nombre, setNombre] = useState('');
    var [descripcion, setDescripcion] = useState('');
    var [openDProducto, setOpenDProducto] = useState(false);
    var [openDelEstado, setOpenDelEstado] = useState(false);
    var [messages, setMessages] = useState('');
    var [severity, setSeverity] = useState('');
    var [alerta, setAlerta] = useState('');
    var [btnAdd, setBtnAdd] = useState(true);
    var [success, setSuccess] = useState(false);

//Iniciaizamos los inputs para hacerles resets
const initialInputs = () => {
    setProductoId(''); setNombre(''); setDescripcion('');
}

const handleCancelD = (value) => {
    setOpenDelEstado(!value);setBtnAdd(!value);initialInputs();
}

const handleDisable = (producto, msj) => {
    if (producto) {
        setProductoId(producto);setMessages(msj);setOpenDelEstado(true);
    }else {
        setOpenDelEstado(false);setProductoId('');
    }
}

const editHandle = (producto) => {
    setBtnAdd(false);setOpenDProducto(true);
    setLocalId(producto.LocalId); 
    setProductoId(producto.ProductoId); 
    setCategoriaId(producto.CategoriaId); 
    setUnidadMedidaId(producto.UnidadMedidaId); 
    setUnificado(producto.Unificado); 
    setNombre(producto.Nombre); 
    setDescripcion(producto.Descripcion);
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
//Consultamos lista de Locales desde el api
const getLocales = async () => {
    var result = await fetch(`${global.config.appConfig.url.dev}PPN_Local/${localIdUser}`, {
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
//Consultamos lista de Categorias desde el api
const getCategorias = async () => {
    var result = await fetch(`${global.config.appConfig.url.dev}PPN_Categoria?local=${localIdUser}`, {
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
        return setCategorias(result)
    }
}
//Consultamos lista de UnidadMedida desde el api
    const getUnidadesMedida = async () => {
        var result = await fetch(`${global.config.appConfig.url.dev}PPC_UnidadMedida`, {
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
            return setUnidadMedida(result)
        }
    }
//Agregas nuevos productos
    const addProductos = async (data) => {
        await fetch(`${global.config.appConfig.url.dev}PPN_Producto`, {
            method: 'POST',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify({
                'LocalId':data.LocalId,
                'CategoriaId':data.CategoriaId,
                'UnidadMedidaId':data.UnidadMedidaId,
                'Nombre':data.Nombre,
                'Unificado':data.Unificado,
                'Descripcion':data.Descripcion,
                'UsuarioCreacion':user
            }),
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}PPN_Producto?local=${localIdUser}`)
                .then(response => response.json())
                .then(res => {
                    return setProductos(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        initialInputs();setOpenDProducto(false);setSuccess(true);setMessages('Producto creado satisfactoriamente!');
        setTimeout(() => {
            setMessages('');setSuccess(false);
        }, 3000)
    }
//Actualizar Productos
    const updateProductos = async (data) => {
        await fetch(`${global.config.appConfig.url.dev}PPN_Producto/${productoId}`, {
            method: 'PUT',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify(
                {
                    'ProductoId':productoId,
                    'LocalId':data.LocalId,
                    'CategoriaId':data.CategoriaId,
                    'UnidadMedidaId':data.UnidadMedidaId,
                    'Nombre':data.Nombre,
                    'Unificado':data.Unificado,
                    'Descripcion':data.Descripcion,
                    'UsuarioCreacion':user,
                    'UsuarioActualizacion':user,
                }
            ),
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}PPN_Producto?local=${localIdUser}`)
                .then(response => response.json())
                .then(res => {
                    return setProductos(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        initialInputs();setBtnAdd(true); setOpenDProducto(false);setSuccess(true); setMessages('Producto actualizado satisfactoriamente!');
        setTimeout(() => {
            setMessages('');setSuccess(false);
        }, 3000)
    }
//Cambios de estados de los productos activado y desabilitado
    const toggleEstado = async (producto) => {
        setOpenDelEstado(false);
        await fetch(`${global.config.appConfig.url.dev}PPN_Producto/${producto}`, {
            method: 'DELETE',
            headers: global.config.appConfig.headers.dev,
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}PPN_Producto?local=${localIdUser}`)
                .then(response => response.json())
                .then(res => {
                    return setProductos(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        setSuccess(true);setMessages(`Cambio establecido!`);
        setTimeout(() => {
            setSuccess(false);
        }, 3000)
    }
    useEffect(() => {
        getProductos();
        getLocales();
        getCategorias();
        getRoles();
        getUnidadesMedida();
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
                <TableCell align="left">{row.Categoria}</TableCell>
                <TableCell align="right">
                    <IconButton onClick={() => editHandle(
                        {
                            'ProductoId': row.ProductoId,
                            'LocalId': row.LocalId,
                            'CategoriaId': row.CategoriaId,
                            'UnidadMedidaId': row.UnidadMedidaId,
                            'Unificado': row.Unificado,
                            'Nombre': row.Nombre,
                            'Descripcion': row.Descripcion
                        }
                    )}
                    ><Edit fontSize="large" /></IconButton>
                {rol === rolUser ?
                    <>
                        {row.Estado === 1 ? (
                            <IconButton onClick={() => handleDisable(row.ProductoId, 'desactivar')}><Delete fontSize="large" /></IconButton>
                        ) : (
                            <IconButton onClick={() => handleDisable(row.ProductoId, 'activar')}><RestoreFromTrash fontSize="large" /></IconButton>
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
                                    <TableCell>Descripción</TableCell>
                                    <TableCell>Unificado</TableCell>
                                    <TableCell>Unidad Medida</TableCell>
                                    <TableCell>Fecha de Creación</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableCell>{row.Descripcion}</TableCell>
                                <TableCell>
                                    {(row.Unificado === 1 ? 
                                        <>Local</>
                                        :
                                        <>Cadena</>
                                    )}
                                </TableCell>
                                <TableCell>{row.UnidadMedida}</TableCell>
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
                            <Link color="inherit" href="#" >Productos</Link>
                            {false ? (
                                <Link color="inherit" href="#" >Categorías</Link>
                            ) : (
                                    <Link color="inherit" href="#" ></Link>
                                )}
                        </Breadcrumbs>
                    </Grid>
                    <Grid item xs={2} md={2} lg={2}>
                    {rol === rolUser ? (
                        (!openDProducto ? (
                            <IconButton>
                                <AddCircle fontSize="large" onClick={() => setOpenDProducto(true)} />
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

                            {openDProducto ? (
                                <form onSubmit={btnAdd ? handleSubmit(addProductos) : handleSubmit(updateProductos)}>
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
                                                    open={openLocal}
                                                    onClose={() => setOpenLocal(false)}
                                                    onOpen={() => setOpenLocal(true)}
                                                    
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
                                                    <strong>{errors.LocalId && 'Debes selecionar un local'}</strong>
                                                </Alert>
                                                :
                                                <></>
                                            }
                                    </FormControl>

                                    <FormControl margin="normal" fullWidth variant="filled">
                                        <InputLabel htmlFor="CategoriaId">Selecciona Categoria</InputLabel>
                                        <Controller
                                            control={control}
                                            name="CategoriaId"
                                            as={
                                                <Select
                                                    name="CategoriaId"
                                                    margin="normal"
                                                    variant="outlined"
                                                    error={!!errors.CategoriaId}
                                                    inputProps={{
                                                        name: "CategoriaId",
                                                        ref: register({
                                                            required: true,
                                                        })
                                                    }}
                                                    open={openCategoria}
                                                    onClose={() => setOpenCategoria(false)}
                                                    onOpen={() => setOpenCategoria(true)}
                                                    
                                                >
                                                    {Object.keys(categorias).map((key, c) => (
                                                        <MenuItem value={categorias[c].CategoriaId}>{categorias[c].Nombre}</MenuItem>
                                                    ))}
                                                </Select>
                                            }
                                            rules={{ required: true }}
                                            defaultValue={categoriaId}
                                        >
                                            
                                        </Controller>
                                        {(errors.CategoriaId) ?
                                                <Alert severity="error">
                                                    <AlertTitle>Error</AlertTitle>
                                                    <strong>{errors.CategoriaId && 'Debes selecionar una categoria'}</strong>
                                                </Alert>
                                                :
                                                <></>
                                            }
                                    </FormControl>

                                    <FormControl margin="normal" fullWidth variant="filled">
                                        <InputLabel htmlFor="UnidadMedidaId">Selecciona Unidad de Medida</InputLabel>
                                        <Controller
                                            control={control}
                                            name="UnidadMedidaId"
                                            as={
                                                <Select
                                                    name="UnidadMedidaId"
                                                    margin="normal"
                                                    variant="outlined"
                                                    error={!!errors.UnidadMedidaId}
                                                    inputProps={{
                                                        name: "UnidadMedidaId",
                                                        ref: register({
                                                            required: true,
                                                        })
                                                    }}
                                                    open={openUnidadMedida}
                                                    onClose={() => setOpenUnidadMedida(false)}
                                                    onOpen={() => setOpenUnidadMedida(true)}
                                                    
                                                >
                                                    {Object.keys(unidadMedida).map((key, um) => (
                                                        <MenuItem value={unidadMedida[um].UnidadMedidaId}>{unidadMedida[um].Nombre}</MenuItem>
                                                    ))}
                                                </Select>
                                            }
                                            rules={{ required: true }}
                                            defaultValue={unidadMedidaId}
                                        >
                                            
                                        </Controller>
                                        {(errors.UnidadMedidaId) ?
                                                <Alert severity="error">
                                                    <AlertTitle>Error</AlertTitle>
                                                    <strong>{errors.UnidadMedidaId && 'Debes selecionar una unidad de medida'}</strong>
                                                </Alert>
                                                :
                                                <></>
                                            }
                                    </FormControl>
                                    <FormControl margin="normal" fullWidth variant="filled">
                                        <TextField
                                            id="outlined-email-input-required"
                                            label="Nombre de producto"
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
                                                <strong>{errors.Nombre && 'Debes colocar nombre del producto'}</strong>
                                            </Alert>
                                            :
                                            <></>
                                        }

                                    </FormControl>
                                    <InputLabel htmlFor="Unificado">Selecciona si es unificado</InputLabel>
                                    <FormControl margin="normal" fullWidth variant="filled">
                                    
                                    <Controller
                                        control={control}
                                        name="Unificado" 
                                        as={
                                            <RadioGroup aria-label="quiz" 
                                                name="Unificado" 
                                                autoComplete="Unificado"
                                                margin="normal"
                                                variant="outlined"
                                                error={!!errors.Unificado}
                                                defaultValue={unificado}
                                                inputRef={register({
                                                    required: true
                                                })}
                                        >
                                            <FormControlLabel value={1} checked={unificado === 1} control={<Radio onChange={() => setUnificado(1)}/>} label="Local" />
                                            <FormControlLabel value={2} checked={unificado === 2} control={<Radio onChange={() => setUnificado(2)}/>} label="Cadena" />
                                        </RadioGroup>
                                    }
                                    onChange={([e]) => {
                                        return e.target.checked ? e.target.value : "";
                                      }}
                                    rules={{ required: true }}
                                    defaultValue={unificado}
                                    >

                                    </Controller>

                                        {(errors.Unificado) ?
                                            <Alert severity="error">
                                                <AlertTitle>Error</AlertTitle>
                                                <strong>{errors.Unificado && 'Debes colocar unificado del producto'}</strong>
                                            </Alert>
                                            :
                                            <></>
                                        }

                                    </FormControl>

                                    <FormControl margin="normal" fullWidth variant="filled">
                                        <TextField
                                            id="outlined-descripcion-input-required"
                                            label="Descripcion de producto"
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
                                                <strong>{errors.Descripcion && 'Debes colocar la descripcion del producto'}</strong>
                                            </Alert>
                                            :
                                            <></>
                                        }
                                    </FormControl>

                                    <Button
                                        onClick={() => setOpenDProducto(false)}
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
                                {(Object.keys(productos).length !== 0) ?
                                    <TableContainer component={Paper}>
                                        <Table size="small" aria-label="collapsible table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell />
                                                    <TableCell align="left">Nombre</TableCell>
                                                    <TableCell align="left">Categoria</TableCell>
                                                    <TableCell align="right">Opciones</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {productos.map((key, item) => (
                                                    <Row key={productos[item].ProductoId} row={productos[item]} />
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
                <DialogTitle id="alert-dialog-title">{`Estas seguro que deseas ${messages} esta producto?`}</DialogTitle>
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
                        onClick={() => toggleEstado(productoId)}>
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

export default Productos;