# code200-job-found


##App Specifics
*React app with MySQL/Sequelize backend, Express, Node JS and Passport technologies used.

## Getting Started:
*Start MAMP local servers
*Open MySQL workbench
  *CREATE SCHEMA `twohundredjobfound` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin ;
  
*Clone https://github.com/lmaaronson/code200-job-found/
*cd into code200-job-found
*npm install
*cd client
*yarn install
*cd back to root
*yarn install
*yarn start
___
## Features
*Encrypted User System (BCrypt and Passport)
*Ability to save job listing
*Ability to add notes to each job listing and compare notes to job's description
*Mobile compatibility
*API integration
___
##Future Development
*Search filters by type and location
*Smaller components to utilize the strengths of React
*Completely restyling, adding some custom assets (like a logo)
*Revising authentication to use Google OAuth 2.0 for login versus Passport
*Users ability to add listing from other sources into their account
*Deploying this app (currently there are conflicts between Passport Local and Heroku which has made deployment impossible.)
