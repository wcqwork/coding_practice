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