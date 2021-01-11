const Usuario = require('../models/Usuario');
const Almacen = require('../models/Almacen');
const bcryptjs = require('bcryptjs');
require('dotenv').config({path: 'variables.env'});
const jwt = require('jsonwebtoken');

//Creamos el token
const crearToken = (usuario, secret_word, expiresIn) => {
    //Constante con valores a retornar en el token
    const {id, email, nombre, apellido} = usuario;
    
    //Retornamos los datos indispensables en el token
    return jwt.sign({id, email, nombre, apellido}, secret_word, {expiresIn});
}

//Resolvers
const resolvers = {
    Query: {
        //Función para obtener el usuario y tokenizar
        obtenerUsuario: async (_, {}, ctx) => {
            return ctx.usuario;
        },
        obtenerUsuarios: async () =>{
            try {
                const usuarios = await Usuario.find({});

                return usuarios;
            } catch (error) {
                console.log(error);
                throw new Error('Ningun usuario registrado');
            }
        },
        obtenerUsuarioId: async (_, {id}) => {
            //Validamos que el usuario exista
            const usuario = await Usuario.findById(id);

            if(!usuario){
                throw new Error('El usuario no existe');
            }

            //Validamos que se asigne la busqueda deseada
            /*if(usuario.maleta.toString() !== ctx.usuario.id){
                throw new Error('No cuenta con los permisos para esta sección');
            }*/

            return usuario;
        },
        obtenerAlmacen: async () => {
            try {
                const almacen = await Almacen.find({});

                return almacen;
            } catch (error) {
                console.log(error);
            }
        },
        buscarMaterial: async(_, { texto }) => {
            const almacen = await Almacen.find({ $text : {$search: texto}}).limit(10);

            return almacen;
        }
    },
    Mutation: {
        nuevoUsuario: async (_, {input}) => {
            //Constantes para extraer el email y el password al input
            const {email, password} = input;
            
            //Constante para buscar al usuario actual
            const existeUsuario = await Usuario.findOne({email});
            
            //Validamos que el usuario exista
            if(existeUsuario){
                throw new Error("El usuario ya se encuentra registrado");
            }

            //Creamos el salt y su regla de 10 piezas
            const salt = await bcryptjs.genSalt(10);

            //Hasheamos el password
            input.password = await bcryptjs.hash(password, salt);

            try {
                //Constante para crear el nuevo usuario
                const usuario = new Usuario(input);
                
                //Guardamos el usuario
                usuario.save();
                
                //Retornamos el valor del usuario
                return usuario;
            } catch (error) {
                console.log(error);
            }
        },
        nuevoAlmacen: async (_, {input}) => {
            const {codigoAlmacen} = input 

            const existeAlmacen = await Almacen.findOne({codigoAlmacen});
            if(existeAlmacen){
                throw new Error('El material que desea ingresar a almacén ya está registrado');
            }

            //Variable para alojar los datos insertados por el usuario
            const almacen = new Almacen(input);

            //Registramos en bases de datos
            const resultado =  await almacen.save();

            //retornamos lo registrado
            return resultado;
        },
        actualizarUsuario: async (_, {id, input}, ctx)=>{
            //Validamos si el material existe
            let usuario = await Usuario.findById(id);

            if(!usuario){
                throw new Error('El usuario buscado no existe');
            }

            if(usuario.id.toString() !== ctx.usuario.id){
                throw new Error('No cuenta con un nivel de administrador');
            }
            usuario = await Usuario.findOneAndUpdate({_id: id}, input, {new: true});

            return usuario;
        },
        actualizarAlmacen: async (_, {id, input})=>{
            //Validamos si el material existe
            let materialAlmacen = await Almacen.findById(id);

            if(!materialAlmacen){
                throw new Error('El material buscado no existe');
            }

            materialAlmacen = await Almacen.findByIdAndUpdate({_id: id}, input, {new: true});

            return materialAlmacen;
        },
        eliminarUsuario: async (_, {id}, ctx) => {
            //Verificar que el usuario exista
            let usuario = await Usuario.findById(id);

            if(!usuario){
                throw new Error('Usuario no existente')
            }

            if(usuario.id.toString() !== ctx.usuario.id){
                throw new Error('No cuenta con un nivel de administrador');
            }

            //Eliminamos al usuario
            await Usuario.findByIdAndDelete({_id: id});
            return "Usuario eliminado exitosamente";
        },
        eliminarAlmacen: async (_, {id})=>{
            //Validamos si el material existe
            let materialAlmacen = await Almacen.findById(id);

            if(!materialAlmacen){
                throw new Error('El material buscado no existe');
            }

            await Almacen.findByIdAndDelete({_id: id});

            return "Material eliminado";
        },
        autenticarUsuario: async (_, {input}) =>{
            //Creamos la constante del destructuring
            const {email, password} = input;

            //Constante para extraer el usuario
            const existeUsuario = await Usuario.findOne({email});

            //Validamos si el usuario existe
            if(!existeUsuario){
                throw new Error('Usuario o contraseña no son válidos');
            }

            //Variable para password correcto
            const pwdCorrecto = await bcryptjs.compare(password, existeUsuario.password);

            //Validamos si el password es correcto
            if(!pwdCorrecto){
                throw new Error('Usuario o contraseña no válidos');
            }

            //Retornamos valores al token para su creación
            return{
                token: crearToken(existeUsuario, process.env.SECRET_WORD, '1h')
            }

        }
    }
}

module.exports = resolvers;