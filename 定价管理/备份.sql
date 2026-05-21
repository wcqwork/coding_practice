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


-- 组织级-订单开通记录 ORGANIZATION_ID下。组织级：COM_ID = -1, SITE_SETTING_ID = -1, ORGANIZATION_ID > 0 — 绑定到整个组织
select * from phoenix_func_relation where ORGANIZATION_ID = '521424';

-- 站点级-订单开通记录：COM_ID > 0, SITE_SETTING_ID > 0, ORGANIZATION_ID = -1 — 绑定到具体站点语种
select * from phoenix_func_relation where SITE_SETTING_ID = 876525;

-- 功能表以及功能价格表
select * from phoenix_func_price where FUNC_ID = 2064;


--dm刷下单，访问这个 本地启动项目：phoenix_xxl_job
-- http://localhost:8080/phoenix_xxl_job_executor_dm_war_exploded/test/handle