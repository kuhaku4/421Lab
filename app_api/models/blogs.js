var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({ 
    blogtitle: {type: String},
    blogtext: {type: String},
    createdDate: {type: Date, "default": Date.now}
});


mongoose.model('Blog', blogSchema);