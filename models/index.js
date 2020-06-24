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
db.postLike = require('./postLike')(sequelize, Sequelize);
db.commentLike = require('./commentLike')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);
db.Vote = require('./vote')(sequelize, Sequelize);
db.report = require('./report')(sequelize, Sequelize);

// 1대다 관계
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);

// 다대다 관계 - 매칭 테이블 : like
db.User.belongsToMany(db.Post, { through : db.postLike });
db.Post.belongsToMany(db.User, { through : db.postLike, as: 'postLiker' }); // 사용자를 Liker로 가져옴

// 다대다 관계 - 매칭 테이블 : like
db.User.belongsToMany(db.Comment, { through : db.commentLike });
db.Comment.belongsToMany(db.User, { through : db.commentLike, as: 'commentLiker' }); // 사용자를 Liker로 가져옴

// 다대다 관계 - 매칭 테이블 : vote
db.User.belongsToMany(db.Post, { through : db.Vote });
db.Post.belongsToMany(db.User, { through : db.Vote, as: 'Voter' }); // 사용자를 Voter로 가져옴

// 다대다 관계 - 매칭 테이블 : report
db.User.belongsToMany(db.Post, { through : db.report });
db.Post.belongsToMany(db.User, { through : db.report, as: 'reporter' }); // 사용자를 Reporter로 가져옴

// 1대다 포스트 : 댓글
db.Post.hasMany(db.Comment);
db.Comment.belongsTo(db.Post);

// 1대다 User : 댓글
db.User.hasMany(db.Comment);
db.Comment.belongsTo(db.User);


module.exports = db;
