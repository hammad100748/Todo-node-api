/**
 * Created by user on 7/10/2016.
 */

var express=require('express');
var bodyParser=require('body-parser');
var _=require('underscore');

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
    res.json(todos)
});

// GET url will be /todo/:id
// we search by id and return the matched to post man or anything u want to show into
app.get('/todos/:id',function (req,res) {
    //res.send('Asking fo ID is '+req.params.id);
    var todoId=parseInt(req.params.id,10);   // we have to change it to int cuz p'arams.id' returns string
    var matchedTodo=_.findWhere(todos,{id:todoId});

    // Iterating through todos array
    /*  Now instead of our own iteration we will be using _js libraries to do search for us and ay kind of work
    todos.forEach(function (todo) {
       if(todoId===todo.id) {
            matchedTodo=todo;
       }
    });*/

    if(matchedTodo){
        res.json(matchedTodo);
    }else{
        res.status(404).send(); // if not then send 404 error
    }

});

/////// POST Requests   ///

// POST /todos
app.post('/todos',function (req,res) {
    // var body=req.body;   // using underscoreJs functionality
    var body=_.pick(req.body,'description','completed');    // we can use this funct instead creating our own funct
                                                            // also we get data which we want from json instead of getting all data

    if(!_.isBoolean(body.completed)||!_.isString(body.description)||body.description.trim().length===0){
        console.log('here at log');
        return res.status(400).send();
    }

    // set body description to be trimed value
    // i-e unwanted spcaes will be removed not the orignal 1's but unwanted spaces
    body.description=body.description.trim();

    body.id=todoNextId;
    todoNextId++;
    todos.push(body);
    res.json(body);
});


app.listen(PORT,function () {
   console.log('Express Listening on port :'+PORT+'!');
});