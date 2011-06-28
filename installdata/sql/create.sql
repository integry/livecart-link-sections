# ---------------------------------------------------------------------- #
# Script generated with: DeZign for Databases v5.2.2                     #
# Target DBMS:           MySQL 4                                         #
# Project file:          footer-links.dez                                #
# Project name:                                                          #
# Author:                                                                #
# Script type:           Database creation script                        #
# Created on:            2009-10-01 03:23                                #
# Model version:         Version 2009-10-01                              #
# ---------------------------------------------------------------------- #


# ---------------------------------------------------------------------- #
# Tables                                                                 #
# ---------------------------------------------------------------------- #

# ---------------------------------------------------------------------- #
# Add table "FooterLinkGroup"                                            #
# ---------------------------------------------------------------------- #

CREATE TABLE FooterLinkGroup (
    ID INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    name TEXT,
    position INTEGER,
    CONSTRAINT PK_FooterLinkGroup PRIMARY KEY (ID)
)
ENGINE = INNODB CHARACTER SET utf8 COLLATE utf8_general_ci;

# ---------------------------------------------------------------------- #
# Add table "FooterLink"                                                 #
# ---------------------------------------------------------------------- #

CREATE TABLE FooterLink (
    ID INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    footerLinkGroupID INTEGER UNSIGNED,
    isNewWindow BOOL,
    title TEXT,
    url TEXT,
    position INTEGER,
    CONSTRAINT PK_FooterLink PRIMARY KEY (ID)
)
ENGINE = INNODB CHARACTER SET utf8 COLLATE utf8_general_ci;

# ---------------------------------------------------------------------- #
# Foreign key constraints                                                #
# ---------------------------------------------------------------------- #

ALTER TABLE FooterLink ADD CONSTRAINT FooterLinkGroup_FooterLink 
    FOREIGN KEY (footerLinkGroupID) REFERENCES FooterLinkGroup (ID) ON DELETE CASCADE ON UPDATE CASCADE;
