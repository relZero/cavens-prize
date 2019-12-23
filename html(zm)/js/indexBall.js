var ballAnimate2, ballTurn2, ballBoom2;

function IndexWordInit(configObj) {
    var defaultConfig = {
        ballFlag: true,
        threeBallHead: "",
        ballBoxId: "container",
        picFolderName: "head",
        picNumber: 0,
        picNumberCompared: 0,
        picTypeName: "jpg",
        actionArr: []
    };
    this.config = $.extend({}, defaultConfig, configObj);
    this.personArray = [];
    // 生成虚拟数据
    this.table = [];
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.controls = null;
    this.objects = [];
    this.targets = {table: [], sphere: [], helix: [], grid: []};
    if (!this.config.ballFlag) {
        this.clearActive();
        return false;
    }
    this.picInit();
    this.tableInit();
    this.init();
    this.animate();

}

IndexWordInit.prototype = {
    init: function () {
        var me = this;
        me.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
        me.camera.position.z = 3000;
        me.scene = new THREE.Scene();
        // table
        for (var i = 0; i < me.table.length; i++) {
            var element = document.createElement('div');
            element.className = 'element';
            element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';
            var img = document.createElement('img');
            img.src = me.table[i].image;
            element.appendChild(img);
            var object = new THREE.CSS3DObject(element);
            object.position.x = Math.random() * 4000 - 2000;
            object.position.y = Math.random() * 4000 - 2000;
            object.position.z = Math.random() * 4000 - 2000;
            me.scene.add(object);
            me.objects.push(object);
        }
        // sphere
        var vector = new THREE.Vector3();
        var spherical = new THREE.Spherical();
        for (var i = 0, l = me.objects.length; i < l; i++) {
            var phi = Math.acos(-1 + (2 * i) / l);
            var theta = Math.sqrt(l * Math.PI) * phi;
            var object = new THREE.Object3D();
            spherical.set(800, phi, theta);
            object.position.setFromSpherical(spherical);
            vector.copy(object.position).multiplyScalar(2);
            object.lookAt(vector);
            me.targets.sphere.push(object);
        }
        //渲染
        me.renderer = new THREE.CSS3DRenderer();
        me.renderer.setSize(window.innerWidth, window.innerHeight);
        me.renderer.domElement.style.position = 'absolute';
        document.getElementById(this.config.ballBoxId).appendChild(me.renderer.domElement);
        // 鼠标控制
        me.controls = new THREE.TrackballControls(me.camera, me.renderer.domElement);
        me.controls.rotateSpeed = 0.5;
        me.controls.minDistance = 500;
        me.controls.maxDistance = 6000;
        me.controls.addEventListener('change', me.render.bind(this));
        me.transform(me.targets.sphere, 2000);
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    },
    transform: function (targets, duration) {
        var me = this;
        TWEEN.removeAll();
        for (var i = 0; i < me.objects.length; i++) {
            var object = me.objects[i];
            var target = targets[i];
            var targetWord = me.config.actionArr[i];
            new TWEEN.Tween(object.position)
                .to({x: targetWord.x - 1920, y: targetWord.y - 420, z: 0}, Math.random() * duration + duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            new TWEEN.Tween(object.rotation)
                .to({x:0, y: 0, z: 0}, Math.random() * duration + duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        }
        new TWEEN.Tween(this)
            .to({}, duration * 2)
            .onUpdate(me.render)
            .start();
    },
    animate: function () {
        cancelAnimationFrame(ballTurn2);
        cancelAnimationFrame(ballBoom2);
        // 让场景通过x轴或者y轴旋转  & z
        // scene.rotation.x += 0.011;
        //this.scene.rotation.y += 0.008;
        ballAnimate2 = requestAnimationFrame(this.animate.bind(this));
        TWEEN.update();
        this.controls.update();
        // 渲染循环
        this.render();
    },
    onWindowResize: function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.render();
    },
    tableInit: function () {
        var me = this;
        for (var i = 0; i < me.personArray.length; i++) {
            this.table[i] = {};
            if (i < me.personArray.length) {
                this.table[i] = me.personArray[i];
                this.table[i].src = me.personArray[i].thumb_image;
            }
            this.table[i].p_x = i % 20 + 1;
            this.table[i].p_y = Math.floor(i / 20) + 1;
        }
    },
    picInit: function () {
        var me = this;
        for (var i = 0; i < this.config.picNumber; i++) {

            if (i < this.config.picNumberCompared) {
                var j = i;
                var headData = me.config.threeBallHead[j];
                me.personArray.push({
                    image: "images/" + this.config.picFolderName + "/" + headData + "." + this.config.picTypeName
                });
            } else {
                var j = i - (parseInt(i / this.config.picNumberCompared) * this.config.picNumberCompared);
                var headData = me.config.threeBallHead[j];
                me.personArray.push({
                    image: "images/" + this.config.picFolderName + "/" + headData + "." + this.config.picTypeName
                });
            }
        }
    },
    turnAnimate: function () {
        cancelAnimationFrame(ballAnimate2);
        cancelAnimationFrame(ballBoom2);
        this.scene.rotation.y += 1;
        ballTurn2 = requestAnimationFrame(this.turnAnimate.bind(this));
        TWEEN.update();
        this.controls.update();
        // 渲染循环
        this.render();
    },
    boomAnimate: function () {
        cancelAnimationFrame(ballAnimate2);
        cancelAnimationFrame(ballTurn2);
        //this.controls.maxDistance -= 500;
        ballBoom2 = requestAnimationFrame(this.boomAnimate.bind(this));
        this.controls.minDistance -= 2000;
        if (this.controls.minDistance  <= -100000) {
            cancelAnimationFrame(ballBoom2);
            $(".lottery-outer").hide();
            $(".lottery-award").fadeIn(1000);
            var awardNum = 0;
            var $lotteryAwardLi = $(".lottery-award ul li");
            var awardLength = $lotteryAwardLi.length;
            $lotteryAwardLi.eq(awardNum).addClass("current");
            var awardAct = setInterval(function () {
                awardNum++;
                if(awardNum >= awardLength - 1){
                    clearInterval(awardAct);
                }
                if(awardLength === 6){
                    if(awardNum > 2){
                        $(".lottery-award ul li").eq(awardNum).addClass("current3");
                    } else {
                        $(".lottery-award ul li").eq(awardNum).addClass("current");
                    }
                } else if(awardLength === 7 || awardLength === 8) {
                    if(awardNum > 3){
                        $(".lottery-award ul li").eq(awardNum).addClass("current2");
                    } else {
                        $(".lottery-award ul li").eq(awardNum).addClass("current");
                    }
                } else {
                    $(".lottery-award ul li").eq(awardNum).addClass("current");
                }

            },2000);
            this.clearActive();
        }
        TWEEN.update();
        this.controls.update();
        // 渲染循环
        this.render();
    },
    render: function () {
        this.renderer.render(this.scene, this.camera);
    },
    clearActive: function () {
        cancelAnimationFrame(ballAnimate2);
        cancelAnimationFrame(ballTurn2);
        cancelAnimationFrame(ballBoom2);
        $("#" + this.config.ballBoxId).children().remove();
    }
};