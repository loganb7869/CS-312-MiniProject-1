import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

/* express and port declartaion */
const app = express();
const port = 3000;

/* set view enginer for ejs */
app.set("view engine", "ejs");

/* local post storage */
const posts = [];

/* unique id per post */
let idNum = 1;

/* middleware */
app.use(bodyParser.urlencoded({extended: true}))
app.use(morgan("tiny"));
app.use(express.static("public"));

/* request handlers */

/* homepage render */
app.get("/", (req, res) => {
    res.render("index.ejs", {
        posts: posts,
        title: "Blog Homepage"
    });
});

/* editing blog post render */
app.get("/POST_ID/:id", (req, res) => {
    /*find the post to delete based on id and make sure the id is a number */
    const postId = Number(req.params.id);
    const postLocation = posts.find(postLocation => postLocation.id === postId);

    /* render edit page and send over page title and post information */
    res.render("post_edit.ejs", {
        title: "Post Edit",
        post: postLocation
    });
});

/* deleting blg post render */
app.get("/POST_ID/:id/delete", (req, res) => {
    /*find the post to delete based on id and make sure the id is a number */
    const postId = Number(req.params.id);
    const postLocation = posts.find(postLocation => postLocation.id === postId);

    /* render delete page and send over page title an post information */
    res.render("delete.ejs", {
        title: "Post Deletion",
        post: postLocation
    });
});

/* per blog post submission  */
app.post("/submit", (req, res) => {
    /* new post object to store information to be colleceted by user */
    const newPost = {
        id: idNum,
        userName: req.body.userName,
        blogTitle: req.body.blogTitle,
        /* get local date and covert to valid string for display */
        localDate: new Date().toLocaleDateString('en-US'),
        blogContent: req.body.blogContent
    };

    /* increment the unique id number for the next post */
    idNum++;

    /* push the new post to the local array stroge */
    posts.push(newPost);
    console.log(posts);

    /* redirect back to homepage */
    res.redirect("/");
});

/* editing blog post submission  */
app.post("/POST_ID/:id", (req, res) => {
    /*find the post to delete based on id and make sure the id is a number */
    const postId = Number(req.params.id);
    const postLocation = posts.find(postLocation => postLocation.id === postId);

    /* update post info with info from user input */
    postLocation.userName = req.body.userName;
    postLocation.blogTitle = req.body.blogTitle;
    postLocation.blogContent = req.body.blogContent;

    /* redirect back to homepage */
    res.redirect("/");
});

/* deleting blog post submission */
app.post("/POST_ID/:id/delete", (req, res) => {
    /*find the post to delete based on id and make sure the id is a number */
    const postId = Number(req.params.id);
    const postLocation = posts.find(postLocation => postLocation.id === postId);

    /* remove post from array storage */
    posts.splice(postLocation, 1);

    /* go back to homepage */
    res.redirect("/");
});

/* eror handling for page not found error */
app.use((req, res) => {
    res.status(404).send("<h1>Page not found</h1>");
});

/* initialize the server and listen on declared port */
app.listen(port, () => {
    console.log(`Access the server at http://localhost:${port}/`);
});