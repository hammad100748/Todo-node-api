/**
 * Created by user on 7/12/2016.
 */
var Sequelize= require('sequelize');
var sequelize=new Sequelize(undefined,undefined,undefined,{
   'dialect':'sqlite',
    'storage':__dirname+'/basic-sqlite-database.sqlite' // database name with folder name to create in
});
// Attributes like description of type string and completed of type boolean
var Todo=sequelize.define('todo',{
    description:{
        type: Sequelize.STRING,
        allowNull:false,    // Cant be left Null its not optional have to fill
        validate:{
            notEmpty:true,   // Empty string not allowed
            len:[1,250]     // characters from 1 to 250
        }
    },
    completed:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false  // Default value if in case not assigned
    }
});


// sequelize.sync({force:true}).then(function () {  // by passing forcce true it will delete existing rows and create new ones
sequelize.sync().then(function () {
   console.log('Everything is sync');

    //adding data in database
    Todo.create({   // create uses Insert Query for adding items to database
        description:'Walking my Dog',
        completed:false
    }).then(function (todo) {
        return Todo.create({
            description:'Take out Trash'
        });
    }).then(function () {
        // return Todo.findById(1);     // findByID uses Select Query to find object by id name or any primary key
            return Todo.findAll({       // best if by searching criteria like in our case if completed is false return all
                where:{
                    // completed:true      // Select query with where option this is how we do it here
                    completed:{
                        $like:'%trash%'    // Will return all those wh contins
                    }
                }
            });
    }).then(function (todos) {
        if(todos){
            // console.log(todos.toJSON());
            todos.forEach(function (todo) {
                console.log(todo.toJSON());
            });
        }else{
            console.log('Todo Not Found !');
        }
    }).catch(function (e) {
        console.log(e);
    });
});