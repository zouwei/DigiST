/**
 * dst_invest ORM实例对象
 */
module.exports = exports = function (sequelize, DataTypes) {
    const Invest = sequelize.define("Invest", {
        id: {type: DataTypes.STRING(50),"comment": "主键ID", primaryKey: true, allowNull: false},
        user_id: {type: DataTypes.STRING(50),"comment": "user_id"},
        fundraising_id: {type: DataTypes.STRING(50),"comment": "项目id"},
        project_name: {type: DataTypes.STRING(80),"comment": "项目名称"},
        subscription_quantity: {type: DataTypes.INTEGER,"comment": "认购数量"},
        project_status: {type: DataTypes.STRING(22),"comment": "项目状态"},
        remark: {type: DataTypes.STRING(400),"comment": "备注"},
        created_time: {type: DataTypes.DATE,"comment": "创建时间"},
        created_id: {type: DataTypes.STRING(40),"comment": "创建id"},
        update_time: {type: DataTypes.DATE,"comment": "更新时间"},
        update_id: {type: DataTypes.STRING(40),"comment": "更新id"},
        valid: {type: DataTypes.TINYINT(1),"comment": "是否有效（1有效；0无效）", defaultValue: "1"},
    }, {timestamps: false, tableName: "dst_invest"});

    return Invest;
};
