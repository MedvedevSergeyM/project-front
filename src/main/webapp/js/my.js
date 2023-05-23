$(function() {
    setItemPerPageEvents();
    updateItemPerPage(5);
});

function setItemPerPageEvents() {
    $("#page_size_values li[value]").click(function () {
        updateItemPerPage(this.value);
    });
}

function updateItemPerPage(count) {
    $("#page_size_button").text(count);
    updatePaginator();
}

function setPaginatorEvents() {
    $("#page_number_list li[value]").click(function () {
        updatePaginator(this.value);
    });
}

function updatePaginator(pageNumber) {
    $.getJSON("/rest/players/count", {}, function(allPlayersCount) {
        let pageSize = $("#page_size_button")[0].innerText;
        let navPageCount = Math.ceil(allPlayersCount / pageSize);

        if (!pageNumber) {
            pageNumber = $("#page_number_list li.active")[0].value;
        }
        if (pageNumber > navPageCount) {
            pageNumber = navPageCount;
        }

        let pages = $("#page_number_list");
        $("#page_number_list li").remove();
        for (let i = 1; i <= navPageCount; i++) {
            if (i === pageNumber) {
                pages.append('<li value="' + i + '" class="page-item active" aria-current="page"><span class="page-link">' + i + '</span></li>');
            } else {
                pages.append('<li value="' + i + '" class="page-item"><a class="page-link" href="#">' + i + '</a></li>');
            }
        }
        setPaginatorEvents();

        updateDataTable(pageNumber - 1, pageSize);
    });
}

function updateDataTable(pageNumber, pageSize) {
    $("#accounts_table_body")[0].innerText = "";
    $.getJSON("/rest/players", {pageNumber: pageNumber, pageSize: pageSize}, function(data) {
        $.each(data, function(index, element) {
            let row = $("#accounts_table_body")[0].insertRow();
            row.id = "player_" + element.id;
            row.insertCell().innerHTML = element.id;
            row.insertCell().innerHTML = element.name;
            row.insertCell().innerHTML = element.title;
            row.insertCell().innerHTML = element.race;
            row.insertCell().innerHTML = element.profession;
            row.insertCell().innerHTML = element.level;
            row.insertCell().innerHTML = new Date(element.birthday).toLocaleDateString("en-US");
            row.insertCell().innerHTML = element.banned;
            row.insertCell().innerHTML = '<img class="edit_button" data-value="' + element.id + '" src="/img/edit.png" alt="Edit">';
            row.insertCell().innerHTML = '<img class="delete_button" data-value="' + element.id + '" src="/img/delete.png" alt="Delete">';
        });

        setDataTableEvents();
    });
}

function setDataTableEvents() {
    let deleteButton = $("img.delete_button");
    deleteButton.off("click");
    deleteButton.on('click', function () {
        deleteItem($(this).data("value"));
    });

    let editButton = $("img.edit_button");
    editButton.off("click");
    editButton.on('click', function () {
        editItem($(this).data("value"));
    });

    let saveButton = $("img.save_button");
    saveButton.off("click");
    saveButton.on('click', function () {
        saveItem($(this).data("value"));
    });
}

function deleteItem(id) {
    $.ajax({
        url: '/rest/players/' + id,
        type: 'DELETE',
        success: function() {
            updatePaginator();
        }
    });
}

function editItem(id) {

    function createOption(value, selected) {
        let html = "";
        if (value === selected) {
            html += '  <option selected value="' + value + '">' + value + '</option>\n';
        } else {
            html += '  <option value="' + value + '">' + value + '</option>\n';
        }
        return html;
    }

    let row = $("#player_" + id)[0];
    for (const key in row.cells) {
        if (key === "1" || key === "2") {
            let html = "";
            html += '<input class="form-control form-control-sm" type="text" aria-label=".form-control-sm example" ';
            html += 'value="' + row.cells[key].innerHTML + '"';
            html += '>';
            row.cells[key].innerHTML = html;
        }
        if (key === "3") {
            let html = "";
            html += '<select class="form-select form-select-sm" aria-label=".form-select-sm example">\n';
            html += createOption("HUMAN", row.cells[key].innerHTML);
            html += createOption("DWARF", row.cells[key].innerHTML);
            html += createOption("ELF", row.cells[key].innerHTML);
            html += createOption("GIANT", row.cells[key].innerHTML);
            html += createOption("ORC", row.cells[key].innerHTML);
            html += createOption("TROLL", row.cells[key].innerHTML);
            html += createOption("HOBBIT", row.cells[key].innerHTML);
            html += '</select>';
            row.cells[key].innerHTML = html;
        }
        if (key === "4") {
            let html = "";
            html += '<select class="form-select form-select-sm" aria-label=".form-select-sm example">\n';
            html += createOption("WARRIOR", row.cells[key].innerHTML);
            html += createOption("ROGUE", row.cells[key].innerHTML);
            html += createOption("SORCERER", row.cells[key].innerHTML);
            html += createOption("CLERIC", row.cells[key].innerHTML);
            html += createOption("PALADIN", row.cells[key].innerHTML);
            html += createOption("NAZGUL", row.cells[key].innerHTML);
            html += createOption("WARLOCK", row.cells[key].innerHTML);
            html += createOption("DRUID", row.cells[key].innerHTML);
            html += '</select>';
            row.cells[key].innerHTML = html;
        }
        if (key === "7") {
            let html = "";
            html += '<select class="form-select form-select-sm" aria-label=".form-select-sm example">\n';
            html += createOption("true", row.cells[key].innerHTML);
            html += createOption("false", row.cells[key].innerHTML);
            html += '</select>';
            row.cells[key].innerHTML = html;
        }
        if (key === "8") {
            row.cells[key].innerHTML = '<img class="save_button" data-value="' + id + '" src="/img/save.png" alt="Save">';
        }
        if (key === "9") {
            row.cells[key].innerHTML = "";
        }
    }

    setDataTableEvents();
}

function saveItem(id) {
    let row = $("#player_" + id)[0];

    let json = JSON.stringify({
        name: row.cells[1].children[0].value,
        title: row.cells[2].children[0].value,
        race: row.cells[3].children[0].value,
        profession: row.cells[4].children[0].value,
        banned: row.cells[7].children[0].value
    });

    $.ajax({
        url: '/rest/players/' + id,
        type: 'POST',
        data: json,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function() {
            updatePaginator();
        }
    });
}


