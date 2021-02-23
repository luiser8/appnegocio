import React, { useEffect, useState, useRef, Fragment } from 'react';
import Moment from 'moment';
import { useForm, Controller } from 'react-hook-form';
import '../../utils/Config';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { AddCircle, Delete, Edit, Check, Block, RestoreFromTrash, Room, Cancel } from '@material-ui/icons';
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
import Map from './Maps';

const Zonas = ({ user }) => {
    const { register, control, formState, handleSubmit, errors } = useForm({mode: "onChange"});
    var [rolUser] = useState(window.localStorage.getItem('RolId'));
    var [cadenaUser] = useState(window.localStorage.getItem('CadenaId'));
    var [localUser] = useState(window.localStorage.getItem('UsuarioLocalId'));
    var classes = useStyles();
    var [locales, setLocales] = useState([]);
    var [zonas, setZonas] = useState([]);
    var [rol, setRol] = useState();
    var [open, setOpen] = useState(false);
    var [zonaId, setZonaId] = useState('');
    var [localId, setLocalId] = useState('');
    var [nombre, setNombre] = useState('');
    var [poligono, setPoligono] = useState('');
    var [descripcion, setDescripcion] = useState('');
    var [openDZona, setOpenDZona] = useState(false);
    var [openDelEstado, setOpenDelEstado] = useState(false);
    var [messages, setMessages] = useState('');
    var [severity, setSeverity] = useState('');
    var [alerta, setAlerta] = useState('');
    var [btnAdd, setBtnAdd] = useState(true);
    var [success, setSuccess] = useState(false);
    var [openMap, setOpenMap] = useState(false);
    var [region, setRegion] = useState([]);

//Iniciaizamos los inputs para hacerles resets
const initialInputs = () => {
    setZonaId(''); setNombre(''); setPoligono(''); setDescripcion('');
}

const createPolygon = (polygon) => {
    if(polygon){
        console.log(JSON.stringify(polygon))
        setPoligono(polygon);
        setOpenMap(false);
    }
}

const handleCancelD = (value) => {
    setOpenDelEstado(!value);setBtnAdd(!value);initialInputs();
}

const handleDisable = (zona, msj) => {
    if (zona) {
        setZonaId(zona);setMessages(msj);setOpenDelEstado(true);
    }else {
        setOpenDelEstado(false);setZonaId('');//setMessages('');
    }
}

const editHandle = (zona) => {
    setBtnAdd(false);setOpenDZona(true);
    setLocalId(zona.LocalId); setZonaId(zona.ZonaId); setNombre(zona.Nombre); setPoligono(zona.Poligono); setDescripcion(zona.Descripcion);
}

const showMap = (map) => {
    setOpenMap(map);
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
//Agregamos nuevas zonas
    const addZonas = async (data) => {
        await fetch(`${global.config.appConfig.url.dev}PPN_Zona`, {
            method: 'POST',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify({
                'UsuarioCreacion':user,
                'LocalId':data.LocalId,
                'Nombre':data.Nombre,
                'Poligono':poligono,
                'Descripcion':data.Descripcion
            }),
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}PPN_Zona?local=${localUser}`)
                .then(response => response.json())
                .then(res => {
                    return setZonas(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        initialInputs();setOpenDZona(false);setSuccess(true);setMessages('Zona creado satisfactoriamente!');
        setTimeout(() => {
            setMessages('');setSuccess(false);
        }, 3000)
    }
//Actualizamos las zonas
    const updateZonas = async (data) => {
        await fetch(`${global.config.appConfig.url.dev}PPN_Zona/${zonaId}`, {
            method: 'PUT',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify(
                {
                    'ZonaId':zonaId,
                    'UsuarioCreacion':user,
                    'UsuarioActualizacion':user,
                    'LocalId':data.LocalId,
                    'Nombre':data.Nombre,
                    'Poligono':data.Poligono,
                    'Descripcion':data.Descripcion
                }
            ),
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}PPN_Zona?local=${localUser}`)
                .then(response => response.json())
                .then(res => {
                    return setZonas(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        initialInputs();setBtnAdd(true); setOpenDZona(false);setSuccess(true); setMessages('Zona actualizado satisfactoriamente!');
        setTimeout(() => {
            setMessages('');setSuccess(false);
        }, 3000)
    }
//Cambios de estados, activado y desabilitado
    const toggleEstado = async (zona) => {
        setOpenDelEstado(false);
        await fetch(`${global.config.appConfig.url.dev}PPN_Zona/${zona}`, {
            method: 'DELETE',
            headers: global.config.appConfig.headers.dev,
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}PPN_Zona?local=${localUser}`)
                .then(response => response.json())
                .then(res => {
                    return setZonas(res)
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
        getZonas();
        getRoles();
        navigator.geolocation.getCurrentPosition(info => {
            setRegion({'lat': info.coords.latitude, 'lng': info.coords.longitude});
        });
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
                    <IconButton href={`/zonas/${row.ZonaId}`}>
                        <Room fontSize="large"/>
                    </IconButton>
                    <IconButton onClick={() => editHandle(
                        {
                            'LocalId': row.LocalId,
                            'ZonaId': row.ZonaId,
                            'Nombre': row.Nombre,
                            'Poligono': row.Poligono,
                            'Descripcion': row.Descripcion
                        }
                    )}
                    ><Edit fontSize="large" /></IconButton>
                {rol === rolUser ?
                    <>
                        {row.Estado === 1 ? (
                            <IconButton onClick={() => handleDisable(row.ZonaId, 'desactivar')}><Delete fontSize="large" /></IconButton>
                        ) : (
                            <IconButton onClick={() => handleDisable(row.ZonaId, 'activar')}><RestoreFromTrash fontSize="large" /></IconButton>
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
                                    {/* <TableCell>Poligono</TableCell> */}
                                    <TableCell>Descripción</TableCell>
                                    <TableCell>Fecha de Creación</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* <TableCell>{row.Poligono}</TableCell> */}
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
                <Grid container spacing={2}>
                    <Grid item xs={11} md={11} lg={6}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link color="inherit" href="#" >Zonas</Link>
                            {false ? (
                                <Link color="inherit" href="#" >Categorías</Link>
                            ) : (
                                <Link color="inherit" href="#" ></Link>
                            )}
                        </Breadcrumbs>
                    </Grid>
                    <Grid item xs={1} md={1} lg={6} style={{marginTop:-16}}>
                    {rol === rolUser ? (
                        (!openDZona ? (
                            <IconButton>
                                <AddCircle fontSize="large" onClick={() => setOpenDZona(true)} />
                            </IconButton>
                        ) : (
                            <>
                            {openMap ? (
                             <IconButton>
                                <Cancel fontSize="large" onClick={() => setOpenMap(false)} />
                            </IconButton>
                        ) : (
                                <></>
                            )}
                            </>
                        ))
                    ) : (
                            <></>
                    )}
                        
                    </Grid>
                </Grid>
                <Grid container spacing={0}>
                        {openMap ? (
                            <Map coords={region} poligono={createPolygon}/>
                        ):(
                            <Grid item xs={12} md={8} lg={8}>
                            {/* Form new Categoria */}

                            {openDZona ? (
                                <form onSubmit={btnAdd ? handleSubmit(addZonas) : handleSubmit(updateZonas)}>
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
                                            label="Nombre zona"
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
                                                <strong>{errors.Nombre && 'Debes colocar nombre de la zona'}</strong>
                                            </Alert>
                                            :
                                            <></>
                                        }

                                    </FormControl>

                                    <FormControl margin="normal" radioGroup fullWidth variant="filled">
                                    <Button
                                        style={{textAlign:'left'}}
                                        onClick={() => showMap(true)}
                                        variant="outlined"
                                    >
                                        Area de cobertura
                                    </Button>
                                        {/* <TextField
                                            id="outlined-email-input-required"
                                            label="Poligono zona"
                                            type="text"
                                            name="Poligono"
                                            autoComplete="Poligono"
                                            margin="normal"
                                            variant="outlined"
                                            error={!!errors.Poligono}
                                            defaultValue={poligono}
                                            inputRef={register({
                                                required: true
                                            })}
                                        />
                                        {(errors.Poligono) ?
                                            <Alert severity="error">
                                                <AlertTitle>Error</AlertTitle>
                                                <strong>{errors.Poligono && 'Debes colocar poligono de la zona'}</strong>
                                            </Alert>
                                            :
                                            <></>
                                        } */}

                                    </FormControl>

                                    <FormControl margin="normal" fullWidth variant="filled">
                                        <TextField
                                            id="outlined-descripcion-input-required"
                                            label="Descripcion zona"
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
                                                <strong>{errors.Descripcion && 'Debes colocar la descripcion de la zona'}</strong>
                                            </Alert>
                                            :
                                            <></>
                                        }
                                    </FormControl>

                                    <Button
                                        onClick={() => setOpenDZona(false)}
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
                                {(Object.keys(zonas).length !== 0) ?
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
                                                {zonas.map((key, item) => (
                                                    <Row key={zonas[item].ZonaId} row={zonas[item]} />
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
                        )}

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
                <DialogTitle id="alert-dialog-title">{`Estas seguro que deseas ${messages} esta zona?`}</DialogTitle>
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
                        onClick={() => toggleEstado(zonaId)}>
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

export default Zonas;