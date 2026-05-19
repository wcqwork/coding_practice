-- ============================================================
-- 【线上执行】询盘来源展示 - 老体系权限修复
-- 功能说明：启用"询盘来源展示"功能，修复回显及重复购买问题
-- ============================================================

-- 第一步：预检查
SELECT FUNC_ID, FUNC_NAME, CATE_ID, GROUP_ID, OPERATE_TYPE, FUNC_STATUS, FUNC_PRICE, CHARGE_TYPE
FROM phoenix_func_price
WHERE OPERATE_TYPE = '78' AND CATE_ID = '5';
-- 预期：一条记录，FUNC_STATUS=0, CHARGE_TYPE=0

-- 第二步：修复
-- FUNC_STATUS  = 1 → 启用该功能，使其在"增加功能及服务"页面可见
-- CHARGE_TYPE  = 1 → 改为按月计费类型，解决多次购买、回显问题（FUNC_PRICE=0，无费用影响）原值0为按次计费
-- FUNC_NAME 更正 → "展示询盘来源(测试)" 改为正式名称 "询盘来源展示"
UPDATE phoenix_func_price
SET FUNC_STATUS = 1,
    CHARGE_TYPE = 1,
    FUNC_NAME = '询盘来源展示'
WHERE OPERATE_TYPE = '78' AND CATE_ID = '5';

-- 第三步：验证
SELECT FUNC_ID, FUNC_NAME, CATE_ID, GROUP_ID, OPERATE_TYPE, FUNC_STATUS, FUNC_PRICE, CHARGE_TYPE
FROM phoenix_func_price
WHERE OPERATE_TYPE = '78' AND CATE_ID = '5';
-- 预期：FUNC_NAME='询盘来源展示', FUNC_STATUS=1, CHARGE_TYPE=1