/**
 * Created by Administrator on 2017/04/23.
 */



var mongoose= require('mongoose');

var  usersSchema =  require('../schemas/categories');


module.exports =  mongoose.model('categories',usersSchema);