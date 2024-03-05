var express = require('express')
var api=express.Router();
var albumController = require('../controllers/album');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'uploads/album'});
var md_auth=require('../middlewares/autenticated');


api.get('/album',albumController.list);
api.post('/album',albumController.save);
api.delete('/album/:id',albumController.delete);
api.put('/album/:id',albumController.update);
api.post('/album/:id',[md_auth.Auth,md_upload],albumController.uploadimage);
api.get('/album/image/:image',albumController.getImage);
api.delete('/album/image/:id',albumController.delImage);
api.get('/:id/song', albumController.getSongsById);

module.exports = api;