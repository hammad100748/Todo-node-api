/**
 * Created by user on 7/10/2016.
 */

var express=require('express');
var bodyParser=require('body-parser');
var _=require('underscore');
var db=require('./db.js');


var app=express();
var PORT=process.env.PORT||3000;
var todos=[];
var todoNextId=1;
app.use(bodyParser.json()); // any time json request comes in express is gona parse it and we r gona be able it access it

/* Already Populated Now we create our own TODO's
var todos=[
    {
        id:1,
        description:'Meet babar for lunch',
        completed:false
    },
    {
        id:2,
        description:'Go fo baber at 10',
        completed:false
    },
    {
        id:3,
        description:'Fast Food For freinds',
        completed:false
    }
];
*/

/////// GET Requests    /////////

app.get('/',function (req,res) {
    res.send('TO-DO API Root');
});

// GET url will be /todos it will return each todos item on postman
app.get('/todos',function (req,res) {
    // res.json(todos)  // instead this we can also use queries for filtering data or getting
                        // any data  format is ?completed=true so it will return all true todos

    var queryParams=req.query;  // gets the query part from url after '?'   ?completed=false&q=word

    var whereQuery={};
    // Handling Parameters ?completed=true|false or ?q=anyword or both
    if(queryParams.hasOwnProperty('completed')&&queryParams.completed==='true'){
        whereQuery.completed=true;
    }else if(queryParams.hasOwnProperty('completed') && queryParams.completed==='false'){
        whereQuery.completed=false;
    }

    if(queryParams.hasOwnProperty('q') && queryParams.q.length>0){
        whereQuery.description={
            $like:'%'+queryParams.q + '%'   // checking if word matches in any description it returns that
        };
    }

    // Now Passing Where query
    db.todo.findAll({where:whereQuery}).then(function (todo) {
        res.json(todo);
    },function (e) {
        res.status(500).send();
    });

    /*Now Instead of this we will use db quires to full fill all this functionality
   var filterTodos=todos;

    if(queryParams.hasOwnProperty('completed') && queryParams.completed==='true'){
        filterTodos=_.where(filterTodos,{completed:true});

    }else if(queryParams.hasOwnProperty('completed') && queryParams.completed==='false'){
        filterTodos=_.where(filterTodos,{completed:false});
    }

    // Adding another query for searching a word in description and return that description wh include word
    if(queryParams.hasOwnProperty('q') && queryParams.q.length>0){  // checking it has query q and its length greater than 1 mean its not empty
        filterTodos=_.filter(filterTodos,function (todo) {
            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase())>-1;  // index of means that word is there and it would return a +iv num
        });
    }

    res.json(filterTodos);
*/
});

// GET url will be /todo/:id    // using DB
app.get('/todos/:id',function (req,res) {
    //res.send('Asking fo ID is '+req.params.id);
    var todoId=parseInt(req.params.id,10);   // we have to change it to int cuz p'arams.id' returns string

    db.todo.findById(todoId).then(function (todo) {
        if(!!todo){
            res.json(todo.toJSON());
        }else{
            res.status(404).send();
        }
    },function (e) {
       res.status(500).send();
    });
    /*Now instead of following we will use DB findByID which is Select Query by using API call

    var matchedTodo=_.findWhere(todos,{id:todoId});

    if(matchedTodo){
        res.json(matchedTodo);
    }else{
        res.status(404).send(); // if not then send 404 error
    }*/

    // Iterating through todos array
    /*  Now instead of our own iteration we will be using _js libraries to do search for us and ay kind of work
     todos.forEach(function (todo) {
     if(todoId===todo.id) {
     matchedTodo=todo;
     }
     });*/

});

/////// POST Requests   ///

// POST /todos  // using db and api's
app.post('/todos',function (req,res) {
    // var body=req.body;   // using underscoreJs functionality
    var body=_.pick(req.body,'description','completed');    // we can use this funct instead creating our own funct
                                                            // also we get data which we want from json instead of getting all data

    // Using API's to Access DB to add new data using creaate wh is Insert Query //
    db.todo.create(body).then(function (todo) {
        res.json(todo.toJSON());
    },function (e) {
        res.status(400).json(e);
    });

    /* Using Database above instead of following almost same same
    if(!_.isBoolean(body.completed)||!_.isString(body.description)||body.description.trim().length===0){
        return res.status(400).send();
    }

    // set body description to be trimed value
    // i-e unwanted spcaes will be removed not the orignal 1's but unwanted spaces
    body.description=body.description.trim();
    body.id=todoNextId++;
    todos.push(body);
    res.json(body);*/
});

////// DELETE Requests /////

// Delete/todos/:id

app.delete('/todos/:id',function (req,res) {
    var todoId=parseInt(req.params.id,10);
    console.log(todoId);
    // We use destroy for Delete Query
    db.todo.destroy({   // Delete a row using id
        where:{
            id:todoId
        }
    }).then(function(rowsDeleted) {
        if(rowsDeleted===0){
            res.status(404).json({error:'No todo found'});
        }else{
            res.status(202).send();
        }
    },function () {
            res.status(505).send();
    });
    /* Now usng DB instead of manually
    var matchedTodo=_.findWhere(todos,{id:todoId});

    if(!matchedTodo){
        // res.status(404).send();  // Instead this we can also send error message
        res.status(404).json({"Error":"No todo find with ID"});
    }else{
        todos=_.without(todos,matchedTodo);      //Using undersocreJs functionality without we deleted the matched todo
        res.json(todos);            // Sends back updated todo
    }*/
});

/////// PUT requests // for updating data

// PUT/todos/:id
app.put('/todos/:id',function (req,res) {

    var todoId=parseInt(req.params.id,10);
    var body=_.pick(req.body,'description','completed');    // Here we are getting updated body
    var attributes={};

    // DB is using validation of string and null and boolean as we specified in our table for rows
    if(body.hasOwnProperty('completed')){
        attributes.completed=body.completed;
    }
    if(body.hasOwnProperty('description')){
        attributes.description=body.description;
    }

    // We update but 1st we find id using findbyid
    db.todo.findById(todoId).then(function (todo) {     // Finding Id wh to be updated
       if(todo){
           todo.update(attributes).then(function (todo) {
               res.json(todo.toJSON());                        // If todo.updated runs we send back 200
           },function (e) {
               res.status(400).json(e);                        // if todo.updated failed
           });               // Updating Row by using id
       }else{
           res.status(404).send();                      // If Id not found
       }
    },function () {
        res.status(500).send();                         //if find by id went wrong

    });
/*
    using PUT for update
var todoId=parseInt(req.params.id,10);
    //debugger;   // it will stop the parogram at this point show all values excuted before
                // in terminal if u want to continue u have to type 'cont' to continues program and type 'kill' to finish debugging
                // See lecture 10 in Project TODO REST API

    var matchedTodo=_.findWhere(todos,{id:todoId});

    if(!matchedTodo){
        return res.status(404).json({"Error":"No Todo Id Found"});
    }

    // Validating Data before updating
    var body=_.pick(req.body,'description','completed');
    var validateAttribute={};

    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
        validateAttribute.completed=body.completed;
    }else if(body.hasOwnProperty('completed')){
        return res.status(404).send();
    }

    if(body.hasOwnProperty('description') && _.isString('description') && body.description.trim().length>0){
        validateAttribute.description=body.description;
    }else if(body.hasOwnProperty('description')){
        return res.status(400).send();
    }

    // Updating it Now
    _.extend(matchedTodo,validateAttribute);    // Update
    res.json(matchedTodo);*/


});


db.sequelize.sync().then(function () {
    app.listen(PORT,function () {
        console.log('Express Listening on port :'+PORT+'!');
    });
});

