/**
 * dst_trade ORM实例对象
 */
module.exports = exports = function (sequelize, DataTypes) {
    const Trade = sequelize.define("Trade", {
        id: {type: DataTypes.STRING(50),"comment": "主键ID", primaryKey: true, allowNull: false},
        user_id: {type: DataTypes.STRING(50),"comment": "user_id"},
        wallet_id: {type: DataTypes.STRING(50),"comment": "钱包id"},
        transfer_amount: {type: DataTypes.STRING(32),"comment": "转账金额"}, 
        block_hash: {type: DataTypes.STRING(128),"comment": "blockHash"},
        block_number: {type: DataTypes.INTEGER,"comment": "blockNumber"},
        contract_address: {type: DataTypes.STRING(128),"comment": "contractAddress"},
        cumulative_gas_used: {type: DataTypes.STRING(32),"comment": "cumulativeGasUsed"},
        fromaddress: {type: DataTypes.STRING(128),"comment": "fromaddress"},
        gas_used: {type: DataTypes.STRING(32),"comment": "gasUsed"},
        status: {type: DataTypes.STRING(12),"comment": "status"},
        toaddress: {type: DataTypes.STRING(128),"comment": "toaddress"},
        transaction_hash: {type: DataTypes.STRING(128),"comment": "transactionHash"},
        transaction_index: {type: DataTypes.INTEGER,"comment": "transactionIndex"},
        remark: {type: DataTypes.STRING(400),"comment": "备注"},
        created_time: {type: DataTypes.DATE,"comment": "创建时间"},
        created_id: {type: DataTypes.STRING(40),"comment": "创建id"},
        update_time: {type: DataTypes.DATE,"comment": "更新时间"},
        update_id: {type: DataTypes.STRING(40),"comment": "更新id"},
        valid: {type: DataTypes.TINYINT(1),"comment": "是否有效（1有效；0无效）", defaultValue: "1"},
    }, {timestamps: false, tableName: "dst_trade"});

    return Trade;
};
