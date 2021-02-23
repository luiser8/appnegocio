import React, { useState, useEffect, Fragment, useContext } from 'react';
import clsx from 'clsx';
import { AppBar, Grid, Link, Button, IconButton, Toolbar, Typography, MenuItem, Menu, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import StorefrontIcon from '@material-ui/icons/Storefront';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import EventNote from '@material-ui/icons/EventNote';
import Room from '@material-ui/icons/Room';
import People from '@material-ui/icons/People';
import LocalShipping from '@material-ui/icons/LocalShipping';
import CropFree from '@material-ui/icons/CropFree';
import Forum from '@material-ui/icons/Forum';
import ShopTwo from '@material-ui/icons/ShopTwo';
import LocalOffer from '@material-ui/icons/LocalOffer';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import Shop from '@material-ui/icons/Shop';
import { Money, MoneyTwoTone } from '@material-ui/icons';
import Home from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import Routes from '../utils/Routes';
import '../utils/Config';
import Logout from '../components/sesion/Logout';

const Header = () => {
    var [logo] = useState(`${global.config.appConfig.images.local}/PandemikLogo_S.png`);
    var [is_session] = useState(window.localStorage.getItem('UsuarioId'));
    var [user] = useState(`${window.localStorage.getItem('Nombres')} ${window.localStorage.getItem('Apellidos')} - ${window.localStorage.getItem('Local')}`);
    var [rol] = useState(window.localStorage.getItem('Rol'));
    var [current_path] = useState(window.location.pathname);
    var [path, setPath] = useState('');
    var [openDrawer, setOpenDrawer] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const classes = useStyles();
    var { close } = Logout();

    useEffect(() => {
        switch (current_path) {
            case '/':
                setPath('Pandemik');
                break;
            case '/locales':
                setPath('Locales');
                break;
            case '/signin':
                setPath('Registro');
                break;
            default:
                setPath('Nada')
        }
    }, [])

    return (
        <Fragment>
            {is_session ? (
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" onClick={() => setOpenDrawer(true)} color="inherit" aria-label="menu">
                            <MenuIcon  />
                        </IconButton>
                            {openDrawer ? (
                                <Drawer
                                    className={classes.drawer}
                                    variant="persistent"
                                    anchor="left"
                                    open={openDrawer}
                                >
                                    
                                        <IconButton onClick={() => setOpenDrawer(false)}>
                                            {openDrawer ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                                        </IconButton>
                                    
                                    <Divider />
                                    <List>
                                        <Divider />
                                        <div className={classes.division}>
                                            <Typography>Ventas</Typography>
                                        </div>
                                        <Divider />
                                        <ListItem>
                                            <ListItemIcon><LocalShipping /></ListItemIcon>
                                            <Link color="inherit" href="/" >
                                                <ListItemText primary="Comandas" color="secondary" />
                                            </Link>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><ShopTwo /></ListItemIcon>
                                            <Link color="inherit" href="/pedidos" >
                                                <ListItemText primary="Pedidos" color="secondary" />
                                            </Link>
                                        </ListItem>

                                        <ListItem>
                                            <ListItemIcon><People /></ListItemIcon>
                                            <Link color="inherit" href="#" >
                                                <ListItemText primary="Clientes" color="secondary" />
                                            </Link>
                                        </ListItem>
                                        <Divider />
                                        <div className={classes.division}>
                                            <Typography>Negocio</Typography>
                                        </div>
                                        <Divider />
                                        <ListItem>
                                            <ListItemIcon><FormatListBulletedIcon /></ListItemIcon>
                                            <Link color="inherit" href="/categorias" >
                                                <ListItemText primary="Categorias" color="secondary" />
                                            </Link>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><Shop /></ListItemIcon>
                                            <Link color="inherit" href="/productos" >
                                                <ListItemText primary="Productos" color="secondary" />
                                            </Link>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><Money /></ListItemIcon>
                                            <Link color="inherit" href="/precios" >
                                                <ListItemText primary="Precios" color="secondary" />
                                            </Link>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><Room /></ListItemIcon>
                                            <Link color="inherit" href="/zonas" >
                                                <ListItemText primary="Zonas" color="secondary" />
                                            </Link>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><EventNote /></ListItemIcon>
                                            <Link color="inherit" href="/calendarios" >
                                                <ListItemText primary="Calendarios" color="secondary" />
                                            </Link>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><LocalOffer /></ListItemIcon>
                                            <Link color="inherit" href="/ofertas" >
                                                <ListItemText primary="Ofertas" color="secondary" />
                                            </Link>
                                        </ListItem>
                                        {/* <ListItem>
                                            <ListItemIcon><StorefrontIcon /></ListItemIcon>
                                            <Link color="inherit" href="/locales" >
                                                <ListItemText primary="Locales" color="secondary" />
                                            </Link>
                                        </ListItem> */}
                                        <Divider />
                                        <div className={classes.division}>
                                            <Typography>Promoción</Typography>
                                        </div>
                                        <Divider />
                                        <ListItem>
                                            <ListItemIcon><CropFree /></ListItemIcon>
                                            <Link color="inherit" href="#" >
                                                <ListItemText primary="Generar Link" color="secondary" />
                                            </Link>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><Forum /></ListItemIcon>
                                            <Link color="inherit" href="#" >
                                                <ListItemText primary="Comunicación" color="secondary" />
                                            </Link>
                                        </ListItem>
                                        <Divider />
                                        <div className={classes.division}>
                                            <Typography>Resultado</Typography>
                                        </div>
                                        <Divider />
                                        <ListItem>
                                            <ListItemIcon><LibraryBooks /></ListItemIcon>
                                            <Link color="inherit" href="#" >
                                                <ListItemText primary="Reportes" color="secondary" />
                                            </Link>
                                        </ListItem>
                                        <Divider />
                                        <div style={{textAlign:"center"}}>
                                            <Link color="inherit" href="#" >
                                                <ListItemText primary="Cambiar Local" color="secondary" />
                                            </Link>
                                            <Link color="inherit" href="#" onClick={async () => await close(current_path)}>
                                                <ListItemText primary="Cerrar Sesión" color="secondary" />
                                            </Link> 
                                        </div>
                                        
                                    </List>

                                </Drawer>
                            ) : (
                                    <></>
                                )}
                        
                        {(is_session) ?
                            <div style={{ width: "auto", margin: "0 auto", marginTop: 10 }}>
                                <img src={logo} />
                            </div>
                            :
                            <></>
                        }
                    </Toolbar>
                </AppBar>
            ) : (
                    <></>
                )}

            <Routes />
            {is_session ? (
                <AppBar position="fixed" style={{ flexShrink: 0, top:'auto', bottom:0 }}>
                    <Typography align="center" style={{ color: '#757575' }}>{user}</Typography>
                </AppBar>
            ) : (
                    <></>
                )}
        </Fragment>
    );
}
const drawerWidth = 140;
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    division: {
        color: '#ffc107',
        fontWeight: 'bold',
        textAlign:'center',
    }
}));

export default Header;