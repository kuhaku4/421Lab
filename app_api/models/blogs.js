var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({ 
    blogtitle: {type: String},
    blogtext: {type: String},
    createdDate: {type: Date, "default": Date.now},
    userEmail: {type: String},
    userName: {type: String}
});


mongoose.model('Blog', blogSchema);