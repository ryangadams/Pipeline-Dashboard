function buildHTML(){
    var table = $('<table id="project-table"></table>');
    table.append($('<thead><tr><th>KEY</th><th>SUMMARY</th><th id="status-header">STATUS</th><th>TPM</th><th>RAG</th><th>JIRA</th><th>CONFLUENCE</th></tr></thead>'));
    $.each(issues_json, function(index, value){
        var el = $('<tr id="row_' + index + '" class="' + value.rag + ' ' + value.status + '">' +
        '<td><a href="https://jira.dev.bbc.co.uk/browse/' +value.key +'">' + value.key + '</a></td>' +
        '<td>' + value.summary + '</td>' +
        '<td>' + value.status + '</td>' +
        '<td>' + value.tpm + '</td>' +
        '<td>' + value.rag + '</td>' +
        '</tr>');
        if(value.jiraurl != "") {
            el.append($('<td><a href="' + value.jiraurl + '">Jira</a></td>'));
        } else {
            el.append($('<td></td>'));
        }
        if(value.confluenceurl != "") {
            el.append($('<td><a href="' + value.confluenceurl + '">Confluence</a></td>'));
        } else {
            el.append($('<td></td>'));
        }
        table.append(el);
    });
    $("body").append(table);
    addEvents();
}
function addEvents() {
    $.tablesorter.addParser({ 
        // set a unique id 
        id: 'status_sorter', 
        is: function(s) { 
            // return false so this parser is not auto detected 
            return false; 
        }, 
        format: function(s) { 
            // format your data for normalization 
            return s.toLowerCase().replace(/feasibility/,0).replace(/radar/,1).replace(/incubation/,2).replace(/development/,3).replace(/staging/,4).replace(/production under warranty/,5).replace(/on hold/,6).replace(/closed/,7); 
        }, 
        // set type, either numeric or text 
        type: 'numeric' 
    });
    
    $.tablesorter.addParser({ 
        // set a unique id 
        id: 'jira_sorter', 
        is: function(s) { 
            // return false so this parser is not auto detected 
            return false; 
        }, 
        format: function(s) { 
            // format your data for normalization 
            return s.toLowerCase().replace(/pipeline-/,0); 
        }, 
        // set type, either numeric or text 
        type: 'numeric' 
    });
    $.tablesorter.addParser({ 
        // set a unique id 
        id: 'rag_sorter', 
        is: function(s) { 
            // return false so this parser is not auto detected 
            return false; 
        }, 
        format: function(s) { 
            // format your data for normalization 
            return s.toLowerCase().replace(/ /,0).replace(/green/,1).replace(/amber/,2).replace(/red/,3); 
        }, 
        // set type, either numeric or text 
        type: 'numeric' 
    });
    $("#project-table").tablesorter({
        textExtraction: "complex",
        headers: {
            0: {
                sorter: 'jira_sorter'
            },
            2: {
                sorter: 'status_sorter'
            },
            4: {
                sorter: 'rag_sorter'
            }
        }
    }); 
}