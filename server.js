/**
 * Created by user on 7/10/2016.
 */

var express=require('express');
var app=express();
var PORT=process.env.PORT||3000;

app.get('/',function (req,res) {
    res.send('TO-DO API Root');
});

app.listen(PORT,function () {
   console.log('Express Listening on port :'+PORT+'!');
});