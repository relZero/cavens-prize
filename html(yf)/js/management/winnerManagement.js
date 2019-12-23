$(function () {
    var jsonDataUrl = "http://192.168.25.26";
    var excelToJsonInit = new ExcelToJsonInit(".lottery-btn input", true);
    var $winnerEach = $(".winner-nav .nav-tabs li");
    $winnerEach.each(function () {
        var $this = $(this);
        var thisIndex = $this.index();
        var thisPrize = $this.data("prize");
        var $tableStaffBox = $(".table-staff");
        excelToJsonInit.GetData(jsonDataUrl + ":3004/" + thisPrize, "", function (data) {
            $tableStaffBox.eq(thisIndex).find("thead tr").append('<th>轮次</th>');
            for (var i = 0; i < data.length; i++) {
                excelToJsonInit.DataRender(data[i], ".table-staff:eq(" + thisIndex + ") tbody");
                $tableStaffBox.eq(thisIndex).find("tbody tr").eq(i).append('<td>' + data[i].staffRound + '</td>');
            }
        });
    });
    $(".jq-delete-all").on("click", function () {
        var $this = $(this);
        var thisTabIndex = $this.parents(".winner-box").index() - 2;
        var $tableStaff = $this.parents(".winner-box").find(".table-staff tbody tr");
        var thisTabPrize = $(".winner-nav ul li").eq(thisTabIndex).data("prize");
        $tableStaff.each(function () {
            var $this = $(this);
            deleteDataAction($this, thisTabPrize)
        });
    });

    $(".jq-back").on("click", function () {
        var $this = $(this);
        var thisTabIndex = $this.parents(".winner-box").index() - 2;
        var $tableStaff = $this.parents(".winner-box").find(".table-staff tbody tr");
        var thisTabPrize = $(".winner-nav ul li").eq(thisTabIndex).data("prize");
        $tableStaff.each(function () {
            var $this = $(this);
            var $thisInput = $this.find("td").eq(0).find("input");
            if ($thisInput.prop("checked")) {
                backDataAction($this, thisTabPrize)
            }
        });
    });

    function deleteDataAction($this, thisTabPrize) {
        var thisId = $this.find("td").eq(0).find("input").attr("id");
        excelToJsonInit.GetData(jsonDataUrl + ":3004/" + thisTabPrize + "?_sort=staffSort", {id: thisId}, function (data) {
            var staffData = data[0];
            excelToJsonInit.DeleteData(jsonDataUrl + ":3004/" + thisTabPrize + "/", staffData.id, function () {
                $this.remove();
            });
            //deleteAllArr.push(thisId);
        });
    }

    function backDataAction($this, thisTabPrize) {
        var thisId = $this.find("td").eq(0).find("input").attr("id");
        var prizeUrl;
        if (thisTabPrize === "bonus") {
            prizeUrl = jsonDataUrl + ":3006/bonusData";
        } else if (thisTabPrize === "table") {
            prizeUrl = jsonDataUrl + ":3007/tableData";
        } else {
            prizeUrl = jsonDataUrl + ":3003/personnelData";
        }
        excelToJsonInit.GetData(jsonDataUrl + ":3004/" + thisTabPrize + "?_sort=staffSort", {id: thisId}, function (data) {
            var staffData = data[0];
            var sortNum;
            if (staffData.id < 10) {
                sortNum = "00" + staffData.id
            } else if (staffData.id >= 10 && staffData.id < 100) {
                sortNum = "0" + staffData.id
            } else {
                sortNum = staffData.id
            }
            excelToJsonInit.DeleteData(jsonDataUrl + ":3004/" + thisTabPrize + "/", staffData.id, function () {
                $this.remove();
                excelToJsonInit.PostData(prizeUrl, {
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

    init_tab();
});


function init_tab() {
    // 约定, 选项卡导航包含在".ui-tab-nav"内, 对应的选项卡内容必须有".ui-tab-bd"样式, 并按导航的顺序排放.
    var fn_tab = function (e, $tab) {
        var $this = $(this);
        var $thisImg = $(".ui-tab-img");
        var $tab = $this.closest(".ui-tab,.ui-tab-hover");
        var $tab_nav_box = $this.closest(".ui-nav-box");
        var $tab_nav_item = $this;
        var tab_index;

        e.preventDefault();

        while (!$tab_nav_item.parent().hasClass("ui-tab-nav")) {
            $tab_nav_item = $tab_nav_item.parent();
        }
        tab_index = $tab_nav_item.index();

        $tab.children(".ui-tab-bd.active").removeClass("active");
        $tab_nav_box.children(".ui-tab-nav").find(".active").removeClass("active");
        $tab_nav_box.children(".ui-tab-nav").children().eq(tab_index).add($tab.children(".ui-tab-bd").eq(tab_index)).addClass("active");
        if (!!$.fn.lazyload) {
            $tab.children(".ui-tab-bd").eq(tab_index).find("img").trigger("appear");
        }
        if ($thisImg.length > 0) {
            var thisImgUrl = $this.parents("li").data("imgurl");
            $this.parents(".ui-tab-img").css("background-image", "url(" + thisImgUrl + ")")
        }
    };
    if ($(".ui-tab").length > 0) {
        $(".ui-tab").on("click", ".ui-tab-nav a", function (e) {
            fn_tab.call(this, e);
        });
    }
    if ($(".ui-tab-hover").length > 0) {
        $(".ui-tab-hover").on("hover", ".ui-tab-nav a", function (e) {
            fn_tab.call(this, e);
        });
    }
}
