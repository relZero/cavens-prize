function FireWorksInit(option) {
    var me = this;
    var firworksFlag = 1;
    var defaultConfig = {
        fireworksBox: $(".fireworks-box"),
        boxSpacingX: 0,
        boxSpacingY: 0,
        fireworksWidth: 0,
    };
    this.config = $.extend({}, defaultConfig, option);
    this.fireworksMinRangeX = this.config.boxSpacingX;
    this.fireworksMaxRangeX = $(window).width() - this.config.boxSpacingX;
    this.fireworksMinRangeY = this.config.boxSpacingY;
    this.fireworksMaxRangeY = $(window).height() - this.config.boxSpacingY;
    setInterval(function () {
        me.CreateFireWorks(firworksFlag);
        if (firworksFlag <= 20) {
            firworksFlag++
        } else {
            firworksFlag = 1
        }
    }, 400);
}

FireWorksInit.prototype = {
    CreateFireWorks: function (firworksFlag) {
        var me = this;
        var fireworksHtml = '<li class="firworksFlag' + firworksFlag + '"><div class="fireworks-big"></div><div class="fireworks-middle"></div><div class="fireworks-little"></div></li>';
        var fireworksLine = '<i class="fireworks-line fireworks-line' + firworksFlag + '"></i>';
        var fireworksX = this.CreateRomdom(this.fireworksMinRangeX, this.fireworksMaxRangeX);
        var fireworksY = this.CreateRomdom(this.fireworksMinRangeY, this.fireworksMaxRangeY);
        var fireworksOpacity = this.CreateRomdom(10, 5);
        var fireworksScale = this.CreateRomdom(10, 3);
        var opacityNum = fireworksOpacity === 10 ? 1 : parseFloat("0." + fireworksOpacity);
        var ScaleNum = fireworksScale === 10 ? 1 : parseFloat("0." + fireworksOpacity);
        this.config.fireworksBox.append(fireworksLine);
        this.config.fireworksBox.find(".fireworks-line" + firworksFlag).css("left", fireworksX + (this.config.fireworksWidth / 2)).animate({"bottom": (fireworksY + (this.config.fireworksWidth / 2)) / 2, "height": 50, "opacity": 1}, 200, function () {
            me.config.fireworksBox.find(".fireworks-line" + firworksFlag).animate({"bottom": fireworksY + (me.config.fireworksWidth / 2), "height": 0, "opacity": 1}, 200, function () {
                me.config.fireworksBox.find("ul").append(fireworksHtml);
                me.config.fireworksBox.find("li.firworksFlag" + firworksFlag).css({"left": fireworksX, "bottom": fireworksY, "opacity": opacityNum, "transform": "scale(" + ScaleNum + ")"}).show().addClass("current");
                setTimeout(function () {
                    me.config.fireworksBox.find("li.firworksFlag" + firworksFlag).fadeOut(2400, function () {
                        me.config.fireworksBox.find("li.firworksFlag" + firworksFlag).remove();
                        me.config.fireworksBox.find(".fireworks-line" + firworksFlag).remove();
                    });
                }, 800);
            })
        });
    },
    CreateRomdom: function (minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return Math.floor(Math.random() * (minNum + 1));
                break;
            case 2:
                return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
                break;
            default:
                return 0;
                break;
        }
    }
};