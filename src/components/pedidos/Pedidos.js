import React, { useEffect, useState, useRef, Fragment } from 'react';
import Moment from 'moment';
import { useForm, Controller } from 'react-hook-form';
import '../../utils/Config';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Pageview from '@material-ui/icons/Pageview';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
    Divider, Radio, ButtonGroup, RadioGroup, FormControlLabel, FormControl, Input, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Row,
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
    Chip, TextField, Snackbar, Collapse, Box, FormGroup, Checkbox,
} from '@material-ui/core';

const Pedidos = (props) => {
    //Recibimos props desde el route para obtener los parametros desde otros componentes
    //Establecemos definicion de los estados
    var [pedidos, setPedidos] = useState([]);
    var [estados, setEstados] = useState([]);
    var [comanda] = useState(props.match.params.id);
    var classes = useStyles();
    const { register, control, formState, handleSubmit, errors } = useForm({ mode: "onChange" });
    var [rolUser] = useState(window.localStorage.getItem('RolId'));
    var [localUser] = useState(window.localStorage.getItem('UsuarioLocalId'));
    var [rol, setRol] = useState();
    var [preparados, setPreparados] = useState(true);
    var [estado, setEstado] = useState('Preparado');
    var [openCalendario, setOpenCalendario] = useState(false);
    var [openDelEstado, setOpenDelEstado] = useState(false);
    var [openSort, setOpenSort] = useState(false);
    var [changeEstado, setChangeEstado] = useState(false);
    var [sort, setSort] = useState(1);
    var [date, setDate] = useState(Moment(new Date().getTime()).format('YYYY-MM-DD hh:mm:ss'));
    var [calendarios, setCalendarios] = useState([]);
    var [calendarioId, setCalendarioId] = useState('');
    var [estadoId1, setEstadoId1] = useState();
    var [messages, setMessages] = useState('');
    var [severity, setSeverity] = useState('');
    var [alerta, setAlerta] = useState('');
    var [btnAdd, setBtnAdd] = useState(true);
    var [success, setSuccess] = useState(false);

    const changeCalendarioPedido = (calendario, sort) => {
        if (calendario) {
            setCalendarioId(calendario);
            getPedidos(localUser, sort, calendario, false);
            window.localStorage.setItem('sortPedido', sort);
            window.localStorage.setItem('calendarioId', calendario);
        }
    }
    const changeSortPedido = (sort) => {
        if (sort) {
            setSort(sort);
            getPedidos(localUser, sort, window.localStorage.getItem('calendarioId'),false);
            window.localStorage.setItem('sortPedido', sort);
        }
    }
    const changePreparadoPedido = (preparado) => {
        setPreparados(preparado);
        window.localStorage.setItem('checkPreparado', preparado);
        if (preparado) {
            setEstado('Preparado');
        }else{
            setEstado('Existencia');
        }
    }
    //Consultamos lista de Estados pertenecientes a los pedidos desde el api
    const getEstados = async () => {
        var result = await fetch(`${global.config.appConfig.url.dev}POG_Estado?tipo=2`, {
            method: 'GET',
            headers: global.config.appConfig.headers.dev,
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json()
            } else { // si no se obtiene una respuesta
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
            return promiseEstados(result)
        }
    }
    //Obtener los estados ya hacer comparacion
    const promiseEstados = async (req) => {
        if (req) {
            setEstados(req);
            (await Promise.all([req])).map((items) => {
                if (items) {
                    items.forEach((item) => {
                        setEstadoId1(item.EstadoId);
                    })
                }
            })
        }

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
            } else { // si no se obtiene una respuesta
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
            return promiseRol(result)
        }
    }
    //Obtener los datos dependiendo de donde lo llamo, para establecer el rol
    const promiseRol = async (req) => {
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
    //Consultamos lista de Calendarios desde el api para hacer filtro
    const getCalendarios = async () => {
        var result = await fetch(`${global.config.appConfig.url.dev}PPN_Calendario?local=${localUser}`, {
            method: 'GET',
            headers: global.config.appConfig.headers.dev,
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json()
            } else { // si no se obtiene una respuesta
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
    //Consultamos lista de Pedidos por comandas desde el api
    const getPedidos = async (local, sort, calendario, chequeo) => {
        var result = await fetch(`${global.config.appConfig.url.dev}POC_Pedido?local=${local}&sort=${sort}&calendario=${calendario}`, {
            method: 'GET',
            headers: global.config.appConfig.headers.dev,
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json()
            } else { // si no se obtiene una respuesta
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
            return promisePedidos(result, chequeo)
        }
    }
    //Obtener los PedidosId para comprar los estados
    const promisePedidos = async (req, chequeo) => {
        if (req) {
            setPedidos(req);
            (await Promise.all([req])).map((items) => {
                if (items) {
                    items.forEach((item) => {
                        if(chequeo){
                            getEstadosDetalles(item.PedidoId);
                        }
                    })
                }
            })
        }

    }
    //Consultamos lista de Pedidos ubicando estados en detalles
    const getEstadosDetalles = async (pedido) => {
        var result = await fetch(`${global.config.appConfig.url.dev}POC_Pedido?pedido=${pedido}`, {
            method: 'GET',
            headers: global.config.appConfig.headers.dev,
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json().then(() => {
                    fetch(`${global.config.appConfig.url.dev}POC_Pedido?local=${localUser}&sort=${sort}&calendario=${window.localStorage.getItem('calendarioId')}`)
                        .then(response => response.json())
                        .then(res => {
                            return setPedidos(res)
                        })
                        .catch(e => console.log(e))
                })
            } else { // si no se obtiene una respuesta
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
            return result;
        }
    }
    //Actualizamos los estados de los pedidos
    const checkEstados = (pedido) => {
        if(pedido.EstadoActual === 'Pendiente' && pedido.Estado === 'Preparado'){
            upEstadoPedido(pedido);
        }else if(pedido.EstadoActual === 'Preparado' && pedido.Estado === 'Existencia'){
            upEstadoPedido(pedido);
        }else{
            setSuccess(true); setSeverity('error');setMessages('No se puede realizar este cambio de estado');
            setTimeout(() => {
                setMessages('');setSuccess(false);
            }, 4000)
        }
    }
    const upEstadoPedido = async (pedido) => {
        await fetch(`${global.config.appConfig.url.dev}POC_Pedido/${pedido.PedidoId}?estado=${pedido.EstadoId}`, {
            method: 'PUT',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify({'PedidoId': pedido.PedidoId, 'EstadoId': pedido.EstadoId}),
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}POC_Pedido?local=${localUser}&sort=${sort}&calendario=${window.localStorage.getItem('calendarioId')}`)
                .then(response => response.json())
                .then(res => {
                    return setPedidos(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
    }

    useEffect(() => {
        getRoles();
        getEstados();
        getCalendarios();
        if (window.localStorage.getItem('calendarioId')) {
            getPedidos(localUser, sort, window.localStorage.getItem('calendarioId'), true);
        } else {
            getPedidos(localUser, sort, calendarioId, true);
        }
    }, [])

    //Funcionalidad para generar un detalle de tipo Accordion en las tablas
    const useRowStyles = makeStyles({
        root: {
            '& > *': {
                borderBottom: 'unset',
            },
        },
        estado: {
            backgroundColor: '#ffc107',
        },
    });

    function Row(props) {
        const { row } = props;
        const [open, setOpen] = useState(false);
        const classes = useRowStyles();

        return (
            <Fragment>
                {/* <Grid container justify="left" spacing={0}> */}
                    <TableRow>
                        <TableCell component="th" scope="row" >{row.NroPedido}</TableCell>
                        <TableCell align="left">{row.Nombres} {row.Apellidos}</TableCell>
                        <TableCell align="left">{row.Zona}</TableCell>
                        <TableCell align="left">{row.Items}</TableCell>
                        <TableCell align="left">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.Total)}</TableCell>
                    </TableRow>
                        <TableRow>
                            <TableCell style={{ padding:5 }} colSpan={6}>
                            <Grid container spacing={0}>
                            <Grid item xs={10} md={8} lg={10}>
                            <ButtonGroup color="default">
                                    {Object.keys(estados).map((key, e) => (
                                        <Fragment>
                                            {row.EstadoId === estados[e].EstadoId ? (
                                                <Button variant="outlined"
                                                    onClick={() => null}
                                                    className={classes.estado}>{estados[e].Nombre}
                                                </Button>
                                            ) : (
                                                <Button variant="outlined"
                                                    onClick={() => checkEstados({
                                                        'PedidoId': row.PedidoId,
                                                        'EstadoId': estados[e].EstadoId,
                                                        'Estado': estados[e].Nombre,
                                                        'EstadoActual': row.Estado
                                                    })}>{estados[e].Nombre}
                                                </Button>
                                            )}
                                        </Fragment>
                                    ))}

                                </ButtonGroup>
                                    
                                </Grid>
                                    <Grid align="center" item xs={2} md={4} lg={2}>
                                    <IconButton title="Ver detalles" edge="end" size="small" href={`/pedidos/detalles/${row.PedidoId}`} aria-label="expand row">
                                        <Pageview fontSize="large"></Pageview>
                                    </IconButton>
                                    {/* <Button size="small" fullWidth={true} variant="text" href={`/pedidos/detalles/${row.PedidoId}`}>
                                            <Typography style={{textTransform:'capitalize'}} variant="button">Detalles</Typography>
                                        </Button> */}
                                        {/* <Link style={{ color: '#000'}} href={`/pedidos/detalles/${row.PedidoId}`}>Ver detalles</Link> */}
                                    </Grid>
                                </Grid>
                                <Box borderBottom={2} />
                            </TableCell>
                            
                        </TableRow>
                       
                    {/* </Grid>
                </Grid> */}
            </Fragment >
        );
    }
    return (
        <Card variant="outlined">
            <CardContent>
                <Grid container spacing={0}>
                    <Grid item xs={10} md={10} lg={10}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link color="inherit" href="/pedidos" >Pedidos</Link>
                            <Link color="inherit" href="" ></Link>
                        </Breadcrumbs>
                    </Grid>
                    <Grid item xs={6} md={4} lg={4}>
                        <CardContent>
                            <Typography>Filtrar: Calendario</Typography>
                            <Select
                                required
                                margin="normal"
                                variant="outlined"
                                labelId="CalendarioId"
                                id="CalendarioId"
                                open={openCalendario}
                                onClose={() => setOpenCalendario(false)}
                                onOpen={() => setOpenCalendario(true)}
                                defaultValue={window.localStorage.getItem('calendarioId') ? window.localStorage.getItem('calendarioId') : calendarioId}
                                onChange={(event) => changeCalendarioPedido(event.target.value, 5)}
                            >
                                {Object.keys(calendarios).map((key, c) => (
                                    <MenuItem value={calendarios[c].CalendarioId}>{Moment(calendarios[c].FechaHoraLimProdProv).format('YYYY-MM-DD')}</MenuItem>
                                ))}
                            </Select>

                        </CardContent>
                    </Grid>
                    <Grid item xs={3} md={2} lg={2}>
                        <CardContent>
                            <Typography>Pendientes</Typography>
                            <Checkbox
                                required
                                margin="normal"
                                variant="outlined"
                                checked={preparados}
                                onChange={(event) => changePreparadoPedido(event.target.checked)}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                        </CardContent>

                    </Grid>
                    <Grid item xs={3} md={2} lg={2}>
                            <CardContent>
                                <Typography>Ordenar:</Typography>
                                <Select
                                    required
                                    disabled={(Object.keys(pedidos).length !== 0) ? false : true}
                                    margin="normal"
                                    variant="outlined"
                                    labelId="sort"
                                    id="sort"
                                    open={openSort}
                                    onClose={() => setOpenSort(false)}
                                    onOpen={() => setOpenSort(true)}
                                    defaultValue={sort}
                                    onChange={(event) => changeSortPedido(event.target.value)}
                                >
                                    <MenuItem selected value={1}>Pedido</MenuItem>
                                    <MenuItem value={2}>Zona</MenuItem>
                                    <MenuItem value={3}>Cantidad</MenuItem>
                                    <MenuItem value={4}>Total</MenuItem>
                                </Select>
                            </CardContent>
                    </Grid>
                
                <Grid container spacing={0}>
                    <Grid item xs={12} md={10} lg={8}>
                        {(Object.keys(pedidos).length !== 0) ?
                            <TableContainer component={Paper}>
                                <Table size="small"  aria-label="collapsible table">
                                    {/* <Grid container justify="right"> */}
                                        <TableHead>
                                            {/* <Grid item xs={12} md={12} lg={12}> */}
                                                <TableRow>
                                                    <TableCell align="left">Nro</TableCell>
                                                    <TableCell align="left">Cliente</TableCell>
                                                    <TableCell align="left">Zona</TableCell>
                                                    <TableCell align="left">Cantidad</TableCell>
                                                    <TableCell align="left">Total</TableCell>
                                                    {/* <TableCell align="left"></TableCell> */}

                                                </TableRow>
                                            {/* </Grid> */}
                                            {/* <Box borderBottom={1} /> */}
                                        </TableHead>
                                        {/* <Grid item xs={12} md={12} lg={12}> */}
                                            <TableBody>
                                                {Object.keys(pedidos).map((key, item) => (
                                                    pedidos[item].Estado !== estado ?
                                                        <Row key={pedidos[item].PedidoId} row={pedidos[item]} />
                                                        :
                                                        <></>
                                                ))}
                                            </TableBody>
                                        {/* </Grid>
                                    </Grid> */}
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
                                <Typography>No hay pedidos establecidos para este calendario</Typography>
                                {/* <CircularProgress size={100} disableShrink color="secondary" /> */}
                            </Grid>
                        }
                    </Grid>

                </Grid>
            </Grid>
            </CardContent>
            
            {/* Snackbar */}
            {success ? (
                <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
                    <Alert onClose={() => setSuccess(false)} severity={severity}>
                        {messages}
                    </Alert>
                </Snackbar>
            ) : (
                    <></>
                )}


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
export default Pedidos;