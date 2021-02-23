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

const Categorias = ({ user }) => {
    const { register, control, formState, handleSubmit, errors } = useForm({ mode: "onChange" });
    var [rolUser] = useState(window.localStorage.getItem('RolId'));
    var [cadenaUser] = useState(window.localStorage.getItem('CadenaId'));
    var [localUser] = useState(window.localStorage.getItem('UsuarioLocalId'));
    var classes = useStyles();
    var [locales, setLocales] = useState([]);
    var [categorias, setCategorias] = useState([]);
    var [rol, setRol] = useState();
    var [open, setOpen] = useState(false);
    var [categoriaId, setCategoriaId] = useState('');
    var [localId, setLocalId] = useState('');
    var [nombre, setNombre] = useState('');
    var [descripcion, setDescripcion] = useState('');
    var [openDCategoria, setOpenDCategoria] = useState(false);
    var [openDelEstado, setOpenDelEstado] = useState(false);
    var [messages, setMessages] = useState('');
    var [severity, setSeverity] = useState('');
    var [alerta, setAlerta] = useState('');
    var [btnAdd, setBtnAdd] = useState(true);
    var [success, setSuccess] = useState(false);

    //Iniciaizamos los inputs para hacerles resets
    const initialInputs = () => {
        setCategoriaId(''); setNombre(''); setDescripcion('');
    }

    const handleCancelD = (value) => {
        setOpenDelEstado(!value); setBtnAdd(!value); initialInputs();
    }

    const handleDisable = (categoria, msj) => {
        if (categoria) {
            setCategoriaId(categoria); setMessages(msj); setOpenDelEstado(true);
        } else {
            setOpenDelEstado(false); setCategoriaId('');//setMessages('');
        }
    }

    const editHandle = (categoria) => {
        setBtnAdd(false); setOpenDCategoria(true);
        setLocalId(categoria.LocalId); setCategoriaId(categoria.CategoriaId); setNombre(categoria.Nombre); setDescripcion(categoria.Descripcion);
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
    //Consultamos lista de Categorias desde el api
    const getCategorias = async () => {
        var result = await fetch(`${global.config.appConfig.url.dev}PPN_Categoria?local=${localUser}`, {
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
//Agregar nuevas categorias
    const addCategorias = async (data) => {
        await fetch(`${global.config.appConfig.url.dev}PPN_Categoria`, {
            method: 'POST',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify({
                'UsuarioCreacion': user,
                'LocalId': data.LocalId,
                'Nombre': data.Nombre,
                'Descripcion': data.Descripcion
            }),
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}PPN_Categoria?local=${localUser}`)
                .then(response => response.json())
                .then(res => {
                    return setCategorias(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        initialInputs(); setOpenDCategoria(false); setSuccess(true); setMessages('Categoria creado satisfactoriamente!');
        setTimeout(() => {
            setMessages(''); setSuccess(false);
        }, 3000)
    }
//Actualizar categorias
    const updateCategorias = async (data) => {
        await fetch(`${global.config.appConfig.url.dev}PPN_Categoria/${categoriaId}`, {
            method: 'PUT',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify(
                {
                    'CategoriaId': categoriaId,
                    'UsuarioCreacion': user,
                    'UsuarioActualizacion': user,
                    'LocalId': data.LocalId,
                    'Nombre': data.Nombre,
                    'Descripcion': data.Descripcion
                }
            ),
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}PPN_Categoria?local=${localUser}`)
                .then(response => response.json())
                .then(res => {
                    return setCategorias(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        initialInputs(); setBtnAdd(true); setOpenDCategoria(false); setSuccess(true); setMessages('Categoria actualizado satisfactoriamente!');
        setTimeout(() => {
            setMessages(''); setSuccess(false);
        }, 3000)
    }
//Cambios de estados, activado y desactivado
    const toggleEstado = async (categoria) => {
        setOpenDelEstado(false);
        await fetch(`${global.config.appConfig.url.dev}PPN_Categoria/${categoria}`, {
            method: 'DELETE',
            headers: global.config.appConfig.headers.dev,
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}PPN_Categoria?local=${localUser}`)
                .then(response => response.json())
                .then(res => {
                    return setCategorias(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        setSuccess(true); setMessages(`Cambio establecido!`);
        setTimeout(() => {
            setSuccess(false);
        }, 3000)
    }
    useEffect(() => {
        getLocales();
        getCategorias();
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
                                'CategoriaId': row.CategoriaId,
                                'Nombre': row.Nombre,
                                'Descripcion': row.Descripcion
                            }
                        )}
                        ><Edit fontSize="large" /></IconButton>
                    {rol === rolUser ?
                        <>
                            {row.Estado === 1 ? (
                                <IconButton onClick={() => handleDisable(row.CategoriaId, 'desactivar')}><Delete fontSize="large" /></IconButton>
                            ) : (
                                    <IconButton onClick={() => handleDisable(row.CategoriaId, 'activar')}><RestoreFromTrash fontSize="large" /></IconButton>
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
                                        <TableCell>Fecha de Creación</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableCell>{row.Descripcion}</TableCell>
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
                        <Link color="inherit" href="#" >Categorías</Link>
                        {false ? (
                            <Link color="inherit" href="#" >Categorías</Link>
                        ) : (
                                <Link color="inherit" href="#" ></Link>
                            )}
                    </Breadcrumbs>
                </Grid>
                <Grid item xs={2} md={2} lg={2}>
                    {rol === rolUser ? (
                        (!openDCategoria ? (
                            <IconButton>
                                <AddCircle fontSize="large" onClick={() => setOpenDCategoria(true)} />
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

                    {openDCategoria ? (
                        <form onSubmit={btnAdd ? handleSubmit(addCategorias) : handleSubmit(updateCategorias)}>
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
                                        <strong>{errors.LocalId && 'Debes selecionar un local'}</strong>
                                    </Alert>
                                    :
                                    <></>
                                }
                            </FormControl>

                            <FormControl margin="normal" fullWidth variant="filled">
                                <TextField
                                    id="outlined-email-input-required"
                                    label="Nombre categoria"
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
                                        <strong>{errors.Nombre && 'Debes colocar nombre de la categoria'}</strong>
                                    </Alert>
                                    :
                                    <></>
                                }

                            </FormControl>

                            <FormControl margin="normal" fullWidth variant="filled">
                                <TextField
                                    id="outlined-descripcion-input-required"
                                    label="Descripcion categoria"
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
                                        <strong>{errors.Descripcion && 'Debes colocar la descripcion de la categoria'}</strong>
                                    </Alert>
                                    :
                                    <></>
                                }
                            </FormControl>

                            <Button
                                onClick={() => setOpenDCategoria(false)}
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
                                {(Object.keys(categorias).length !== 0) ?
                                    <TableContainer component={Paper}>
                                        <Table size="small" aria-label="collapsible table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell />
                                                    <TableCell align="left">Nombre</TableCell>
                                                    <TableCell align="right">Opciones</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {categorias.map((key, item) => (
                                                    <Row key={categorias[item].CategoriaId} row={categorias[item]} />
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
            <DialogTitle id="alert-dialog-title">{`Estas seguro que deseas ${messages} esta categoria?`}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description"></DialogContentText>
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
                    onClick={() => toggleEstado(categoriaId)}>
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

export default Categorias;