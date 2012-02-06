#!/usr/bin/env ruby

require 'pathname'
$:.unshift File.join(File.dirname(Pathname.new($0).realpath.to_s), 'lib')

require 'jiraissues'


$debug = true

puts "Building KandL Pipeline Status"
issue_list = Jiraissues.fetch_issues 

puts issue_list if $debug
