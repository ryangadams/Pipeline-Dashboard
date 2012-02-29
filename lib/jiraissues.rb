require 'xmlsimple'
module Jiraissues
    def Jiraissues.fetch_issues(config_hash)

      command = "curl --cert #{config_hash['PERSONAL_PEM']} --cacert #{config_hash['CA_PEM']}"

      # append the querystring from the config onto the jira urls
      issue_list_xml_url = "https://jira.dev.bbc.co.uk/sr/jira.issueviews:searchrequest-xml/temp/SearchRequest.xml#{config_hash['JIRA_URL']}"
      issue_list_url = "https://jira.dev.bbc.co.uk/secure/IssueNavigator.jspa#{config_hash['JIRA_URL']}"

      puts "getting url #{issue_list_xml_url} \n "

      xml_feed = %x{#{command} #{issue_list_xml_url}}
      xml_obj = XmlSimple.xml_in(xml_feed)
      #xml_obj = XmlSimple.xml_in('data/pipeline.xml')

      keys = Array.new
      xml_obj['channel'][0]['item'].each do |item| 
        issue = {
          :key => item['key'][0]['content'],
          :summary => item['summary'][0],
          :status => item['status'][0]['content'],
          :rag => fetch_rag(item['customfields'][0]['customfield']),
          :jiraurl => fetch_jira_url(item['customfields'][0]['customfield']),
          :confluenceurl => fetch_confluence_url(item['customfields'][0]['customfield']),
          :tpm => fetch_tpm(item['customfields'][0]['customfield']),
          :laststatus => fetch_last_status(item['customfields'][0]['customfield']),
          :lifecycle => fetch_product_lifecycle(item['customfields'][0]['customfield']),
          :lastcomment => fetch_last_comment(item['comments'])
        }
        keys.push issue
      end

      {:keys => keys, :url => issue_list_url}

    end
    
    def Jiraissues.fetch_product_lifecycle(customFieldArray) 
      fetch_field(customFieldArray, "customfield_10570")
    end
    
    def Jiraissues.fetch_rag(customFieldArray) 
      fetch_field(customFieldArray, "customfield_10573")
    end
    
    def Jiraissues.fetch_last_status(customFieldArray)
      fetch_field(customFieldArray, "customfield_10435")
    end
    
    def Jiraissues.fetch_jira_url(customFieldArray)
      fetch_field(customFieldArray, "customfield_10579")
    end
    
    def Jiraissues.fetch_tpm(customFieldArray)
      fetch_field(customFieldArray, "customfield_10578")
    end
    
    def Jiraissues.fetch_confluence_url(customFieldArray)
      fetch_field(customFieldArray, "customfield_10293")
    end
    
    def Jiraissues.fetch_field(fieldArray, fieldID)
      value = ""
      fieldArray.each { |custom_field| 
        if custom_field['id'] == fieldID then
          value = custom_field['customfieldvalues'][0]['customfieldvalue'][0]
        end
      }
      value
    end
    
    def Jiraissues.fetch_last_comment(commentsArray)
      if commentsArray == nil
        return ""
      end
      last_index = commentsArray[0]['comment'].length - 1
      last_comment = commentsArray[0]['comment'][last_index]
      "<p class=\"comment-created-date\">#{last_comment['created']}</p><div class=\"comment\">#{last_comment['content']}</div>"
    end
end