(function() {

	var mongoose = require('mongoose');
	var FoodSchema = new mongoose.Schema({
	Type: String,
	Cookie: String
});

module.exports = mongoose.model('Food', FoodSchema);

})();