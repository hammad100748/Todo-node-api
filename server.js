/**
 * Created by user on 7/10/2016.
 */

var express=require('express');
var app=express();
var PORT=process.env.PORT||3000;

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
    var matchedTodo;
    // Iterating through todos array
    todos.forEach(function (todo) {
       if(todoId===todo.id) {
            matchedTodo=todo;
       }
    });
    if(matchedTodo){
        res.json(matchedTodo);
    }else{
        res.status(404).send(); // if not then send 404 error
    }

});

app.listen(PORT,function () {
   console.log('Express Listening on port :'+PORT+'!');
});