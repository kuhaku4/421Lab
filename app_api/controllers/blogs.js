var mongoose = require('mongoose');
var Blog = mongoose.model('Blog')

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

var initBlog = function (body) {
  return {
      blogtitle: body.blogtitle,
      blogtext: body.blogtext
  }
}

/* GET a list of all blogs */
module.exports.blogsList = function(req, res) {
  console.log('Getting blogs list');
  Blog
      .find()
      .then(function(blogs) {
        if (!blogs.length) {
            sendJSONresponse (res, 204, blogs)
        } else {
            sendJSONresponse (res, 200, blogs)
        }
    })
    .catch(function(err) {
        console.log(err);
        sendJSONresponse (res, 400, err)
    })
}

  // Read a single blog
  module.exports.blogsReadOne = function(req, res) {
    var blogid = req.params.blogid;
    console.log('Finding blog details ' + blogid);
    Blog
    .findOne({_id:blogid})
    .then(function(blog) {
        console.log("API: "+blog)
        if (blog) {
            sendJSONresponse (res, 200, blog);
        } else {
            sendJSONresponse (res, 404, blog);
        }
    })
    .catch(function(err) {
        console.log(err);
        sendJSONresponse (res, 400, err);

    })
}
  
  // Create a new blog
  module.exports.blogsCreate = function(req, res) {
    console.log("Blog Add Request");
    var blog = initBlog (req.body)
    Blog
    .create (blog)
        .then(function (newBlog) {
            console.log("Added Blog: "+newBlog)
            sendJSONresponse (res, 201, newBlog)
        })
        .catch(function(err) {
            console.log(err)
            sendJSONresponse (res, 400, err)
  })
}
  
  // Update a single blog
  module.exports.blogsUpdate = function(req, res) {
    console.log("Updating a blog entry with id of " + req.params.blogid);
    var blogid = req.params.blogid;
    Blog
  	  .findByIdAndUpdate(blogid, {$set: {"blogtitle": req.body.blogtitle, "blogtext": req.body.blogtext}})
      .then(function(blog) {
          console.log("Updated blog: "+blogid);
          sendJSONresponse (res, 200, blog);
      })
      .catch(function(err) {
          console.log(err);
          sendJSONresponse (res, 404 ,err);
      })

}
  
  // Delete a single blog
  module.exports.blogsDelete = function(req, res) {
    console.log("Deleting blog entry with id of " + req.params.blogid);
    var blogid = req.params.blogid;
    Blog
        .findByIdAndDelete(blogid)
        .then(() => sendJSONresponse (res, 204, null))
        .catch((err) => sendJSONresponse (res, 404, err))
}