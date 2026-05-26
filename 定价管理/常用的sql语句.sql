-- 域名查询站点信息
SELECT d.DOMAIN_RECORD, d.COM_ID, d.LAN_CODE, d.SITE_SETTING_ID,
       s.ORGANIZATION_ID
FROM phoenix_site_domain d
         JOIN phoenix_site s ON d.COM_ID = s.COM_ID
WHERE d.DOMAIN_RECORD LIKE '%en.dreamwang.ldmfyh.com%';

-- 站点开通的所有功能
SELECT ss.SITE_SETTING_ID, ss.LAN_CODE,
       fr.FUNC_ID, fp.FUNC_NAME, fr.USE_STATUS, fr.EXPIRE_TIME
FROM phoenix_site_setting ss
         JOIN phoenix_func_relation fr ON fr.SITE_SETTING_ID = ss.SITE_SETTING_ID
         JOIN phoenix_func_price fp ON fr.FUNC_ID = fp.FUNC_ID
WHERE ss.COM_ID = 102394;

-- 功能定价表 展示询盘来源
SELECT * FROM phoenix_func_price WHERE OPERATE_TYPE = '78'

--  显示已开通'展示询盘来源'的客户
SELECT r.RELATION_ID, r.COM_ID, r.SITE_SETTING_ID, r.ORGANIZATION_ID,
       r.FUNC_ID, r.USE_STATUS, r.EXPIRE_TIME, r.ADD_TIME,
       p.FUNC_NAME, p.OPERATE_TYPE
FROM phoenix_func_relation r
JOIN phoenix_func_price p ON r.FUNC_ID = p.FUNC_ID
WHERE p.OPERATE_TYPE = '78';

SELECT COUNT(*)
FROM phoenix_func_relation r
JOIN phoenix_func_price p ON r.FUNC_ID = p.FUNC_ID
WHERE p.OPERATE_TYPE = '78';