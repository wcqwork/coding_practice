CREATE TABLE IF NOT EXISTS `phoenix_agent_showcase_featured` (
  `showcase_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  `organization_id` BIGINT NOT NULL,
  `SITE_SETTING_ID` BIGINT NOT NULL COMMENT '网站ID',
  `INDUSTRY_CODES` VARCHAR(255) NOT NULL COMMENT '新行业表编码（非ID）;例如：,1,1,',
  `LOCATION_IDS` VARCHAR(255) NOT NULL COMMENT '地域表中主键ID（区/县级）;例如：,1,1,',
  `site_start_time` TIMESTAMP NOT NULL,
  `site_logon_time` TIMESTAMP NOT NULL,
  `site_pv` INTEGER NOT NULL,
  `site_uv` INTEGER NOT NULL,
  `site_action` INTEGER NOT NULL,
  `site_inquire` INTEGER NOT NULL,
  `site_prod_num` INTEGER NOT NULL,
  `site_article_num` INTEGER NOT NULL,
  `add_time` TIMESTAMP NOT NULL,
  PRIMARY KEY(`showcase_id`)
);

CREATE INDEX `phoenix_agent_showcase_featured_index_0`
ON `phoenix_agent_showcase_featured` (`organization_id`);
CREATE INDEX `phoenix_agent_showcase_featured_index_1`
ON `phoenix_agent_showcase_featured` (`SITE_SETTING_ID`);