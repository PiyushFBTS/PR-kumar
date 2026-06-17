-- AlterEnum: append the new ApplyType members (TiDB allows adding enum members
-- to the end) and switch the JobPosting default to QUALIFIED.
ALTER TABLE `JobApplication`
  MODIFY `applyType` ENUM('JOB', 'INTERNSHIP', 'ARTICLESHIP', 'QUALIFIED', 'SEMI_QUALIFIED', 'PAID_ASSOCIATE') NOT NULL;

ALTER TABLE `JobPosting`
  MODIFY `type` ENUM('JOB', 'INTERNSHIP', 'ARTICLESHIP', 'QUALIFIED', 'SEMI_QUALIFIED', 'PAID_ASSOCIATE') NOT NULL DEFAULT 'QUALIFIED';
