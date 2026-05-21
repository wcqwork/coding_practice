-- 查指定 COM_ID 是否有"询盘来源展示"权限
SELECT r.RELATION_ID, r.COM_ID, r.SITE_SETTING_ID, r.EXPIRE_TIME
FROM phoenix_func_relation r
         JOIN phoenix_func_price p ON r.FUNC_ID = p.FUNC_ID
WHERE p.OPERATE_TYPE = '78'
  AND r.COM_ID = 4919;

-- 删除指定 COM_ID 的"询盘来源展示"权限
DELETE FROM phoenix_func_relation
WHERE COM_ID = 4919
  AND FUNC_ID = 2064;

-- 查看所有开通询盘来源展示的记录
SELECT r.RELATION_ID, r.COM_ID, r.SITE_SETTING_ID, r.ORGANIZATION_ID,
       r.FUNC_ID, r.USE_STATUS, r.EXPIRE_TIME, r.ADD_TIME
FROM phoenix_func_relation r
         JOIN phoenix_func_price p ON r.FUNC_ID = p.FUNC_ID
WHERE p.OPERATE_TYPE = '78'
ORDER BY r.RELATION_ID DESC;

-- 查看询盘来源展示
SELECT FUNC_ID, FUNC_NAME, CATE_ID, GROUP_ID, FUNC_STATUS, OPERATE_TYPE
FROM phoenix_func_price
WHERE OPERATE_TYPE = '78';

-- 关闭 COM_ID=4919 的"展示询盘来源"权限（USE_STATUS 改为 '1' 即停用）
UPDATE phoenix_func_relation
SET USE_STATUS = '1', UPDATE_TIME = NOW(), UPDATER_NAME = 'test', UPDATER_NO = 'test'
WHERE COM_ID = 4919 AND FUNC_ID = 2064;

-- 验证
SELECT COM_ID, FUNC_ID, USE_STATUS, UPDATE_TIME
FROM phoenix_func_relation
WHERE COM_ID = 4919 AND FUNC_ID = 2064;
-- 预期：USE_STATUS = '1'

-- 下单记录
select * from phoenix_syn_order_queue order by ADD_TIME desc;

--功能开通关系表phoenix_func_relation
-- 组织级-订单开通记录 ORGANIZATION_ID下。组织级：COM_ID = -1, SITE_SETTING_ID = -1, ORGANIZATION_ID > 0 — 绑定到整个组织
select * from phoenix_func_relation where ORGANIZATION_ID = '521424';

-- 站点级-订单开通记录：COM_ID > 0, SITE_SETTING_ID > 0, ORGANIZATION_ID = -1 — 绑定到具体站点语种
select * from phoenix_func_relation where SITE_SETTING_ID = 876525;

-- 功能定价表
select * from phoenix_func_price where FUNC_ID = 2064;

-- 域名查询站点信息
SELECT d.DOMAIN_RECORD, d.COM_ID, d.LAN_CODE, d.SITE_SETTING_ID,
       s.ORGANIZATION_ID
FROM phoenix_site_domain d
         JOIN phoenix_site s ON d.COM_ID = s.COM_ID
WHERE d.DOMAIN_RECORD LIKE '%test3.imwork.net%';

-- 站点开通的所有功能
SELECT ss.SITE_SETTING_ID, ss.LAN_CODE,
       fr.FUNC_ID, fp.FUNC_NAME, fr.USE_STATUS, fr.EXPIRE_TIME
FROM phoenix_site_setting ss
         JOIN phoenix_func_relation fr ON fr.SITE_SETTING_ID = ss.SITE_SETTING_ID
         JOIN phoenix_func_price fp ON fr.FUNC_ID = fp.FUNC_ID
WHERE ss.COM_ID = 4919;


-- 站点是否开通询盘来源权限
SELECT ss.SITE_SETTING_ID, ss.LAN_CODE,
       fr.FUNC_ID, fp.FUNC_NAME, fr.USE_STATUS, fr.EXPIRE_TIME
FROM phoenix_site_setting ss
         JOIN phoenix_func_relation fr ON fr.SITE_SETTING_ID = ss.SITE_SETTING_ID
         JOIN phoenix_func_price fp ON fr.FUNC_ID = fp.FUNC_ID
WHERE ss.COM_ID = 308136 and fp.OPERATE_TYPE = '78';


--dm刷下单，访问这个 本地启动项目：phoenix_xxl_job
-- http://localhost:8080/phoenix_xxl_job_executor_dm_war_exploded/test/handle

--PK 和 FK 是数据库建模中的标准缩写：
--PK = Primary Key（主键） — 该表的唯一标识字段，每条记录的值都不重复。例如 phoenix_func_price 的 FUNC_ID PK 表示 FUNC_ID 是这张表的主键。
--FK = Foreign Key（外键） — 引用了另一张表的主键，用来表示表之间的关联关系。例如 phoenix_func_relation 的 FUNC_ID FK 表示这个字段关联到 phoenix_func_price.FUNC_ID。
--在这份 ER 图文档中，没有标 PK/FK 的字段就是普通业务字段。