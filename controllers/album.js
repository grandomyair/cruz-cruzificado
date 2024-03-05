const conn = require('mysql2');
var fs = require('fs'); //manejo de archivos
var path = require('path'); //es para rutas o ubicaciones

const conexion = conn.createConnection({
    host:'localhost',
    user:'root',
    password:'mysql',
    database:'mydb'
});

module.exports={
    save(req,res){
        
        data = req.body;
        title= data.title
        description = data.description
        year = data.year
        artist_id = data.artist_id
        var sql = 'INSERT INTO album (title, description, year, artist_id) VALUES ("'+title+'","'+description+'","'+year+'","'+artist_id+'")';
        conexion.query(sql, data, function(err,results,fields){
            if(err){
                console.log(err);
            }else{
                console.log(results);
                res.status(200).send({message: "Álbum agregado correctamente."})
            }
            console.log(results)
        })
        
    },
    getSongsById(req, res) {
        const album_Id = req.params.id;
        const sql = 'SELECT * FROM song WHERE album_id = ?';
        conexion.query(sql, [album_Id], function(err, results, fields) {
            if (err) {
                console.log(err);
                res.status(500).send({ message: 'Error al obtener las canciones del álbum' });
            } else {
                if (results.length > 0) {
                    res.status(200).send({ songs: results });
                } else {
                    res.status(404).send({ message: 'No se encontraron canciones para este álbum' });
                }
            }
        });
    },
    list(req,res){
        conexion.query(
            'SELECT * FROM album',
            function (err, results, fields){
                if(results){
                    res.status(200).send({results})
                }else{
                    res.status(500).send({message:'Error: intentalo más tarde'})
                }
            }
        );
    },
    delete(req,res){
        id = req.params.id;
        conexion.query('DELETE FROM album WHERE id = '+id,function(err,results,fields){
            if(!err){
                if(results.affectedRows!=0){
                    res.status(200).send({message:"Registro eliminado"})
                }else{
                    res.status(200).send({message: "No se elimino nada"})
                }
            }else{
                console.log(err);
                res.status(500).send({message:"Intentalo más tarde"})
            }
        })
    },
    update(req,res){
        data = req.body;
       title = data.title;
       description = data.description;
       year = data.year;
       artist_id = data.artist_id;
        console.log(data);
        conexion.query('UPDATE album SET (name,username,password,image) VALUES ("'+title+'","'+description+'","'+year+'","'+artist_id+'")')
    },
   update(req, res) {
        console.log(req.body)
        id = req.params.id;
        data = req.body;
        var sql = 'UPDATE album SET ? WHERE id=?';
        if (data.password) {
            bcrypt.hash(data.password, null, null, function (err, hash) {
                if (!err) {
                    data.password = hash;
                    conexion.query(sql, [data, id],
                        function (err, results, fields) {
                            console.log(results);
                            if(results.length == 1){

                            }else{
                                res.status(200).send({message: 'datos correctos'})
                            }
                            if (!err) {
                                console.log(results);
                            } else {
                                console.log(err);
                            }
                        });
                }
            })
        } else {
            conexion.query(sql, [data, id],
                function (err, results, fields) {
                    if (!err) {
                        console.log(results);
                    } else {
                        console.log(err);
                    }
                });
        }


    },
    uploadimage(req,res){
        var id = req.params.id;
        var file ='sin imagen...';
        console.log(req.files.image.path)
        if(req.files){
            var file_path = req.files.image.path;
            var file_split= file_path.split('\\');
            var file_name = file_split[2];
            var ext = file_name.split('\.');
            var file_ext = ext[1];
            if(file_ext=='jpg' || file_ext=='gif' || file_ext=='png' || file_ext=='jpeg'){
                conexion.query('UPDATE album SET image="'+file_name+'" WHERE id='+id,
                function(err,results,fields){
                    if(!err){
                        if(results.affectedRows!=0){
                            res.status(200).send({message: 'imagen acualizado'})
                        }else{
                            res.status(200).send({message: 'error al actualizar'})
                        }
                    }else{
                        console.log(err);
                        res.status(200).send({message: 'imagen no valido'})
                    }
                    

                })

            }
        }
    },
    getImage(req,res){
        var image=req.params.image;
        var path_file='./uploads/album/'+image;
        console.log(path_file)
        if(fs.existsSync(path_file)){
            res.sendfile(path.resolve(path_file))
        }else{
            res.status(404).send({message: 'no existe el archivo'})
        }
    },
    delImage(req,res){
        id = req.params.id;
        var sql = "select image from album WHERE id="+id;
        conexion.query(sql,function(err,results,fields){
            if(!err){
                if (results.length !=0) {
                    if(results[0].image != null) {
                        var path_file = './uploads/album/' +results[0].image;
                        try {
                            fs.unlinkSync(path_file);
                            res.status(200).send({message: "imagen eliminada"})
                        } catch (error) {
                            console.log(error)
                            res.status(200).send({message: "no se pudo eliminar, intenta mas tarde"})
                            
                        }
                    }else{
                        res.status(404).send({message: "no encontrada"})
                        
                    }
                } else{
                    res.status(404).send({message: "no encontrada"})
    
                }
            }
        })
    
    }
    }
    