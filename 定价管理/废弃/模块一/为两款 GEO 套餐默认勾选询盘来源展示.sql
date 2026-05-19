-- 执行要点：

-- 步骤	说明
-- 先查后改
-- 第一步和第二步是只读查询，确认线上实际值后再写 UPDATE
-- 逐条执行
-- 不要批量执行，每步确认结果后再进行下一步
-- <尖括号> 占位
-- 所有 <> 包裹的内容需替换为线上查出的实际值
-- 回滚方案
-- 执行 UPDATE 前备份原始 EXTEND_JSON，万一有误可还原

-- ============================================================
-- 询盘来源展示 - 套餐集成配置（线上执行脚本）
-- 需求：为两款 GEO 套餐默认勾选"询盘来源展示"
-- 前置条件：phoenix_auth_resource 中已插入 func_show_refer_source 记录
-- ============================================================

-- ==================== 第一步：确认前置数据 ====================

-- 1.1 确认"询盘来源展示"权限记录已存在，记录 AUTH_RESOURCE_ID
SELECT AUTH_RESOURCE_ID, AUTH_NAME, AUTH_DESC
FROM phoenix_auth_resource
WHERE AUTH_NAME = 'func_show_refer_source';
-- ⚠️ 记下返回的 AUTH_RESOURCE_ID，后续 UPDATE 要用（本地为 711，线上可能不同）

-- 1.2 查找两款 GEO 套餐，确认 PLAN_ID
SELECT PLAN_ID, PLAN_NAME
FROM phoenix_service_plan
WHERE PLAN_NAME IN ('营销型网站GEO运营服务-进阶版', '外贸企业GEO × SEO服务双擎版');
-- ⚠️ 记下返回的两个 PLAN_ID（本地为 1534 等，线上可能不同）

-- ==================== 第二步：查看当前 supportModel ====================

-- 2.1 查看两个套餐当前的 EXTEND_JSON（用上一步查到的 PLAN_ID 替换）
SELECT PLAN_ID, PLAN_NAME, EXTEND_JSON
FROM phoenix_service_plan
WHERE PLAN_ID IN (<套餐1_PLAN_ID>, <套餐2_PLAN_ID>);
-- ⚠️ 从结果中提取 supportModel 的当前值，确认末尾的 AUTH_RESOURCE_ID 列表
-- ⚠️ 确认列表中不包含新的 AUTH_RESOURCE_ID（避免重复追加）

-- ==================== 第三步：更新套餐配置 ====================

-- 3.1 更新"外贸企业GEO × SEO服务双擎版"
-- ⚠️ 将下面的 <现有supportModel值> 替换为第二步查出的实际值
-- ⚠️ 将 <新AUTH_RESOURCE_ID> 替换为第一步查出的实际值
UPDATE phoenix_service_plan
SET EXTEND_JSON = REPLACE(
    EXTEND_JSON,
    '"supportModel":"<现有supportModel值>"',
    '"supportModel":"<现有supportModel值>|<新AUTH_RESOURCE_ID>"'
)
WHERE PLAN_ID = <套餐1_PLAN_ID>;

-- 3.2 更新"营销型网站GEO运营服务-进阶版"
UPDATE phoenix_service_plan
SET EXTEND_JSON = REPLACE(
    EXTEND_JSON,
    '"supportModel":"<现有supportModel值>"',
    '"supportModel":"<现有supportModel值>|<新AUTH_RESOURCE_ID>"'
)
WHERE PLAN_ID = <套餐2_PLAN_ID>;

-- ==================== 第四步：验证 ====================

SELECT PLAN_ID, PLAN_NAME, EXTEND_JSON
FROM phoenix_service_plan
WHERE PLAN_ID IN (<套餐1_PLAN_ID>, <套餐2_PLAN_ID>);
-- ✅ 确认 supportModel 末尾已追加新的 AUTH_RESOURCE_ID