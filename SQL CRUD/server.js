const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const port = 8080;

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
// app.use(express.static.path.join(__dirname, "public"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'test'
});


// add templete
app.get("/", (req, res) => {
    let sql = "SELECT COUNT(*) FROM user";
    try {
        connection.query(sql, (err, result) => {
            if (err) throw err;
            let count = result[0]["COUNT(*)"];
            res.render("home.ejs", {count});
        });
    }catch (err) {
        console.log(err);
        res.send("Some errors in database");
    }
});


// show routes
app.get("/users", (req, res) => {
    let sql = "SELECT * FROM user";
    try {
        connection.query(sql, (err, users) => {
            if (err) throw err;
            // console.log(result);
            // res.send(result);
            res.render("users.ejs", {users});
        });
    }catch (err) {
        console.log(err);
        res.send("Some errors in database");
    }
});

// edit routes
app.get("/users/:id/edit", (req, res) => {
    let { id } = req.params;
    let sql = `SELECT * FROM user WHERE id = '${ id }'`;
    try {
        connection.query(sql, [id], (err, result) => {
            if (err) throw err;
            let user = result[0];
            // console.log(id);
            // res.send("Success");
            // console.log(result);
            res.render("edit.ejs", {user});
            // res.redirect("/users");
        });
    }catch (err) {
        console.log(err);
        res.send("Some errors in database");
    }
});

//update routes 
app.patch("/users/:id", (req, res) => {
    let { id } = req.params;
    let { password: formPass, username: newUser } = req.body;
    let sql = `SELECT * FROM user WHERE id = '${ id }'`;
    try {
        connection.query(sql, [id], (err, result) => {
            if (err) throw err;
            let user = result[0];
            if(formPass != user.password) {
                res.send("Password not matched");
            }else {
                let q2 = `UPDATE user SET username = '${ newUser }' WHERE id = '${ id }'`;
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    res.redirect("/users");
                })
            }
            // console.log(id);
            // res.send("Success");
            // console.log(result);
            // res.send(user);
            // res.redirect("/users");
        });
    }catch (err) {
        console.log(err);
        res.send("Some errors in database");
    }
});

// add routes
app.get("/add", (req, res) => {
    res.render("add.ejs", {faker});
});

app.post("/users", (req, res) => {
    let { id, email, username, password} = req.body;
    let sql = `INSERT INTO user (id, username, email, password) VALUES ('${ id }', '${ username }', '${ email }', '${ password }')`;
    try {
        connection.query(sql, (err, result) => {
            if (err) throw err;
            res.redirect("/users");
        });
    }catch (err) {
        console.log(err);
        res.send("Some errors in database");
    }
});

// delete rotes
app.delete("/users/:id", (req, res) => {
    let { id } = req.params;
    let sql = `DELETE FROM user WHERE id = '${id}'`;
    try {
        connection.query(sql, (err, result) => {
            if (err) throw err;
            // let user = result[0];
            res.redirect("/users");
        });
    }catch (err) {
        console.log(err);
        res.send("Some errors in database");
    }
});

// connection.end();

app.listen(port, () => {
    console.log(`Server is Running on port ${port}`);
});