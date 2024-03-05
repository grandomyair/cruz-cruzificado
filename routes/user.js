var express = require('express')
var api = express.Router();
var userController = require('../controllers/user');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'uploads/user'});
var md_auth=require('../middlewares/autenticated');

api.get('/user',[md_auth.Auth],userController.list);
api.post('/user',userController.save);
api.delete('/user/:id',[md_auth.Auth],userController.delete);
api.put('/user/:id',[md_auth.Auth],userController.update);
api.post('/login',userController.login);    
api.post('/user/:id',[md_auth.Auth,md_upload],userController.uploadimage);
api.get('/user/image/:image',userController.getImage);
api.delete('/user/image/:id',userController.delImage);
api.get('/user',[md_auth.Auth],userController.userbyId);

module.exports = api;