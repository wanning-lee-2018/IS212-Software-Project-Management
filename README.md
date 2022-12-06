# IS212-Software-Project-Management

This repository contains the project artefacts that are used for developing a web application using the Agile Scrum software project management methodology as part of a school module, which includes:
- Codes
- System Design
- ...

*Project customer brief description*

*Tools/Software used in the project*

## How to set up the web application locally (instructions for Windows computer)
1. Download WAMP server and the is212_spm folder from this GitHub Repository
-  After downloading WAMP server, follow the setup instructions to setup WAMP Server. Note: select MySQL option on the "Select Components" to be installed setup page and choose Google Chrome as the default browser. 
2. Run/Start WAMP server. The WAMP server icon should turn green upon successful run/start (located within the ^ "Show hidden icons" on the taskbar for a Windows laptop)
(The following sub points are done only once during initial setup)
2. 1 Right click on the WAMP server icon, hover over the "Wamp Setting" and check that "Allow MariaDB" is unchecked
2.2  Right click on the WAMP server icon, hover over "Tools" and check that the port 3306 is used for MySQL, if not change to 3306.
2.3 (Left) Click on the WAMP server icon and the WAMP server menu should pop up. Click on menu item phpMyAdmin which will direct you to http://localhost/phpmyadmin, login with the Username "root" , leave the password input box empty and click "Go".
2.4 Create a new database schema called "sample_data" using the SQL script provided within the sub folder "Database" of the is212_spm folder. Check that the database is successfully created.
3. Running/Starting the web application
(Note that the WAMP server should be running (with icon lighted in green) before the web application is run)
3.1 Open the is212_spm folder in source code editor, Visual Studio Code (VSC).
3.2 Create a new terminal from within VSC
  (Do 3.2.1 and 3.2.2 (to install dependencies) only once during initial setup)
  3.2.1 Enter the command "pip install -r requirements.txt" in the terminal 
  3.2.2 Then, enter the command "yarn install". (install the yarn package first if yarn is not found)
  3.2.3 Enter the command "yarn dstart". The web application will start running at http://localhost:3000/ on your default browser. If there is error starting the web application, try deleting the package.lock.json file/yarn.lock file (if have) and deleting the node_modules folder before repeating the steps from 3.2.1 to 3.2.3. 

Check if web application is working. 
- You should see a login page 
- Here is a brief example of the user flow of a Staff using the web application to create a learning journey for him/herself



*Snippets of project artefacts (excluding the codes)
