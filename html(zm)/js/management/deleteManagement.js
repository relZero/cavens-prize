$(function () {
    var excelToJsonInit = new ExcelToJsonInit(".lottery-btn input", true);
    excelToJsonInit.GetData("http://localhost:3005/deleteData?_sort=staffSort", "", function (data) {
        for (var i = 0; i < data.length; i++) {
            excelToJsonInit.DataRender(data[i], ".table-staff tbody");
        }
    });
    $(".jq-back").on("click", function () {
        var $tableStaff = $(".table-staff tbody tr");
        $tableStaff.each(function () {
            var $this = $(this);
            var $thisInput = $this.find("td").eq(0).find("input");
            if ($thisInput.prop("checked")) {
                backDataAction($this)
            }
        });
    });
    function backDataAction($this) {
        var thisId = $this.find("td").eq(0).find("input").attr("id");
        excelToJsonInit.GetData("http://localhost:3005/deleteData?_sort=staffSort", {id: thisId}, function (data) {
            var staffData = data[0];
            var sortNum;
            if (staffData.id < 10) {
                sortNum = "00" + staffData.id
            } else if (staffData.id >= 10 && staffData.id < 100) {
                sortNum = "0" + staffData.id
            } else {
                sortNum = staffData.id
            }
            excelToJsonInit.DeleteData("http://localhost:3005/deleteData/", staffData.id, function () {
                $this.remove();
                excelToJsonInit.PostData("http://localhost:3003/personnelData", {
                    id: staffData.id,
                    staffName: staffData.staffName,
                    staffDepartment: staffData.staffDepartment,
                    staffCompany: staffData.staffCompany,
                    staffHead: staffData.staffHead,
                    staffClass: staffData.staffClass,
                    staffSort: sortNum
                });
            });
            //deleteAllArr.push(thisId);
        });
    }
});


