import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import '../utils/Config';

const Splascreen = ({ height }) => {
    var [logo] = useState(`${global.config.appConfig.images.local}/PandemikLogo.png`);
    return (
            <Grid
              container
              spacing={0}
              alignItems="center"
              justify="center"
              style={{ minHeight: height }}
            >
              <img src={logo}/>
            </Grid>
    );
}

export default Splascreen;