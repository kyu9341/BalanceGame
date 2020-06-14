const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Like = require('./like')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);

// 1대다 관계
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);

// 다대다 관계 - 매칭 테이블 : like
db.User.belongsToMany(db.Post, { through : db.Like });
db.Post.belongsToMany(db.User, { through : db.Like, as: 'Liker' }); // 사용자를 Liker로 가져옴\

// 1대다 포스트 : 댓글
db.Post.hasMany(db.Comment);
db.Comment.belongsTo(db.Post);

// 1대다 User : 댓글
db.User.hasMany(db.Comment);
db.Comment.belongsTo(db.User);


module.exports = db;
