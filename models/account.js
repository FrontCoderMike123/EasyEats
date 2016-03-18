(function() {

	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;
	var passportLocalMongoose = require('passport-local-mongoose');
	var bcrypt = require('bcrypt-nodejs');
	var SALT_WORK_FACTOR = 10;

  var thumbnailPluginLib = require('mongoose-thumbnail');
  var thumbnailPlugin = thumbnailPluginLib.thumbnailPlugin;
  var make_upload_to_model = thumbnailPluginLib.make_upload_to_model;
  var path = require('path');

  var uploads_base = path.join(__dirname, "uploads");
  var uploads = path.join(uploads_base, "u");

	var Account = new Schema({
		username: String,
		password: String,
		firstname: String,
		lastname: String,
		emailAddress: String,
    //userPhoto: String,
    userPhoto: { data: Buffer, contentType: String },
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

  Account.plugin(thumbnailPlugin,{
    name: 'photo',
    format: 'jpg',
    size: 80,
    inline: false,
    save: true,
    upload_to: make_upload_to_model(uploads, 'photos'),
    relative_to: uploads_base
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