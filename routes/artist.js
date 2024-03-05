var express = require('express')
var api=express.Router();
var artistController = require('../controllers/artist');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'uploads/artist'});
var md_auth=require('../middlewares/autenticated');


api.get('/artist',artistController.list);
api.post('/artist',artistController.save);
api.delete('/artist/:id',artistController.delete);
api.put('/artist/:id',artistController.update);
api.post('/artist/:id',[md_auth.Auth,md_upload],artistController.uploadimage);
api.get('/artist/image/:image',artistController.getImage);
api.delete('/artist/image/:id',artistController.delImage);
api.get('/:id/album', artistController.getAlbumsById);



module.exports = api;