#sequelize常用操作

#### SELECT、DELETE、UPDATE

| sql    | orm                                                   |
| ------ | ----------------------------------------------------- |
| select | findAll,findOne,findById,findOrCreate,findAndCountAll |
| delete | destroy                                               |
| update | update                                                |
| insert | create                                                |

| sql                               | orm                                                          |
| --------------------------------- | ------------------------------------------------------------ |
| SELECT foo, bar ...               | Model.findAll({attributes: ['foo', 'bar']});                 |
| SELECT foo, bar AS baz ...        | Model.findAll({attributes: ['foo', **['bar', 'baz']**]});    |
| SELECT COUNT(hats) AS no_hats ... | Model.findAll({attributes: [[**sequelize.fn('COUNT', sequelize.col('hats'))**, 'no_hats']]}); |
| SELECT id, foo, bar, quz ...      | Model.findAll({attributes: {**exclude**: ['baz'] }});        |

```
Model.findAll({
  attributes: ['id', 'foo', 'bar', 'baz', 'quz', [sequelize.fn('COUNT', sequelize.col('hats')), 'no_hats']]
});
//等于
Model.findAll({
  attributes: { include: [[sequelize.fn('COUNT', sequelize.col('hats')), 'no_hats']] }
});

SELECT id, foo, bar, baz, quz, COUNT(hats) AS no_hats ...
```

#### WHERE

| sql                                                          | orm                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------- |
| SELECT * FROM post WHERE authorId = 12 AND status = 'active' | Post.findAll({where: { authorId: 2,status: 'active'}}); |

#### Operators

```
Post.update({
  updatedAt: null,
}, {
  where: {
    deletedAt: {
      $ne: null
    }
  }
});
// UPDATE post SET updatedAt = null WHERE deletedAt NOT NULL;

Post.findAll({
  where: sequelize.where(sequelize.fn('char_length', sequelize.col('status')), 6)
});
// SELECT * FROM post WHERE char_length(status) = 6;

{
  rank: {
    $or: {
      $lt: 1000,
      $eq: null
    }
  }
}
// rank < 1000 OR rank IS NULL

{
  createdAt: {
    $lt: new Date(),
    $gt: new Date(new Date() - 24 * 60 * 60 * 1000)
  }
}
// createdAt < [timestamp] AND createdAt > [timestamp]

{
  $or: [
    {
      title: {
        $like: 'Boat%'
      }
    },
    {
      description: {
        $like: '%boat%'
      }
    }
  ]
}
// title LIKE 'Boat%' OR description LIKE '%boat%'
```

| op                             | define                                                       |
| ------------------------------ | ------------------------------------------------------------ |
| $and: {a: 5}                   | AND (a = 5)                                                  |
| $or: [{a: 5}, {a: 6}]          | (a = 5 OR a = 6)                                             |
| $gt: 6,                        | > 6                                                          |
| $gte: 6,                       | >= 6                                                         |
| $lt: 10,                       | < 10                                                         |
| $lte: 10,                      | <= 10                                                        |
| $ne: 20,                       | != 20                                                        |
| $between: [6, 10],             | BETWEEN 6 AND 10                                             |
| $notBetween: [11, 15],         | NOT BETWEEN 11 AND 15                                        |
| $in: [1, 2],                   | IN [1, 2]                                                    |
| $notIn: [1, 2],                | NOT IN [1, 2]                                                |
| $like: '%hat',                 | LIKE '%hat'                                                  |
| $notLike: '%hat'               | NOT LIKE '%hat'                                              |
| $iLike: '%hat'                 | ILIKE '%hat' (case insensitive) (PG only)                    |
| $notILike: '%hat'              | NOT ILIKE '%hat'  (PG only)                                  |
| $like: { $any: ['cat', 'hat']} | LIKE ANY ARRAY['cat', 'hat'] - also works for iLike and notLike |
| $overlap: [1, 2]               | && [1, 2] (PG array overlap operator)                        |
| $contains: [1, 2]              | @> [1, 2] (PG array contains operator)                       |
| $contained: [1, 2]             | <@ [1, 2] (PG array contained by operator)                   |
| $any: [2,3]                    | ANY ARRAY[2, 3]::INTEGER (PG only)                           |
| $col: 'user.organization_id'   | "user"."organization_id", with dialect specific column identifiers, PG in this example  --$col取表的字段 |

#### WARNING

`tabel need primarykey`:如果没有，Sequlize会自己加个自增主键，可能引起错误

#### Node

`findOrCreate`: 查到一个，查不到就新建

```
  models.BrandReview.findOrCreate({
      where: {
          mem_id: mem_id,
          brand_id: brand_id
      },
      defaults: {
          score: score //新建的数据
      }
  })
 //返回值为数组，[json,created] 第一位是查询或创建的数据，第二位标识是否新建
 
```

`update`:返回值为数据，[2],数字代码改动记录数

`destroy`:返回数字，代表删除记录数
