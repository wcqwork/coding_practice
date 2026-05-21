-- ============================================================
-- 询盘来源展示 - 套餐集成配置（线上执行脚本）
-- 需求：为两款 GEO 套餐默认勾选"询盘来源展示"
-- 前置条件：phoenix_func_price 中 OPERATE_TYPE='78' 的记录已启用
-- ============================================================

-- ==================== 第一步：确认前置数据 ====================

-- 1.1 确认"询盘来源展示"功能记录已存在，记录 FUNC_ID
SELECT FUNC_ID, FUNC_NAME, OPERATE_TYPE
FROM phoenix_func_price
WHERE OPERATE_TYPE = '78' AND CATE_ID = '5';
-- ⚠️ 记下返回的 FUNC_ID，后续 UPDATE 要用（本地为 2064，线上可能不同）

-- 1.2 查找两款 GEO 套餐，确认 PLAN_ID
SELECT PLAN_ID, PLAN_NAME
FROM phoenix_service_plan
WHERE PLAN_NAME LIKE '%GEO%运营%'
   OR PLAN_NAME LIKE '%GEO%SEO%';
-- ⚠️ 记下返回的两个 PLAN_ID（本地为 1534 等，线上可能不同）

-- ==================== 第二步：查看当前 supportFunc ====================

-- 2.1 查看两个套餐当前的 EXTEND_JSON（用上一步查到的 PLAN_ID 替换）
SELECT PLAN_ID, PLAN_NAME, EXTEND_JSON
FROM phoenix_service_plan
WHERE PLAN_ID IN (<套餐1_PLAN_ID>, <套餐2_PLAN_ID>);
-- ⚠️ 从结果中提取 supportFunc 的当前值
-- ⚠️ 确认列表中不包含新的 FUNC_ID（避免重复追加）

-- ==================== 第三步：更新套餐配置 ====================

-- ⚠️ 根据第二步查出的 supportFunc 值，选择对应情况执行

-- === 情况A：supportFunc 为空（值为 ""） ===

-- 3.1 更新"外贸企业GEO × SEO服务双擎版"
UPDATE phoenix_service_plan
SET EXTEND_JSON = REPLACE(
    EXTEND_JSON,
    '"supportFunc":""',
    '"supportFunc":"<FUNC_ID>"'
)
WHERE PLAN_ID = <套餐1_PLAN_ID>;

-- 3.2 更新"营销型网站GEO运营服务-进阶版"
UPDATE phoenix_service_plan
SET EXTEND_JSON = REPLACE(
    EXTEND_JSON,
    '"supportFunc":""',
    '"supportFunc":"<FUNC_ID>"'
)
WHERE PLAN_ID = <套餐2_PLAN_ID>;

-- === 情况B：supportFunc 已有值（如 "494|534"） ===

-- 3.1 更新"外贸企业GEO × SEO服务双擎版"
UPDATE phoenix_service_plan
SET EXTEND_JSON = REPLACE(
    EXTEND_JSON,
    '"supportFunc":"<现有supportFunc值>"',
    '"supportFunc":"<现有supportFunc值>|<FUNC_ID>"'
)
WHERE PLAN_ID = <套餐1_PLAN_ID>;

-- 3.2 更新"营销型网站GEO运营服务-进阶版"
UPDATE phoenix_service_plan
SET EXTEND_JSON = REPLACE(
    EXTEND_JSON,
    '"supportFunc":"<现有supportFunc值>"',
    '"supportFunc":"<现有supportFunc值>|<FUNC_ID>"'
)
WHERE PLAN_ID = <套餐2_PLAN_ID>;

-- ==================== 第四步：验证 ====================

SELECT PLAN_ID, PLAN_NAME, EXTEND_JSON
FROM phoenix_service_plan
WHERE PLAN_ID IN (<套餐1_PLAN_ID>, <套餐2_PLAN_ID>);
-- ✅ 确认 supportFunc 中已包含新的 FUNC_ID