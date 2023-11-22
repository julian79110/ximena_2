const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const jwt =require('jsonwebtoken')

//campos de la tabla y sus restricciones 
const userSchema = new mongoose.Schema(
    {
        nombre:{
            type:String,
        },
        apellido:{
            type:String,
        },
        tipoDocumento:{
            type:String,
        },
        numeroDocumento:{
            type:String,
            unique:true
        },
        correo:{
            type:String,
        },
        contraseña:{
            type:String,
            min:6
        },
        rol:{
            type:String,
            enum:[
                "paciente",
                "medico"
            ]
        },
    }
)

//antes de guardar
userSchema.pre('save', async function(next){
    //crear la sal
    const sal = await bcryptjs.genSalt(10)
    //encriptar la contraseña
    this.contraseña= await bcryptjs.
                   hash(this.contraseña, sal)
})

//token de la contraseña que el usuario registro, para inciar sesion
userSchema.methods.ObtenerTokenJWT = function(){
    const JWT_SECRET_KEY = "HOLAA"
    return jwt.sign({
        id:this._id,
        correo: this.correo,
        contraseña: this.contraseña,
        rol: this.rol
    },
        JWT_SECRET_KEY,
        {
            expiresIn: Date.now() +10000
        }
    )
}

userSchema.methods.comparacionContrasena = async function(contraseña){
    return await bcryptjs.compare(contraseña, this.contraseña)
}
const User = module.exports = mongoose.model('User',userSchema)
