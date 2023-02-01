const data = ( port, mode ) => {
    return {
        name: `PORT = ${port}`,
        script: 'app.js',
        instances: 1,
        exec_mode: mode,
        args: `-p ${ port }`,
        autorestart: true,
        watch: [ 'enviroment/.env', 'routes', 'sockets', 'database', 'models', 'middlewares', 'utils' ],
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }
}

const dataClusters = () => {
    const apps = [];
    for( let i = 0; i < 5; i++ ) {
        if( i === 0 ) apps.push( data( 8080, 'fork' ) )
        if( i === 1 ) apps.push( data( 8082, 'cluster' ) )
        if( i === 2 ) apps.push( data( 8083, 'cluster' ) )
        if( i === 3 ) apps.push( data( 8084, 'cluster' ) )
        if( i === 4 ) apps.push( data( 8085, 'cluster' ) )
    }
    return apps
}

module.exports = {
    apps: dataClusters()
};