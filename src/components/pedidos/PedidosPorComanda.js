import React, { useEffect, useState, useRef, Fragment } from 'react';
import Moment from 'moment';
import { useForm, Controller } from 'react-hook-form';
import '../../utils/Config';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Pageview from '@material-ui/icons/Pageview';
import { AddCircle, Delete, Edit, Check, Block, RestoreFromTrash } from '@material-ui/icons';
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
    Chip, TextField, Snackbar, Collapse, Box, FormGroup,
} from '@material-ui/core';

const PedidosPorComada = (props) => {
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
    var [open, setOpen] = useState(false);
    var [openDelEstado, setOpenDelEstado] = useState(false); 
    var [date, setDate] = useState(Moment(new Date().getTime()).format('YYYY-MM-DD hh:mm:ss')); 
    var [comandas, setComandas] = useState([]);
    var [comandaId, setComandaId] = useState('');
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

    //Consultamos lista de Estados pertenecientes a las comandas desde el api
    const getEstados = async () => {
        var result = await fetch(`${global.config.appConfig.url.dev}POG_Estado?tipo=2`, {
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
            return setEstados(result)
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

        //Consultamos lista de Pedidos por comandas desde el api
        const getPedidos = async (comandaId) => {
            var result = await fetch(`${global.config.appConfig.url.dev}POC_Pedido?comanda=${comandaId}`, {
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
                return setPedidos(result)
            }
        }

    useEffect(() => {
        getRoles();
        getEstados();
        getPedidos(comanda);
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
                <TableRow>
                    <TableCell component="th" scope="row" >{row.NroPedido}</TableCell>
                    <TableCell align="left">{row.Nombres} {row.Apellidos}</TableCell>
                    <TableCell align="left">{row.Zona}</TableCell>
                    <TableCell align="left">{row.Cantidad}{row.Abreviatura}</TableCell>
                    <TableCell align="left">{new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(row.ValorTotalIva)}</TableCell>  
                </TableRow>
                <TableRow>
                    <TableCell style={{ padding:5 }} colSpan={6}>
                        <Grid container spacing={0}>
                            <Grid item xs={10} md={8} lg={10}>
                                <ButtonGroup color="default">
                                    {Object.keys(estados).map((key, e) => (
                                        <Fragment>
                                            {row.EstadoId === estados[e].EstadoId ? (
                                                <Button variant="text"  style={{cursor:"auto"}}
                                                className={classes.estado}>{estados[e].Nombre}</Button>
                                            ) : (
                                                    <Button variant="text" style={{cursor:"auto"}}
                                                >{estados[e].Nombre}</Button>
                                                )}

                                        </Fragment>
                                    ))}
  
                                </ButtonGroup>
                                </Grid>
                                <Grid align="center" item xs={2} md={4} lg={2}>
                                    <IconButton title="Ver detalles" edge="end" size="small" href={`/pedidosComandas/detalles/${row.PedidoId}/${row.ProductoId}/${comanda}`} aria-label="expand row">
                                        <Pageview fontSize="large"></Pageview>
                                    </IconButton>
                                    {/* <Typography align="center">
                                        <Link style={{ color: '#000' }} href={`/pedidosComandas/detalles/${row.PedidoId}/${row.ProductoId}/${comanda}`}>Ver detalles</Link>
                                    </Typography> */}
                                </Grid>
                            </Grid>
                            <Box borderBottom={2}  />
                        </TableCell>
                        </TableRow>
            </Fragment>
        );
    }
    return (
        <Card variant="outlined">
            <CardContent>
            <Grid container spacing={0}>
                <Grid item xs={10} md={10} lg={10}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link color="inherit" href="/" >Comandas</Link>
                            <Link color="inherit" href="" >Pedidos</Link>
                        </Breadcrumbs>
                </Grid>
                <Grid container spacing={0}>
                    <Grid item xs={12} md={10} lg={8}>
                        {(Object.keys(pedidos).length !== 0) ?
                            <TableContainer component={Paper}>
                                <Table size="small" aria-label="collapsible table">
                                        <TableHead>
                                                <TableRow>
                                                <TableCell align="left">Nro</TableCell>
                                                    <TableCell align="left">Cliente</TableCell>
                                                    <TableCell align="left">Zona</TableCell>
                                                    <TableCell align="left">Cantidad</TableCell>
                                                    <TableCell align="left">Total</TableCell>
                                                    <TableCell align="left"></TableCell>
                                                </TableRow>

                                        </TableHead>
                                       
                                            <TableBody>
                                                {pedidos.map((key, item) => (
                                                    <Row key={pedidos[item].PedidoId} row={pedidos[item]} />
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
                    </Grid>

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
export default PedidosPorComada;