

!function(){

var CONST = Q.CONST, utils  = {
   
    _uid: 0,

    _saidHello: false,

    //注入插件
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

   //把16进制转换成[R,G,B]颜色数组
    hex2rgb: function (hex, out)
    {
        out = out || [];

        out[0] = (hex >> 16 & 0xFF) / 255;
        out[1] = (hex >> 8 & 0xFF) / 255;
        out[2] = (hex & 0xFF) / 255;

        return out;
    },

    /**
     * 通过16进制颜色转换为字符串颜色值
     *
     */
    hex2string: function (hex)
    {
        hex = hex.toString(16);
        hex = '000000'.substr(0, 6 - hex.length) + hex;

        return '#' + hex;
    },

    /**
     * [R, G, B] 转换为16进制
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
        canvas.width = 6;
        canvas.height = 1;

        var context = canvas.getContext('2d');
        context.globalCompositeOperation = 'multiply';
        context.drawImage(magenta, 0, 0);
        context.drawImage(yellow, 2, 0);

        var data = context.getImageData(2,0,1,1).data;

        return (data[0] === 255 && data[1] === 0 && data[2] === 0);
    },

    /**
     * 给定一个数字，返回一个最接近2的幂的一个数。
     *
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
     *
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
     *
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

    isMobile : navigator.userAgent.match(/Android|Mobile|iPhone|iPad/), //是否为移动终端,

    getRenderer:function(width, height, options, noWebGL)
    {
        width = width || 800;
        height = height || 600;

        if (!noWebGL && this.isWebGLSupported())
        {
       
            return new Q.class.WebGLRenderer(width, height, options);
        }
        alert(41);

        return new Q.class.CanvasRenderer(width, height, options);
    },


    sortDepth:function(a,b){

        a.sort(b?b:function(c,d) {return c.depth>d.depth})

    },

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
  
    setRenderer:function( a ) {


        var renderer = a.renderer||this.getRenderer( a.width , a.height, { resolution:a.resolution, transparent:  false}),
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

            Q.event.now.x = Q.event.start.x ;
            Q.event.now.y = Q.event.start.y ;
            
            Q.message.trigger(a,'down',e);
        }

        ev.touchMove = function(e){
            e.preventDefault();

            var _po = {x:0,y:0};

            mapPositionToPoint(_po,e.changedTouches[0].pageX,e.changedTouches[0].pageY,dom,resolution);

            Q.event.delay.x = _po.x - Q.event.now.x ;
            Q.event.delay.y = _po.y - Q.event.now.y ;

            Q.event.now.x = _po.x;
            Q.event.now.y = _po.y;

            Q.message.trigger(a,'move',e);
        }

        ev.touchUp = function(e){
            e.preventDefault();

            mapPositionToPoint(Q.event.now,e.changedTouches[0].pageX,e.changedTouches[0].pageY,dom,resolution);

            Q.event.end.x = Q.event.now.x ;
            Q.event.end.y = Q.event.now.y ;

            Q.message.trigger(a,'up',e);
        }

        ev.mouseDown = function(e){

           e.preventDefault();

            mapPositionToPoint(Q.event.start,e.clientX,e.clientY,dom,resolution);

            Q.event.now.x = Q.event.start.x ;
            Q.event.now.y = Q.event.start.y ;
            
            Q.message.trigger(a,'down',e);

        }

        ev.mouseMove = function(e){
            e.preventDefault();

            var _po = {x:0,y:0};

            mapPositionToPoint(_po,e.clientX,e.clientY,dom,resolution);

            Q.event.delay.x = _po.x - Q.event.now.x ;
            Q.event.delay.y = _po.y - Q.event.now.y ;

            Q.event.now.x = _po.x;
            Q.event.now.y = _po.y;

            Q.message.trigger(a,'move',e);
        }

        ev.mouseUp = function(e){

            e.preventDefault();

            mapPositionToPoint(Q.event.now,e.clientX,e.clientY,dom,resolution);

            Q.event.end.x = Q.event.now.x ;
            Q.event.end.y = Q.event.now.y ;

            Q.message.trigger(a,'up',e);

        }
 
      
        if(!navigator.userAgent.match(/Android|Mobile|iPhone|iPad/)){

            console.log('isMobile');

            renderer.view.addEventListener( 'mousedown'  ,ev.mouseDown,false);
            renderer.view.addEventListener( 'mousemove'  ,ev.mouseMove,false);
            renderer.view.addEventListener( 'mouseup'    ,ev.mouseUp,false);

        }else{

            renderer.view.addEventListener( 'touchstart' ,ev.touchDown,false);
            renderer.view.addEventListener( 'touchmove'  ,ev.touchMove,false);
            renderer.view.addEventListener( 'touchend'   ,ev.touchUp,false);

        };

        a.renderer = renderer;

        a.element.appendChild(renderer.view);

    },

    TextureCache: {} ,

    views:{},

    BaseTextureCache: {}

};

Q.exports = utils;

}();