const { ApolloServer } = require('apollo-server');
const typeDefs = require ('./db/schema');
const resolvers = require('./db/resolvers');
const conectarDB = require('./config/db');
const jwt = require('jsonwebtoken');

//Conexión a la base de datos
conectarDB();

//Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) =>{
        const token = req.headers['authorization'] || '';

        if(token){
            try {
                const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_WORD);
                //console.log(usuario);
                return {
                    usuario
                }
            } catch (error) {
                throw new Error('Hubo un error');
            }
        }
    }
});


//Arranca el server
server.listen().then(({url}) => {
    console.log(`Servidor listo en la URL: ${url}`);
});