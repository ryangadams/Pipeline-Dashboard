function buildHTML(){
    var table = $('<table></table>');
    table.append($('<tr><th>KEY</th><th>SUMMARY</th><th>STATUS</th><th>TPM</th><th>RAG</th><th>JIRA</th><th>CONFLUENCE</th></tr>'));
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
}