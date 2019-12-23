$(function () {
    var excelToJsonInit = new ExcelToJsonInit(".lottery-btn input", true);
    excelToJsonInit.GetData("http://localhost:3006/bonusData?_sort=staffSort", "", function (data) {
        for (var i = 0; i < data.length; i++) {
            excelToJsonInit.DataRender(data[i], ".table-staff tbody");
        }
    });
    $(".jq-delete").on("click", function () {
        var $tableStaff = $(".table-staff tbody tr");
        $tableStaff.each(function () {
            var $this = $(this);
            var $thisInput = $this.find("td").eq(0).find("input");
            if ($thisInput.prop("checked")) {
                deleteDataAction($this)
            }
        });
    });
    $(".jq-delete-all").on("click", function () {
        var $tableStaff = $(".table-staff tbody tr");
        $tableStaff.each(function () {
            var $this = $(this);
            deleteDataAction($this)
        });
    });
    function deleteDataAction($this) {
        var thisId = $this.find("td").eq(0).find("input").attr("id");
        excelToJsonInit.GetData("http://localhost:3006/bonusData?_sort=staffSort", {id: thisId}, function (data) {
            var staffData = data[0];
            excelToJsonInit.DeleteData("http://localhost:3006/bonusData/", staffData.id, function () {
                $this.remove();
                excelToJsonInit.PostData("http://localhost:3005/deleteBonus", {
                    id: staffData.id,
                    staffName: staffData.staffName,
                    staffDepartment: staffData.staffDepartment,
                    staffCompany: staffData.staffCompany,
                    staffHead: staffData.staffHead,
                    staffClass: staffData.staffClass,
                    staffSort: staffData.id < 10 ? "0" + staffData.id : staffData.id
                });
            });
            //deleteAllArr.push(thisId);
        });
    }
});


