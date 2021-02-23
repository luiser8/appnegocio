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


const Comada = ({ user }) => {
    var classes = useStyles();
    const { register, control, formState, handleSubmit, errors } = useForm({ mode: "onChange" });
    var [rolUser] = useState(window.localStorage.getItem('RolId'));
    var [localUser] = useState(window.localStorage.getItem('UsuarioLocalId'));
    var [rol, setRol] = useState();
    var [date, setDate] = useState(Moment(new Date().getTime()).format('YYYY-MM-DD'));
    var [sortDefault, setSortDefault] = useState('Zona');
    var [sort, setSort] = useState(1);
    var [openSort, setOpenSort] = useState(false);
    var [openDelEstado, setOpenDelEstado] = useState(false);
    var [estados, setEstados] = useState([])
    var [comandas, setComandas] = useState([]);
    var [comandaId, setComandaId] = useState('');
    var [revision, setRevision] = useState('');
    var [prodprov, setProdprov] = useState('');
    var [existencia, setExistencia] = useState('');
    var [messages, setMessages] = useState('');
    var [severity, setSeverity] = useState('');
    var [alerta, setAlerta] = useState('');
    var [btnAdd, setBtnAdd] = useState(true);
    var [success, setSuccess] = useState(false);

    //Iniciaizamos los inputs para hacerles resets
    const handleCancelD = (value) => {
        setOpenDelEstado(!value); setBtnAdd(!value);
    }

    const changeDateComanda = (datetime) => {
        if (datetime) {
            setDate(Moment(datetime).format('YYYY-MM-DD'));
            getComandas(Moment(datetime).format('YYYY-MM-DD'), sort);
            window.localStorage.setItem('today', Moment(datetime).format('YYYY-MM-DD'));
        }
    }
    const changeSortComanda = (sort) => {
        if (sort) {
            setSort(sort);
            getComandas(Moment(window.localStorage.getItem('today')).format('YYYY-MM-DD'), sort);
            window.localStorage.setItem('sortComanda', sort);
        }
    }
    //Consultamos lista de Estados pertenecientes a las comandas desde el api
    const getEstados = async () => {
        var result = await fetch(`${global.config.appConfig.url.dev}POG_Estado?tipo=1`, {
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
                            switch(item.Nombre){
                                case 'Revision' :
                                    setRevision(item.EstadoId);
                                case 'Prod/Prov' :
                                    setProdprov(item.EstadoId);
                                case 'Existencia' :
                                    setExistencia(item.EstadoId);
                            }
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
    //Consultamos lista de Comandas desde el api
    const getComandas = async (datetime, sort) => { //&date=${date}
        var result = await fetch(`${global.config.appConfig.url.dev}POP_Comanda?local=${localUser}&date=${datetime}&sort=${sort}`, {
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
            return setComandas(result)
        }
    }
    const promiseComandas = async (req) => {
        setComandas(req);
        if (req) {
            (await Promise.all([req])).map((items) => {
                items.forEach((item) => {
                    if (item) {
                        console.log(item.ComandaId)
                        getComandasPreparadas(item.ComandaId);
                    }
                })
            })
        }

    }
    //Consultamos los pedidos preparados que esten en la comanda para cambiar estado a existencia solo si todos sus pedidos esten preparados desde el api
    const getComandasPreparadas = async (comanda) => {
        var result = await fetch(`${global.config.appConfig.url.dev}POP_Comanda?comanda=${comanda}&estado=35ee17f1-0109-4f39-95bb-9792de73c957&existencia=DCBD0F6E-FD9D-4CFF-85A8-1D0376327920`, {
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
            return result;
        }
    }
        //Actualizamos los estados de las comandas
        const checkEstados = (comanda) => {
            console.log(comanda);
            if(comanda.Estado === 'Existencia'){
                upEstadoComanda({'ComandaId': comanda.ComandaId, 'EstadoComandaId':comanda.EstadoId, 'EstadoPedidoId':comanda.EstadoId});
            }else if(comanda.Estado === 'Revision'){
                upEstadoComanda({'ComandaId': comanda.ComandaId, 'EstadoComandaId': revision, 'EstadoPedidoId':'e93e6b6e-0ec8-4bda-b575-d0168ba3a561'});
            }else if(comanda.Estado === 'Prod/Prov'){
                upEstadoComanda({'ComandaId': comanda.ComandaId, 'EstadoComandaId': prodprov, 'EstadoPedidoId':'e93e6b6e-0ec8-4bda-b575-d0168ba3a561'});
            }
        }
    //Actualizamos los estados de las comandas
    const upEstadoComanda = async (comanda) => {
        await fetch(`${global.config.appConfig.url.dev}POP_Comanda/${comanda.ComandaId}?estadoComanda=${comanda.EstadoComandaId}&estadoPedido=${comanda.EstadoPedidoId}`, {
            method: 'PUT',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify(comanda),
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}POP_Comanda?local=${localUser}&date=${Moment(window.localStorage.getItem('today')).format('YYYY-MM-DD')}&sort=${sort}`)
                .then(response => response.json())
                .then(res => {
                    return setComandas(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
    }
    useEffect(() => {
        getRoles();
        getEstados();
        if (window.localStorage.getItem('today')) {
            getComandas(Moment(window.localStorage.getItem('today')).format('YYYY-MM-DD'), sort);
        } else {
            window.localStorage.setItem('today', Moment(new Date().getTime()).format('YYYY-MM-DD'));
            getComandas(date, sort);
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
                <TableRow >
                    <TableCell align="left">{Moment(row.FechaHoraLimProdProv).format('LT')}</TableCell>
                    <TableCell align="left">{row.NroComanda}</TableCell>
                    <TableCell align="left">{row.Nombre}</TableCell>
                    <TableCell align="left">{row.Zona}</TableCell>
                    <TableCell align="left">{row.Cantidad} {row.Abreviatura}</TableCell>
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
                                                    'ComandaId': row.ComandaId,
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
                                <Link style={{ color: '#000' }} href={`/pedidosComandas/${row.ComandaId}`}>Ver pedidos</Link>
                            </Grid>
                        </Grid>
                        <Box borderBottom={2} />
                    </TableCell>
                </TableRow>

            </Fragment >
        );
    }
    return (
        <Card variant="outlined">
            <CardContent>
                <Grid container spacing={0}>
                    <Grid item xs={10} md={10} lg={10}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link color="inherit" href="#" >Comandas</Link>
                            {false ? (
                                <Link color="inherit" href="#" >Categorías</Link>
                            ) : (
                                    <Link color="inherit" href="#" ></Link>
                                )}
                        </Breadcrumbs>
                    </Grid>
                    <Grid item xs={8} md={6} lg={6}>
                        <CardContent>
                            <Typography>Filtrar:</Typography>
                            <TextField
                                onChange={(event) => changeDateComanda(event.target.value)}
                                id="datetime-local"
                                label="Calendario / Hoy"
                                type="date"
                                variant="outlined"
                                defaultValue={Moment(window.localStorage.getItem('today')).format('YYYY-MM-DD') ? Moment(window.localStorage.getItem('today')).format('YYYY-MM-DD') : date}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                        </CardContent>
                    </Grid>
                    <Grid item xs={4} md={6} lg={6}>
                        <CardContent>
                            <Typography>Ordenar por:
                                {/* <Chip label="Zona/Item/Cant." /> */}
                            </Typography>
                            <Select
                                required
                                margin="normal"
                                variant="outlined"
                                labelId="sort"
                                id="sort"
                                open={openSort}
                                onClose={() => setOpenSort(false)}
                                onOpen={() => setOpenSort(true)}
                                defaultValue={sort}
                                onChange={(event) => changeSortComanda(event.target.value)}
                            >
                                <MenuItem selected value={1}>Comanda</MenuItem>
                                <MenuItem value={2}>Zona</MenuItem>
                                <MenuItem value={3}>Item</MenuItem>
                                <MenuItem value={4}>Cantidad</MenuItem>
                            </Select>
                        </CardContent>
                    </Grid>

                    <Grid container spacing={0}>
                        <Grid item xs={12} md={10} lg={8}>
                            {(Object.keys(comandas).length !== 0) ?
                                <TableContainer component={Paper}>
                                    <Table size="small" aria-label="collapsible table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">Hora</TableCell>
                                                <TableCell width={80} align="right">Nro</TableCell>
                                                <TableCell align="right">Item</TableCell>
                                                <TableCell align="right">Zona</TableCell>
                                                <TableCell width={100} align="right">Cantidad</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {comandas.map((key, item) => (
                                                <Row key={comandas[item].ComandaId} row={comandas[item]} />
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
                                    style={{ minHeight: "52vh" }}
                                >
                                    <Typography>No hay comandas establecidas para esta fecha</Typography>
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
                <DialogTitle id="alert-dialog-title">{`Realizar comanda parcial`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <FormControl margin="normal" fullWidth variant="filled">
                            <TextField
                                id="outlined-email-input-required"
                                label="Cantidad disponible"
                                type="number"
                                name="Nombre"
                                autoComplete="Nombre"
                                margin="normal"
                                variant="outlined"
                            />
                        </FormControl>
                        <FormControl margin="normal" fullWidth variant="filled">
                            <TextField
                                id="outlined-email-input-required"
                                label="Cantidad restante"
                                type="number"
                                name="Nombre"
                                autoComplete="Nombre"
                                margin="normal"
                                variant="outlined"
                            />
                        </FormControl>
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
                    //onClick={() => toggleEstado(comandaId)}
                    >
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
export default Comada;