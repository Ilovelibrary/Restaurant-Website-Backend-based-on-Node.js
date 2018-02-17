const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
var authenticate = require('../authenticate');

const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({'user': req.user._id})
    .populate('user dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({'user': req.user._id})
    .then((favorite) => {
        if (favorite == null) {
            Favorites.create({'user': req.user._id, 'dishes':req.body})
            .then((favorite) => {
                console.log('Favorite Created ', req.body);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
        }
        else {
            for (i = 0, len = req.body.length; i < len; i++) { 
                if (favorite.dishes.indexOf(req.body[i]._id)<0) {
                    favorite.dishes.push(req.body[i]);
                }
            };
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);                
            }, (err) => next(err))       
        }
    })
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({'user': req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/dishId');
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({'user': req.user._id})
    .then((favorite) => {
        if (favorite == null) {
            Favorites.create({'user': req.user._id, 'dishes':req.params.dishId})
            .then((favorite) => {
                console.log('Favorite Created ', req.dishId);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
        }
        else {
            var para = mongoose.Types.ObjectId(req.params.dishId);
            if (favorite.dishes.indexOf(para)<0) {
                favorite.dishes.push(para);
            };
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);                
            }, (err) => next(err))       
        }
    })
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/dishId');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({'user': req.user._id})
    .then((favorite) => {
        var para = mongoose.Types.ObjectId(req.params.dishId);
        var idx = favorite.dishes.indexOf(para);
        if (idx > -1) {
            favorite.dishes.splice(idx, 1);
        };
        favorite.save()
        .then((favorite) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);                
        }, (err) => next(err))
    })
    .catch((err) => next(err));
})

module.exports = favoriteRouter;