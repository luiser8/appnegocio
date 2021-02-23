import React, { useState, useEffect, Fragment } from 'react';
import Moment from 'moment';
import {
    Breadcrumbs, Link, Card, CardContent, Paper, Typography, ListItem, List, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Grid, Button, ButtonGroup, Divider, Input, TextField, Box,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import '../../utils/Config';

const Detalle = (props) => {
    //Recibimos props desde el route para obtener los parametros desde otros componentes
    //Establecemos definicion de los estados
    var [detalles, setDetalles] = useState([]);
    var [estados, setEstados] = useState([]);
    var [estadoPreparado, setEstadoPreparado] = useState([]);
    var [nroPedido, setNroPedido] = useState([]);
    var [cliente, setCliente] = useState([]);
    var [zona, setZona] = useState([]);
    var [productos, setProductos] = useState([]);
    var [total, setTotal] = useState([]);
    var [pedido] = useState(props.match.params.pedido);
    var [producto] = useState(props.match.params.producto);
    var [comanda] = useState(props.match.params.comanda);
    var [messages, setMessages] = useState('');
    var [severity, setSeverity] = useState('');
    var [alerta, setAlerta] = useState('');
    const classes = useStyles();

    //Consultamos lista de Estados desde el api
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
            return promise(result, 1)
        }
    }
    //Consultamos lista de DetallePedidos por pedidos desde el api
    const getDetalles = async () => {
        var result = await fetch(`${global.config.appConfig.url.dev}POC_DetallePedido?pedido=${pedido}`, {
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
            return promise(result, 2)
        }
    }
    //Obtener los datos dependiendo de donde lo llamo, para establecer en estados datos como el cliente, los totales, la zona y el nro orden
    const promise = async (req, origen) => {
        if (origen === 1) {
            setEstados(req);
            (await Promise.all([req])).map((items) => {
                if (items) {
                    items.forEach((item) => {
                        if (item.Nombre === 'Preparado') {
                            setEstadoPreparado(item.EstadoId);
                        }
                    })
                }
            })
        } else if (origen === 2) {
            setDetalles(req);
            var total = 0;
            (await Promise.all([req])).map((items) => {
                if (items) {
                    items.forEach((item) => {
                        setCliente(`${item.Nombres} ${item.Apellidos}`)
                        setNroPedido(item.NroPedido)
                        setZona(item.Zona)
                        setProductos(items.length)
                        total += Number(item.ValorTotalIva)
                        setTotal(total)
                    })
                }
            })
        }
    }
    //Chequeamos los estados de los DetallesPedidos
    const checkEstados = (detalle) => {
        if (detalle.EstadoActual === 'Pendiente' && detalle.Estado === 'Preparado') {
            upEstadoDetallePedido(detalle);
        } else if (detalle.EstadoActual === 'Preparado' && detalle.Estado === 'Existencia') {
            upEstadoDetallePedido(detalle);
        }
    }
    //Actualizamos los estados de los DetallesPedidos
    const upEstadoDetallePedido = async (detalle) => {
        await fetch(`${global.config.appConfig.url.dev}POC_DetallePedido/${detalle.DetallePedidoId}?estado=${detalle.EstadoId}`, {
            method: 'PUT',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify({ 'DetallePedidoId': detalle.DetallePedidoId, 'EstadoId': detalle.EstadoId }),
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}POC_DetallePedido?pedido=${pedido}`)
                .then(response => response.json())
                .then(res => {
                    return setDetalles(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
    }
    //Actualizamos todos los estados de los DetallePedido pertenecienetes a cada pedido
    const prepararPedidos = async (detalle) => {
        await fetch(`${global.config.appConfig.url.dev}POC_DetallePedido?pedido=${detalle.PedidoId}&estado=${detalle.EstadoId}`, {
            method: 'PUT',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify(detalle),
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}POC_DetallePedido?pedido=${pedido}`)
                .then(response => response.json())
                .then(res => {
                    return setDetalles(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
    }

    useEffect(() => {
        getDetalles();
        getEstados();
    }, []);

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
                    <TableCell align="left">{row.Producto}</TableCell>
                    <TableCell align="left">{row.Cantidad}{row.Abreviatura}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ padding: 5 }} colSpan={6}>
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
                                                            'DetallePedidoId': row.DetallePedidoId,
                                                            'EstadoId': estados[e].EstadoId,
                                                            'Estado': estados[e].Nombre,
                                                            'EstadoActual': row.Estado
                                                        })}
                                                    >{estados[e].Nombre}</Button>
                                                )}

                                        </Fragment>
                                    ))}

                                </ButtonGroup>                     
                            </Grid>

                        </Grid>
                        <Box borderBottom={2}/>
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
                            <Link color="inherit" href={`/pedidos`} >Pedidos</Link>
                            <Link color="inherit" href="#" >Detalles</Link>
                        </Breadcrumbs>
                    </Grid>
                    <Grid item xs={6} md={4} lg={4}>
                        <CardContent>
                            <Typography>Cliente: {cliente}</Typography>
                            <Typography>Orden: {nroPedido}</Typography>
                            <Typography>Zona: {zona}</Typography>
                        </CardContent>
                    </Grid>
                    <Grid item xs={4} md={4} lg={4}>
                        <CardContent>
                            <Typography>Items: {productos}</Typography>
                            <Typography>Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}</Typography>
                        </CardContent>
                    </Grid>

                </Grid>

                <Grid container spacing={0}>
                    <Grid item xs={12} md={10} lg={8}>
                        {(Object.keys(detalles).length !== 0) ?
                            <TableContainer component={Paper}>
                                <Table size="small" aria-label="collapsible table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.tablaHead} align="left">Nro</TableCell>
                                            <TableCell className={classes.tablaHead} align="left">Item</TableCell>
                                            <TableCell className={classes.tablaHead} align="left">Cantidad.</TableCell>
                                            <TableCell className={classes.tablaHead} align="right">
                                                <Button variant="outlined" onClick={() => prepararPedidos({
                                                    'PedidoId': pedido,
                                                    'EstadoId': estadoPreparado
                                                })}>Preparar todos</Button>
                                            </TableCell>
                                        </TableRow>

                                        {/* <Box borderBottom={1} /> */}
                                    </TableHead>

                                    <TableBody>
                                        {detalles.map((key, item) => (
                                            <Row key={detalles[item].DetalleId} row={detalles[item]} />
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

                <Grid align="right" style={{marginTop:10, marginBottom:-15}}>
                    <Link href="/pedidos" variant="overline">
                        <Button color="secondary" variant="contained">Ok.</Button>
                    </Link>
                </Grid>
            </CardContent>
        </Card>
    );
}
const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    table: {
        minWidth: 650,
    },
    estado: {
        backgroundColor: '#ffc107',
    },
    tablaHead: {
        fontWeight: "bold",
        color: '#303f9f'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 220,
    },
}));
export default Detalle;