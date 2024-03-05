const { duration } = require('moment');
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
        name = data.name
        description = data.description
        var sql = 'INSERT INTO artist (name, description) VALUES ("'+name+'","'+description+'")';
        conexion.query(sql, data, function(err,results,fields){
            if(err){
                console.log(err);
            }else{
                console.log(results);
                res.status(200).send({message: "Artista agregado correctamente."})
            }
            console.log(results)
        })
        
    },
    getAlbumsById(req, res) {
        const artist_Id = req.params.id;
        const sql = 'SELECT * FROM album WHERE artist_id = ?';
        conexion.query(sql, [artist_Id], (err, results, fields) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: 'Error al obtener los álbumes del artista.' });
            } else {
                if (results.length > 0) {
                    res.status(200).send({ albums: results });
                } else {
                    res.status(404).send({ message: 'No se encontraron álbumes para este artista.' });
                }
            }
        });
    },
    list(req,res){
        conexion.query(
            'SELECT * FROM artist',
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
        conexion.query('DELETE FROM artist WHERE id = '+id,function(err,results,fields){
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
        console.log(req.body)
        data = req.body;
        name = data.name;
        description = data.description;
        console.log(data);
        conexion.query('UPDATE artist SET (name,description,image) VALUES ("'+name+'","'+description+'")')
    },
   update(req, res) {
        id = req.params.id;
        data = req.body;
        var sql = 'UPDATE artist SET ? WHERE id=?';       
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
            conexion.query('UPDATE artist SET image="'+file_name+'" WHERE id='+id,
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
            conexion.query('UPDATE artist SET image="'+file_name+'" WHERE id='+id,
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
    var path_file='./uploads/artist/'+image;
    console.log(path_file)
    if(fs.existsSync(path_file)){
        res.sendfile(path.resolve(path_file))
    }else{
        res.status(404).send({message: 'no existe el archivo'})
    }
},
delImage(req,res){
    id = req.params.id;
    var sql = "select image from artist WHERE id="+id;
    conexion.query(sql,function(err,results,fields){
        if(!err){
            if (results.length !=0) {
                if(results[0].image != null) {
                    var path_file = './uploads/artist/' +results[0].image;
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
