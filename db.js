/**
 * Created by user on 7/12/2016.
 */
var Sequelize= require('sequelize');
var env=process.env.NODE_ENV || 'development';
var sequelize;

// Using Online DB of heroku
//Instead of local database we now use online database create by heroku for creating that db watch
// lect 07 of Adding real database

if(env==='production') {  // it means its running on heroku
    sequelize=new Sequelize(process.env.DATABASE_URL,{
        'dialect':'postgres'
    })
}else{  // Create DB on local disk
    //
     sequelize=new Sequelize(undefined,undefined,undefined,{
     'dialect':'sqlite',
     'storage':__dirname+'/data/todo-api-database.sqlite' // database name with folder name to create in
     });
}


var db={};

db.todo=sequelize.import(__dirname+'/models/todo.js');  // calling todo.js for creating table and its atrributes
db.sequelize=sequelize;
db.Sequelize=Sequelize;

module.exports=db;