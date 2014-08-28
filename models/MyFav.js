/**
 * Created by Alex Chew on 2014/8/1.
 */

var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var MyFavSchema = new Schema({
    favid : {type: String, unique: true },
    title:String,
    user: String,
    url : String,
    from :String,
    image:{type:String,default:""},
    created:{type:Date,default:Date.now}
});
var MyFav = mongodb.mongoose.model("MyFav", MyFavSchema);
module.exports = MyFav;