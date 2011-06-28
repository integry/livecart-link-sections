# ---------------------------------------------------------------------- #
# Script generated with: DeZign for Databases v5.2.2                     #
# Target DBMS:           MySQL 4                                         #
# Project file:          footer-links.dez                                #
# Project name:                                                          #
# Author:                                                                #
# Script type:           Database drop script                            #
# Created on:            2009-10-01 03:23                                #
# Model version:         Version 2009-10-01                              #
# ---------------------------------------------------------------------- #


# ---------------------------------------------------------------------- #
# Drop foreign key constraints                                           #
# ---------------------------------------------------------------------- #

ALTER TABLE FooterLink DROP FOREIGN KEY FooterLinkGroup_FooterLink;

# ---------------------------------------------------------------------- #
# Drop table "FooterLinkGroup"                                           #
# ---------------------------------------------------------------------- #

# Remove autoinc for PK drop #

ALTER TABLE FooterLinkGroup MODIFY ID INTEGER UNSIGNED NOT NULL;

# Drop constraints #

ALTER TABLE FooterLinkGroup DROP PRIMARY KEY;

# Drop table #

DROP TABLE FooterLinkGroup;

# ---------------------------------------------------------------------- #
# Drop table "FooterLink"                                                #
# ---------------------------------------------------------------------- #

# Remove autoinc for PK drop #

ALTER TABLE FooterLink MODIFY ID INTEGER UNSIGNED NOT NULL;

# Drop constraints #

ALTER TABLE FooterLink DROP PRIMARY KEY;

# Drop table #

DROP TABLE FooterLink;
