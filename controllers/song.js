const conn = require('mysql2');
var fs = require('fs');
var path = require('path');

const conexion = conn.createConnection({
    host:'localhost',
    user:'root',
    password:'mysql',
    database:'mydb'
});

module.exports={
    save(req,res){
        
        data = req.body;
        console.log(data)
        name= data.name
        number = data.number
        duration = data.duration
        file = data.file
        album_id = data.album_id
        var sql = 'INSERT INTO song (name,number,duration,file,album_id) VALUES ("'+name+'","'+number+'","'+duration+'","'+file+'","'+album_id+'")';
        conexion.query(sql, data, function(err,results,fields){
            if(err){
                console.log(err);
            }else{
                console.log(results);
                res.status(200).send({message: "Canción agregada correctamente."})
            }
            console.log(results)
        })
        
    },
    list(req,res){
        conexion.query(
            'SELECT * FROM song',
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
        conexion.query('DELETE FROM song WHERE id = '+id,function(err,results,fields){
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
        name = data.name;
        number = data.number
        duration = data.duration
        file = data.file
        album_id = data.album_id
        console.log(data);
        conexion.query('UPDATE song SET (name,number,duration,file,album_id) VALUES ("'+name+'","'+number+'","'+duration+'","'+file+'","'+album_id+'")')
    },
   update(req, res) {
        id = req.params.id;
        data = req.body;
        var sql = 'UPDATE song SET ? WHERE id=?';       
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
   uploadsong(req,res){
    var id = req.params.id;
    var file ='sin file...';
    console.log(req.files.file.path)
    if(req.files){
        var file_path = req.files.file.path;
        var file_split= file_path.split('\\');
        var file_name = file_split[2];
        var ext = file_name.split('\.');
        var file_ext = ext[1];
        if(file_ext=='jpg' || file_ext=='mp3' || file_ext=='mp4' || file_ext=='mw'){
            conexion.query('UPDATE song SET file="'+file_name+'" WHERE id='+id,
            function(err,results,fields){
                if(!err){
                    if(results.affectedRows!=0){
                        res.status(200).send({message: 'file acualizado'})
                    }else{
                        res.status(200).send({message: 'error al actualizar'})
                    }
                }else{
                    console.log(err);
                    res.status(200).send({message: 'file no valido'})
                }
                

            })

        }
    }
},
getsong(req,res){
    var file=req.params.file;
    var path_file='./uploads/song/'+file;
    console.log(path_file)
    if(fs.existsSync(path_file)){
        res.sendfile(path.resolve(path_file))
    }else{
        res.status(404).send({message: 'no existe el archivo'})
    }
},
delsong(req,res){
    id = req.params.id;
    var sql = "select file from song WHERE id="+id;
    conexion.query(sql,function(err,results,fields){
        if(!err){
            if (results.length !=0) {
                if(results[0].file != null) {
                    var path_file = './uploads/song/' +results[0].file;
                    try {
                        fs.unlinkSync(path_file);
                        res.status(200).send({message: "file eliminada"})
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

