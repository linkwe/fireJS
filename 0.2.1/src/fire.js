(function( G , M ){

    G.Q = G.Q || M( G );

}( window || this , function( G ){

"use strict";

var miao,g = {
    //全局基础纹理缓存
    BaseTextureCache:{},

    //全局纹理缓存
    TextureCache:{},

    //视图缓存
    viewsCache:{},

    //全局对象缓存
    objCache:{},

    //标签缓存
    tagCache:{},

    //选择器的引用对象
    selector:{}

},

/** 
 * 全局常量。
 * @alias Q.CONST
 * @namespace
 * @static
 * 
 */

CONST =

{

    /**
     * head
     * @member
     * @type {HTMLDocument}
     */
    HEAD:document && (document.head || document.getElementsByTagName('head')[0]),

    /**
     * body
     * @member
     * @type {HTMLDocument}
     */
    BODY:document.body,

    /**
     * 2倍PI
     * @member
     * @type {number}
     */
    PI2: Math.PI * 2,

    /**
     * 180 / PI
     * @member
     * @type {number}
     */
    L18PI: 180 / Math.PI,

    /**
     * PI/180
     * @member
     * @type {number}
     */
    PI18: Math.PI/180,

    /**
     * 设备宽度
     * @member
     * @type {number}
     */
    WIDTH:innerWidth,
    
   /**
     * 设备高
     * @member
     * @type {number}
     */
    HEIGHT:innerHeight,

    /**
     * 默认帧率
     * @member
     * @type {number}
     */
    TARGET_FPMS: 0.06,

    /**
     * 默认图片 base64:img
     * @member
     * @type {string}
     */
    DEF_IMG_SRC:'',

    /**
     * 布局方式
     * @member
     * @property {number} ABSLOUTE =0,绝对定位
     * @property {number} RELATIVE =1,相对定位
     * @property {number} GRID_X   =2,x方向栅格布局
     * @property {number} GRID_Y   =3,y方向栅格布局
     * @property {number} GRID_XY  =4,xy方向栅格布局
     */
    LAYOUT:{
        ABSLOUTE:0,
        RELATIVE:1,
        GRID_X:2,
        GRID_Y:3,
        GRID_XY:4
    },

    /**
     * 渲染器类型
     * @member
     * @property {number} UNKNOWN =0,未知类型
     * @property {number} WEBGL =1,webgl渲染
     * @property {number} CANVAS =2,canvas渲染
     */
    RENDERER_TYPE: {
        UNKNOWN:    0,
        WEBGL:      1,
        CANVAS:     2
    },

    /**
     * 默认需要绑定的事件
     * @member
     * @type {Array} 
     * @property {string} =down,按下
     * @property {string} =move,移动
     * @property {string} =up,抬起
     */
    DEF_EV:['down','move','up'],

    /**
     * 混合模式
     * @member
     * @type {object} 
     * @property {number} NORMAL =0 ,BLEND_MODES.NORMAL
     * @property {number} ADD =1 ,BLEND_MODES.ADD
     * @property {number} MULTIPLY =2 ,BLEND_MODES.MULTIPLY
     * @property {number} SCREEN =3 ,BLEND_MODES.SCREEN
     * @property {number} OVERLAY =4 ,BLEND_MODES.OVERLAY
     * @property {number} DARKEN =5 ,BLEND_MODES.DARKEN
     * @property {number} LIGHTEN =6 ,BLEND_MODES.LIGHTEN
     * @property {number} COLOR_DODGE =7 ,BLEND_MODES.COLOR_DODGE
     * @property {number} COLOR_BURN =8 ,BLEND_MODES.COLOR_BURN
     * @property {number} HARD_LIGHT =9 ,BLEND_MODES.HARD_LIGHT
     * @property {number} SOFT_LIGHT =10,BLEND_MODES.SOFT_LIGHT
     * @property {number} DIFFERENCE =11,BLEND_MODES.DIFFERENCE
     * @property {number} EXCLUSION =12,BLEND_MODES.EXCLUSION
     * @property {number} HUE =13,BLEND_MODES.HUE
     * @property {number} SATURATION =14,BLEND_MODES.SATURATION
     * @property {number} COLOR =15,BLEND_MODES.COLOR
     * @property {number} LUMINOSITY =16,BLEND_MODES.LUMINOSITY
     * 
     */
    BLEND_MODES: {
        NORMAL:         0,
        ADD:            1,
        MULTIPLY:       2,
        SCREEN:         3,
        OVERLAY:        4,
        DARKEN:         5,
        LIGHTEN:        6,
        COLOR_DODGE:    7,
        COLOR_BURN:     8,
        HARD_LIGHT:     9,
        SOFT_LIGHT:     10,
        DIFFERENCE:     11,
        EXCLUSION:      12,
        HUE:            13,
        SATURATION:     14,
        COLOR:          15,
        LUMINOSITY:     16
    },

    /**
     * 缩放模式
     * @member
     * @static
     * @constant
     * @property {object} SCALE_MODES
     * @property {number} SCALE_MODES.DEFAULT=LINEAR
     * @property {number} SCALE_MODES.LINEAR Smooth scaling
     * @property {number} SCALE_MODES.NEAREST Pixelating scaling
    */
    SCALE_MODES: {
        DEFAULT:    0,//默认的
        LINEAR:     0,
        NEAREST:    1
    },

    /**
     * 资源适配精度
     */
    RETINA_PREFIX: /@(.+)x/,

    
    /**
     * 默认清晰度, ＝ 1 ， 使用100%设备尺寸，＝0.5， 使用50%设备尺寸
     */
    RESOLUTION:1,

    FILTER_RESOLUTION:1,

    /**
     * 默认渲染器参数
     */
    DEFAULT_RENDER_OPTIONS: {
        view: null,
        resolution: 1,
        antialias: false,
        forceFXAA: false,
        autoResize: false,
        transparent: true,
        backgroundColor: 0x000000,
        clearBeforeRender: true,
        preserveDrawingBuffer: false
    },

    /**
     * 标识形状
     * @property {object} POLY =0
     * @property {object} RECT =1
     * @property {object} CIRC =2
     * @property {object} ELIP =3
     * @property {object} RREC =4
     */
    SHAPES: {
        POLY: 0,
        RECT: 1,
        CIRC: 2,
        ELIP: 3,
        RREC: 4
    },

    /**
     * 批渲染对象池大小
     * @type {number}
     */
    SPRITE_BATCH_SIZE: 2000
},
utils,fn;



utils = 

/** 
 * 工具函数。
 * @alias Q.fn
 * @namespace
 * @static
 */
fn = 


{
    /**
     * @function
     * @param id {string} dom元素的ID
     * @return {HTMLDocument} 返回查找到的dom
     */
    $:function(a){return document.getElementById(a)},

     /**
     * 定义属性访问器 
     * @function
     * @param obj {object} 需要更改的对象
     * @param name {string} 属性的name
     * @param obj {object}  设置对象的属性
     * @return {object} 返回该对象
     */
    define:Object.defineProperty,

    /**
     * 同时定义多个属性访问器
     * @param obj {object} 需要更改的对象
     * @param obj {object} 设置对象的属性
     * @return {object} 返回该对象
     */
    defines:Object.defineProperties,
    
    /**
     * 创建url对象
     * @function
     */
    createURL:(G.URL && URL.createObjectURL.bind(URL))||(G.webkitURL && 
    webkitURL.createObjectURL.bind(webkitURL))||G.createObjectURL,
    
     /**
     * 创建url对象缓存
     * @function
     */
    revokeURL:(G.URL||G.webkitURL).revokeObjectURL,

    /**
     * 获取当前时间
     * @function
     * @param void {void} 需要更改的对象
     * @return {number} 当前时间
     */
    now:G.Date.now,

     /**
     * 判断当前对象是否是 HTMLElement
     * @function
     * @param object {object} 需要更改的对象
     * @return {boolean}
     */
    isD:function(a){return a instanceof HTMLElement},
     /**
     * 判断当前对象是否是 String
     * @function
     * @param object {object} 需要更改的对象
     * @return {boolean}
     */
    isS:function(a){return Object.prototype.toString.call(a) == '[object String]'},
     /**
     * 判断当前对象是否是 Function
     * @function
     * @param object {object} 需要更改的对象
     * @return {boolean}
     */
    isF:function(a){return Object.prototype.toString.call(a) == '[object Function]'},
     /**
     * 判断当前对象是否是 Object
     * @function
     * @param object {object} 需要更改的对象
     * @return {boolean}
     */
    isO:function(a){return Object.prototype.toString.call(a) == '[object Object]'},
     /**
     * 判断当前对象是否是 Number
     * @function
     * @param object {object} 需要更改的对象
     * @return {boolean}
     */
    isN:function(a){return Object.prototype.toString.call(a) == '[object Number]'},
     /**
     * 判断当前对象是否是 Array
     * @function
     * @param object {object} 需要更改的对象
     * @return {boolean}
     */
    isA:function(a){return Object.prototype.toString.call(a) == '[object Array]'},
    /**
     * 获取对象属性的长度
     * @function
     * @param object {object|Array} 
     * @return {number} 
     */
    getLength:function(a){var i,cont=0;for(i in a)cont++;return cont},
    /**
     * 把b的属性拷贝并覆盖到a中，
     * @param  a {object}
     * @param  b {object}
     * @return {object} 返回拷贝好的对象
     */
    coverOwn:function(a,b){for(var i in b)a[i] = b[i];return a},

   /**
     * 通过b为对象a赋值
     * @param  a {object}
     * @param  b {object}
     * @return {object} 返回拷贝好的对象
     */
    setOwn:function(a,b){for(var i in b)(a[i]!==undefined&&!fn.isF(a[i]))&&(a[i] = b[i]);return a}, 
  
    /**
     * 把b的属性拷贝并覆盖到a中（包含属性访问器），
     * @param  a {object}
     * @param  b {object}
     * @return {object} 返回拷贝好的对象
     */
    coverPro:function(a,b){
        Object.getOwnPropertyNames(b).forEach(function(m){   
        Object.defineProperty(a,m,Object.getOwnPropertyDescriptor(b,m))});
    },

    /*
     * 为a添加b拥有且a没有的属性
     * @param  a {object}
     * @param  a {object}
     * @return {object} 返回拷贝好的对象
     */
    addOwn:function(a,b){for(var i in b)a[i]===undefined&&(a[i] = b[i]);return a},

    /*
     * 通过b为a设置css属性
     * @param  a {HTMLDocument}
     * @param  a {object}
     * @return {HTMLDocument}
     */
    setCss:function (a,b){for( var i in b)a.style[i]=b[i];return a},

     /*
     * 判断a是否是b的实例
     * @param  a {object}
     * @param  a {class|string}
     * @return {boolean}
     */
    inof:function(a,b){return a instanceof (fn.isS(b)?miao.class[b]:b)},

    /*
     * 判断类b的所有父类中是否包含a
     * @param  a {object}
     * @param  a {class|string}
     * @return {boolean}
     */
    inproto:function(a,b){return b.prototype._mproto.split(',').indexOf(a)!=-1},

    /*
     * 通过字符串获取尺寸  ‘10w’ ==  设备宽度的10% ，‘10h’ ==  设备高度的10%
     * @param  a {object}
     * @param  b {class|string}
     * @return {boolean}
     */
    getPix:function(a,b){
        return parseFloat(a)*(/w$/.test(a)&&miao.app.width*.01||/h$/.test(a)&&miao.app.height*.01||/d$/.test(a)&&b||devicePixelRatio||1);
    },

    /*
     * 通过对象b为对象a设置值，如b的属性i，对应的a的属性i是函数，则调用a[i](b[i]),把b[i]作为参数，如果b有cover属性，则把b.cover的所有属性覆盖到a中。
     * @param  a {object}
     * @param  b {object}
     * @return {this}
     */
    set:function(a,b){

        fn.setOwn(this,a);
        a&&a.cover&&fn.coverOwn(this,a.cover);
        if(b!==false)for(var i in a)fn.isF(this[i])&&this[i](a[i]);
        return this;

    },

    setAsString:function(a,b){

        a.width&&fn.isS(a.width)&&(a.width=fn.getPix(a.width));
        a.height&&fn.isS(a.height)&&(a.height=fn.getPix(a.height));
        a.x&&fn.isS(a.x)&&(a.x=fn.getPix(a.x));
        a.y&&fn.isS(a.y)&&(a.y=fn.getPix(a.y));

        fn.setOwn(this,a);
        a&&a.cover&&fn.coverOwn(this,a.cover);
        if(b!==false)for(var i in a)fn.isF(this[i])&&this[i](a[i]);
        return this;

    },

    setAttribute:function(a,b){

        if(!fn.isD(a))return;
        for(var i in b)fn.isS(b[i])&&a.setAttribute(i,b[i]);
        return a;

    },

    getTextWidth:function(t,fon){},

    /*
     * 复制一个对象的副本
     * @param  a {object}
     * @return {object}
     */
    clone:function (a)
    {
        
        var i, k, co , type = G.toString.call(a);
        if(type === '[object Array]')
        {
            i = a.length;
            co = [];
            while (i--) {co[i] = fn.clone(a[i])};
        }else if(type === '[object Object]')
        {
            co = {};
            for (k in a)co[k] = fn.clone(a[k]);
        }
        return co || a;

    },
   
    usRatio:function(a,b){
        var bw = b.width , bh = b.height;
        if(a.w)return {w:a.w,h:(bh / bw) * a.w};
        else if(a.h)return {w:bw / bh * a.h,h:a.h};
        return {w:bw,h:bh};
    },

    horizontal:function( a ){

        /*if(!/left|center|right/.test(ty))return a.x;
        var at , bt , zs = ty.split('|'), aw = a.width*a.scaleX , 
        ax = a.x - aw * a.anchorX , bw = b.width*b.scaleX;
        if(zs.length & 1)
        {
            at = bt = zs[0];
        }else{
            at = zs[0];
            bt = zs[1];
        }
        return ax + (at=='center'&&aw*(1-a.anchorX)*.5||at=='right'&&aw||0) - 
        (bt=='center'&&bw*(1-b.anchorX)*.5||bt=='right'&&bw||0) + value;*/


        var rve = a.rve || this.parent || miao.app;


        a.left&&fn.isS(a.left)&&(a.left=fn.getPix(a.left));
        a.right&&fn.isS(a.right)&&(a.right=fn.getPix(a.right));
        a.center&&fn.isS(a.center)&&(a.center=fn.getPix(a.center));

        var ax = this.width*this.anchorX;

        if(fn.isN( a.left ) )
        this.x = a.left + ax ;
        else if( fn.isN(a.right) )
        this.x = rve.width - this.width - a.right + ax;
        else if(fn.isN(a.center))
        this.x = (rve.width -this.width)/2 + a.center + ax;

        return this;
    },
    vertical:function( a , b , ty , value){
        /*if(!/top|center|bottom/.test(ty))return a.x;
        var at , bt , zs = ty.split('|'), ah = a.h*a.scaleY , 
        ay = a.y - ah * a.anchorY , bw = b.h*b.scaleY;
        if(zs.length & 1)
        {
            at = bt = zs[0];
        }else{
            at = zs[0];
            bt = zs[1];
        }
        return ay + (at=='center'&&ah*(1-a.anchorY)*.5||at=='right'&&ah||0) - 
        (bt=='center'&&bh*(1-b.anchorY)*.5||bt=='right'&&bh||0) + value;*/

        var rve = a.rve || this.parent || miao.app;

        a.top&&fn.isS(a.top)&&(a.top=fn.getPix(a.top));
        a.bottom&&fn.isS(a.bottom)&&(a.bottom=fn.getPix(a.bottom));
        a.center&&fn.isS(a.center)&&(a.center=fn.getPix(a.center));

        var ay = this.height*this.anchorY;

        if(fn.isN( a.top ) )
        this.y = a.top + ay ;
        else if( fn.isN(a.bottom) )
        this.y = rve.height - this.height - a.bottom + ay;
        else if(fn.isN(a.center))
        this.y = (rve.height -this.height)/2 + a.center + ay;

        return this;
    },
    loadScript:function(_url,__ck){
        if(!_url)return;
        var 
        script = document.createElement('script'),
        me = this,
        clearSE = function(_script) {
            _script.onload = null;
            _script.onerror = null;
            CONST.HEAD.removeChild(script);
        },
        _loadFn = function() {
            clearSE(script);
            __ck();
        };
        script.type = 'text/javascript';
        script.src = _url;
        script.onload = _loadFn;
        script.onerror = clearSE;
        CONST.HEAD.appendChild(script);
    },

    _uid: 0,

    _saidHello: false,

    /*
     * 为一个类注入插件
     * @param  a {object}
     * @return {viod}
     */
    pluginTarget: {

        mixin: function(obj)
        {

            obj.__plugins = {};

            obj.registerPlugin = function (pluginName, ctor)
            {
                obj.__plugins[pluginName] = ctor;
            };

            obj.prototype.initPlugins = function ()
            {
                this.plugins = this.plugins || {};

                for (var o in obj.__plugins)
                {
                    this.plugins[o] = new (obj.__plugins[o])(this);
                }
            };

            obj.prototype.destroyPlugins = function ()
            {
                for (var o in this.plugins)
                {
                    this.plugins[o].destroy();
                    this.plugins[o] = null;
                }

                this.plugins = null;
            };
        }
    },

    async:{},//          require('async'),

    uuid: function ()
    {
        return ++utils._uid;
    },

    /*
     * 把16进制转换成[R,G,B]颜色数组
     * @param  hex {number} 十六进制颜色值
     * @return {array} [r,g,b]
     */
    hex2rgb: function (hex, out)
    {
        out = out || [];

        out[0] = (hex >> 16 & 0xFF) / 255;
        out[1] = (hex >> 8 & 0xFF) / 255;
        out[2] = (hex & 0xFF) / 255;

        return out;
    },

    /**
     * 把16进制转换成字符串色值
     * @param  hex {number} 十六进制颜色值
     * @return {string} '#ffffff'
     */
    hex2string: function (hex)
    {
        hex = hex.toString(16);
        hex = '000000'.substr(0, 6 - hex.length) + hex;

        return '#' + hex;
    },

    /**
     * 把16进制转换成字符串色值
     * @param  hex {number} 十六进制颜色值
     * @return {string} '#ffffff'
     */
    string2hex: function (string)
    {
        hex = hex.toString(16);
        hex = '000000'.substr(0, 6 - hex.length) + hex;

        return '#' + hex;
    },

    /**
     * 颜色数组[r,g,b]转换为十六进制颜色
     * @param  rgb {array} 十六进制颜色值
     * @return {number} 转换后的十六进制颜色表示
     */
    rgb2hex: function (rgb)
    {
        return ((rgb[0]*255 << 16) + (rgb[1]*255 << 8) + rgb[2]*255);
    },

    /**
     * 检查当前的浏览器是否支持BlendMode
     */
    canUseNewCanvasBlendModes: function ()
    {
        if (typeof document === 'undefined')
        {
            return false;
        }

        var pngHead = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAABAQMAAADD8p2OAAAAA1BMVEX/';
        var pngEnd = 'AAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==';
        var magenta = new Image();
        magenta.src = pngHead + 'AP804Oa6' + pngEnd;

        var yellow = new Image();
        yellow.src = pngHead + '/wCKxvRF' + pngEnd;

        var canvas = document.createElement('canvas');
        canvas.width  = 6 ;
        canvas.height = 1 ;

        var context = canvas.getContext('2d');
        context.globalCompositeOperation = 'multiply';
        context.drawImage(magenta, 0, 0);
        context.drawImage(yellow, 2, 0);

        var data = context.getImageData(2,0,1,1).data;

        return (data[0] === 255 && data[1] === 0 && data[2] === 0);
    },

    /**
     * 给定一个数字，返回一个最接近2的幂的一个数。
     * @param  number {number} 需要检测的数值
     * @return {number} 返回的最接近的2的次幂
     */
    getNextPowerOfTwo: function (number)
    {
        if (number > 0 && (number & (number - 1)) === 0)
        {
            return number;
        }
        else
        {
            var result = 1;

            while (result < number)
            {
                result <<= 1;
            }

            return result;
        }
    },

    /**
     * 检查矩形的宽和高是否是2的幂
     * @param  width {number} 
     * @param  height {number} 
     * @return {boolean} 
     */
    isPowerOfTwo: function (width, height)
    {
        return (width > 0 && (width & (width - 1)) === 0 && height > 0 && (height & (height - 1)) === 0);
    },

    getResolutionOfUrl: function (url)
    {
        var resolution = CONST.RETINA_PREFIX.exec(url);

        if (resolution)
        {
           return parseFloat(resolution[1]);
        }

        return 1;
    },

    sayHello: function (type)
    {
        if (utils._saidHello)
        {
            return;
        }

        window.console.log('miaojs-2015-05-20---VERSION:' + CONST.VERSION + ' - ' + type +'-');
        window.console.log('http://www.miaojs.com');
        window.console.log('mail:454664763@qq.com');
        utils._saidHello = true;
    },

    /**
     * 检查是否支持WebGL
     * @return {boolean} 
     */
    isWebGLSupported: function ()
    {
        var contextOptions = { stencil: true };
        try
        {
            if (!window.WebGLRenderingContext)
            {
                return false;
            }

            var canvas = document.createElement('canvas'),
                gl = canvas.getContext('webgl', contextOptions) || canvas.getContext('experimental-webgl', contextOptions);

            return !!(gl && gl.getContextAttributes().stencil);
        }
        catch (e)
        {
            return false;
        }
    },

    //isMobile : navigator.userAgent.match(/Android|Mobile|iPhone|iPad/), //是否为移动终端,

    getRenderer:function(width, height, options, noWebGL)
    {
        width = width || 800;
        height = height || 600;


        if (!noWebGL && this.isWebGLSupported())
        {
       
            return new _class.WebGLRenderer(width, height, options);
        }

        return new _class.CanvasRenderer(width, height, options);
    },


    sortDepth:function(a,b){

        a.sort(b?b:function(c,d) {return c.depth>d.depth})

    },


    /**
     * 获取两点的角度
     * @param  px1 {number} 
     * @param  py1 {number} 
     * @param  px2 {number} 
     * @param  py2 {number} 
     * return {number} angle
     */

    getAngle:function (px1, py1, px2, py2) {
        //两点的x、y值
        x = px2-px1;
        y = py2-py1;
        hypotenuse = Math.sqrt(Math.pow(x, 2)+Math.pow(y, 2));
        //斜边长度
        cos = x/hypotenuse;
        radian = Math.acos(cos);
        //求出弧度
        angle = 180/(Math.PI/radian);
        //用弧度算出角度        
        if (y<0) {
                angle = -angle;
        } else if ((y == 0) && (x<0)) {
                angle = 180;
        }
        // return radian;
        return angle;
    },

    pushDepth:function(a,v){

        var idx;
        if( a.some(function(m,i,arr){
            if(m.depth<=v.depth)return idx=i;
        })){
            a.splice(idx,0,v);
        }else{
            a.unshift(v);
        }

    },

    mapPositionToPoint:function ( point, x, y , dom , resolution)
    {
        var rect = dom.getBoundingClientRect();
        point.x = ( ( x - rect.left ) * (dom.width  / rect.width  ) ) / resolution;
        point.y = ( ( y - rect.top  ) * (dom.height / rect.height ) ) / resolution;
    },
  
    setRenderer:function( a , noWebGL) {

        // noWebGL = true;
        var renderer = a.renderer||this.getRenderer( a.width , a.height, { resolution:a.resolution, transparent:  false},noWebGL),
        ev = {},dom = renderer.view,mapPositionToPoint = this.mapPositionToPoint,resolution = a.resolution||1;

        dom.style.width = '100%';
        dom.style.height = '100%';
        dom.style.position = 'absolute';
        dom.style.top = '0px';
        dom.style.left = '0px';

        // a.width *= a.resolution;
        // a.height *= a.resolution;


        ev.touchDown = function(e){
            e.preventDefault();

            mapPositionToPoint(Q.event.start,e.changedTouches[0].pageX,e.changedTouches[0].pageY,dom,resolution);

            miao.event.now.x = Q.event.start.x ;
            miao.event.now.y = Q.event.start.y ;
            
            message.trigger(a,'down',e);
        }

        ev.touchMove = function(e){
            e.preventDefault();

            var _po = {x:0,y:0};

            mapPositionToPoint(_po,e.changedTouches[0].pageX,e.changedTouches[0].pageY,dom,resolution);

            miao.event.delay.x = _po.x - Q.event.now.x ;
            miao.event.delay.y = _po.y - Q.event.now.y ;
            miao.event.now.x = _po.x;
            miao.event.now.y = _po.y;

            message.trigger(a,'move',e);

        }

        ev.touchUp = function(e){
            e.preventDefault();

            mapPositionToPoint(Q.event.now,e.changedTouches[0].pageX,e.changedTouches[0].pageY,dom,resolution);

            miao.event.end.x = Q.event.now.x ;
            miao.event.end.y = Q.event.now.y ;

            message.trigger(a,'up',e);
        }

        ev.mouseDown = function(e){

           e.preventDefault();

            mapPositionToPoint(Q.event.start,e.clientX,e.clientY,dom,resolution);

            miao.event.now.x = Q.event.start.x ;
            miao.event.now.y = Q.event.start.y ;
            
            message.trigger(a,'down',e);

        }

        ev.mouseMove = function(e){
            e.preventDefault();

            var _po = {x:0,y:0};

            mapPositionToPoint(_po,e.clientX,e.clientY,dom,resolution);

            miao.event.delay.x = _po.x - Q.event.now.x ;
            miao.event.delay.y = _po.y - Q.event.now.y ;
            miao.event.now.x = _po.x;
            miao.event.now.y = _po.y;
            message.trigger(a,'move',e);
        }

        ev.mouseUp = function(e){

            e.preventDefault();

            mapPositionToPoint(Q.event.now,e.clientX,e.clientY,dom,resolution);

            miao.event.end.x = Q.event.now.x ;
            miao.event.end.y = Q.event.now.y ;
            message.trigger(a,'up',e);

        }
 
      
        if(!navigator.userAgent.match(/Android|Mobile|iPhone|iPad/)){

            renderer.view.addEventListener( 'mousedown'  ,ev.mouseDown,false);
            renderer.view.addEventListener( 'mousemove'  ,ev.mouseMove,false);
            renderer.view.addEventListener( 'mouseup'    ,ev.mouseUp,false);

        }else{

            renderer.view.addEventListener( 'touchstart' ,ev.touchDown,false);
            renderer.view.addEventListener( 'touchmove'  ,ev.touchMove,false);
            renderer.view.addEventListener( 'touchend'   ,ev.touchUp,false);

        };

        a.renderer = renderer;

        miao.Transitions(renderer);

        a.element.appendChild(renderer.view);

    }
};
var _class;

!function(){

 /**
* 全局对象，核心功能。
 * @global
 * @alias class
 * @function
 */

_class = function( a , b , c ){

   var extend =  fn.isS(a.extend) ? _class[a.extend] : a.extend;
    delete a.extend;
    var _o = b ? Object.defineProperties(a,b) : a , M ;
    if(extend){
        M =  _o.constructor !== {}.constructor ?
            function(){
                var s = [extend];
                _o.constructor.apply(this,arguments.length?Array.prototype.push.apply(s,arguments)&&s:s);
            }:function(){
                extend.call(this);
            } 

        c ? ( M.prototype = Object.create(extend.prototype) ) 
        : fn.coverPro(M.prototype,extend.prototype);

    }else{

        M =  a.constructor !== {}.constructor ? 
        function(){_o.constructor.apply(this,arguments)} : function(){};
    }

    fn.coverPro(M.prototype,_o);
    M.prototype.constructor = M;

    M.prototype._mproto = extend ? extend.prototype._mproto||'?' +
    ','+a.className:a.className;
    return a.className ? ( _class[a.className] = M ): M;
};

var n = navigator.userAgent,marr=[],ms={};

miao = fn.defines(

	 /**
	  * 全局对象，核心功能。
     * @global
     * @alias Q
     * @function
     */
	
    function(a,b){

        var rt;
        if(b===undefined&&fn.isS(a)){


            if(a[0]=='.'){
                rt = g.tagCache[a];
            }else if(a[0]=='#'){
                rt = g.objCache[a];
            }else{
                rt = g.selector.getByName(a);
            }
            
        }else{

            if(fn.isA(b)){

                switch(b.length)
                {
                    case 0:
                        rt = new _class[a]();
                    break;

                    case 1:
                      rt = new _class[a](b[0]);
                    break;

                    case 2:
                      rt = new _class[a](b[0],b[1]);
                    break;

                    case 3:
                      rt = new _class[a](b[0],b[1],b[2]);
                    break;

                    case 4:
                      rt = new _class[a](b[0],b[1],b[2],b[3]);
                    break;

                    case 5:
                      rt = new _class[a](b[0],b[1],b[2],b[3],b[4]);
                    break;

                    case 6:
                      rt = new _class[a](b[0],b[1],b[2],b[3],b[4],b[5]);
                    break;

                    default:rt = new _class[a](); 
                }

            }else{

                rt = new _class[a](b);
            }
        }
        return rt;
        
    },{
    'VERSION':{get:function(){return '0.2.2.0'},enumerable:true},
    'uid':{get:function(){var n = 0;return function(){return ++n}}()},
    'class':{value:_class},
    'g':{value:g},
    'findById':{value:function(a){return g.objCache[a]}},

    'event':{ value:{
        start:{x:0,y:0} ,
        end:{x:0,y:0} ,
        now:{x:0,y:0} ,
        delay:{x:0,y:0} ,
        rate:1.02 ,
        utime:17 ,
        _ax:false
    }},
    //  选择器的标识，代表在哪个视图选择对象
    'chosen':{value:{}},
    '$':{value:function(a){
        var o;
        if(a[0] == '#'){
            // o = miao.getById(a.slice(1));
            o = miao.getByName(a.slice(1));
        }else if(a[0] == '.'){
            o = g.tagCache(a.slice(1));
        }else{
            o = g.objCache[a]
        }
        return o;
    }},
    'fn':{value:fn},
    'CONST':{value:CONST},
    'exports':{set:function(v){marr.push(v)},get:function(){return '这家伙什么都没留下'}},
    'require':{value:function(){
        var exe = function(_a){
            fn.loadScript(_a.src,function(){
                var _o = marr.length>1?marr:marr.length==1&&marr[0]||null;
                marr = [];
                _a.name&&(ms[_a.name] = _o);
                _a.cak&&_a.cak(_o);
            });
        }
        return function(a,b,c){
            if(fn.isA(a)&&a.length){
                var l = a.length , count = 0 , syn = [] , other = [] , i = 0 ;
                a.forEach(function(m){m.syn?syn.push(m):other.push(m)});
                !function req(_i){
                    var me,_cak;
                    if(i<syn.length){
                        me = syn[_i];
                        _cak = me.cak;
                        me.cak = function(op){
                            _cak(op);
                            count++;
                            c&&c({src:me.src,idx:count,length:l});
                            req(++i);
                        };
                        exe(me);
                    }else if(other.length>0){
                        other.forEach(function(m){
                            var __cak = me.cak;
                            me.cak = function(op){count++;
                                c&&c({src:me.src,idx:count,length:l});
                                __cak(op);
                            }
                        });
                    }else{b&&b()}
                }(i);
            }else{exe(a)}
        }
    }()},
    'device':{value:{
        trident: n.indexOf('Trident') > -1, //IE内核
        presto: n.indexOf('Presto') > -1, //opera内核
        webKit: n.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: n.indexOf('Gecko') > -1 && n.indexOf('KHTML') == -1,//火狐内核
        mobile: !!n.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!n.match(/AppleWebKit/), //ios终端
        android: n.indexOf('Android') > -1 || n.indexOf('Linux') > -1, //android终端或者uc浏览器
        iPhone: n.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
        iPad: n.indexOf('iPad') > -1, //是否iPad
        webApp: n.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
        weixin: n.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
        qq: n.match(/\sQQ/i) == " qq" ,//是否QQ
        lang:(navigator.browserLanguage || navigator.language).toLowerCase(),//语言
        w:window.screen.width, //宽度
        h:window.screen.height, //高度
        dpi:window.devicePixelRatio //精度
    }}
});

}();

var message,tempPoint = {x:0,y:0};

!function(){

var E = _class({
    destroy:function(){
        this.ev = null;
        this.ij = null;
        this.ty = null;
    },
    constructor:function(a){
        this.ev = a.ev||null;
        this.ij = a.ij||null;
        this.ty = 0 ;  
        //  &1      是否只执行一次 
        //  &2      是否有注入 
        //  &4      注入在前还是后 
        //  &8      是否执行注入 
        //  &16     是否是队列 
    }
});

message = {

    fns:[],

    on:function(a,b,c,d){

        if(!fn.isS(b)||!fn.isF(c))return;

        var ls = a._listener = a._listener || {};

        if(!ls[b]){

            ls[b] = new E({ev:c});

        }else{
            if(d){
                ls[b].ev = c;
            }else if(fn.isA(ls[b].ev)){

                ls[b].ty = ls[b].ty|16;
                ls[b].ev.push(c);

            }else{
                ls[b].ty = ls[b].ty|16;
                ls[b].ev = [ls[b].ev,c];
            }
        }
    },

    un:function(a,b){

       if(a._listener&&a._listener[b]){

            a._listener[b].ev = null;
            a._listener[b].ty = (a._listener[b].ty ^ 16 ) ^ 1;
          
        }

    },

    once:function(a,b,c){
        // console.log(a,b)

        // console.trace();

        if(!fn.isS(b)||!fn.isF(c))return;
        var ls = a._listener = a._listener || {};
        message.on(a,b,c);

        ls[b].ty = ls[b].ty|1;


    },

    unall:function(a,b){

        if(a._listener&&a._listener[b]){

            a._listener[b] = null;
            delete a._listener[b];
          
        }
    },

    trigger:function(a,b,c){
        //  &1      是否只执行一次 
        //  &32     是否you
        //  &2      是否有注入 
        //  &4      注入在前还是后,0在前，1在后
        //  &8      是否执行注入 
        //  &16     是否是队列 
        if( !a || !a._listener || !a._listener[b] )return;
        var ls = a._listener[b] , ty = a._listener[b].ty,ret;


        if( (ty&2) && (ty&8)){
            if(ty&4){
                if(ls.ev)
                if(ty&16){
                    for(var i=0;i<ls.ev.length;i++){
                        if(ls.ev[i].call(a,c)){
                            ret= true;
                            break;
                        }       
                    }
                    
                }else{if(ls.ev.call(a,c))ret= true};

                if(!ret&&ls.ij.call(a,c))ret = true;

            }else{

                if(ls.ij.call(a,c))ret = true ;
                if(!ret&&ls.ev)
                if(ty&16){
                    for(var i=0;i<ls.ev.length;i++){
                        if(ls.ev[i].call(a,c)){
                            ret= true;
                            break;
                        }       
                    }
                }else{
                    if(ls.ev.call(a,c))ret= true
                };
            }
        }else if(ls.ev){

           if(ty&16){
                for(var i=0;i<ls.ev.length;i++){
                    if(ls.ev[i].call(a,c)){
                        ret= true;
                        break;
                    }       
                }
            }else{
                if(ls.ev.call(a,c))ret= true
            };
        }
        if(ty&1)message.unall(a,b);
        return ret;
    },

    //如果D为true，注入的函数在前执行
    inj:function(a,b,c,d){

        if(!fn.isS(b)||!fn.isF(c))return;
        var ls = a._listener = a._listener || {};

        if(!ls[b]){

            ls[b] = new E({ij:c});

        }else{

            ls[b].ij = c;
        }

        ls[b].ty = d ? ls[b].ty | 14 : ls[b].ty | 10 ;

        //  &1      是否只执行一次 
        //  &2      是否有注入 
        //  &4      注入在前还是后,0在前，1在后
        //  &8      是否执行注入 
        //  &16     是否是队列 
        
    },

    uinj:function(a,b){

        if(a._listener&&a._listener[b]){
            a._listener[b].ij = null;
            a._listener[b].ty =  a._listener[b].ty ^ 14 ;
        }

    },

    bind:function(a,n,b){

       // console.log(a&&a.name,b&&b.name);
       //  try{
        if(!a||!b.__listeners)return;
        

        var ars = (b.__listeners[n]||(b.__listeners[n]=[])) , idx;
        

        if(ars.indexOf(a)==-1){
            if(a.depth!==undefined&&ars.some(function(m,i,arr){
                if(m.depth<=a.depth)return idx=i;
            })){
                ars.splice(idx,0,a);
            }else{
                ars.unshift(a);
            }
        }

        //}catch(e){console.log(a,n,b)}
    },

    unbind:function(a,n,b){

        if(!a._listener||!a._listener[n]||!b.__listeners||!b.__listeners[n])return;
        var idx;
        (idx=b.__listeners[n].indexOf(a))!=-1&&b.__listeners[n].splice(idx,1);

    }
}

miao.message = message;

}();

_class({
    className:'Base',
    get:function(a){return this[a]},
    set:function(a,b,c){
        a&&fn.setOwn(this,a);
        a.cover&&fn.coverOwn(this,a.cover);
        if(c!==false)for(var i in a){
            if(!fn.isF(this[i]))continue;this[i](a[i])}
        return this},
    constructor:function(){
        this.uid =miao.uid;
    }
});

!function(){

miao.jsonp = function(a){

    var callbackName = "miaojsonp" + Q.uid , cakname = a.cakname || 'callback';
    callback , sc = window[callbackName+"Element"] = document.createElement("script");  

    window[callbackName] = function(data) 
    {
        window[callbackName+"Element"].remove();
        delete window[callbackName];
        a.cak&&a.cak(data);
    }

    sc.src = url.indexOf('?')!=-1 ? url + cakname +'='+ callbackName : 
    url+'?'+cakname+'=' + callbackName;
    document.body.appendChild(sc); 
}


_class({

    className:'Ajax',
    extend:'Base',
    type:'GET',
    responseType:null,
    url:'',
    syn:true,
    header:null,
    idle:true,
    setRequestHeader:function(a){
        this.xhr.setRequestHeader(a.ty,a.vl);
        return this;
    },
    load:function(cak,change){
        if(!(this.idle&&this.url))return;
        this.idle = false;
        
        var xhr = this.xhr,ts = this;
        xhr.open(this.type,this.url,this.syn);
        if(this.responseType)xhr.responseType = this.responseType; 
        if(this.header)this.setRequestHeader(this.header); 
        xhr.onreadystatechange = change ? function(){
            ts.idle = true;
            change(xhr);
            
        } : function () {
        
            if(xhr.readyState == 4 && xhr.status == 200){
                ts.idle = true;

                if(xhr.getResponseHeader('Content-Type').match(/^text/))
                {
                    cak&&cak(xhr.responseText)
                }else{
                    cak&&cak(xhr.response);
                }
                
            }
        }
        xhr.send(null);     
    },
    set:fn.set,
    constructor:function(a){

        this.xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

        this.set(a);

    }
});


miao.ajax = function(){

    var xhr = {

        xhrPool:[new miao.class.Ajax],
        repay:function(a){
            if(a.idle)this.xhrPool.push(a);
            return a;
        },
        get:function(){
            var o;
            if(!this.xhrPool.some(function(m){if(m.idle)return o=m}))
            o = this.repay(new Q.class.Ajax);
            return o;
        }
    };
    return  function( op ){
        var _xhr = xhr.get();
        _xhr.set(op).load(function(res){
            xhr.repay(_xhr);
            op.done&&op.done(res);
        });
    }
}();


}();


var Tween , pulse;

!function(){

var _tweens = [];

miao.Tween = Tween = _class({
    // className:'Tween',
    constructor:function(object){
         var a = object
              ,_object = a.hok||{}
              ,_valuesStart = {}
              ,_valuesEnd = a.to||{}
              ,_valuesStartRepeat = {}
              ,_duration = a.time||1000
              ,_repeat = a.repeat<0?Infinity:a.repeat
              ,_yoyo = a.inverse||false
              ,_isPlaying = false
              ,_reversed = false
              ,_delayTime = a.delay||0
              ,_startTime = null
              ,_easingFunction = a.ease||Tween.ease.Linear.None
              ,_interpolationFunction = a.interpolation||Tween.Interpolation.Linear
              ,_chainedTweens = []
              ,_onStartCallback = a.onStart||null
              ,_onStartCallbackFired = false
              ,_onUpdateCallback = a.onUpdate||null
              ,_onCompleteCallback = a.onComplete|| null
              ,_onStopCallback = a.onStop||null;

        for ( var field in _object ) 
        _valuesStart[ field ] = parseFloat(object[field],10);

        this.start = function ( time ) {

            Tween.add( this );
            _isPlaying = true;
            _onStartCallbackFired = false;

            _startTime = Date.now();
            _startTime += _delayTime;

            for ( var property in _valuesEnd ) {

                if(typeof _valuesEnd[ property ] === 'string'){

                    _valuesEnd[ property] = fn.getPix( _valuesEnd[ property] );

                }else if ( _valuesEnd[ property ] instanceof Array ) {

                    if ( _valuesEnd[ property ].length === 0 ) {

                        continue;

                    }

                    _valuesEnd[ property ] = [ _object[ property ] ].concat( _valuesEnd[ property ] );

                }

                _valuesStart[ property ] = _object[ property ];

                if( ( _valuesStart[ property ] instanceof Array ) === false ) {
                    _valuesStart[ property ] *= 1.0; // Ensures we're using numbers, not strings
                }

                _valuesStartRepeat[ property ] = _valuesStart[ property ] || 0;

            }

            return this;

        };

        this.stopChainedTweens = function () {
            for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {
                _chainedTweens[ i ].stop();
            }
        };

        this.chain = function () {
            _chainedTweens = arguments;
            return this;
        };

        this.stop = function () {

            if ( !_isPlaying ) {
                return this;
            }

            Tween.remove( this );
            _isPlaying = false;

            if ( _onStopCallback !== null ) {

                _onStopCallback.call( _object );

            }

            aa.stopChainedTweens();
            return this;

        };

        this.stopChainedTweens = function () {

            for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {

                _chainedTweens[ i ].stop();

            }

        };

        this.update = function ( time ) {
           

            var property;

            if ( time < _startTime ) {

                return true;

            }

            if ( _onStartCallbackFired === false ) {

                if ( _onStartCallback !== null ) {

                    _onStartCallback.call( _object );

                }

                _onStartCallbackFired = true;

            }

            var elapsed = ( time - _startTime ) / _duration;
            elapsed = elapsed > 1 ? 1 : elapsed;

            var value = _easingFunction( elapsed );

          

            for ( property in _valuesEnd ) {

                var start = _valuesStart[ property ] || 0;
                var end = _valuesEnd[ property ];

                if ( end instanceof Array ) {

                    _object[ property ] = _interpolationFunction( end, value );

                } else {

                    if ( typeof(end) === "string" ) {
                        end = start + parseFloat(end, 10);
                    }

                    if ( typeof(end) === "number" ) {
                        _object[ property ] = start + ( end - start ) * value;
                    }

                }

            }

            if ( _onUpdateCallback !== null ) {

                _onUpdateCallback.call( _object, value );

            }

            if ( elapsed == 1 ) {

                if ( _repeat > 0 ) {

                    if( isFinite( _repeat ) ) {
                        _repeat--;
                    }

                    for( property in _valuesStartRepeat ) {

                        if ( typeof( _valuesEnd[ property ] ) === "string" ) {
                            _valuesStartRepeat[ property ] = _valuesStartRepeat[ property ] + parseFloat(_valuesEnd[ property ], 10);
                        }

                        if (_yoyo) {
                            var tmp = _valuesStartRepeat[ property ];
                            _valuesStartRepeat[ property ] = _valuesEnd[ property ];
                            _valuesEnd[ property ] = tmp;
                        }

                        _valuesStart[ property ] = _valuesStartRepeat[ property ];

                    }

                    if (_yoyo) {
                        _reversed = !_reversed;
                    }

                    _startTime = time + _delayTime;

                    return true;

                } else {

                    if ( _onCompleteCallback !== null ) {

                        _onCompleteCallback.call( _object );

                    }

                    for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {

                        _chainedTweens[ i ].start( time );

                    }
                    return false;
                }
            }
            return true;
        };
    }
});

fn.coverOwn(Tween,{
    getAll: function () {
        return _tweens;
    },
    removeAll: function () {
        _tweens = [];
    },
    add: function ( tween ) {
        _tweens.push( tween );
    },

    remove: function ( tween ) {
        var i = _tweens.indexOf( tween );
        if ( i !== -1 ) {
            _tweens.splice( i, 1 );
        }
    },

    update: function ( time ) {

        if ( _tweens.length === 0 ) return false;

        var i = 0;

        time = Date.now();

        while ( i < _tweens.length ) {

            if ( _tweens[ i ].update( time ) ) {

                i++;

            } else {

                _tweens.splice( i, 1 );

            }

        }

        return true;

    },
    ease:{

        Linear: {

            None: function ( k ) {

                return k;

            }

        },

        Quadratic: {

            In: function ( k ) {

                return k * k;

            },

            Out: function ( k ) {

                return k * ( 2 - k );

            },

            InOut: function ( k ) {

                if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
                return - 0.5 * ( --k * ( k - 2 ) - 1 );

            }

        },

        Cubic: {

            In: function ( k ) {

                return k * k * k;

            },

            Out: function ( k ) {

                return --k * k * k + 1;

            },

            InOut: function ( k ) {

                if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
                return 0.5 * ( ( k -= 2 ) * k * k + 2 );

            }

        },

        Quartic: {

            In: function ( k ) {

                return k * k * k * k;

            },

            Out: function ( k ) {

                return 1 - ( --k * k * k * k );

            },

            InOut: function ( k ) {

                if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
                return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

            }

        },

        Quintic: {

            In: function ( k ) {

                return k * k * k * k * k;

            },

            Out: function ( k ) {

                return --k * k * k * k * k + 1;

            },

            InOut: function ( k ) {

                if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
                return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

            }

        },

        Sinusoidal: {

            In: function ( k ) {

                return 1 - Math.cos( k * Math.PI / 2 );

            },

            Out: function ( k ) {

                return Math.sin( k * Math.PI / 2 );

            },

            InOut: function ( k ) {

                return 0.5 * ( 1 - Math.cos( Math.PI * k ) );

            }

        },

        Exponential: {

            In: function ( k ) {

                return k === 0 ? 0 : Math.pow( 1024, k - 1 );

            },

            Out: function ( k ) {

                return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );

            },

            InOut: function ( k ) {

                if ( k === 0 ) return 0;
                if ( k === 1 ) return 1;
                if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
                return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

            }

        },

        Circular: {

            In: function ( k ) {

                return 1 - Math.sqrt( 1 - k * k );

            },

            Out: function ( k ) {

                return Math.sqrt( 1 - ( --k * k ) );

            },

            InOut: function ( k ) {

                if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
                return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

            }

        },

        Elastic: {

            In: function ( k ) {

                var s, a = 0.1, p = 0.4;
                if ( k === 0 ) return 0;
                if ( k === 1 ) return 1;
                if ( !a || a < 1 ) { a = 1; s = p / 4; }
                else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
                return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

            },

            Out: function ( k ) {

                var s, a = 0.1, p = 0.4;
                if ( k === 0 ) return 0;
                if ( k === 1 ) return 1;
                if ( !a || a < 1 ) { a = 1; s = p / 4; }
                else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
                return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

            },

            InOut: function ( k ) {

                var s, a = 0.1, p = 0.4;
                if ( k === 0 ) return 0;
                if ( k === 1 ) return 1;
                if ( !a || a < 1 ) { a = 1; s = p / 4; }
                else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
                if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
                return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

            }

        },

        Back: {

            In: function ( k ) {

                var s = 1.70158;
                return k * k * ( ( s + 1 ) * k - s );

            },

            Out: function ( k ) {

                var s = 1.70158;
                return --k * k * ( ( s + 1 ) * k + s ) + 1;

            },

            InOut: function ( k ) {

                var s = 1.70158 * 1.525;
                if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
                return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

            }

        },

        Bounce: {

            In: function ( k ) {

                return 1 - TWEEN.Easing.Bounce.Out( 1 - k );

            },

            Out: function ( k ) {

                if ( k < ( 1 / 2.75 ) ) {

                    return 7.5625 * k * k;

                } else if ( k < ( 2 / 2.75 ) ) {

                    return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

                } else if ( k < ( 2.5 / 2.75 ) ) {

                    return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

                } else {

                    return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

                }

            },

            InOut: function ( k ) {

                if ( k < 0.5 ) return TWEEN.Easing.Bounce.In( k * 2 ) * 0.5;
                return TWEEN.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;

            }

        }

    },
    Interpolation:{

        Linear: function ( v, k ) {

            var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.Linear;

            if ( k < 0 ) return fn( v[ 0 ], v[ 1 ], f );
            if ( k > 1 ) return fn( v[ m ], v[ m - 1 ], m - f );

            return fn( v[ i ], v[ i + 1 > m ? m : i + 1 ], f - i );

        },

        Bezier: function ( v, k ) {

            var b = 0, n = v.length - 1, pw = Math.pow, bn = TWEEN.Interpolation.Utils.Bernstein, i;

            for ( i = 0; i <= n; i++ ) {
                b += pw( 1 - k, n - i ) * pw( k, i ) * v[ i ] * bn( n, i );
            }

            return b;

        },

        CatmullRom: function ( v, k ) {

            var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.CatmullRom;

            if ( v[ 0 ] === v[ m ] ) {

                if ( k < 0 ) i = Math.floor( f = m * ( 1 + k ) );

                return fn( v[ ( i - 1 + m ) % m ], v[ i ], v[ ( i + 1 ) % m ], v[ ( i + 2 ) % m ], f - i );

            } else {

                if ( k < 0 ) return v[ 0 ] - ( fn( v[ 0 ], v[ 0 ], v[ 1 ], v[ 1 ], -f ) - v[ 0 ] );
                if ( k > 1 ) return v[ m ] - ( fn( v[ m ], v[ m ], v[ m - 1 ], v[ m - 1 ], f - m ) - v[ m ] );

                return fn( v[ i ? i - 1 : 0 ], v[ i ], v[ m < i + 1 ? m : i + 1 ], v[ m < i + 2 ? m : i + 2 ], f - i );

            }

        },

        Utils: {

            Linear: function ( p0, p1, t ) {

                return ( p1 - p0 ) * t + p0;

            },

            Bernstein: function ( n , i ) {

                var fc = TWEEN.Interpolation.Utils.Factorial;
                return fc( n ) / fc( i ) / fc( n - i );

            },

            Factorial: ( function () {

                var a = [ 1 ];

                return function ( n ) {

                    var s = 1, i;
                    if ( a[ n ] ) return a[ n ];
                    for ( i = n; i > 1; i-- ) s *= i;
                    return a[ n ] = s;

                };

            } )(),

            CatmullRom: function ( p0, p1, p2, p3, t ) {

                var v0 = ( p2 - p0 ) * 0.5, v1 = ( p3 - p1 ) * 0.5, t2 = t * t, t3 = t * t2;
                return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

            }

        }

    }
});


miao.pulse = pulse = {
    sw:false,
    utime:17,
    request:requestAnimationFrame||webkitRequestAnimationFrame||
            mozRequestAnimationFrame||oRequestAnimationFrame||
            function (callback){return setTimeout(callback,1000/60)},
    appen:null,
    lps:[Tween.update],
    isax:false,//是否需要添删
    addOrRemov:true,//true 添加  false 删除
    setHand:function(a,b){
        if(fn.isF(a)){
            this.lps.push(a);
        }else if(fn.isA(a)){
            a.forEach(function(m){
                if(fn.isF(m))this.lps.push(m);
            }.bind(this));
        }
        if(b&&!this.sw)this.start();
    },
    addHand:function(a){
        
        if(fn.isF(a)){
            this.isax = true;
            this.appen = a;
            return this.addOrRemov = true;
        }else{
            return false;
        }
    },
    removHand:function(a){
        var idx;
        if((idx=this.lps.indexOf(a))!=-1)
        {
            this.isax = true;
            this.appen = idx;
            return this.addOrRemov = false; 
        }else{
            return false;
        }
    },
    start:function(){
        if(this.sw)return;
        var ts,update=this.request,lt=0,ix,i,l,lps=this.lps;
        (ts = this).sw = true;
        !function lp(){

            for(i=0,l=lps.length;i<l;i++)lps[i]();
            (ix=parseInt(arguments[0]))&&(miao.event.rate=(miao.event.utime=ix-lt)*0.06)&&(lt=ix);
            if(ts.isax){if(ts.addOrRemov)lps.push(ts.appen);else lps.splice(ts.appen,1);ts.isax=false}
            ts.sw&&update(lp);
        }(lt);

       
    },
    stop:function(){this.sw = false;}
};

}();


function earcut(data, holeIndices, dim) {
    //console.log('earcut');
    dim = dim || 2;
    var hasHoles = holeIndices && holeIndices.length,
        outerLen = hasHoles ? holeIndices[0] * dim : data.length,
        outerNode = filterPoints(data, linkedList(data, 0, outerLen, dim, true)),
        triangles = [];

    if (!outerNode) return triangles;

    var minX, minY, maxX, maxY, x, y, size;

    if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

    // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
    if (data.length > 80 * dim) {
        minX = maxX = data[0];
        minY = maxY = data[1];

        for (var i = dim; i < outerLen; i += dim) {
            x = data[i];
            y = data[i + 1];
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }

        // minX, minY and size are later used to transform coords into integers for z-order calculation
        size = Math.max(maxX - minX, maxY - minY);
    }

    earcutLinked(data, outerNode, triangles, dim, minX, minY, size);

    return triangles;
}

// create a circular doubly linked list from polygon points in the specified winding order
function linkedList(data, start, end, dim, clockwise) {

    // console.log('linkedList');
    var sum = 0,
        i, j, last;

    // calculate original winding order of a polygon ring
    for (i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
    }

    // link points into circular doubly-linked list in the specified winding order
    if (clockwise === (sum > 0)) {
        for (i = start; i < end; i += dim) last = insertNode(i, last);
    } else {
        for (i = end - dim; i >= start; i -= dim) last = insertNode(i, last);
    }

    return last;
}

// eliminate colinear or duplicate points
function filterPoints(data, start, end) {
    if (!end) end = start;

    var node = start,
        again;
    do {
        again = false;

        if (equals(data, node.i, node.next.i) || orient(data, node.prev.i, node.i, node.next.i) === 0) {

            // remove node
            node.prev.next = node.next;
            node.next.prev = node.prev;

            if (node.prevZ) node.prevZ.nextZ = node.nextZ;
            if (node.nextZ) node.nextZ.prevZ = node.prevZ;

            node = end = node.prev;

            if (node === node.next) return null;
            again = true;

        } else {
            node = node.next;
        }
    } while (again || node !== end);

    return end;
}

// main ear slicing loop which triangulates a polygon (given as a linked list)
function earcutLinked(data, ear, triangles, dim, minX, minY, size, pass) {
    if (!ear) return;

    // interlink polygon nodes in z-order
    if (!pass && minX !== undefined) indexCurve(data, ear, minX, minY, size);

    var stop = ear,
        prev, next;

    // iterate through ears, slicing them one by one
    while (ear.prev !== ear.next) {
        prev = ear.prev;
        next = ear.next;

        if (isEar(data, ear, minX, minY, size)) {
            // cut off the triangle
            triangles.push(prev.i / dim);
            triangles.push(ear.i / dim);
            triangles.push(next.i / dim);

            // remove ear node
            next.prev = prev;
            prev.next = next;

            if (ear.prevZ) ear.prevZ.nextZ = ear.nextZ;
            if (ear.nextZ) ear.nextZ.prevZ = ear.prevZ;

            // skipping the next vertice leads to less sliver triangles
            ear = next.next;
            stop = next.next;

            continue;
        }

        ear = next;

        // if we looped through the whole remaining polygon and can't find any more ears
        if (ear === stop) {
            // try filtering points and slicing again
            if (!pass) {
                earcutLinked(data, filterPoints(data, ear), triangles, dim, minX, minY, size, 1);

            // if this didn't work, try curing all small self-intersections locally
            } else if (pass === 1) {
                ear = cureLocalIntersections(data, ear, triangles, dim);
                earcutLinked(data, ear, triangles, dim, minX, minY, size, 2);

            // as a last resort, try splitting the remaining polygon into two
            } else if (pass === 2) {
                splitEarcut(data, ear, triangles, dim, minX, minY, size);
            }

            break;
        }
    }
}

// check whether a polygon node forms a valid ear with adjacent nodes
function isEar(data, ear, minX, minY, size) {

    var a = ear.prev.i,
        b = ear.i,
        c = ear.next.i,

        ax = data[a], ay = data[a + 1],
        bx = data[b], by = data[b + 1],
        cx = data[c], cy = data[c + 1],

        abd = ax * by - ay * bx,
        acd = ax * cy - ay * cx,
        cbd = cx * by - cy * bx,
        A = abd - acd - cbd;

    if (A <= 0) return false; // reflex, can't be an ear

    // now make sure we don't have other points inside the potential ear;
    // the code below is a bit verbose and repetitive but this is done for performance

    var cay = cy - ay,
        acx = ax - cx,
        aby = ay - by,
        bax = bx - ax,
        i, px, py, s, t, k, node;

    // if we use z-order curve hashing, iterate through the curve
    if (minX !== undefined) {

        // triangle bbox; min & max are calculated like this for speed
        var minTX = ax < bx ? (ax < cx ? ax : cx) : (bx < cx ? bx : cx),
            minTY = ay < by ? (ay < cy ? ay : cy) : (by < cy ? by : cy),
            maxTX = ax > bx ? (ax > cx ? ax : cx) : (bx > cx ? bx : cx),
            maxTY = ay > by ? (ay > cy ? ay : cy) : (by > cy ? by : cy),

            // z-order range for the current triangle bbox;
            minZ = zOrder(minTX, minTY, minX, minY, size),
            maxZ = zOrder(maxTX, maxTY, minX, minY, size);

        // first look for points inside the triangle in increasing z-order
        node = ear.nextZ;

        while (node && node.z <= maxZ) {
            i = node.i;
            node = node.nextZ;
            if (i === a || i === c) continue;

            px = data[i];
            py = data[i + 1];

            s = cay * px + acx * py - acd;
            if (s >= 0) {
                t = aby * px + bax * py + abd;
                if (t >= 0) {
                    k = A - s - t;
                    if ((k >= 0) && ((s && t) || (s && k) || (t && k))) return false;
                }
            }
        }

        // then look for points in decreasing z-order
        node = ear.prevZ;

        while (node && node.z >= minZ) {
            i = node.i;
            node = node.prevZ;
            if (i === a || i === c) continue;

            px = data[i];
            py = data[i + 1];

            s = cay * px + acx * py - acd;
            if (s >= 0) {
                t = aby * px + bax * py + abd;
                if (t >= 0) {
                    k = A - s - t;
                    if ((k >= 0) && ((s && t) || (s && k) || (t && k))) return false;
                }
            }
        }

    // if we don't use z-order curve hash, simply iterate through all other points
    } else {
        node = ear.next.next;

        while (node !== ear.prev) {
            i = node.i;
            node = node.next;

            px = data[i];
            py = data[i + 1];

            s = cay * px + acx * py - acd;
            if (s >= 0) {
                t = aby * px + bax * py + abd;
                if (t >= 0) {
                    k = A - s - t;
                    if ((k >= 0) && ((s && t) || (s && k) || (t && k))) return false;
                }
            }
        }
    }

    return true;
}

// go through all polygon nodes and cure small local self-intersections
function cureLocalIntersections(data, start, triangles, dim) {
    var node = start;
    do {
        var a = node.prev,
            b = node.next.next;

        // a self-intersection where edge (v[i-1],v[i]) intersects (v[i+1],v[i+2])
        if (a.i !== b.i && intersects(data, a.i, node.i, node.next.i, b.i) &&
                locallyInside(data, a, b) && locallyInside(data, b, a)) {

            triangles.push(a.i / dim);
            triangles.push(node.i / dim);
            triangles.push(b.i / dim);

            // remove two nodes involved
            a.next = b;
            b.prev = a;

            var az = node.prevZ,
                bz = node.nextZ && node.nextZ.nextZ;

            if (az) az.nextZ = bz;
            if (bz) bz.prevZ = az;

            node = start = b;
        }
        node = node.next;
    } while (node !== start);

    return node;
}

// try splitting polygon into two and triangulate them independently
function splitEarcut(data, start, triangles, dim, minX, minY, size) {
    // look for a valid diagonal that divides the polygon into two
    var a = start;
    do {
        var b = a.next.next;
        while (b !== a.prev) {
            if (a.i !== b.i && isValidDiagonal(data, a, b)) {
                // split the polygon in two by the diagonal
                var c = splitPolygon(a, b);

                // filter colinear points around the cuts
                a = filterPoints(data, a, a.next);
                c = filterPoints(data, c, c.next);

                // run earcut on each half
                earcutLinked(data, a, triangles, dim, minX, minY, size);
                earcutLinked(data, c, triangles, dim, minX, minY, size);
                return;
            }
            b = b.next;
        }
        a = a.next;
    } while (a !== start);
}

// link every hole into the outer loop, producing a single-ring polygon without holes
function eliminateHoles(data, holeIndices, outerNode, dim) {
    var queue = [],
        i, len, start, end, list;

    for (i = 0, len = holeIndices.length; i < len; i++) {
        start = holeIndices[i] * dim;
        end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        list = filterPoints(data, linkedList(data, start, end, dim, false));
        if (list) queue.push(getLeftmost(data, list));
    }

    queue.sort(function (a, b) {
        return data[a.i] - data[b.i];
    });

    // process holes from left to right
    for (i = 0; i < queue.length; i++) {
        eliminateHole(data, queue[i], outerNode);
        outerNode = filterPoints(data, outerNode, outerNode.next);
    }

    return outerNode;
}

// find a bridge between vertices that connects hole with an outer ring and and link it
function eliminateHole(data, holeNode, outerNode) {
    outerNode = findHoleBridge(data, holeNode, outerNode);
    if (outerNode) {
        var b = splitPolygon(outerNode, holeNode);
        filterPoints(data, b, b.next);
    }
}

// David Eberly's algorithm for finding a bridge between hole and outer polygon
function findHoleBridge(data, holeNode, outerNode) {
    var node = outerNode,
        i = holeNode.i,
        px = data[i],
        py = data[i + 1],
        qMax = -Infinity,
        mNode, a, b;

    // find a segment intersected by a ray from the hole's leftmost point to the left;
    // segment's endpoint with lesser x will be potential connection point
    do {
        a = node.i;
        b = node.next.i;

        if (py <= data[a + 1] && py >= data[b + 1]) {
            var qx = data[a] + (py - data[a + 1]) * (data[b] - data[a]) / (data[b + 1] - data[a + 1]);
            if (qx <= px && qx > qMax) {
                qMax = qx;
                mNode = data[a] < data[b] ? node : node.next;
            }
        }
        node = node.next;
    } while (node !== outerNode);

    if (!mNode) return null;

    // look for points strictly inside the triangle of hole point, segment intersection and endpoint;
    // if there are no points found, we have a valid connection;
    // otherwise choose the point of the minimum angle with the ray as connection point

    var bx = data[mNode.i],
        by = data[mNode.i + 1],
        pbd = px * by - py * bx,
        pcd = px * py - py * qMax,
        cpy = py - py,
        pcx = px - qMax,
        pby = py - by,
        bpx = bx - px,
        A = pbd - pcd - (qMax * by - py * bx),
        sign = A <= 0 ? -1 : 1,
        stop = mNode,
        tanMin = Infinity,
        mx, my, amx, s, t, tan;

    node = mNode.next;

    while (node !== stop) {

        mx = data[node.i];
        my = data[node.i + 1];
        amx = px - mx;

        if (amx >= 0 && mx >= bx) {
            s = (cpy * mx + pcx * my - pcd) * sign;
            if (s >= 0) {
                t = (pby * mx + bpx * my + pbd) * sign;

                if (t >= 0 && A * sign - s - t >= 0) {
                    tan = Math.abs(py - my) / amx; // tangential
                    if (tan < tanMin && locallyInside(data, node, holeNode)) {
                        mNode = node;
                        tanMin = tan;
                    }
                }
            }
        }

        node = node.next;
    }

    return mNode;
}

// interlink polygon nodes in z-order
function indexCurve(data, start, minX, minY, size) {
    var node = start;

    do {
        if (node.z === null) node.z = zOrder(data[node.i], data[node.i + 1], minX, minY, size);
        node.prevZ = node.prev;
        node.nextZ = node.next;
        node = node.next;
    } while (node !== start);

    node.prevZ.nextZ = null;
    node.prevZ = null;

    sortLinked(node);
}

// Simon Tatham's linked list merge sort algorithm
// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
function sortLinked(list) {
    var i, p, q, e, tail, numMerges, pSize, qSize,
        inSize = 1;

    do {
        p = list;
        list = null;
        tail = null;
        numMerges = 0;

        while (p) {
            numMerges++;
            q = p;
            pSize = 0;
            for (i = 0; i < inSize; i++) {
                pSize++;
                q = q.nextZ;
                if (!q) break;
            }

            qSize = inSize;

            while (pSize > 0 || (qSize > 0 && q)) {

                if (pSize === 0) {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                } else if (qSize === 0 || !q) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                } else if (p.z <= q.z) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                } else {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                }

                if (tail) tail.nextZ = e;
                else list = e;

                e.prevZ = tail;
                tail = e;
            }

            p = q;
        }

        tail.nextZ = null;
        inSize *= 2;

    } while (numMerges > 1);

    return list;
}

// z-order of a point given coords and size of the data bounding box
function zOrder(x, y, minX, minY, size) {
    // coords are transformed into (0..1000) integer range
    x = 1000 * (x - minX) / size;
    x = (x | (x << 8)) & 0x00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;

    y = 1000 * (y - minY) / size;
    y = (y | (y << 8)) & 0x00FF00FF;
    y = (y | (y << 4)) & 0x0F0F0F0F;
    y = (y | (y << 2)) & 0x33333333;
    y = (y | (y << 1)) & 0x55555555;

    return x | (y << 1);
}

// find the leftmost node of a polygon ring
function getLeftmost(data, start) {
    var node = start,
        leftmost = start;
    do {
        if (data[node.i] < data[leftmost.i]) leftmost = node;
        node = node.next;
    } while (node !== start);

    return leftmost;
}

// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
function isValidDiagonal(data, a, b) {
    return !intersectsPolygon(data, a, a.i, b.i) &&
           locallyInside(data, a, b) && locallyInside(data, b, a) &&
           middleInside(data, a, a.i, b.i);
}

// winding order of triangle formed by 3 given points
function orient(data, p, q, r) {
    var o = (data[q + 1] - data[p + 1]) * (data[r] - data[q]) - (data[q] - data[p]) * (data[r + 1] - data[q + 1]);
    return o > 0 ? 1 :
           o < 0 ? -1 : 0;
}

// check if two points are equal
function equals(data, p1, p2) {
    return data[p1] === data[p2] && data[p1 + 1] === data[p2 + 1];
}

// check if two segments intersect
function intersects(data, p1, q1, p2, q2) {
    return orient(data, p1, q1, p2) !== orient(data, p1, q1, q2) &&
           orient(data, p2, q2, p1) !== orient(data, p2, q2, q1);
}

// check if a polygon diagonal intersects any polygon segments
function intersectsPolygon(data, start, a, b) {
    var node = start;
    do {
        var p1 = node.i,
            p2 = node.next.i;

        if (p1 !== a && p2 !== a && p1 !== b && p2 !== b && intersects(data, p1, p2, a, b)) return true;

        node = node.next;
    } while (node !== start);

    return false;
}

// check if a polygon diagonal is locally inside the polygon
function locallyInside(data, a, b) {
    return orient(data, a.prev.i, a.i, a.next.i) === -1 ?
        orient(data, a.i, b.i, a.next.i) !== -1 && orient(data, a.i, a.prev.i, b.i) !== -1 :
        orient(data, a.i, b.i, a.prev.i) === -1 || orient(data, a.i, a.next.i, b.i) === -1;
}

// check if the middle point of a polygon diagonal is inside the polygon
function middleInside(data, start, a, b) {
    var node = start,
        inside = false,
        px = (data[a] + data[b]) / 2,
        py = (data[a + 1] + data[b + 1]) / 2;
    do {
        var p1 = node.i,
            p2 = node.next.i;

        if (((data[p1 + 1] > py) !== (data[p2 + 1] > py)) &&
            (px < (data[p2] - data[p1]) * (py - data[p1 + 1]) / (data[p2 + 1] - data[p1 + 1]) + data[p1]))
                inside = !inside;

        node = node.next;
    } while (node !== start);

    return inside;
}

// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
// if one belongs to the outer ring and another to a hole, it merges it into a single ring
function splitPolygon(a, b) {
    var a2 = new Node(a.i),
        b2 = new Node(b.i),
        an = a.next,
        bp = b.prev;

    a.next = b;
    b.prev = a;

    a2.next = an;
    an.prev = a2;

    b2.next = a2;
    a2.prev = b2;

    bp.next = b2;
    b2.prev = bp;

    return b2;
}

// create a node and optionally link it with previous one (in a circular doubly linked list)
function insertNode(i, last) {
    var node = new Node(i);

    if (!last) {
        node.prev = node;
        node.next = node;

    } else {
        node.next = last.next;
        node.prev = last;
        last.next.prev = node;
        last.next = node;
    }
    return node;
}

function Node(i) {
    // vertex coordinates
    this.i = i;

    // previous and next vertice nodes in a polygon ring
    this.prev = null;
    this.next = null;

    // z-order curve value
    this.z = null;

    // previous and next nodes in z-order
    this.prevZ = null;
    this.nextZ = null;
}


var Point = _class({

    className:'Point',
    constructor:function(x,y){
        if(x)this.x=x;
        if(y)this.y=y;
    },
    x:0,
    y:0,
    clone:function ()
    {
        return new Point(this.x, this.y);
    },
    copy : function (p) {
        this.set(p.x, p.y);
    },
    equals:function (p) {
        return (p.x === this.x) && (p.y === this.y);
    },
    set:function (x, y)
    {
        this.x = x || 0;
        this.y = y || ( (y !== 0) ? this.x : 0 ) ;
    }
});

var Matrix = _class({
    className:'Matrix',
    constructor:function(){},
    a :1,
    b :0,
    c :0,
    d :1,
    tx:0,
    ty:0,
    romArray: function (array)
    {
        this.a = array[0];
        this.b = array[1];
        this.c = array[3];
        this.d = array[4];
        this.tx = array[2];
        this.ty = array[5];
    },
    toArray:function (transpose)
    {
        if (!this.array)
        {
            this.array = new Float32Array(9);
        }

        var array = this.array;

        if (transpose)
        {
            array[0] = this.a;
            array[1] = this.b;
            array[2] = 0;
            array[3] = this.c;
            array[4] = this.d;
            array[5] = 0;
            array[6] = this.tx;
            array[7] = this.ty;
            array[8] = 1;
        }
        else
        {
            array[0] = this.a;
            array[1] = this.c;
            array[2] = this.tx;
            array[3] = this.b;
            array[4] = this.d;
            array[5] = this.ty;
            array[6] = 0;
            array[7] = 0;
            array[8] = 1;
        }

        return array;
    },
    apply:function (pos, newPos)
    {
        newPos = newPos || new Point();

        var x = pos.x;
        var y = pos.y;

        newPos.x = this.a * x + this.c * y + this.tx;
        newPos.y = this.b * x + this.d * y + this.ty;

        return newPos;
    },
    applyInverse:function (pos, newPos)
    {
        newPos = newPos || new Point();

        var id = 1 / (this.a * this.d + this.c * -this.b);

        var x = pos.x;
        var y = pos.y;

        newPos.x = this.d * id * x + -this.c * id * y + (this.ty * this.c - this.tx * this.d) * id;
        newPos.y = this.a * id * y + -this.b * id * x + (-this.ty * this.a + this.tx * this.b) * id;

        return newPos;
    },
    translate:function (x, y){

        this.tx += x;
        this.ty += y;
        return this;

    },
    scale:function (x, y)
    {
        this.a *= x;
        this.d *= y;
        this.c *= x;
        this.b *= y;
        this.tx *= x;
        this.ty *= y;

        return this;
    },
    rotate:function (angle)
    {
        var cos = Math.cos( angle );
        var sin = Math.sin( angle );

        var a1 = this.a;
        var c1 = this.c;
        var tx1 = this.tx;

        this.a = a1 * cos-this.b * sin;
        this.b = a1 * sin+this.b * cos;
        this.c = c1 * cos-this.d * sin;
        this.d = c1 * sin+this.d * cos;
        this.tx = tx1 * cos - this.ty * sin;
        this.ty = tx1 * sin + this.ty * cos;

        return this;
    },
    append:function (matrix)
    {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;

        this.a  = matrix.a * a1 + matrix.b * c1;
        this.b  = matrix.a * b1 + matrix.b * d1;
        this.c  = matrix.c * a1 + matrix.d * c1;
        this.d  = matrix.c * b1 + matrix.d * d1;

        this.tx = matrix.tx * a1 + matrix.ty * c1 + this.tx;
        this.ty = matrix.tx * b1 + matrix.ty * d1 + this.ty;

        return this;
    },
    prepend:function(matrix)
    {
        var tx1 = this.tx;

        if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1)
        {
            var a1 = this.a;
            var c1 = this.c;
            this.a  = a1*matrix.a+this.b*matrix.c;
            this.b  = a1*matrix.b+this.b*matrix.d;
            this.c  = c1*matrix.a+this.d*matrix.c;
            this.d  = c1*matrix.b+this.d*matrix.d;
        }

        this.tx = tx1*matrix.a+this.ty*matrix.c+matrix.tx;
        this.ty = tx1*matrix.b+this.ty*matrix.d+matrix.ty;

        return this;
    },
    invert:function()
    {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        var tx1 = this.tx;
        var n = a1*d1-b1*c1;

        this.a = d1/n;
        this.b = -b1/n;
        this.c = -c1/n;
        this.d = a1/n;
        this.tx = (c1*this.ty-d1*tx1)/n;
        this.ty = -(a1*this.ty-b1*tx1)/n;

        return this;
    },
    identity:function ()
    {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.tx = 0;
        this.ty = 0;

        return this;
    },
    clone:function ()
    {
        var matrix = new _class.Matrix();
        matrix.a = this.a;
        matrix.b = this.b;
        matrix.c = this.c;
        matrix.d = this.d;
        matrix.tx = this.tx;
        matrix.ty = this.ty;

        return matrix;
    },
    copy:function (matrix)
    {
        matrix.a = this.a;
        matrix.b = this.b;
        matrix.c = this.c;
        matrix.d = this.d;
        matrix.tx = this.tx;
        matrix.ty = this.ty;

        return matrix;
    }
});

//默认矩阵
_class.Matrix.IDENTITY = new _class.Matrix();

//缓存矩阵
_class.Matrix.TEMP_MATRIX = new _class.Matrix();

var _tempMatrix = new Matrix();


var Rectangle = _class({
    className:'Rectangle',
    constructor:function(x, y, width, height)
    {
        if(x)this.x=x;
        if(y)this.y=y;
        if(width)this.width=width;
        if(height)this.height=height;
    },
    x:0,
    y:0,
    width:0,
    height:0,
    type:CONST.SHAPES.RECT,
    clone :function ()
    {
        return new _class.Rectangle(this.x, this.y, this.width, this.height);
    },
    contains : function (x, y)
    {
        if (this.width <= 0 || this.height <= 0)
        {
            return false;
        }

        if (x >= this.x && x < this.x + this.width)
        {
            if (y >= this.y && y < this.y + this.height)
            {
                return true;
            }
        }
        return false;
    }
});

_class.Rectangle.EMPTY = new Rectangle();


var Circle = _class({
    className:'Circle',
    constructor:function(x,y,radius)
    {
        if(x)this.x=x;
        if(x)this.x=y;
        if(radius)this.radius=radius;
    },
    x:0,
    y:0,
    radius:0,
    type:CONST.SHAPES.CIRC,
    clone:function ()
    {
        return new _class.Circle(this.x, this.y, this.radius);
    },
    contains:function (x, y)
    {
        if (this.radius <= 0)
        {
            return false;
        }

        var dx = (this.x - x),
            dy = (this.y - y),
            r2 = this.radius * this.radius;

        dx *= dx;
        dy *= dy;

        return (dx + dy <= r2);
    },
    getBounds : function ()
    {
        return new _class.Rectangle(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }

});

var Ellipse = _class({
    className:'Ellipse',
    constructor:function(x, y, width, height)
    {
        if(x)this.x=x;
        if(x)this.x=y;
        if(width)this.width=width;
        if(height)this.height=height;
    },
    x:0,
    y:0,
    width:0,
    height:0,
    type:CONST.SHAPES.ELIP,
    clone:function ()
    {
        return new _class.Ellipse(this.x, this.y, this.width, this.height);
    },
    contains :function (x, y)
    {
        if (this.width <= 0 || this.height <= 0)
        {
            return false;
        }
        var normx = ((x - this.x) / this.width),
            normy = ((y - this.y) / this.height);

        normx *= normx;
        normy *= normy;

        return (normx + normy <= 1);
    },
    getBounds :function ()
    {
        return new _class.Rectangle(this.x - this.width, this.y - this.height, this.width, this.height);
    }
});



var Polygon = _class({
    className:'Polygon',
    constructor:function(points_){
        var points = points_;
        if (!Array.isArray(points))
        {
            
            points = new Array(arguments.length);

            for (var a = 0; a < points.length; ++a) {
                points[a] = arguments[a];
            }
        }

       
        if (points[0] instanceof Point)
        {
            var p = [];
            for (var i = 0, il = points.length; i < il; i++)
            {
                p.push(points[i].x, points[i].y);
            }

            points = p;
        }
        this.points = points;
    },
    closed:true,
    type:CONST.SHAPES.POLY,
    clone:function ()
    {
        return new _class.Polygon(this.points.slice());
    },
    contains:function (x, y)
    {
        var inside = false;
        var length = this.points.length / 2;
        for (var i = 0, j = length - 1; i < length; j = i++)
        {
            var xi = this.points[i * 2], yi = this.points[i * 2 + 1],
                xj = this.points[j * 2], yj = this.points[j * 2 + 1],
                intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

            if (intersect)
            {
                inside = !inside;
            }
        }

        return inside;
    }
});

var RoundedRectangle = _class({
    className:'RoundedRectangle',
    constructor:function(x, y, width, height, radius)
    {
       if(x)this.x=x;
       if(x)this.x=y;
       if(width)this.width=width;
       if(height)this.height=height;
       if(radius)this.radius=radius;
    },
    x :0,
    y :0,
    width :0,
    height:0,
    radius:20,
    type :CONST.SHAPES.RREC,
    clone:function ()
    {
        return new _class.RoundedRectangle(this.x, this.y, this.width, this.height, this.radius);
    },
    contains :function (x, y)
    {
        if (this.width <= 0 || this.height <= 0)
        {
            return false;
        }

        if (x >= this.x && x <= this.x + this.width)
        {
            if (y >= this.y && y <= this.y + this.height)
            {
                return true;
            }
        }

        return false;
    }
});


var BaseTexture = _class({
    className:'BaseTexture',
    constructor:function(source, scaleMode, resolution)
    {
        this.uuid = miao.uid;

        if(resolution)this.resolution = resolution;

        if(scaleMode)this.scaleMode = scaleMode;

        this.width = 100;

        this.height = 100;

        this.realWidth = 100;
       
        this.realHeight = 100;
     
        this.hasLoaded = false;

        this.isLoading = false;

        this.source = null; 

        this.imageUrl = null;

        this.isPowerOfTwo = false;

        this._glTextures = [];

        if (source)
        {
            this.loadSource(source);
        }

    },

    resolution:1,

    scaleMode:CONST.SCALE_MODES.DEFAULT,

    premultipliedAlpha:true,
   
    mipmap:false,

    update:function ()
    {
        this.realWidth = this.source.naturalWidth || this.source.width;
        this.realHeight = this.source.naturalHeight || this.source.height;

        this.width = this.realWidth / this.resolution;
        this.height = this.realHeight  / this.resolution;

        this.isPowerOfTwo = utils.isPowerOfTwo(this.realWidth, this.realHeight);

        message.trigger(this,'update',this);

    },

    loadSource:function (source)
    {
        if(!source)return;
        var wasLoading = this.isLoading;
        this.hasLoaded = false;
        this.isLoading = false;

        if (wasLoading && this.source)
        {
            this.source.onload = null;
            this.source.onerror = null;
        }

        this.source = source;

      
        if ((this.source.complete || this.source.getContext) && this.source.width && this.source.height)
        {
            this._sourceLoaded();
        }
        else if (!source.getContext)
        {

            this.isLoading = true;

            var scope = this;

            source.onload = function ()
            {
                source.onload = null ;
                source.onerror = null ;

                if (!scope.isLoading)
                {
                    return;
                }

                scope.isLoading = false;
                scope._sourceLoaded();

                message.trigger(scope,'loaded',scope);
                
            };

            source.onerror = function ()
            {
                source.onload = null;
                source.onerror = null;

                if (!scope.isLoading)
                {
                    return;
                }

                scope.isLoading = false;

                message.trigger(scope,'error',scope);
            };

            if (source.complete && source.src)
            {
                this.isLoading = false;

                source.onload = null;
                source.onerror = null;

                if (source.width && source.height)
                {
                    this._sourceLoaded();

                    if (wasLoading)
                    {
                        message.trigger(scope,'loaded');
                    }
                }
                else
                {
                    if (wasLoading)
                    {
                        message.trigger(scope,'error');
                    }
                }
            }
        }
    },

    _sourceLoaded:function ()
    {
        this.hasLoaded = true;
        this.update();
    },

    destroy:function ()
    {
        if (this.imageUrl)
        {
            delete g.BaseTextureCache[this.imageUrl];
            delete g.TextureCache[this.imageUrl];

            this.imageUrl = null;

            if (!navigator.isCocoonJS)
            {
                this.source.src = '';
            }
        }
        else if (this.source && this.source._pixiId)
        {
            delete g.BaseTextureCache[this.source._pixiId];
        }

        this.source = null;

        this.dispose();
    },

    dispose:function ()
    {
       
        message.trigger(this,'dispose');
        this._glTextures.length = 0;

    },

    updateSourceImage:function (newSrc)
    {
        this.source.src = newSrc;
        this.loadSource(this.source);
    }
});


BaseTexture.fromImage = function (imageUrl, crossorigin, scaleMode)
{
    var baseTexture = g.BaseTextureCache[imageUrl];

    if (crossorigin === undefined && imageUrl.indexOf('data:') !== 0)
    {
        crossorigin = true;
    }

    if (!baseTexture)
    {
        var image = new Image();
        if (crossorigin)
        {
            image.crossOrigin = '';
        }

        baseTexture = new BaseTexture(image,scaleMode);
        baseTexture.imageUrl = imageUrl;
        image.src = imageUrl;
        Q.g.BaseTextureCache[imageUrl] = baseTexture;
        baseTexture.resolution = Q.utils.getResolutionOfUrl(imageUrl);
    }
    return baseTexture;
};

BaseTexture.fromCanvas = function (canvas, scaleMode)
{
    if (!canvas._pixiId)
    {
        canvas._pixiId = 'canvas_' + miao.uid;
    }

    var baseTexture = g.BaseTextureCache[canvas._pixiId];

    if (!baseTexture)
    {
        baseTexture = new BaseTexture(canvas, scaleMode);
        g.BaseTextureCache[canvas._pixiId] = baseTexture;
    }

    return baseTexture;
};


var TextureUvs =_class({
    className:'TextureUvs',
    constructor:function(a){
        this.x0 = 0;
        this.y0 = 0;

        this.x1 = 1;
        this.y1 = 0;

        this.x2 = 1;
        this.y2 = 1;

        this.x3 = 0;
        this.y3 = 1;
    },
    set:function (frame, baseFrame, mirrroing ,rotate)
    {

        var tw = baseFrame.width;
        var th = baseFrame.height;

        if(mirrroing){

            this.x3 = frame.x / tw;
            this.y3 = frame.y / th;

            this.x2 = (frame.x + frame.width) / tw;
            this.y2 = frame.y / th;

            this.x1 = (frame.x + frame.width) / tw;
            this.y1 = (frame.y + frame.height) / th;

            this.x0 = frame.x / tw;
            this.y0 = (frame.y + frame.height) / th;

        }else{

            this.x0 = frame.x / tw;
            this.y0 = frame.y / th;

            this.x1 = (frame.x + frame.width) / tw;
            this.y1 = frame.y / th;

            this.x2 = (frame.x + frame.width) / tw;
            this.y2 = (frame.y + frame.height) / th;

            this.x3 = frame.x / tw;
            this.y3 = (frame.y + frame.height) / th;

        }
    }
});


function createSource(path, type)
{
    if (!type)
    {
        type = 'video/' + path.substr(path.lastIndexOf('.') + 1);
    }

    var source = document.createElement('source');

    source.src = path;
    source.type = type;

    return source;
}

var VideoBaseTexture = _class({
    className:'VideoBaseTexture',
    extend:'BaseTexture',
    constructor:function( _super , videoSrc , scaleMode )
    {
        var video = document.createElement('video');

        if (Array.isArray(videoSrc))
        {
            for (var i = 0; i < videoSrc.length; ++i)
            {
                video.appendChild(createSource(videoSrc.src || videoSrc, videoSrc.mime));
            }
        }

        else
        {
            video.appendChild(createSource(videoSrc.src || videoSrc, videoSrc.mime));
        }

        video.load();
        video.play();


        var source = video;

        if ((source.readyState === source.HAVE_ENOUGH_DATA || source.readyState === source.HAVE_FUTURE_DATA) && source.width && source.height)
        {
            source.complete = true;
        }

        _super.call(this, source, scaleMode);

        this.autoUpdate = false;

        this._onUpdate = this._onUpdate.bind(this);
        this._onCanPlay = this._onCanPlay.bind(this);

        if (!source.complete)
        {
            source.addEventListener('canplay', this._onCanPlay);
            source.addEventListener('canplaythrough', this._onCanPlay);

            source.addEventListener('play', this._onPlayStart.bind(this));
            source.addEventListener('pause', this._onPlayStop.bind(this));
        }

        this.__loaded = false;
    },
    _onUpdate:function ()
    {
        if (this.autoUpdate)
        {
            window.requestAnimationFrame(this._onUpdate);
            this.update();
        }
    },
    _onPlayStart:function ()
    {
        if (!this.autoUpdate)
        {
            window.requestAnimationFrame(this._onUpdate);
            this.autoUpdate = true;
        }
    },
    _onPlayStop:function ()
    {
        this.autoUpdate = false;
    },
    _onCanPlay:function ()
    {
        this.hasLoaded = true;

        if (this.source)
        {
            this.source.removeEventListener('canplay', this._onCanPlay);
            this.source.removeEventListener('canplaythrough', this._onCanPlay);

            this.width = this.source.videoWidth;
            this.height = this.source.videoHeight;

            this.source.play();

            if (!this.__loaded)
            {
                this.__loaded = true;

                message.trigger(this,'loaded');
            }
        }
    },
    destroy:function ()
    {
        if (this.source && this.source._pixiId)
        {
            delete g.BaseTextureCache[ this.source._pixiId ];
            delete g.source._pixiId;
        }

        BaseTexture.prototype.destroy.call(this);
    }
});


VideoBaseTexture.fromVideo = function (video, scaleMode)
{
    if (!video._pixiId)
    {
        video._pixiId = 'video_' + miao.uid;
    }

    var baseTexture = Q.g.BaseTextureCache[video._pixiId];

    if (!baseTexture)
    {
        baseTexture = new VideoBaseTexture(video, scaleMode);
        g.BaseTextureCache[video._pixiId ] = baseTexture;
    }

    return baseTexture;
};

VideoBaseTexture.fromUrl = function (videoSrc, scaleMode)
{
    var video = document.createElement('video');

    if (Array.isArray(videoSrc))
    {
        for (var i = 0; i < videoSrc.length; ++i)
        {
            video.appendChild(createSource(videoSrc.src || videoSrc, videoSrc.mime));
        }
    }

    else
    {
        video.appendChild(createSource(videoSrc.src || videoSrc, videoSrc.mime));
    }

    video.load();
    video.play();

    return VideoBaseTexture.fromVideo(video, scaleMode);
};

VideoBaseTexture.fromUrls = VideoBaseTexture.fromUrl;

/**
 * @class
 * @name Texture
 * @param {BaseTexture} baseTexture - 该纹理的基础纹理.
 * @param {Rectangle} frame - 显示对象1.
 * @param {Rectangle} crop - 显示对象2.
 * @param {Rectangle} trim - 显示对象3.
 * @param {Number} rotate - 显示对象4.
 * @example
 * var tex1 = new Q.class.Texture();
 * var tex2 = Q('Texture',[baseTexture, frame, crop, trim, rotate]);
 * 描述一个纹理
 */
var Texture = _class(
	
 /** @lends Texture */
{
    className:'Texture',
    
    constructor:function(baseTexture, frame, crop, trim, rotate){

        this.noFrame = false;

        if (!frame)
        {
            this.noFrame = true;
            frame = new Rectangle(0, 0, 1, 1);
        }

        if (baseTexture instanceof Texture)
        {
            baseTexture = baseTexture.baseTexture;
        }

        /**
         * 该纹理的基础纹理
         * @member {BaseTexture}
         */
        this.baseTexture = baseTexture;

        /**
	     * 该纹理的帧
	     * @member {number}
	     */
        this._frame = frame;

        /**
         * 该纹理的裁剪参数。
         * @member {number}
         */
        this.trim = trim;

        /**
         * 告诉渲染器这个纹理是否可以被渲染。
         */
        this.valid = false;

        /**
         * 告诉渲染器，该纹理被更新过（WebGL UV更新）
         */
        this.requiresUpdate = false;

        /**
         * UV 缓存数据（WebGL可用）
         * @static
         * @member {number}
         */
        this._uvs = null;
		
		/**
         * 纹理的宽
         * @member {number}
         */
        this.width = 0;
        
		/**
         * 纹理的高
         * @member {number}
         */
        this.height = 0;

        /**
         * 渲染时，实际渲染到 Canvas 或 WebGL 的区域 ,不被frame的值影响。
         * @member {number}
         */
        this.crop = crop || frame;

      /*
       * 是否旋转纹理
       * @member {number}
       */
        this.rotate = !!rotate;

        if (baseTexture.hasLoaded)
        {
            if (this.noFrame)
            {
                frame = new Rectangle(0, 0, baseTexture.width, baseTexture.height);
                message.on( this , 'update' , this.onBaseTextureUpdated );
            }
            this.frame = frame;

        }else{
            
            message.once(baseTexture,'loaded',this.onBaseTextureLoaded.bind(this));
        }
    },
    
/**
 * 
 * 告诉渲染器，该纹理被更新过（WebGL UV更新）
 * @function
 */
    update:function ()
    {
        this.baseTexture.update();
    },
    
 	/**
     *
     * 告诉渲染器，该纹理被更新过（WebGL UV更新）
     * @function
     */
    onBaseTextureLoaded:function (baseTexture)
    {
        if (this.noFrame)
        {
            this.frame = new Rectangle(0, 0, baseTexture.width, baseTexture.height);
        }
        else
        {
            this.frame = this._frame;
        }
        message.trigger(this,'update');
    },
   
    /**
     * 该纹理的基础纹理
     * @function
     */
    onBaseTextureUpdated:function (baseTexture)
    {
        this._frame.width = baseTexture.width;
        this._frame.height = baseTexture.height;
        message.triggers(this,'update');
    },
    /**
     * 该纹理的基础纹理
     * @function
     */
    destroy:function (destroyBase)
    {
        if (this.baseTexture)
        {
            if (destroyBase)
            {
                this.baseTexture.destroy();
            }

            message.unall(this.baseTexture,'update');
            message.unall(this.baseTexture,'loaded');

            this.baseTexture = null;
        }

        this._frame = null;
        this._uvs = null;
        this.trim = null;
        this.crop = null;

        this.valid = false;
    },
    
    /**
     * 该纹理的基础纹理111
     * @function
     */
    clone:function ()
    {
        return new _class.Texture(this.baseTexture, this.frame, this.crop, this.trim, this.rotate);
    },
    
    /**
     * 该纹理的基础纹理222
     * @function
     */
    _updateUvs:function (mirrroing)
    {
        if (!this._uvs)
        {
            this._uvs = new _class.TextureUvs();
        }

        this._uvs.set(this.crop, this.baseTexture , mirrroing , this.rotate);
    }
},

 /** @lends Texture */

{
   /**
     * 该纹理的基础纹理222
     * 
     *  @member {number}
     *  @static
     */
    frame: {
        get: function ()
        {
            return this._frame;
        },
        set: function (frame)
        {
            this._frame = frame;

            this.noFrame = false;

            this.width = frame.width;
            this.height = frame.height;



            if (!this.trim && !this.rotate && (frame.x + frame.width > this.baseTexture.width || frame.y + frame.height > this.baseTexture.height))
            {
                throw new Error('Texture Error: frame does not fit inside the base Texture dimensions ' + this);
            }

            this.valid = frame && frame.width && frame.height && this.baseTexture.source && this.baseTexture.hasLoaded;
            this.valid = frame && frame.width && frame.height && this.baseTexture.hasLoaded;

            if (this.trim)
            {

                this.width = this.trim.width;
                this.height = this.trim.height;
                this._frame.width = this.trim.width;
                this._frame.height = this.trim.height;

            }else{

                this.crop = frame;

            }

            if (this.valid)
            {
                this._updateUvs();
            }
        }
    }
});


Texture.fromImage = function (imageUrl, crossorigin, scaleMode)
{
    var texture = g.TextureCache[imageUrl];

    if (!texture)
    {
        texture = new _class.Texture(BaseTexture.fromImage(imageUrl, crossorigin, scaleMode));
        g.TextureCache[imageUrl] = texture;
    }

    return texture;
};

Texture.fromFrame = function (frameId)
{
    var texture = g.TextureCache[frameId];

    if (!texture)
    {
        throw new Error('The frameId "' + frameId + '" does not exist in the texture cache');
    }
    return texture;
};

Texture.fromCanvas = function (canvas, scaleMode)
{
    return new _class.Texture(BaseTexture.fromCanvas(canvas, scaleMode));
};

Texture.fromVideo = function (video, scaleMode)
{
    if (typeof video === 'string')
    {
        return _class.Texture.fromVideoUrl(video, scaleMode);
    }
    else
    {
        return new _class.Texture(VideoBaseTexture.fromVideo(video, scaleMode));
    }
};

Texture.fromVideoUrl = function (videoUrl, scaleMode)
{
    return new _class.Texture(VideoBaseTexture.fromUrl(videoUrl, scaleMode));
};

Texture.addTextureToCache = function (texture, id)
{
    g.TextureCache[id] = texture;
};

Texture.removeTextureFromCache = function (id)
{
    var texture = g.TextureCache[id];
    delete g.TextureCache[id];
    delete g.BaseTextureCache[id];
    return texture;
};

Texture.EMPTY = new Texture(new BaseTexture());




var SystemRenderer = _class({
    className:'SystemRenderer',
    constructor:function(system, width, height, options)
    {
        if (options)
        {
            for (var i in Q.CONST.DEFAULT_RENDER_OPTIONS)
            {
                if (typeof options[i] === 'undefined')
                {
                    options[i] = Q.CONST.DEFAULT_RENDER_OPTIONS[i];
                }
            }
        }
        else
        {
            options = CONST.DEFAULT_RENDER_OPTIONS;
        }

        this.type = CONST.RENDERER_TYPE.UNKNOWN;
        this.width = width || 800;
        this.height = height || 600;
        this.view = options.view || document.createElement('canvas');
        this.resolution = options.resolution;
        this.transparent = options.transparent;
        this.autoResize = options.autoResize || false;
        this.blendModes = null;
        this.preserveDrawingBuffer = options.preserveDrawingBuffer;
        this.clearBeforeRender = options.clearBeforeRender;
        this._backgroundColor = 0x000000;
        this._backgroundColorRgb = [0, 0, 0];
        this._backgroundColorString = '#000000';

        this.backgroundColor = options.backgroundColor || this._backgroundColor; // run bg color setter

       
        this._tempDisplayObjectParent = {worldTransform:new Matrix(), worldAlpha:1, children:[]};

        //
        this._lastObjectRendered = this._tempDisplayObjectParent;
    },
    resize : function (width, height) {
        this.width = width * this.resolution;
        this.height = height * this.resolution;

        this.view.width = this.width;
        this.view.height = this.height;

        if (this.autoResize)
        {
            this.view.style.width = this.width / this.resolution + 'px';
            this.view.style.height = this.height / this.resolution + 'px';
        }
    },
    destroy:function (removeView) {
        if (removeView && this.view.parent)
        {
            this.view.parent.removeChild(this.view);
        }

        this.type = Q.CONST.RENDERER_TYPE.UNKNOWN;

        this.width = 0;
        this.height = 0;

        this.view = null;

        this.resolution = 0;

        this.transparent = false;

        this.autoResize = false;

        this.blendModes = null;

        this.preserveDrawingBuffer = false;
        this.clearBeforeRender = false;

        this._backgroundColor = 0;
        this._backgroundColorRgb = null;
        this._backgroundColorString = null;
    }
},{
    backgroundColor:
    {
        get: function ()
        {
            return this._backgroundColor;
        },
        set: function (val)
        {
            this._backgroundColor = val;
            this._backgroundColorString = utils.hex2string(val);
            utils.hex2rgb(val, this._backgroundColorRgb);
        }
    }
});


function StencilMaskStack()
{
    this.stencilStack = [];
    this.reverse = true;
    this.count = 0;
}

var RenderTarget = _class({
    className:'RenderTarget',
    constructor:function(gl, width, height, scaleMode, resolution, root , clearColor)
    {
        this.gl = gl;
        this.frameBuffer = null;
        this.texture = null;
        this.size = new _class.Rectangle(0, 0, 1, 1);
        this.resolution = resolution || CONST.RESOLUTION;
        this.projectionMatrix = new _class.Matrix();
        this.transform = null;
        this.frame = null;
        this.stencilBuffer = null;
        this.stencilMaskStack = new StencilMaskStack();
        this.filterStack = [
            {
                renderTarget:this,
                filter:[],
                bounds:this.size
            }
        ];

        this.clearColor = clearColor || [1.0,1.0,1.0,1.0];

       

        this.scaleMode = scaleMode || CONST.SCALE_MODES.DEFAULT;
        this.root = root;
        if (!this.root)
        {

            this.frameBuffer = gl.createFramebuffer();
            this.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D,  this.texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, scaleMode === CONST.SCALE_MODES.LINEAR ? gl.LINEAR : gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, scaleMode === CONST.SCALE_MODES.LINEAR ? gl.LINEAR : gl.NEAREST);
            var isPowerOfTwo = utils.isPowerOfTwo(width, height);
             if (!isPowerOfTwo)
            {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            }
            else
            {

                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            }

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer );

            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        }


        this.resize(width, height);
    },
    clear:function(bind)
    {
        var gl = this.gl;
        if(bind)
        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        }

        gl.clearColor(0,0,0,0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    },
    attachStencilBuffer:function()
    {

        if ( this.stencilBuffer )
        {
            return;
        }

        if (!this.root)
        {
            var gl = this.gl;

            this.stencilBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencilBuffer);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.stencilBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL,  this.size.width * this.resolution  , this.size.height * this.resolution );
        }
    },
    activate:function()
    {
        var gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

        var projectionFrame = this.frame || this.size;

        this.calculateProjection( projectionFrame );

        if(this.transform)
        {
            this.projectionMatrix.append(this.transform);
        }

        gl.viewport( 0 , 0 , projectionFrame.width * this.resolution, projectionFrame.height * this.resolution);

        gl.clearColor(this.clearColor[0],this.clearColor[1],this.clearColor[2],this.clearColor[3]);
        gl.clear(gl.COLOR_BUFFER_BIT);
    },
    calculateProjection:function( projectionFrame )
    {
        var pm = this.projectionMatrix;

        pm.identity();

        if (!this.root)
        {
            pm.a = 1 / projectionFrame.width*2;
            pm.d = 1 / projectionFrame.height*2;

            pm.tx = -1 - projectionFrame.x * pm.a;
            pm.ty = -1 - projectionFrame.y * pm.d;
        }
        else
        {
            pm.a = 1 / projectionFrame.width*2;
            pm.d = -1 / projectionFrame.height*2;

            pm.tx = -1 - projectionFrame.x * pm.a;
            pm.ty = 1 - projectionFrame.y * pm.d;
        }
    },
    resize:function(width, height)
    {
        width = width | 0;
        height = height | 0;

        if (this.size.width === width && this.size.height === height) {
            return;
        }

        this.size.width = width;
        this.size.height = height;

        if (!this.root)
        {
            var gl = this.gl;

            gl.bindTexture(gl.TEXTURE_2D,  this.texture);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  width * this.resolution, height * this.resolution , 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

            if (this.stencilBuffer )
            {
                gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencilBuffer);
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL,  width * this.resolution, height * this.resolution );
            }
        }

        var projectionFrame = this.frame || this.size;

        this.calculateProjection( projectionFrame );
    },
    destroy:function()
    {
        var gl = this.gl;
        gl.deleteFramebuffer( this.frameBuffer );
        gl.deleteTexture( this.texture );

        this.frameBuffer = null;
        this.texture = null;
    }
});


var WebGLManager =_class({
    className:'WebGLManager',
    constructor:function(renderer)
    {

        this.renderer = renderer;
        this.destroyTexture;
        message.on(this.renderer,'context',this.onContextChange.bind(this));
    },
    onContextChange:function(){},
    destroy:function ()
    {
        this.renderer = null;
    }
});



var ShaderManager = _class({

    className:'ShaderManager',
    extend:'WebGLManager',
    constructor:function( _super , renderer){
        _super.call(this , renderer);
        this.maxAttibs = 10;
        this.attribState = [];
        this.tempAttribState = [];

        for (var i = 0; i < this.maxAttibs; i++)
        {
            this.attribState[i] = false;
        }
        this.stack = [];
        this._currentId = -1;
        this.currentShader = null;
    },
    onContextChange:function ()
    {
        this.initPlugins();
        var gl = this.renderer.gl;

        this.maxAttibs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);

        this.attribState = [];

        for (var i = 0; i < this.maxAttibs; i++)
        {
            this.attribState[i] = false;
        }

        this.defaultShader = new TextureShader(this);
        this.primitiveShader = new PrimitiveShader(this);
        this.complexPrimitiveShader = new ComplexPrimitiveShader(this);
    },
    setAttribs:function (attribs)
    {
        var i;

        for (i = 0; i < this.tempAttribState.length; i++)
        {
            this.tempAttribState[i] = false;
        }
        for (var a in attribs)
        {
            this.tempAttribState[attribs[a]] = true;
        }

        var gl = this.renderer.gl;

        for (i = 0; i < this.attribState.length; i++)
        {
            if (this.attribState[i] !== this.tempAttribState[i])
            {
                this.attribState[i] = this.tempAttribState[i];

                if (this.attribState[i])
                {
                    gl.enableVertexAttribArray(i);
                }
                else
                {
                    gl.disableVertexAttribArray(i);
                }
            }
        }
    },
    setShader:function (shader)
    {
        if (this._currentId === shader.uuid)
        {
            return false;
        }

        this._currentId = shader.uuid;

        this.currentShader = shader;

        this.renderer.gl.useProgram(shader.program);
        this.setAttribs(shader.attributes);

        return true;
    },
    destroy:function ()
    {
        _class.WebGLManager.prototype.destroy.call(this);
        this.destroyPlugins();

        this.attribState = null;

        this.tempAttribState = null;
    }
});

fn.pluginTarget.mixin(_class.ShaderManager);


var Shader =_class({
    className:'Shader',
    constructor:function(shaderManager, vertexSrc, fragmentSrc, uniforms, attributes)
    {
        if (!vertexSrc || !fragmentSrc)
        {
             throw new Error('Pixi.js Error. Shader requires vertexSrc and fragmentSrc');
        }

        this.uuid = miao.uid;
        this.gl = shaderManager.renderer.gl;
        this.shaderManager = shaderManager;
        this.program = null;
        this.uniforms = uniforms || {};
        this.attributes = attributes || {};
        this.textureCount = 1;
        this.vertexSrc = vertexSrc;
        this.fragmentSrc = fragmentSrc;
        this.init();
    },
    init:function ()
    {
        this.compile();

        this.gl.useProgram(this.program);
        this.cacheUniformLocations(Object.keys(this.uniforms));
        this.cacheAttributeLocations(Object.keys(this.attributes));
    },
    cacheUniformLocations:function (keys)
    {
        for (var i = 0; i < keys.length; ++i)
        {
            this.uniforms[keys[i]]._location = this.gl.getUniformLocation(this.program, keys[i]);
        }
    },
    cacheAttributeLocations:function (keys)
    {
        for (var i = 0; i < keys.length; ++i)
        {
            this.attributes[keys[i]] = this.gl.getAttribLocation(this.program, keys[i]);
        }
    },
    compile:function ()
    {
        var gl = this.gl;

        var glVertShader = this._glCompile(gl.VERTEX_SHADER, this.vertexSrc);
        var glFragShader = this._glCompile(gl.FRAGMENT_SHADER, this.fragmentSrc);

        var program = gl.createProgram();

        gl.attachShader(program, glVertShader);
        gl.attachShader(program, glFragShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        {
            console.error('Error: Could not initialize shader.');
            console.error('gl.VALIDATE_STATUS', gl.getProgramParameter(program, gl.VALIDATE_STATUS));
            console.error('gl.getError()', gl.getError());

            if (gl.getProgramInfoLog(program) !== '')
            {
                console.warn('Warning: gl.getProgramInfoLog()', gl.getProgramInfoLog(program));
            }

            gl.deleteProgram(program);
            program = null;
        }

        gl.deleteShader(glVertShader);
        gl.deleteShader(glFragShader);

        return (this.program = program);

    },
    syncUniform:function (uniform)
    {
        var location = uniform._location,
            value = uniform.value,
            gl = this.gl,
            i, il;

        switch (uniform.type)
        {
            case 'i':
            case '1i':
                gl.uniform1i(location, value);
                break;

            case 'f':
            case '1f':
                gl.uniform1f(location, value);
                break;

            case '2f':
                gl.uniform2f(location, value[0], value[1]);
                break;

            case '3f':
                gl.uniform3f(location, value[0], value[1], value[2]);
                break;

            case '4f':
                gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                break;

            case 'v2':
                gl.uniform2f(location, value.x, value.y);
                break;

            case 'v3':
                gl.uniform3f(location, value.x, value.y, value.z);
                break;

            case 'v4':
                gl.uniform4f(location, value.x, value.y, value.z, value.w);
                break;

            case '1iv':
                gl.uniform1iv(location, value);
                break;

            case '2iv':
                gl.uniform2iv(location, value);
                break;

            case '3iv':
                gl.uniform3iv(location, value);
                break;

            case '4iv':
                gl.uniform4iv(location, value);
                break;

            case '1fv':
                gl.uniform1fv(location, value);
                break;

            case '2fv':
                gl.uniform2fv(location, value);
                break;

            case '3fv':
                gl.uniform3fv(location, value);
                break;

            case '4fv':
                gl.uniform4fv(location, value);
                break;

            case 'm2':
            case 'mat2':
            case 'Matrix2fv':
                gl.uniformMatrix2fv(location, uniform.transpose, value);
                break;

            case 'm3':
            case 'mat3':
            case 'Matrix3fv':

                gl.uniformMatrix3fv(location, uniform.transpose, value);
                break;

            case 'm4':
            case 'mat4':
            case 'Matrix4fv':
                gl.uniformMatrix4fv(location, uniform.transpose, value);
                break;

            case 'c':
                if (typeof value === 'number')
                {
                    value = utils.hex2rgb(value);
                }

                gl.uniform3f(location, value[0], value[1], value[2]);
                break;

            case 'iv1':
                gl.uniform1iv(location, value);
                break;

            case 'iv':
                gl.uniform3iv(location, value);
                break;

            case 'fv1':
                gl.uniform1fv(location, value);
                break;

            case 'fv':
                gl.uniform3fv(location, value);
                break;

            case 'v2v':
                if (!uniform._array)
                {
                    uniform._array = new Float32Array(2 * value.length);
                }

                for (i = 0, il = value.length; i < il; ++i)
                {
                    uniform._array[i * 2]       = value[i].x;
                    uniform._array[i * 2 + 1]   = value[i].y;
                }

                gl.uniform2fv(location, uniform._array);
                break;

            case 'v3v':
                if (!uniform._array)
                {
                    uniform._array = new Float32Array(3 * value.length);
                }

                for (i = 0, il = value.length; i < il; ++i)
                {
                    uniform._array[i * 3]       = value[i].x;
                    uniform._array[i * 3 + 1]   = value[i].y;
                    uniform._array[i * 3 + 2]   = value[i].z;

                }

                gl.uniform3fv(location, uniform._array);
                break;

            case 'v4v':
                if (!uniform._array)
                {
                    uniform._array = new Float32Array(4 * value.length);
                }

                for (i = 0, il = value.length; i < il; ++i)
                {
                    uniform._array[i * 4]       = value[i].x;
                    uniform._array[i * 4 + 1]   = value[i].y;
                    uniform._array[i * 4 + 2]   = value[i].z;
                    uniform._array[i * 4 + 3]   = value[i].w;

                }

                gl.uniform4fv(location, uniform._array);
                break;

            case 't':
            case 'sampler2D':

                if (!uniform.value || !uniform.value.baseTexture.hasLoaded)
                {
                    break;
                }

                gl.activeTexture(gl['TEXTURE' + this.textureCount]);

                var texture = uniform.value.baseTexture._glTextures[gl.id];

                if (!texture)
                {
                    this.initSampler2D(uniform);

                    texture = uniform.value.baseTexture._glTextures[gl.id];
                }

                gl.bindTexture(gl.TEXTURE_2D, texture);

                gl.uniform1i(uniform._location, this.textureCount);

                this.textureCount++;

                break;

            default:
                console.warn('Pixi.js Shader Warning: Unknown uniform type: ' + uniform.type);
        }
    },
    syncUniforms:function ()
    {
        this.textureCount = 1;

        for (var key in this.uniforms)
        {
            this.syncUniform(this.uniforms[key]);
        }
    },
    initSampler2D:function (uniform)
    {
        var gl = this.gl;

        var texture = uniform.value.baseTexture;

        if(!texture.hasLoaded)
        {
            return;
        }

        if (uniform.textureData)
        {

            var data = uniform.textureData;

            texture._glTextures[gl.id] = gl.createTexture();

            gl.bindTexture(gl.TEXTURE_2D, texture._glTextures[gl.id]);

            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultipliedAlpha);
            gl.texImage2D(gl.TEXTURE_2D, 0, data.luminance ? gl.LUMINANCE : gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, data.magFilter ? data.magFilter : gl.LINEAR );
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, data.wrapS ? data.wrapS : gl.CLAMP_TO_EDGE );
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, data.wrapS ? data.wrapS : gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, data.wrapT ? data.wrapT : gl.CLAMP_TO_EDGE);
        }
        else
        {
            this.shaderManager.renderer.updateTexture(texture);
        }
    },
    destroy:function ()
    {
        this.gl.deleteProgram(this.program);

        this.gl = null;
        this.uniforms = null;
        this.attributes = null;

        this.vertexSrc = null;
        this.fragmentSrc = null;
    },
    _glCompile:function (type, src)
    {
        var shader = this.gl.createShader(type);

        this.gl.shaderSource(shader, src);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
        {
            return null;
        }

        return shader;
    }
});


var TextureShader = _class({
    className:'TextureShader',
    extend:'Shader',
    constructor:function( _super , shaderManager, vertexSrc, fragmentSrc, customUniforms, customAttributes)
    {
        var uniforms = {

            uSampler:           { type: 'sampler2D', value: 0 },
            projectionMatrix:   { type: 'mat3', value: new Float32Array([1, 0, 0,
                                                                         0, 1, 0,
                                                                         0, 0, 1]) }
        };

        if (customUniforms)
        {
            for (var u in customUniforms)
            {
                uniforms[u] = customUniforms[u];
            }
        }


        var attributes = {
            aVertexPosition:    0,
            aTextureCoord:      0,
            aColor:             0
        };

        if (customAttributes)
        {
            for (var a in customAttributes)
            {
                attributes[a] = customAttributes[a];
            }
        }

        vertexSrc = vertexSrc || TextureShader.defaultVertexSrc;

        fragmentSrc = fragmentSrc || TextureShader.defaultFragmentSrc;

        _super.call(this, shaderManager, vertexSrc, fragmentSrc, uniforms, attributes);
    }
});


TextureShader.defaultVertexSrc = [
    'precision lowp float;',
    'attribute vec2 aVertexPosition;',
    'attribute vec2 aTextureCoord;',
    'attribute vec4 aColor;',

    'uniform mat3 projectionMatrix;',

    'varying vec2 vTextureCoord;',
    'varying vec4 vColor;',

    'void main(void){',
    '   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);',
    '   vTextureCoord = aTextureCoord;',
    '   vColor = vec4(aColor.rgb * aColor.a, aColor.a);',
    '}'
].join('\n');

_class.TextureShader.defaultFragmentSrc = [
    'precision lowp float;',

    'varying vec2 vTextureCoord;',
    'varying vec4 vColor;',

    'uniform sampler2D uSampler;',

    'void main(void){',
    '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;',
    '}'
].join('\n');

// fn.coverPro( _class.TextureShader.prototype , _class.Shader.prototype );



var ComplexPrimitiveShader = _class({
    className:'ComplexPrimitiveShader',
    extend:'Shader',
    constructor:function( _super , shaderManager)
    {
        _super.call(this,
            shaderManager,
            [
                'attribute vec2 aVertexPosition;',

                'uniform mat3 translationMatrix;',
                'uniform mat3 projectionMatrix;',

                'uniform vec3 tint;',
                'uniform float alpha;',
                'uniform vec3 color;',

                'varying vec4 vColor;',

                'void main(void){',
                '   gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);',
                '   vColor = vec4(color * alpha * tint, alpha);',//" * vec4(tint * alpha, alpha);',
                '}'
            ].join('\n'),
            [
                'precision mediump float;',

                'varying vec4 vColor;',

                'void main(void){',
                '   gl_FragColor = vColor;',
                '}'
            ].join('\n'),
            {
                tint:   { type: '3f', value: [0, 0, 0] },
                alpha:  { type: '1f', value: 0 },
                color:  { type: '3f', value: [0,0,0] },
                translationMatrix: { type: 'mat3', value: new Float32Array(9) },
                projectionMatrix: { type: 'mat3', value: new Float32Array(9) }
            },
            {
                aVertexPosition:0
            }
        );
    }
});

// fn.coverPro( _class.ComplexPrimitiveShader.prototype , _class.Shader.prototype );

var PrimitiveShader = _class({
    className:'PrimitiveShader',
    extend:'Shader',
    constructor:function(_super , shaderManager)
    {
        _super.call(this,
            shaderManager,
            [
                'attribute vec2 aVertexPosition;',
                'attribute vec4 aColor;',

                'uniform mat3 translationMatrix;',
                'uniform mat3 projectionMatrix;',

                'uniform float alpha;',
                'uniform float flipY;',
                'uniform vec3 tint;',

                'varying vec4 vColor;',

                'void main(void){',
                '   gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);',
                '   vColor = aColor * vec4(tint * alpha, alpha);',
                '}'
            ].join('\n'),
            [
                'precision mediump float;',

                'varying vec4 vColor;',

                'void main(void){',
                '   gl_FragColor = vColor;',
                '}'
            ].join('\n'),
            {
                tint:   { type: '3f', value: [0, 0, 0] },
                alpha:  { type: '1f', value: 0 },
                translationMatrix: { type: 'mat3', value: new Float32Array(9) },
                projectionMatrix: { type: 'mat3', value: new Float32Array(9) }
            },
            {
                aVertexPosition:0,
                aColor:0
            }
        );
    }
});

// fn.coverPro( _class.PrimitiveShader.prototype , _class.Shader.prototype );

var StripShader = _class({
    className:'StripShader',
    extend:'Shader',
    constructor:function(_super , shaderManager){

        _super.call(this,
            shaderManager,
            [
                'precision lowp float;',
                'attribute vec2 aVertexPosition;',
                'attribute vec2 aTextureCoord;',

                'uniform mat3 translationMatrix;',
                'uniform mat3 projectionMatrix;',

                'varying vec2 vTextureCoord;',

                'void main(void){',
                '   gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);',
                '   vTextureCoord = aTextureCoord;',
                '}'
            ].join('\n'),
            [
                'precision lowp float;',

                'varying vec2 vTextureCoord;',
                'uniform float alpha;',

                'uniform sampler2D uSampler;',

                'void main(void){',
                '   gl_FragColor = texture2D(uSampler, vTextureCoord) * alpha ;',
                '}'
            ].join('\n'),
            {
                alpha:  { type: '1f', value: 0 },
                translationMatrix: { type: 'mat3', value: new Float32Array(9) },
                projectionMatrix: { type: 'mat3', value: new Float32Array(9) }
            },
            {
                aVertexPosition:0,
                aTextureCoord:0
            }
        );
    }
});

ShaderManager.registerPlugin('meshShader', StripShader);




var AbstractFilter = 
_class({
    className:'AbstractFilter',
    constructor:function(vertexSrc, fragmentSrc, uniforms)
    {

        this.shaders = [];

        this.padding = 0;

        this.uniforms = uniforms || {};

        this.vertexSrc = vertexSrc || TextureShader.defaultVertexSrc;

        this.fragmentSrc = fragmentSrc || TextureShader.defaultFragmentSrc;

    },
    getShader:function (renderer)
    {
        var gl = renderer.gl;

        var shader = this.shaders[gl.id];

        if (!shader)
        {
            shader = new TextureShader(renderer.shaderManager,
                this.vertexSrc,
                this.fragmentSrc,
                this.uniforms,
                this.attributes
            );

            this.shaders[gl.id] = shader;
        }

        return shader;
    },
    applyFilter:function (renderer, input, output, clear)
    {
        var shader = this.getShader(renderer);

        renderer.filterManager.applyFilter(shader, input, output, clear);
    },
    syncUniform:function (uniform)
    {
        for (var i = 0, j = this.shaders.length; i < j; ++i)
        {
            this.shaders[i].syncUniform(uniform);
        }
    }
});

var SpriteMaskFilter = 
_class({
    className:'SpriteMaskFilter',
    extend:'AbstractFilter',
    constructor:function( _super , sprite)
    {
        var maskMatrix = new Matrix();
        _super.call(this,

            'attribute vec2 aVertexPosition;'+
            'attribute vec2 aTextureCoord;'+
            'attribute vec4 aColor;'+
            'uniform mat3 projectionMatrix;'+
            'uniform mat3 otherMatrix;'+
            'varying vec2 vMaskCoord;'+
            'varying vec2 vTextureCoord;'+
            'varying vec4 vColor;'+
            'void main(void)'+
            '{'+
            '    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);'+
            '    vTextureCoord = aTextureCoord;'+
            '    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;'+
            '    vColor = vec4(aColor.rgb * aColor.a, aColor.a);'+
            '}' ,


            'precision lowp float;'+
            'varying vec2 vMaskCoord;'+
            'varying vec2 vTextureCoord;'+
            'varying vec4 vColor;'+
            'uniform sampler2D uSampler;'+
            'uniform float alpha;'+
            'uniform sampler2D mask;'+
            'void main(void)'+
            '{'+
            '    vec2 text = abs( vMaskCoord - 0.5 );'+
            '    text = step(0.5, text);'+
            '    float clip = 1.0 - max(text.y, text.x);'+
            '    vec4 original = texture2D(uSampler, vTextureCoord);'+
            '    vec4 masky = texture2D(mask, vMaskCoord);'+
            '    original *= (masky.r * masky.a * alpha * clip);'+
            '    gl_FragColor = original;'+
            '}',
            {
                mask:           { type: 'sampler2D', value: sprite._texture },
                alpha:          { type: 'f', value: 1},
                otherMatrix:    { type: 'mat3', value: maskMatrix.toArray(true) }
            }
        );

        this.maskSprite = sprite;
        this.maskMatrix = maskMatrix;
    },
    applyFilter:function (renderer, input, output)
    {
        var filterManager = renderer.filterManager;

        this.uniforms.mask.value = this.maskSprite._texture;

        filterManager.calculateMappedMatrix(input.frame, this.maskSprite, this.maskMatrix);

        this.uniforms.otherMatrix.value = this.maskMatrix.toArray(true);
        this.uniforms.alpha.value = this.maskSprite.worldAlpha;

        var shader = this.getShader(renderer);
        filterManager.applyFilter(shader, input, output);
    }
},{
    map: {
        get: function ()
        {
            return this.uniforms.mask.value;
        },
        set: function (value)
        {
            this.uniforms.mask.value = value;
        }
    },

    offset: {
        get: function()
        {
            return this.uniforms.offset.value;
        },
        set: function(value)
        {
            this.uniforms.offset.value = value;
        }
    }
});


var MaskManager = _class({
    className:'MaskManager',
    extend:'WebGLManager',
    constructor:function( _super , renderer){
        _super.call(this, renderer);

        this.stencilStack = [];
        this.reverse = true;
        this.count = 0;

        this.alphaMaskPool = [];
    },
    pushMask:function (target, maskData)
    {
        if (maskData.texture)
        {
            this.pushSpriteMask(target, maskData);
        }
        else
        {
            this.pushStencilMask(target, maskData);
        }

    },
    popMask:function (target, maskData)
    {
        if (maskData.texture)
        {
            this.popSpriteMask(target, maskData);
        }
        else
        {
            this.popStencilMask(target, maskData);
        }
    },
    pushSpriteMask:function (target, maskData)
    {
        var alphaMaskFilter = this.alphaMaskPool.pop();

        if (!alphaMaskFilter)
        {
            alphaMaskFilter = [new SpriteMaskFilter(maskData)];
        }

        alphaMaskFilter[0].maskSprite = maskData;
        this.renderer.filterManager.pushFilter(target, alphaMaskFilter);
    },
    popSpriteMask:function ()
    {
        var filters = this.renderer.filterManager.popFilter();

        this.alphaMaskPool.push(filters);
    },
    pushStencilMask:function (target, maskData)
    {
        this.renderer.stencilManager.pushMask(maskData);
    },
    popStencilMask:function (target, maskData)
    {
        this.renderer.stencilManager.popMask(maskData);
    }
});

var StencilManager = _class({
    className:'StencilManager',
    extend:'WebGLManager',
    constructor:function( _super , renderer){
        _super.call(this, renderer);
        this.stencilMaskStack = null;
    },
    setMaskStack:function ( stencilMaskStack )
    {
        this.stencilMaskStack = stencilMaskStack;

        var gl = this.renderer.gl;

        if (stencilMaskStack.stencilStack.length === 0)
        {
            gl.disable(gl.STENCIL_TEST);
        }
        else
        {
            gl.enable(gl.STENCIL_TEST);
        }
    },
    pushStencil:function (graphics, webGLData)
    {
        this.renderer.currentRenderTarget.attachStencilBuffer();

        var gl = this.renderer.gl,
            sms = this.stencilMaskStack;

        this.bindGraphics(graphics, webGLData, this.renderer);

        if (sms.stencilStack.length === 0)
        {
            gl.enable(gl.STENCIL_TEST);
            gl.clear(gl.STENCIL_BUFFER_BIT);
            sms.reverse = true;
            sms.count = 0;
        }

        sms.stencilStack.push(webGLData);

        var level = sms.count;

        gl.colorMask(false, false, false, false);

        gl.stencilFunc(gl.ALWAYS,0,0xFF);
        gl.stencilOp(gl.KEEP,gl.KEEP,gl.INVERT);


        if (webGLData.mode === 1)
        {
            gl.drawElements(gl.TRIANGLE_FAN,  webGLData.indices.length - 4, gl.UNSIGNED_SHORT, 0 );

            if (sms.reverse)
            {
                gl.stencilFunc(gl.EQUAL, 0xFF - level, 0xFF);
                gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);
            }
            else
            {
                gl.stencilFunc(gl.EQUAL,level, 0xFF);
                gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);
            }

            gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, ( webGLData.indices.length - 4 ) * 2 );

            if (sms.reverse)
            {
                gl.stencilFunc(gl.EQUAL,0xFF-(level+1), 0xFF);
            }
            else
            {
                gl.stencilFunc(gl.EQUAL,level+1, 0xFF);
            }

            sms.reverse = !sms.reverse;
        }
        else
        {
            if (!sms.reverse)
            {
                gl.stencilFunc(gl.EQUAL, 0xFF - level, 0xFF);
                gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);
            }
            else
            {
                gl.stencilFunc(gl.EQUAL,level, 0xFF);
                gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);
            }

            gl.drawElements(gl.TRIANGLE_STRIP,  webGLData.indices.length, gl.UNSIGNED_SHORT, 0 );

            if (!sms.reverse)
            {
                gl.stencilFunc(gl.EQUAL,0xFF-(level+1), 0xFF);
            }
            else
            {
                gl.stencilFunc(gl.EQUAL,level+1, 0xFF);
            }
        }

        gl.colorMask(true, true, true, true);
        gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);

        sms.count++;
    },
    bindGraphics:function (graphics, webGLData)
    {
        this._currentGraphics = graphics;

        var gl = this.renderer.gl;

        var shader;

        if (webGLData.mode === 1)
        {
            shader = this.renderer.shaderManager.complexPrimitiveShader;

            this.renderer.shaderManager.setShader(shader);

            gl.uniformMatrix3fv(shader.uniforms.translationMatrix._location, false, graphics.worldTransform.toArray(true));

            gl.uniformMatrix3fv(shader.uniforms.projectionMatrix._location, false, this.renderer.currentRenderTarget.projectionMatrix.toArray(true));

            gl.uniform3fv(shader.uniforms.tint._location, utils.hex2rgb(graphics.tint));

            gl.uniform3fv(shader.uniforms.color._location, webGLData.color);

            gl.uniform1f(shader.uniforms.alpha._location, graphics.worldAlpha);

            gl.bindBuffer(gl.ARRAY_BUFFER, webGLData.buffer);

            gl.vertexAttribPointer(shader.attributes.aVertexPosition, 2, gl.FLOAT, false, 4 * 2, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webGLData.indexBuffer);
        }
        else
        {
            shader = this.renderer.shaderManager.primitiveShader;

            this.renderer.shaderManager.setShader( shader );

            gl.uniformMatrix3fv(shader.uniforms.translationMatrix._location, false, graphics.worldTransform.toArray(true));

            gl.uniformMatrix3fv(shader.uniforms.projectionMatrix._location, false, this.renderer.currentRenderTarget.projectionMatrix.toArray(true));

            gl.uniform3fv(shader.uniforms.tint._location, utils.hex2rgb(graphics.tint));

            gl.uniform1f(shader.uniforms.alpha._location, graphics.worldAlpha);

            gl.bindBuffer(gl.ARRAY_BUFFER, webGLData.buffer);

            gl.vertexAttribPointer(shader.attributes.aVertexPosition, 2, gl.FLOAT, false, 4 * 6, 0);
            gl.vertexAttribPointer(shader.attributes.aColor, 4, gl.FLOAT, false,4 * 6, 2 * 4);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webGLData.indexBuffer);
        }
    },
    popStencil:function (graphics, webGLData)
    {
        var gl = this.renderer.gl,
            sms = this.stencilMaskStack;

        sms.stencilStack.pop();

        sms.count--;

        if (sms.stencilStack.length === 0)
        {
            gl.disable(gl.STENCIL_TEST);

        }
        else
        {

            var level = sms.count;

            this.bindGraphics(graphics, webGLData, this.renderer);

            gl.colorMask(false, false, false, false);

            if (webGLData.mode === 1)
            {
                sms.reverse = !sms.reverse;

                if (sms.reverse)
                {
                    gl.stencilFunc(gl.EQUAL, 0xFF - (level+1), 0xFF);
                    gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);
                }
                else
                {
                    gl.stencilFunc(gl.EQUAL,level+1, 0xFF);
                    gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);
                }

                gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, ( webGLData.indices.length - 4 ) * 2 );

                gl.stencilFunc(gl.ALWAYS,0,0xFF);
                gl.stencilOp(gl.KEEP,gl.KEEP,gl.INVERT);
                gl.drawElements(gl.TRIANGLE_FAN,  webGLData.indices.length - 4, gl.UNSIGNED_SHORT, 0 );

                if (!sms.reverse)
                {
                    gl.stencilFunc(gl.EQUAL,0xFF-(level), 0xFF);
                }
                else
                {
                    gl.stencilFunc(gl.EQUAL,level, 0xFF);
                }

            }
            else
            {
                if (!sms.reverse)
                {
                    gl.stencilFunc(gl.EQUAL, 0xFF - (level+1), 0xFF);
                    gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);
                }
                else
                {
                    gl.stencilFunc(gl.EQUAL,level+1, 0xFF);
                    gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);
                }

                gl.drawElements(gl.TRIANGLE_STRIP,  webGLData.indices.length, gl.UNSIGNED_SHORT, 0 );

                if (!sms.reverse)
                {
                    gl.stencilFunc(gl.EQUAL,0xFF-(level), 0xFF);
                }
                else
                {
                    gl.stencilFunc(gl.EQUAL,level, 0xFF);
                }
            }

            gl.colorMask(true, true, true, true);
            gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);


        }
    },
    destroy:function ()
    {
        WebGLManager.prototype.destroy.call(this);
        this.stencilMaskStack.stencilStack = null;
    },
    pushMask:function (maskData)
    {


        this.renderer.setObjectRenderer(this.renderer.plugins.graphics);

        if (maskData.dirty)
        {
            this.renderer.plugins.graphics.updateGraphics(maskData, this.renderer.gl);
        }

        if (!maskData._webGL[this.renderer.gl.id].data.length)
        {
            return;
        }

        this.pushStencil(maskData, maskData._webGL[this.renderer.gl.id].data[0], this.renderer);
    },
    popMask:function (maskData)
    {
        this.renderer.setObjectRenderer(this.renderer.plugins.graphics);

        this.popStencil(maskData, maskData._webGL[this.renderer.gl.id].data[0], this.renderer);
    }
});

var BlendModeManager = _class({
    className:'BlendModeManager',
    extend:'WebGLManager',
    constructor:function( _super , renderer )
    {
        _super.call(this, renderer);
        this.currentBlendMode = 99999;
    },
    setBlendMode:function (blendMode)
    {
        if (this.currentBlendMode === blendMode)
        {
            return false;
        }

        this.currentBlendMode = blendMode;

        var mode = this.renderer.blendModes[this.currentBlendMode];
        this.renderer.gl.blendFunc(mode[0], mode[1]);

        return true;
    }
});


var FXAAFilter = _class({
    className:'FXAAFilter',
    extend:'AbstractFilter',
    constructor:function(_super){
        _super.call(this,

            'precision mediump float;'+
            'attribute vec2 aVertexPosition;'+
            'attribute vec2 aTextureCoord;'+
            'attribute vec4 aColor;'+
            'uniform mat3 projectionMatrix;'+
            'uniform vec2 resolution;'+
            'varying vec2 vTextureCoord;'+
            'varying vec4 vColor;'+
            'varying vec2 vResolution;'+
            'varying vec2 v_rgbNW;'+
            'varying vec2 v_rgbNE;'+
            'varying vec2 v_rgbSW;'+
            'varying vec2 v_rgbSE;'+
            'varying vec2 v_rgbM;'+

            'void texcoords(vec2 fragCoord, vec2 resolution,'+
            '            out vec2 v_rgbNW, out vec2 v_rgbNE,'+
            '            out vec2 v_rgbSW, out vec2 v_rgbSE,'+
            '            out vec2 v_rgbM) {'+
            '    vec2 inverseVP = 1.0 / resolution.xy;'+
            '    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;'+
            '    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;'+
            '    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;'+
            '    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;'+
            '    v_rgbM = vec2(fragCoord * inverseVP);'+
            '}'+

            'void main(void){'+
            '   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);'+
            '   vTextureCoord = aTextureCoord;'+
            '   vColor = vec4(aColor.rgb * aColor.a, aColor.a);'+
            '   vResolution = resolution;'+

            '   texcoords(aTextureCoord * resolution, resolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);'+
            '}',

            'precision lowp float;'+
            '#ifndef FXAA_REDUCE_MIN'+
            '    #define FXAA_REDUCE_MIN   (1.0/ 128.0)'+
            '#endif'+
            '#ifndef FXAA_REDUCE_MUL'+
            '    #define FXAA_REDUCE_MUL   (1.0 / 8.0)'+
            '#endif'+
            '#ifndef FXAA_SPAN_MAX'+
            '    #define FXAA_SPAN_MAX     8.0'+
            '#endif'+

            'vec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 resolution,'+
            '            vec2 v_rgbNW, vec2 v_rgbNE,'+
            '            vec2 v_rgbSW, vec2 v_rgbSE,'+
            '            vec2 v_rgbM) {'+
            '    vec4 color;'+
            '    mediump vec2 inverseVP = vec2(1.0 / resolution.x, 1.0 / resolution.y);'+
            '    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;'+
            '    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;'+
            '    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;'+
            '    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;'+
            '    vec4 texColor = texture2D(tex, v_rgbM);'+
            '    vec3 rgbM  = texColor.xyz;'+
            '    vec3 luma = vec3(0.299, 0.587, 0.114);'+
            '    float lumaNW = dot(rgbNW, luma);'+
            '    float lumaNE = dot(rgbNE, luma);'+
            '    float lumaSW = dot(rgbSW, luma);'+
            '    float lumaSE = dot(rgbSE, luma);'+
            '    float lumaM  = dot(rgbM,  luma);'+
            '    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));'+
            '    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));'+

            '    mediump vec2 dir;'+
            '    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));'+
            '    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));'+

            '    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *'+
            '                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);'+

            '    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);'+
            '    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),'+
            '              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),'+
            '              dir * rcpDirMin)) * inverseVP;'+

            '    vec3 rgbA = 0.5 * ('+
            '        texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +'+
            '        texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);'+
            '    vec3 rgbB = rgbA * 0.5 + 0.25 * ('+
            '        texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +'+
            '        texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);'+

            '    float lumaB = dot(rgbB, luma);'+
            '    if ((lumaB < lumaMin) || (lumaB > lumaMax))'+
            '        color = vec4(rgbA, texColor.a);'+
            '    else'+
            '        color = vec4(rgbB, texColor.a);'+
            '    return color;'+
            '}'+

            'varying vec2 vTextureCoord;'+
            'varying vec4 vColor;'+
            'varying vec2 vResolution;'+
            'varying vec2 v_rgbNW;'+
            'varying vec2 v_rgbNE;'+
            'varying vec2 v_rgbSW;'+
            'varying vec2 v_rgbSE;'+
            'varying vec2 v_rgbM;'+

            'uniform sampler2D uSampler;'+
            'void main(void){'+

            '    gl_FragColor = fxaa(uSampler, vTextureCoord * vResolution, vResolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);'+

            '}',
            {
                resolution: { type: 'v2', value: { x: 1, y: 1 } }
            }
        );
    },
    applyFilter:function (renderer, input, output)
    {
        var filterManager = renderer.filterManager;

        var shader = this.getShader( renderer );

        filterManager.applyFilter(shader, input, output);
    }
});

var Quad = _class({
    className:'Quad',
    constructor:function(gl){
         /*
         * the current WebGL drawing context
         *
         * @member {WebGLRenderingContext}
         */
        this.gl = gl;

    //    this.textures = new TextureUvs();

        /**
         * An array of vertices
         *
         * @member {Float32Array}
         */
        this.vertices = new Float32Array([
            0,0,
            200,0,
            200,200,
            0,200
        ]);

        /**
         * The Uvs of the quad
         *
         * @member {Float32Array}
         */
        this.uvs = new Float32Array([
            0,0,
            1,0,
            1,1,
            0,1
        ]);

    //    var white = (0xFFFFFF >> 16) + (0xFFFFFF & 0xff00) + ((0xFFFFFF & 0xff) << 16) + (1 * 255 << 24);
        //TODO convert this to a 32 unsigned int array
        /**
         * The color components of the triangles
         *
         * @member {Float32Array}
         */
        this.colors = new Float32Array([
            1,1,1,1,
            1,1,1,1,
            1,1,1,1,
            1,1,1,1
        ]);

        /*
         * @member {Uint16Array} An array containing the indices of the vertices
         */
        this.indices = new Uint16Array([
            0, 1, 2, 0, 3, 2
        ]);

        /*
         * @member {WebGLBuffer} The vertex buffer
         */
        this.vertexBuffer = gl.createBuffer();

        /*
         * @member {WebGLBuffer} The index buffer
         */
        this.indexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, (8 + 8 + 16) * 4, gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        this.upload();
    },
    map:function(rect, rect2)
    {
        var x = 0; 
        var y = 0; 

        //console.log(this.uvs);
        this.uvs[0] = x;
        this.uvs[1] = y;

        this.uvs[2] = x + rect2.width / rect.width;
        this.uvs[3] = y;

        this.uvs[4] = x + rect2.width / rect.width;
        this.uvs[5] = y + rect2.height / rect.height;

        this.uvs[6] = x;
        this.uvs[7] = y + rect2.height / rect.height;


        x = rect2.x;
        y = rect2.y;

        this.vertices[0] = x;
        this.vertices[1] = y;

        this.vertices[2] = x + rect2.width;
        this.vertices[3] = y;

        this.vertices[4] = x + rect2.width;
        this.vertices[5] = y + rect2.height;

        this.vertices[6] = x;
        this.vertices[7] = y + rect2.height;

        this.upload();
    },
    upload:function()
    {
        var gl = this.gl;

        gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);

        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * 4, this.uvs);

        gl.bufferSubData(gl.ARRAY_BUFFER, (8 + 8) * 4, this.colors);
    }
});

var FilterManager = _class({
    className:'FilterManager',
    extend:'WebGLManager',
    constructor:function( _super , renderer)
    {
       
        _super.call(this,renderer);

        this.filterStack = [];

        this.filterStack.push({
            renderTarget:renderer.currentRenderTarget,
            filter:[],
            bounds:null
        });

        this.texturePool = [];
        this.textureSize = new _class.Rectangle( 0, 0, renderer.width, renderer.height );
        this.currentFrame = null;
    },
    onContextChange:function ()
    {
        this.texturePool.length = 0;

        var gl = this.renderer.gl;
        this.quad = new Quad(gl);
    },
    setFilterStack:function ( filterStack )
    {
        this.filterStack = filterStack;
    },
    pushFilter:function (target, filters)
    {
        var bounds = target.filterArea ? target.filterArea.clone() : target.getBounds();
        

        bounds.x = bounds.x | 0;
        bounds.y = bounds.y | 0;
        bounds.width = bounds.width | 0;
        bounds.height = bounds.height | 0;


        var padding = filters[0].padding | 0;
        bounds.x -= padding;
        bounds.y -= padding;
        bounds.width += padding * 2;
        bounds.height += padding * 2;

        if(this.renderer.currentRenderTarget.transform)
        {
            var transform = this.renderer.currentRenderTarget.transform;

            bounds.x += transform.tx;
            bounds.y += transform.ty;

            this.capFilterArea( bounds );

            bounds.x -= transform.tx;
            bounds.y -= transform.ty;
        }
        else
        {
             this.capFilterArea( bounds );
        }

        if(bounds.width > 0 && bounds.height > 0)
        {
            this.currentFrame = bounds;

            var texture = this.getRenderTarget();

            this.renderer.setRenderTarget(texture);

            texture.clear();

            this.filterStack.push({
                renderTarget: texture,
                filter: filters
            });

        }
        else
        {
            this.filterStack.push({
                renderTarget: null,
                filter: filters
            });
        }
    },
    popFilter:function ()
    {
        var filterData = this.filterStack.pop();
        var previousFilterData = this.filterStack[this.filterStack.length-1];

        var input = filterData.renderTarget;

        if(!filterData.renderTarget)
        {
            return;
        }

        var output = previousFilterData.renderTarget;

        var gl = this.renderer.gl;


        this.currentFrame = input.frame;

        this.quad.map(this.textureSize, input.frame);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.quad.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.quad.indexBuffer);

        var filters = filterData.filter;

        gl.vertexAttribPointer(this.renderer.shaderManager.defaultShader.attributes.aVertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribPointer(this.renderer.shaderManager.defaultShader.attributes.aTextureCoord, 2, gl.FLOAT, false, 0, 2 * 4 * 4);
        gl.vertexAttribPointer(this.renderer.shaderManager.defaultShader.attributes.aColor, 4, gl.FLOAT, false, 0, 4 * 4 * 4);

        this.renderer.blendModeManager.setBlendMode(CONST.BLEND_MODES.NORMAL);

        if (filters.length === 1)
        {
            if (filters[0].uniforms.dimensions)
            {
                filters[0].uniforms.dimensions.value[0] = this.renderer.width;
                filters[0].uniforms.dimensions.value[1] = this.renderer.height;
                filters[0].uniforms.dimensions.value[2] = this.quad.vertices[0];
                filters[0].uniforms.dimensions.value[3] = this.quad.vertices[5];
            }

            filters[0].applyFilter( this.renderer, input, output );
            this.returnRenderTarget( input );

        }
        else
        {
            var flipTexture = input;
            var flopTexture = this.getRenderTarget(true);

            for (var i = 0; i < filters.length-1; i++)
            {
                var filter = filters[i];

                if (filter.uniforms.dimensions)
                {
                    filter.uniforms.dimensions.value[0] = this.renderer.width;
                    filter.uniforms.dimensions.value[1] = this.renderer.height;
                    filter.uniforms.dimensions.value[2] = this.quad.vertices[0];
                    filter.uniforms.dimensions.value[3] = this.quad.vertices[5];
                }

                filter.applyFilter( this.renderer, flipTexture, flopTexture );

                var temp = flipTexture;
                flipTexture = flopTexture;
                flopTexture = temp;
            }

            filters[filters.length-1].applyFilter( this.renderer, flipTexture, output );

            this.returnRenderTarget( flipTexture );
            this.returnRenderTarget( flopTexture );
        }

        return filterData.filter;
    },
    getRenderTarget:function ( clear )
    {
        var renderTarget = this.texturePool.pop() || new RenderTarget(this.renderer.gl, this.textureSize.width, this.textureSize.height, CONST.SCALE_MODES.LINEAR, this.renderer.resolution * CONST.FILTER_RESOLUTION);
        renderTarget.frame = this.currentFrame;

        if (clear)
        {
            renderTarget.clear(true);
        }

        return renderTarget;
    },
    returnRenderTarget:function (renderTarget)
    {
        this.texturePool.push( renderTarget );
    },
    applyFilter:function (shader, inputTarget, outputTarget, clear)
    {
        var gl = this.renderer.gl;

        this.renderer.setRenderTarget(outputTarget);

        if (clear)
        {
            outputTarget.clear();
        }

        this.renderer.shaderManager.setShader(shader);

        shader.uniforms.projectionMatrix.value = this.renderer.currentRenderTarget.projectionMatrix.toArray(true);

        shader.syncUniforms();

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, inputTarget.texture);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );
    },
    calculateMappedMatrix:function (filterArea, sprite, outputMatrix)
    {
        var worldTransform = sprite.worldTransform.copy(Matrix.TEMP_MATRIX),
        texture = sprite._texture.baseTexture;

        var mappedMatrix = outputMatrix.identity();

        var ratio = this.textureSize.height / this.textureSize.width;

        mappedMatrix.translate(filterArea.x / this.textureSize.width, filterArea.y / this.textureSize.height );

        mappedMatrix.scale(1 , ratio);

        var translateScaleX = (this.textureSize.width / texture.width);
        var translateScaleY = (this.textureSize.height / texture.height);

        worldTransform.tx /= texture.width * translateScaleX;
        worldTransform.ty /= texture.width * translateScaleX;

        worldTransform.invert();

        mappedMatrix.prepend(worldTransform);

        mappedMatrix.scale(1 , 1/ratio);

        mappedMatrix.scale( translateScaleX , translateScaleY );

        mappedMatrix.translate(sprite.anchor.x, sprite.anchor.y);

        return mappedMatrix;

    },
    capFilterArea:function (filterArea)
    {
        if (filterArea.x < 0)
        {
            filterArea.width += filterArea.x;
            filterArea.x = 0;
        }

        if (filterArea.y < 0)
        {
            filterArea.height += filterArea.y;
            filterArea.y = 0;
        }

        if ( filterArea.x + filterArea.width > this.textureSize.width )
        {
            filterArea.width = this.textureSize.width - filterArea.x;
        }

        if ( filterArea.y + filterArea.height > this.textureSize.height )
        {
            filterArea.height = this.textureSize.height - filterArea.y;
        }
    },
    resize:function ( width, height )
    {
        this.textureSize.width = width;
        this.textureSize.height = height;

        for (var i = 0; i < this.texturePool.length; i++)
        {
            this.texturePool[i].resize( width, height );
        }
    },
    destroy:function ()
    {
        this.filterStack = null;
        this.offsetY = 0;

        for (var i = 0; i < this.texturePool.length; i++)
        {
            this.texturePool[i].destroy();
        }

        this.texturePool = null;
    }
});


var WebGLRenderer = _class({
    className:'WebGLRenderer',
    extend:'SystemRenderer',
    constructor:function(_super , width, height, options)
    {
        options = options || {};

        _super.call(this, 'WebGL', width, height, options);

        this.type = CONST.RENDERER_TYPE.WEBGL;

        this.handleContextLost = this.handleContextLost.bind(this);
        this.handleContextRestored = this.handleContextRestored.bind(this);

        this.view.addEventListener('webglcontextlost', this.handleContextLost, false);
        this.view.addEventListener('webglcontextrestored', this.handleContextRestored, false);

        this._useFXAA = !!options.forceFXAA && options.antialias;

        this._FXAAFilter = null;

        this._contextOptions = {
            alpha: this.transparent,
            antialias: options.antialias,
            premultipliedAlpha: this.transparent && this.transparent !== 'notMultiplied',
            stencil: true,
            preserveDrawingBuffer: options.preserveDrawingBuffer
        };

        this.drawCount = 0;

        this.shaderManager = new ShaderManager(this);

        this.maskManager = new MaskManager(this);

        this.stencilManager = new StencilManager(this);

        this.filterManager = new FilterManager(this);

        this.blendModeManager = new BlendModeManager(this);

        this.currentRenderTarget = null;
        this.currentRenderer = new _class.ObjectRenderer(this);
        this.initPlugins();
        this._createContext();
        this._initContext();

        this._mapBlendModes();

        this._renderTargetStack = [];

    },
    _createContext:function () {
        var gl = this.view.getContext('webgl', this._contextOptions) || this.view.getContext('experimental-webgl', this._contextOptions);
        this.gl = gl;

        if (!gl)
        {
            throw new Error('This browser does not support webGL. Try using the canvas renderer');
        }

        this.glContextId = WebGLRenderer.glContextId++;
        gl.id = this.glContextId;
        gl.renderer = this;
    },
    _initContext:function ()
    {
        var gl = this.gl;

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.BLEND);

        this.renderTarget = new RenderTarget(gl, this.width, this.height, null, this.resolution, true);

        this.setRenderTarget(this.renderTarget);

        message.trigger( this ,'context',gl);

        this.resize(this.width, this.height);

        if(!this._useFXAA)
        {
            this._useFXAA = (this._contextOptions.antialias && ! gl.getContextAttributes().antialias);
        }


        if(this._useFXAA)
        {
            window.console.warn('FXAA antialiasing being used instead of native antialiasing');
            this._FXAAFilter = [new FXAAFilter()];
        }
    },
    render:function (object)
    {
        if (this.gl.isContextLost())
        {
            return;
        }

        this.drawCount = 0;

        this._lastObjectRendered = object;

        if(this._useFXAA)
        {
            this._FXAAFilter[0].uniforms.resolution.value.x = this.width;
            this._FXAAFilter[0].uniforms.resolution.value.y = this.height;
            object.filterArea = this.renderTarget.size;
            object.filters = this._FXAAFilter;
        }

        var cacheParent = object.parent;
        object.parent = this._tempDisplayObjectParent;

        object.updateTransform();

        object.parent = cacheParent;

        var gl = this.gl;

        this.setRenderTarget(this.renderTarget);

        if (this.clearBeforeRender)
        {
            if (this.transparent)
            {
                gl.clearColor(0, 0, 0, 0);
            }
            else
            {
                gl.clearColor(this._backgroundColorRgb[0], this._backgroundColorRgb[1], this._backgroundColorRgb[2], 1);
            }

            gl.clear(gl.COLOR_BUFFER_BIT);
        }

        this.renderDisplayObject(object, this.renderTarget);//this.projection);
    },
    renderDisplayObject:function (displayObject, renderTarget, clear)//projection, buffer)
    {


        if(clear)
        {
            renderTarget.clear();
        }

        this.filterManager.setFilterStack( renderTarget.filterStack );

        displayObject.renderWebGL(this);

        this.currentRenderer.flush();
    },
    setObjectRenderer:function (objectRenderer)
    {
        if (this.currentRenderer === objectRenderer)
        {
            return;
        }

        this.currentRenderer.stop();
        this.currentRenderer = objectRenderer;
        this.currentRenderer.start();
    },
    setRenderTarget:function (renderTarget)
    {
        if( this.currentRenderTarget === renderTarget)
        {
            return;
        }
        this.currentRenderTarget = renderTarget;
        this.currentRenderTarget.activate();
        this.stencilManager.setMaskStack( renderTarget.stencilMaskStack );
    },
    resize:function (width, height)
    {
        SystemRenderer.prototype.resize.call(this, width, height);

        this.filterManager.resize(width, height);
        this.renderTarget.resize(width, height);

        if(this.currentRenderTarget === this.renderTarget)
        {
            this.renderTarget.activate();
            this.gl.viewport(0, 0, this.width, this.height);
        }
    },
    updateTexture:function (texture)
    {
        texture = texture.baseTexture || texture;

        if (!texture.hasLoaded)
        {
            return;
        }

        var gl = this.gl;

        if (!texture._glTextures[gl.id])
        {
            texture._glTextures[gl.id] = gl.createTexture();

            message.on(texture,'update', this.updateTexture.bind(this));
            message.on(texture,'dispose', this.destroyTexture.bind(this));

        }


        gl.bindTexture(gl.TEXTURE_2D, texture._glTextures[gl.id]);

        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultipliedAlpha);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texture.scaleMode === CONST.SCALE_MODES.LINEAR ? gl.LINEAR : gl.NEAREST);


        if (texture.mipmap && texture.isPowerOfTwo)
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === CONST.SCALE_MODES.LINEAR ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        else
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === CONST.SCALE_MODES.LINEAR ? gl.LINEAR : gl.NEAREST);
        }

        if (!texture.isPowerOfTwo)
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        else
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }

        return  texture._glTextures[gl.id];
    },
    destroyTexture:function (texture)
    {
        texture = texture.baseTexture || texture;

        if (!texture.hasLoaded)
        {
            return;
        }

        if (texture._glTextures[this.gl.id])
        {
            this.gl.deleteTexture(texture._glTextures[this.gl.id]);
        }
    },
    handleContextLost:function (event)
    {
        event.preventDefault();
    },
    handleContextRestored:function ()
    {
        this._initContext();

        for (var key in g.BaseTextureCache)
        {
            g.BaseTextureCache[key]._glTextures.length = 0;
        }
    },
    destroy:function (removeView)
    {
        this.destroyPlugins();

        this.view.removeEventListener('webglcontextlost', this.handleContextLost);
        this.view.removeEventListener('webglcontextrestored', this.handleContextRestored);

        SystemRenderer.prototype.destroy.call(this, removeView);

        this.uuid = 0;

        this.shaderManager.destroy();
        this.maskManager.destroy();
        this.stencilManager.destroy();
        this.filterManager.destroy();

        this.shaderManager = null;
        this.maskManager = null;
        this.filterManager = null;
        this.blendModeManager = null;

        this.handleContextLost = null;
        this.handleContextRestored = null;

        this._contextOptions = null;

        this.drawCount = 0;

        this.gl = null;
    },
    _mapBlendModes:function ()
    {
        var gl = this.gl;

        if (!this.blendModes)
        {
            this.blendModes = {};

            this.blendModes[CONST.BLEND_MODES.NORMAL]        = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.ADD]           = [gl.SRC_ALPHA, gl.DST_ALPHA];
            this.blendModes[CONST.BLEND_MODES.MULTIPLY]      = [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.SCREEN]        = [gl.SRC_ALPHA, gl.ONE];
            this.blendModes[CONST.BLEND_MODES.OVERLAY]       = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.DARKEN]        = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.LIGHTEN]       = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.COLOR_DODGE]   = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.COLOR_BURN]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.HARD_LIGHT]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.SOFT_LIGHT]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.DIFFERENCE]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.EXCLUSION]     = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.HUE]           = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.SATURATION]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.COLOR]         = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.LUMINOSITY]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        }
    }
});

utils.pluginTarget.mixin(WebGLRenderer);

WebGLRenderer.glContextId = 0;

var RenderTexture = _class({
    className:'RenderTexture',
    extend:'Texture',
    constructor:function( _super , renderer, width, height, scaleMode, resolution)
    {
        if (!renderer)
        {
            throw new Error('Unable to create RenderTexture, you must pass a renderer into the constructor.');
        }

        width = width || 100;
        height = height || 100;
        resolution = resolution || CONST.RESOLUTION;

        var baseTexture = new BaseTexture();
        baseTexture.width = width;
        baseTexture.height = height;
        baseTexture.resolution = resolution;
        baseTexture.scaleMode = scaleMode || CONST.SCALE_MODES.DEFAULT;
        baseTexture.hasLoaded = true;

        _super.call(this,
            baseTexture,
            new Rectangle(0, 0, width, height)
        );

        this.width = width ;
        this.height = height ;
        this.resolution = resolution ;
        this.render = null ;
        this.renderer = renderer ;

        if (this.renderer.type === CONST.RENDERER_TYPE.WEBGL)
        {
            var gl = this.renderer.gl ;

            this.textureBuffer = new RenderTarget( gl , this.width, this.height, baseTexture.scaleMode, this.resolution);//, this.baseTexture.scaleMode);
        

            this.baseTexture._glTextures[gl.id] =  this.textureBuffer.texture;

            this.filterManager = new FilterManager(this.renderer);

            this.filterManager.onContextChange();
            this.filterManager.resize(width, height);

            this.render = this.renderWebGL;

            this.renderer.currentRenderer.start();
            this.renderer.currentRenderTarget.activate();
        }
        else
        {

            this.render = this.renderCanvas;
            this.textureBuffer = new CanvasBuffer(this.width* this.resolution, this.height* this.resolution);
            this.baseTexture.source = this.textureBuffer.canvas;
        }


        this.valid = true;

        this._updateUvs(true);
    },
    resize:function (width, height, updateBase)
    {
        if (width === this.width && height === this.height)
        {
            return;
        }

        this.valid = (width > 0 && height > 0);

        this.width = this._frame.width = this.crop.width = width;
        this.height =  this._frame.height = this.crop.height = height;

        if (updateBase)
        {
            this.baseTexture.width = this.width;
            this.baseTexture.height = this.height;
        }

        if (!this.valid)
        {
            return;
        }

        this.textureBuffer.resize(this.width, this.height);

        if(this.filterManager)
        {
            this.filterManager.resize(this.width, this.height);
        }
    },
    clear:function ()
    {
        if (!this.valid)
        {
            return;
        }

        if (this.renderer.type === CONST.RENDERER_TYPE.WEBGL)
        {
            this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, this.textureBuffer.frameBuffer);
        }



        this.textureBuffer.clear();
    },
    renderWebGL:function (displayObject, matrix, clear, updateTransform)
    {
        if (!this.valid)
        {
            return;
        }

        updateTransform = (updateTransform !== undefined) ? updateTransform : true;

        this.textureBuffer.transform = matrix;

        this.textureBuffer.activate();

        displayObject.worldAlpha = displayObject.alpha;

        if (updateTransform)
        {

        
            displayObject.worldTransform.identity();

            displayObject.currentBounds = null;

            var children = displayObject.children;
            var i, j;

            for (i = 0, j = children.length; i < j; ++i)
            {
                children[i].updateTransform();
            }
        }

        var temp =  this.renderer.filterManager;

        clear = true;

        this.renderer.filterManager = this.filterManager;
        this.renderer.renderDisplayObject(displayObject, this.textureBuffer, clear);

        this.renderer.filterManager = temp;

        this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, null);
    },
    renderCanvas:function (displayObject, matrix, clear, updateTransform)
    {
        if (!this.valid) { return; }

        updateTransform = !!updateTransform;
        var cachedWt = displayObject.worldTransform;

        var wt = Matrix.TEMP_MATRIX;

        wt.identity();

        if (matrix) { wt.append(matrix); }

        displayObject.worldTransform = wt;

        displayObject.worldAlpha = 1;

        var children = displayObject.children;
        var i, j;

        for (i = 0, j = children.length; i < j; ++i)
        {
            children[i].updateTransform();
        }

        if (clear)
        {
            this.textureBuffer.clear();
        }

        displayObject.worldTransform = cachedWt;

        var context = this.textureBuffer.context;

        var realResolution = this.renderer.resolution;

        this.renderer.resolution = this.resolution;

        this.renderer.renderDisplayObject(displayObject, context);

        this.renderer.resolution = realResolution;

    },
    destroy:function ()
    {
        Texture.prototype.destroy.call(this, true);

        this.textureBuffer.destroy();

        if(this.filterManager)
        {
            this.filterManager.destroy();
        }

        this.renderer = null;
    },
    getImage:function ()
    {
        var image = new Image();
        image.src = this.getBase64();
        return image;
    },
    getBase64:function ()
    {
        return this.getCanvas().toDataURL();
    },

    getCanvas:function (cas)
    {
        if (this.renderer.type === CONST.RENDERER_TYPE.WEBGL)
        {
            var gl = this.renderer.gl;
            var width = this.textureBuffer.size.width;
            var height = this.textureBuffer.size.height;

            var webGLPixels = new Uint8Array(4 * width * height);

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.textureBuffer.frameBuffer);
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, webGLPixels);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            var tempCanvas = cas || new CanvasBuffer(width, height);
            var canvasData = tempCanvas.context.getImageData(0, 0, width, height);
            canvasData.data.set(webGLPixels);

            tempCanvas.context.putImageData(canvasData, 0, 0);

            return tempCanvas.canvas;
        }
        else
        {
            return this.textureBuffer.canvas;
        }
    },
    getPixels:function ()
    {
        var width, height;

        if (this.renderer.type === CONST.RENDERER_TYPE.WEBGL)
        {
            var gl = this.renderer.gl;
            width = this.textureBuffer.size.width;
            height = this.textureBuffer.size.height;

            var webGLPixels = new Uint8Array(4 * width * height);

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.textureBuffer.frameBuffer);
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, webGLPixels);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            return webGLPixels;
        }
        else
        {
            width = this.textureBuffer.canvas.width;
            height = this.textureBuffer.canvas.height;

            return this.textureBuffer.canvas.getContext('2d').getImageData(0, 0, width, height).data;
        }
    },
    getPixel:function (x, y)
    {
        if (this.renderer.type === CONST.RENDERER_TYPE.WEBGL)
        {
            var gl = this.renderer.gl;

            var webGLPixels = new Uint8Array(4);

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.textureBuffer.frameBuffer);
            gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, webGLPixels);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            return webGLPixels;
        }
        else
        {
            return this.textureBuffer.canvas.getContext('2d').getImageData(x, y, 1, 1).data;
        }
    }
});

//console.log(new _class.CanvasRenderer);


var CanvasMaskManager = _class({
    className:'CanvasMaskManager',
    constructor:function(){},
    pushMask:function (maskData, renderer)
    {
        renderer.context.save();

        var cacheAlpha = maskData.alpha;
        var transform = maskData.worldTransform;
        var resolution = renderer.resolution;

        renderer.context.setTransform(
            transform.a * resolution,
            transform.b * resolution,
            transform.c * resolution,
            transform.d * resolution,
            transform.tx * resolution,
            transform.ty * resolution
        );

        if(!maskData.texture)
        {
            CanvasGraphics.renderGraphicsMask(maskData, renderer.context);
            renderer.context.clip();
        }

        maskData.worldAlpha = cacheAlpha;
    },
    popMask:function (renderer)
    {
        renderer.context.restore();
    },
    destroy:function () {}
});

var CanvasBuffer = _class({
    className:'CanvasBuffer',
    constructor:function(width, height)
    {

        this.canvas = document.createElement('canvas');

        this.context = this.canvas.getContext('2d');

        this.canvas.width = width;
        this.canvas.height = height;
    },
    clear:function ()
    {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    },
    resize:function (width, height)
    {
        this.canvas.width = width;
        this.canvas.height = height;
    },
    destroy:function ()
    {
        this.context = null;
        this.canvas = null;
    }
},{

    width: {
        get: function ()
        {
            return this.canvas.width;
        },
        set: function (val)
        {
            this.canvas.width = val;
        }
    },

    height: {
        get: function ()
        {
            return this.canvas.height;
        },
        set: function (val)
        {
            this.canvas.height = val;
        }
    }
});


var CanvasRenderer = _class({
    className:'CanvasRenderer',
    extend:'SystemRenderer',
    constructor:function( _super , width, height, options)
    {
        _super.call(this, 'Canvas', width, height, options);

        this.type = CONST.RENDERER_TYPE.CANVAS;

        this.context = this.view.getContext('2d', { alpha: this.transparent });

        this.refresh = true;

        this.maskManager = new CanvasMaskManager();

        this.roundPixels = false;

        this.currentScaleMode = CONST.SCALE_MODES.DEFAULT;

        this.currentBlendMode = CONST.BLEND_MODES.NORMAL;

        this.smoothProperty = 'imageSmoothingEnabled';

        if (!this.context.imageSmoothingEnabled)
        {
            if (this.context.webkitImageSmoothingEnabled)
            {
                this.smoothProperty = 'webkitImageSmoothingEnabled';
            }
            else if (this.context.mozImageSmoothingEnabled)
            {
                this.smoothProperty = 'mozImageSmoothingEnabled';
            }
            else if (this.context.oImageSmoothingEnabled)
            {
                this.smoothProperty = 'oImageSmoothingEnabled';
            }
            else if (this.context.msImageSmoothingEnabled)
            {
                this.smoothProperty = 'msImageSmoothingEnabled';
            }
        }

        this.initPlugins();

        this._mapBlendModes();

        this._tempDisplayObjectParent = {
            worldTransform: new _class.Matrix(),
            worldAlpha: 1
        };


        this.resize(width, height);
    },
    render:function (object)
    {
        var cacheParent = object.parent;

        this._lastObjectRendered = object;

        object.parent = this._tempDisplayObjectParent;

        object.updateTransform();

        object.parent = cacheParent;

        this.context.setTransform(1, 0, 0, 1, 0, 0);

        this.context.globalAlpha = 1;

        this.currentBlendMode = CONST.BLEND_MODES.NORMAL;
        this.context.globalCompositeOperation = this.blendModes[CONST.BLEND_MODES.NORMAL];

        if (navigator.isCocoonJS && this.view.screencanvas)
        {
            this.context.fillStyle = 'black';
            this.context.clear();
        }

        if (this.clearBeforeRender)
        {
            if (this.transparent)
            {
                this.context.clearRect(0, 0, this.width, this.height);
            }
            else
            {
                this.context.fillStyle = this._backgroundColorString;
                this.context.fillRect(0, 0, this.width , this.height);
            }
        }

        this.renderDisplayObject(object, this.context);
    },
    destroy:function (removeView)
    {
        this.destroyPlugins();

        SystemRenderer.prototype.destroy.call(this, removeView);

        this.context = null;

        this.refresh = true;

        this.maskManager.destroy();
        this.maskManager = null;

        this.roundPixels = false;

        this.currentScaleMode = 0;
        this.currentBlendMode = 0;

        this.smoothProperty = null;
    },
    renderDisplayObject:function (displayObject, context)
    {
        var tempContext = this.context;

        this.context = context;
        displayObject.renderCanvas(this);
        this.context = tempContext;
    },
    _mapBlendModes:function ()
    {
        if (!this.blendModes)
        {
            this.blendModes = {};

            if (utils.canUseNewCanvasBlendModes())
            {
                this.blendModes[CONST.BLEND_MODES.NORMAL]        = 'source-over';
                this.blendModes[CONST.BLEND_MODES.ADD]           = 'lighter'; 
                this.blendModes[CONST.BLEND_MODES.MULTIPLY]      = 'multiply';
                this.blendModes[CONST.BLEND_MODES.SCREEN]        = 'screen';
                this.blendModes[CONST.BLEND_MODES.OVERLAY]       = 'overlay';
                this.blendModes[CONST.BLEND_MODES.DARKEN]        = 'darken';
                this.blendModes[CONST.BLEND_MODES.LIGHTEN]       = 'lighten';
                this.blendModes[CONST.BLEND_MODES.COLOR_DODGE]   = 'color-dodge';
                this.blendModes[CONST.BLEND_MODES.COLOR_BURN]    = 'color-burn';
                this.blendModes[CONST.BLEND_MODES.HARD_LIGHT]    = 'hard-light';
                this.blendModes[CONST.BLEND_MODES.SOFT_LIGHT]    = 'soft-light';
                this.blendModes[CONST.BLEND_MODES.DIFFERENCE]    = 'difference';
                this.blendModes[CONST.BLEND_MODES.EXCLUSION]     = 'exclusion';
                this.blendModes[CONST.BLEND_MODES.HUE]           = 'hue';
                this.blendModes[CONST.BLEND_MODES.SATURATION]    = 'saturate';
                this.blendModes[CONST.BLEND_MODES.COLOR]         = 'color';
                this.blendModes[CONST.BLEND_MODES.LUMINOSITY]    = 'luminosity';
            }
            else
            {
                this.blendModes[CONST.BLEND_MODES.NORMAL]        = 'source-over';
                this.blendModes[CONST.BLEND_MODES.ADD]           = 'lighter'; 
                this.blendModes[CONST.BLEND_MODES.MULTIPLY]      = 'source-over';
                this.blendModes[CONST.BLEND_MODES.SCREEN]        = 'source-over';
                this.blendModes[CONST.BLEND_MODES.OVERLAY]       = 'source-over';
                this.blendModes[CONST.BLEND_MODES.DARKEN]        = 'source-over';
                this.blendModes[CONST.BLEND_MODES.LIGHTEN]       = 'source-over';
                this.blendModes[CONST.BLEND_MODES.COLOR_DODGE]   = 'source-over';
                this.blendModes[CONST.BLEND_MODES.COLOR_BURN]    = 'source-over';
                this.blendModes[CONST.BLEND_MODES.HARD_LIGHT]    = 'source-over';
                this.blendModes[CONST.BLEND_MODES.SOFT_LIGHT]    = 'source-over';
                this.blendModes[CONST.BLEND_MODES.DIFFERENCE]    = 'source-over';
                this.blendModes[CONST.BLEND_MODES.EXCLUSION]     = 'source-over';
                this.blendModes[CONST.BLEND_MODES.HUE]           = 'source-over';
                this.blendModes[CONST.BLEND_MODES.SATURATION]    = 'source-over';
                this.blendModes[CONST.BLEND_MODES.COLOR]         = 'source-over';
                this.blendModes[CONST.BLEND_MODES.LUMINOSITY]    = 'source-over';
            }
        }
    }

});

fn.pluginTarget.mixin(CanvasRenderer);

var CanvasGraphics = {

    renderGraphics:function (graphics, context)
    {
        var worldAlpha = graphics.worldAlpha;

        if (graphics.dirty)
        {
            this.updateGraphicsTint(graphics);
            graphics.dirty = false;
        }

        for (var i = 0; i < graphics.graphicsData.length; i++)
        {
            var data = graphics.graphicsData[i];
            var shape = data.shape;

            var fillColor = data._fillTint;
            var lineColor = data._lineTint;

            context.lineWidth = data.lineWidth;

            if (data.type === CONST.SHAPES.POLY)
            {
                context.beginPath();

                var points = shape.points;

                context.moveTo(points[0], points[1]);

                for (var j=1; j < points.length/2; j++)
                {
                    context.lineTo(points[j * 2], points[j * 2 + 1]);
                }

                if (shape.closed)
                {
                    context.lineTo(points[0], points[1]);
                }

                if (points[0] === points[points.length-2] && points[1] === points[points.length-1])
                {
                    context.closePath();
                }

                if (data.fill)
                {
                    context.globalAlpha = data.fillAlpha * worldAlpha;
                    context.fillStyle = '#' + ('00000' + ( fillColor | 0).toString(16)).substr(-6);
                    context.fill();
                }
                if (data.lineWidth)
                {
                    context.globalAlpha = data.lineAlpha * worldAlpha;
                    context.strokeStyle = '#' + ('00000' + ( lineColor | 0).toString(16)).substr(-6);
                    context.stroke();
                }
            }
            else if (data.type === CONST.SHAPES.RECT)
            {

                if (data.fillColor || data.fillColor === 0)
                {
                    context.globalAlpha = data.fillAlpha * worldAlpha;
                    context.fillStyle = '#' + ('00000' + ( fillColor | 0).toString(16)).substr(-6);
                    context.fillRect(shape.x, shape.y, shape.width, shape.height);

                }
                if (data.lineWidth)
                {
                    context.globalAlpha = data.lineAlpha * worldAlpha;
                    context.strokeStyle = '#' + ('00000' + ( lineColor | 0).toString(16)).substr(-6);
                    context.strokeRect(shape.x, shape.y, shape.width, shape.height);
                }
            }
            else if (data.type === CONST.SHAPES.CIRC)
            {
                // TODO - need to be Undefined!
                context.beginPath();
                context.arc(shape.x, shape.y, shape.radius,0,2*Math.PI);
                context.closePath();

                if (data.fill)
                {
                    context.globalAlpha = data.fillAlpha * worldAlpha;
                    context.fillStyle = '#' + ('00000' + ( fillColor | 0).toString(16)).substr(-6);
                    context.fill();
                }
                if (data.lineWidth)
                {
                    context.globalAlpha = data.lineAlpha * worldAlpha;
                    context.strokeStyle = '#' + ('00000' + ( lineColor | 0).toString(16)).substr(-6);
                    context.stroke();
                }
            }
            else if (data.type === CONST.SHAPES.ELIP)
            {
              
                var w = shape.width * 2;
                var h = shape.height * 2;

                var x = shape.x - w/2;
                var y = shape.y - h/2;

                context.beginPath();

                var kappa = 0.5522848,
                    ox = (w / 2) * kappa, // control point offset horizontal
                    oy = (h / 2) * kappa, // control point offset vertical
                    xe = x + w,           // x-end
                    ye = y + h,           // y-end
                    xm = x + w / 2,       // x-middle
                    ym = y + h / 2;       // y-middle

                context.moveTo(x, ym);
                context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
                context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
                context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);

                context.closePath();

                if (data.fill)
                {
                    context.globalAlpha = data.fillAlpha * worldAlpha;
                    context.fillStyle = '#' + ('00000' + ( fillColor | 0).toString(16)).substr(-6);
                    context.fill();
                }
                if (data.lineWidth)
                {
                    context.globalAlpha = data.lineAlpha * worldAlpha;
                    context.strokeStyle = '#' + ('00000' + ( lineColor | 0).toString(16)).substr(-6);
                    context.stroke();
                }
            }
            else if (data.type === CONST.SHAPES.RREC)
            {
                var rx = shape.x;
                var ry = shape.y;
                var width = shape.width;
                var height = shape.height;
                var radius = shape.radius;

                var maxRadius = Math.min(width, height) / 2 | 0;
                radius = radius > maxRadius ? maxRadius : radius;

                context.beginPath();
                context.moveTo(rx, ry + radius);
                context.lineTo(rx, ry + height - radius);
                context.quadraticCurveTo(rx, ry + height, rx + radius, ry + height);
                context.lineTo(rx + width - radius, ry + height);
                context.quadraticCurveTo(rx + width, ry + height, rx + width, ry + height - radius);
                context.lineTo(rx + width, ry + radius);
                context.quadraticCurveTo(rx + width, ry, rx + width - radius, ry);
                context.lineTo(rx + radius, ry);
                context.quadraticCurveTo(rx, ry, rx, ry + radius);
                context.closePath();

                if (data.fillColor || data.fillColor === 0)
                {
                    context.globalAlpha = data.fillAlpha * worldAlpha;
                    context.fillStyle = '#' + ('00000' + ( fillColor | 0).toString(16)).substr(-6);
                    context.fill();

                }
                if (data.lineWidth)
                {
                    context.globalAlpha = data.lineAlpha * worldAlpha;
                    context.strokeStyle = '#' + ('00000' + ( lineColor | 0).toString(16)).substr(-6);
                    context.stroke();
                }
            }
        }
    },
    renderGraphicsMask:function (graphics, context)
    {
        var len = graphics.graphicsData.length;

        if (len === 0)
        {
            return;
        }

        context.beginPath();

        for (var i = 0; i < len; i++)
        {
            var data = graphics.graphicsData[i];
            var shape = data.shape;

            if (data.type === CONST.SHAPES.POLY)
            {

                var points = shape.points;

                context.moveTo(points[0], points[1]);

                for (var j=1; j < points.length/2; j++)
                {
                    context.lineTo(points[j * 2], points[j * 2 + 1]);
                }

                if (points[0] === points[points.length-2] && points[1] === points[points.length-1])
                {
                    context.closePath();
                }

            }
            else if (data.type === CONST.SHAPES.RECT)
            {
                context.rect(shape.x, shape.y, shape.width, shape.height);
                context.closePath();
            }
            else if (data.type === CONST.SHAPES.CIRC)
            {
               
                context.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
                context.closePath();
            }
            else if (data.type === CONST.SHAPES.ELIP)
            {

                var w = shape.width * 2;
                var h = shape.height * 2;

                var x = shape.x - w/2;
                var y = shape.y - h/2;

                var kappa = 0.5522848,
                    ox = (w / 2) * kappa, // control point offset horizontal
                    oy = (h / 2) * kappa, // control point offset vertical
                    xe = x + w,           // x-end
                    ye = y + h,           // y-end
                    xm = x + w / 2,       // x-middle
                    ym = y + h / 2;       // y-middle

                context.moveTo(x, ym);
                context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
                context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
                context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
                context.closePath();
            }
            else if (data.type === CONST.SHAPES.RREC)
            {

                var rx = shape.x;
                var ry = shape.y;
                var width = shape.width;
                var height = shape.height;
                var radius = shape.radius;

                var maxRadius = Math.min(width, height) / 2 | 0;
                radius = radius > maxRadius ? maxRadius : radius;

                context.moveTo(rx, ry + radius);
                context.lineTo(rx, ry + height - radius);
                context.quadraticCurveTo(rx, ry + height, rx + radius, ry + height);
                context.lineTo(rx + width - radius, ry + height);
                context.quadraticCurveTo(rx + width, ry + height, rx + width, ry + height - radius);
                context.lineTo(rx + width, ry + radius);
                context.quadraticCurveTo(rx + width, ry, rx + width - radius, ry);
                context.lineTo(rx + radius, ry);
                context.quadraticCurveTo(rx, ry, rx, ry + radius);
                context.closePath();
            }
        }
    },
    updateGraphicsTint:function (graphics)
    {
        if (graphics.tint === 0xFFFFFF)
        {
            return;
        }

        var tintR = (graphics.tint >> 16 & 0xFF) / 255;
        var tintG = (graphics.tint >> 8 & 0xFF) / 255;
        var tintB = (graphics.tint & 0xFF)/ 255;

        for (var i = 0; i < graphics.graphicsData.length; i++)
        {
            var data = graphics.graphicsData[i];

            var fillColor = data.fillColor | 0;
            var lineColor = data.lineColor | 0;

            data._fillTint = (((fillColor >> 16 & 0xFF) / 255 * tintR*255 << 16) + ((fillColor >> 8 & 0xFF) / 255 * tintG*255 << 8) +  (fillColor & 0xFF) / 255 * tintB*255);
            data._lineTint = (((lineColor >> 16 & 0xFF) / 255 * tintR*255 << 16) + ((lineColor >> 8 & 0xFF) / 255 * tintG*255 << 8) +  (lineColor & 0xFF) / 255 * tintB*255);

        }
    }
};




var DisplayObject = _class({

    className:'DisplayObject',
    constructor:function(){
        this._id = null;

        this.uid = miao.uid;

        this.name = null;
 
        this.parent = null;

        this.worldTransform = new Matrix();

        this.filterArea = null;

        this._sr = 0;

        this._cr = 1;
      
        this._bounds = new Rectangle(0, 0, 1, 1);

        this._currentBounds = null;

        this._cacheAsBitmap = false;

        this._cachedObject = null;

        this.position  =   new Point();
        this.anchor     =  new Point();
        this.scale     =   new Point(1,1);
        this.pivot     =  new Point(0, 0);
        this.rotation  =   0;
        this.alpha     =   1;
        this.visible  =  true;
        this.renderable =   true;
        this.enabled    =  true;
        this.depth      =  10 ;
        this.worldAlpha =   1;
        this._mask     =   null;

    },
    // position:new Point(),
    // anchor:new Point(),
    // scale:new Point(1,1),
    // pivot:new Point(0, 0),
    // rotation:0,
    // alpha:1,
    // visible:true,
    // renderable:true,
    // enabled:true,
    // depth:0 ,
    // worldAlpha:1,
    // _mask:null,
    updateTransform:function ()
    {

        var pt = this.parent.worldTransform;
        var wt = this.worldTransform;

        var a, b, c, d, tx, ty;

        if (this.rotation % CONST.PI2)
        {
            if (this.rotation !== this.rotationCache)
            {
                this.rotationCache = this.rotation;
                this._sr = Math.sin(this.rotation);
                this._cr = Math.cos(this.rotation);
            }

            a  =  this._cr * this.scale.x;
            b  =  this._sr * this.scale.x;
            c  = -this._sr * this.scale.y;
            d  =  this._cr * this.scale.y;
            tx =  this.position.x;
            ty =  this.position.y;

            if (this.pivot.x || this.pivot.y)
            {
                tx -= this.pivot.x * a + this.pivot.y * c;
                ty -= this.pivot.x * b + this.pivot.y * d;
            }

            wt.a  = a  * pt.a + b  * pt.c;
            wt.b  = a  * pt.b + b  * pt.d;
            wt.c  = c  * pt.a + d  * pt.c;
            wt.d  = c  * pt.b + d  * pt.d;
            wt.tx = tx * pt.a + ty * pt.c + pt.tx;
            wt.ty = tx * pt.b + ty * pt.d + pt.ty;
        }
        else
        {

            a  = this.scale.x;
            d  = this.scale.y;

            tx = this.position.x - this.pivot.x * a;
            ty = this.position.y - this.pivot.y * d;

            wt.a  = a  * pt.a;
            wt.b  = a  * pt.b;
            wt.c  = d  * pt.c;
            wt.d  = d  * pt.d;
            wt.tx = tx * pt.a + ty * pt.c + pt.tx;
            wt.ty = tx * pt.b + ty * pt.d + pt.ty;
        }

        this.worldAlpha = this.alpha * this.parent.worldAlpha;

        this._currentBounds = null;

    },
    // displayObjectUpdateTransform:updateTransform,
    set:fn.set,
    init:function(a){
        message.trigger(this,'init',a);
        return this;
    },
    horizontal: function(a){
        return fn.horizontal.call(this,a);
    },
    vertical:function(a){
        return fn.horizontal.call(this,a);
    },
    autoPosition:function(a){
        if(a.horizontal){
            fn.horizontal.call(this,a.horizontal);
        }
        if(a.vertical){
            fn.vertical.call(this,a.vertical);
        }
        return this;
    },
    animate:function( a , b ){
        this._animate = this._animate||{};
        var arr = [],hok=null,tem;

        if(fn.isA(a)){
            for(var i = a.length-1; i>=0;i--){
                a[i].hok = this;
                tem = new Tween(a[i]);
                if(hok)tem.chain(hok);
                hok = tem;
            }
        }else{
            a.hok = this;
            tem = new Tween(a);
        }
        this._animate[b||miao.uid] = tem;
        tem.start();
        return;
    },
    stop:function( a ){
        if(!this._animate)return;
        if(a&&this._animate[a]){
             this._animate[a].stop();
             this._animate[a] = null;
        }else{
            for(var i in this._animate)this._animate[i].stop();
            this._animate = null;
        }
        return this;
    },
    bind:function(n,b) {

       //  if(!this._listener[n])return;

       //  var root , i ;

       // if(b){

       //      if(!b.__listeners)return;
       //      root = b;

       //  }else{

       //      if(!this.parent)return;

       //      !function cha(_n){

       //          if( _n.__listeners ){ 

       //               root = _n;

       //          }else{

       //              cha( _n.parent );

       //          }
       //      }(this.parent);

       //  }

       if(n){

            message.bind(this,n,b||this.parent);
            b!==false&&this.parent.addInteraction(n);

       }else{

            for(var i in this._listener){

                message.bind(this,i,this.parent);
                b!==false&&this.parent.addInteraction(i);
            }


       }

        


        return this;

    },
    unbind:function(n,b) {

   
        if(!this._listener[n])return;

        var root , i ;

       if(b){

            if(!b.__listeners)return;
            root = b;

        }else{

            !function cha(_n){
                if( _n.__listeners ){ 
                     root = _n;
                }else{
                    cha( _n.parent );
                }
            }(this.parent);

        }

        message.unbind(this,n,root);

        return this;

    },
    addTo:function(v,b) {

        v.addChild(this,b);

        return this;

    },
    removeTo:function(v,b) {

        v.removeChild(this);

        if(b===false)return this;

        if(this._listener)
        for(var j in this._listener)
        if(CONST.DEF_EV.indexOf(j)!=-1)this.unbind(j);
        return this;
        
    },
    on:function(n,b,c){

        message.on(this,n,b);

        //CONST.DEF_EV.indexOf(n)!=-1&&this.bind(n);
        // if(this._listener)
        // for(var j in this._listener)
        // if(CONST.DEF_EV.indexOf(j)!=-1)this.bind(j);
        return this;

    },
    once:function(n,b){

        message.once(this,n,b);
        if(this._listener)
        for(var j in this._listener)
        if(CONST.DEF_EV.indexOf(j)!=-1)this.bind(j);
        return this;
        
    },
    un:function(n){
        message.un(this,n);
        if(this._listener&&CONST.DEF_EV.indexOf(n)!=-1)
        this.bind(n);
        return this;
    },
    inj:function(n,b){
        message.inj(this,n,b);
        return this;
    },
    uninj:function(n){
        message.uinj(this,n);
        return this;
    },
    listener:function(a){
        for(var i in a)this.on(i,a[i]);
        return this;  
    },
    containsPoint:function(){},
    interaction:function(point,name,ops){
        if(!this.enabled)return;
        return this.containsPoint(point)&&message.trigger(this,name,ops);
    },
    getBounds:function (matrix)
    {
        // console.log(this.x,this.y);
        return {x:this.x,y:this.y,width:this.width||1,height:this.height||1};
    },
    getLocalBounds:function ()
    {
        return this.getBounds(Matrix.IDENTITY);
    },
    toGlobal:function (position)
    {
        this.displayObjectUpdateTransform();
        return this.worldTransform.apply(position);
    },
    toLocal:function (position, from)
    {
        if (from)
        {
            position = from.toGlobal(position);
        }
        this.displayObjectUpdateTransform();
        return this.worldTransform.applyInverse(position);
    },
    renderWebGL :function (renderer){},
    renderCanvas:function (renderer){},
    generateTexture:function (renderer, scaleMode, resolution)
    {
        var bounds = this.getLocalBounds();

        var renderTexture = new RenderTexture(renderer, bounds.width | 0, bounds.height | 0, scaleMode, resolution);

        _tempMatrix.tx = -bounds.x;
        _tempMatrix.ty = -bounds.y;

        renderTexture.render(this, _tempMatrix);

        return renderTexture;
    },
    destroy:function ()
    {

        this.position = null;
        this.scale = null;
        this.pivot = null;
        this.parent = null;
        this._bounds = null;
        this._currentBounds = null;
        this._mask = null;

        this.worldTransform = null;
        this.filterArea = null;
    }
},
{
     id: {
        get: function ()
        {
            return this._id;
        },
        set: function (value)
        {
            if(this._id){
                g.objCache[this._id] = null;
                delete g.objCache[this._id];
            }
            this._id = value;
            g.objCache[value]=this;
        }
    },
    x: {
        get: function ()
        {
            return this.position.x;
        },
        set: function (value)
        {
            if(typeof value === 'string')
            value = fn.getPix(value);

            this.position.x = value;
        }
    },

    y: {
        get: function()
        {
            return this.position.y;
        },
        set: function (value)
        {
            if(typeof value === 'string')
            value = fn.getPix(value);
            this.position.y = value;
        }
    },

    anchorX: {
        get: function ()
        {
            return this.anchor.x;
        },
        set: function (value)
        {
            this.anchor.x = value;
        }
    },

    anchorY: {
        get: function ()
        {
            return this.anchor.y;
        },
        set: function (value)
        {
            this.anchor.y = value;
        }
    },

    scaleX: {
        get: function ()
        {
            return this.scale.x;
        },
        set: function (value)
        {
            this.scale.x = value;
        }
    },
    scaleY: {
        get: function ()
        {
            return this.scale.y;
        },
        set: function (value)
        {
            this.scale.y = value;
        }
    },
    worldVisible: {
        get: function ()
        {
            var item = this;
            do {
                if (!item.visible)
                {
                    return false;
                }
                item = item.parent;
            } while (item);

            return true;
        }
    },
    mask: {
        get: function ()
        {
            return this._mask;
        },
        set: function (value)
        {
            if (this._mask)
            {
                this._mask.renderable = true;
            }

            this._mask = value;

            if (this._mask)
            {
                this._mask.renderable = false;
            }
        }
    },
    filters: {
        get: function ()
        {
            return this._filters && this._filters.slice();
        },
        set: function (value)
        {
            this._filters = value && value.slice();
        }
    }
});


DisplayObject.prototype.displayObjectUpdateTransform = DisplayObject.prototype.updateTransform;

var cupdateTransform = function ()
{
    if (!this.visible)
    {
        return;
    }

    this.displayObjectUpdateTransform();

    for (var i = 0, j = this.children.length; i < j; ++i)
    {
        this.children[i].updateTransform();
    }
};

var Layout = _class({
    className:'Layout',
    constructor:function( type  ){
      //  this.
    },
    update:function(){

    },
    gridx:function(){

    },
    gridy:function(){

    },
    gridxy:function(){

    },
    relatie:function(){

    }
});


var layout = {

    horizontal:function( the , startpoint , ops ){


        if(!the.children.length)return;
        ops = ops || {};
        var top = ops.top||0,
            bottom = ops.bottom||0,
            left = ops.left||0,
            right = ops.right||0,
            space = ops.space;

        var ws = [],zw = 0;


            if(!space){

                for(var i=0,l=the.children.length;i<l;i++){
                    ws.push(the.children[i].width);
                    zw+=the.children[i].width;
                    the.children[i].y = top;

                }

                var js = the.width  - left - right - zw;
                space = js/(the.children.length-1);
                
            }

        the.children[0].x = the.x + left;

        for(var i=1,l=the.children.length;i<l;i++){

            the.children[i].x = the.children[i-1].x + space + the.children[i-1].width;
        }
    },
    vertical:function( the , startpoint , ops ){


        if(!the.children.length)return;
        ops = ops || {};
        var top = ops.top||0,
            bottom = ops.bottom||0,
            left = ops.left||0,
            right = ops.right||0,
            space = ops.space;

        var ws = [],zh = 0;


            if(!fn.isN(space)){

                for(var i=0,l=the.children.length;i<l;i++){
                    ws.push(the.children[i].height);
                    zh+=the.children[i].height;
                    the.children[i].x = left;

                }

                var js = the.height  - top - bottom - zh;
                space = js/(the.children.length-1);
                
            }

        the.children[0].y = the.y + top;

        for(var i=1,l=the.children.length;i<l;i++){
            // console.log(the.children[i-1].y + space + the.children[i-1].height);

            the.children[i].y = the.children[i-1].y + space + the.children[i-1].height;
        }
    }

};

miao.layout = layout;

// LAYOUT:{
//     ABSLOUTE:0,
//     RELATIVE:1,
//     GRID_X:2,
//     GRID_Y:3,
//     GRID_XY:4
// }






var Container = _class({
    className:'Container',
    extend:'DisplayObject',
    constructor:function(_super,a){
        _super.call(this);
        this.children = [];
        this.__listeners = {};
        this._items = {};
        this._width = 0;
        this._height = 0;


        if(this instanceof Container)this.set(a);

        
    },
    // layout:CONST.LAYOUT.ABSLOUTE,
    // __layout:false,
    updateLayout:function(){
        //layout.undate(this)
    },
    // layout:function(jx){
    //     var obj;
    //         jx = jx || 0 ;
    //     for (var i = 0, j = this.children.length; i < j; ++i)
    //     {
    //         obj = this.children[i];
    //         if(i==0){
    //             obj.y = this.margin&&this.margin.top||0;
    //             continue;
    //         }

    //         obj.y = this.children[i-1].y + this.children[i-1].height + jx ;


    //     }
    //     if(!this.height)this.height=this.children[this.children.length-1].y+this.children[this.children.length-1].height;

    // },
    addChild:function ( child , b)
    {
        if(this.children.length<1){
            this.children.push(child);
        }else{
            for(var i=this.children.length-1;0<=i;i--){
                if(this.children[i].depth<=child.depth){
                    this.children.splice(i+1,0,child);break;
                }else{
                    if(i==0)this.children.unshift(child);
                }
            }
        }
        child.parent = this;

        if(child.name)this._items[child.name] = child;

        if(b===false)return this;

        if(child._listener){

            for(var j in child._listener)
            if(CONST.DEF_EV.indexOf(j)!=-1)child.bind(j,false);

        }

        if(child.__listeners){

            for(var j in child.__listeners)
            child.addInteraction(j,false);

        } 


        return this;

    },
    items:function (a)
    {

        for(var i=0,l=a.length;i<l;i++){

            if(_class[a[i].xtype])
            this.addChild(new _class[a[i].xtype](a[i]));
        }
        return this;

    },
    getByName:function (n){

       return this._items[n];

    },
    findByName:function (n){
        for(var i=0,l=this.children.length;i<l;i++)
        if(this.children[i].name == n)return this.children[i];
    },
    addChildAt:function (child, index)
    {

        if (child === this)
        {
            return child;
        }

        if (index >= 0 && index <= this.children.length)
        {
            if (child.parent)
            {
                child.parent.removeChild(child);
            }

            child.parent = this;

            this.children.splice(index, 0, child);
            return child;
        }
        else
        {
            throw new Error(child + 'addChildAt: The index '+ index +' supplied is out of bounds ' + this.children.length);
        }
    },
    swapChildren:function (child, child2)
    {
        if (child === child2)
        {
            return;
        }

        var index1 = this.getChildIndex(child);
        var index2 = this.getChildIndex(child2);

        if (index1 < 0 || index2 < 0)
        {
            throw new Error('swapChildren: Both the supplied DisplayObjects must be children of the caller.');
        }

        this.children[index1] = child2;
        this.children[index2] = child;
    },
    getChildIndex:function (child)
    {
        var index = this.children.indexOf(child);

        if (index === -1)
        {
            throw new Error('The supplied DisplayObject must be a child of the caller');
        }

        return index;
    },
    setChildIndex:function (child, index)
    {
        if (index < 0 || index >= this.children.length)
        {
            throw new Error('The supplied index is out of bounds');
        }

        var currentIndex = this.getChildIndex(child);

        this.children.splice(currentIndex, 1); //remove from old position
        this.children.splice(index, 0, child); //add at new position
    },
    getChildAt:function (index)
    {
        if (index < 0 || index >= this.children.length)
        {
            throw new Error('getChildAt: Supplied index ' + index + ' does not exist in the child list, or the supplied DisplayObject is not a child of the caller');
        }

        return this.children[index];
    },
    removeChild:function (child)
    {
        var index = this.children.indexOf(child);

        if (index === -1)
        {
            return;
        }

        return this.removeChildAt(index);
    },
    removeChildAt:function (index)
    {
        var child = this.getChildAt(index);

        child.parent = null;
        this.children.splice(index, 1);

        return child;
    },
    removeChildren:function (beginIndex, endIndex)
    {
        var begin = beginIndex || 0;
        var end = typeof endIndex === 'number' ? endIndex : this.children.length;
        var range = end - begin;

        if (range > 0 && range <= end)
        {
            var removed = this.children.splice(begin, range);

            for (var i = 0; i < removed.length; ++i)
            {
                removed[i].parent = null;
            }

            return removed;
        }
        else if (range === 0 && this.children.length === 0)
        {
            return [];
        }
        else
        {
            throw new RangeError('removeChildren: numeric values are outside the acceptable range.');
        }
    },
    generateTexture:function (renderer, resolution, scaleMode)
    {

        var bounds = this.getLocalBounds();
        var renderTexture = new RenderTexture( renderer , bounds.width | 0, bounds.height | 0, renderer, scaleMode, resolution);
        _tempMatrix.tx = -bounds.x;
        _tempMatrix.ty = -bounds.y;
        renderTexture.render(this, _tempMatrix);
        return renderTexture;

    },
    updateTransform:cupdateTransform,
    containerUpdateTransform:cupdateTransform,
    containsPoint:function(point){

        this.worldTransform.applyInverse(point,tempPoint);
        var width = this._width;
        var height = this._height;
        var x1 = -width * this.anchor.x;
        var y1;

        if ( tempPoint.x > x1 && tempPoint.x < x1 + width )
        {
            y1 = -height * this.anchor.y;

            if ( tempPoint.y > y1 && tempPoint.y < y1 + height )
            {
                return true;
            }
        }
        return false;
    },
    //交互时间处理函数
    interaction:function(point,name,ops){ 

        // console.log('interaction1');

        if(!this.enabled)return;

        // console.log('interaction2');


        if(this._listener&&this._listener[name]&&this.containsPoint(point)&&
        message.trigger(this,name))return true;
        var ax = this.children,obj;

        for(var i = ax.length-1;i>=0;i--){
            if(ax[i].interaction(miao.event.now,name,ops))
            return true;
        }
    },
    //添加交互事件
    addInteraction:function(n,b){

        b!==false&&this.parent.addInteraction(n);

        message.bind(this,n,this.parent);
        return this;

    },
    getBounds:function ()
    {
        if(!this._currentBounds)
        {

            if (this.children.length === 0)
            {
                return Rectangle.EMPTY;
            }

           
            var minX = Infinity;
            var minY = Infinity;

            var maxX = -Infinity;
            var maxY = -Infinity;

            var childBounds;
            var childMaxX;
            var childMaxY;

            var childVisible = false;

            for (var i = 0, j = this.children.length; i < j; ++i)
            {
                var child = this.children[i];

                if (!child.visible)
                {
                    continue;
                }

                childVisible = true;

                childBounds = this.children[i].getBounds();

                minX = minX < childBounds.x ? minX : childBounds.x;
                minY = minY < childBounds.y ? minY : childBounds.y;

                childMaxX = childBounds.width + childBounds.x;
                childMaxY = childBounds.height + childBounds.y;

                maxX = maxX > childMaxX ? maxX : childMaxX;
                maxY = maxY > childMaxY ? maxY : childMaxY;

                // console.log(childBounds.y,childBounds.height);
            }

            if (!childVisible)
            {
                return Rectangle.EMPTY;
            }

            var bounds = this._bounds;

            bounds.x = minX;
            bounds.y = minY;
            bounds.width = maxX - minX;
            bounds.height = maxY - minY;

            this._currentBounds = bounds;
        }

        return this._currentBounds;
    },
    getLocalBounds:function ()
    {
        var matrixCache = this.worldTransform;

        this.worldTransform = _class.Matrix.IDENTITY;

        for (var i = 0, j = this.children.length; i < j; ++i)
        {
            this.children[i].updateTransform();
        }

        this.worldTransform = matrixCache;

        this._currentBounds = null;

        return this.getBounds( _class.Matrix.IDENTITY );
    },
    renderWebGL:function (renderer)
    {

        if (!this.visible || this.worldAlpha <= 0 || !this.renderable)
        {
            return;
        }

        if(this.__layout){
            this.updateLayout();
            this.__layout = false;
        }

        var i, j;

        if (this._mask || this._filters)
        {
            renderer.currentRenderer.flush();

            if (this._filters)
            {
                renderer.filterManager.pushFilter(this, this._filters);
            }

            if (this._mask)
            {
                renderer.maskManager.pushMask(this, this._mask);
            }

            renderer.currentRenderer.start();

            this._renderWebGL(renderer);

            for (i = 0, j = this.children.length; i < j; i++)
            {
                this.children[i].renderWebGL(renderer);
            }

            renderer.currentRenderer.flush();

            if (this._mask)
            {
                renderer.maskManager.popMask(this, this._mask);
            }

            if (this._filters)
            {
                renderer.filterManager.popFilter();

            }
            renderer.currentRenderer.start();
        }
        else
        {
            this._renderWebGL(renderer);

            for (i = 0, j = this.children.length; i < j; ++i)
            {
                this.children[i].renderWebGL(renderer);
            }
        }
    },
    _renderWebGL :function (renderer){},
    _renderCanvas: function (renderer){},
    renderCanvas:function (renderer)
    {
        if (!this.visible || this.alpha <= 0 || !this.renderable)
        {
            return;
        }

        if (this._mask)
        {
            renderer.maskManager.pushMask(this._mask, renderer);
        }

        this._renderCanvas(renderer);
        for (var i = 0, j = this.children.length; i < j; ++i)
        {
            this.children[i].renderCanvas(renderer);
        }

        if (this._mask)
        {
            renderer.maskManager.popMask(renderer);
        }
    },
    destroy:function (destroyChildren)
    {
        DisplayObject.prototype.destroy.call(this);

        if (destroyChildren)
        {
            for (var i = 0, j = this.children.length; i < j; ++i)
            {
                this.children[i].destroy(destroyChildren);
            }
        }
        
        this.removeChildren();
        this.children = null;
        this._items  = null;
    }
},{
   // layout:CONST.LAYOUT.ABSLOUTE,

    layout: {
        get: function ()
        {
            return this.__layout||false;
        },
        set: function (value)
        {
            this._layout = value;
            if(value)this.__layout = true;
        },
        enumerable: true,
        configurable: true
    },
    width: {
        get: function ()
        {
            return this._width;
        },
        set: function (value)
        {
            if(typeof value === 'string')
            value = fn.getPix(value);
            this._width = value;
        },
        enumerable: true,
        configurable: true
    },

    height: {
        get: function ()
        {
            return  this._height;
        },
        set: function (value)
        {
            if(typeof value === 'string')
            value = fn.getPix(value);
            this._height = value;
        },
        enumerable: true,
        configurable: true
    }
}
/*,{
   
    width: {
        get: function ()
        {

            return this._width;
            return this.scale.x * this.getLocalBounds().width;
        },
        set: function (value)
        {

            if(typeof value === 'string')
            value = fn.getPix(value);
            console.log('set',value);
            var width = this.getLocalBounds().width;

            if (width !== 0)
            {
                this.scale.x = value / width;
            }
            else
            {
                this.scale.x = 1;
            }


            this._width = value;
        },
        enumerable: true,
        configurable: true
    },

    height: {
        get: function ()
        {
            return  this._height;
            return  this.scale.y * this.getLocalBounds().height;
        },
        set: function (value)
        {
            if(typeof value === 'string')
            value = fn.getPix(value);

            var height = this.getLocalBounds().height;

            if (height !== 0)
            {
                this.scale.y = value / height ;
            }
            else
            {
                this.scale.y = 1;
            }

            this._height = value;
        },
        enumerable: true,
        configurable: true
    }
}*/
);

Container.prototype.containerGetBounds = Container.prototype.getBounds;



var Mesh = _class({
    className:'Mesh',
    extend:'Container',
    constructor:function(_super , texture , vertices, uvs, indices, drawMode){

        _super.call(this);
        /**
         * Mesh 纹理
         *
         * @member {Texture}
         * @private
         */
        this._texture = null;

        /**
         * Mesh Uvs
         *
         * @member {Float32Array}
         */
        this.uvs = uvs || new Float32Array([0, 1,
                                     1, 1,
                                     1, 0,
                                     0, 1]);

        /**
         * Mesh vertices
         *
         * @member {Float32Array}
         */
        this.vertices = vertices || new Float32Array([0, 0,
                                          100, 0,
                                          100, 100,
                                          0, 100]);

        /*
         * @member {Uint16Array}  vertices 的 indices 
         */
        this.indices = indices || new Uint16Array([0, 1, 2, 3]);

        /**
         * 网络是否需要更新
         *
         * @member {boolean}
         */
        this.dirty = true;

        /**
         * BLEND_MODES
         *
         * @member {number}
         * @default CONST.BLEND_MODES.NORMAL;
         */
        this.blendMode = CONST.BLEND_MODES.NORMAL;

        /**
         * canvas 下自动行抗锯齿，强制三角形重叠。
         *
         * @member {number}
         */
        this.canvasPadding = 0;

        /**
         * 绘制方法中的类型。三角形 或 三角形带。
         *
         * @member {number}
         */
        this.drawMode = drawMode || Mesh.DRAW_MODES.TRIANGLE_MESH;

        
        this.texture = texture;

    },
    _renderWebGL:function (renderer)
    {
        renderer.setObjectRenderer(renderer.plugins.mesh);
        renderer.plugins.mesh.render(this);
    },
    _renderCanvas:function (renderer)
    {
        var context = renderer.context;

        var transform = this.worldTransform;

        if (renderer.roundPixels)
        {
            context.setTransform(transform.a, transform.b, transform.c, transform.d, transform.tx | 0, transform.ty | 0);
        }
        else
        {
            context.setTransform(transform.a, transform.b, transform.c, transform.d, transform.tx, transform.ty);
        }

        if (this.drawMode === Mesh.DRAW_MODES.TRIANGLE_MESH)
        {
            this._renderCanvasTriangleMesh(context);
        }
        else
        {
            this._renderCanvasTriangles(context);
        }
    },

    /**
     * 使用canvas三角形网络
     * 
     * @param context {CanvasRenderingContext2D}
     * @private
     */
    _renderCanvasTriangleMesh:function (context)
    {
        // draw triangles!!
        var vertices = this.vertices;
        var uvs = this.uvs;

        var length = vertices.length / 2;
        // this.count++;

        for (var i = 0; i < length - 2; i++)
        {
            // draw some triangles!
            var index = i * 2;
            this._renderCanvasDrawTriangle(context, vertices, uvs, index, (index + 2), (index + 4));
        }
    },
    /**
     * canvas 绘制三角形
     *
     * @param context {CanvasRenderingContext2D} 
     * @private
     */
    _renderCanvasTriangles:function (context)
    {
        var vertices = this.vertices;
        var uvs = this.uvs;
        var indices = this.indices;

        var length = indices.length;
        // this.count++;

        for (var i = 0; i < length; i += 3)
        {
            var index0 = indices[i] * 2, index1 = indices[i + 1] * 2, index2 = indices[i + 2] * 2;
            this._renderCanvasDrawTriangle(context, vertices, uvs, index0, index1, index2);
        }
    },

/**
 * 绘制组成该网络的一个三角形
 *
 * @param context {CanvasRenderingContext2D}
 * @param vertices {Float32Array} 
 * @param uvs {Float32Array}
 * @param index0 {number} the index of the first vertex
 * @param index1 {number} the index of the second vertex
 * @param index2 {number} the index of the third vertex
 * @private
 */
    _renderCanvasDrawTriangle:function (context, vertices, uvs, index0, index1, index2)
    {
        var textureSource = this._texture.baseTexture.source;
        var textureWidth = this._texture.baseTexture.width;
        var textureHeight = this._texture.baseTexture.height;

        var x0 = vertices[index0], x1 = vertices[index1], x2 = vertices[index2];
        var y0 = vertices[index0 + 1], y1 = vertices[index1 + 1], y2 = vertices[index2 + 1];

        var u0 = uvs[index0] * textureWidth, u1 = uvs[index1] * textureWidth, u2 = uvs[index2] * textureWidth;
        var v0 = uvs[index0 + 1] * textureHeight, v1 = uvs[index1 + 1] * textureHeight, v2 = uvs[index2 + 1] * textureHeight;

        if (this.canvasPadding > 0)
        {
            var paddingX = this.canvasPadding / this.worldTransform.a;
            var paddingY = this.canvasPadding / this.worldTransform.d;
            var centerX = (x0 + x1 + x2) / 3;
            var centerY = (y0 + y1 + y2) / 3;

            var normX = x0 - centerX;
            var normY = y0 - centerY;

            var dist = Math.sqrt(normX * normX + normY * normY);
            x0 = centerX + (normX / dist) * (dist + paddingX);
            y0 = centerY + (normY / dist) * (dist + paddingY);

            //

            normX = x1 - centerX;
            normY = y1 - centerY;

            dist = Math.sqrt(normX * normX + normY * normY);
            x1 = centerX + (normX / dist) * (dist + paddingX);
            y1 = centerY + (normY / dist) * (dist + paddingY);

            normX = x2 - centerX;
            normY = y2 - centerY;

            dist = Math.sqrt(normX * normX + normY * normY);
            x2 = centerX + (normX / dist) * (dist + paddingX);
            y2 = centerY + (normY / dist) * (dist + paddingY);
        }

        context.save();
        context.beginPath();


        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.lineTo(x2, y2);

        context.closePath();

        context.clip();

        // Compute matrix transform
        var delta =  (u0 * v1)      + (v0 * u2)      + (u1 * v2)      - (v1 * u2)      - (v0 * u1)      - (u0 * v2);
        var deltaA = (x0 * v1)      + (v0 * x2)      + (x1 * v2)      - (v1 * x2)      - (v0 * x1)      - (x0 * v2);
        var deltaB = (u0 * x1)      + (x0 * u2)      + (u1 * x2)      - (x1 * u2)      - (x0 * u1)      - (u0 * x2);
        var deltaC = (u0 * v1 * x2) + (v0 * x1 * u2) + (x0 * u1 * v2) - (x0 * v1 * u2) - (v0 * u1 * x2) - (u0 * x1 * v2);
        var deltaD = (y0 * v1)      + (v0 * y2)      + (y1 * v2)      - (v1 * y2)      - (v0 * y1)      - (y0 * v2);
        var deltaE = (u0 * y1)      + (y0 * u2)      + (u1 * y2)      - (y1 * u2)      - (y0 * u1)      - (u0 * y2);
        var deltaF = (u0 * v1 * y2) + (v0 * y1 * u2) + (y0 * u1 * v2) - (y0 * v1 * u2) - (v0 * u1 * y2) - (u0 * y1 * v2);

        context.transform(deltaA / delta, deltaD / delta,
            deltaB / delta, deltaE / delta,
            deltaC / delta, deltaF / delta);

        context.drawImage(textureSource, 0, 0);
        context.restore();
    },

    /**
     * 渲染一个平面网络
     *
     * @param Mesh {Mesh}
     * @private
     */
    renderMeshFlat:function (Mesh)
    {
        var context = this.context;
        var vertices = Mesh.vertices;

        var length = vertices.length/2;
        // this.count++;

        context.beginPath();
        for (var i=1; i < length-2; i++)
        {
            // draw some triangles!
            var index = i*2;

            var x0 = vertices[index],   x1 = vertices[index+2], x2 = vertices[index+4];
            var y0 = vertices[index+1], y1 = vertices[index+3], y2 = vertices[index+5];

            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
            context.lineTo(x2, y2);
        }

        context.fillStyle = '#FF0000';
        context.fill();
        context.closePath();
    },
    _onTextureUpdate:function ()
    {
        this.updateFrame = true;
    },

    /**
     * 返回该网络的边界
     *
     * @param matrix {Matrix} 
     * @return {Rectangle} 
     */
    getBounds:function (matrix)
    {
        var worldTransform = matrix || this.worldTransform;

        var a = worldTransform.a;
        var b = worldTransform.b;
        var c = worldTransform.c;
        var d = worldTransform.d;
        var tx = worldTransform.tx;
        var ty = worldTransform.ty;

        var maxX = -Infinity;
        var maxY = -Infinity;

        var minX = Infinity;
        var minY = Infinity;

        var vertices = this.vertices;
        for (var i = 0, n = vertices.length; i < n; i += 2)
        {
            var rawX = vertices[i], rawY = vertices[i + 1];
            var x = (a * rawX) + (c * rawY) + tx;
            var y = (d * rawY) + (b * rawX) + ty;

            minX = x < minX ? x : minX;
            minY = y < minY ? y : minY;

            maxX = x > maxX ? x : maxX;
            maxY = y > maxY ? y : maxY;
        }

        if (minX === -Infinity || maxY === Infinity)
        {
            return core.math.Rectangle.EMPTY;
        }

        var bounds = this._bounds;

        bounds.x = minX;
        bounds.width = maxX - minX;

        bounds.y = minY;
        bounds.height = maxY - minY;

        this._currentBounds = bounds;

        return bounds;
    }

},{
    texture: {
        get: function ()
        {
            return  this._texture;
        },
        set: function (value)
        {
            if (this._texture === value)
            {
                return;
            }

            this._texture = value;

            if (value)
            {
                if (value.baseTexture.hasLoaded)
                {
                    this._onTextureUpdate();
                }
                else
                {
                    value.once('update', this._onTextureUpdate , this) ;
                }
            }
        }
    }

});


/**
 * 绘制模型
 *
 * @static
 * @constant
 * @property {object} DRAW_MODES
 * @property {number} DRAW_MODES.TRIANGLE_MESH
 * @property {number} DRAW_MODES.TRIANGLES
 */
Mesh.DRAW_MODES = {
    TRIANGLE_MESH: 0,
    TRIANGLES: 1
};




var CanvasTinter = {

getTintedTexture:function (sprite, color)
{
    var texture = sprite.texture;

    color = CanvasTinter.roundColor(color);

    var stringColor = '#' + ('00000' + ( color | 0).toString(16)).substr(-6);

    texture.tintCache = texture.tintCache || {};

    if (texture.tintCache[stringColor])
    {
        return texture.tintCache[stringColor];
    }

    var canvas = CanvasTinter.canvas || document.createElement('canvas');

    CanvasTinter.tintMethod(texture, color, canvas);

    if (CanvasTinter.convertTintToImage)
    {
        var tintImage = new Image();
        tintImage.src = canvas.toDataURL();

        texture.tintCache[stringColor] = tintImage;
    }
    else
    {
        texture.tintCache[stringColor] = canvas;
        CanvasTinter.canvas = null;
    }

    return canvas;
},
tintWithMultiply:function (texture, color, canvas)
{
    var context = canvas.getContext( '2d' );

    var crop = texture.crop;

    canvas.width = crop.width;
    canvas.height = crop.height;

    context.fillStyle = '#' + ('00000' + ( color | 0).toString(16)).substr(-6);

    context.fillRect(0, 0, crop.width, crop.height);

    context.globalCompositeOperation = 'multiply';

    context.drawImage(
        texture.baseTexture.source,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
    );

    context.globalCompositeOperation = 'destination-atop';

    context.drawImage(
        texture.baseTexture.source,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
    );
},
tintWithOverlay:function (texture, color, canvas)
{
    var context = canvas.getContext( '2d' );

    var crop = texture.crop;

    canvas.width = crop.width;
    canvas.height = crop.height;

    context.globalCompositeOperation = 'copy';
    context.fillStyle = '#' + ('00000' + ( color | 0).toString(16)).substr(-6);
    context.fillRect(0, 0, crop.width, crop.height);

    context.globalCompositeOperation = 'destination-atop';
    context.drawImage(
        texture.baseTexture.source,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
    );

},
tintWithPerPixel:function (texture, color, canvas)
{
    var context = canvas.getContext( '2d' );

    var crop = texture.crop;

    canvas.width = crop.width;
    canvas.height = crop.height;

    context.globalCompositeOperation = 'copy';
    context.drawImage(
        texture.baseTexture.source,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
    );

    var rgbValues = utils.hex2rgb(color);
    var r = rgbValues[0], g = rgbValues[1], b = rgbValues[2];

    var pixelData = context.getImageData(0, 0, crop.width, crop.height);

    var pixels = pixelData.data;

    for (var i = 0; i < pixels.length; i += 4)
    {
        pixels[i+0] *= r;
        pixels[i+1] *= g;
        pixels[i+2] *= b;
    }

    context.putImageData(pixelData, 0, 0);
},
roundColor:function (color)
{
    var step = CanvasTinter.cacheStepsPerColorChannel;

    var rgbValues = utils.hex2rgb(color);

    rgbValues[0] = Math.min(255, (rgbValues[0] / step) * step);
    rgbValues[1] = Math.min(255, (rgbValues[1] / step) * step);
    rgbValues[2] = Math.min(255, (rgbValues[2] / step) * step);

    return utils.rgb2hex(rgbValues);
},
cacheStepsPerColorChannel:8,
convertTintToImage:false,
canUseMultiply:utils.canUseNewCanvasBlendModes()

};

CanvasTinter.tintMethod = CanvasTinter.canUseMultiply ? CanvasTinter.tintWithMultiply :  CanvasTinter.tintWithPerPixel;



var Sprite, _Image = Sprite = _class({
    className:'Image',
    extend:'DisplayObject',
    constructor:function( _super , a ){

        _super.call(this);

        a = a || {} ;

        this._width = 0;

        this._height = 0;

        this.tint = 0xffffff;

        this.blendMode = CONST.BLEND_MODES.NORMAL;

        this.shader = null;

        this.cachedTint = 0xffffff;

        this._image = null;

        this._texture = null;

        this.adapt = ''; //类型

        if(a.texture){

            this.texture = a.texture;

            a.texture = null;

            delete a.texture;

        }else{

            if(a.image){

                var _im = fn.isS(a.image) ? miao.R.getImage( a.image ) : a.image;

                this.texture = new _class.Texture(new _class.BaseTexture(_im));

                a.image = null;
                delete a.image;

            }else{

                this.texture = new _class.Texture(new _class.BaseTexture(new Image()));
                this.load(a.src||CONST.DEF_IMG_SRC);
            }
        }

        if(this instanceof _Image)this.set(a);

    },
    load:function(url){
        this._texture.baseTexture.updateSourceImage(url);
        return this;
    },
    horizontal:function(a){
        var x = fn.horizontal(this,this.parent,'center');
        this.x = x;
        return this;
    },
    _onTextureUpdate:function ()
    {
       
        if (this._width)
        {
            this.scale.x = this._width / this.texture.frame.width;
        }

        if (this._height)
        {
            this.scale.y = this._height / this.texture.frame.height;
        }
    },
    auto:function(a){


        if(a.w && typeof a.w === 'string')
            a.w = fn.getPix(a.w);
        if(a.h && typeof a.h === 'string')
            a.h = fn.getPix(a.h);
        var wh = fn.usRatio(a,this._texture.baseTexture.source);
        this.width = wh.w;
        this.height = wh.h;
        return this;
    },
    _renderWebGL:function (renderer)
    {
        renderer.setObjectRenderer(renderer.plugins.sprite);
        renderer.plugins.sprite.render(this);
    },
    renderWebGL:function (renderer)
    {

        if (!this.visible || this.worldAlpha <= 0 || !this.renderable)
        {
            return;
        }

        var i, j;

        if (this._mask || this._filters)
        {
            renderer.currentRenderer.flush();

            if (this._filters)
            {
                renderer.filterManager.pushFilter(this, this._filters);
            }

            if (this._mask)
            {
                renderer.maskManager.pushMask(this, this._mask);
            }

            renderer.currentRenderer.start();

            this._renderWebGL(renderer);

            renderer.currentRenderer.flush();

            if (this._mask)
            {
                renderer.maskManager.popMask(this, this._mask);
            }

            if (this._filters)
            {
                renderer.filterManager.popFilter();

            }
            renderer.currentRenderer.start();
        }
        else
        {
            this._renderWebGL(renderer);
        }
    },
    renderCanvas:function (renderer)
    {
        if (!this.visible || this.alpha <= 0 || !this.renderable)
        {
            return;
        }

        if (this._mask)
        {
            renderer.maskManager.pushMask(this._mask, renderer);
        }

        this._renderCanvas(renderer);

        if (this._mask)
        {
            renderer.maskManager.popMask(renderer);
        }
    },
    _renderCanvas:function (renderer)
    {
        if (this.texture.crop.width <= 0 || this.texture.crop.height <= 0)
        {
            return;
        }

        if (this.blendMode !== renderer.currentBlendMode)
        {
            renderer.currentBlendMode = this.blendMode;
            renderer.context.globalCompositeOperation = renderer.blendModes[renderer.currentBlendMode];
        }

        if (this.texture.valid)
        {
            var texture = this._texture,
                wt = this.worldTransform,
                dx,
                dy,
                width,
                height;

            renderer.context.globalAlpha = this.worldAlpha;

            if (renderer.smoothProperty && renderer.currentScaleMode !== texture.baseTexture.scaleMode)
            {
                renderer.currentScaleMode = texture.baseTexture.scaleMode;
                renderer.context[renderer.smoothProperty] = (renderer.currentScaleMode === CONST.SCALE_MODES.LINEAR);
            }


            if(texture.rotate)
            {

                var a = wt.a;
                var b = wt.b;

                wt.a  = -wt.c;
                wt.b  = -wt.d;
                wt.c  =  a;
                wt.d  =  b;

                width = texture.crop.height;
                height = texture.crop.width;

                dx = (texture.trim) ? texture.trim.y - this.anchor.y * texture.trim.height : this.anchor.y * -texture._frame.height;
                dy = (texture.trim) ? texture.trim.x - this.anchor.x * texture.trim.width : this.anchor.x * -texture._frame.width;
            }
            else
            {
                width = texture.crop.width;
                height = texture.crop.height;

                dx = (texture.trim) ? texture.trim.x - this.anchor.x * texture.trim.width : this.anchor.x * -texture._frame.width;
                dy = (texture.trim) ? texture.trim.y - this.anchor.y * texture.trim.height : this.anchor.y * -texture._frame.height;
            }

            if (renderer.roundPixels)
            {
                renderer.context.setTransform(
                    wt.a,
                    wt.b,
                    wt.c,
                    wt.d,
                    (wt.tx * renderer.resolution) | 0,
                    (wt.ty * renderer.resolution) | 0
                );

                dx = dx | 0;
                dy = dy | 0;
            }
            else
            {

                renderer.context.setTransform(
                    wt.a,
                    wt.b,
                    wt.c,
                    wt.d,
                    wt.tx * renderer.resolution,
                    wt.ty * renderer.resolution
                );


            }

            var resolution = texture.baseTexture.resolution;

            if (this.tint !== 0xFFFFFF)
            {
                if (this.cachedTint !== this.tint)
                {
                    this.cachedTint = this.tint;

                    this.tintedTexture = CanvasTinter.getTintedTexture(this, this.tint);
                }

                renderer.context.drawImage(
                    this.tintedTexture,
                    0,
                    0,
                    width * resolution,
                    height * resolution,
                    dx * renderer.resolution,
                    dy * renderer.resolution,
                    width * renderer.resolution,
                    height * renderer.resolution
                );
            }
            else
            {
                renderer.context.drawImage(
                    texture.baseTexture.source,
                    texture.crop.x * resolution,
                    texture.crop.y * resolution,
                    width * resolution,
                    height * resolution,
                    dx  * renderer.resolution,
                    dy  * renderer.resolution,
                    width * renderer.resolution,
                    height * renderer.resolution
                );
            }
        }
    },
    getBounds:function (matrix)
    {
        if(!this._currentBounds)
        {

            var width = this._texture._frame.width;
            var height = this._texture._frame.height;

            var w0 = width * (1-this.anchor.x);
            var w1 = width * -this.anchor.x;

            var h0 = height * (1-this.anchor.y);
            var h1 = height * -this.anchor.y;

            var worldTransform = matrix || this.worldTransform ;

            var a = worldTransform.a;
            var b = worldTransform.b;
            var c = worldTransform.c;
            var d = worldTransform.d;
            var tx = worldTransform.tx;
            var ty = worldTransform.ty;

            var minX,
                maxX,
                minY,
                maxY;


            if (b === 0 && c === 0)
            {
                if (a < 0)
                {
                    a *= -1;
                }

                if (d < 0)
                {
                    d *= -1;
                }

                minX = a * w1 + tx;
                maxX = a * w0 + tx;
                minY = d * h1 + ty;
                maxY = d * h0 + ty;
            }
            else
            {
                var x1 = a * w1 + c * h1 + tx;
                var y1 = d * h1 + b * w1 + ty;

                var x2 = a * w0 + c * h1 + tx;
                var y2 = d * h1 + b * w0 + ty;

                var x3 = a * w0 + c * h0 + tx;
                var y3 = d * h0 + b * w0 + ty;

                var x4 =  a * w1 + c * h0 + tx;
                var y4 =  d * h0 + b * w1 + ty;

                minX = x1;
                minX = x2 < minX ? x2 : minX;
                minX = x3 < minX ? x3 : minX;
                minX = x4 < minX ? x4 : minX;

                minY = y1;
                minY = y2 < minY ? y2 : minY;
                minY = y3 < minY ? y3 : minY;
                minY = y4 < minY ? y4 : minY;

                maxX = x1;
                maxX = x2 > maxX ? x2 : maxX;
                maxX = x3 > maxX ? x3 : maxX;
                maxX = x4 > maxX ? x4 : maxX;

                maxY = y1;
                maxY = y2 > maxY ? y2 : maxY;
                maxY = y3 > maxY ? y3 : maxY;
                maxY = y4 > maxY ? y4 : maxY;
            }

            // if(this.children.length)
            // {
            //     var childBounds = this.containerGetBounds();

            //     w0 = childBounds.x;
            //     w1 = childBounds.x + childBounds.width;
            //     h0 = childBounds.y;
            //     h1 = childBounds.y + childBounds.height;

            //     minX = (minX < w0) ? minX : w0;
            //     minY = (minY < h0) ? minY : h0;

            //     maxX = (maxX > w1) ? maxX : w1;
            //     maxY = (maxY > h1) ? maxY : h1;
            // }

            var bounds = this._bounds;

            bounds.x = minX;
            bounds.width = maxX - minX;

            bounds.y = minY;
            bounds.height = maxY - minY;

            //避免重新计算
            this._currentBounds = {x:this.x,y:this.y,width:this.width,height:this.height};
        }

        return this._currentBounds;
    },
    getLocalBounds:function ()
    {
        this._bounds.x = -this._texture._frame.width * this.anchor.x;
        this._bounds.y = -this._texture._frame.height * this.anchor.y;
        this._bounds.width = this._texture._frame.width;
        this._bounds.height = this._texture._frame.height;
        return this._bounds;
    },
    containsPoint:function( point )
    {
        this.worldTransform.applyInverse(point,tempPoint);
        var width = this._texture._frame.width;
        var height = this._texture._frame.height;
        var x1 = -width * this.anchor.x;
        var y1;

        if ( tempPoint.x > x1 && tempPoint.x < x1 + width )
        {
            y1 = -height * this.anchor.y;

            if ( tempPoint.y > y1 && tempPoint.y < y1 + height )
            {
                return true;
            }
        }

        return false;
    },
    destroy:function (destroyTexture, destroyBaseTexture)
    {
        Container.prototype.destroy.call(this);

        this.anchor = null;

        if (destroyTexture)
        {
            this._texture.destroy(destroyBaseTexture);
        }

        this._texture = null;
        this.shader = null;
    }
},{ 

    width: {

        get: function () {

            return this.scale.x * this.texture._frame.width;
        },

        set: function (value) {
            if(typeof value === 'string')
            value = fn.getPix(value);
            this.scale.x = value / this.texture._frame.width;
            this._width = value;
        },
        enumerable: true,
        configurable: true
    },

    height: {
        get: function ()
        {
            return  this.scale.y * this.texture._frame.height;
        },
        set: function ( value )
        {
            if(typeof value === 'string')
            value = fn.getPix(value);
            this.scale.y = value / this.texture._frame.height;
            this._height = value;
        },
        enumerable: true,
        configurable: true
    },
    texture: {
        get: function ()
        {
            return  this._texture;
        },
        set: function (value)
        {
           
            if (this._texture === value)
            {
                return;
            }

            this._texture = value;

            this.cachedTint = 0xFFFFFF;

            if (value)
            {
                if (value.baseTexture.hasLoaded)
                {
                    this._onTextureUpdate();
                }
                else
                {
                    message.once(value,'update',this._onTextureUpdate.bind(this));
                }
            }
        }
    },
    image:{
        get:function(){
            return this._texture.baseTexture.source;
        },
        set:function(v){

            var _im = fn.isS(v) ? miao.R.getImage(v) : v ;

            // this.texture = new _class.Texture(new _class.BaseTexture(_im));

            this._texture.baseTexture.loadSource(_im);
        }
    }
});

_class['Sprite'] = Sprite;

var Template = _class({
    className:'Template',
    extend:'Image',
    constructor:function(_super , a ){
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.resolution = a.resolution || CONST.RESOLUTION;
        this._text = null;
       
        var texture = Texture.fromCanvas(this.canvas);

        texture.trim = new Rectangle();

        _super.call(this,{texture:texture});

        this.dirty = false;

        if(this instanceof Template)this.set(a);
    },
    updateTemp:function(){

    }
});

var Text = _class({

    className:'Text',
    extend:'Image',
    constructor:function(_super,a){

        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.resolution = a.resolution || CONST.RESOLUTION;
        this._text = null;
       
        var texture = Texture.fromCanvas(this.canvas);

        texture.trim = new Rectangle();

        _super.call(this,{texture:texture});

        this.dirty = false;

        if(this instanceof Text)this.set(a);
    },

    font:'Arial',
    color:'#333',
    stroke:false,
    strokeColor:'black',
    dropShadowColor:'＃333',
    align:'left',
    size:CONST.WIDTH*.05,
    strokeThickness:0,

    wordWrap:false,
    wordWrapWidth:CONST.WIDTH,

    shadow:false,
    shadowColor:'#000',
    shadowAngle:Math.PI / 6,
    shadowDistance:5,
    padding:0,
    textBaseline:'alphabetic',
    lineJoin:'miter',
    miterLimit:10,

    lineHeight:0,

    tyle:"normal",
    variant:"normal",
    weight:"normal",

    updateText:function ()
    {
        var _font = this.tyle+" "+this.variant+" "+this.weight+" "+ this.size+"px "+this.font;

        this.context.font = _font;

        var outputText = this.wordWrap ? this._wordWrap(this._text) : this._text;

        var lines = outputText.split(/(?:\r\n|\r|\n)/);

        var lineWidths = new Array(lines.length);
        var maxLineWidth = 0;
        var fontProperties = this.determineFontProperties(_font);
        for (var i = 0; i < lines.length; i++)
        {
            var lineWidth = this.context.measureText(lines[i]).width;
            lineWidths[i] = lineWidth;
            maxLineWidth = Math.max(maxLineWidth, lineWidth);
        }

        var width = maxLineWidth + this.strokeThickness;

        if (this.shadow)
        {
            width += this.shadowDistance;
        }

        this.canvas.width = ( width + this.context.lineWidth ) * this.resolution;

        var lineHeight = this.lineHeight || fontProperties.fontSize + this.strokeThickness;

        var height = lineHeight * lines.length;
        if (this.shadow)
        {
            height += this.shadowDistance;
        }

        this.canvas.height = ( height + this.padding * 2 ) * this.resolution;

        this.context.scale( this.resolution, this.resolution);

        if (navigator.isCocoonJS){

            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        }

        this.context.font = this.tyle+" "+this.variant+" "+this.weight+" "+ this.size+"px "+this.font;
        this.context.strokeStyle = this.stroke;
        this.context.lineWidth = this.strokeThickness;
        this.context.textBaseline = this.textBaseline;
        this.context.lineJoin = this.lineJoin;
        this.context.miterLimit = this.miterLimit;

        var linePositionX;
        var linePositionY;

        if (this.shadow)
        {
            this.context.fillStyle = this.shadowColor;

            var xShadowOffset = Math.cos(this.shadowAngle) * this.shadowDistance;
            var yShadowOffset = Math.sin(this.shadowAngle) * this.shadowDistance;

            for (i = 0; i < lines.length; i++)
            {
                linePositionX = this.strokeThickness / 2;
                linePositionY = (this.strokeThickness / 2 + i * lineHeight) + fontProperties.ascent;

                if (this.align === 'right')
                {
                    linePositionX += maxLineWidth - lineWidths[i];
                }
                else if (this.align === 'center')
                {
                    linePositionX += (maxLineWidth - lineWidths[i]) / 2;
                }

                if (this.color)
                {
                    this.context.fillText(lines[i], linePositionX + xShadowOffset, linePositionY + yShadowOffset + this.padding);
                }
            }
        }

        this.context.fillStyle = this.color;

        for (i = 0; i < lines.length; i++)
        {
            linePositionX =  this.strokeThickness / 2;
            linePositionY = (this.strokeThickness / 2 + i * lineHeight) + fontProperties.ascent;

            if (this.align === 'right')
            {
                linePositionX += maxLineWidth - lineWidths[i];
            }
            else if (this.align === 'center')
            {
                linePositionX += (maxLineWidth - lineWidths[i]) / 2;
            }

            if (this.stroke && this.strokeThickness)
            {
                this.context.strokeText(lines[i], linePositionX, linePositionY + this.padding);
            }

            if (this.color)
            {
              
                this.context.fillText(lines[i], linePositionX, linePositionY + this.padding);
            }
        }

        this.updateTexture();
    },
    updateTexture:function ()
    {
       
        var texture = this._texture ;
        texture.baseTexture.hasLoaded = true ;
        texture.baseTexture.resolution = this.resolution ;
        texture.baseTexture.width = this.canvas.width / this.resolution ;
        texture.baseTexture.height = this.canvas.height / this.resolution ;
        texture.crop.width = texture._frame.width = this.canvas.width / this.resolution ;
        texture.crop.height = texture._frame.height = this.canvas.height / this.resolution ;
        texture.trim.x = 0 ;
        texture.trim.y = - this.padding ;

        texture.trim.width = texture._frame.width ;
        texture.trim.height = texture._frame.height - this.padding * 2 ;

        this._width = this.canvas.width / this.resolution ;
        this._height = this.canvas.height / this.resolution ;

        message.trigger(texture.baseTexture,'update',texture.baseTexture);

        this.dirty = false;
    },
    renderWebGL:function (renderer)
    {
        if (this.dirty)
        {
            this.updateText();
        }

        _class.Sprite.prototype.renderWebGL.call(this, renderer);
    },
    _renderCanvas:function (renderer)
    {
        if (this.dirty)
        {
        
            this.updateText();
        }

        _Image.prototype._renderCanvas.call(this,renderer);
    },
    determineFontProperties:function (fontStyle)
    {
        var properties = Text.fontPropertiesCache[fontStyle];

        if (!properties)
        {
            properties = {};

            var canvas = Text.fontPropertiesCanvas;
            var context = Text.fontPropertiesContext;

            context.font = fontStyle;

            var width = Math.ceil(context.measureText('|MÉq').width);
            var baseline = Math.ceil(context.measureText('M').width);
            var height = 2 * baseline;

            baseline = baseline * 1.4 | 0;

            canvas.width = width;
            canvas.height = height;

            context.fillStyle = '#f00';
            context.fillRect(0, 0, width, height);

            context.font = fontStyle;

            context.textBaseline = 'alphabetic';
            context.fillStyle = '#000';
            context.fillText('|MÉq', 0, baseline);

            var imagedata = context.getImageData(0, 0, width, height).data;
            var pixels = imagedata.length;
            var line = width * 4;

            var i, j;

            var idx = 0;
            var stop = false;

            for (i = 0; i < baseline; i++)
            {
                for (j = 0; j < line; j += 4)
                {
                    if (imagedata[idx + j] !== 255)
                    {
                        stop = true;
                        break;
                    }
                }
                if (!stop)
                {
                    idx += line;
                }
                else
                {
                    break;
                }
            }

            properties.ascent = baseline - i;

            idx = pixels - line;
            stop = false;

            for (i = height; i > baseline; i--)
            {
                for (j = 0; j < line; j += 4)
                {
                    if (imagedata[idx + j] !== 255)
                    {
                        stop = true;
                        break;
                    }
                }
                if (!stop)
                {
                    idx -= line;
                }
                else
                {
                    break;
                }
            }

            properties.descent = i - baseline;
            properties.fontSize = properties.ascent + properties.descent;

            Text.fontPropertiesCache[fontStyle] = properties;
        }

        return properties;
    },
    _wordWrap:function (text)
    {
  
        var result = '';
        var lines = text.split('\n');
        var wordWrapWidth = this.wordWrapWidth;
        for (var i = 0; i < lines.length; i++)
        {
            var spaceLeft = wordWrapWidth ;
            var words = lines[i].split('') ;
            for (var j = 0; j < words.length; j++)
            {
                var wordWidth = this.context.measureText(words[j]).width;
                var wordWidthWithSpace = wordWidth + this.context.measureText(' ').width;
                if (j === 0 || wordWidthWithSpace > spaceLeft)
                {
                    if (j > 0)
                    {
                        result += '\n';
                    }
                    result += words[j];
                    spaceLeft = wordWrapWidth - wordWidth;
                }
                else
                {
                    spaceLeft -= wordWidthWithSpace;
                    result += words[j];
                }
            }

            if (i < lines.length-1)
            {
                result += '\n';
            }
        }
        return result;
    },
    getBounds:function (matrix){
        if (this.dirty)
        {
            this.updateText();
        }

        return Sprite.prototype.getBounds.call(this, matrix);
    },
    destroy:function (destroyBaseTexture) {

        this.context = null;
        this.canvas = null;
        this._texture.destroy(destroyBaseTexture === undefined ? true : destroyBaseTexture);

    }
},{

    width: {
        get: function ()
        {
            if (this.dirty)
            {
                this.updateText();
            }

            return this.scale.x * this._texture._frame.width;
        },
        set: function (value)
        {
            this.scale.x = value / this._texture._frame.width;
            this._width = value;
        }
    },

    height: {
        get: function ()
        {
            if (this.dirty)
            {
                this.updateText();
            }

            return  this.scale.y * this._texture._frame.height;
        },
        set: function (value)
        {
            this.scale.y = value / this._texture._frame.height;
            this._height = value;
        }
    },

    text: {
        get: function() {

            return this._text;
        },
        set: function (text){

            text = text.toString() || ' ';
            if (this._text === text)
            {
                return;
            }
            this._text = text;
            this.dirty = true;
        }
    }
});

Text.fontPropertiesCache = {};
Text.fontPropertiesCanvas = document.createElement('canvas');
Text.fontPropertiesContext = Text.fontPropertiesCanvas.getContext('2d');






var ObjectRenderer = _class({
    className:'ObjectRenderer',
    extend:'WebGLManager',
    constructor:function(_super,renderer)
    {
        _super.call(this,renderer);
    },
    start:function (){},
    stop:function (){this.flush()},
    flush:function (){},
    render:function (object){}
});

var SpriteRenderer = _class({
    className:'SpriteRenderer',
    extend:'ObjectRenderer',
    constructor:function(_super,renderer){
        _super.call(this,renderer);
        this.vertSize = 5;
        this.vertByteSize = this.vertSize * 4;
        this.size = CONST.SPRITE_BATCH_SIZE;
        var numVerts = this.size * 4 * this.vertByteSize;
       
        var numIndices = this.size * 6;

        this.vertices = new ArrayBuffer(numVerts);

        this.positions = new Float32Array(this.vertices);

        this.colors = new Uint32Array(this.vertices);

       
        this.indices = new Uint16Array(numIndices);

        this.lastIndexCount = 0;

        for (var i=0, j=0; i < numIndices; i += 6, j += 4)
        {
            this.indices[i + 0] = j + 0;
            this.indices[i + 1] = j + 1;
            this.indices[i + 2] = j + 2;
            this.indices[i + 3] = j + 0;
            this.indices[i + 4] = j + 2;
            this.indices[i + 5] = j + 3;
        }

      
        this.drawing = false;

       
        this.currentBatchSize = 0;

        this.currentBaseTexture = null;

        this.textures = [];

        this.blendModes = [];

        this.shaders = [];

        this.sprites = [];

        this.shader = null;

    },
    onContextChange:function ()
    {
        var gl = this.renderer.gl;

      
        this.shader = this.renderer.shaderManager.defaultShader;

        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

        this.currentBlendMode = 99999;
    },
    render:function (sprite)
    {
        var texture = sprite._texture;

        if (this.currentBatchSize >= this.size)
        {
            this.flush();
            this.currentBaseTexture = texture.baseTexture;
        }

      
        var uvs = texture._uvs;

        if (!uvs)
        {
            return;
        }

        var aX = sprite.anchor.x;
        var aY = sprite.anchor.y;

        var w0, w1, h0, h1;

        if (texture.trim)
        {
            var trim = texture.trim;

            w1 = trim.x - aX * trim.width;
            w0 = w1 + texture.crop.width;

            h1 = trim.y - aY * trim.height;
            h0 = h1 + texture.crop.height;

        }
        else
        {
            w0 = (texture._frame.width ) * (1-aX);
            w1 = (texture._frame.width ) * -aX;

            h0 = texture._frame.height * (1-aY);
            h1 = texture._frame.height * -aY;
        }

        var index = this.currentBatchSize * this.vertByteSize;

        var worldTransform = sprite.worldTransform;

        var a = worldTransform.a;
        var b = worldTransform.b;
        var c = worldTransform.c;
        var d = worldTransform.d;
        var tx = worldTransform.tx;
        var ty = worldTransform.ty;

        var colors = this.colors;
        var positions = this.positions;

        if (this.renderer.roundPixels)
        {
            // xy
            positions[index] = a * w1 + c * h1 + tx | 0;
            positions[index+1] = d * h1 + b * w1 + ty | 0;

            // xy
            positions[index+5] = a * w0 + c * h1 + tx | 0;
            positions[index+6] = d * h1 + b * w0 + ty | 0;

             // xy
            positions[index+10] = a * w0 + c * h0 + tx | 0;
            positions[index+11] = d * h0 + b * w0 + ty | 0;

            // xy
            positions[index+15] = a * w1 + c * h0 + tx | 0;
            positions[index+16] = d * h0 + b * w1 + ty | 0;
        }
        else
        {
            positions[index] = a * w1 + c * h1 + tx;
            positions[index+1] = d * h1 + b * w1 + ty;

            positions[index+5] = a * w0 + c * h1 + tx;
            positions[index+6] = d * h1 + b * w0 + ty;

            positions[index+10] = a * w0 + c * h0 + tx;
            positions[index+11] = d * h0 + b * w0 + ty;

            positions[index+15] = a * w1 + c * h0 + tx;
            positions[index+16] = d * h0 + b * w1 + ty;
        }

        positions[index+2] = uvs.x0;
        positions[index+3] = uvs.y0;

        positions[index+7] = uvs.x1;
        positions[index+8] = uvs.y1;

        positions[index+12] = uvs.x2;
        positions[index+13] = uvs.y2;

        positions[index+17] = uvs.x3;
        positions[index+18] = uvs.y3;

        var tint = sprite.tint;

        colors[index+4] = colors[index+9] = colors[index+14] = colors[index+19] = (tint >> 16) + (tint & 0xff00) + ((tint & 0xff) << 16) + (sprite.worldAlpha * 255 << 24);

        this.sprites[this.currentBatchSize++] = sprite;
    },
    flush:function ()
    {
        if (this.currentBatchSize === 0)
        {
            return;
        }

        var gl = this.renderer.gl;
        var shader;

        if (this.currentBatchSize > ( this.size * 0.5 ) )
        {
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
        }
        else
        {
            var view = this.positions.subarray(0, this.currentBatchSize * this.vertByteSize);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, view);
        }

        var nextTexture, nextBlendMode, nextShader;
        var batchSize = 0;
        var start = 0;

        var currentBaseTexture = null;
        var currentBlendMode = this.renderer.blendModeManager.currentBlendMode;
        var currentShader = null;

        var blendSwap = false;
        var shaderSwap = false;
        var sprite;

        for (var i = 0, j = this.currentBatchSize; i < j; i++)
        {

            sprite = this.sprites[i];

            nextTexture = sprite._texture.baseTexture;
            nextBlendMode = sprite.blendMode;
            nextShader = sprite.shader || this.shader;

            blendSwap = currentBlendMode !== nextBlendMode;
            shaderSwap = currentShader !== nextShader; // should I use uuidS???

            if (currentBaseTexture !== nextTexture || blendSwap || shaderSwap)
            {
                this.renderBatch(currentBaseTexture, batchSize, start);

                start = i;
                batchSize = 0;
                currentBaseTexture = nextTexture;

                if (blendSwap)
                {
                    currentBlendMode = nextBlendMode;
                    this.renderer.blendModeManager.setBlendMode( currentBlendMode );
                }

                if (shaderSwap)
                {
                    currentShader = nextShader;



                    shader = currentShader.shaders ? currentShader.shaders[gl.id] : currentShader;

                    if (!shader)
                    {
                        shader = currentShader.getShader(this.renderer);

                    }

                    this.renderer.shaderManager.setShader(shader);

                    shader.uniforms.projectionMatrix.value = this.renderer.currentRenderTarget.projectionMatrix.toArray(true);
                    shader.syncUniforms();

                    gl.activeTexture(gl.TEXTURE0);

                }
            }

            batchSize++;
        }

        this.renderBatch(currentBaseTexture, batchSize, start);

        this.currentBatchSize = 0;
    },
    renderBatch:function (texture, size, startIndex)
    {
        if (size === 0)
        {
            return;
        }

        var gl = this.renderer.gl;

        if (!texture._glTextures[gl.id])
        {
            this.renderer.updateTexture(texture);
        }
        else
        {
            gl.bindTexture(gl.TEXTURE_2D, texture._glTextures[gl.id]);
        }

        gl.drawElements(gl.TRIANGLES, size * 6, gl.UNSIGNED_SHORT, startIndex * 6 * 2);

        this.renderer.drawCount++;
    },
    start:function ()
    {
        var gl = this.renderer.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        var stride =  this.vertByteSize;
        gl.vertexAttribPointer(this.shader.attributes.aVertexPosition, 2, gl.FLOAT, false, stride, 0);
        gl.vertexAttribPointer(this.shader.attributes.aTextureCoord, 2, gl.FLOAT, false, stride, 2 * 4);

        gl.vertexAttribPointer(this.shader.attributes.aColor, 4, gl.UNSIGNED_BYTE, true, stride, 4 * 4);
    },
    destroy:function ()
    {
        this.renderer.gl.deleteBuffer(this.vertexBuffer);
        this.renderer.gl.deleteBuffer(this.indexBuffer);

        this.shader.destroy();

        this.renderer = null;

        this.vertices = null;
        this.positions = null;
        this.colors = null;
        this.indices = null;

        this.vertexBuffer = null;
        this.indexBuffer = null;

        this.currentBaseTexture = null;

        this.drawing = false;

        this.textures = null;
        this.blendModes = null;
        this.shaders = null;
        this.sprites = null;
        this.shader = null;
    }

});

WebGLRenderer.registerPlugin('sprite', SpriteRenderer);





var MeshRenderer = _class({
    className:'MeshRenderer',
    extend:'ObjectRenderer',
    constructor:function(_super,renderer){
        _super.call(this, renderer);

        this.indices = new Uint16Array(15000);

        for (var i=0, j=0; i < 15000; i += 6, j += 4)
        {
            this.indices[i + 0] = j + 0;
            this.indices[i + 1] = j + 1;
            this.indices[i + 2] = j + 2;
            this.indices[i + 3] = j + 0;
            this.indices[i + 4] = j + 2;
            this.indices[i + 5] = j + 3;
        }

    },
    onContextChange:function (){},
    render:function (mesh)
    {
    //    return;
        if(!mesh._vertexBuffer)
        {
            this._initWebGL(mesh);
        }

        var renderer = this.renderer,
            gl = renderer.gl,
            texture = mesh._texture.baseTexture,
            shader = renderer.shaderManager.plugins.meshShader;

        var drawMode = mesh.drawMode === Mesh.DRAW_MODES.TRIANGLE_MESH ? gl.TRIANGLE_STRIP : gl.TRIANGLES;

        renderer.blendModeManager.setBlendMode(mesh.blendMode);


        // set uniforms
        gl.uniformMatrix3fv(shader.uniforms.translationMatrix._location, false, mesh.worldTransform.toArray(true));

        gl.uniformMatrix3fv(shader.uniforms.projectionMatrix._location, false, renderer.currentRenderTarget.projectionMatrix.toArray(true));
        gl.uniform1f(shader.uniforms.alpha._location, mesh.worldAlpha);

        if (!mesh.dirty)
        {

            gl.bindBuffer(gl.ARRAY_BUFFER, mesh._vertexBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, mesh.vertices);
            gl.vertexAttribPointer(shader.attributes.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

            // update the uvs
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh._uvBuffer);
            gl.vertexAttribPointer(shader.attributes.aTextureCoord, 2, gl.FLOAT, false, 0, 0);


            gl.activeTexture(gl.TEXTURE0);

           if (!texture._glTextures[gl.id])
            {
                this.renderer.updateTexture(texture);
            }
            else
            {
                // bind the current texture
                gl.bindTexture(gl.TEXTURE_2D, texture._glTextures[gl.id]);
            }

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh._indexBuffer);
            gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, mesh.indices);
        }
        else
        {

            mesh.dirty = false;
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh._vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
            gl.vertexAttribPointer(shader.attributes.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

            // update the uvs
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh._uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, mesh.uvs, gl.STATIC_DRAW);
            gl.vertexAttribPointer(shader.attributes.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

             gl.activeTexture(gl.TEXTURE0);

            if (!texture._glTextures[gl.id])
            {
                this.renderer.updateTexture(texture);
            }
            else
            {
                // bind the current texture
                gl.bindTexture(gl.TEXTURE_2D, texture._glTextures[gl.id]);
            }

            // dont need to upload!
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh._indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

        }

        gl.drawElements(drawMode, mesh.indices.length, gl.UNSIGNED_SHORT, 0);

    },
    _initWebGL:function (mesh)
    {
        var gl = this.renderer.gl;

        mesh._vertexBuffer = gl.createBuffer();
        mesh._indexBuffer = gl.createBuffer();
        mesh._uvBuffer = gl.createBuffer();



        gl.bindBuffer(gl.ARRAY_BUFFER, mesh._vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh._uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,  mesh.uvs, gl.STATIC_DRAW);

        if(mesh.colors){
            mesh._colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh._colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, mesh.colors, gl.STATIC_DRAW);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);
    },
    flush:function (){},
    start:function ()
    {
        var shader = this.renderer.shaderManager.plugins.meshShader;
        this.renderer.shaderManager.setShader(shader);
    },
    destroy:function (){}
});


WebGLRenderer.registerPlugin('mesh', MeshRenderer);



var ParticleContainer = _class({
    className:'ParticleContainer',
    extend:'Container',
    constructor:function( _super , size , properties)
    {
        _super.call(this);

        this._properties = [false, true, false, false, false];

        this._size = size || 15000;

        this._buffers = null;

        this._updateStatic = false;

        this.interactiveChildren = false;

        this.blendMode = CONST.BLEND_MODES.NORMAL;

        this.roundPixels = true;

        this.setProperties(properties);
    },
    setProperties:function(properties)
    {
        if ( properties ) {
            this._properties[0] = 'scale' in properties ? !!properties.scale : this._properties[0];
            this._properties[1] = 'position' in properties ? !!properties.position : this._properties[1];
            this._properties[2] = 'rotation' in properties ? !!properties.rotation : this._properties[2];
            this._properties[3] = 'uvs' in properties ? !!properties.uvs : this._properties[3];
            this._properties[4] = 'alpha' in properties ? !!properties.alpha : this._properties[4];
        }
    },
    updateTransform:function ()
    {

        this.displayObjectUpdateTransform();
    },
    renderWebGL:function (renderer)
    {
        if (!this.visible || this.worldAlpha <= 0 || !this.children.length || !this.renderable)
        {
            return;
        }
        renderer.setObjectRenderer( renderer.plugins.particle );
        renderer.plugins.particle.render( this );
    },
    addChildAt:function (child, index)
    {
        if (child === this)
        {
            return child;
        }

        if (index >= 0 && index <= this.children.length)
        {
            if (child.parent)
            {
                child.parent.removeChild(child);
            }

            child.parent = this;

            this.children.splice(index, 0, child);

            this._updateStatic = true;

            return child;
        }
        else
        {
            throw new Error(child + 'addChildAt: The index '+ index +' supplied is out of bounds ' + this.children.length);
        }
    },
    removeChildAt:function (index)
    {
        var child = this.getChildAt(index);

        child.parent = null;
        this.children.splice(index, 1);
        this._updateStatic = true;

        return child;
    },
    renderCanvas:function (renderer)
    {
        if (!this.visible || this.worldAlpha <= 0 || !this.children.length || !this.renderable)
        {
            return;
        }

        var context = renderer.context;
        var transform = this.worldTransform;
        var isRotated = true;

        var positionX = 0;
        var positionY = 0;

        var finalWidth = 0;
        var finalHeight = 0;

        context.globalAlpha = this.worldAlpha;

        this.displayObjectUpdateTransform();

        for (var i = 0; i < this.children.length; ++i)
        {
            var child = this.children[i];

            if (!child.visible)
            {
                continue;
            }

            var frame = child.texture.frame;

            context.globalAlpha = this.worldAlpha * child.alpha;

            if (child.rotation % (Math.PI * 2) === 0)
            {
                if (isRotated)
                {
                    context.setTransform(
                        transform.a,
                        transform.b,
                        transform.c,
                        transform.d,
                        transform.tx,
                        transform.ty
                    );

                    isRotated = false;
                }

                positionX = ((child.anchor.x) * (-frame.width * child.scale.x) + child.position.x  + 0.5);
                positionY = ((child.anchor.y) * (-frame.height * child.scale.y) + child.position.y  + 0.5);

                finalWidth = frame.width * child.scale.x;
                finalHeight = frame.height * child.scale.y;

            }
            else
            {
                if (!isRotated)
                {
                    isRotated = true;
                }

                child.displayObjectUpdateTransform();

                var childTransform = child.worldTransform;

                if (renderer.roundPixels)
                {
                    context.setTransform(
                        childTransform.a,
                        childTransform.b,
                        childTransform.c,
                        childTransform.d,
                        childTransform.tx | 0,
                        childTransform.ty | 0
                    );
                }
                else
                {
                    context.setTransform(
                        childTransform.a,
                        childTransform.b,
                        childTransform.c,
                        childTransform.d,
                        childTransform.tx,
                        childTransform.ty
                    );
                }

                positionX = ((child.anchor.x) * (-frame.width) + 0.5);
                positionY = ((child.anchor.y) * (-frame.height) + 0.5);

                finalWidth = frame.width;
                finalHeight = frame.height;
            }

            context.drawImage(
                child.texture.baseTexture.source,
                frame.x,
                frame.y,
                frame.width,
                frame.height,
                positionX,
                positionY,
                finalWidth,
                finalHeight
            );
        }
    },
    destroy:function () {
        Container.prototype.destroy.apply(this, arguments);

        if (this._buffers) {
            for (var i = 0; i < this._buffers.length; ++i) {
                this._buffers.destroy();
            }
        }

        this._properties = null;
        this._buffers = null;
    }


});

var ParticleBuffer = _class({
    className:'ParticleBuffer',
    constructor:function(gl, properties, size){
        this.gl = gl;

        this.vertSize = 2;

        this.vertByteSize = this.vertSize * 4;

        this.size = size;

        this.dynamicProperties = [];

        this.staticProperties = [];

        for (var i = 0; i < properties.length; i++)
        {
            var property = properties[i];

            if(property.dynamic)
            {
                this.dynamicProperties.push(property);
            }
            else
            {
                this.staticProperties.push(property);
            }
        }

        this.staticStride = 0;
        this.staticBuffer = null;
        this.staticData = null;

        this.dynamicStride = 0;
        this.dynamicBuffer = null;
        this.dynamicData = null;

        this.initBuffers();

    },
    initBuffers:function ()
    {
        var gl = this.gl;
        var i;
        var property;

        var dynamicOffset = 0;
        this.dynamicStride = 0;

        for (i = 0; i < this.dynamicProperties.length; i++)
        {
            property = this.dynamicProperties[i];

            property.offset = dynamicOffset;
            dynamicOffset += property.size;
            this.dynamicStride += property.size;
        }

        this.dynamicData = new Float32Array( this.size * this.dynamicStride * 4);
        this.dynamicBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.dynamicBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.dynamicData, gl.DYNAMIC_DRAW);


        var staticOffset = 0;
        this.staticStride = 0;

        for (i = 0; i < this.staticProperties.length; i++)
        {
            property = this.staticProperties[i];

            property.offset = staticOffset;
            staticOffset += property.size;
            this.staticStride += property.size;
        }

        this.staticData = new Float32Array( this.size * this.staticStride * 4);
        this.staticBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.staticBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.staticData, gl.DYNAMIC_DRAW);

    },
    uploadDynamic:function(children, startIndex, amount)
    {
        var gl = this.gl;

        for (var i = 0; i < this.dynamicProperties.length; i++)
        {
            var property = this.dynamicProperties[i];
            property.uploadFunction(children, startIndex, amount, this.dynamicData, this.dynamicStride, property.offset);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.dynamicBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.dynamicData);
    },
    uploadStatic:function(children, startIndex, amount)
    {
        var gl = this.gl;

        for (var i = 0; i < this.staticProperties.length; i++)
        {
            var property = this.staticProperties[i];
            property.uploadFunction(children, startIndex, amount, this.staticData, this.staticStride, property.offset);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.staticBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.staticData);
    },
    bind:function ()
    {
        var gl = this.gl;
        var i, property;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.dynamicBuffer);

        for (i = 0; i < this.dynamicProperties.length; i++)
        {
            property = this.dynamicProperties[i];
            gl.vertexAttribPointer(property.attribute, property.size, gl.FLOAT, false, this.dynamicStride * 4, property.offset * 4);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.staticBuffer);

        for (i = 0; i < this.staticProperties.length; i++)
        {
            property = this.staticProperties[i];
            gl.vertexAttribPointer(property.attribute, property.size, gl.FLOAT, false, this.staticStride * 4, property.offset * 4);
        }
    },
    destroy:function ()
    {
        this.dynamicProperties = null;
        this.dynamicData = null;
        this.gl.deleteBuffer(this.dynamicBuffer);

        this.staticProperties = null;
        this.staticData = null;
        this.gl.deleteBuffer(this.staticBuffer);
    }
});


var ParticleShader = _class({
    className:'ParticleShader',
    extend:'TextureShader',
    constructor:function( _super , shaderManager )
    {
        _super.call(this,
            shaderManager,
            // vertex shader
            [
                'attribute vec2 aVertexPosition;',
                'attribute vec2 aTextureCoord;',
                'attribute float aColor;',

                'attribute vec2 aPositionCoord;',
                'attribute vec2 aScale;',
                'attribute float aRotation;',

                'uniform mat3 projectionMatrix;',

                'varying vec2 vTextureCoord;',
                'varying float vColor;',

                'void main(void){',
                '   vec2 v = aVertexPosition;',

                '   v.x = (aVertexPosition.x) * cos(aRotation) - (aVertexPosition.y) * sin(aRotation);',
                '   v.y = (aVertexPosition.x) * sin(aRotation) + (aVertexPosition.y) * cos(aRotation);',
                '   v = v + aPositionCoord;',

                '   gl_Position = vec4((projectionMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);',

                '   vTextureCoord = aTextureCoord;',
                '   vColor = aColor;',
                '}'
            ].join('\n'),
             [
                'precision lowp float;',

                'varying vec2 vTextureCoord;',
                'varying float vColor;',

                'uniform sampler2D uSampler;',
                'uniform float uAlpha;',

                'void main(void){',
                '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor * uAlpha ;',
                '}'
            ].join('\n'),
            {
                uAlpha:  { type: '1f', value: 1 }
            },
            {
                aPositionCoord: 0,
                aRotation:      0
            }
        );

    },

});


var ParticleRenderer = _class({
    className:'ParticleRenderer',
    extend:'ObjectRenderer',
    constructor:function( _super , renderer)
    {
        _super.call(this, renderer);

        this.size = 15000;

        var numIndices = this.size * 6;

        this.indices = new Uint16Array(numIndices);

        for (var i=0, j=0; i < numIndices; i += 6, j += 4)
        {
            this.indices[i + 0] = j + 0;
            this.indices[i + 1] = j + 1;
            this.indices[i + 2] = j + 2;
            this.indices[i + 3] = j + 0;
            this.indices[i + 4] = j + 2;
            this.indices[i + 5] = j + 3;
        }

      
        this.shader = null;

        this.indexBuffer = null;

        this.properties = null;

        this.tempMatrix = new _class.Matrix();
    },
    onContextChange:function ()
    {
        var gl = this.renderer.gl;

        this.shader = new ParticleShader(this.renderer.shaderManager);

        this.indexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        this.properties = [
            {
                attribute:this.shader.attributes.aVertexPosition,
                dynamic:false,
                size:2,
                uploadFunction:this.uploadVertices,
                offset:0
            },
            {
                attribute:this.shader.attributes.aPositionCoord,
                dynamic:true,
                size:2,
                uploadFunction:this.uploadPosition,
                offset:0
            },
            {
                attribute:this.shader.attributes.aRotation,
                dynamic:false,
                size:1,
                uploadFunction:this.uploadRotation,
                offset:0
            },
            {
                attribute:this.shader.attributes.aTextureCoord,
                dynamic:false,
                size:2,
                uploadFunction:this.uploadUvs,
                offset:0
            },
            {
                attribute:this.shader.attributes.aColor,
                dynamic:false,
                size:1,
                uploadFunction:this.uploadAlpha,
                offset:0
            }
        ];
    },
    start:function ()
    {
        var gl = this.renderer.gl;

        gl.activeTexture(gl.TEXTURE0);


        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        var shader = this.shader;

        this.renderer.shaderManager.setShader(shader);
    },
    render:function ( container )
    {
        var children = container.children,
            totalChildren = children.length,
            maxSize = container._size;

        if(totalChildren === 0)
        {
            return;
        }
        else if(totalChildren > maxSize)
        {
            totalChildren = maxSize;
        }

        if(!container._buffers)
        {
            container._buffers = this.generateBuffers( container );
        }



        this.renderer.blendModeManager.setBlendMode(container.blendMode);

        var gl = this.renderer.gl;

        var m =  container.worldTransform.copy( this.tempMatrix );
        m.prepend( this.renderer.currentRenderTarget.projectionMatrix );
        gl.uniformMatrix3fv(this.shader.uniforms.projectionMatrix._location, false, m.toArray(true));
        gl.uniform1f(this.shader.uniforms.uAlpha._location, container.worldAlpha);


        var uploadStatic = container._updateStatic;

        var baseTexture = children[0]._texture.baseTexture;

        if (!baseTexture._glTextures[gl.id])
        {
            if(!this.renderer.updateTexture(baseTexture))
            {
                return;
            }

            if(!this.properties[0].dynamic || !this.properties[3].dynamic)
            {
                uploadStatic = true;
            }
        }
        else
        {
            gl.bindTexture(gl.TEXTURE_2D, baseTexture._glTextures[gl.id]);
        }

        var j = 0;
        for (var i = 0; i < totalChildren; i+=this.size)
        {
             var amount = ( totalChildren - i);
            if(amount > this.size)
            {
                amount = this.size;
            }

            var buffer = container._buffers[j++];

            buffer.uploadDynamic(children, i, amount);

            if(uploadStatic)
            {
                buffer.uploadStatic(children, i, amount);
            }

            buffer.bind( this.shader );

            gl.drawElements(gl.TRIANGLES, amount * 6, gl.UNSIGNED_SHORT, 0);
            this.renderer.drawCount++;
        }

        container._updateStatic = false;
    },
    generateBuffers:function ( container )
    {
        var gl = this.renderer.gl,
            buffers = [],
            size = container._size,
            i;

        for (i = 0; i < container._properties.length; i++)
        {
            this.properties[i].dynamic = container._properties[i];
        }

        for (i = 0; i < size; i += this.size)
        {
            buffers.push( new ParticleBuffer(gl,  this.properties, this.size, this.shader) );
        }

        return buffers;
    },
    uploadVertices:function (children, startIndex, amount, array, stride, offset)
    {
        var sprite,
            texture,
            trim,
            sx,
            sy,
            w0, w1, h0, h1;

        for (var i = 0; i < amount; i++) {

            sprite = children[startIndex + i];
            texture = sprite._texture;
            sx = sprite.scale.x;
            sy = sprite.scale.y;

            if (texture.trim)
            {
                trim = texture.trim;

                w1 = trim.x - sprite.anchor.x * trim.width;
                w0 = w1 + texture.crop.width;

                h1 = trim.y - sprite.anchor.y * trim.height;
                h0 = h1 + texture.crop.height;
            }
            else
            {
                w0 = (texture._frame.width ) * (1-sprite.anchor.x);
                w1 = (texture._frame.width ) * -sprite.anchor.x;

                h0 = texture._frame.height * (1-sprite.anchor.y);
                h1 = texture._frame.height * -sprite.anchor.y;
            }

            array[offset] = w1 * sx;
            array[offset + 1] = h1 * sy;

            array[offset + stride] = w0 * sx;
            array[offset + stride + 1] = h1 * sy;

            array[offset + stride * 2] = w0 * sx;
            array[offset + stride * 2 + 1] = h0 * sy;

            array[offset + stride * 3] = w1 * sx;
            array[offset + stride * 3 + 1] = h0 * sy;

            offset += stride * 4;
        }

    },
    uploadPosition:function (children,startIndex, amount, array, stride, offset)
    {
        for (var i = 0; i < amount; i++)
        {
            var spritePosition = children[startIndex + i].position;

            array[offset] = spritePosition.x;
            array[offset + 1] = spritePosition.y;

            array[offset + stride] = spritePosition.x;
            array[offset + stride + 1] = spritePosition.y;

            array[offset + stride * 2] = spritePosition.x;
            array[offset + stride * 2 + 1] = spritePosition.y;

            array[offset + stride * 3] = spritePosition.x;
            array[offset + stride * 3 + 1] = spritePosition.y;

            offset += stride * 4;
        }
    },
    uploadRotation:function (children,startIndex, amount, array, stride, offset)
    {
        for (var i = 0; i < amount; i++)
        {
            var spriteRotation = children[startIndex + i].rotation;


            array[offset] = spriteRotation;
            array[offset + stride] = spriteRotation;
            array[offset + stride * 2] = spriteRotation;
            array[offset + stride * 3] = spriteRotation;

            offset += stride * 4;
        }
    },
    uploadUvs:function (children,startIndex, amount, array, stride, offset)
    {
        for (var i = 0; i < amount; i++)
        {
            var textureUvs = children[startIndex + i]._texture._uvs;

            if (textureUvs)
            {
                array[offset] = textureUvs.x0;
                array[offset + 1] = textureUvs.y0;

                array[offset + stride] = textureUvs.x1;
                array[offset + stride + 1] = textureUvs.y1;

                array[offset + stride * 2] = textureUvs.x2;
                array[offset + stride * 2 + 1] = textureUvs.y2;

                array[offset + stride * 3] = textureUvs.x3;
                array[offset + stride * 3 + 1] = textureUvs.y3;

                offset += stride * 4;
            }
            else
            {
                array[offset] = 0;
                array[offset + 1] = 0;

                array[offset + stride] = 0;
                array[offset + stride + 1] = 0;

                array[offset + stride * 2] = 0;
                array[offset + stride * 2 + 1] = 0;

                array[offset + stride * 3] = 0;
                array[offset + stride * 3 + 1] = 0;

                offset += stride * 4;
            }
        }
    },
    uploadAlpha:function (children,startIndex, amount, array, stride, offset)
    {
         for (var i = 0; i < amount; i++)
         {
            var spriteAlpha = children[startIndex + i].alpha;

            array[offset] = spriteAlpha;
            array[offset + stride] = spriteAlpha;
            array[offset + stride * 2] = spriteAlpha;
            array[offset + stride * 3] = spriteAlpha;

            offset += stride * 4;
        }
    },
    destroy:function ()
    {
        if (this.renderer.gl) {
            this.renderer.gl.deleteBuffer(this.indexBuffer);
        }

        ObjectRenderer.prototype.destroy.apply(this, arguments);

        this.shader.destroy();

        this.indices = null;
        this.tempMatrix = null;
    }

});

WebGLRenderer.registerPlugin('particle', ParticleRenderer);


var WebGLGraphicsData = _class({
    className:'WebGLGraphicsData',
    constructor:function(gl) {

        this.gl = gl;
       
        this.color = [0,0,0]; 
        this.points = [];

        this.indices = [];

        this.buffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();

        this.mode = 1;


        this.alpha = 1;

        this.dirty = true;

        this.glPoints = null;
        this.glIndices = null;
    },
    reset:function () {
        this.points.length = 0;
        this.indices.length = 0;
    },
    upload:function () {
        var gl = this.gl;

        this.glPoints = new Float32Array(this.points);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.glPoints, gl.STATIC_DRAW);

        this.glIndices = new Uint16Array(this.indices);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.glIndices, gl.STATIC_DRAW);

        this.dirty = false;
    },
    destroy:function () {
        this.gl = null;
        this.color = null;
        this.points = null;
        this.indices = null;

        this.gl.deleteBuffer(this.buffer);
        this.gl.deleteBuffer(this.indexBuffer);

        this.buffer = null;
        this.indexBuffer = null;

        this.glPoints = null;
        this.glIndices = null;
    }
});


var GraphicsData = _class({
    className:'GraphicsData',
    constructor:function(lineWidth, lineColor, lineAlpha, fillColor, fillAlpha, fill, shape)
    {

        this.lineWidth = lineWidth;

        this.lineColor = lineColor;

        this.lineAlpha = lineAlpha;

        this._lineTint = lineColor;

        this.fillColor = fillColor;

        this.fillAlpha = fillAlpha;

        this._fillTint = fillColor;

        this.fill = fill;

        this.shape = shape;

        this.type = shape.type;
    },
    clone:function ()
    {
        return new GraphicsData(
            this.lineWidth,
            this.lineColor,
            this.lineAlpha,
            this.fillColor,
            this.fillAlpha,
            this.fill,
            this.shape
        );
    },
    destroy:function () {
        this.shape = null;
    }
});



var GraphicsRenderer = _class({
    className:'GraphicsRenderer',
    extend:'ObjectRenderer',
    constructor:function( _super , renderer)
    {
        _class.ObjectRenderer.call(this, renderer);

        this.graphicsDataPool = [];

        this.primitiveShader = null;
        this.complexPrimitiveShader = null;
    },
    onContextChange:function(){},
    destroy:function () {
        ObjectRenderer.prototype.destroy.call(this);

        for (var i = 0; i < this.graphicsDataPool.length; ++i) {
            this.graphicsDataPool[i].destroy();
        }

        this.graphicsDataPool = null;
    },
    render:function(graphics)
    {
        var renderer = this.renderer;
        var gl = renderer.gl;

        var shader = renderer.shaderManager.plugins.primitiveShader,
            webGLData;

        if (graphics.dirty)
        {
            this.updateGraphics(graphics, gl);
        }

        var webGL = graphics._webGL[gl.id];

        if(!webGL)return;

        renderer.blendModeManager.setBlendMode( graphics.blendMode );

        for (var i = 0; i < webGL.data.length; i++)
        {
            if (webGL.data[i].mode === 1)
            {
                webGLData = webGL.data[i];

                renderer.stencilManager.pushStencil(graphics, webGLData, renderer);

                gl.uniform1f(renderer.shaderManager.complexPrimitiveShader.uniforms.alpha._location, graphics.worldAlpha * webGLData.alpha);

                gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, ( webGLData.indices.length - 4 ) * 2 );

                renderer.stencilManager.popStencil(graphics, webGLData, renderer);
            }
            else
            {
                webGLData = webGL.data[i];


                shader = renderer.shaderManager.primitiveShader;

                renderer.shaderManager.setShader( shader );

                gl.uniformMatrix3fv(shader.uniforms.translationMatrix._location, false, graphics.worldTransform.toArray(true));

                gl.uniformMatrix3fv(shader.uniforms.projectionMatrix._location, false, renderer.currentRenderTarget.projectionMatrix.toArray(true));

                gl.uniform3fv(shader.uniforms.tint._location, utils.hex2rgb(graphics.tint));

                gl.uniform1f(shader.uniforms.alpha._location, graphics.worldAlpha);


                gl.bindBuffer(gl.ARRAY_BUFFER, webGLData.buffer);
                gl.vertexAttribPointer(shader.attributes.aVertexPosition, 2, gl.FLOAT, false, 4 * 6, 0);
                gl.vertexAttribPointer(shader.attributes.aColor, 4, gl.FLOAT, false,4 * 6, 2 * 4);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webGLData.indexBuffer);
                gl.drawElements(gl.TRIANGLE_STRIP,  webGLData.indices.length, gl.UNSIGNED_SHORT, 0 );
            }
        }
    },
    updateGraphics:function(graphics)
    {
        var gl = this.renderer.gl;

        var webGL = graphics._webGL[gl.id];

        if (!webGL)
        {
            webGL = graphics._webGL[gl.id] = {lastIndex:0, data:[], gl:gl};
        }


        graphics.dirty = false;

        var i;

        if (graphics.clearDirty)
        {
            graphics.clearDirty = false;

            for (i = 0; i < webGL.data.length; i++)
            {
                var graphicsData = webGL.data[i];
                graphicsData.reset();
                this.graphicsDataPool.push( graphicsData );
            }

            webGL.data = [];
            webGL.lastIndex = 0;
        }

        var webGLData;

        for (i = webGL.lastIndex; i < graphics.graphicsData.length; i++)
        {
            var data = graphics.graphicsData[i];

            if (data.type === CONST.SHAPES.POLY)
            {
                data.points = data.shape.points.slice();
                if (data.shape.closed)
                {
                    if (data.points[0] !== data.points[data.points.length-2] || data.points[1] !== data.points[data.points.length-1])
                    {
                        data.points.push(data.points[0], data.points[1]);
                    }
                }

                if (data.fill)
                {
                    if (data.points.length >= 6)
                    {
                        if (data.points.length < 6 * 2)
                        {
                            webGLData = this.switchMode(webGL, 0);

                            var canDrawUsingSimple = this.buildPoly(data, webGLData);

                            if (!canDrawUsingSimple)
                            {
                                webGLData = this.switchMode(webGL, 1);
                                this.buildComplexPoly(data, webGLData);
                            }

                        }
                        else
                        {
                            webGLData = this.switchMode(webGL, 1);
                            this.buildComplexPoly(data, webGLData);
                        }
                    }
                }

                if (data.lineWidth > 0)
                {
                    webGLData = this.switchMode(webGL, 0);
                    this.buildLine(data, webGLData);
                }
            }
            else
            {
                webGLData = this.switchMode(webGL, 0);

                if (data.type === CONST.SHAPES.RECT)
                {
                    this.buildRectangle(data, webGLData);
                }
                else if (data.type === CONST.SHAPES.CIRC || data.type === CONST.SHAPES.ELIP)
                {
                    this.buildCircle(data, webGLData);
                }
                else if (data.type === CONST.SHAPES.RREC)
                {
                    this.buildRoundedRectangle(data, webGLData);
                }
            }

            webGL.lastIndex++;
        }

        for (i = 0; i < webGL.data.length; i++)
        {
            webGLData = webGL.data[i];

            if (webGLData.dirty)
            {
                webGLData.upload();
            }
        }
    },
    switchMode:function (webGL, type)
    {
        var webGLData;

        if (!webGL.data.length)
        {
            webGLData = this.graphicsDataPool.pop() || new WebGLGraphicsData(webGL.gl);
            webGLData.mode = type;
            webGL.data.push(webGLData);
        }
        else
        {
            webGLData = webGL.data[webGL.data.length-1];

            if ((webGLData.points.length > 320000) || webGLData.mode !== type || type === 1)
            {
                webGLData = this.graphicsDataPool.pop() || new WebGLGraphicsData(webGL.gl);
                webGLData.mode = type;
                webGL.data.push(webGLData);
            }
        }

        webGLData.dirty = true;

        return webGLData;
    },
    buildRectangle:function (graphicsData, webGLData)
    {
        var rectData = graphicsData.shape;
        var x = rectData.x;
        var y = rectData.y;
        var width = rectData.width;
        var height = rectData.height;

        if (graphicsData.fill)
        {
            var color = utils.hex2rgb(graphicsData.fillColor);
            var alpha = graphicsData.fillAlpha;

            var r = color[0] * alpha;
            var g = color[1] * alpha;
            var b = color[2] * alpha;

            var verts = webGLData.points;
            var indices = webGLData.indices;

            var vertPos = verts.length/6;

            verts.push(x, y);
            verts.push(r, g, b, alpha);

            verts.push(x + width, y);
            verts.push(r, g, b, alpha);

            verts.push(x , y + height);
            verts.push(r, g, b, alpha);

            verts.push(x + width, y + height);
            verts.push(r, g, b, alpha);

            indices.push(vertPos, vertPos, vertPos+1, vertPos+2, vertPos+3, vertPos+3);
        }

        if (graphicsData.lineWidth)
        {
            var tempPoints = graphicsData.points;

            graphicsData.points = [x, y,
                      x + width, y,
                      x + width, y + height,
                      x, y + height,
                      x, y];


            this.buildLine(graphicsData, webGLData);

            graphicsData.points = tempPoints;
        }
    },
    buildRoundedRectangle:function (graphicsData, webGLData)
    {
        var rrectData = graphicsData.shape;
        var x = rrectData.x;
        var y = rrectData.y;
        var width = rrectData.width;
        var height = rrectData.height;

        var radius = rrectData.radius;

        var recPoints = [];
        recPoints.push(x, y + radius);
        this.quadraticBezierCurve(x, y + height - radius, x, y + height, x + radius, y + height, recPoints);
        this.quadraticBezierCurve(x + width - radius, y + height, x + width, y + height, x + width, y + height - radius, recPoints);
        this.quadraticBezierCurve(x + width, y + radius, x + width, y, x + width - radius, y, recPoints);
        this.quadraticBezierCurve(x + radius, y, x, y, x, y + radius + 0.0000000001, recPoints);

        if (graphicsData.fill)
        {
            var color = utils.hex2rgb(graphicsData.fillColor);
            var alpha = graphicsData.fillAlpha;

            var r = color[0] * alpha;
            var g = color[1] * alpha;
            var b = color[2] * alpha;

            var verts = webGLData.points;
            var indices = webGLData.indices;

            var vecPos = verts.length/6;

            var triangles = earcut(recPoints, null, 2);

            var i = 0;
            for (i = 0; i < triangles.length; i+=3)
            {
                indices.push(triangles[i] + vecPos);
                indices.push(triangles[i] + vecPos);
                indices.push(triangles[i+1] + vecPos);
                indices.push(triangles[i+2] + vecPos);
                indices.push(triangles[i+2] + vecPos);
            }

            for (i = 0; i < recPoints.length; i++)
            {
                verts.push(recPoints[i], recPoints[++i], r, g, b, alpha);
            }
        }

        if (graphicsData.lineWidth)
        {
            var tempPoints = graphicsData.points;

            graphicsData.points = recPoints;

            this.buildLine(graphicsData, webGLData);

            graphicsData.points = tempPoints;
        }
    },
    quadraticBezierCurve:function (fromX, fromY, cpX, cpY, toX, toY, out)
    {
        var xa,
            ya,
            xb,
            yb,
            x,
            y,
            n = 20,
            points = out || [];

        function getPt(n1 , n2, perc) {
            var diff = n2 - n1;

            return n1 + ( diff * perc );
        }

        var j = 0;
        for (var i = 0; i <= n; i++ ) {
            j = i / n;

            xa = getPt( fromX , cpX , j );
            ya = getPt( fromY , cpY , j );
            xb = getPt( cpX , toX , j );
            yb = getPt( cpY , toY , j );

            x = getPt( xa , xb , j );
            y = getPt( ya , yb , j );

            points.push(x, y);
        }

        return points;
    },
    buildCircle:function (graphicsData, webGLData)
    {
        console.log('buildCircle');
        var circleData = graphicsData.shape;
        var x = circleData.x;
        var y = circleData.y;
        var width;
        var height;

        if (graphicsData.type === CONST.SHAPES.CIRC)
        {
            width = circleData.radius;
            height = circleData.radius;
        }
        else
        {
            width = circleData.width;
            height = circleData.height;
        }

        var totalSegs = 40;
        var seg = (Math.PI * 2) / totalSegs ;

        var i = 0;

        if (graphicsData.fill)
        {
            var color = utils.hex2rgb(graphicsData.fillColor);
            var alpha = graphicsData.fillAlpha;

            var r = color[0] * alpha;
            var g = color[1] * alpha;
            var b = color[2] * alpha;

            var verts = webGLData.points;
            var indices = webGLData.indices;

            var vecPos = verts.length/6;

            indices.push(vecPos);

            for (i = 0; i < totalSegs + 1 ; i++)
            {
                verts.push(x,y, r, g, b, alpha);

                verts.push(x + Math.sin(seg * i) * width,
                           y + Math.cos(seg * i) * height,
                           r, g, b, alpha);

                indices.push(vecPos++, vecPos++);
            }

            indices.push(vecPos-1);
        }

        if (graphicsData.lineWidth)
        {
            var tempPoints = graphicsData.points;

            graphicsData.points = [];

            for (i = 0; i < totalSegs + 1; i++)
            {
                graphicsData.points.push(x + Math.sin(seg * i) * width,
                                         y + Math.cos(seg * i) * height);
            }

            this.buildLine(graphicsData, webGLData);

            graphicsData.points = tempPoints;
        }
    },
    buildLine:function (graphicsData, webGLData)
    {
        var i = 0;
        var points = graphicsData.points;

        if (points.length === 0)
        {
            return;
        }

        if (graphicsData.lineWidth%2)
        {
            for (i = 0; i < points.length; i++)
            {
                points[i] += 0.5;
            }
        }

        var firstPoint = new _class.Point(points[0], points[1]);
        var lastPoint = new _class.Point(points[points.length - 2], points[points.length - 1]);

        if (firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y)
        {
            points = points.slice();

            points.pop();
            points.pop();

            lastPoint = new _class.Point(points[points.length - 2], points[points.length - 1]);

            var midPointX = lastPoint.x + (firstPoint.x - lastPoint.x) *0.5;
            var midPointY = lastPoint.y + (firstPoint.y - lastPoint.y) *0.5;

            points.unshift(midPointX, midPointY);
            points.push(midPointX, midPointY);
        }

        var verts = webGLData.points;
        var indices = webGLData.indices;
        var length = points.length / 2;
        var indexCount = points.length;
        var indexStart = verts.length/6;

        var width = graphicsData.lineWidth / 2;

        var color = utils.hex2rgb(graphicsData.lineColor);
        var alpha = graphicsData.lineAlpha;
        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;

        var px, py, p1x, p1y, p2x, p2y, p3x, p3y;
        var perpx, perpy, perp2x, perp2y, perp3x, perp3y;
        var a1, b1, c1, a2, b2, c2;
        var denom, pdist, dist;

        p1x = points[0];
        p1y = points[1];

        p2x = points[2];
        p2y = points[3];

        perpx = -(p1y - p2y);
        perpy =  p1x - p2x;

        dist = Math.sqrt(perpx*perpx + perpy*perpy);

        perpx /= dist;
        perpy /= dist;
        perpx *= width;
        perpy *= width;

        verts.push(p1x - perpx , p1y - perpy,
                    r, g, b, alpha);

        verts.push(p1x + perpx , p1y + perpy,
                    r, g, b, alpha);

        for (i = 1; i < length-1; i++)
        {
            p1x = points[(i-1)*2];
            p1y = points[(i-1)*2 + 1];

            p2x = points[(i)*2];
            p2y = points[(i)*2 + 1];

            p3x = points[(i+1)*2];
            p3y = points[(i+1)*2 + 1];

            perpx = -(p1y - p2y);
            perpy = p1x - p2x;

            dist = Math.sqrt(perpx*perpx + perpy*perpy);
            perpx /= dist;
            perpy /= dist;
            perpx *= width;
            perpy *= width;

            perp2x = -(p2y - p3y);
            perp2y = p2x - p3x;

            dist = Math.sqrt(perp2x*perp2x + perp2y*perp2y);
            perp2x /= dist;
            perp2y /= dist;
            perp2x *= width;
            perp2y *= width;

            a1 = (-perpy + p1y) - (-perpy + p2y);
            b1 = (-perpx + p2x) - (-perpx + p1x);
            c1 = (-perpx + p1x) * (-perpy + p2y) - (-perpx + p2x) * (-perpy + p1y);
            a2 = (-perp2y + p3y) - (-perp2y + p2y);
            b2 = (-perp2x + p2x) - (-perp2x + p3x);
            c2 = (-perp2x + p3x) * (-perp2y + p2y) - (-perp2x + p2x) * (-perp2y + p3y);

            denom = a1*b2 - a2*b1;

            if (Math.abs(denom) < 0.1 )
            {

                denom+=10.1;
                verts.push(p2x - perpx , p2y - perpy,
                    r, g, b, alpha);

                verts.push(p2x + perpx , p2y + perpy,
                    r, g, b, alpha);

                continue;
            }

            px = (b1*c2 - b2*c1)/denom;
            py = (a2*c1 - a1*c2)/denom;


            pdist = (px -p2x) * (px -p2x) + (py -p2y) + (py -p2y);


            if (pdist > 140 * 140)
            {
                perp3x = perpx - perp2x;
                perp3y = perpy - perp2y;

                dist = Math.sqrt(perp3x*perp3x + perp3y*perp3y);
                perp3x /= dist;
                perp3y /= dist;
                perp3x *= width;
                perp3y *= width;

                verts.push(p2x - perp3x, p2y -perp3y);
                verts.push(r, g, b, alpha);

                verts.push(p2x + perp3x, p2y +perp3y);
                verts.push(r, g, b, alpha);

                verts.push(p2x - perp3x, p2y -perp3y);
                verts.push(r, g, b, alpha);

                indexCount++;
            }
            else
            {

                verts.push(px , py);
                verts.push(r, g, b, alpha);

                verts.push(p2x - (px-p2x), p2y - (py - p2y));
                verts.push(r, g, b, alpha);
            }
        }

        p1x = points[(length-2)*2];
        p1y = points[(length-2)*2 + 1];

        p2x = points[(length-1)*2];
        p2y = points[(length-1)*2 + 1];

        perpx = -(p1y - p2y);
        perpy = p1x - p2x;

        dist = Math.sqrt(perpx*perpx + perpy*perpy);
        perpx /= dist;
        perpy /= dist;
        perpx *= width;
        perpy *= width;

        verts.push(p2x - perpx , p2y - perpy);
        verts.push(r, g, b, alpha);

        verts.push(p2x + perpx , p2y + perpy);
        verts.push(r, g, b, alpha);

        indices.push(indexStart);

        for (i = 0; i < indexCount; i++)
        {
            indices.push(indexStart++);
        }

        indices.push(indexStart-1);
    },
    buildComplexPoly:function (graphicsData, webGLData)
    {
        var points = graphicsData.points.slice();

        if (points.length < 6)
        {
            return;
        }

        var indices = webGLData.indices;
        webGLData.points = points;
        webGLData.alpha = graphicsData.fillAlpha;
        webGLData.color = utils.hex2rgb(graphicsData.fillColor);

        var minX = Infinity;
        var maxX = -Infinity;

        var minY = Infinity;
        var maxY = -Infinity;

        var x,y;

        for (var i = 0; i < points.length; i+=2)
        {
            x = points[i];
            y = points[i+1];

            minX = x < minX ? x : minX;
            maxX = x > maxX ? x : maxX;

            minY = y < minY ? y : minY;
            maxY = y > maxY ? y : maxY;
        }

        points.push(minX, minY,
                    maxX, minY,
                    maxX, maxY,
                    minX, maxY);

        var length = points.length / 2;
        for (i = 0; i < length; i++)
        {
            indices.push( i );
        }

    },
    buildPoly:function (graphicsData, webGLData)
    {
        var points = graphicsData.points;

        if (points.length < 6)
        {
            return;
        }

        var verts = webGLData.points;
        var indices = webGLData.indices;

        var length = points.length / 2;

        var color = utils.hex2rgb(graphicsData.fillColor);
        var alpha = graphicsData.fillAlpha;
        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;

        var triangles = earcut(points, null, 2);

        if (!triangles) {
            return false;
        }

        var vertPos = verts.length / 6;

        var i = 0;

        for (i = 0; i < triangles.length; i+=3)
        {
            indices.push(triangles[i] + vertPos);
            indices.push(triangles[i] + vertPos);
            indices.push(triangles[i+1] + vertPos);
            indices.push(triangles[i+2] +vertPos);
            indices.push(triangles[i+2] + vertPos);
        }

        for (i = 0; i < length; i++)
        {
            verts.push(points[i * 2], points[i * 2 + 1],
                       r, g, b, alpha);
        }

        return true;
    }
});





WebGLRenderer.registerPlugin('graphics', GraphicsRenderer);



var Graphics = _class({
    className:'Graphics',
    extend:'Container',
    constructor:function(_super){
        _super.call(this);

        this.fillAlpha = 1;
        this.lineWidth = 0;
        this.lineColor = 0;

        this.graphicsData = [];
        this.tint = 0xFFFFFF;
        this._prevTint = 0xFFFFFF;
        this.blendMode = CONST.BLEND_MODES.NORMAL;
        this.currentPath = null;
        this._webGL = {};
        this.isMask = false;
        this.boundsPadding = 0;
        this._localBounds = new Rectangle(0,0,1,1);
        this.dirty = true;
        this.glDirty = false;
        this.boundsDirty = true;
        this.cachedSpriteDirty = false;
    },
    clone:function ()
    {
        var clone = new Graphics();

        clone.renderable    = this.renderable;
        clone.fillAlpha     = this.fillAlpha;
        clone.lineWidth     = this.lineWidth;
        clone.lineColor     = this.lineColor;
        clone.tint          = this.tint;
        clone.blendMode     = this.blendMode;
        clone.isMask        = this.isMask;
        clone.boundsPadding = this.boundsPadding;
        clone.dirty         = this.dirty;
        clone.glDirty       = this.glDirty;
        clone.cachedSpriteDirty = this.cachedSpriteDirty;

        for (var i = 0; i < this.graphicsData.length; ++i)
        {
            clone.graphicsData.push(this.graphicsData[i].clone());
        }

        clone.currentPath = clone.graphicsData[clone.graphicsData.length - 1];

        clone.updateLocalBounds();

        return clone;
    },
    lineStyle:function (lineWidth, color, alpha)
    {
        this.lineWidth = lineWidth || 0;
        this.lineColor = color || 0;
        this.lineAlpha = (alpha === undefined) ? 1 : alpha;

        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length)
            {
                this.drawShape( new _class.Polygon( this.currentPath.shape.points.slice(-2) ));
            }
            else
            {
                this.currentPath.lineWidth = this.lineWidth;
                this.currentPath.lineColor = this.lineColor;
                this.currentPath.lineAlpha = this.lineAlpha;
            }
        }

        return this;
    },
    moveTo:function (x, y)
    {
        this.drawShape(new _class.Polygon([x,y]));

        return this;
    },
    lineTo:function (x, y)
    {
        this.currentPath.shape.points.push(x, y);
        this.dirty = true;

        return this;
    },
    updateGraphics:function(){},
    quadraticCurveTo:function (cpX, cpY, toX, toY)
    {
        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length === 0)
            {
                this.currentPath.shape.points = [0, 0];
            }
        }
        else
        {
            this.moveTo(0,0);
        }

        var xa,
            ya,
            n = 20,
            points = this.currentPath.shape.points;

        if (points.length === 0)
        {
            this.moveTo(0, 0);
        }

        var fromX = points[points.length-2];
        var fromY = points[points.length-1];

        var j = 0;
        for (var i = 1; i <= n; ++i)
        {
            j = i / n;

            xa = fromX + ( (cpX - fromX) * j );
            ya = fromY + ( (cpY - fromY) * j );

            points.push( xa + ( ((cpX + ( (toX - cpX) * j )) - xa) * j ),
                         ya + ( ((cpY + ( (toY - cpY) * j )) - ya) * j ) );
        }

        this.dirty = this.boundsDirty = true;

        return this;
    },
    bezierCurveTo:function (cpX, cpY, cpX2, cpY2, toX, toY)
    {
        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length === 0)
            {
                this.currentPath.shape.points = [0, 0];
            }
        }
        else
        {
            this.moveTo(0,0);
        }

        var n = 20,
            dt,
            dt2,
            dt3,
            t2,
            t3,
            points = this.currentPath.shape.points;

        var fromX = points[points.length-2];
        var fromY = points[points.length-1];

        var j = 0;

        for (var i = 1; i <= n; ++i)
        {
            j = i / n;

            dt = (1 - j);
            dt2 = dt * dt;
            dt3 = dt2 * dt;

            t2 = j * j;
            t3 = t2 * j;

            points.push( dt3 * fromX + 3 * dt2 * j * cpX + 3 * dt * t2 * cpX2 + t3 * toX,
                         dt3 * fromY + 3 * dt2 * j * cpY + 3 * dt * t2 * cpY2 + t3 * toY);

        }

        this.dirty = this.boundsDirty = true;

        return this;
    },
    arcTo:function (x1, y1, x2, y2, radius)
    {
        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length === 0)
            {
                this.currentPath.shape.points.push(x1, y1);
            }
        }
        else
        {
            this.moveTo(x1, y1);
        }

        var points = this.currentPath.shape.points,
            fromX = points[points.length-2],
            fromY = points[points.length-1],
            a1 = fromY - y1,
            b1 = fromX - x1,
            a2 = y2   - y1,
            b2 = x2   - x1,
            mm = Math.abs(a1 * b2 - b1 * a2);

        if (mm < 1.0e-8 || radius === 0)
        {
            if (points[points.length-2] !== x1 || points[points.length-1] !== y1)
            {
                points.push(x1, y1);
            }
        }
        else
        {
            var dd = a1 * a1 + b1 * b1,
                cc = a2 * a2 + b2 * b2,
                tt = a1 * a2 + b1 * b2,
                k1 = radius * Math.sqrt(dd) / mm,
                k2 = radius * Math.sqrt(cc) / mm,
                j1 = k1 * tt / dd,
                j2 = k2 * tt / cc,
                cx = k1 * b2 + k2 * b1,
                cy = k1 * a2 + k2 * a1,
                px = b1 * (k2 + j1),
                py = a1 * (k2 + j1),
                qx = b2 * (k1 + j2),
                qy = a2 * (k1 + j2),
                startAngle = Math.atan2(py - cy, px - cx),
                endAngle   = Math.atan2(qy - cy, qx - cx);

            this.arc(cx + x1, cy + y1, radius, startAngle, endAngle, b1 * a2 > b2 * a1);
        }

        this.dirty = this.boundsDirty = true;

        return this;
    },
    arc:function(cx, cy, radius, startAngle, endAngle, anticlockwise)
    {
        anticlockwise = anticlockwise || false;

        if (startAngle === endAngle)
        {
            return this;
        }

        if( !anticlockwise && endAngle <= startAngle )
        {
            endAngle += Math.PI * 2;
        }
        else if( anticlockwise && startAngle <= endAngle )
        {
            startAngle += Math.PI * 2;
        }

        var sweep = anticlockwise ? (startAngle - endAngle) * -1 : (endAngle - startAngle);
        var segs =  Math.ceil(Math.abs(sweep) / (Math.PI * 2)) * 40;

        if(sweep === 0)
        {
            return this;
        }

        var startX = cx + Math.cos(startAngle) * radius;
        var startY = cy + Math.sin(startAngle) * radius;

        if (this.currentPath)
        {
            if (anticlockwise && this.filling)
            {
                this.currentPath.shape.points.push(cx, cy);
            }
            else
            {
                this.currentPath.shape.points.push(startX, startY);
            }
        }
        else
        {
            if (anticlockwise && this.filling)
            {

                this.moveTo(cx, cy);
            }
            else
            {
                this.moveTo(startX, startY);
            }
        }

        var points = this.currentPath.shape.points;

        var theta = sweep/(segs*2);
        var theta2 = theta*2;

        var cTheta = Math.cos(theta);
        var sTheta = Math.sin(theta);

        var segMinus = segs - 1;

        var remainder = ( segMinus % 1 ) / segMinus;

        for(var i=0; i<=segMinus; i++)
        {
            var real =  i + remainder * i;


            var angle = ((theta) + startAngle + (theta2 * real));

            var c = Math.cos(angle);
            var s = -Math.sin(angle);

            points.push(( (cTheta *  c) + (sTheta * s) ) * radius + cx,
                        ( (cTheta * -s) + (sTheta * c) ) * radius + cy);
        }

        this.dirty = this.boundsDirty = true;

        return this;
    },
    beginFill:function (color, alpha)
    {
        this.filling = true;
        this.fillColor = color || 0;
        this.fillAlpha = (alpha === undefined) ? 1 : alpha;

        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length <= 2)
            {
                this.currentPath.fill = this.filling;
                this.currentPath.fillColor = this.fillColor;
                this.currentPath.fillAlpha = this.fillAlpha;
            }
        }
        return this;
    },
    endFill:function ()
    {
        this.filling = false;
        this.fillColor = null;
        this.fillAlpha = 1;

        return this;
    },
    drawRect:function ( x, y, width, height )
    {
        this.drawShape(new _class.Rectangle(x,y, width, height));

        return this;
    },
    drawRoundedRect:function ( x, y, width, height, radius )
    {
        this.drawShape(new _class.RoundedRectangle(x, y, width, height, radius));

        return this;
    },
    drawCircle:function (x, y, radius)
    {
        this.drawShape(new _class.Circle(x,y, radius));
        return this;
    },
    drawEllipse:function (x, y, width, height)
    {
        this.drawShape(new _class.Ellipse(x, y, width, height));

        return this;
    },
    drawPolygon:function (path)
    {
        var points = path;

        if (!Array.isArray(points))
        {
            points = new Array(arguments.length);

            for (var i = 0; i < points.length; ++i)
            {
                points[i] = arguments[i];
            }
        }

        this.drawShape(new _class.Polygon(points));

        return this;
    },
    clear:function ()
    {
        this.lineWidth = 0;
        this.filling = false;

        this.dirty = true;
        this.clearDirty = true;
        this.graphicsData = [];

        return this;
    },
    generateTexture:function (renderer, resolution, scaleMode)
    {

        resolution = resolution || 1;

        var bounds = this.getLocalBounds();

        var canvasBuffer = new CanvasBuffer(bounds.width * resolution, bounds.height * resolution);

        var texture = Texture.fromCanvas(canvasBuffer.canvas, scaleMode);
        texture.baseTexture.resolution = resolution;

        canvasBuffer.context.scale(resolution, resolution);

        canvasBuffer.context.translate(-bounds.x,-bounds.y);

        CanvasGraphics.renderGraphics(this, canvasBuffer.context);

        return texture;
    },
    _renderWebGL:function (renderer)
    {    
        if (this.glDirty)
        {
            this.dirty = true;
            this.glDirty = false;
        }

        renderer.setObjectRenderer(renderer.plugins.graphics);
        renderer.plugins.graphics.render(this);

    },
    _renderCanvas:function (renderer)
    {
        if (this.isMask === true)
        {
            return;
        }

        if (this._prevTint !== this.tint) {
            this.dirty = true;
            this._prevTint = this.tint;
        }
        var context = renderer.context;
        var transform = this.worldTransform;

        if (this.blendMode !== renderer.currentBlendMode)
        {
            renderer.currentBlendMode = this.blendMode;
            context.globalCompositeOperation = renderer.blendModes[renderer.currentBlendMode];
        }

        var resolution = renderer.resolution;
        context.setTransform(
            transform.a * resolution,
            transform.b * resolution,
            transform.c * resolution,
            transform.d * resolution,
            transform.tx * resolution,
            transform.ty * resolution
        );

        CanvasGraphics.renderGraphics(this, context);
    },
    getBounds:function (matrix)
    {
        if(!this._currentBounds)
        {

            if (!this.renderable)
            {
                return Rectangle.EMPTY;
            }

            if (this.boundsDirty)
            {
                this.updateLocalBounds();

                this.glDirty = true;
                this.cachedSpriteDirty = true;
                this.boundsDirty = false;
            }

            var bounds = this._localBounds;

            var w0 = bounds.x;
            var w1 = bounds.width + bounds.x;

            var h0 = bounds.y;
            var h1 = bounds.height + bounds.y;

            var worldTransform = matrix || this.worldTransform;

            var a = worldTransform.a;
            var b = worldTransform.b;
            var c = worldTransform.c;
            var d = worldTransform.d;
            var tx = worldTransform.tx;
            var ty = worldTransform.ty;

            var x1 = a * w1 + c * h1 + tx;
            var y1 = d * h1 + b * w1 + ty;

            var x2 = a * w0 + c * h1 + tx;
            var y2 = d * h1 + b * w0 + ty;

            var x3 = a * w0 + c * h0 + tx;
            var y3 = d * h0 + b * w0 + ty;

            var x4 =  a * w1 + c * h0 + tx;
            var y4 =  d * h0 + b * w1 + ty;

            var maxX = x1;
            var maxY = y1;

            var minX = x1;
            var minY = y1;

            minX = x2 < minX ? x2 : minX;
            minX = x3 < minX ? x3 : minX;
            minX = x4 < minX ? x4 : minX;

            minY = y2 < minY ? y2 : minY;
            minY = y3 < minY ? y3 : minY;
            minY = y4 < minY ? y4 : minY;

            maxX = x2 > maxX ? x2 : maxX;
            maxX = x3 > maxX ? x3 : maxX;
            maxX = x4 > maxX ? x4 : maxX;

            maxY = y2 > maxY ? y2 : maxY;
            maxY = y3 > maxY ? y3 : maxY;
            maxY = y4 > maxY ? y4 : maxY;

            this._bounds.x = minX;
            this._bounds.width = maxX - minX;

            this._bounds.y = minY;
            this._bounds.height = maxY - minY;

            this._currentBounds = this._bounds;
        }

        return this._currentBounds;
    },
    containsPoint:function( point )
    {
        this.worldTransform.applyInverse(point,  tempPoint);

        var graphicsData = this.graphicsData;

        for (var i = 0; i < graphicsData.length; i++)
        {
            var data = graphicsData[i];

            if (!data.fill)
            {
                continue;
            }

            if (data.shape)
            {
                if ( data.shape.contains( tempPoint.x, tempPoint.y ) )
                {
                    return true;
                }
            }
        }

        return false;
    },
    updateLocalBounds:function ()
    {
        var minX = Infinity;
        var maxX = -Infinity;

        var minY = Infinity;
        var maxY = -Infinity;

        if (this.graphicsData.length)
        {
            var shape, points, x, y, w, h;

            for (var i = 0; i < this.graphicsData.length; i++)
            {
                var data = this.graphicsData[i];
                var type = data.type;
                var lineWidth = data.lineWidth;
                shape = data.shape;

                if (type === CONST.SHAPES.RECT || type === CONST.SHAPES.RREC)
                {
                    x = shape.x - lineWidth/2;
                    y = shape.y - lineWidth/2;
                    w = shape.width + lineWidth;
                    h = shape.height + lineWidth;

                    minX = x < minX ? x : minX;
                    maxX = x + w > maxX ? x + w : maxX;

                    minY = y < minY ? y : minY;
                    maxY = y + h > maxY ? y + h : maxY;
                }
                else if (type === CONST.SHAPES.CIRC)
                {
                    x = shape.x;
                    y = shape.y;
                    w = shape.radius + lineWidth/2;
                    h = shape.radius + lineWidth/2;

                    minX = x - w < minX ? x - w : minX;
                    maxX = x + w > maxX ? x + w : maxX;

                    minY = y - h < minY ? y - h : minY;
                    maxY = y + h > maxY ? y + h : maxY;
                }
                else if (type === CONST.SHAPES.ELIP)
                {
                    x = shape.x;
                    y = shape.y;
                    w = shape.width + lineWidth/2;
                    h = shape.height + lineWidth/2;

                    minX = x - w < minX ? x - w : minX;
                    maxX = x + w > maxX ? x + w : maxX;

                    minY = y - h < minY ? y - h : minY;
                    maxY = y + h > maxY ? y + h : maxY;
                }
                else
                {
                    points = shape.points;

                    for (var j = 0; j < points.length; j += 2)
                    {
                        x = points[j];
                        y = points[j+1];

                        minX = x-lineWidth < minX ? x-lineWidth : minX;
                        maxX = x+lineWidth > maxX ? x+lineWidth : maxX;

                        minY = y-lineWidth < minY ? y-lineWidth : minY;
                        maxY = y+lineWidth > maxY ? y+lineWidth : maxY;
                    }
                }
            }
        }
        else
        {
            minX = 0;
            maxX = 0;
            minY = 0;
            maxY = 0;
        }

        var padding = this.boundsPadding;

        this._localBounds.x = minX - padding;
        this._localBounds.width = (maxX - minX) + padding * 2;

        this._localBounds.y = minY - padding;
        this._localBounds.height = (maxY - minY) + padding * 2;
    },
    drawShape:function (shape)
    {
        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length <= 2)
            {
                this.graphicsData.pop();
            }
        }

        this.currentPath = null;

        var data = new GraphicsData(this.lineWidth, this.lineColor, this.lineAlpha, this.fillColor, this.fillAlpha, this.filling, shape);

        this.graphicsData.push(data);

        if (data.type === CONST.SHAPES.POLY)
        {
            data.shape.closed = this.filling;
            this.currentPath = data;
        }

        this.dirty = this.boundsDirty = true;

        return data;
    },
    destroy:function () {
        Container.prototype.destroy.apply(this, arguments);

        for (var i = 0; i < this.graphicsData.length; ++i) {
            this.graphicsData[i].destroy();
        }

        for (var id in this._webgl) {
            for (var j = 0; j < this._webgl[id].data.length; ++j) {
                this._webgl[id].data[j].destroy();
            }
        }

        this.graphicsData = null;
        this.currentPath = null;
        this._webgl = null;
        this._localBounds = null;

    }
},{
   
    width: {
        get: function ()
        {
            return this.scale.x * this.getLocalBounds().width;
        },
        set: function (value)
        {

            var width = this.getLocalBounds().width;

            if (width !== 0)
            {
                this.scale.x = value / width;
            }
            else
            {
                this.scale.x = 1;
            }


            this._width = value;
        },
        enumerable: true,
        configurable: true
    },

    height: {
        get: function ()
        {
            return  this.scale.y * this.getLocalBounds().height;
        },
        set: function (value)
        {

            var height = this.getLocalBounds().height;

            if (height !== 0)
            {
                this.scale.y = value / height ;
            }
            else
            {
                this.scale.y = 1;
            }

            this._height = value;
        },
        enumerable: true,
        configurable: true
    }
});


var Graphics = _class({
    className:'BaseGraphics',
    extend:'Container',
    constructor:function(_super){
        _super.call(this);

        this._update = false;

        this._fillAlpha = 1;
        this._fillColor = 0;
        this._lineWidth = 0;
        this._lineColor = 0;

        this._lineAlpha = 1;

        

        this.graphicsData = [];
        this.tint = 0xFFFFFF;
        this._prevTint = 0xFFFFFF;
        this.blendMode = CONST.BLEND_MODES.NORMAL;
        this.currentPath = null;
        this._webGL = {};
        this.isMask = false;
        this.boundsPadding = 0;
        this._localBounds = new Rectangle(0,0,1,1);
        this.dirty = true;
        this.glDirty = false;
        this.boundsDirty = true;
        this.cachedSpriteDirty = false;

        // if(this instanceof Graphics)this.set(a);

    },
    clone:function ()
    {
        var clone = new Graphics();

        clone.renderable    = this.renderable;
        clone.fillAlpha     = this._fillAlpha;
        clone.lineWidth     = this._lineWidth;
        clone.lineColor     = this._lineColor;
        clone.tint          = this.tint;
        clone.blendMode     = this.blendMode;
        clone.isMask        = this.isMask;
        clone.boundsPadding = this.boundsPadding;
        clone.dirty         = this.dirty;
        clone.glDirty       = this.glDirty;
        clone.cachedSpriteDirty = this.cachedSpriteDirty;

        for (var i = 0; i < this.graphicsData.length; ++i)
        {
            clone.graphicsData.push(this.graphicsData[i].clone());
        }

        clone.currentPath = clone.graphicsData[clone.graphicsData.length - 1];

        clone.updateLocalBounds();

        return clone;
    },
    lineStyle:function (lineWidth, color, alpha)
    {
        this.lineWidth = lineWidth || 0;
        this.lineColor = color || 0;
        this.lineAlpha = (alpha === undefined) ? 1 : alpha;

        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length)
            {
                this.drawShape( new _class.Polygon( this.currentPath.shape.points.slice(-2) ));
            }
            else
            {
                this.currentPath.lineWidth = this.lineWidth;
                this.currentPath.lineColor = this.lineColor;
                this.currentPath.lineAlpha = this.lineAlpha;
            }
        }

        return this;
    },
    beginFill:function (color, alpha)
    {
        this.filling = true;
        this._fillColor = color || 0;
        this._fillAlpha = (alpha === undefined) ? 1 : alpha;

        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length <= 2)
            {
                this.currentPath.fill = this.filling;
                this.currentPath.fillColor = this._fillColor;
                this.currentPath.fillAlpha = this._fillAlpha;
            }
        }
        this._update = true;
        return this;
    },
    endFill:function ()
    {
        this.filling = false;
        this.fillColor = null;
        this.fillAlpha = 1;

        return this;
    },
    clear:function ()
    {
        this._lineWidth = 0;
        this.filling = false;

        this.dirty = true;
        this.clearDirty = true;
        this.graphicsData = [];

        return this;
    },
    generateTexture:function (renderer, resolution, scaleMode)
    {

        resolution = resolution || 1;

        var bounds = this.getLocalBounds();

        var canvasBuffer = new CanvasBuffer(bounds.width * resolution, bounds.height * resolution);

        var texture = Texture.fromCanvas(canvasBuffer.canvas, scaleMode);
        texture.baseTexture.resolution = resolution;

        canvasBuffer.context.scale(resolution, resolution);

        canvasBuffer.context.translate(-bounds.x,-bounds.y);

        CanvasGraphics.renderGraphics(this, canvasBuffer.context);

        return texture;
    },
    _renderWebGL:function (renderer)
    {   
        if(this._update){
            this.updateGraphics();
            this._update = false;
        } 

        if (this.glDirty)
        {
            this.dirty = true;
            this.glDirty = false;
        }

        renderer.setObjectRenderer(renderer.plugins.graphics);
        renderer.plugins.graphics.render(this);

    },
    _renderCanvas:function (renderer)
    {


        if(this._update){
            this.updateGraphics();
            this._update = false;
        }

        if (this.isMask === true)
        {
            return;
        }



        if (this._prevTint !== this.tint) {
            this.dirty = true;
            this._prevTint = this.tint;
        }
        var context = renderer.context;
        var transform = this.worldTransform;

        if (this.blendMode !== renderer.currentBlendMode)
        {
            renderer.currentBlendMode = this.blendMode;
            context.globalCompositeOperation = renderer.blendModes[renderer.currentBlendMode];
        }

        var resolution = renderer.resolution;
        context.setTransform(
            transform.a * resolution,
            transform.b * resolution,
            transform.c * resolution,
            transform.d * resolution,
            transform.tx * resolution,
            transform.ty * resolution
        );

        CanvasGraphics.renderGraphics(this, context);
    },
    getBounds:function (matrix)
    {
        if(!this._currentBounds)
        {

            if (!this.renderable)
            {
                return Rectangle.EMPTY;
            }

            if (this.boundsDirty)
            {
                this.updateLocalBounds();

                this.glDirty = true;
                this.cachedSpriteDirty = true;
                this.boundsDirty = false;
            }

            var bounds = this._localBounds;

            var w0 = bounds.x;
            var w1 = bounds.width + bounds.x;

            var h0 = bounds.y;
            var h1 = bounds.height + bounds.y;

            var worldTransform = matrix || this.worldTransform;

            var a = worldTransform.a;
            var b = worldTransform.b;
            var c = worldTransform.c;
            var d = worldTransform.d;
            var tx = worldTransform.tx;
            var ty = worldTransform.ty;

            var x1 = a * w1 + c * h1 + tx;
            var y1 = d * h1 + b * w1 + ty;

            var x2 = a * w0 + c * h1 + tx;
            var y2 = d * h1 + b * w0 + ty;

            var x3 = a * w0 + c * h0 + tx;
            var y3 = d * h0 + b * w0 + ty;

            var x4 =  a * w1 + c * h0 + tx;
            var y4 =  d * h0 + b * w1 + ty;

            var maxX = x1;
            var maxY = y1;

            var minX = x1;
            var minY = y1;

            minX = x2 < minX ? x2 : minX;
            minX = x3 < minX ? x3 : minX;
            minX = x4 < minX ? x4 : minX;

            minY = y2 < minY ? y2 : minY;
            minY = y3 < minY ? y3 : minY;
            minY = y4 < minY ? y4 : minY;

            maxX = x2 > maxX ? x2 : maxX;
            maxX = x3 > maxX ? x3 : maxX;
            maxX = x4 > maxX ? x4 : maxX;

            maxY = y2 > maxY ? y2 : maxY;
            maxY = y3 > maxY ? y3 : maxY;
            maxY = y4 > maxY ? y4 : maxY;

            this._bounds.x = minX;
            this._bounds.width = maxX - minX;

            this._bounds.y = minY;
            this._bounds.height = maxY - minY;

            this._currentBounds = this._bounds;
        }

        return this._currentBounds;
    },
    containsPoint:function( point )
    {
        this.worldTransform.applyInverse(point,  tempPoint);

        var graphicsData = this.graphicsData;

        for (var i = 0; i < graphicsData.length; i++)
        {
            var data = graphicsData[i];

            if (!data.fill)
            {
                continue;
            }

            if (data.shape)
            {
                if ( data.shape.contains( tempPoint.x, tempPoint.y ) )
                {
                    return true;
                }
            }
        }

        return false;
    },
    updateLocalBounds:function ()
    {
        var minX = Infinity;
        var maxX = -Infinity;

        var minY = Infinity;
        var maxY = -Infinity;

        if (this.graphicsData.length)
        {
            var shape, points, x, y, w, h;

            for (var i = 0; i < this.graphicsData.length; i++)
            {
                var data = this.graphicsData[i];
                var type = data.type;
                var lineWidth = data.lineWidth;
                shape = data.shape;

                if (type === CONST.SHAPES.RECT || type === CONST.SHAPES.RREC)
                {
                    x = shape.x - lineWidth/2;
                    y = shape.y - lineWidth/2;
                    w = shape.width + lineWidth;
                    h = shape.height + lineWidth;

                    minX = x < minX ? x : minX;
                    maxX = x + w > maxX ? x + w : maxX;

                    minY = y < minY ? y : minY;
                    maxY = y + h > maxY ? y + h : maxY;
                }
                else if (type === CONST.SHAPES.CIRC)
                {
                    x = shape.x;
                    y = shape.y;
                    w = shape.radius + lineWidth/2;
                    h = shape.radius + lineWidth/2;

                    minX = x - w < minX ? x - w : minX;
                    maxX = x + w > maxX ? x + w : maxX;

                    minY = y - h < minY ? y - h : minY;
                    maxY = y + h > maxY ? y + h : maxY;
                }
                else if (type === CONST.SHAPES.ELIP)
                {
                    x = shape.x;
                    y = shape.y;
                    w = shape.width + lineWidth/2;
                    h = shape.height + lineWidth/2;

                    minX = x - w < minX ? x - w : minX;
                    maxX = x + w > maxX ? x + w : maxX;

                    minY = y - h < minY ? y - h : minY;
                    maxY = y + h > maxY ? y + h : maxY;
                }
                else
                {
                    points = shape.points;

                    for (var j = 0; j < points.length; j += 2)
                    {
                        x = points[j];
                        y = points[j+1];

                        minX = x-lineWidth < minX ? x-lineWidth : minX;
                        maxX = x+lineWidth > maxX ? x+lineWidth : maxX;

                        minY = y-lineWidth < minY ? y-lineWidth : minY;
                        maxY = y+lineWidth > maxY ? y+lineWidth : maxY;
                    }
                }
            }
        }
        else
        {
            minX = 0;
            maxX = 0;
            minY = 0;
            maxY = 0;
        }

        var padding = this.boundsPadding;

        this._localBounds.x = minX - padding;
        this._localBounds.width = (maxX - minX) + padding * 2;

        this._localBounds.y = minY - padding;
        this._localBounds.height = (maxY - minY) + padding * 2;
    },
    drawShape:function (shape)
    {
        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length <= 2)
            {
                this.graphicsData.pop();
            }
        }

        this.currentPath = null;

        var data = new GraphicsData(this.lineWidth, this.lineColor, this.lineAlpha, this.fillColor, this.fillAlpha, this.filling, shape);

        this.graphicsData.push(data);

        if (data.type === CONST.SHAPES.POLY)
        {
            data.shape.closed = this.filling;
            this.currentPath = data;
        }

        this.dirty = this.boundsDirty = true;

        return data;
    },
    updateGraphics:function(){


    },
    destroy:function () {
        Container.prototype.destroy.apply(this, arguments);

        for (var i = 0; i < this.graphicsData.length; ++i) {
            this.graphicsData[i].destroy();
        }

        for (var id in this._webgl) {
            for (var j = 0; j < this._webgl[id].data.length; ++j) {
                this._webgl[id].data[j].destroy();
            }
        }

        this.graphicsData = null;
        this.currentPath = null;
        this._webgl = null;
        this._localBounds = null;

    }
},{

    fillAlpha: {
        get: function ()
        {
            return this._fillAlpha;
        },
        set: function (value)
        {
            this._update = true;
            this._fillAlpha = value;
        }
    },
    fillColor: {
        get: function ()
        {
            return this._fillColor;
        },
        set: function (value)
        {
            this._update = true;
            this._fillColor = value;
        }
    },
    lineWidth: {
        get: function ()
        {
            return this._lineWidth;
        },
        set: function (value)
        {
            if(typeof value === 'string')
            value = fn.getPix(value);
            this._update = true;
            this._lineWidth = value;
        }
    },
    lineColor: {
        get: function ()
        {
            return this._lineColor;
        },
        set: function (value)
        {
            if(typeof value === 'string')
            value = fn.getPix(value);

            this._update = true;
            this._lineColor = value;
        }
    },
    lineAlpha: {
        get: function ()
        {
            return this._lineAlpha;
        },
        set: function (value)
        {
            this._update = true;
            this._lineAlpha = value;
        }
    },

    
   
    width: {
        get: function ()
        {
            return this.scale.x * this.getLocalBounds().width;
        },
        set: function (value)
        {
            if(typeof value === 'string')
            value = fn.getPix(value);

            var width = this.getLocalBounds().width;

            if (width !== 0)
            {
                this.scale.x = value / width;
            }
            else
            {
                this.scale.x = 1;
            }
            his._update = true;

            this._width = value;
        },
        enumerable: true,
        configurable: true
    },

    height: {
        get: function ()
        {
            return  this.scale.y * this.getLocalBounds().height;
        },
        set: function (value)
        {
            if(typeof value === 'string')
            value = fn.getPix(value);
            var height = this.getLocalBounds().height;

            if (height !== 0)
            {
                this.scale.y = value / height ;
            }
            else
            {
                this.scale.y = 1;
            }
            his._update = true;

            this._height = value;
        },
        enumerable: true,
        configurable: true
    }
});





var Rect = _class({
    className:'Rect',
    extend:'BaseGraphics',
    constructor:function( _super , a ){

        _super.call(this);

        if(this instanceof Rect)this.set(a);

        this.updateGraphics();

    },
    updateGraphics:function(){

        this.filling = true;
        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length <= 2)
            {
                this.currentPath.fill = this.filling;
                this.currentPath.fillColor = this._fillColor;
                this.currentPath.fillAlpha = this._fillAlpha;
            }
        }

        this.lineAlpha = 1;

        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length)
            {
                this.drawShape( new _class.Polygon( this.currentPath.shape.points.slice(-2) ));
            }
            else
            {
                this.currentPath.lineWidth = this.lineWidth;
                this.currentPath.lineColor = this.lineColor;
                this.currentPath.lineAlpha = this.lineAlpha;
            }
        }
      
        this.drawShape(new Rectangle( 0, 0, this._width, this._height));
    }
    // ,
    // drawRect:function ( x, y, width, height )
    // {
    //     this.drawShape(new Rectangle( x, y, width, height));
    //     return this;

    // }
 },{
    width: {
        get: function ()
        {
            return this.scale.x * this.getLocalBounds().width;
        },
        set: function (value)
        {
            if(typeof value === 'string')
            value = fn.getPix(value);

            var width = this.getLocalBounds().width;

            if (width !== 0)
            {
                this.scale.x = value / width;
            }
            else
            {
                this.scale.x = 1;
            }
            this._update = true;

            this._width = value;
        }
    },

    height: {
        get: function ()
        {
            return  this.scale.y * this.getLocalBounds().height;
        },
        set: function (value)
        {
            if(typeof value === 'string')
            value = fn.getPix(value);

            var height = this.getLocalBounds().height;

            if (height !== 0)
            {
                this.scale.y = value / height ;
            }
            else
            {
                this.scale.y = 1;
            }
            this._update = true;
            this._height = value;
        }
    }
 });




_class({
    className:'BlurDirFilter',
    extend:'AbstractFilter',
    constructor:function( _super, dirX, dirY)
    {
        _super.call(this,
            'attribute vec2 aVertexPosition;'+
            'attribute vec2 aTextureCoord;'+
            'attribute vec4 aColor;'+
            'uniform float strength;'+
            'uniform float dirX;'+
            'uniform float dirY;'+
            'uniform mat3 projectionMatrix;'+
            'varying vec2 vTextureCoord;'+
            'varying vec4 vColor;'+
            'varying vec2 vBlurTexCoords[3];'+
            'void main(void)'+
            '{'+
            '    gl_Position = vec4((projectionMatrix * vec3((aVertexPosition), 1.0)).xy, 0.0, 1.0);'+
            '    vTextureCoord = aTextureCoord;'+
            '    vBlurTexCoords[0] = aTextureCoord + vec2( (0.004 * strength) * dirX, (0.004 * strength) * dirY );'+
            '    vBlurTexCoords[1] = aTextureCoord + vec2( (0.008 * strength) * dirX, (0.008 * strength) * dirY );'+
            '    vBlurTexCoords[2] = aTextureCoord + vec2( (0.012 * strength) * dirX, (0.012 * strength) * dirY );'+
            '    vColor = vec4(aColor.rgb * aColor.a, aColor.a);'+
            '}',
           
            'precision lowp float;'+
            'varying vec2 vTextureCoord;'+
            'varying vec2 vBlurTexCoords[3];'+
            'varying vec4 vColor;'+
            'uniform sampler2D uSampler;'+
            'void main(void)'+
            '{'+
            '    gl_FragColor = vec4(0.0);'+
            '    gl_FragColor += texture2D(uSampler, vTextureCoord     ) * 0.3989422804014327;'+
            '    gl_FragColor += texture2D(uSampler, vBlurTexCoords[ 0]) * 0.2419707245191454;'+
            '    gl_FragColor += texture2D(uSampler, vBlurTexCoords[ 1]) * 0.05399096651318985;'+
            '    gl_FragColor += texture2D(uSampler, vBlurTexCoords[ 2]) * 0.004431848411938341;'+
            '}' ,
            {
                strength: { type: '1f', value: 10 },
                dirX: { type: '1f', value: dirX || 0 },
                dirY: { type: '1f', value: dirY || 0 }
            }
        );

        this.defaultFilter = new AbstractFilter();

        this.passes = 1;

        this.dirX = dirX || 0;

        this.dirY = dirY || 0;

        this.strength = 4;
    },
    applyFilter:function (renderer, input, output, clear) {

        var shader = this.getShader(renderer);

        this.uniforms.strength.value = this.strength / 4 / this.passes * (input.frame.width / input.size.width);

        if (this.passes === 1) {
            renderer.filterManager.applyFilter(shader, input, output, clear);
        } else {
            var renderTarget = renderer.filterManager.getRenderTarget(true);

            renderer.filterManager.applyFilter(shader, input, renderTarget, clear);

            for(var i = 0; i < this.passes-2; i++)
            {
                //this.uniforms.strength.value = this.strength / 4 / (this.passes+(i*2)) * (input.frame.width / input.size.width);
                renderer.filterManager.applyFilter(shader, renderTarget, renderTarget, clear);
            }

            renderer.filterManager.applyFilter(shader, renderTarget, output, clear);

            renderer.filterManager.returnRenderTarget(renderTarget);
        }
    }
},{
    /**
     * Sets the strength of both the blur.
     *
     * @member {number}
     * @memberof BlurDirFilter#
     * @default 2
     */
    blur: {
        get: function ()
        {
            return this.strength;
        },
        set: function (value)
        {
            this.padding = value * 0.5;
            this.strength = value;
        }
    },
    /**
     * Sets the X direction of the blur.
     *
     * @member {number}
     * @memberof BlurYFilter#
     * @default 0
     */
    dirX: {
        get: function ()
        {
            return this.dirX;
        },
        set: function (value)
        {
            this.uniforms.dirX.value = value;
        }
    },
    /**
     * Sets the Y direction of the blur.
     *
     * @member {number}
     * @memberof BlurDirFilter#
     * @default 0
     */
    dirY: {
        get: function ()
        {
            return this.dirY;
        },
        set: function (value)
        {
            this.uniforms.dirY.value = value;
        }
    }
});





!function(){

var arr = [] , resall = {} ,

DefImg = null,

loader = {

    getResall:function(a){

        return resall[a];

    },

    loadImage:function( _url , __ck , err , ty){

        if(ty === 'ajax'){
            Q.ajax({
                responseType:'blob',
                url:_url,
                done:function(a){
                    var bl = fn.createURL(a),
                    im = new Image();
                    im.src = bl;
                    im.onload = function(){
                        fn.revokeURL(bl);
                        __ck(im)
                    }
                }
            });
        }else{
            var im = new Image();
            im.src = _url;
            im.onload = function(){
                __ck(im)
            }
        }
    },

    loadImages:function(a){ 
        if(!a.res.length)return;
        var _arr={},i=0,count=0,l=a.res.length,ts=this,pa;
        a.res.forEach(function(me){
            if(me.syn === false){
                
                _arr[me.name] = DefImg;
                count++;
                a.caking&&a.caking(count,rLength,me.name,me.src);
                count==l&&a.cak(_arr);

                ts.loadImage(me.src,function(im){
                    _arr[me.name] = im;
                });
            
            }else{

                ts.loadImage(me.src,function(im){
                    count++;
                    _arr[me.name] = im;
                    a.caking&&a.caking(count,l,me.name,me.src);
                    count==l&&a.cak(_arr);

                });

            }
        });
    },

    loadAudio:function( _url , __ck , err , ty){
        
        Q.ajax({
            responseType:'blob',
            url:_url,
            done:function(a){

                
                var bl = fn.createURL(a),
                _im = new Audio(bl),im;
                if(Q.ios){
                    im = {
                        paused:true,play:function(){
                        this.paused=false;
                    },obj:_im};
                }else{im = _im;}
                __ck(im);
            }
        });

    },
    loadAudios:function(a){ 
        if(!a.res.length)return;
        var _arr={},i=0,count=0,l=a.res.length,ts=this,bf;
        a.res.forEach(function(me){
            ts.loadAudio(me.src,function(im){
                
                count++;
                a.caking&&a.caking(count,l,me.name,me.src);
                _arr[me.name] = im;
                if(count==l){

                    if(Q.ios){
                        bf = function(){
                            for(var ii in _arr){
                                _arr[ii].obj.play();
                                if(_arr[ii].paused)_arr[ii].obj.pause();
                                _arr[ii] = _arr[ii].obj;
                            }
                            window.removeEventListener('touchstart',bf);
                        }
                        window.addEventListener('touchstart',bf,false);
                    }

                    a.cak(_arr);
                }
            });
        });
    },

    loadRequires:function(a){


        if(!a.res.length)return;
        var _arr={},i=0,count=0,l=a.res.length,ts=this,bf;
        a.res.forEach(function(me){

            Q.require({src:me.src,cak:function(im){
                
                count++;
                a.caking&&a.caking(count,l,me.name,me.src);
                me.cak&&me.cak(im);
                if(count==l)a.cak(_arr);

            }});
        });
    },

    getImage:function(n){

        return resall.image&&resall.image[n];

    },

    getAudio:function(n){

        return resall.audio&&resall.audio[n]
    },

    ref:{image:'loadImages',audio:'loadAudios',require:'loadRequires'},

    loadRes:function( Res , cak , caking ,ty){
        var count = 0 , rLength = 0 , i , idx = 0, ts = this , jzs = [];

        for(i in Res)if(Res[i].length>0){
            rLength+=Res[i].length;
            if(this.ref[i])jzs.push(i);
        }

        if(rLength==0)return cak&&cak();
      
        !function lods(who){
            idx++;
            resall[who] = resall[who]||{};
            var fn = ts[ts.ref[who]],
                ops = {
                    res:Res[who],
                    cak:function(_arr){
                        _arr&&Q.fn.coverOwn(resall[who],_arr);
                        if(count==rLength)return cak&&cak(resall);
                        lods(jzs[idx]);
                    }
                };
                ops.caking = caking ? function(_count,_rLength,_name,src){
                count++;
                caking(count,rLength,_name,src);
            }:function(){count++};
            fn.call(ts,ops);
        }(jzs[idx]);
    }
};

miao.resall = resall;

miao.R = loader;

}();


miao.Transitions = function(renderer){


// var renderer = renderer;

var trnA = new RenderTexture(renderer);
var trnB = new RenderTexture(renderer);

// var imA = new _Image({texture:trnA});
// var imB = new _Image({texture:trnB});

!function(trn){

trn.default = trn.small = function(op){
   
    var imA = new _Image({
        texture:op.textureA,//new Texture(op.textureA.baseTexture),
        width:  op.textureA.width,
        height: op.textureA.height,
        x:0,
        y:0
    });

    var imB = new _Image({
        texture:op.textureB,//new Texture(op.textureB.baseTexture),
        width:  op.textureB.width,
        height: op.textureB.height,
        x:op.textureB.width
    });

    op.container.addChild(imA);
    op.container.addChild(imB);

    imB.animate({
        to:{
            x:0
        },
        time:1000,
        ease:miao.Tween.ease.Quartic.Out,
        onComplete:op.cak
    });

    imA.animate({
        to:{
            x:-op.textureB.width
        },
        time:1000,
        ease:miao.Tween.ease.Quartic.Out
    });
};

}(

//a过渡a  b过渡b c是过度效果的绘制对象c，没有责绘制在系统ui. d 过度后的回调。

miao.Transitions = function(op){

      var a = op.ta,
            b = op.tb,
            c = new Container(),
            d = op.cak,
            parent = op.container||miao.app.container ;

        trnA.resize(a.width,a.height);
        trnB.resize(b.width,b.height);
        
        trnA.render(a,false,true);
        trnB.render(b,false,true);


        miao.app.run = function(){
            miao.app.autoRender = false;
            miao.app.renderer.render(c);
        }

        var _enabled = miao.app.container.enabled;

        miao.app.container.enabled = false;

        if(op.wd !== false){
            var gui_v = miao.app.GUI.visible;
            var aty_v = miao.app.atyView.visible;
            miao.app.GUI.visible = false;
            miao.app.atyView.visible = false;
        }

        (op.transitions||miao.Transitions.default)({
            textureA:trnA,
            textureB:trnB,
            container:c,
            cak:function(){
                miao.app.autoRender = true ;
                miao.app.container.enabled = _enabled;
                if(op.wd !== false){
                    miao.app.GUI.visible = gui_v;
                    miao.app.atyView.visible = aty_v;
                }
                d&&d();
            }
        });
    });
};



var View = _class({
    className:'View',
    extend:'Container',
    constructor:function(_super , a){

        a=a||{};

        _super.call(this);

        if(a.name){ g.viewsCache[a.name] = this };

        this.backgroundColor = null;

        this.root = null ;

        this._width = a.width || Q.app.width;
        this._height = a.height || Q.app.height;

        message.once(this,'init',this._init);

        this.backgroundColor=0x000000;

        this.set(a);

    },
    
    // interaction:function(point,name,ops){

    //     var ev = this.__listeners[name];
    //     if(ev){
    //         for(var i in ev){
    //             if(ev[i].interaction(point,name,ops)) return true;
    //         }
    //     }

    // },
    addInteraction:function(n){

        //message.bind(this,n,this.parent);
        //this.parent.addInteraction(n);
        return this;

    },
    destroy:function (destroyBaseTexture){

        this.context = null;
        this.canvas = null;
        this._style = null;
        this._texture.destroy(destroyBaseTexture === undefined ? true : destroyBaseTexture);

    },
    run:function(){},
    _init:function (n){

        // message.inj(this,'up',function(e){
        //     var ax,obj;
        //     if(this.__listeners&&(ax=this.__listeners['up']))
        //     for(var i = ax.length-1;i>=0;i--){
        //         obj = ax[i];
        //         if(obj.enabled&&obj.interaction(miao.event.now,'up'))
        //         return true;
        //     }
        // });

        // message.inj(this,'down',function(e){
            
        //     var ax,obj;
        //     if(this.__listeners&&(ax=this.__listeners['down']))
        //     for(var i = ax.length-1;i>=0;i--){
        //         obj = ax[i];
        //         //console.log(obj.enabled,obj.name)
        //         if(obj.enabled&&obj.interaction(miao.event.now,'down'))
        //         return true;
        //     }
        // });

        // message.inj(this,'move',function(e){
        //     //console.log(1,'mo')
        //     var ax,obj;
        //     if(this.__listeners&&(ax=this.__listeners['move']))
        //     for(var i = ax.length-1;i>=0;i--){
        //         obj = ax[i];
        //         if(obj.enabled&&obj.interaction(miao.event.now,'move'))
        //         return true;
        //     }
        // });
    },
    upBackgroundColor:function(){

        if(!this.__backgroundColor){
            this.__backgroundColor = new Rect({depth:-1000,width:miao.app.width,height:miao.app.height,fillColor:this._backgroundColor});
            this.addChild(this.__backgroundColor);
        }else{
            this.__backgroundColor.fillColor = this._backgroundColor;
        }
    }
},{

    backgroundColor: {

        get: function ()
        {
            return this._backgroundColor
        },
        set: function (value)
        {
            this._backgroundColor = value;
            this.upBackgroundColor();
        }
    },
    width: {
        get: function ()
        {
            return this.scale.x * this._width;
        },
        set: function (value)
        {

            var width = this._width;

            if (width !== 0)
            {
                this.scale.x = value / width;
            }
            else
            {
                this.scale.x = 1;
            }
            this._width = value;
        }
    },

    height: {
        get: function ()
        {
            return  this.scale.y * this._height;
        },
        set: function (value)
        {

            var height = this._height;

            if (height !== 0)
            {
                this.scale.y = value / height ;
            }
            else
            {
                this.scale.y = 1;
            }

            this._height = value;
        }
    }
});


var Navbar = _class({
    className:'Navbar',
    extend:'Container',
    constructor:function(_super){
        _super.call(this);
        this.refName = null;
        this.ref = null;
        this._margin = {
            top:0,
            bottom:0,
            left:0,
            right:0
        };
        this.width = miao.app.width;
        this.height = miao.app.width*.15;
        this.backgroundColor = 0xeeeeee;
        if(this instanceof Navbar)this.set(a);
        this._init();
    },
    _init:function(){
        // this.
    },
    update:function(){

        var children = this.children;

        
    },
    items:function(a){


    }
});






var App = _class({
    
    className:'App',
    constructor:function(a){
        if(miao.app)return miao.app;

        a= a||{};

        Q.app = this;

        this.resolution = a.resolution || 1;

        if(a.element){

            this.element = a.element;
            this.width  = this.element.clientWidth;
            this.height = this.element.clientHeight;

        }else{

            this.element = document.body;
            this.width  = document.documentElement.clientWidth;
            this.height = document.documentElement.clientHeight;

        }

        this.atyView = new _class.View();

        this.renderer = null;

        this._lastView = null;

        this.GUI = new Container();

        var container = new Container();

        container.addChild(this.atyView);

        container.addChild(this.GUI);

        this.container =container;

        this.autoRender = true;

        if(a.listener){
            for(var i in a.listener){
                if(fn.isF(a.listener[i]))
                message.on(this,i,a.listener[i]);
            }
        }

        message.trigger(this,'advance',this._init.bind(this,a));

        this._init(a);

    },
    update:function(){

        if(this.run)this.run();//this.atyView.run();
        this.autoRender&&this.renderer.render(this.container);
       
    },
    _init:function(a){

        message.inj(this,'down',function(e){

            // console.log('dsfdf')

            this.container.interaction(miao.event.now,'down',e);

        });

        message.inj(this,'move',function(e){

            this.container.interaction(miao.event.now,'move',e);
            // this.GUI.interaction(miao.event.now,'move');
            // message.trigger(this.atyView,'move');
        });

        message.inj(this,'up',function(e){

            this.container.interaction(miao.event.now,'up',e);
            // message.trigger(this.atyView,'up');
        });

        utils.setRenderer(this);

        this.renderer.backgroundColor = 0x000000;

        pulse.setHand(this.update.bind(this));

        if(!Q.pulse.sw)pulse.start();

        if(a.R){
            miao.R.loadRes(a.R,function(){

                message.trigger(miao.app,'init');
            },function(a,b,c,d){
                
                message.trigger(miao.app,'loading',{i:a,length:b,name:c,src:d});
            });
        }else{
            message.trigger(this,'init');
        }

    },
    // interaction:function(point,name,ops){



    //     message.trigger(this.atyView,name);

    //     this.GUI.interaction(miao.event.now,'move');
    //     message.trigger(this.atyView,name);

    // },

    backView:function(a,b){
        if(this._lastView)this.go(this._lastView,a,b);
        return this;
    },

    getView:function(a){
        if(!a){
            return this.atyView;
        }else if(g.viewsCache[a]){
            return g.viewsCache[a];
        }
    },

    go:function(a,b,c){

        var  acy;
        
        if(fn.isS(a)){

          acy = this.getView(a);
          if(!acy)return;

        }else if( fn.inof(a,'View') ) {

          acy = a;

        }else{return}

        g.selector = acy;

        var now = this._lastView = this.atyView;
        var the = this;

        if(acy.backgroundColor != this.renderer.backgroundColor)
            this.renderer.backgroundColor = acy.backgroundColor ;

        message.trigger(acy,'fast',b);

        if(fn.isF(c)){
            miao.Transitions({
                ta:now,
                tb:acy,
                cak:qie,
                transitions:c
            });

        }else{
            qie();
        }


        function qie(){

            acy.parent = the.container;
            the.container.children[0] = acy;

            if(now){
                message.trigger(now,'unload');
                //now.visible = false;
            }

            acy.visible = true; 
            the.atyView = acy;
            acy.renderer = the.renderer;
            message.trigger(acy,'init',b);
            message.trigger(acy,'toggle',b);

            the.run = acy.run || false;

            // console.log(the.run);

        }
    }
});



return miao;

}));

