/*********************************************************************************
*  BTI425 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  
    Academic Policy.  
*  No part of this assignment has been copied manually or electronically 
    from any other source
*  (including web sites) or distributed to other students.
* 
*  Name:yunseok Choi Student ID: 148765175  Date: 01/22/2023
*  Cyclic Link: https://jealous-wetsuit-cod.cyclic.app/
*
********************************************************************************/ 
const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require('dotenv').config(); 
const MoviesDB = require("./modules/moviesDB")

const db = new MoviesDB();
const app = express();
const HTTP_PORT = process.env.PORT || 8080;


app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.status(200).json({message: "API Listening"});
});

//Add new
app.post("/api/movies", (req, res) => {
    db.addNewMovie(req.body).then(data => {
        res.status(201).send(data);
    }).catch((err) => {
        res.status(404).send(err);
        console.log(err);
    });
});

app.get("/api/movies", (req, res) => {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
    console.log(err);
    
});

app.get("/api/movies/:id", (req, res) => {
    
    db.getMovieById(req.params.id)
    .then((data)=>{
        data ? res.json(data) : res.status(404).json({"message": "cannot find movie id"});
    })
    .catch((err)=>{
        res.status(500).json({ "message" : "cannot find movie id" })
        console.log(err);
    });
    
});

app.put("/api/movies/:id", (req, res) => {


    db.updateMovieById(req.body, req.params.id)
    .then((data) => {
        data ? res.json(data) : res.status(404).json({"message" : "movie is not updated"});
    })
    .catch((err) => {
        res.status(500).json({ "message" : "movie is not updated" });
        console.log(err);
    });

});

app.delete("/api/movies/:id", (req, res) => {
    db.deleteMovieById(req.params.id)
    .then((data) => {
        data ? res.status(204).end() : res.status(404).json({"message" : "Can not delete" + req.params.id + "!"});
    }).catch(() => {
        res.status(500).json({"message" : "Error on Delete"});
    });
});


db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});