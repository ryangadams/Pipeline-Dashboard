/*
 * This javascript is a real mess. Tidy this up forthwith!
 */


function buildHTML(){
    var table = $('<table id="project-table"></table>');
    table.append($('<thead><tr><th>KEY</th><th>SUMMARY</th><th id="status-header">STATUS</th><th id="">LIFECYCLE</th><th>TPM</th><th>RAG</th><th>JIRA</th><th>CONFLUENCE</th></tr></thead>'));
    var tableBody = $("<tbody></tbody>");
    table.append(tableBody);
    $.each(issues_json.keys, function(index, value){        
				if (value.lifecycle == "") {
					value.lifecycle = "unknown";
				}
        var el = $('<tr id="row_' + index + '" ' + 
				'class="' + value.rag + ' ' + value.status + ' ' + value.lifecycle.toLowerCase() + '">' +
        '<td><a href="https://jira.dev.bbc.co.uk/browse/' +value.key +'">' + value.key + '</a></td>' +
        '<td class="summary">' + value.summary + '<span class="hidden">' + value.laststatus  + '</span></td>' +
        '<td>' + value.status + '</td>' +
        '<td>' + value.lifecycle + '</td>' +
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
        tableBody.append(el);
    });
    $("#wrapper").append('<p><a href="' + issues_json.url + '">View List on JIRA</a></p>').append(table);
	  
	buildGraph();
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
        id: 'lifecycle_sorter', 
        is: function(s) { 
            // return false so this parser is not auto detected 
            return false; 
        }, 
        format: function(s) { 
            // format your data for normalization 
            return s.toLowerCase().replace(/concept/,0).replace(/feasibility/,1).replace(/discovery/,2).replace(/build/,3).replace(/run/,4).replace(/^$/,5); 
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
        widgets: ['zebra'],
        headers: {
            0: {
                sorter: 'jira_sorter'
            },    
            1: {
                sorter: 'text'
            },
            2: {
                sorter: 'status_sorter'
            },
            3: {
                sorter: 'lifecycle_sorter'
            },
            5: {
                sorter: 'rag_sorter'
            }
        }
    });
    $("td.summary").click(function(){
        $(this).toggleClass("show-snippet");
    });
    $("#project-table").before($('<a id="toggle-closed-projects" href="#">Show/Hide Closed Projects</a>'));
    $("#toggle-closed-projects").click(function(e){
        e.preventDefault();
        if($("body").hasClass("hide-closed")) {
            $(this).text("Hide Closed Projects");
        } else {
            $(this).text("Show Closed Projects");
        }
        $("body").toggleClass("hide-closed");
    });
 		$("#graph div").hover(
			function(){
	  	$(this).css('cursor', 'pointer');
			},
			function(){
		  	$(this).css('cursor', '');
			}
		).click(function(e){                  
			status = $(this).attr("id").split("-")[1];
			$("#project-table tr").removeClass("hidden");
			$("#project-table tr:not('." + status + "')").addClass("hidden");
		});     
    $("#graph p a").click(function(e){
			e.preventDefault();
			$("#project-table tr").removeClass("hidden");
		});
}

function buildGraph() { 
	var columnOrder = ["concept", "feasibility", "discovery", "build", "run", "unknown"];
	var columns = [];
	var projectCount = 0;
	$("table tr").each(function(index, element){
		lifecycleStatus = $(this).find("td:nth-child(4)").text().toLowerCase();
		if(lifecycleStatus != "") {
			(columns[lifecycleStatus] == undefined) ? columns[lifecycleStatus] = 1 : columns[lifecycleStatus]++;
		} else {                                                                                              
			lifecycleStatus = "unknown";
			(columns[lifecycleStatus] == undefined) ? columns[lifecycleStatus] = 1 : columns[lifecycleStatus]++;
		}       
		projectCount = index + 1;
	});                     
	var thisWidth = 0;
	var thatWidth = 0;
	var graph = $('<div id="graph"><p>Pipeline Overview </p></div>');
	$.each(columnOrder, function(index, value){         
		thatWidth = thatWidth + thisWidth;                 
		thisWidth = (columns[value] / projectCount * 100);
		graph.append('<div id="graph-'+value +'" style="width:' + thisWidth + '%;margin-left:' + thatWidth + '%;">' + value + ' ('+ columns[value] +')</div>');
	});                                                              
	$("table").before(graph);  
	$("#graph p").append('<a href="#">Show All</a>');
}