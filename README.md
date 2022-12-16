# IS212-Software-Project-Management

This repository contains the project artefacts that are used for developing a web application using the Agile Scrum software project management methodology as part of a school module. The project was completed by 6 team members including myself and the project artefacts are extracted from the project repository and edited to run only locally (on local machines). 

The project artefacts includes:
- Codes (first release)
- System Design diagrams (using the C4 architecture model)
  - Context diagram
  - Container diagram (Monolith) 
  - Component diagram
  - Entity Relationship(ER) diagram for database design (it is also considered as a Code diagram under C4)
- User Stories, Product Backlog and Definition of Done document
- Codes and files for Software Testing (User Acceptance Test, Unit Test and integration Test)and Continuous Integration 
- Sprint backlog, sprint standups, sprint review, sprint retrospective and scrum taskboard for a particular sprint (Sprint 3 to be specific)
- Burnup and Burndown chart on visualising overall project progress (storypoints completed throughout the sprints)

**Project (Fictional) customer brief description**

A Learning Journey Planning System (LJPS) is needed to help a (fictional) Printing Solution Equipment Servicing company's employees map and track their skills progress towards attaining desired career/job goals (for self-tracking purposes and does not mean auto-enrollment). It is intended to work together with an existing web application- Learning Management System(LMS), with sharing of courses data from LMS to LJPS. The LMS allows employees to browse and register for courses for upskilling.

The customer brief covers an entire system that is beyond the scope of a single school term's project. As such, **5 core features** have been agreed upon between the customer and the Product Owner to be addressed in the first release:
1. Users should be able to select a role they want and see a list of skills required 
2. Users should be able to see the courses they can take to acquire those skills, and add/remove them on their learning journey
3. Create, Read, Update, Delete (CRUD) operations for roles
4. Create, Read, Update, Delete (CRUD) operations for skills
5. Assigning skills to roles; assigning skills to courses

In first release of LJPS, 2 types of LJPS users Staff and Human Resource (HR) are considered. Feature 1,2 Feature 3 (only the R operation of the CRUD) and Feature 4 (only the R operation) are relevant to Staff. While the HR has added access control as admin of LJPS and thus all 5 Features are relevant to HR. (HR is a Staff and can choose to login as Staff to do Staff-only functions or HR to do HR-only functions)

Note: Working code covers only the 5 core features for first release, while the system design and product backlog is done with the entire system in mind.
Note: Login page and integration with LMS is not part of the requirements of first release. Sample LMS data is provided to faciliate the development of the first release of LJPS.

**Tools/Software used in the project**
- Client: React.js, CoreUI
- Server: Python, Flask, WAMPServer (for testing on local machine)
- Database: MySQL (managed using phpMyAdmin for testing on local machine), Amazon RDS (
- Testing: Unittest module
- Continuous Integration: Github Actions
- Project Management Tools: Notion (only for first few weeks into the project), Clickup

### System Design

<table>
  <tr>
    <th>C4 Context diagram</th>
    <th>C4 Container diagram</th>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/wanning-lee-2018/IS212-Software-Project-Management/blob/main/C4%20-%20Context.png" width="200" height="175">
    </td>
    <td align="center">
      <img src="https://github.com/wanning-lee-2018/IS212-Software-Project-Management/blob/main/C4%20-%20Container%20%5Bmonolith%5D.png" width="200" height="175">
    </td>
  </tr>
  <tr>
    <td>It was explicitly stated in the product owner meeting minutes that login/logout will be handled by Azure Single-Sign-On(SSO) (but not in first release). It was also mentioned that integration with LMS, which involves sharing of courses data is not required for first release</td>
    <td>System requirements and functionalities are fairly straightforward, thus a monolithic backend architecture is used. LMS data retriever app will be a separate application at the container level that will be the interface between the DB and LMS. This app will update the DB directly.</td>
  </tr>
  <tr>
    <th>C4 Component diagram</th>
    <th>C4 Code diagram (ER Database)</th>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/wanning-lee-2018/IS212-Software-Project-Management/blob/main/C4%20model%20-%20Component.png" width="200" height="175">
    </td>
    <td align="center">
      <img src="https://github.com/wanning-lee-2018/IS212-Software-Project-Management/blob/main/C4%20-%20Code%26ER.png" width="200" height="175">
    </td>
  </tr>
  <tr>
    <td>SQL alchemy library was used to connect and communicate with the database.The library enabled us to directly work with the database in python using the Object Relational Mapper (ORM).</td>
    <td>It was explicitly stated in the product owner meeting minutes that a SQL relational database is to be used and the solution will eventually be deployed onto AWS Cloud. Amazon RDS was chosen as it supports mySQL database, one that the team is familiar with. As the database will already be hosted on AWS, the eventual release and deployment will be more straightforward.</td>
  </tr>
</table>

## How to set up the web application locally (instructions for Windows computer)

1. Download WAMPServer and the is212_spm folder from this GitHub Repository
- After downloading WAMPServer, follow the setup instructions to setup WAMPServer. Note: select MySQL option on the "Select Components" to be installed setup page and choose Google Chrome as the default browser. 

2. Run/Start WAMPServer. The WAMPServer icon should turn green upon successful run/start (located within the ^ "Show hidden icons" on the taskbar for a Windows laptop)
(The following sub points are done only once during initial setup)
- 2.1 Right click on the WAMPServer icon, hover over the "Wamp Setting" and check that "Allow MariaDB" is unchecked
- 2.2  Right click on the WAMPServer icon, hover over "Tools" and check that the port 3306 is used for MySQL, if not change to 3306.
- 2.3 (Left) Click on the WAMPServer icon and the WAMPServer menu should pop up. Click on menu item phpMyAdmin which will direct you to http://localhost/phpmyadmin, login with the Username "root" , leave the password input box empty and click "Go".
- 2.4 Create a new database schema called "sample_data" using the SQL script provided within the sub folder "Database" of the is212_spm folder. Check that the database is successfully created.

3. Running/Starting the web application
(Note that the WAMPServer should be running (with icon lighted in green) before the web application is run)
- 3.1 Open the is212_spm folder in source code editor, Visual Studio Code (VSC).
- 3.2 Create a new terminal from within VSC
  (Do 3.2.1 and 3.2.2 (to install dependencies) only once during initial setup)
  - 3.2.1 Enter the command "pip install -r requirements.txt" in the terminal 
  - 3.2.2 Then, enter the command "yarn install". (install the yarn package first if yarn is not found)
  = 3.2.3 Enter the command "yarn dstart". The web application will start running at http://localhost:3000/ on your default browser. If there is error starting the web application, try deleting the package.lock.json file/yarn.lock file (if have) and deleting the node_modules folder before repeating the steps from 3.2.1 to 3.2.3. 

4. Check if web application is working
- You should see a login page 
- Enter the login credential (Staff ID) :130002 and select role to login as (Staff/Human Resource)
- Here is a short demo of the user flow of a Staff using the web application to create a learning journey for him/herself

https://user-images.githubusercontent.com/43470271/205938862-fbfb7064-b534-496a-80c7-8d2bf77ec5bd.mp4

*Note: The course completion status will never show completed in the web application because it requires integration of the course registration data from the LMS, which is not required for first release.To simulate this:*

*- Update the course completion status to "Completed" for the course and staff of your choice in the registration.csv found under is212_spm>src>flask folder (the existing registration csv file only contains the prior courses already completed by the staff before the creation of the LJPS). Remember to save the newly updated registration csv file.*

*- Open up a new terminal in VSC, change directory to is212_spm>src>flask folder with the command "cd /src/flask" and run the script updateCourseStatus.py with the command "python updateCourseStatus.py" to sync up the completion status of courses for staff from the newly updated registration csv file*


5. How to stop the web application from running
- Do "Ctrl + c" in the VSC terminal to terminate the running web application 
- Right Click on the WAMPServer icon and select "Exit"
