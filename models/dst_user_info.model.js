/**
 * dst_user_info ORM实例对象
 */
module.exports = exports = function (sequelize, DataTypes) {
    const DstUserInfo = sequelize.define("DstUserInfo", {
        id: {type: DataTypes.STRING(50),"comment": "主键ID", primaryKey: true, allowNull: false},
        mobile: {type: DataTypes.STRING(22),"comment": "手机号码"},
        password: {type: DataTypes.STRING(1024),"comment": "登录密码"},
        pay_password: {type: DataTypes.STRING(1024),"comment": ""},
        name: {type: DataTypes.STRING(32),"comment": "姓名"},
        remark: {type: DataTypes.STRING(400),"comment": "备注"},
        created_time: {type: DataTypes.DATETIME(3),"comment": "创建时间"},
        created_id: {type: DataTypes.STRING(40),"comment": "创建id"},
        update_time: {type: DataTypes.DATETIME(3),"comment": "更新时间"},
        update_id: {type: DataTypes.STRING(40),"comment": "更新id"},
        valid: {type: DataTypes.TINYINT(1),"comment": "是否有效（1有效；0无效）", defaultValue: "1"},
    }, {timestamps: true, tableName: "dst_user_info"});
    return DstUserInfo;
};
