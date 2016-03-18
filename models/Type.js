(function() {

	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;
	
	var Foods = new Schema({
      ID: String,
      Type: String,
      Cookie: String,
      Favorite: Boolean,
      Desc: String,
      SVG: String,
      PNG: String
  });

module.exports = mongoose.model('Food', Foods);

})();