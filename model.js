var DB = require('./db').DB;

var User = DB.Model.extent({
	tableName: 'tblUsers',
	idAttribute: 'userId',
});

module.exports = {
	User: User
};

