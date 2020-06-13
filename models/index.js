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

// 1대다 관계
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);

// 다대다 관계 - 매칭 테이블 : like
db.User.belongsToMany(db.Post, { through : db.Like });
db.Post.belongsToMany(db.User, { through : db.Like, as: 'Liker' }); // 사용자를 Liker로 가져옴

module.exports = db;
