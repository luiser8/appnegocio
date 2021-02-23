import React, { useEffect, useState, Fragment } from 'react';
import '../../utils/Config';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Categorias from '../categoria/Categorias';

import {
    Breadcrumbs,
    Link,
    Card,
    CardContent,
    Paper,
    Typography,
    ListItem,
    List,
    Chip,
} from '@material-ui/core';
import Comanda from '../comanda/Comanda';

const Home = ({ user }) => {
    var [locales, setLocales] = useState([]);
    var [cat, setCat] = useState();
    var classes = useStyles();
    var [messages, setMessages] = useState('');

    return (
        <Comanda />
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
    },
	h1: {
    color:'#ffc107', margin:0, fontSize:50
  },
  small:{
    margin:0, marginTop: -10, float:'right'
  }
}));

export default Home;