CREATE TABLE `domains` (
  `id`          int(11)         NOT NULL        AUTO_INCREMENT          COMMENT 'physical primary key',
  `domain`      varchar(64)     NOT NULL                                COMMENT 'url domain',
  `create_by`   int(11)         NOT NULL                                COMMENT 'sso user_id',
  `update_at`   timestamp       NOT NULL        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'last updated time',
  `create_at`   timestamp       NOT NULL        DEFAULT CURRENT_TIMESTAMP COMMENT 'created time',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_domain`                        (`domain`),
  KEY `ix_create_at`                            (`create_at`),
  KEY `ix_update_at`                            (`update_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'domain list';

CREATE TABLE `keys` (
  `id`          int(11)         NOT NULL        AUTO_INCREMENT          COMMENT 'physical primary key',
  `domain`      varchar(64)     NOT NULL                                COMMENT 'url domain',
  `path`        varchar(64)     NOT NULL                                COMMENT 'url path',
  `name`        varchar(64)     NOT NULL                                COMMENT 'field name',
  `comment`     varchar(128)    NOT NULL        DEFAULT ''              COMMENT 'comment',
  `value`       varchar(10240)  NOT NULL                                COMMENT 'json value',
  `type`        tinyint(4)      NOT NULL                                COMMENT 'the type of value',
  `create_by`   int(11)         NOT NULL                                COMMENT 'sso user_id',
  `is_delete`   tinyint(4)      NOT NULL        DEFAULT 0               COMMENT 'delete flag',
  `publish_at`  timestamp       NOT NULL        DEFAULT 0               COMMENT 'published time',
  `update_at`   timestamp       NOT NULL        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'last updated time',
  `create_at`   timestamp       NOT NULL        DEFAULT CURRENT_TIMESTAMP COMMENT 'created time',
  PRIMARY KEY (`id`),
  KEY `ix_is_delete_domain_path_name`           (`is_delete`, `domain`, `path`, `name`),
  KEY `ix_create_at`                            (`create_at`),
  KEY `ix_update_at`                            (`update_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'all keys and values';

CREATE TABLE `changelog` (
  `id`          int(11)         NOT NULL        AUTO_INCREMENT          COMMENT 'physical primary key',
  `key_id`      int(11)         NOT NULL                                COMMENT 'which key is changed',
  `value`       varchar(10240)  NOT NULL                                COMMENT 'changed value',
  `create_by`   int(11)         NOT NULL                                COMMENT 'sso user_id',
  `update_at`   timestamp       NOT NULL        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'last updated time',
  `create_at`   timestamp       NOT NULL        DEFAULT CURRENT_TIMESTAMP COMMENT 'created time',
  PRIMARY KEY (`id`),
  KEY `ix_key_id_create_at`                     (`key_id`, `create_at` DESC),
  KEY `ix_create_at`                            (`create_at`),
  KEY `ix_update_at`                            (`update_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'the change log of keys table';

CREATE TABLE `publishlog` (
  `id`          int(11)         NOT NULL        AUTO_INCREMENT          COMMENT 'physical primary key',
  `domain`      varchar(64)     NOT NULL                                COMMENT 'associate with domains.doman',
  `create_by`   int(11)         NOT NULL                                COMMENT 'sso user_id',
  `update_at`   timestamp       NOT NULL        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'last updated time',
  `create_at`   timestamp       NOT NULL        DEFAULT CURRENT_TIMESTAMP COMMENT 'created time',
  PRIMARY KEY (`id`),
  KEY `ix_domain`                               (`domain`),
  KEY `ix_create_by`                            (`create_by`),
  KEY `ix_create_at`                            (`create_at`),
  KEY `ix_update_at`                            (`update_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'publish log';

CREATE TABLE `publishdata` (
  `id`          int(11)         NOT NULL        AUTO_INCREMENT          COMMENT 'physical primary key',
  `publish_id`  int(11)         NOT NULL                                COMMENT 'associate with publishlog.id',
  `path`        varchar(64)     NOT NULL                                COMMENT 'published url path',
  `name`        varchar(64)     NOT NULL                                COMMENT 'published field name',
  `value`       varchar(10240)  NOT NULL                                COMMENT 'published value',
  `update_at`   timestamp       NOT NULL        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'last updated time',
  `create_at`   timestamp       NOT NULL        DEFAULT CURRENT_TIMESTAMP COMMENT 'created time',
  PRIMARY KEY (`id`),
  KEY `ix_publish_id`                           (`publish_id`),
  KEY `ix_create_at`                            (`create_at`),
  KEY `ix_update_at`                            (`update_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'the data of publish log';

CREATE TABLE `privilege` (
  `id`          int(11)         NOT NULL        AUTO_INCREMENT          COMMENT 'physical primary key',
  `domain`      varchar(64)     NOT NULL                                COMMENT 'url domain',
  `user_id`     int(11)         NOT NULL                                COMMENT 'sso user_id',
  `create_by`   int(11)         NOT NULL                                COMMENT 'creator (sso user_id) of current record',
  `update_at`   timestamp       NOT NULL        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'last updated time',
  `create_at`   timestamp       NOT NULL        DEFAULT CURRENT_TIMESTAMP COMMENT 'created time',
  PRIMARY KEY (`id`),
  KEY `ix_user_id`                              (`user_id`),
  UNIQUE KEY `uk_domain_user_id`                (`domain`, `user_id`),
  KEY `ix_create_at`                            (`create_at`),
  KEY `ix_update_at`                            (`update_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'privilege for domain';
