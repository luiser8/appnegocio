import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Home from '../components/home/Home';
import Login from '../components/sesion/Login';
import Error from './Error';
import Locales from '../components/local/Locales';
import Detalles from '../components/pedidos/Detalles';
import Categorias from '../components/categoria/Categorias';
import Zona from '../components/zona/Zonas';
import Calendarios from '../components/calendario/Calendarios';
import Productos from '../components/productos/Productos';
import Ofertas from '../components/oferta/Ofertas';
import PedidosPorComada from '../components/pedidos/PedidosPorComanda';
import DetallesPedidosPorComada from '../components/pedidos/DetallesPedidosPorComada';
import Pedidos from '../components/pedidos/Pedidos';
import Precios from '../components/precios/Precios';
import ViewPolygon from '../components/zona/ViewPolygon';

var userid = window.localStorage.getItem('UsuarioId');
var rol = window.localStorage.getItem('Rol');

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route
                path="/categorias"
                exact
                render={() => {
                    if(userid){
                        return <Categorias user={userid}/>
                    }else{
                        return <Redirect from="/categorias" to="/" />
                    }
                }}
            />  
            <Route
                path="/precios"
                exact
                render={() => {
                    if(userid){
                        return <Precios user={userid}/>
                    }else{
                        return <Redirect from="/precios" to="/" />
                    }
                }}
            /> 
            <Route
                path="/calendarios"
                exact
                render={() => {
                    if(userid){
                        return <Calendarios user={userid}/>
                    }else{
                        return <Redirect from="/calendarios" to="/" />
                    }
                }}
            />  
            <Route
                path="/productos"
                exact
                render={() => {
                    if(userid){
                        return <Productos user={userid}/>
                    }else{
                        return <Redirect from="/productos" to="/" />
                    }
                }}
            />  
            <Route
                path="/ofertas"
                exact
                render={() => {
                    if(userid){
                        return <Ofertas user={userid}/>
                    }else{
                        return <Redirect from="/ofertas" to="/" />
                    }
                }}
            />  
            <Route
                path="/zonas"
                exact
                render={() => {
                    if(userid){
                        return <Zona user={userid}/>
                    }else{
                        return <Redirect from="/zonas" to="/" />
                    }
                }}
            />  
            <Route
                path="/zonas/:id"
                exact
                render={(props) => {
                    if(userid){
                        return <ViewPolygon {...props}/>
                    }else{
                        return <Redirect from="/zonas/:id" to="/zonas" />
                    }
                }}
            /> 
            <Route
                path="/locales"
                exact
                render={() => {
                    if(userid){
                        return <Locales user={userid}/>
                    }else{
                        return <Redirect from="/locales" to="/" />
                    }
                }}
            /> 
            <Route
                path="/pedidos"
                exact
                render={(props) => {
                    if(userid){
                        return <Pedidos {...props}/>
                    }else{
                        return <Redirect from="/pedidos" to="/" />
                    }
                }}
            />  
            <Route
                path="/pedidos/detalles/:pedido"
                exact
                render={(props) => {
                    if(userid){
                        return <Detalles {...props}/>
                    }else{
                        return <Redirect from="/pedidos/detalles/:pedido" to="/" />
                    }
                }}
            /> 
            <Route
                path="/pedidosComandas/:id"
                exact
                render={(props) => {
                    if(userid){
                        return <PedidosPorComada {...props}/>
                    }else{
                        return <Redirect from="/pedidosComandas/:id" to="/" />
                    }
                }}
            />  
            <Route
                path="/pedidosComandas/detalles/:pedido/:producto/:comanda"
                exact
                render={(props) => {
                    if(userid){
                        return <DetallesPedidosPorComada {...props}/>
                    }else{
                        return <Redirect from="/pedidosComandas/detalles/:pedido/:producto/:comanda" to="/" />
                    }
                }}
            /> 
            <Route 
                path='/' 
                render={() => {
                    if(!userid){
                        return <Login/>
                    }else if(userid){
                        return <Home user={userid}/>
                    }else{
                        return <Redirect from="/" to="/login"/>
                    }
                }}
            />

            <Route component={Error}/>
        </Switch>
    </BrowserRouter>
);

export default Routes;
