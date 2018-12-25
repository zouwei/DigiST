/**
 * dst_user_info ORM实例对象
 */
module.exports = exports = function (sequelize, DataTypes) {
    const UserInfo = sequelize.define("UserInfo", {
        id: {type: DataTypes.STRING(50),"comment": "主键ID", primaryKey: true, allowNull: false},
        wallet_id: {type: DataTypes.STRING(60),"comment": "钱包地址"},
        password: {type: DataTypes.STRING(1024),"comment": "登录密码"},
        pay_password: {type: DataTypes.STRING(1024),"comment": "支付密码"},
        name: {type: DataTypes.STRING(32),"comment": "姓名"},
        mobile: {type: DataTypes.STRING(22),"comment": "手机号码"},
        is_mobile_auth: {type: DataTypes.TINYINT(4),"comment": "是否手机认证:1表示已认证、0表示未认证"},
        email: {type: DataTypes.STRING(60),"comment": "邮箱"},
        is_email_auth: {type: DataTypes.TINYINT(4),"comment": "是否邮箱认证：1表示已认证、0表示未认证"},
        idcard: {type: DataTypes.STRING(20),"comment": "身份证"},
        is_idcard_auth: {type: DataTypes.TINYINT(4),"comment": "是否身份证认证"},
        second_auth_info: {type: DataTypes.JSON,"comment": "第二级认证信息：1表示已认证、0表示未认证"},
        is_second_auth: {type: DataTypes.TINYINT(4),"comment": "1表示已认证、0表示未认证"},
        third_auth_info: {type: DataTypes.JSON,"comment": "第三级认证信息"},
        is_third_auth: {type: DataTypes.TINYINT(4),"comment": "是否第三级认证：1表示已认证、0表示未认证"},
        remark: {type: DataTypes.STRING(400),"comment": "备注"},
        created_time: {type: DataTypes.DATE,"comment": "创建时间"},
        created_id: {type: DataTypes.STRING(40),"comment": "创建id"},
        update_time: {type: DataTypes.DATE,"comment": "更新时间"},
        update_id: {type: DataTypes.STRING(40),"comment": "更新id"},
        valid: {type: DataTypes.TINYINT(1),"comment": "是否有效（1有效；0无效）", defaultValue: "1"},
    }, {timestamps: false, tableName: "dst_user_info"});

    return UserInfo;
};
