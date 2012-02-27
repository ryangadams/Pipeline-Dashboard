# Jira Pipeline Dashboard #

I found the dashboard view for the KandL pipeline tricky to get a grasp of in jira.  So I wrote this little ruby script to build me a cleaner view.

## Usage ##
Edit config.yaml with a jira querystring to your product pipeline, the path to your certificate and the root certificate, then run ./app.rb

It should generate an html file output/pipeline.html which will show you a sortable table with your projects.  Click on the project title to see the latest update to the project (the weekly report update)