#!/usr/bin/env ruby

require 'pathname'
$:.unshift File.join(File.dirname(Pathname.new($0).realpath.to_s), 'lib')

require 'jiraissues'
require 'date'
require 'json'

$debug = false

puts "Building KandL Pipeline Status"
issue_list = Jiraissues.fetch_issues 

puts issue_list if $debug

report = <<EOT

<!doctype html>
<html>
<head>
	<style>
		body {
		     font-family: consolas,courier,fixed-width;
		font-size:75%;
		}
	</style>
	<link rel="stylesheet" href="default.css" />
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
	<script type="text/javascript" src="jquery.tablesorter.min.js"></script>
	<script type="text/javascript" src="pipeline-json.js"></script>
	<script type="text/javascript">
		$(document).ready(function(){
		  buildHTML();
		});
		</script>
</head>
<body>
<div id="wrapper">
EOT
filename = "output/pipeline-#{DateTime.now.strftime('%Y%m%d-%H%M')}.html"
filename = "output/pipeline.html"
File.open(filename, 'w') do |f|
  report = report + "<h1>KandL Pipeline Update</h1>"
  f.write report
  f.write "<script>var issues_json = " + issue_list.to_json
  f.write("</script></div></body></html>")
end