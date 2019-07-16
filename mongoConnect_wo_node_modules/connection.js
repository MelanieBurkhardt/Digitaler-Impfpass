const mongoose = require('mongoose');

//connect to mongodb
mongoose.connect('mongodb://localhost/vaccert');

mongoose.connection.once('open',function(){
    console.log('Connection has been made...miracles happen');
}).on('error',function(error){
    console.log('Connection error:',error);
});