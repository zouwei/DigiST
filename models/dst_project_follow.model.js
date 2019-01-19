/**
 * dst_project_follow ORM实例对象
 */
module.exports = exports = function (sequelize, DataTypes) {
    const ProjectFollow = sequelize.define("ProjectFollow", {
        id: {type: DataTypes.STRING(50),"comment": "主键ID", primaryKey: true, allowNull: false},
        fundraising_id: {type: DataTypes.STRING(50),"comment": "募资项目id"},
        user_id: {type: DataTypes.STRING(50),"comment": "用户id"},
        remark: {type: DataTypes.STRING(400),"comment": "备注"},
        created_time: {type: DataTypes.DATE,"comment": "创建时间"},
        created_id: {type: DataTypes.STRING(40),"comment": "创建id"},
        update_time: {type: DataTypes.DATE,"comment": "更新时间"},
        update_id: {type: DataTypes.STRING(40),"comment": "更新id"},
        valid: {type: DataTypes.TINYINT(1),"comment": "是否有效（1有效；0无效）", defaultValue: "1"},
    }, {timestamps: false, tableName: "dst_project_follow"});

    return ProjectFollow;
};
