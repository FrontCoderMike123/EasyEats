(function() {

	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;
	var passportLocalMongoose = require('passport-local-mongoose');
	var bcrypt = require('bcrypt-nodejs');
	var SALT_WORK_FACTOR = 10;

	var Account = new Schema({
		username: String,
		password: String,
		firstname: String,
		lastname: String,
		emailAddress: String,
    userPhoto: String,
		resetPasswordToken: String,
  		resetPasswordExpires: Date,
  		Foods:
  		[{
        ID: String,
  			Type: String,
  			Cookie: String,
  			Favorite: Boolean,
  			Desc: String,
  			SVG: String,
  			PNG: String
  		}]
	});

	Account.pre('save', function(next) {
  		var user = this;
  		var SALT_FACTOR = 5;

  		if (!user.isModified('password')) return next();

  		bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    		if (err) return next(err);

    		bcrypt.hash(user.password, salt, null, function(err, hash) {
      		if (err) return next(err);
      		user.password = hash;
      		next();
    		});
  		});
	});

	Account.methods.comparePassword = function(candidatePassword, cb) {
  		bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    		if (err) return cb(err);
    		cb(null, isMatch);
  		});
	};

	Account.plugin(passportLocalMongoose);

	module.exports = mongoose.model('Account', Account);

})();