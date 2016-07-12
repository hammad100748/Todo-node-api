/**
 * Created by user on 7/12/2016.
 */
var Sequelize= require('sequelize');
var sequelize=new Sequelize(undefined,undefined,undefined,{
    'dialect':'sqlite',
    'storage':__dirname+'/data/todo-api-database.sqlite' // database name with folder name to create in
});

var db={};

db.todo=sequelize.import(__dirname+'/models/todo.js');  // calling todo.js for creating table and its atrributes
db.sequelize=sequelize;
db.Sequelize=Sequelize;

module.exports=db;