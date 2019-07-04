$(function() {
  var grid = $("#grid").kendoGrid({
    dataSource: {
      data: window.data,
      group: window.gridState.group,
      group: window.gridState.group,
      filter: window.gridState.filter
    },
    filterable: true,
    height: 550,
    groupable: true,
    sortable: true,
    pageable: {
      refresh: true,
      pageSizes: true,
      buttonCount: 5
    },
    columns: window.column
  });

  var kendoGrid = $("#grid").data("kendoGrid");
  var data = kendoGrid._data;
  var fieldLength = kendoGrid.dataSource.options.fields.length;
  var groupingFieldCount = window.gridState.group.length;


  var listOfRow = $("#grid .k-grid-content table tbody").children("tr");
  $.each(listOfRow, function(i, row) {
    var $row = $(this);
    $row.find("td").each(function() {
      if (groupingFieldCount === $(this).attr("colspan") - fieldLength) {
        $row.addClass("firstGroup");
      } else if ($(this).attr("colspan") - fieldLength === 1) {
        $($row).addClass("lastGroup");
      } else if (
        $(this).attr("colspan") - fieldLength > 1 &&
        $(this).attr("colspan") - fieldLength < groupingFieldCount
      ) {
        $($row).addClass("middleGroup");
      }
    });

    if (row.priority == "Confirmed") {
      var element = $('tr[data-uid="' + row.uid + '"] ');
      $(element).addClass("change-background");
    }
  });
});
