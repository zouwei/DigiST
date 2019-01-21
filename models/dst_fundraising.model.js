/**
 * dst_fundraising ORM实例对象
 */
module.exports = exports = function (sequelize, DataTypes) {
    const Fundraising = sequelize.define("Fundraising", {
        id: {type: DataTypes.STRING(50),"comment": "主键ID", primaryKey: true, allowNull: false},
        user_id: {type: DataTypes.STRING(50),"comment": "用户id"},
        company_name: {type: DataTypes.STRING(120),"comment": "公司全称"},
        company_description: {type: DataTypes.STRING(800),"comment": "公司简介"},
        corporate: {type: DataTypes.STRING(40),"comment": "公司法人名称"},
        company_contact: {type: DataTypes.STRING(20),"comment": "公司联系方式"},
        company_emergency_contact: {type: DataTypes.STRING(20),"comment": "公司紧急联系方式"},
        pledged_stock: {type: DataTypes.FLOAT,"comment": "质押股票比例（百分比）"},
        project_name: {type: DataTypes.STRING(80),"comment": "项目名称"},
        project_description: {type: DataTypes.STRING(800),"comment": "项目简介"},
        project_file: {type: DataTypes.JSON,"comment": "项目文件"},
        project_val: {type: DataTypes.BIGINT(20),"comment": "项目估值（货币单位：分）"},
        currency: {type: DataTypes.STRING(3),"comment": "发行项目估值货币单位：CNY、USD……（参考世界各国货币名称符号大全）"},
        from_address: {type: DataTypes.STRING(80),"comment": "合约发起人地址"},
        contract_address: {type: DataTypes.STRING(80),"comment": "合约地址"},
        project_token: {type: DataTypes.STRING(20),"comment": "项目代币：MANA/TRUE"},
        contract_type: {type: DataTypes.STRING(10),"comment": "合约类型"},
        license_type: {type: DataTypes.STRING(20),"comment": "牌照类型"},
        project_scale: {type: DataTypes.FLOAT(12, 4),"comment": "筹集规模（货币单位：分）"},
        project_mode: {type: DataTypes.STRING(20),"comment": "筹集规模式:项目收益权、项目收益权"},
        minimum_subscription: {type: DataTypes.BIGINT(20),"comment": "最低认购数量"},
        investment_period: {type: DataTypes.STRING(8),"comment": "投资年限:3Y（最后一位表示日期单位：Y、M、D，分别表示年、月、日）"},
        equity_income: {type: DataTypes.FLOAT,"comment": "股权收益权（单位：百分比）"},
        exit_early: {type: DataTypes.STRING(40),"comment": "提前退出窗口"},
        project_status: {type: DataTypes.STRING(20),"comment": "项目状态:new、voting、raise、finished、fail、closed"},
        follow: {type: DataTypes.INTEGER,"comment": "关注度"},
        vote_target: {type: DataTypes.INTEGER,"comment": "选票目标"},
        subscribed_quantity: {type: DataTypes.FLOAT(12, 4),"comment": "已认购数量"},
        subscribed_frequency: {type: DataTypes.INTEGER,"comment": "已认购次数"},
        vote: {type: DataTypes.INTEGER,"comment": "选票"},
        remark: {type: DataTypes.STRING(400),"comment": "备注"},
        created_time: {type: DataTypes.DATE,"comment": "创建时间"},
        created_id: {type: DataTypes.STRING(40),"comment": "创建id"},
        update_time: {type: DataTypes.DATE,"comment": "更新时间"},
        update_id: {type: DataTypes.STRING(40),"comment": "更新id"},
        valid: {type: DataTypes.TINYINT(1),"comment": "是否有效（1有效；0无效）", defaultValue: "1"},
    }, {timestamps: false, tableName: "dst_fundraising"});

    return Fundraising;
};
