SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

DROP DATABASE IF EXISTS `sample_data`;
CREATE DATABASE IF NOT EXISTS `sample_data` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `sample_data`;

-- --------------------------------------------------------

DROP TABLE IF EXISTS `skill_jobrole_association_table`;
DROP TABLE IF EXISTS `skill_course_association_table`;
DROP TABLE IF EXISTS `lj_course_association_table`;

DROP TABLE IF EXISTS `skill`;
CREATE TABLE IF NOT EXISTS `skill` (
  `skill_id` int UNIQUE NOT NULL AUTO_INCREMENT,
  `skill_name` varchar(50) UNIQUE NOT NULL,
  `skill_status` varchar(15) NOT NULL,
  PRIMARY KEY (`skill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `course`;
CREATE TABLE IF NOT EXISTS `course` (
  `course_id` varchar(20) UNIQUE NOT NULL,
  `course_name` varchar(50) UNIQUE NOT NULL,
  `course_desc` varchar(255),
  `course_status` varchar(15) NOT NULL,
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `jobrole`;
CREATE TABLE IF NOT EXISTS `jobrole` (
  `jobrole_id` int UNIQUE NOT NULL AUTO_INCREMENT,
  `jobrole_name` varchar(50) UNIQUE NOT NULL,
  `jobrole_status` varchar(15) NOT NULL,
  PRIMARY KEY (`jobrole_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role` (
  `role_id` int NOT NULL,
  `role_name` varchar(20) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `staff`;
CREATE TABLE IF NOT EXISTS `staff` (
  `staff_id` varchar(6) UNIQUE NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`staff_id`),
  CONSTRAINT `Constr_role_id_fk`
        FOREIGN KEY `Role_fk` (`role_id`) REFERENCES `role` (`role_id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `learning_journey`;
CREATE TABLE IF NOT EXISTS `learning_journey` (
  `lj_id` int NOT NULL auto_increment,
  `staff_id` varchar(6) NOT NULL,
  `jobrole_id` int NOT NULL,
  `jobrole_name` varchar(355),
  PRIMARY KEY (`lj_id`),
  CONSTRAINT `Constr_learning_journey_Staff_fk`
        FOREIGN KEY `Staff_fk` (`staff_id`) REFERENCES `staff` (`staff_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Constr_learning_journey_Jobrole_fk`
        FOREIGN KEY `jobrole_id_fk` (`jobrole_id`) REFERENCES `jobrole` (`jobrole_id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- ASSOCIATION TABLES BELOW -- 
CREATE TABLE IF NOT EXISTS `skill_course_association_table` (
    `skill_id` int NOT NULL,
    `course_id` varchar(20) NOT NULL,

    PRIMARY KEY (`skill_id`, `course_id`),
    CONSTRAINT `Constr_SkillCourse_Skill_fk`
        FOREIGN KEY `Skill_fk` (`skill_id`) REFERENCES `skill` (`skill_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Constr_SkillCourse_Course_fk`
        FOREIGN KEY `Course_fk` (`course_id`) REFERENCES `course` (`course_id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `skill_jobrole_association_table` (
    `skill_id` int NOT NULL,
    `jobrole_id` int NOT NULL,

    PRIMARY KEY (`skill_id`, `jobrole_id`),
    CONSTRAINT `Constr_SkillJobrole_Skill_fk`
        FOREIGN KEY `Skill_fk` (`skill_id`) REFERENCES `skill` (`skill_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Constr_SkillJobrole_JobRole_fk`
        FOREIGN KEY `JobRole_fk` (`jobrole_id`) REFERENCES `jobrole` (`jobrole_id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `lj_course_association_table` (
    `lj_id` int NOT NULL,
    `course_id` varchar(20) NOT NULL,
    `course_completion` varchar(20),
    PRIMARY KEY (`lj_id`, `course_id`),
    CONSTRAINT `Constr_lj_id_fk`
        FOREIGN KEY `LJ_fk` (`lj_id`) REFERENCES `learning_journey` (`lj_id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- Inserting Data to Tables --


INSERT INTO `skill` (`skill_id`, `skill_name`, `skill_status`) VALUES
(1, 'Data Analytics', 'Active'),
(2, 'Customer Service', 'Active'),
(3, 'Conflict Management', 'Active'),
(4, 'DevOps', 'Active'),
(5, 'Project Management', 'Active'),
(6, 'Leadership', 'Retired');

INSERT INTO `course` (`course_id`, `course_name`, `course_desc`, `course_status`) VALUES
    ('COR001','Systems Thinking and Design','This foundation module aims to introduce students to the fundamental concepts and underlying principles of systems thinking,','Active'),
    ('COR002','Lean Six Sigma Green Belt Certification','Apply Lean Six Sigma methodology and statistical tools such as Minitab to be used in process analytics','Active'),
    ('COR004','Service Excellence','The programme provides the learner with the key foundations of what builds customer confidence in the service industr','Pending'),
    ('COR006','Manage Change','Identify risks associated with change and develop risk mitigation plans.','Retired'),
    ('FIN001','Data Collection and Analysis','Data is meaningless unless insights and analysis can be drawn to provide useful information for business decision-making. It is imperative that data quality, integrity and security ','Active'),
    ('FIN002','Risk and Compliance Reporting','Regulatory reporting is a requirement for businesses from highly regulated sectors to demonstrate compliance with the necessary regulatory provisions.','Active'),
    ('FIN003','Business Continuity Planning','Business continuity planning is essential in any business to minimise loss when faced with potential threats and disruptions.','Retired'),
    ('HRD001','Leading and Shaping a Culture in Learning','This training programme, delivered by the National Centre of Excellence (Workplace Learning), aims to equip participants with the skills and knowledge of the National workplace learning certification framework,','Active'),
    ('MGT001','People Management','enable learners to manage team performance and development through effective communication, conflict resolution and negotiation skills.','Active'),
    ('MGT002','Workplace Conflict Management for Professionals','This course will address the gaps to build consensus and utilise knowledge of conflict management techniques to diffuse tensions and achieve resolutions effectively in the best interests of the organisation.','Active'),
    ('MGT003','Enhance Team Performance Through Coaching','The course aims to upskill real estate team leaders in the area of service coaching for performance.','Pending'),
    ('MGT004','Personal Effectiveness for Leaders','Learners will be able to acquire the skills and knowledge to undertake self-assessment in relation to ones performance and leadership style','Active'),
    ('MGT007','Supervisory Management Skills','Supervisors lead teams, manage tasks, solve problems, report up and down the hierarchy, and much more. ','Retired'),
    ('SAL001','Risk Management for Smart Business','Apply risk management concepts to digital business','Retired'),
    ('SAL002','CoC in Smart Living Solutions','Participants will acquire the knowledge and skills in setting up a smart living solution','Pending'),
    ('SAL003','Optimising Your Brand For The Digital Spaces','Digital has fundamentally shifted communication between brands and their consumers from a one-way broadcast to a two-way dialogue. In a hastened bid to transform their businesses to be digital market-ready,','Active'),
    ('SAL004','Stakeholder Management','Develop a stakeholder engagement plan and negotiate with stakeholders to arrive at mutually-beneficial arrangements.','Active'),
    ('tch001','Print Server Setup','Setting up print server in enterprise environment','Retired'),
    ('tch002','Canon MFC Setup','Setting up Canon ImageRUNNER series of products','Retired'),
    ('tch003','Canon MFC Mainteance and Troubleshooting','Troubleshoot and fixing L2,3 issues of Canon ImageRUNNER series of products','Active'),
    ('tch004','Introduction to Open Platform Communications','This course provides the participants with a good in-depth understanding of the SS IEC 62541 standard','Pending'),
    ('tch005','An Introduction to Sustainability','The course provides learners with the multi-faceted basic knowledge of sustainability.','Active'),
    ('tch006','Machine Learning DevOps Engineer ','The Machine Learning DevOps Engineer Nanodegree program focuses on the software engineering fundamentals needed to successfully streamline the deployment of data and machine-learning models','Pending'),
    ('tch008','Technology Intelligence and Strategy','Participants will be able to gain knowledge and skills on: - establishing technology strategy with technology intelligence framework and tools','Active'),
    ('tch009','Smart Sensing Technology','This course introduces sensors and sensing systems. The 5G infrastructure enables the many fast-growing IoT applications equipped with sensors ','Pending'),
    ('tch012','Internet of Things','The Internet of Things (IoT) is integrating our digital and physical world, opening up new and exciting opportunities to deploy, automate, optimize and secure diverse use cases and applications. ','Active'),
    ('tch013','Managing Cybersecurity and Risks','Digital security is the core of our daily lives considering that our dependence on the digital world','Active'),
    ('tch014','Certified Information Privacy Professional','The Certified Information Privacy Professional/ Asia (CIPP/A) is the first publicly available privacy certification','Active'),
    ('tch015','Network Security','Understanding of the fundamental knowledge of network security including cryptography, authentication and key distribution. The security techniques at various layers of computer networks are examined.','Active'),
    ('tch018','Professional Project Management','solid foundation in the project management processes from initiating a project, through planning, execution, control,','Active'),
    ('tch019','Innovation and Change Management ','the organization that constantly reinvents itself to be relevant has a better chance of making progress','Active');

INSERT INTO `jobrole` (`jobrole_id`, `jobrole_name`, `jobrole_status`) VALUES
    (1,'Cloud Specialist ','Active'),
    (2,'Data Analyst','Active'),
    (3,'Human Resource','Active'),
    (4,'Operations','Active'),
    (5,'Data Architect','Active'),
    (6,'Software Engineer','Active'),
    (7,'Project Manager','Active'),
    (8,'IT Assistant','Retired'),
    (9,'Full-stack Developer','Active'),
    (10,'Frontend Developer','Active'),
    (11,'Assistant to Regional Manager','Active');

INSERT INTO `role` (`role_id`, `role_name`) VALUES
    (1,'Admin'),
    (2,'User'),
    (3,'Manager'),
    (4,'Trainer');

INSERT INTO `staff` (`staff_id`, `role_id`) VALUES

    ('000001',1),
    ('130001',1),
    ('130002',1),
    ('140001',3),
    ('140002',2),
    ('140003',2),
    ('140004',2),
    ('140008',2),
    ('140015',2),
    ('140025',2),
    ('140036',2),
    ('140078',2),
    ('140102',2),
    ('140103',2),
    ('140108',2),
    ('140115',2),
    ('140525',2),
    ('140736',2),
    ('140878',2),
    ('150008',3),
    ('150065',4),
    ('150075',4),
    ('150076',4),
    ('150085',4),
    ('150095',4),
    ('150096',4),
    ('150115',4),
    ('150118',4),
    ('150125',4),
    ('150126',2),
    ('150138',4),
    ('150142',4),
    ('150143',4),
    ('150148',4),
    ('150155',4),
    ('150162',4),
    ('150163',4),
    ('150165',2),
    ('150166',2),
    ('150168',4),
    ('150175',4),
    ('150192',2),
    ('150193',2),
    ('150198',2),
    ('150205',2),
    ('150208',2),
    ('150215',2),
    ('150216',2),
    ('150232',2),
    ('150233',2),
    ('150238',2),
    ('150245',2),
    ('150258',2),
    ('150265',2),
    ('150275',2),
    ('150276',2),
    ('150282',2),
    ('150283',2),
    ('150288',2),
    ('150295',2),
    ('150318',2),
    ('150342',2),
    ('150343',2),
    ('150345',2),
    ('150348',2),
    ('150355',2),
    ('150356',2),
    ('150398',2),
    ('150422',2),
    ('150423',2),
    ('150428',2),
    ('150435',2),
    ('150445',2),
    ('150446',2),
    ('150488',2),
    ('150512',2),
    ('150513',2),
    ('150518',2),
    ('150525',2),
    ('150555',2),
    ('150565',4),
    ('150566',2),
    ('150585',4),
    ('150608',2),
    ('150615',2),
    ('150632',2),
    ('150633',2),
    ('150638',2),
    ('150645',2),
    ('150655',2),
    ('150695',2),
    ('150705',2),
    ('150765',2),
    ('150776',4),
    ('150796',4),
    ('150826',2),
    ('150845',2),
    ('150866',2),
    ('150916',2),
    ('150918',4),
    ('150935',2),
    ('150938',4),
    ('150968',2),
    ('150976',2),
    ('151008',2),
    ('151055',2),
    ('151056',2),
    ('151058',2),
    ('151118',2),
    ('151146',2),
    ('151198',2),
    ('151266',2),
    ('151288',2),
    ('151408',2),
    ('160008',1),
    ('160065',1),
    ('160075',1),
    ('160076',1),
    ('160118',1),
    ('160135',2),
    ('160142',1),
    ('160143',1),
    ('160145',2),
    ('160146',2),
    ('160148',1),
    ('160155',1),
    ('160188',2),
    ('160212',2),
    ('160213',2),
    ('160218',2),
    ('160225',2),
    ('160258',2),
    ('160282',2),
    ('170166',3),
    ('170208',2),
    ('170215',2),
    ('170216',2),
    ('170232',2),
    ('170233',2),
    ('170238',2),
    ('170245',2),
    ('170655',2),
    ('170866',2),
    ('171008',2);


-- HARDCODING INTO THE ASSOCIATION TABLES for the many-to-many relationships
INSERT INTO `skill_course_association_table` (`skill_id`, `course_id`) 
VALUES
(1, "FIN001"),
(2, "COR004"),
(3, "MGT002"),
(4, "tch006"),
(5, "tch018");

INSERT INTO `skill_jobrole_association_table` (`skill_id`, `jobrole_id`) 
VALUES
(4, 1),
(1, 2),
(3, 3),
(2, 3),
(3, 4),
(5, 4);

COMMIT;
