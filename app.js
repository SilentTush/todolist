const express = require("express");
const bodyParser = require("body-parser");


const app = express();

var newList = ["AddItems"];
var workList = ["AddItems"];
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static("public/"));

app.get("/", (req,res)=>{
    var today = new Date();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    var day = today.toLocaleDateString("es-Us", options);

    res.render("list", {eday: day,enewlist: newList});
});

app.get("/work", (req,res)=>{
    res.render("list", {eday: "Work List",enewlist: workList});
})



app.post("/", (req,res)=>{
    if(req.body.subName==="Work List"){
        workList.push(req.body.etx);
        res.redirect("/work");
    }
    else {
        newList.push(req.body.etx);
        res.redirect("/");
    }
});

app.listen(3000);