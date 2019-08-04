const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    user_id: {
        type: String,
        unique: true,
        require: true
    },
    phone_number: {
        type: String
    },
    email: {
        type: String
    },
    role: {
        type: String
    },
    token_status: {
        type: String
    },
    create_date: {
        type: Date
    },
    update_date: {
        type: Date
    }
});

UserSchema.pre('save', function(next) {
    var user = this;
    if(this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function(err, salt) {
            if(err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if(err) {
            return cb(err);
        }
        cb(null, isMatch);
    })
}

module.exports = mongoose.model('User', UserSchema);