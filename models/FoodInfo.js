/**
 * Created by Alex Chew on 2014/8/1.
 */

var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var FoodInfoSchema = new Schema({
    title : {type: String, unique: true },
    url : String,
    time :String,
    image:{type:String,default:""},
    area :[],
    source :[],
    food :[],
    tag :[],
    created:{type:Date,default:Date.now}
});
var FoodInfo = mongodb.mongoose.model("FoodInfo", FoodInfoSchema);
module.exports = FoodInfo;