/**
 * dst_invest ORM实例对象
 */
module.exports = exports = function (sequelize, DataTypes) {
    const DstInvest = sequelize.define("DstInvest", {
        id: {type: DataTypes.STRING(50),"comment": "主键ID", primaryKey: true, allowNull: false},
        project_id: {type: DataTypes.STRING(50),"comment": "项目id"},
        project_name: {type: DataTypes.STRING(80),"comment": "项目名称"},
        subscription_quantity: {type: DataTypes.INT(11),"comment": "认购数量"},
        remark: {type: DataTypes.STRING(400),"comment": "备注"},
        created_time: {type: DataTypes.DATETIME(3),"comment": "创建时间"},
        created_id: {type: DataTypes.STRING(40),"comment": "创建id"},
        update_time: {type: DataTypes.DATETIME(3),"comment": "更新时间"},
        update_id: {type: DataTypes.STRING(40),"comment": "更新id"},
        valid: {type: DataTypes.TINYINT(1),"comment": "是否有效（1有效；0无效）", defaultValue: "1"},
    }, {timestamps: true, tableName: "dst_invest"});
    return DstInvest;
};
