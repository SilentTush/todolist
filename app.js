const express = require("express");
const bodyParser = require("body-parser");
const  eDate  = require(__dirname + "/day.js");
const mongoose = require("mongoose");
const app = express();

mongoose.connect("mongodb://localhost:27017/todolistDB", {useUnifiedTopology: 1,useNewUrlParser: 1})

const itemSchema =  {
    name: String
}

const Item = mongoose.model("item",itemSchema);

const WorkItem = mongoose.model("workitem",itemSchema);

const newitem0 = new WorkItem({
    name: "Hello"
});
newitem0.save();

const newitem1 = new Item({
    name: "Hello"
});

const newitem2 = new Item({
    name: "Add new items by press +"
});

const newitem3 = new Item({
    name: "below"
});

// Item.insertMany([newitem1,newitem2,newitem3]);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static("public/"));

app.get("/", (req,res)=>{
    var day = eDate.getDate();
    Item.find({},(err,listitems)=>{
        if(listitems===0){
            Item.insertMany([newitem1,newitem2,newitem3]);
            res.render("/");
        }
        else{
            res.render("list", {eday: day,enewlist: listitems});
        }
    })
});

app.get("/work", (req,res)=>{
    WorkItem.find({},(err,listitems)=>{
        if(listitems===0){
            WorkItem.insertMany([newitem1,newitem2,newitem3]);
            res.render("/");
        }
        else{
            res.render("list", {eday: "WorkList",enewlist: listitems});
        }
       })
})



app.post("/", (req,res)=>{

    const enewitem = req.body.etx;

    if(req.body.subName==="WorkList"){
        const item2add2 = new WorkItem({
            name: enewitem
        });
        item2add2.save();
        res.redirect("/work");
    }
    else {
        const item2add = new Item({
            name: enewitem
        });
        item2add.save();
        res.redirect("/");
    }
});

app.listen(3000);