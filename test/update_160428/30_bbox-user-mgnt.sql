CREATE DATABASE IF NOT EXISTS `BBOX_MAIN`;
USE `BBOX_MAIN`;

CREATE TABLE IF NOT EXISTS `User` (
  `uid`       INT(11) UNSIGNED    NOT NULL  PRIMARY KEY   AUTO_INCREMENT,
  `account`   CHAR(64)            NOT NULL,
  `password`  CHAR(64)            NOT NULL,
  `flags`     INT(5) UNSIGNED     NOT NULL  DEFAULT 0,
  `name`      CHAR(64)            NOT NULL,
  `title`     CHAR(64),
  `profile`   TEXT,
  `memo`      TEXT,

  UNIQUE KEY account (account),
  KEY flags (flags),
  KEY name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `Group` (
  `gid`       INT(11) UNSIGNED    NOT NULL  PRIMARY KEY   AUTO_INCREMENT,
  `flags`     INT(5) UNSIGNED     NOT NULL  DEFAULT 0,
  `title`     CHAR(64)            NOT NULL,
  `descript`  TEXT,
  `memo`      TEXT,

  KEY flags (flags)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `Group_Map` (
  `uid`       INT(11) UNSIGNED    NOT NULL,
  `gid`       INT(11) UNSIGNED    NOT NULL,
  `is_admin`  BOOLEAN,

  KEY uid (uid),
  KEY gid (gid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
