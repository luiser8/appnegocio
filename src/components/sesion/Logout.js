const Logout = () => {
    const close = async (path) => {
        window.localStorage.removeItem('UsuarioId');
        window.localStorage.removeItem('Nombres');
        window.localStorage.removeItem('Apellidos');
        window.localStorage.removeItem('Rol');
        window.localStorage.removeItem('RolId');
        window.localStorage.removeItem('UsuarioLocalId');
        window.localStorage.removeItem('Local');
        window.localStorage.removeItem('CadenaId');
        window.location.assign(path);
    }
    return {
        close,
    }
}

export default Logout;