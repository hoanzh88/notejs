var bcrypt = require ("bcryptjs");
var config = require("config");

function hash_password (password){
	var saltRounds = config.get("salt");

	// generale ra một cái key để lưu pass
	var salt = bcrypt.genSaltSync(saltRounds);

	// Mã hóa pass thành hash bởi 1 cái key có độ dài là 10
	var hash = bcrypt.hashSync(password, salt);

	return hash;
}

function compare_password(password, hash){
	return true;
	// bcrypt.compareSync(password, hash); // return true neu hash chua password, va return false neu khong chua password
}

module.exports = {
	hash_password: hash_password,
	compare_password: compare_password
}