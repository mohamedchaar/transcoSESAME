/**
 * Created by GMI-PC on 24/03/2017.
 */
var jwt         = require('jwt-simple');
var Voyageur    = require('../../app/models/voyageur'); // get the mongoose model
var passport	= require('passport');
var express     = require('express');
var config      = require('../../config/database'); // get db config file


require('../../config/passport')(passport);
var apiVoyageur = express.Router();

apiVoyageur.post('/signup', function(req, res) {
    if (!req.body.name || !req.body.password) {
        res.json({success: false, msg: 'Please pass name and password.'});
    } else {
        var newVoyageur = new Voyageur({
            'User.name': req.body.name,
            'User.password': req.body.password
        });
        console.log(newVoyageur);
        // save the user
        newVoyageur.save(function(err) {
            console.log("here");
            if (err) {
                console.log(err);
                return res.json({success: false, msg: 'Erreur.'});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }
});

apiVoyageur.post('/authenticate', function(req, res) {
    Voyageur.findOne({
        'User.name': req.body.name
    }, function(err, voyageur) {
        if (err) throw err;

        if (!voyageur) {
            res.send({success: false, msg: 'Authentication failed. Voyageur not found.'});
        } //a fuckin problem here check it later!!!!!!!
        else {
            // check if password matches
            console.log("--------------------");
            console.log(voyageur.User.password);
            console.log(req.body.password);
            voyageur.User.comparePassword(req.body.password, function (err, isMatch) {
               // console.log(isMatch);
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.encode(voyageur, config.secret);
                    // return the information including token as JSON
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }

    });
});
apiVoyageur.get('/memberinfo', passport.authenticate('jwt',{session: false}),function (req,res) {
    var token = getToken(req.headers);
    if (token){
        var decoded = jwt.decode(token,config.secret);
        Voyageur.findOne({
            'User.name': decoded.User.name
        }, function (err,voyageur) {
            if (err) throw err;
            if (!voyageur){
                return res.status(403).send({success: false, msg:"Authentifaiction failed" });
            }else {
                return res.json({success: true,msg: "Welcome to the member area "+voyageur.User.name});
            }

        });

    }else {
        return res.status({success: false, msg: 'No token provided.'});

    }
});
getToken =function (headers) {
    if (headers && headers.authorization){
        var parted =headers.authorization.split(' ');
        if (parted.length === 2){
            return parted[1];
        }else {
            return null;
        }
    }else {
        return null;
    }

};
module.exports = apiVoyageur;