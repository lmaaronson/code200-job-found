Code 200--Job Found
This is a job search app designed with bootcamp graduates in mind Done with SQL, Express, React, and Node.

Getting Started
Clone this repository

git clone https://github.com/lmaaronson/code200-job-found


Run MAMP server locally
Run a mySQL server at port 8080, the user name and password are both "root".
Open the root directory in the bash.

npm install
cd client
npm install
cd..
yarn start

Prerequisites
There are a few things you'll need to get it running, 
The following will need to be installed locally

npm install yarn -g
npm install nodemon -g
npm install concurrently -g


What's Next for this App?
Deployment.  Currently there are conflicts between Passport local and Heroku which I have been unable to resolve.  May need to redevelop Passport authentication parts of the app.
More APIs.  Currently there is only 1 API that brings in jobs...would like to add more sites.
Functionality.  Hoping to add more function so that user can keep better track of jobs applied for, notes, etc.
