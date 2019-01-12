/**
 * dst_wallet ORM实例对象
 */
module.exports = exports = function (sequelize, DataTypes) {
    const Wallet = sequelize.define("Wallet", {
        id: {type: DataTypes.STRING(50),"comment": "主键ID", primaryKey: true, allowNull: false},
        user_id: {type: DataTypes.STRING(50),"comment": "user_id"},
        address: {type: DataTypes.STRING(64),"comment": "钱包地址"},
        mnemonic: {type: DataTypes.STRING(512),"comment": "助记词（数据加密）"},
        privateKey: {type: DataTypes.STRING(512),"comment": "私钥（数据加密）"},
        balance: {type: DataTypes.FLOAT(12,2),"comment": "余额，仅做数据展示"},
        remark: {type: DataTypes.STRING(400),"comment": "备注"},
        created_time: {type: DataTypes.DATE,"comment": "创建时间"},
        created_id: {type: DataTypes.STRING(40),"comment": "创建id"},
        update_time: {type: DataTypes.DATE,"comment": "更新时间"},
        update_id: {type: DataTypes.STRING(40),"comment": "更新id"},
        valid: {type: DataTypes.TINYINT(1),"comment": "是否有效（1有效；0无效）", defaultValue: "1"},
    }, {timestamps: false, tableName: "dst_wallet"});

    return Wallet;
};
