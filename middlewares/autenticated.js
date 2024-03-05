var jwt = require('jwt-simple'); //importamos el servicio
var moment = require('moment');
var secret= 'secret_key';

exports.Auth=function(req,res,next){
    if(!req.headers.authorization){
        return res.status(403).send({message: 'falta llave de autorizacion'})
    }
    var token=req.headers.authorization.replace(/['"]+/g,'');
    try {
        var payload =jwt.decode(token,secret);
        if(payload.exp <= moment().unix()){
            return res,status(401).send({message: 'la sesion a caducado'})
        }
    } catch (error) {
        console.log(error);
        return res,status(404).send({message: 'llave no valida'})


        
    }
    req.user=payload;
    next();
}