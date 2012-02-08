require 'xmlsimple'
module Jiraissues
    def Jiraissues.fetch_issues

      command = "curl --cert ~/certstore/bbc.pem --cacert ~/certstore/ca.pem"

      issue_list_xml_url = "https://jira.dev.bbc.co.uk/sr/jira.issueviews:searchrequest-xml/temp/SearchRequest.xml?jqlQuery=project+%3D+PIPELINE+AND+%22Product+Area%22+%3D+%22Knowledge+and+Learning%22&tempMax=1000"
      issue_list_url = "https://jira.dev.bbc.co.uk/secure/IssueNavigator.jspa?reset=true&jqlQuery=project+%3D+PIPELINE+ORDER+BY+status+DESC%2C+priority+DESC"

      puts "getting url \n #{issue_list_xml_url}"

      xml_feed = %x{#{command} #{issue_list_xml_url}}
      #xml_feed = "/Users/adamsr03/github/local/Knowlearn-AppDashboard/data/pipeline.xml"
      xml_obj = XmlSimple.xml_in(xml_feed)

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
          :lifecycle => fetch_product_lifecycle(item['customfields'][0]['customfield'])
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
end