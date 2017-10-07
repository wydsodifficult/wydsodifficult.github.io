// Convert the snapshot to a PDF
// Needs the following scripts
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.5/jspdf.debug.js"></script>
// or <script src="js/libs/jspdf.debug.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/2.3.0/jspdf.plugin.autotable.js"></script>
// or <script src="js/libs/jspdf.plugin.autotable.js"></script>
function reportDownload (snapshot) {
    console.log(snapshot.val());
    var values = snapshot.val();
    var doc = new jsPDF("p", "mm", "a4");
    var timeSplit = values.timeStart.split(" ")[0].split("/");
    
    // Title of the DOC
    var title = values.short + "_" + values.jobNum + "_" + timeSplit[2] + timeSplit[0] + timeSplit[1] + "_" + values.submittedInitials;
    console.log(title);
    
    // Job Type
    var type;
    if(values.type == 'DPR') type = "Daily Progress Report";
    else type = values.type;
    
    // Report Type
    doc.text(type, 110, 36, 'center');
    
    // Main Info
    var mainCol = [
        {datakey: "1"},
        {datakey: "2"},
        {datakey: "3"},
        {datakey: "4"}
    ];
    var mainRows = [
        {"0": "PROJECT NAME: ", "1": values.jobName, "2": "JOB NUMBER:", "3": values.jobNum},
        {"0": "SUBMITTED BY: ", "1": values.submittedBy, "2": "CONTRACTOR: ", "3": values.contractor},
        {"0": "START TIME: ", "1": values.timeStart, "2": "START TIME: ", "3": values.timeEnd},
        {"0": "TIME TOTAL: ", "1": values.timeTotal, "2": "FOREMAN: ", "3": values.foreman}
    ];
    
    // Table for Main Info
    doc.autoTable(mainCol, mainRows, {
        theme: "grid",
        startY: 40,
        showHeader: "never",
        styles: {overflow: 'linebreak', fontSize: 8},
        margin: {horizontal: 20},
        columnStyles: {text: {columnWidth: 'auto'}},
        createdCell: function(cell, dataRows) {
            if(dataRows.column.index === 0 || dataRows.column.index === 2) { 
                cell.styles.fontStyle = 'bold'; 
                cell.styles.fillColor = [178, 8, 175]; // 26, 188, 156
                cell.styles.textColor = [255, 255, 255];
            }
        }
    });
    
    // Table for DPR Employee's Hours
    if(values.type = "DPR" && values.employees != null) {
        var employeeRows = [];
        for(var i = 0; i < values.employees.length; i++) {
            employeeRows.push({"0": values.employees[i].name, "1": values.employees[i].hours});
        }
        var employeeCols= [
            {title: "EMPLOYEE NAME", datakey: "name"}, {title: "HOURS", datakey: "hours"}
        ];
        
        doc.autoTable(employeeCols, employeeRows, {
            theme: "grid",
            startY: doc.autoTable.previous.finalY + 5,
            styles: {overflow: 'linebreak', fontSize: 8},
            fontSize: 8,
            margin: {horizontal: 20},
            columnStyles: {text: {columnWidth: 'auto'}}
        });
        
        var materialRows = [];
        for(var i = 0; i < values.materials.length; i++) {
            materialRows.push({"0": values.materials[i].needed, "1": values.materials[i].by});
        }
        var materialCols= [
            {title: "MATERIALS NEEDED", datakey: "needed"}, {title: "BY", datakey: "by"}
        ];
        
        doc.autoTable(materialCols, materialRows, {
            theme: "grid",
            startY: doc.autoTable.previous.finalY,
            styles: {overflow: 'linebreak', fontSize: 8},
            fontSize: 8,
            margin: {horizontal: 20},
            columnStyles: {text: {columnWidth: 'auto'}}
        });
        
        var workRows = [];
        for(var i = 0; i < values.work.length; i++) {
            workRows.push({"0": values.work[i].performed, "1": values.work[i].location});
        }
        var workCols= [
            {title: "WORK PERFORMED", datakey: "performed"}, {title: "LOCATION", datakey: "location"}
        ];
        
        doc.autoTable(workCols, workRows, {
            theme: "grid",
            startY: doc.autoTable.previous.finalY,
            styles: {overflow: 'linebreak', fontSize: 8},
            fontSize: 8,
            margin: {horizontal: 20},
            columnStyles: {text: {columnWidth: 'auto'}}
        });
        
        var progressRows = [];
            for(var i = 0; i < values.progress.length; i++) {
                progressRows.push({"0": values.progress[i].location, "1": values.progress[i].description, "2": values.progress[i].percent});
            }
            var progressCols= [
                {title: "PROGRESS LOCATION", datakey: "progress"}, {title: "DESCRIPTION", datakey: "description"}, {title: "PERCENT", datakey: "percent"}
            ];

            doc.autoTable(progressCols, progressRows, {
                theme: "grid",
                startY: doc.autoTable.previous.finalY,
                styles: {overflow: 'linebreak', fontSize: 8},
                fontSize: 8,
                margin: {horizontal: 20},
                columnStyles: {text: {columnWidth: 'auto'}}
            });
    }
    
    
    // Table for IQR
    var iqrRows = [
        {"0": values.iqr}
    ]
    var iqrCols= [
        {title: "Issues / Questions / Remarks", datakey: "iqr"}
    ];

    doc.autoTable(iqrCols, iqrRows, {
        theme: "grid",
        startY: doc.autoTable.previous.finalY+5,
        styles: {overflow: 'linebreak', fontSize: 8},
        fontSize: 8,
        margin: {horizontal: 20},
        columnStyles: {text: {columnWidth: 'auto'}}
    });
    
    for(var i = 0; values.list != null && i < values.list.length; i++) {
        if(values.list[i].title == true) {
            var listCols = [
                {title: values.list[i].work, datakey: ("title_" + i)}
            ];
            var listRows = [
            ];
            doc.autoTable(listCols, listRows, {
                theme: "grid",
                startY: doc.autoTable.previous.finalY+5,
                styles: {overflow: 'linebreak', fontSize: 8},
                fontSize: 8,
                margin: {horizontal: 20},
                columnStyles: {text: {columnWidth: 'auto'}}
            });
        }
        else{
            var listCols = [
                {datakey: "5"},
                {datakey: "6"},
                {datakey: "7"},
                {datakey: "8"}
            ];
            var listRows = [
                {"0": values.list[i].work, "1": "Cost Code: " + values.list[i].code, "2": "Hours: " + values.list[i].hours, "3": "Overtime Hours: " + values.list[i].ot},
                {"0": "ISSUED MATERIALS: ", "1": values.list[i].issued, "2": "INSTALLED MATERIALS: ", "3": values.list[i].installed}
            ];
            doc.autoTable(listCols, listRows, {
                theme: "grid",
                startY: doc.autoTable.previous.finalY,
                styles: {overflow: 'linebreak', fontSize: 8},
                fontSize: 8,
                margin: {horizontal: 20},
                showHeader: "never",
                columnStyles: {text: {columnWidth: 'auto'}}
            });
        }
    }

    // Download Document
    doc.save(title);
}