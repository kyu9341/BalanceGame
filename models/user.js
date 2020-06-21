module.exports = ((sequelize, DataTypes) => (
    sequelize.define('user', {
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
        },
        nickname: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        password: { // 카카오로 로그인한 경우 비밀번호가 없을 수 있음
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        provider: { // 웹 사이트에서 직접 가입했는지 카카오로 가입했는지 구분
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'local',
        },
        snsId: { // 카카오로 로그인 한 경우에만 카카오 아이디를 알려줌
            type: DataTypes.STRING(30),
            allowNull: true,
        },
    }, {
        timestamps: true, // sequelize 가 자동으로 수정일과 row 생성일을 기록해줌
        paranoid: true, // 삭제일 기록 (데이터 복구가 가능해짐)
    })
));