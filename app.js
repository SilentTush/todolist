const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");

const dotenv = require("dotenv");
dotenv.config();

const mongoUrl = process.env.urlxx;

mongoose.connect(mongoUrl, {
	useUnifiedTopology: 1,
	useNewUrlParser: 1,
	useFindAndModify: false,
});


// item schema here
const itemSchema = {
	name: String,
};
// list schema here
const listSchema = {
	name: String,
	items: [itemSchema],
};

const Item = mongoose.model("item", itemSchema);

const List = mongoose.model("list", listSchema);
// ----------------------------------------------default entries for every new page--------------------------------------------------------------
const newitem1 = new Item({
	name: "Hello",
});

const newitem2 = new Item({
	name: "Add new items by press +",
});

const newitem3 = new Item({
	name: "delete by checking the checkbox",
});

const defaultitems = [newitem1, newitem2, newitem3];
// ----------------------------------------------------------------------------------------------------------------------------------------------

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public/"));

// ----------------------------------------------------------------------------------------------------------------------------------------------

// ----------------------------------------------get for root route--------------------------------------------------------------

app.get("/", (req, res) => {
	Item.find({}, (err, listitems) => {
		if (listitems.length === 0) {
			Item.insertMany([newitem1, newitem2, newitem3]);
			res.render("/");
		} else {
			res.render("list", { eday: "Today", enewlist: listitems });
		}
	});
});

// ----------------------------------------------get for every new page--------------------------------------------------------------

app.get("/:anything", (req, res) => {
	const customListName = _.capitalize(req.params.anything);
	List.findOne({ name: customListName }, (err, result) => {
		if (!err) {
			if (!result) {
				const list = new List({
					name: customListName,
					items: defaultitems,
				});

				list.save();
				res.redirect("/" + customListName);
			} else {
				res.render("list", { eday: customListName, enewlist: result.items });
			}
		} else {
			console.log(err);
		}
	});
});

// ----------------------------------------------post for every page--------------------------------------------------------------

app.post("/", (req, res) => {
	const list_title = req.body.subName;
	const list_newItem = req.body.newListInput;

	const itemadd = new Item({
		name: list_newItem,
	});

	if (list_title === "Today") {
		itemadd.save();
		res.redirect("/");
	} else {
		List.findOne({ name: list_title }, (err, result) => {
			if (!err) {
				if (result) {
					result.items.push(itemadd);
					result.save();
					res.redirect("/" + list_title);
				} else {
					console.log("wrong list");
				}
			} else {
				console.log(err);
			}
		});
	}
});

// ----------------------------------------------delete section--------------------------------------------------------------

app.post("/delete", (req, res) => {
	const itemToDelete = req.body.itemTobeDeleted;
	const listToDeleteFrom = req.body.hidden_listName;

	if (listToDeleteFrom === "Today") {
		Item.findByIdAndRemove(itemToDelete, (err) => {
			if (!err) {
				console.log("Successfully deleted");
				res.redirect("/");
			}
		});
	} else {
		List.findOneAndUpdate(
			{ name: listToDeleteFrom },
			{ $pull: { items: { _id: itemToDelete } } },
			(err, foundList) => {
				if (!err) {
					res.redirect("/" + listToDeleteFrom);
				}
			}
		);
	}
});

let port = process.env.PORT;
if (port == null || port == "") {
	port = 3000;
}
app.listen(port, () => {
	console.log("server has started");
});
