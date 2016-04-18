(function() {

	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;
	var ObjectId = Schema.ObjectId;
	var passportLocalMongoose = require('passport-local-mongoose');
	var bcrypt = require('bcrypt-nodejs');
	var SALT_WORK_FACTOR = 10;

	var Account = new Schema({
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		firstname: String,
		lastname: String,
		emailAddress: { type: String, required: true, unique: true },
    	userPhoto: { data: Buffer, contentType: String, default: '' },
		resetPasswordToken: String,
  		resetPasswordExpires: Date,
  		Foods: { Type: String, Favorite: Boolean }
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