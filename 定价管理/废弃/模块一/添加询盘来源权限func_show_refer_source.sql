-- 前置检查：确认不存在重复记录
SELECT * FROM phoenix_auth_resource WHERE AUTH_NAME = 'func_show_refer_source';

-- 新增"询盘来源展示"到套餐管理 > 普通模块
INSERT INTO phoenix_auth_resource (
    AUTH_NAME,
    AUTH_TYPE,
    AUTH_URL,
    AUTH_DESC,
    AUTH_STATUS,
    SUPPORT_PLAN,
    AUTH_PRICE,
    SHOW_STATUS
) VALUES (
             'func_show_refer_source',   -- AUTH_NAME: 功能别名（唯一标识）
             '1',                         -- AUTH_TYPE: 功能类型
             '',                          -- AUTH_URL: 无需URL
             '询盘来源展示',               -- AUTH_DESC: 页面显示名称（即勾选框文本）
             '1',                         -- AUTH_STATUS: 启用
             '1',                         -- SUPPORT_PLAN: 支持套餐配置
             0.00,                        -- AUTH_PRICE: 价格0元
             '1'                          -- SHOW_STATUS: 显示
         );

-- 验证插入结果
SELECT AUTH_RESOURCE_ID, AUTH_NAME, AUTH_DESC, AUTH_STATUS, AUTH_TYPE, SUPPORT_PLAN, AUTH_PRICE
FROM phoenix_auth_resource
WHERE AUTH_NAME = 'func_show_refer_source';