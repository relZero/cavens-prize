var ranArray = [];
var roundArr = ["lucky", "third", "second", "first", "particular", "bonus"];
var roundObj = {
    luckyRound: 0,
    thirdRound: 0,
    secondRound: 0,
    firstRound: 0,
    particularRound: 0,
    bonusRound: 0,
};
var roundNum, awardName, awardType;
var turnFlat = true;
var pFlag = false;

$(function () {
    for (var i = 0; i < roundArr.length; i++) {
        winnerDataInit(roundArr[i], "", "?_sort=staffRound&_order=DESC", function (res, searUrl) {
            if (res.length > 0) {
                if (searUrl === "lucky") {
                    $(".winner-list .list-tab li").eq(0).show();
                    roundObj.luckyRound = res[0].staffRound;
                }
                if (searUrl === "third") {
                    $(".winner-list .list-tab li").eq(1).show();
                    roundObj.thirdRound = res[0].staffRound;
                }
                if (searUrl === "second") {
                    $(".winner-list .list-tab li").eq(2).show();
                    roundObj.secondRound = res[0].staffRound;
                }
                if (searUrl === "first") {
                    $(".winner-list .list-tab li").eq(3).show();
                    roundObj.firstRound = res[0].staffRound;
                }
                if (searUrl === "particular") {
                    $(".winner-list .list-tab li").eq(4).show();
                    roundObj.particularRound = res[0].staffRound;
                }
                if (searUrl === "bonus") {
                    $(".winner-list .list-tab li").eq(5).show();
                    roundObj.bonusRound = res[0].staffRound;
                }
                pFlag = true;
            }
        })
    }
    $(".lottery-index").fadeIn(1000);
    KeyActionInit();
    StarBackgroundInit();
    init_tab();
});

function StarBackgroundInit() {
    var winWidth = $(window).innerWidth();
    var winHeight = $(window).innerHeight();
    var settings = {
        width: winWidth,
        height: winHeight,
        autoResize: false,
        autoResizeMinWidth: null,
        autoResizeMaxWidth: null,
        autoResizeMinHeight: null,
        autoResizeMaxHeight: null,
        addMouseControls: false,
        addTouchControls: true,
        hideContextMenu: true,
        starCount: 3000,
        starBgCount: 0,
        starBgColor: {r: 255, g: 255, b: 255},
        starBgColorRangeMin: 50,
        starBgColorRangeMax: 100,
        starColor: {r: 255, g: 255, b: 255},
        starColorRangeMin: 50,
        starColorRangeMax: 100,
        starfieldBackgroundColor: {r: 1, g: 35, b: 80},
        starDirection: 1,
        starSpeed: 20,
        starSpeedMax: 20,
        starSpeedAnimationDuration: 2,
        starFov: 400,
        starFovMin: 300,
        starFovAnimationDuration: 2,
        starRotationPermission: true,
        starRotationDirection: 1,
        starRotationSpeed: 0.0,
        starRotationSpeedMax: 1.0,
        starRotationAnimationDuration: 2,
        starWarpLineLength: 2.0,
        starWarpTunnelDiameter: 100,
        starFollowMouseSensitivity: 1,
        starFollowMouseXAxis: true,
        starFollowMouseYAxis: true
    };
    var warpdrive = new WarpDrive(document.getElementById('holder'), settings);
}

function KeyActionInit() {
    var threeBallInit;
    var alterFlag = true;
    var keyFlag = true;
    //var lotteryFlag = true;
    var $lotteryOuter = $(".lottery-outer");
    var $lotteryIndex = $(".lottery-index");
    var $lotteryGame = $(".lottery-game");
    var $lotteryWinner = $(".lottery-winner");
    var $lotteryAward = $(".lottery-award");
    var awardArray = ["幸运奖", "三等奖", "二等奖", "一等奖", "特等奖", "红包雨"];
    var i = 0;
    $(document).on("keydown", function (e) {
        var $awardInput = $(".lottery-num input");
        //console.log(keyFlag)
        if (e.keyCode === 122) {
            window.location.reload();
        }
        //ctrl+enter键开始或停止抽奖
        if (e.keyCode === 13 && e.ctrlKey && $lotteryGame.css("display") === "block") {
            turnFlat = false;
            if (alterFlag) {
                TurnBallInit("start");
            } else {
                TurnBallInit("stop");
            }
        }
        else if (e.keyCode == 37) {
            if ($lotteryGame.css("display") === "block" && !turnFlat) {
                return false;
            }
            //左键 切换奖项
            if ($lotteryGame.css("display") === "block") {
                AwardSwitchLeft();
            }
        } else if (e.keyCode == 39) {
            if ($lotteryGame.css("display") === "block" && !turnFlat) {
                return false;
            }
            //右键  切换奖项
            if ($lotteryGame.css("display") === "block") {
                AwardSwitchRight();
            }
        } else if (e.keyCode == 38) {
            if (!keyFlag || $lotteryGame.css("display") === "block" && !turnFlat) {
                return false;
            }
            //上键  首页
            $lotteryOuter.hide();
            $lotteryIndex.fadeIn(1000);
            threeBallInit = new ThreeBallInit({
                ballFlag: false
            });
        }
        else if (e.keyCode == 40) {
            if (!keyFlag) {
                return false;
            }
            //下键  抽奖页
            if ($lotteryGame.css("display") !== "block") {
                GotoGame();
            }
        } else if (e.keyCode == 80) {
            if (!keyFlag || !pFlag || $lotteryGame.css("display") === "block" && !turnFlat) {
                return false;
            }
            //P键  获奖名单
            if ($lotteryWinner.css("display") !== "block") {
                GotoWinner();
            }
        } else if (e.keyCode === 48 || e.keyCode === 96) {
            if ($lotteryGame.css("display") === "block") {
                if (!turnFlat) {
                    return false;
                }
                $awardInput.val(10);
            }
        } else if (e.keyCode === 49 || e.keyCode === 97) {
            if ($lotteryGame.css("display") === "block") {
                if (!turnFlat) {
                    return false;
                }
                $awardInput.val(1);
            }
        } else if (e.keyCode === 50 || e.keyCode === 98) {
            if ($lotteryGame.css("display") === "block") {
                if (!turnFlat) {
                    return false;
                }
                $awardInput.val(2);
            }
            $awardInput.val(2);
        } else if (e.keyCode === 51 || e.keyCode === 99) {
            if ($lotteryGame.css("display") === "block") {
                if (!turnFlat) {
                    return false;
                }
                $awardInput.val(3);
            }
            $awardInput.val(3);
        } else if (e.keyCode === 52 || e.keyCode === 100) {
            if ($lotteryGame.css("display") === "block") {
                if (!turnFlat) {
                    return false;
                }
                $awardInput.val(4);
            }
        } else if (e.keyCode === 53 || e.keyCode === 101) {
            if ($lotteryGame.css("display") === "block") {
                if (!turnFlat) {
                    return false;
                }
                $awardInput.val(5);
            }
        } else if (e.keyCode === 54 || e.keyCode === 102) {
            if ($lotteryGame.css("display") === "block") {
                if (!turnFlat) {
                    return false;
                }
                $awardInput.val(6);
            }
        } else if (e.keyCode === 55 || e.keyCode === 103) {
            if ($lotteryGame.css("display") === "block") {
                if (!turnFlat) {
                    return false;
                }
                $awardInput.val(7);
            }
        } else if (e.keyCode === 56 || e.keyCode === 104) {
            if ($lotteryGame.css("display") === "block") {
                if (!turnFlat) {
                    return false;
                }
                $awardInput.val(8);
            }
        } else if (e.keyCode === 57 || e.keyCode === 105) {
            if ($lotteryGame.css("display") === "block") {
                if (!turnFlat) {
                    return false;
                }
                $awardInput.val(9);
            }
        }
        keyFlag = false;
        setTimeout(function () {
            keyFlag = true;
        }, 500);
    });

    $(".jq-lottery-left").on("click", function () {
        if (!turnFlat) {
            return false;
        }
        AwardSwitchLeft();
    });

    $(".jq-lottery-right").on("click", function () {
        if (!turnFlat) {
            return false;
        }
        AwardSwitchRight();
    });

    $(".jq-lottery-start").on("click", function () {
        turnFlat = false;
        if (alterFlag) {
            TurnBallInit("start");
        } else {
            TurnBallInit("stop");
        }
    });
    $(".jq-lottery-record").on("click", function () {
        if (!keyFlag || !pFlag || !turnFlat) {
            return false;
        }
        GotoWinner();
    });
    $(".jq-winner-close").on("click", function () {
        GotoGame();
    });

    function TurnBallInit(enterFlat) {
        var getTurnUrl;
        if (enterFlat === "start") {
            console.log(roundObj);
            awardName = $(".lottery-num .award-word").text();
            if (awardName.indexOf("幸运奖") >= 0) {
                roundObj.luckyRound++;
                roundNum = roundObj.luckyRound;
                awardType = "lucky";
            }
            if (awardName.indexOf("三等奖") >= 0) {
                roundObj.thirdRound++;
                roundNum = roundObj.thirdRound;
                awardType = "third";
            }

            if (awardName.indexOf("二等奖") >= 0) {
                roundObj.secondRound++;
                roundNum = roundObj.secondRound;
                awardType = "second";
            }
            if (awardName.indexOf("一等奖") >= 0) {
                roundObj.firstRound++;
                roundNum = roundObj.firstRound;
                awardType = "first";
            }
            if (awardName.indexOf("特等奖") >= 0) {
                roundObj.particularRound++;
                roundNum = roundObj.particularRound;
                awardType = "particular";
            }
            if (awardName.indexOf("红包雨") >= 0) {
                roundObj.bonusRound++;
                roundNum = roundObj.bonusRound;
                awardType = "bonus";
            }
        }
        $(".prize-title").text(awardName.replace("：", ""));
        if (awardName.indexOf("红包雨") >= 0) {
            getTurnUrl = "http://localhost:3006/bonusData";
        } else if (awardName.indexOf("三等奖") >= 0) {
            getTurnUrl = "http://localhost:3007/tableData";
        } else {
            getTurnUrl = "http://localhost:3003/personnelData";
        }
        getUserInfo(getTurnUrl, "", function (userData) {
            if (enterFlat === "start") {
                var formalArr = [];
                var actionPersonnel = [];
                var ranNum = $(".lottery-num input").val();
                $(".lottery-start").css("background-image", "url('images/lottery-stop.png')");
                if (!awardName.indexOf("红包雨") >= 0 && !awardName.indexOf("三等奖") >= 0) {
                    for (var i = 0; i < userData.length; i++) {
                        var formalData = userData[i];
                        if (formalData.staffClass === "是") {
                            formalArr.push(formalData)
                        }
                    }
                }
                threeBallInit.turnAnimate();
                if (ranNum > 0 && ranNum <= 5) {
                    $(".prize-inner").css({"width":240 * ranNum, "margin-top":30});
                }
                if (ranNum > 5 && ranNum <= 10) {
                    $(".prize-inner").css({"width":240 * parseInt((ranNum / 2).toFixed()),"margin-top":0});
                }
                if (awardName.indexOf("一等奖") >= 0 || awardName.indexOf("二等奖") >= 0 || awardName.indexOf("特等奖") >= 0) {
                    for (var i = 0; i < formalArr.length; i++) {
                        var forFormal = formalArr[i];
                        actionPersonnel.push(forFormal.id);
                    }
                } else {
                    for (var i = 0; i < userData.length; i++) {
                        var forAll = userData[i];
                        actionPersonnel.push(forAll.id);
                    }
                }
                actionPersonnel.sort(() => Math.random() - 0.5);
                ranArray = getRandomArrayElements(actionPersonnel, ranNum);
                alterFlag = false;
            } else {
                $(".lottery-start").css("background-image", "url('images/lottery-start.png')");
                $lotteryAward.find("ul li").remove();
                for (var i = 0; i < ranArray.length; i++) {
                    getUserInfo(getTurnUrl, {
                        id: ranArray[i]
                    }, function (userData) {
                        var winnerData = userData[0];
                        $lotteryAward.find("ul").append('<li><img src="images/head/' + winnerData.staffHead + '.jpg"><em>' + winnerData.staffName + '</em><p>' + winnerData.staffCompany + '-' + winnerData.staffDepartment + '</p></li>');
                        ajaxInit("http://localhost:3004/" + awardType, {
                            id: winnerData.id,
                            staffName: winnerData.staffName,
                            staffDepartment: winnerData.staffDepartment,
                            staffCompany: winnerData.staffCompany,
                            staffHead: winnerData.staffHead,
                            staffClass: winnerData.staffClass,
                            staffRound: roundNum
                        }, "post");
                    });
                }
                threeBallInit.boomAnimate();
                for (var i = 0; i < ranArray.length; i++) {
                    ajaxInit(getTurnUrl + "/" + ranArray[i], "", "delete");
                }
                alterFlag = true;
                turnFlat = true;
                pFlag = true;
            }
        });
    }

    function AwardSwitchLeft() {
        if (i === 0) {
            //i = awardArray.length - 1;
            return false;
        } else {
            i--
        }
        $(".lottery-num .award-word").text(awardArray[i] + "：");
        AwardDefaultNum(awardArray[i]);
    }

    function AwardSwitchRight() {
        if ($lotteryGame.css("display") === "block") {
            if (i === awardArray.length - 1) {
                //i = 0;
                return false;
            } else {
                i++
            }
            $(".lottery-num .award-word").text(awardArray[i] + "：");
            AwardDefaultNum(awardArray[i]);
        }
    }

    function AwardDefaultNum(awardArrayNum) {
        var $awardInput = $(".lottery-num input");
        if (awardArrayNum === "幸运奖") {
            $awardInput.val(8);
        }
        if (awardArrayNum === "三等奖") {
            $awardInput.val(1);
        }
        if (awardArrayNum === "二等奖") {
            $awardInput.val(2);
        }
        if (awardArrayNum === "一等奖") {
            $awardInput.val(1);
        }
        if (awardArrayNum === "特等奖") {
            $awardInput.val(1);
        }
        if (awardArrayNum === "红包雨") {
            $awardInput.val(1);
        }
    };

    function GotoGame() {
        var threeBallHead = [];
        getUserInfo("http://localhost:3003/personnelData", "", function (res) {
            for (var i = 0; i < res.length; i++) {
                var headRes = res[i].staffHead;
                threeBallHead.push(headRes)
            }
            $lotteryOuter.hide();
            $lotteryGame.fadeIn(3000);
            threeBallInit = new ThreeBallInit({
                threeBallHead: threeBallHead,
                picNumber: 230,
                picNumberCompared: threeBallHead.length,
            });
        });
    }

    function GotoWinner() {
        $lotteryOuter.hide();
        $lotteryWinner.fadeIn(1000);
        threeBallInit = new ThreeBallInit({
            ballFlag: false
        });
        getWinnerInfo("lucky", "", "lucky-box", $lotteryWinner, 0);
        getWinnerInfo("third", "", "third-box", $lotteryWinner, 1);
        getWinnerInfo("second", "", "second-box", $lotteryWinner, 2);
        getWinnerInfo("first", "", "first-box", $lotteryWinner, 3);
        getWinnerInfo("particular", "", "particular-box", $lotteryWinner, 4);
        getWinnerInfo("bonus", "", "bonus-box", $lotteryWinner, 5);
        //getWinnerInfo("table", "", "table-box");
    }


}

function getUserInfo(getUrl, searchData, callback) {
    ajaxInit(getUrl, searchData, "get", function (res) {
        callback && callback(res);
    })
}

function getWinnerInfo(searUrl, searchData, winnerBox, $lotteryWinner, winnerTabNum) {
    winnerDataInit(searUrl, searchData, "", function (res) {
        if (res.length <= 0) {
            $lotteryWinner.find(".winner-list ." + winnerBox + " ul").append('<li style="width:100%; padding:0; margin:0; height:525px; color:#fff; font-size:28px; text-align:center; line-height:525px;">暂无中奖名单！</li>')
        } else {
            $lotteryWinner.find(".winner-list ." + winnerBox + " ul li").remove();
            $(".winner-list .list-tab li").eq(winnerTabNum).show();
            for (var i = 0; i < res.length; i++) {
                var winnerData = res[i];
                $lotteryWinner.find(".winner-list ." + winnerBox + " ul").append('<li><i>' + (i + 1) + '</i><p><img src="images/head/' + winnerData.staffHead + '.jpg"><em>' + winnerData.staffCompany + '-' + winnerData.staffDepartment + '-' + winnerData.staffName + '</em></p></li>')
            }
        }
    });
}

function getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

function ajaxInit(url, data, type, callback) {
    $.ajax({
        url: url,
        data: data,
        type: type,
        success: function (res) {
            callback && callback(res);
        }
    });
}

function winnerDataInit(searUrl, searchData, searchSort, callback) {
    getUserInfo("http://localhost:3004/" + searUrl + searchSort, searchData, function (res) {
        callback && callback(res, searUrl);
    })
}

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

        $tab.children(".ui-tab-bd.current").removeClass("current");
        $tab_nav_box.children(".ui-tab-nav").find(".current").removeClass("current");
        $tab_nav_box.children(".ui-tab-nav").children().eq(tab_index).add($tab.children(".ui-tab-bd").eq(tab_index)).addClass("current");
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
