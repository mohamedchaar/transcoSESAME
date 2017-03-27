/**
 * Created by GMI-PC on 24/03/2017.
 */
// Voyageur, Model

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var VoyageurSchema =new Schema({
    cin: {type: Number },

    User:{
        email: { type: String, lowercase: true, trim: true }

        , name: { type: String, required: true  }

        , image: {type: String}

        , login: { type: String, lowercase: true, trim: true }

        , password: { type: String, required: true}


    }
});
VoyageurSchema.pre('save', function (next) {
    var voyageur = this;
    console.log("------------------model now");
    console.log(voyageur.User.name);
    console.log(voyageur.User.password);
    if (this.isModified('this.User.password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(voyageur.User.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                voyageur.User.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

VoyageurSchema.methods.comparePassword = function (passw, cb) {
    console.log("problem");
    console.log(passw);
    console.log(this.password);
    bcrypt.compare(passw, this.password, function (err, isMatch) {

        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Voyageur', VoyageurSchema);