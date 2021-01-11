const {gql} = require('apollo-server');

//Schema
const typeDefs = gql`
    #Type para usuarios
    type Usuario{
        id: ID
        nombre: String
        apellido: String
        email: String
        estatus: String
        nivel: String
    }
    
    type Token{
        token: String
    }

    #Type para Almacén
    type Almacen{
        id: ID
        nombreMaterial: String
        principal: Int
        subAlmacen: Int
        codigoAlmacen: String
        creado: String
    }

    #Input para Usuario
    input UsuarioInput {
        nombre: String!
        apellido: String!
        email: String!
        password: String!
    }

    #Input para autenticar
    input AutenticarInput{
        email: String!
        password: String!
    }

    #Input para Almacén
    input AlmacenInput {
        nombreMaterial: String!
        principal: Int!
        subAlmacen: Int!
        codigoAlmacen: String!
    }
    
    type Query {
        obtenerUsuario: Usuario
        obtenerUsuarios: [Usuario]
        obtenerUsuarioId(id: ID!): Usuario

        #Obtenemos el arreglo de almacén
        obtenerAlmacen: [Almacen]

        #Busquedas avanzadas
        buscarMaterial(texto: String!): [Almacen]

    }

    type Mutation {
        #Acciones de usuario
        nuevoUsuario (input: UsuarioInput): Usuario
        autenticarUsuario (input: AutenticarInput): Token
        actualizarUsuario (id: ID!, input: UsuarioInput): Usuario
        eliminarUsuario (id:ID!): Usuario

        #Acciones de almacén
        nuevoAlmacen(input: AlmacenInput): Almacen
        actualizarAlmacen(id: ID!, input: AlmacenInput): Almacen
        eliminarAlmacen(id: ID!, input: AlmacenInput): Almacen
    }
`;

module.exports = typeDefs;