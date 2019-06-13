(function (win) {
    // 声明js为严格模式，消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;
    "use strict";

    /*
    * 模拟jquery实现链式编程式，注意：以下方法不尽和jquery相同
    * 用法：$('.wrap').addClass('newClass').removeClass('oldClass');
    * */
    var $ = function (selector) {
        //  创建快速选择器
        function SlideSelector(selector) {
            this.selector = document.querySelectorAll(selector);
            this.len = this.selector.length;
            this.ele = selector;
        }

        SlideSelector.prototype = {
            //  添加类名
            addClass: function (className) {
                var that = this;
                this.selector.forEach(function (item, index) {
                    that.selector[index].classList.add(className)
                });
                return this;
            },
            //  移除类名
            removeClass: function (className) {
                var that = this;
                this.selector.forEach(function (item, index) {
                    that.selector[index].classList.remove(className)
                });
                return this;
            },
            // 第几个
            eq: function (n) {
                return document.querySelectorAll(selector)[n];
            },
            // 遍历选择器
            each: function (callback) {
                for (var index = 0; index < this.len; index++) {
                    callback(index, this.selector[index]);
                }
            },
            html: function (html) {
                var aa = '';
                this.each(function (index, item) {
                    html ? item.innerHTML = html : aa += item.innerHTML;
                });
                if (!html) return aa;
            },
            find: function (ele) {
                this.selector = document.querySelectorAll(this.ele + ' ' + ele);
                this.len = this.selector.length;
                return this;
            },
            index: function () {
                var x = 0;
                return x;
            },
            parent: function () {

            }
        };

        /*
        * 寄生组合式继承：在函数内返回对象然后调用
        * 继承SlideSelector的属性
        * */
        return new SlideSelector(selector);
    };

    /*
    * 创建一个公共类，用来设置默认值
    *   @param:
    *       obj：需要设置的默认值
    * */
    function SlideDefault(obj) {
        this.selector = '.wrap';
        this.images = ['http://www.bjlpattaya.com/project/images/img99.jpg',
            'http://www.bjlpattaya.com/project/images/img100.jpg',
            'http://www.bjlpattaya.com/project/images/img101.jpg',
            'http://www.bjlpattaya.com/project/images/img102.jpg'];
        this.items = 4;
        this.animation = {
            delay: .2,
            duration: 20,
            count: 'infinite',
            function: 'ease-in',
            state: ''
        };
        this.wrapStyle = {
            width: 800,
            height: 300,
            margin: '100px auto',
            perspective: '800px'
        };
        this.navigation = {
            type: 'disc',
            bgcolor: '#2e82ff',
            bottom: '10%'
        };
        this.link = {
            url: ['www.baidu.com', 'www.sohu.com', 'www.qq.com', 'jd.com'],
            target: '_blank'
        };
        for (var key in obj) {
            if (obj[key] instanceof Object) {
                for (var subKey in obj[key]) {
                    this[key][subKey] = obj[key][subKey];
                }
            } else {
                this[key] = obj[key];
            }
        }
    }

    /*
    * Slide.js 主体函数
    * @param
    *   obj：构造Slide函数时传递的参数，即轮播图的相关设置
    * */
    function Slide(obj) {
        /*
        * 这里Slide本身没有默认值相应的属性，
        * 组合式继承（构造函数+原型）：继承SlideDefault的属性，来继承默认值
        * 再通过传递的参数对相应的属性进行设置
        * @param:
        *   obj：根据构造函数的参数设置相应的默认值
        * */
        SlideDefault.call(this, obj);
        // 初始化插件
        if (obj.type === '3d' || 'undefined') this.init3d(obj);
        if (obj.type === '2d') this.init2d(obj);
    }

    Slide.prototype = {
        /*
        * 3D轮播图插件初始化
        * @param
        *   obj：创建构造函数时传递的参数
        * */
        init3d: function (obj) {
            this.createWrap();  //  创建轮播图容器
            this.setWrapStyle();  //  设置轮播图容器样式
            this.createBox();  //  创建轮播项目容器
            this.setBoxStyle();  //  设置轮播项目样式
            this.setImages();  // 设置轮播图片样式
            if (obj.animation && obj.animation.state === 'hover') this.state();  //  判断是否鼠标控制暂停效果
            /*if (obj.navigation) this.createNavigation();  //  判断是否创建项目导航*/
        },

        // 创建轮播图容器
        createWrap: function () {
            $(this.selector).addClass('slide3d-wrap');
        },

        // 给轮播图容器添加样式
        setWrapStyle: function () {
            var style = "<style id='slide3d'></style>";

            /*
            * 原生js在元素内部的最前面和最后面插入元素insertAdjacentHTML()
            * 两个参数：第一个参数afterbegin在调用元素的内部第一个子元素前面添加一个目标元素
            *                  beforeend在调用元素的内部最后一个子元素后面添加一个目标元素
            *         第二个参数插入的目标元素
            * */
            !$('#slide3d').len ? $("head").eq(0).insertAdjacentHTML('afterbegin', style) : '';

            var slide3dStyle = this.selector + "{" +
                "display: flex;" +
                "width:" + this.wrapStyle.width + "px;" +
                "height:" + this.wrapStyle.height + "px;" +
                "margin:" + this.wrapStyle.margin + ";" +
                "perspective:" + this.wrapStyle.perspective + ";" +
                "}";

            $('#slide3d').html($('#slide3d').html() + slide3dStyle);
        },

        // 创建轮播项目
        createBox: function () {
            var html = '';
            for (var i = 0; i < this.items; i++) {
                html += '<div class="box">' +
                    '<div class="after"><img src="' + this.images[0] + '" alt=""></div>' +
                    '<div class="top"><img src="' + this.images[1] + '" alt=""></div>' +
                    '<div class="bottom"><img src="' + this.images[2] + '"></div>' +
                    '<div class="before"><img src="' + this.images[3] + '" alt=""></div>' +
                    '</div>';
            }
            $(this.selector).html(html);
        },

        // 设置轮播项目相关样式
        setBoxStyle: function () {
            this.style = $('#slide3d').eq(0);
            this.translateZ = this.wrapStyle.height / 2;
            var t = this.selector;
            this.style.innerText += t + '.slide3d-wrap > .box{' +
                '   transform-style: preserve-3d;' +
                '   transform: rotateX(360deg) translateZ(' + this.translateZ + 'px);' +
                '   position: relative;' +
                '   flex: 1;' +
                '   width: ' + 100 / this.items + '%;' +
                '   height: 100%;' +
                '   margin-left: -1px;' +
                '   animation: rotate' + $('.slide3d-wrap').len + ' ' + this.animation.duration + 's ' + this.animation.count + ' ' + this.animation.function + ';' +
                '}' +
                t + '.slide3d-wrap > .box > div {' +
                '   position: absolute;' +
                '   top: 0;' +
                '   left: 0;' +
                '   width: 100%;' +
                '   height: 100%;' +
                '   overflow: hidden;' +
                '   z-index: 0;' +
                '}' +
                t + '.slide3d-wrap > .box img {' +
                '   border: 0;' +
                '   padding: 0;' +
                '   outline-width: 0;' +
                '   vertical-align: middle;' +
                '   -webkit-transform: rotateX(180deg);' +
                '   transform: rotateX(180deg);' +
                '}' +
                t + '.slide3d-wrap > .box .before img {' +
                '   -webkit-transform: rotateX(0deg);' +
                '   transform: rotateX(0deg);' +
                '}' +
                '.box .top {' +
                '   -webkit-transform-origin: top;' +
                '   transform-origin: top;' +
                '   -webkit-transform: rotateX(-90deg);' +
                '   transform: rotateX(-90deg);' +
                '}' +
                '.box .bottom {' +
                '    -webkit-transform-origin: bottom;' +
                '    transform-origin: bottom;' +
                '    -webkit-transform: rotateX(90deg);' +
                '    transform: rotateX(90deg);' +
                '}' +
                t + ' .box .after {' +
                '   -webkit-transform: translateZ(-' + this.wrapStyle.height + 'px);' +
                '    transform: translateZ(-' + this.wrapStyle.height + 'px);' +
                '}' +
                t + '.slide3d-wrap > .box img {' +
                '   width: ' + this.wrapStyle.width + 'px;' +
                '   height: 100%;' +
                '   vertical-align: middle;' +
                '   border: 0;' +
                '   padding: 0;' +
                '   outline: 0;' +
                '}' +
                t + '.slide3d-wrap-hover:hover > .box{' +
                '   animation-play-state: paused' +
                '}' +
                '@keyframes rotate' + $('.slide3d-wrap').len + ' {' +
                '   0%, 20% {' +
                '       transform: rotateX(360deg) translateZ(' + this.translateZ + 'px)' +
                '   }' +
                '   25%, 45% {' +
                '       transform: rotateX(270deg) translateZ(' + this.translateZ + 'px)' +
                '   }' +
                '   50%, 70% {' +
                '       transform: rotateX(180deg) translateZ(' + this.translateZ + 'px)' +
                '   }' +
                '   75%, 95% {' +
                '       transform: rotateX(90deg) translateZ(' + this.translateZ + 'px)' +
                '   }' +
                '   100% {' +
                '       transform: rotateX(0deg) translateZ(' + this.translateZ + 'px)' +
                '   }' +
                '}';
            var z = 0;
            var that = this;
            $(this.selector).each(function (index, item) {
                var box = item.getElementsByClassName('box');
                for (var i = 0; i < box.length; i++) {
                    i <= box.length / 2 ? z++ : z--;
                    box[i].style.animationDelay = that.animation.delay * i + 's';
                    box[i].style.zIndex = z;
                }
            });

        },

        // 设置轮播图片样式
        setImages: function () {
            $(this.selector).each(function (index, item) {
                var box = item.getElementsByClassName('box');
                for (var i = 0; i < box.length; i++) {
                    var imgs = box[i].getElementsByTagName('img');
                    var len = imgs.length;
                    for (var j = 0; j < len; j++) {
                        imgs[j].style.marginLeft = -100 * i + '%';
                    }
                }
            })

        },

        // 轮播图鼠标移入是否停止动画
        state: function () {
            $(this.selector).addClass('slide3d-wrap-hover');
        },

        // 创建项目导航
        createNavigation: function () {

        },

        // 创建链接
        link: function () {

        },

        /*
        * 2D轮播图插件初始化
        * @param
        *   obj：创建构造函数时传递的参数
        * */
        init2d: function (obj) {

        }
    };

    //  通过函数自调用的方式，让局部变量变成全局变量
    win.Slide = Slide;

    win.$ = $;
})(window);




