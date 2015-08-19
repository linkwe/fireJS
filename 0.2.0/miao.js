
(function( G , M ){
	
	G.Q = M( G );

}( window || this , function( G ){

"use strict";

Object.defineProperties(miao,{
    'VERSION':{get:function(){return '0.1.8.0'},enumerable:true},
    'uid':{get:function(){var n = 0;return function(){return ++n}}()}
});

var

uf = undefined,
nl = null,
pes = 'prototype',
crs = 'constructor',
quo={class:{}},fn,_g={};

miao.fn = fn = {
	$:G.$||function(a){return document.getElementById(a)},
	define:Object.defineProperty,
	defines:Object.defineProperties,
	now:G.Date.now,
	getUrl:(G.URL && URL.createObjectURL.bind(URL))||(G.webkitURL && 
  webkitURL.createObjectURL.bind(webkitURL))||G.createObjectURL,
	
	isD:function(a){return a instanceof HTMLElement},
   	isS:function(a){return Object[pes].toString.call(a) == '[object String]'},
	isF:function(a){return Object[pes].toString.call(a) == '[object Function]'},
	isO:function(a){return Object[pes].toString.call(a) == '[object Object]'},
	isN:function(a){return Object[pes].toString.call(a) == '[object Number]'},
	isA:function(a){return Object[pes].toString.call(a) == '[object Array]'},
	getLength:function(a){var i,cont=0;for(i in a)cont++;return cont},
	coverOwn:function(a,b){for(var i in b)a[i] = b[i];return a},
	setOwn:function(a,b,c){for(var i in b)(a[i]!==uf&&!fn.isF(a[i]))&&(a[i] = b[i]);return a}, 
	coverPro:function(a,b){Object.getOwnPropertyNames(b).forEach(function(m){	
		Object.defineProperty(a,m,Object.getOwnPropertyDescriptor(b,m))})},
	addOwn:function(a,b){for(var i in b)a[i]===uf&&(a[i] = b[i]);return a},
	setCss:function (a,b){for( var i in b)a.style[i]=b[i];return a},
	find:function(a,b){
		if(!quo[a]||b&&!quo[a][b])return false;
		return b?quo[a][b]:quo[a]},
	getAtyView:function(){return miao.app.atyView},
	setAtyView:function(a){miao.app.atyView=a},
	inof:function(a,b){return a instanceof fn.find('class',b)},
	getPix:function(a){
		return parseInt(a)*(/w$/.test(a)&&miao.app.w*.01||/h$/.test(a)&&miao.app.h*.01||/d$/.test(a)&&devicePixelRatio||1);
	},
	cF:function (a,b)
	{
		var 
		i = !!b ? a[crs] !== {}[crs] ? 3 : 2 : a[crs] !== {}[crs] ? 1 : 0 ,
		M =
		i==3 &&
		function(p){
			b.call(this,p);
			a[crs].call(this,p);
		}||
		i==2&&
		function(p){
			b.call(this,p);
		}||
		i==1&&
		function(p){
			a[crs].call(this,p);
		}||
		i==0&&function(p){};
		i>1&&fn.coverPro(M[pes],b[pes]);
		fn.coverPro(M[pes],a);
		M[pes][crs]=M;
		return M;
	},
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
	cC:function(a){
		if(!a.className)return fn.cF(a);
		var config = a , className = config.className, extend = config.extend || null ;
		quo[className]={};delete config.className ; delete config.extend ;
		return quo['class'][className] = !!extend ? fn.cF(config , quo['class'][extend]) : fn.cF(config);
	},
	cO:function(a,b){
		if(fn.isO(a)){a.uid = miao.uid;return a}
		if(!quo['class'][a])return;
		var o = new quo['class'][a](b);
		o.id = b.id||o.uid;
		if(b.id)quo[a][b.id]=_g[b.id]=o;
		return o;
	},
	cGradient:function(a){
		var g = a.ctx.createLinearGradient(a.x1,a.y1,a.x2,a.y2);
		a.colors.forEach(function(m,i){g.addColorStop(m.t,m.color)});
		return g;
	},
	collision:function(a,b,c)
	{
		if(a=='pr'){
			var _x=c.x-c.anchorX*c.w*c.scaleX,_y=c.y-c.anchorY*c.h*c.scaleY;
			return !(b.x<_x||b.x>_x+c.w*c.scaleX||b.y<_y||b.y>_y+c.h*c.scaleY)
		}else if(a=='rr')
		{
			return Math.powbs(b.x + b.w/2 - c.x - c.w/2) 
			  < Math.powbs((b.w + c.w)/2) &&
				Math.powbs(b.y + b.h/2 - c.y - c.h/2)
			  < Math.powbs((b.h + c.h)/2)
		}
	}
};

fn.cC({
	className:'mobj',
	get:function(a){return this[a]},
	set:function(a,b,c){
		a.w&&fn.isS(a.w)&&(a.w=fn.getPix(a.w));
		a.h&&fn.isS(a.h)&&(a.h=fn.getPix(a.h));
		a.x&&fn.isS(a.x)&&(a.x=fn.getPix(a.x));
		a.y&&fn.isS(a.y)&&(a.y=fn.getPix(a.y));

		a&&fn.setOwn(this,a);
		a.cover&&fn.coverOwn(this,a.cover);
		if(c!==false)for(var i in a){
			if(!fn.isF(this[i]))continue;this[i](a[i])}
		return this},
	constructor:function(){
		this.uid =miao.uid;
	}
});


miao.device ={
	w:G.innerWidth,
	h:G.innerHeight,
	isPhone:/iPhone|android|iPad/i.test(navigator.userAgent)
};

//订阅
//触发
var pub = fn.cO({
	fns:[],
	trigger:function(a,b,c){
		if(a&&a._listener&&a._listener[b])
		return pub.fns[a._listener[b]].call(a,c);
	},
	trigges:function(a,b,c){
		//try{
		
		if(a&&a._listeners&&a._listeners[b])
		a._listeners[b].some(function(m){
			return m.enabled&&pub.fns[m._listener[b]].call(m,c)});



		//}catch(e){console.log(a)}
	},
	sub:function(a,b,c)
	{
		a._listener = a._listener||{};
		var id = miao.uid;
		pub.fns[id]=c;
		a._listener[b]=id;
	},
	unsub:function(a,b)
	{
		delete pub.fns[a._listener[b]];
		delete a._listener[b];
	}
});
miao.pub = pub;

!function(Ease){

Ease.line = function(t){return t}
Ease.get = function(a) {
	a = a<-1&&-1||a>1&&1||a;
	return function(t) {if(a==0){return t}
	if(a<0){return t*(t*-a+1+a)}return t*((2-t)*a+(1-a))}
}

Ease.getaIn = function(a){return function(t){return Math.pow(t,a)}}

Ease.getaOut = function(a){return function(t){return 1-Math.pow(1-t,a)}}

Ease.getaInOut = function(a) {return function(t) {
	if((t*=2)<1)return 0.5*Math.pow(t,a);return 1-0.5*Math.powbs(Math.pow(2-t,a))}}

Ease.quadIn = Ease.getaIn(2);
Ease.quadOut = Ease.getaOut(2);
Ease.quadInOut = Ease.getaInOut(2);
Ease.cubicIn = Ease.getaIn(3);
Ease.cubicOut = Ease.getaOut(3);
Ease.cubicInOut = Ease.getaInOut(3);
Ease.quartIn = Ease.getaIn(4);
Ease.quartOut = Ease.getaOut(4);
Ease.quartInOut = Ease.getaInOut(4);
Ease.quintIn = Ease.getaIn(5);
Ease.quintOut = Ease.getaOut(5);
Ease.quintInOut = Ease.getaInOut(5);

Ease.sineIn = function(t){return 1-Math.cos(t*Math.PI/2)}
Ease.sineOut = function(t) {return Math.sin(t*Math.PI/2)}
Ease.sineInOut = function(t){return -0.5*(Math.cos(Math.PI*t) - 1)}
Ease.getBackIn = function(a){return function(t){return t*t*((a+1)*t-a)}}

Ease.backIn = Ease.getBackIn(1.7);
Ease.getBackOut = function(a){return function(t){
	return (--t*t*((a+1)*t + a) + 1)}}

Ease.backOut = Ease.getBackOut(9);
Ease.getBackInOut = function(a) { a*=1.525;
	return function(t){if ((t*=2)<1) return 0.5*(t*t*((a+1)*t-a));
	return 0.5*((t-=2)*t*((a+1)*t+a)+2)}}

Ease.backInOut = Ease.getBackInOut(1.7);

Ease.circIn = function(t) {return -(Math.sqrt(1-t*t)- 1)}

Ease.circOut = function(t) {return Math.sqrt(1-(--t)*t)}

Ease.circInOut = function(t) {if ((t*=2) < 1) 
	return -0.5*(Math.sqrt(1-t*t)-1);return 0.5*(Math.sqrt(1-(t-=2)*t)+1)}

Ease.bounceIn = function(t) {return 1-Ease.bounceOut(1-t)}

Ease.bounceOut = function(t) {
	if(t < 1/2.75) {return (7.5625*t*t)} 
	else if(t < 2/2.75){return (7.5625*(t-=1.5/2.75)*t+0.75)} 
	else if(t < 2.5/2.75) {return (7.5625*(t-=2.25/2.75)*t+0.9375)} 
	else {return (7.5625*(t-=2.625/2.75)*t +0.984375)}}

Ease.bounceInOut = function(t){if (t<0.5) return Ease.bounceIn(t*2)*.5;
	return Ease.bounceOut(t*2-1)*0.5+0.5}

Ease.getElasticIn = function(a,b){ var pi2 = Math.PI*2;
	return function(t) {if (t==0 || t==1) return t;
	var s = b/pi2*Math.powsin(1/a);
	return -(a*Math.pow(2,10*(t-=1))*Math.sin((t-s)*pi2/b))}}

Ease.elasticIn = Ease.getElasticIn(1,0.3);

Ease.getElasticOut = function(a,b){var pi2 = Math.PI*2;
	return function(t){if (t==0 || t==1) return t;
	var s = b/pi2 * Math.powsin(1/a);
	return (a*Math.pow(2,-10*t)*Math.sin((t-s)*pi2/b )+1)}}

Ease.getElasticInOut = function(a,b) {var pi2 = Math.PI*2;
	return function(t) {var s = b/pi2 * Math.powsin(1/a);
	if ((t*=2)<1) return -0.5*(a*Math.pow(2,10*(t-=1))*Math.sin( (t-s)*pi2/b ));
	return a*Math.pow(2,-10*(t-=1))*Math.sin((t-s)*pi2/b)*0.5+1}}

Ease.elasticInOut = Ease.getElasticInOut(1,0.3*1.5);
Ease.elasticOut = Ease.getElasticOut(1,0.25);

}(miao.ease={});

var tween = miao.tween = fn.cO({
	queue:[],
	queuePend:[],
	utime:17,
	pause:false,
	clear:false,
	clearall:function()
	{
		this.pause = true;
		this.queue=[];
		this.queuePend=[];
		this.pause = false;
	},
	//是否执行回调，回到动画前 还是停止 还是直接完成动画，是否继续后面的动画
	update:function()
	{
		if(this.pause)return;
		var ts = this , me ,i = 0 , k, l ,j,
		    q = ts.queue ,    ql = q.length,
		    p = ts.queuePend, pl = p.length;


		pl&&(Array[pes].push.apply(q,p)&&(ts.queuePend=[]));
		if(ql)for(;i<ql;i++)
		{
  			if(!(me = q[i])||me.pause)continue;
			me.st += ts.utime;
  			if(me.stop)
  			{	
  				me.stop.iscak&&me.cak.call(me.hok);
  				me.stop.isbak!==uf&&(me.stop.isbak?fn.setOwn(me.hok,me.stos):
  				!function(){for(l in me.stos)me.hok[l]=me.tos[l]}());
  				me.hok.ani[me.name]=nl;
  				delete me.hok.ani[me.name];
  				q.splice(i,1);
  			}else if(me.st >= me.end){

  					if(me.ia)
  					{
  						me.cak&&me.cak.call(me.hok,me);
  						if(++me.idx>=me.aqe.length)
  						{
  							me.count--;
  							me.idx = 0;
  							if(!me.count)me.stop = {};
  						}
  						for(j in me.aqe[me.idx])me[j] = me.aqe[me.idx][j];

  					}else{

  						me.count--;


  						if(me.tos&&me.count)for(j in me.tos)me.hok[j] = me.tos[j];
  						me.cak&&me.cak.call(me.hok,me);
  						

  					}
  					me.st = 0;

  					if(!me.count)me.stop = {};

			}else if(me.st>me.delay){
				for(k in me.tos)me.hok[k] = me.stos[k]+
					me.ease((me.st-me.delay)/(me.end-me.delay))*(me.tos[k]-me.stos[k]);
			}
		}
	},
	add:function(a,b)
	{
		var c = b?a:this.hand(a); 
		this.queuePend.push(c);
		return c;
	},
	hand:function(a,b){

		var o,c = fn.coverOwn({stos:{},st:0,ease:miao.ease.line},a);


		for(o in a.tos){
			fn.isS(a.tos[o])&&(a.tos[o]=fn.getPix(a.tos[o]));
			c.stos[o] = b?b.tos[o]||a.hok[o]:a.hok[o];
		}
		c.delay ?(c.end = c.delay + (c.time||0)):(c.end = (c.time||0))&&(c.delay=0);
		return c
	}
});
fn.define(tween,'isrun',{get:function(){return !this.queue.length&&!this.queuePend.length}});

fn.cC(fn.defines({
	className:'display',
	extend:'mobj',
	
	w:0,
	h:0,

	depth:10,
	
	anchorX:0,
	anchorY:0,

	blendMode:'none',

	world:nl,

	exists:nl,

	iax:false,

	show:function(){
		this.visible = true;
	},
 
	hide:function(){
		this.visible = false;
	},

	constructor:function(a){
		this._listener = a.listener||{};
	},

	stop:function(a,b){
		var idx = b||'m';
		if(this.ani&&this.ani[idx])this.ani[idx].stop = {};
	},

	animate:function(a)
	{
		
		this.ani=this.ani||{};
		var name ,i=0,ts =this,ani=this.ani,j;		
		a.hok=this;
		if(fn.isA(a))
		{

			var ars = [],hc = nl;
			a.forEach(function(m){
				m.hok = ts;
				if(hc)
				{
					ars.push(tween.hand(m,hc));
				}else{
					ars.push(tween.hand(m));
				}
				
				hc = m;
			});

			a.aqe = ars;
			a.idx = 0;

			for(j in a.aqe[a.idx])a[j] = a.aqe[a.idx][j];
			a.ia = true;
			a.count = a[0].count||1;
			name=a[0].name||'m';
			ani[name] = tween.add(a,true);

		}else{
			if(!a.count)a.count=1;
			name=a.name||'m';

			ani[name] = tween.add(a);
		}
	},
	
	position:function(a){
		var rve=a.rve||this.world||this.exists||miao.app;

		if(a.v){
			
			a.v.top&&fn.isS(a.v.top)&&(a.v.top=fn.getPix(a.v.top));
			a.v.center&&fn.isS(a.v.center)&&(a.v.center=fn.getPix(a.v.center));
			a.v.bottom&&fn.isS(a.v.bottom)&&(a.v.bottom=fn.getPix(a.v.bottom));

			if(fn.isN(a.v.top))
			this.y = a.v.top;
			else if(fn.isN(a.v.bottom))
			this.y = rve.h - this.h - a.v.bottom;
			else if(fn.isN(a.v.center))
			this.y = (rve.h -this.h)/2 + a.v.center;
		}

		if(a.h){

			a.h.left&&fn.isS(a.h.left)&&(a.h.left=fn.getPix(a.h.left));
			a.h.right&&fn.isS(a.h.right)&&(a.h.right=fn.getPix(a.h.right));
			a.h.center&&fn.isS(a.h.center)&&(a.h.center=fn.getPix(a.h.center));

			if(fn.isN(a.h.left))
			this.x = a.h.left;
			else if(fn.isN(a.h.right))
			this.x =rve.w - this.w - a.h.right;
			else if(fn.isN(a.h.center))
			this.x = (rve.w -this.w)/2 + a.h.center;
		}
		return this
	},

	auto:function(a,b,c){
		var bw = b?b.w||b.width:this.image.w ||0,
			bh = b?b.h||b.height:this.image.h||0;


		if(a.w&&a.h){return this}else 
		if(a.w)
		{
			fn.isS(a.w)&&(a.w=fn.getPix(a.w));
			this.w = a.w;
			this.h = (bh / bw) * a.w;
		}else if(a.h)
		{
			fn.isS(a.h)&&(a.h=fn.getPix(a.h));
			this.h = a.h;
			this.w = bw / bh * a.h;
		}
		if(!this.h&&!this.h)return this
	},

	setDepth:function(a){
		this.depth = a;
		this.exists.forEach(function(m){
			for(var i in m.listener)
			m._sort(m.listener[i]);
			m._sort(m._items);
		});
	},

	addTo:function( vv , b )
	{
		if(!vv)return;
		var v = vv.mlay||vv;
		if(v._items.length<1){
			v._items.push(this);
		}else{
			for(var i=v._items.length-1;0<=i;i--){
				if(v._items[i].depth<=this.depth){
					v._items.splice(i+1,0,this);break;
				}else{
					if(i==0)v._items.unshift(this);
				}
			}
		}
		this.exists= v;
		this.world = v;
		b!==false&&this.bindTo(v);
		return this
	},

	listener:function(a)
	{
		if(a.toggle)console.log(this);
		for(var i in a)
		pub.sub(this,i,a[i]);
	},

	removTo:function( v , b ){
		if(!this.exists)return false;
		v._items.splice(v._items.indexOf(this),1);
		b!==false&&this.unbindTo(v);
		return this
	},

	bindTo:function( v ){

		v=v||this.exists;
		for(var i in this._listener){
			if(fn.isF(this._listener[i]))this.bind(i,this._listener[i],v);
			else (v._listeners[i]||(v._listeners[i]=[])).push(this);
			v._sort(v._listeners[i])};
		return this;
	},

	unbindTo:function( v ){
		v = v||this.exists;
		var i,idx;
		for(var i in this._listener)
		if(v._listeners[i]&&(idx=v._listeners[i].indexOf(this))!=-1)
		v._listeners[i].splice(idx,1);
	},

	bind:function(a,b,c){
		pub.sub(this,a,b);
		c&&(c._listeners[a]||(c._listeners[a]=[])).push(this);
	},

	unbind:function(a,b){
		pub.unsub(this,a);
		b!==false&&this.unbindTo(this.exists);
	}

},{

	'_visible': {
            value:true,
            writable:true
    }, 
    'visible': {
	        get:function(){
	        	if(this.world&&this.world.visible===false)
	        	return false;else return this._visible;
	        },
	        set:function(value){
	        	this._visible = value;
	        },
	        enumerable: true,
		    configurable: true
    },

    '_enabled': {
            value:true,
            writable:true
    }, 
    'enabled': {
	        get:function(){
	        	if(this.world&&this.world.enabled===false)
	        	return false;else return this._enabled;
	        },
	        set:function(value){
	        	this._enabled = value;
	        },
	        enumerable: true,
		    configurable: true
    },

    'hide': {
	        get:function(){
	        	if(this.world&&this.world.enabled===false&&this.world.visible===false)


	        	return false;else return this._visible&&this._enabled;
	        },
	        set:function(value){
	        	this._visible = this._enabled = value;
	        },
	        enumerable: true,
		    configurable: true
    },

	'_x': {
            value:0,
            writable:true
    }, 
    'x': {
	        get:function(){
	        	if(this.world)
	        	return this._x+this.world.x;
	        	else return this._x;
	        },
	        set:function(value){
	        	this._x = value;
	        },
	        enumerable: true,
		    configurable: true
    },

    '_y': {
            value:0,
            writable: true
    },
    'y': {
	        get:function(){
	        	if(this.world)
	        	return this._y+this.world.y;
	        	else return this._y;
	        },
	        set:function(value){
	        	this._y = value;
	        },
		    enumerable: true,
		    configurable: true

    },

    '_scaleX': {
            value:1,
            writable: true
    },
    'scaleX': {
	        get:function(){
	        	if(this.world)
	        	return this._scaleX*this.world._scaleX;
	        	else return this._scaleX;
	        },
	        set:function(value){
	        	this._scaleX = value;
	        },
	        enumerable: true,
		    configurable: true
    },

    '_scaleY': {
            value:1,
            writable: true
    },
    'scaleY': {
	        get:function(){
	        	if(this.world)
	        	return this._scaleY*this.world._scaleY;
	        	else return this._scaleY;
	        },
	        set:function(value){
	        	this._scaleY = value;
	        },
	        enumerable: true,
		    configurable: true
    },

    '_rotation': {
            value:0,
            writable: true
    },
    'rotation': {
	        get:function(){
	        	if(this.world)
	        	return this._rotation+this.world._rotation;
	        	else return this._rotation;
	        },
	        set:function(value){
	        	this._rotation = value;
	        },
	        enumerable: true,
		    configurable: true
    },

    '_opacity': {
            value:1,
            writable: true
    },
    'opacity': {
	        get:function(){
	        	if(this.world)
	        	return this._opacity*this.world._opacity;
	        	else return this._opacity;
	        },
	        set:function(value){
	        	this._opacity = value;
	        },
	        enumerable: true,
		    configurable: true
    }
}));

fn.cC(fn.defines({

	className:'canvas',
    extend:'display',

	cas:nl,
	ctx:nl,
	ty:nl,

	render:function(cak)
	{
		cak(this.ctx);
		return this;
	},

	renderObj:function(displayobj){
	  	if(!displayobj.visible){
	  		displayobj.visible=true;
	  		displayobj.draw(this.ctx);
	  		displayobj.visible=false;
	  	}else{
	    	displayobj.draw(this.ctx);
	  	}
	  	return this;
	},

 	 draw:function(ct){
	    if(!this.opacity!=1||!this.scaleX!=1||!this.scaleX!=1||this.rotation){
	      ct.save();
	      ct.globalAlpha = this.opacity;
	      ct.translate(this.x,this.y);
	      ct.scale(this.scaleX,this.scaleY);
	      this.rotation&&ct.rotate(this.rotation*Math.PI/180);
	      ct.drawImage(this.cas,-this.anchorX*this.w,-this.anchorY*this.h,this.w,this.h);
	      ct.restore();
	    }else{
	      ct.drawImage(this.cas,this.x,this.y,this.w,this.h); 
	    }
	    return this;
	},
	constructor:function(a){
		this.cas= document.createElement( 'canvas' );

		a.ty&&(this.ctx = a.ty=='2d'? this.cas.getContext('2d'):
		a.ty=='webgl'&&window.WebGLRenderingContext?this.cas.getContext('webgl')||
		this.cas.getContext('experimental-webgl'):nl);
	}

},{
    'w': {
        get:function(){
        	return this.cas.width;
        },
        set:function(value){
        	this.cas.width = value;
        },
        enumerable: true,
	    configurable: true	
    }
    ,
    'h': {
        get:function(){
        	return this.cas.height;
        },
        set:function(value){
        	this.cas.height = value;
        },
        enumerable: true,
	    configurable: true
    }

}));



miao.cas =miao.fn.cO({
	pool:function(){
		var ar = [],s=3;
		while(s--){
			var ca = fn.cO('canvas',{ty:'2d'});
			ca.ax = false;
			ar.push(ca);
		}	
		return ar
	}(),
	get:function(){
		var o;
		if(!this.pool.some(function(m){if(!m.ax)return o=m}))
		o = this.repay(fn.cO('canvas',{ty:'2d'}));
		o.ax = true;
		return o;
	},
	repay:function(a){
		a.set({
          	x:0,
          	y:0,
          	ax:false,
          	scaleX:1,
          	scaleY:1,
          	anchorX:0,
          	anchorY:0,
          	rotation:0,
          	opacity:1
        });

		if(this.pool.indexOf(a)==-1)this.pool.push(a);
		return a;
	},
	getBuffer:function(a)
	{
		
	}
});

!function(){
var pulse = fn.cO({
  sw:false,
  request:G.requestAnimationFrame||G.webkitRequestAnimationFrame||
        G.mozRequestAnimationFrame||G.oRequestAnimationFrame||
        function (callback){return G.setTimeout(callback,1000/60)},
    start:function()
  {
    if(this.sw)return;this.sw = true;
    var update = this.request,lt=0,ix;
    !function lp()
    {
      tween.update();
      miao.run&&miao.run();
      miao.app.atyView.run&&miao.app.atyView.run();
      miao.app.atyView.autoRedraw&&miao.app.atyView.draw(miao.app.ctx);
      miao.app.mlayer.visible&&miao.app.mlayer.draw(miao.app.ctx);
      (ix=parseInt(arguments[0]))&&(miao.rate=(tween.utime=ix-lt)*0.06)&&(lt=ix);
      pulse.sw&&update(lp);
    }(lt);
  },
  stop:function(){
    this.sw = false;
  }
});

var isqie = false;
miao.go=function(a,b,c)
{
	if(isqie)return;
    miao.tween.clearall();
    var  acy;
    if(fn.isS(a)){
      acy = miao(a);
      if(!acy)return;
    }else if(fn.inof(a,'view')){
      acy = a;
    }else{return}

    var now = miao.app.atyView;

    pub.trigger(acy,'fast',b);

    if(c){
      isqie = true;
      now.autoRedraw = false;
     

	  miao.trn({a:now,b:acy,cak:function(){
	  	isqie = false;
        now.autoRedraw = true;
	  	qie();
	  },trn:c});

    }else{
       qie();
    }

    function qie()
    {
      
      pub.trigger(miao.app.atyView,'unload');
      miao.app.atyView = acy;
      acy.someFn();
      if(acy.ft){
        pub.trigger(acy,'init',b);
        acy.ft = null;
        delete acy.ft;
      }
      pub.trigger(acy,'toggle',b);
      !pulse.sw&&pulse.start();
    }
}

}();

!function(Transitions){

	Transitions.small = function(m){
	      m.a.set({
	      	scaleX:1,
	      	scaleY:1,
	      	anchorX:.5,
	      	x:m.a.w*.5,
	        animate:{
	        tos:{
	        	opacity:0,
	        	scaleX:.3,
	        	scaleY:.3
	        },
	        time:700,
	        ease:Q.ease.quintOut,
	        cak:function(){
	        	m.a.set({
	        		scaleX:1,
	      			scaleY:1
	        	});
	        
	          m.cak();
	        }
	      }});

	      m.b.set({
	        y:Q.app.h,
	        scaleX:4,
	      	scaleY:4,
	      	anchorX:.5,
			x:m.a.w*.5,
	        animate:{
	        tos:{
		        y:0,
		        scaleX:1,
		      	scaleY:1
	        },
	        time:700,
	        ease:Q.ease.quintOut
	      }});

	      m.draw = function(ct){
	      	ct.fillStyle = '#111';
			ct.fillRect(0,0,m.a.w,m.a.h);
	        m.a.draw(ct);
	        m.b.draw(ct);
	      }
	  }

	  Transitions.smalldown = function(m){
	      m.a.set({
	      	scaleX:1,
	      	scaleY:1,
	      	anchorX:.5,
	      	anchorY:1,
	      	y:Q.app.h,
	      	x:m.a.w*.5,
	        animate:{
	        tos:{
	        	opacity:0,
	        	scaleX:.3,
	        	scaleY:.3
	        },
	        time:700,
	        ease:Q.ease.quintOut,
	        cak:function(){
	          m.cak();
	        }
	      }});

	      m.b.set({
	        y:0,
	        scaleX:4,
	      	scaleY:4,
	      	anchorX:.5,
	      	anchorY:1,
			x:m.a.w*.5,
	        animate:{
	        tos:{
		        y:Q.app.h,
		        scaleX:1,
		      	scaleY:1
	        },
	        time:700,
	        ease:Q.ease.quintOut
	      }});

	      m.draw = function(ct){
	      	ct.fillStyle = '#111';
			ct.fillRect(0,0,m.a.w,m.a.h);
	        m.a.draw(ct);

	        m.b.draw(ct);


	      }
	  }




	  Transitions.silidRight = function(m){
	      m.a.set({
	        x:0,
	        animate:{
	        tos:{
	          x:Q.app.w
	        },
	        time:700,
	        ease:Q.ease.quintOut,
	        cak:function(){
	          m.cak();
	        }
	      }});

	      m.b.set({
	        x:-Q.app.w,
	        animate:{
	        tos:{
	          x:0
	        },
	        time:700,
	        ease:Q.ease.quintOut
	      }});

	      m.draw = function(ct){
	        m.b.draw(ct);
	        m.a.draw(ct);
	      }
	  }
	  Transitions.silidLeft = function(m){
	      m.a.set({
	        x:0,
	        animate:{
	        tos:{
	          x:-Q.app.w
	        },
	        time:700,
	        ease:Q.ease.quintOut,
	        cak:function(){
	          m.cak();
	        }
	      }});

	      m.b.set({
	        x:Q.app.w,
	        animate:{
	        tos:{
	          x:0
	        },
	        time:700,
	        ease:Q.ease.quintOut
	      }});

	      m.draw = function(ct){
	        m.b.draw(ct);
	        m.a.draw(ct);
	      }
	  }
Transitions.silidDown = function(m){
	      m.a.set({
	        y:0,
	        animate:{
	        tos:{
	          y:Q.app.h
	        },
	        time:700,
	        ease:Q.ease.quintOut,
	        cak:function(){
	          m.cak();
	        }
	      }});

	      m.b.set({
	        y:-Q.app.h,
	        animate:{
	        tos:{
	          y:0
	        },
	        time:700,
	        ease:Q.ease.quintOut
	      }});

	      m.run.run = function(){
	        m.b.draw(m.ct);
	        m.a.draw(m.ct);
	      }
	  }

  Transitions.silidUp = function(m){
      m.a.set({
        y:0,
        animate:{
        tos:{
          y:-Q.app.h
        },
        time:700,
        ease:Q.ease.quintOut,
        cak:function(){
          m.cak();
        }
      }});

      m.b.set({
        y:Q.app.h,
        animate:{
        tos:{
          y:0
        },
        time:700,
        ease:Q.ease.quintOut
      }});

      m.run.run = function(){
        m.b.draw(m.ct);
        m.a.draw(m.ct);
      }
  }

  Transitions.op = function(m){
      m.b.set({
        opacity:0,
        animate:{
        tos:{
          opacity:1
        },
        time:700,
         cak:function(){
          m.cak();
        }

      }});

      m.draw = function(ct){
        m.b.draw(ct);
      }
  }


}(miao.trn = function(){

var jk = {
	a:nl,
	b:nl,
	cak:nl,
	draw:nl
},bf = miao('display',{depth:0});

return function(op){
	if(op.draw){
		op.draw.draw = function(ct){
			jk.draw(ct)
		}




		jk.cak=function(){
			miao.cas.repay(jk.a);
		    miao.cas.repay(jk.b);
			op.cak();
		}
	}else{
		bf.addTo(miao.app.mlayer);
		bf.draw=function(ct){jk.draw(ct)};
		jk.cak=function(){
			bf.removTo(miao.app.mlayer);
			miao.cas.repay(jk.a);
		    miao.cas.repay(jk.b);
			op.cak();
		}
	}

	jk.a = miao.cas.get().set({
	        w:op.a.w,
	        h:op.a.h,
	        x:op.a.x,
	        y:op.a.y,
	        renderObj:op.a
	});

	jk.b = miao.cas.get().set({
	        w:op.b.w,
	        h:op.b.h,
	        x:op.b.x,
	        y:op.b.y,
	        renderObj:op.b
	});



	!fn.isF(op.trn)&&(op.trn=miao.trn.op);

	op.trn(jk);

}}());


fn.cC({
	className:'group',
	extend:'display',

	constructor:function(a){
		this._child = {};
		if(a.caks){
			a.caks.push({the:this,cs:a});
		}else{
			this.set(a);
		}	
	},

	addChild:function(c){
		var o = fn.isS(c)?miao(c):c;
		o.world = this;
		this._child[o.uid]=o;
	},
	removChild:function(c){
		var o = fn.isS(c)?miao('c'):c;
		o.world = nl;
		delete this._child[o.uid];
	},
	child:function(a){
		var ts = this;
		if(fn.isA(a))a.forEach(function(m){ts.addChild(m)});
	},
	addTo:function(v){
		this.exists= v;
		this.world = v;
	}
});


fn.cC({
	className:'image',
	extend:'display',
	image:nl,
	sani:function(a){
		if(a.s=='stop'&&this.ani&&this.ani['spirits']){
			this.ani['spirits'].stop={};
			return;
		}

		if(a.spirits){
			this.spirits = a.spirits;
		}
		if(!fn.isA(this.spirits))return;
		var ss = [];
		this.spirits.forEach(function(m,i,ar){
			ss.push(i?{
				
				delay:a.s,
				
				cak:function(_i,_l){

					return _i ==_l?
					function(){
						this.image = this.spirits[this.ani['spirits'].idx];
						a.cak&&a.cak.call(this);
					}:function(){
						this.image = this.spirits[this.ani['spirits'].idx];
					}
				}(i,ar.length-1)
			}:{
				name:'spirits',
				delay:a.s,
				count:a.c||1,
				cak:function(){
					this.image = this.spirits[this.ani['spirits'].idx];
				}
				
			});
		});





		this.animate(ss);

		return this
	},
	constructor:function(a){
		this.set(a,a.cover);
	},
	draw:function(ct)
	{
		if(!this.opacity!=1||!this.scaleX!=1||!this.scaleX!=1||this.rotation){
			ct.save();
			ct.globalAlpha = this.opacity;
			ct.translate(this.x,this.y);
			ct.scale(this.scaleX,this.scaleY);
			this.rotation&&ct.rotate(this.rotation*Math.PI/180);
			try{
				ct.drawImage(this.image.obj,-this.anchorX*this.w,-this.anchorY*this.h,this.w,this.h)
			}catch(e){console.log(this.id)};
			ct.restore();
		}else{
			ct.drawImage(this.image.obj,this.x,this.y,this.w,this.h);	
		}
		return this;
	}
});

fn.cC({
	className:'bar',
	extend:'display',

	prs:0,
	du:nl,
	dw:0,
	dh:0,

	constructor:function(a){

		this.imga = fn.cO('image',{
			cover:{
				xa:a.axa,
				xb:a.axb,
				dxa:nl,
				dxb:nl
			},
			image:a.photoa
		});

		this.imgb = fn.cO('image',{
			cover:{
				xa:a.bxa,
				xb:a.bxb,
				dxa:nl,
				dxb:nl
			},
			image:a.photob
		});

		this.bj =0;
		var imga = this.imga,imgb = this.imgb;
		
		this.imga.auto({h:a.ah||a.h||this.imga.image.height},this.imga.image);
		this.imgb.auto({h:a.h||this.imgb.image.height},this.imgb.image);
		this.bj = (imgb.h - imga.h)/2;
		imga.dxa = imga.h/imga.image.height * imga.xa;
		imga.dxb = imga.h/imga.image.height * imga.xb;
		imgb.dxa = imgb.h/imgb.image.height * imgb.xa;
		imgb.dxb = imgb.h/imgb.image.height * imgb.xb;

		
		this.set(a);
		
	},
	
	draw:function(ct)
	{
		if(!this.visible)return this;
		var imga = this.imga,imgb = this.imgb,bj = this.bj;
		ct.drawImage(imgb.image,0,0,imgb.xa,imgb.image.height,this.x,this.y,imgb.dxa,imgb.h);
		var _w = this.w-imgb.dxa-imgb.w+imgb.dxb;
		ct.drawImage(imgb.image,imgb.xa,0,imgb.xb-imgb.xa,imgb.image.height,
			this.x+imgb.dxa,this.y,_w,imgb.h);
		ct.drawImage(imgb.image,imgb.xb,0,imgb.image.width-imgb.xb,imgb.image.height,
			this.x+imgb.dxa+_w,this.y,imgb.w-imgb.dxb,imgb.h);
		ct.drawImage(imga.image,0,0,imga.xa,imga.image.height,this.x+bj,this.y+bj,imga.dxa,imga.h);
		var __w = (this.w-imga.dxa-imga.w+imga.dxb)*this.prs-bj*2;
		ct.drawImage(imga.image,imga.xa,0,imga.xb-imga.xa,imga.image.height,
			this.x+bj+imga.dxa,this.y+bj,__w,imga.h);
		ct.drawImage(imga.image,imga.xb,0,imga.image.width-imga.xb,imga.image.height,
			this.x+bj+imga.dxa+__w,this.y+bj,imga.w-imga.dxb,imga.h);
		return this;
	}
});

fn.cC({
    className:'rect',
    extend:'display',

    r:0,

    grt:null,

    stroke:false,
    fill:true,

    lineWidth:2,

    scolor:'#666',
    color:'#ddd',

    shadow:null,

    constructor:function(a){
    	a.r&&fn.isS(a.r)&&(a.r=fn.getPix(a.r));
    	if(fn.inof(this,'rect'))this.set(a);
    },
    draw:function(ct)
    {
    	var _x,_y;
         ct.save();
        if(!this.opacity==1||!this.scaleX==1||!this.scaleX==1||this.rotation){
            ct.fillStyle = this.color;
            ct.globalAlpha = this.opacity;
            ct.translate(this.x,this.y);
            ct.scale(this.scaleX,this.scaleY);
            this.rotation&&ct.rotate(this.rotation*Math.PI/180);

            ct.beginPath();
            ct.moveTo(-this.anchorX*this.w, this.y);
            ct.arcTo(-this.anchorX*this.w+this.w, -this.anchorY*this.h, -this.anchorX*this.w+this.w,-this.anchorY*this.h+this.h, this.r);
            ct.arcTo(-this.anchorX*this.w+this.w, -this.anchorY*this.h+this.h, -this.anchorX*this.w,-this.anchorY*this.h+this.h, this.r);
            ct.arcTo(-this.anchorX*this.w,-this.anchorY*this.h+this.h, -this.anchorX*this.w,-this.anchorY*this.h, this.r);
            ct.arcTo(-this.anchorX*this.w,-this.anchorY*this.h, -this.anchorX*this.w+this.w,-this.anchorY*this.h, this.r);
            ct.closePath();
            ct.fill();


            
        }else{
            //console.log(this.r);

            ct.globalAlpha = this.opacity;

            if(this.shadow)
            {
                this.shadow.color&&(ct.shadowColor=this.shadow.color);
                this.shadow.blur&&(ct.shadowBlur=this.shadow.blur);
                this.shadow.ox&&(ct.shadowOffsetX=this.shadow.ox);
                this.shadow.oy&&(ct.shadowOffsetY=this.shadow.oy);
            }


            _x = this.anchorX*this.w;
            _y = this.anchorY*this.h;

            ct.beginPath();

            ct.moveTo(this.x-_x+this.r, this.y-_y);
            ct.arcTo(this.x-_x+this.w, this.y-_y, this.x-_x+this.w, this.y-_y+this.h, this.r);
            ct.arcTo(this.x-_x+this.w, this.y-_y+this.h, this.x-_x, this.y-_y+this.h, this.r);
            ct.arcTo(this.x-_x, this.y-_y+this.h, this.x-_x, this.y-_y, this.r);
            ct.arcTo(this.x-_x, this.y-_y, this.x-_x+this.w, this.y-_y, this.r);
            ct.closePath();
            if(this.stroke)
            {
                ct.lineWidth = this.lineWidth;
                ct.strokeStyle = this.scolor;
                ct.stroke();
            }
            if(this.fill)
            {
                ct.fillStyle =this.grt?Q.fn.cGradient({
                    x1:this.x+this.grt.x1*this.w,
                    y1:this.y+this.grt.y1*this.h,
                    x2:this.x+this.grt.x2*this.w,
                    y2:this.y+this.grt.y2*this.h,
                    colors:this.grt.colors,
                    ctx:ct
                }):this.color;
                ct.fill();
            }
        }
        ct.restore();
        return this;
    }
});





fn.cC(fn.defines({
    className:'arc',
    extend:'display',

    r:0,

    grt:null,

    stroke:false,
    fill:true,

    lineWidth:2,

    scolor:'#666',
    color:'#ddd',

    shadow:null,

    constructor:function(a){
        this.set(a);
    },
    draw:function(ct)
    {
         ct.save();
        if(!this.opacity==1||!this.scaleX==1||!this.scaleX==1||this.rotation){


            ct.fillStyle = this.color;
    
            ct.globalAlpha = this.opacity;
            ct.translate(this.x,this.y);
            ct.scale(this.scaleX,this.scaleY);
            this.rotation&&ct.rotate(this.rotation*Math.PI/180);

            ct.beginPath();
            ct.moveTo(-this.anchorX*this.w+this.r, this.y);
            ct.arcTo(-this.anchorX*this.w+this.w, -this.anchorY*this.h, -this.anchorX*this.w+this.w,-this.anchorY*this.h+this.h, this.r);
            ct.arcTo(-this.anchorX*this.w+this.w, -this.anchorY*this.h+this.h, -this.anchorX*this.w,-this.anchorY*this.h+this.h, this.r);
            ct.arcTo(-this.anchorX*this.w,-this.anchorY*this.h+this.h, -this.anchorX*this.w,-this.anchorY*this.h, this.r);
            ct.arcTo(-this.anchorX*this.w,-this.anchorY*this.h, -this.anchorX*this.w+this.w,-this.anchorY*this.h, this.r);
            ct.closePath();
            ct.fill();
            
        }else{

        	this.opacity!=1&&(ct.globalAlpha = this.opacity);
        	(this.scaleX!=1||this.scaleY!=1)&&ct.scale(this.scaleX,this.scaleY);
           
            if(this.shadow)
            {
                this.shadow.color&&(ct.shadowColor=this.shadow.color);
                this.shadow.blur&&(ct.shadowBlur=this.shadow.blur);
                this.shadow.ox&&(ct.shadowOffsetX=this.shadow.ox);
                this.shadow.oy&&(ct.shadowOffsetY=this.shadow.oy);
            }

            ct.beginPath();

          	ct.moveTo(
          		this.x,this.y
          		);

            ct.arc(
            	this.x,this.y
            	,this.r,
	        this._sangle,
	        this._eangle,false);

	        ct.closePath();

            if(this.stroke)
            {
                ct.lineWidth = this.lineWidth;
                ct.strokeStyle = this.scolor;
                ct.stroke();
            }
            if(this.fill)
            {
                ct.fillStyle =this.grt?Q.fn.cGradient({
                    x1:this.x+this.grt.x1*this.w,
                    y1:this.y+this.grt.y1*this.h,
                    x2:this.x+this.grt.x2*this.w,
                    y2:this.y+this.grt.y2*this.h,
                    colors:this.grt.colors,
                    ctx:ct
                }):this.color;
                ct.fill();
            }
        }
        ct.restore();
        return this;
    }
},{
	'_sangle': {
            value:(Math.PI/180)*-90,
            writable:true
    },
    'sangle': {
	        get:function(){
	        	return this._sangle/(Math.PI/180)+90
	        },
	        set:function(value){
	        	this._sangle = (Math.PI/180)*(value-90);
	        },
	        enumerable: true,
		    configurable: true
    },
    '_eangle': {
            value:(Math.PI/180)*270,
            writable:true
    },
    'eangle': {
	        get:function(){
	        	return this._eangle/(Math.PI/180)+90;
	        },
	        set:function(value){
	        	this._eangle = (Math.PI/180)*(value-90);
	        },
	        enumerable: true,
		    configurable: true
    }

}));


fn.cC(fn.defines({
	className:'text',
	extend:'display',

	maxw:0,
	maxh:0,
	color : "red",
	baseline:"middle",
	align :"center",

	_text:"meow",

	_ct:miao.cas.pool[0].ctx,

	size:10,
	font:"Microsoft YaHei",
	lheight:.1,
	tyle:"normal",
	variant:"normal",
	weight:"normal",

	draw:function(_ct)
	{
		if(!this.visible)return;
		_ct.save();
		(this.opacity<1)&&(_ct.globalAlpha = this.opacity);
		_ct.fillStyle = this.color;
		_ct.textBaseline = this.baseline;
		_ct.textAlign = this.align;
		_ct.font = this.tyle+" "+this.variant+" "+this.weight+" "+this.size+"px "+this.font;
		for(var t = 0;t<this.texs.length;t++)
			_ct.fillText(this.texs[t],this.x,this.y+this.size*t*(1+this.lheight));


		_ct.restore();
		return this;
	},
	constructor:function(a){

		this.texs = [];
		this.set(a);
		a.cover&&fn.coverOwn(this,a.cover);
	},
	set:function(a){

		a.w&&fn.isS(a.w)&&(a.w=fn.getPix(a.w));
		a.h&&fn.isS(a.h)&&(a.h=fn.getPix(a.h));
		a.x&&fn.isS(a.x)&&(a.x=fn.getPix(a.x));
		a.y&&fn.isS(a.y)&&(a.y=fn.getPix(a.y));

		a.size&&fn.isS(a.size)&&(a.size=fn.getPix(a.size));
		a.maxw&&fn.isS(a.maxw)&&(a.maxw=fn.getPix(a.maxw));

		fn.setOwn(this,a);
		for(var i in a)fn.isF(this[i])&&this[i](a[i]);
	
		return this;
	},
	_set:function(_ct)
	{
		_ct.save();
		_ct.font = this.tyle+" "+this.variant+" "+this.weight
		+" "+this.size+"px "+this.font;
		var  zw  = _ct.measureText(this.text).width 
			,arr = []
			,ts = this;
		if(zw > ts.maxw&&ts.maxw!=0)
		{

			var hzs = parseInt(ts.maxw / ts.size)
			   ,hs  = Math.ceil(zw / ts.maxw)
			   ,dhi = 0
			   ,isO = true
			   ,dhs = 0
			   ,a =null;

			(function ff(t){
				dhs = hzs;
				a = t.slice(0,dhs);
				while((ts.maxw - _ct.measureText(a).width) > ts.size)
				{
					dhs += parseInt((ts.maxw - _ct.measureText(a).width) /ts.size);
					a = t.slice(0,dhs)	
				};
				arr.push(a);
				if (_ct.measureText(t.slice(dhs,t.length)).width <= ts.maxw) 
				{
					return  arr.push(t.slice(dhs,t.length));
				}else{
					return	ff(t.slice(dhs,t.length));
				}
			}(ts.text));
			ts.w = ts.maxw;
		}else{
			ts.w = zw;
			arr.push(this.text);
		}
		_ct.restore();
		this.h = arr.length*this.size*(1+this.lheight);
		this._ht = arr;
	}
},{


	 'text': {
        get:function(){
        	return this._text
        },
        set:function(value){

        	this._text = value;
        	if(!this.maxw)return this.texs=[value];

        	var p = [],t = this._text, size = this.size,ps = t.split('\n'),
        	i=0,l = ps.length,zw, hs,ls,sz,cha,_ct =this._ct,maxw=this.maxw;
        	_ct.save();
        	_ct.font = this.tyle+" "+this.variant+" "+this.weight+" "+this.size+"px "+this.font;

			 for(;i<l;i++){
			    hs = ps[i];
			    zw = _ct.measureText(hs).width;
			    if( zw > maxw){
			      sz = maxw / size | 0 ; 
			      ls = hs.slice( 0 , sz);
			      while(1){
			        ls = hs.slice( 0 , sz);
			        cha = _ct.measureText(ls).width - maxw;
			        if( cha > size){sz--}else if(cha<-size){sz++}else{
			          p.push(ls);
			          hs = hs.slice(sz);
			          if(_ct.measureText(hs).width < maxw)break;
			        }
			        sz>hs.length&&(sz=hs.length);
			      }
			    }else{
			      p.push(hs);
			    }
			}
			var zzw = 0;
			p.forEach(function(m){
				var ww = _ct.measureText(m).width;
				zzw = ww>zzw?ww:zzw;
			});

			this.h = p.length*this.size*(1+this.lheight);
			this.w = zzw;

			this.texs = p;
			_ct.restore();
        },
        enumerable: true,
	    configurable: true
    }
}));



fn.cC({
    className:'button',
    extend:'display',

    r:0,

    grt:null,

    stroke:false,
    fill:true,

    lineWidth:2,

    scolor:'#666',
    color:'#ddd',

    tcolor :"#333",

	baseline:"middle",
	align :"center",

	text:"button",
	size:10,
	font:"Microsoft YaHei",
	tyle:"normal",
	variant:"normal",
	weight:"normal",

    shadow:null,

    constructor:function(a){
		a.r&&fn.isS(a.r)&&(a.r=fn.getPix(a.r));

		a.size&&fn.isS(a.size)&&(a.size=fn.getPix(a.size));

    	if(fn.inof(this,'button'))this.set(a);
    },
    draw:function(ct)
    {
         ct.save();
        if(!this.opacity==1||!this.scaleX==1||!this.scaleX==1||this.rotation){
            ct.fillStyle = this.color;
            ct.globalAlpha = this.opacity;
            ct.translate(this.x,this.y);
            ct.scale(this.scaleX,this.scaleY);
            this.rotation&&ct.rotate(this.rotation*Math.PI/180);

            ct.beginPath();
            ct.moveTo(-this.anchorX*this.w+this.r, this.y);
            ct.arcTo(-this.anchorX*this.w+this.w, -this.anchorY*this.h, -this.anchorX*this.w+this.w,-this.anchorY*this.h+this.h, this.r);
            ct.arcTo(-this.anchorX*this.w+this.w, -this.anchorY*this.h+this.h, -this.anchorX*this.w,-this.anchorY*this.h+this.h, this.r);
            ct.arcTo(-this.anchorX*this.w,-this.anchorY*this.h+this.h, -this.anchorX*this.w,-this.anchorY*this.h, this.r);
            ct.arcTo(-this.anchorX*this.w,-this.anchorY*this.h, -this.anchorX*this.w+this.w,-this.anchorY*this.h, this.r);
            ct.closePath();
            ct.fill();
          
        }else{

            ct.globalAlpha = this.opacity;

            if(this.shadow)
            {
                this.shadow.color&&(ct.shadowColor=this.shadow.color);
                this.shadow.blur&&(ct.shadowBlur=this.shadow.blur);
                this.shadow.ox&&(ct.shadowOffsetX=this.shadow.ox);
                this.shadow.oy&&(ct.shadowOffsetY=this.shadow.oy);
            }

            ct.beginPath();
            ct.moveTo(this.x+this.r, this.y);
            ct.arcTo(this.x+this.w, this.y, this.x+this.w, this.y+this.h, this.r);
            ct.arcTo(this.x+this.w, this.y+this.h, this.x, this.y+this.h, this.r);
            ct.arcTo(this.x, this.y+this.h, this.x, this.y, this.r);
            ct.arcTo(this.x, this.y, this.x+this.w, this.y, this.r);
            ct.closePath();
            if(this.stroke)
            {
                ct.lineWidth = this.lineWidth;
                ct.strokeStyle = this.scolor;
                ct.stroke();
            }
            if(this.fill)
            {
                ct.fillStyle =this.grt?Q.fn.cGradient({
                    x1:this.x+this.grt.x1*this.w,
                    y1:this.y+this.grt.y1*this.h,
                    x2:this.x+this.grt.x2*this.w,
                    y2:this.y+this.grt.y2*this.h,
                    colors:this.grt.colors,
                    ctx:ct
                }):this.color;
                ct.fill();
            }
        }

        ct.fillStyle = this.tcolor;
		ct.textBaseline = this.baseline;
		ct.textAlign = this.align;
		ct.font = this.tyle+" "+this.variant+" "+this.weight+" "+this.size+"px "+this.font;

        ct.fillText(this.text,this.x+this.w*.5,this.y+this.h*.5);

        ct.restore();
        return this;
    }
});

!function(){
var filein = document.createElement('input');
var textin = document.createElement('input');

filein.type = 'file';
textin.type = 'text';


filein.id = 'filein';
textin.id = 'textin';
var textwho =nl;

fn.setCss(textin,{
	'position': 'fixed',
	'z-index':101,
	display:'none',
	fontFamily:'Microsoft YaHei'
});

fn.setCss(filein,{
	'position': 'fixed',
	'z-index':101,
	display:'none',
	opacity:0
});

fn.cC(fn.defines({

	className:'input',

	extend:'button',
	type:'text',

	scolor:'#0066CC',

	dm:nl,
	display:function(){
		this.df.style.display='none';
	},

	draw:function(ct){
		if(this.dm){
			this.dm.style.left =   this.x;
			this.dm.style.top =    this.y;
			this.dm.style.width =  this.w;
			this.dm.style.height = this.h;
		}
		quo.class.button[pes].draw.call(this,ct);
	},
	
	constructor:function(a){
		this.dm = document.createElement('input');

		this.dm.type = a.type;
		this.dm.id = this.uid;
		var ts = this;

		fn.setCss(this.dm,{
			'position': 'fixed',
			'z-index':101,
			display:'none',
			outline:'none',
			textAlign:'center',
			opacity:0,
			background:'rgba(0,0,0,0)',
			fontFamily:'Microsoft YaHei'
		});

		this._listener = {
			toggle:function(){
				console.log('toggle');
				this.dm.style.left =     this.x;
				this.dm.style.top =      this.y;
				this.dm.style.width =    this.w;
				this.dm.style.height =   this.h;
				this.dm.style.fontSize = this.size||this.h*.8;
				this.dm.style.color =    this.tcolor;
				this.dm.style.display = 'block';
				!fn.$(this.uid)&&document.body.appendChild(this.dm);
			},
			unload:function(){
				document.body.removeChild(this.dm);
			}
		};

		if(fn.inof(this,'input'))this.set(a);
    	if(!a.size)this.size = this.h*.7;
    	this._tcolor = this.tcolor;
    	a.type=='text'&&(this.dm.value = this.text);

		this.dm.addEventListener('focus',function(){
			if(a.type=='text')
			{
				ts.tcolor='rgba(0,0,0,0)';
				ts.dm.style.opacity = 1;
			}
		},false);

		if(this.type=='file')
		{
			this.dm.addEventListener('change',function(e){
				console.log('a');
				var image = new Image();
				image.src =   getUrl(e.target.files[0]);
			    image.onload=function(){
			 		//ts.trigger(ts,'change');

			 		pub.trigger(ts,'change',image);
			    	URL.revokeObjectURL(image.src);
			    }
			},false);
		}

		

		this.dm.addEventListener('blur',function(){
			if(a.type=='text')
			{
				ts.set({text:ts.dm.value})
				a.type=='text'&&(ts.dm.style.opacity = 0);
				ts.tcolor=ts._tcolor;
			}
		},false);

    	
	}
},{
	
}));

}();

fn.cC({

	className:'layer',
	extend:'display',

	mask:nl,
	ismask:nl,

	someFn:function(){
		pub.trigges(this,'toggle');
	},

	background:nl, 
	autoRedraw:false,
	_sort:function(a){
		a.sort(function(c,d) {return c.depth>d.depth})
	},

	addChild:function( o ){
		o.addTo(this);
		return this
	},

	listener:function(a)
	{
		for(var i in a)
		{
			this._listeners[i] = this._listeners[i]||[];
			pub.sub(this,i,a[i]);
		}
	},

	removChild:function( o ){
		o.removTo(this);
	},

	draw:function(ct){
		
		if(fn.isS(this.background))
		{
			ct.fillStyle = this.background;
			ct.fillRect(this.x,this.y,this.w,this.h);
		}
		var idx=0;
		if(this.ismask)
		{
			this._items.some(function(m,i){
				if(m.depth>=0)return idx=i+1;
				m.visible&&m.draw(ct);
			});

			ct.save();

			this.mask.draw(ct);

			ct.clip();

			for(--idx;idx<this._items.length;idx++)
			this._items[idx].visible&&this._items[idx].draw(ct);
		
			ct.restore();
		}else{
			this._items.forEach(function(m){m.visible&&m.draw(ct)});
		}
	},
	addTo:function( vv , b )
	{
		if(!fn.inof(vv,'view')||fn.inof(this,'view'))return;
		var v=vv;
		if(v._items.length<1){
			v._items.push(this);
		}else{
			for(var i=v._items.length-1;0<=i;i--){
				if(v._items[i].depth<=this.depth){
					v._items.splice(i+1,0,this);break;
				}else{
					if(i==0)v._items.unshift(this);
				}
			}
		}
		this.exists= v;
		return this
	},

	items:function(a)
	{
		var c =this,cak=[],pichu=['group','controller'];

		a.forEach(function(m){
			if(m.ref)
			{
				miao(m.ref).addTo(c);
				
			}else{
				if(m.position)m.position.rve = c;
				if(!m.addTo)m.addTo = c;
				if(pichu.indexOf(m.xtype)!=-1)m.caks = cak;
				fn.cO(m.xtype,m);
			}
		});
		cak.forEach(function(m){m.the.set(m.cs)});
	},

	constructor:function(a){
		this._listeners = {};
		this._listener = {};
		this._items = [];
		this.quo ={}; 
		this.w=a.w||miao.app.w;
		this.h=a.h||miao.app.h;
		fn.inof(this,'layer')&&this.set(a);
	}
});


fn.cC({

	className:'view',
	extend:'layer',
	
	R:nl,

	draw:function(ct){
		if(!this.visible)return;
		if(fn.isS(this.background))
		{
			ct.fillStyle = this.background;
			ct.fillRect(this.x,this.y,this.w,this.h);
		}
		this._items.forEach(function(m){m.visible&&m.draw(ct)});
	},

	listener:function(a){
		for(var i in a)pub.sub(this,i,a[i]);
	},

	someFn:function(){
		this._items.forEach(function(m){m.someFn()});
	},

	constructor:function(a){
		this.ft=true;
		this.autoRedraw = true;
		this.mlay=miao('layer',{w:this.w,h:this.h,autoRedraw:true,exists:this});
		this._items=[this.mlay];
		this.set(a);
	}
});


fn.cC({
	className:'plug',
	extend:'mobj',

	constructor:function(a)
	{
		fn.addOwn(this,a);
	}
});


miao.event ={
	sx:0,
	sy:0,
	px:0,
	py:0,
	dx:0,
	dy:0,
	rate:1.02,
	utime:17
};

!function(){

var ts = 'changedTouches',ev = fn.cO('plug',{

	id:'event',

	axEv:function (n,e)
	{
		

		if(pub.trigger(miao.app,n))return;
		var mll = miao.app.mlayer._listeners[n];
		if(mll&&mll.length>0)
			for(var ii=0,ll=mll.length;ii<ll;ii++){
				var obj = mll[ii];
				if(obj.enabled&&fn.collision('pr',{x:miao.event.px,y:miao.event.py},obj)&&
					pub.trigger(obj,n) )return;
			}

		var av = miao.app.atyView._items,i,j;

		if(fn.collision('pr',{x:miao.event.px,y:miao.event.py},miao.app.atyView)&&pub.trigger(miao.app.atyView,n))return;

		for(i=av.length-1;i>=0;i--){
			if(!(av[i].enabled&&av[i]._listeners[n]))continue;
			if(fn.collision('pr',{x:miao.event.px,y:miao.event.py},av[i])&&pub.trigger(av[i],n))return;
			for(j=av[i]._listeners[n].length-1;j>=0;j--)
			if(av[i]._listeners[n][j].enabled&&fn.collision('pr',{x:miao.event.px,y:miao.event.py},av[i]._listeners[n][j])&&
			pub.trigger(av[i]._listeners[n][j],n))return;
		}	
	},

	axDown:function(e)
	{
		e.preventDefault();
		miao.event.sx=miao.event.px=(e.pageX?e.pageX:(e[ts]&&e[ts][0].pageX||0))-ev.cas.offsetLeft;
		miao.event.sy=miao.event.py=(e.pageY?e.pageY:(e[ts]&&e[ts][0].pageY||0))-ev.cas.offsetTop;
		ev.axEv('click',e);
	},
	axUp:function(e)
	{
		e.preventDefault();
		miao.event.px=(e.pageX?e.pageX:(e[ts]&&e[ts][0].pageX||0))-ev.cas.offsetLeft;
		miao.event.py=(e.pageY?e.pageY:(e[ts]&&e[ts][0].pageY||0))-ev.cas.offsetTop;
		ev.axEv('up',e)
	},
	axMove:function(e)
	{
		e.preventDefault();
		miao.event.dx=(e.pageX?e.pageX-miao.event.px:(e[ts]&&e[ts][0].pageX||0)-miao.event.px)-ev.cas.offsetLeft;
		miao.event.dy=(e.pageY?e.pageY-miao.event.py:(e[ts]&&e[ts][0].pageY||0)-miao.event.py)-ev.cas.offsetTop;
		miao.event.px=(e.pageX?e.pageX:(e[ts]&&e[ts][0].pageX||0))-ev.cas.offsetLeft;
		miao.event.py=(e.pageY?e.pageY:(e[ts]&&e[ts][0].pageY||0))-ev.cas.offsetTop;
		ev.axEv('move',e);

	},
	cas:nl,

	addListener:function(c){
		this.cas = c;
		if(!miao.device.isPhone){
		c.addEventListener( 'mousedown'  ,ev.axDown,false);
		c.addEventListener( 'mousemove'  ,ev.axMove,false);
		c.addEventListener( 'mouseup'    ,ev.axUp,false)}else{
		c.addEventListener( 'touchstart' ,ev.axDown,false);
		c.addEventListener( 'touchmove'  ,ev.axMove,false);
		c.addEventListener( 'touchend'   ,ev.axUp,false)};
	}
});

}();

fn.cC({
	className:'R',
	extend:'mobj',
	obj:nl,
	constructor:function(a){
		fn.coverOwn(this,a);
	}
});

!function(){

miao.R = function(n){
	if(!miao.R[n])return false;
	return miao.R[n];
};

var ref = {
	image:{
		path:'R/',
		file:'file',
		objs:'frames',
		obj:{x:'x',y:'y',w:'w',h:'h'}
	}
};

var R = fn.cO({
		
		getRes:function(n)
		{
			if(!this.quo[n])return false;
			return this.quo[n];
		},

		loaders:{

			image:function(_srcs,__ck)
			{
				
				var rs = {},_s = _srcs;
				_s.forEach(function(m){
					if(/.json$/.test(m.src)){



					}else{

					}

					var a = new Image(),res=fn.cO('R',{x:0,y:0,w:a.width,h:a.height,obj:a});
					a.src = ref['image'].path+m.src;
					a.onload = function(){
						res.w=a.width;
						res.h=a.height;
						__ck();
					}
					
					
					miao.R[m.name] = res;
				});
			},

			// audio:function(_srcs,__ck)
			// {
			// 	var rs = {},_s = _srcs;
			// 	_s.forEach(function(m){
			// 		var a = new Audio('./R/'+m.src);

			// 		a.addEventListener('canplaythrough',function(){
			// 			__ck();
			// 		},false);
			// 		miao.R[m.name] = a;

			// 	});
			// },

			audio:function(_srcs,__ck)
			{
				var rs = {},_s = _srcs;

				console.log('audio/');

				_s.forEach(function(m){
					console.log('R/'+m.src);

					miao.ajax({
						responseType:'blob',
						url:'R/'+m.src,
						done:function(a){
							var bl = fn.createURL(a),
							_im = new Audio(bl);
							miao.R[m.name] = _im;
							__ck();
						}
					});
					
					//_im = new Audio(bl);



					miao.R[m.name] = a;
				});
			},

			/*loadAudio:function( _url , __ck , err , ty){
		
		miao.ajax({
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
	},*/

			loadscript:function(_url,__ck)
			{
				var 

				script = document.createElement('script'),

				docHead = G.document&& (document.head || 
					document.getElementsByTagName('head')[0]),

		        me = this,

		        clearSE = function(_script) {
		            _script.onload = null;
		            _script.onerror = null;
		            docHead.removeChild(_script);
				},

		        _loadFn = function() {
		            clearSE(script);
		            __ck();
		        };

		        script.type = 'text/javascript';
		        script.src = _url;
		        script.onload = _loadFn;
		        script.onerror = clearSE;
		        docHead.appendChild(script);
			},

			views:function(_srcs,__ck)
			{
				var _s = _srcs;
				for(var i in _s)
				{
					var _path = './' + 'views/'+ _s[i] +'.js',
					vn = _s[i];
					this.loadscript(_path,__ck);
				}
			},

			layer:function(_srcs,__ck)
			{
				var _s = _srcs;
				for(var i in _s)
				{
					var _path = './' + 'layer/'+ _s[i] +'.js',
					vn = _s[i];
					this.loadscript(_path,__ck);
				}
			},

			controller:function(_srcs,__ck)
			{
				var _s = _srcs;
				for(var i in _s)
				{
					var _path = './' + 'controller/'+ _s[i] +'.js',
					vn = _s[i];
					this.loadscript(_path,__ck);
				}
			},

			model:function(_srcs,__ck)
			{
				var _s = _srcs;
				for(var i in _s)
				{
					var _path = './' + 'model/'+ _s[i] +'.js',
					vn = _s[i];
					this.loadscript(_path,__ck);
				}
			},

			plug:function(_srcs,__ck)
			{
				var _s = _srcs;
				for(var i in _s)
				{
					var _path = './' + 'plug/'+ _s[i] +'.js',
					vn = _s[i];
					this.loadscript(_path,__ck);
				}
			}
		},
		addLoaders:function(a,b){
			this.loaders[a]=b;
		},

		sx:['plug','image','audio','layer','views'],
		load:function(ra)
		{
			console.log(111)
			var oa = {},count = 0,rLength = 0,i,js=0,ars = [],ts=this,idx =0,qu;
			for(i in ra.R)if(ra.R[i].length>0)ars.push(i)&&(rLength +=ra.R[i].length);
				//console.log('l');
			!function exe(_i){
				var m = ts.sx[_i],jsle=0;
				if(ars.indexOf(m)>-1)
				{
					ars.splice(ars.indexOf(m),1);
					ts.loaders[m](ra.R[m],function(){
						jsle++;
						count++;
						pub.trigger(ra,'loading',{idx:count,length:rLength,ty:m});
						if(count==rLength)pub.trigger(ra,'init');
						else ra.R[m].length==jsle&&exe(idx++);
					})}
				else if(idx<ts.sx.length){exe(idx++)}
				else if(ars.length>0){
					ars.forEach(function(m){
						ts.loaders[m](ra.R[m],function(){
							count++;
							pub.trigger(ra,'loading',{idx:count,length:rLength,ty:m});
							count==rLength&&pub.trigger(ra,'init');
						});
					});
				}
			}(idx);
		}
	});

fn.addOwn(miao.R,R);

}();


fn.cC({
	className:'model',
	extend:'mobj',

	constructor:function(a){
		fn.addOwn(this,a);
	}
});

fn.cC({
	className:'store',
	extend:'mobj',

	constructor:function(a){
		fn.addOwn(this,a);
	}
});


fn.cC({
	className:'thread',
	extend:'mobj',

	run:nl,
	onMes:function(cak){
		this.run.onmessage = cak;
	},
	postMes:function(config){
		this.run.postMessage(config);
	},
	close:function(){
		this.run.terminate();
	},
	constructor:function(a){
		this.run = new Worker(a.src);
		fn.addOwn(this,a);
	}
});


fn.cC({

	className:'controller',
	extend:'mobj',


	id:nl,
	refs:nl,
	control:nl,
	fns:nl,
	binf:function(a)
	{
	},
	set:function(a){
		this.control={};
		this.refs={};
		this.fns=a.fns;
		for(var i in a.refs)
		{
			this.refs[i]=miao(a.refs[i]);
			if(!this.refs[i]||!a.control[i])continue;
			for(var j in a.control[i])
			{
				if(!fn.isF(a.fns[a.control[i][j]]))continue;
				pub.sub(this.refs[i],j,a.fns[a.control[i][j]]);
				(this.refs[i].exists._listener[j]||(this.refs[i].exists._listener[j]=[])).push(this.refs[i]);
			}
		}
	},
	constructor:function(a){
		if(a.caks){
			a.caks.push({the:this,cs:a});
		}else{
			this.set(a);
		}
	}
});



fn.cC({

	className:'app',
	extend:'mobj',


	name:'欢迎使用miaojs',
	parent:nl,

	w:nl,
	h:nl,

	R:nl,

	css:nl,

	set:function(a,b,c){
		a&&fn.setOwn(this,a);
		b&&fn.coverOwn(this,b);
		if(c!==false)for(var i in a){
			if(!fn.isF(this[i]))continue;
			if(fn.isA(a[i]))this[i].apply(this[i],a[i]);
			else this[i](a[i]);	
		}
		return this;
	},

	autoview:true,

	resolution:.8,
	atyView:nl,
	cas:nl,
	ctx:nl,
	_listener:{},
	listener:function(a){
		for(var i in a)
		pub.sub(this,i,a[i]);
	},
	enabled:true,

	path:'./',
	
	constructor:function(a)
	{
		miao.app = miao.app||this;
		this.set(a);
		if(a.resolution)this.resolution = a.resolution;
		if(a.name)this.name = a.name;

		document.title = this.name;
		this.R = a.R;

		var vi,cas = miao.cas.get();
		if(vi=document.querySelector("meta[name=viewport]")){
			vi.setAttribute('content','width=device-width,height=device-height,initial-scale='+
					(Math.round(innerWidth/(innerWidth*devicePixelRatio)*100/this.resolution)/100)
				+',user-scalable=no');
		}else{
			vi = document.createElement('meta');
			vi.setAttribute('name','viewport');
			vi.setAttribute('content','width=device-width,height=device-height,initial-scale='+
					(Math.round(innerWidth/(innerWidth*devicePixelRatio)*100/this.resolution)/100)
				+',user-scalable=no');
			(document.head || document.getElementsByTagName('head')[0]).appendChild(vi);
		}

		this.parent = a.parent||document.body;

		this.w = cas.w = this.parent.clientWidth;
		this.h = cas.h = this.parent.clientHeight;

		this.cas = cas.cas;
		this.ctx = cas.ctx;

		this.mlayer=miao('layer',{w:this.w,h:this.h,exists:this});

		if(this.autoview&&!miao.device.isPhone&&G.innerWidth/G.innerHeight >= .6)
		{
			var _w,_h;
			this.cas.style.position = 'fixed';
			this.cas.style.height = G.innerHeight+'px';
			_w = G.innerHeight*.6;
			_h = G.innerHeight;
			this.cas.style.width = _w+'px';
			this.cas.style.left = (G.innerWidth-_w)*.5+'px';
			this.cas.style.width = G.innerHeight*(9/15)+'px';
			this.cas.width= this.w=_w;
			this.cas.height=this.h= _h;
		}

		if(/iPad/i.test(navigator.userAgent))
		{
			this.cas.style.position = 'fixed';
			this.cas.style.top = '3%';
			this.h = cas.h =this.parent.clientHeight*.97;
			this.cas.style.height = '97%';
		}

		this.parent.appendChild(this.cas);
		if(this._listener.ade)
		pub.trigger(this,'ade',{cak:function(){
			miao.R.load(miao.app);
		}});else miao.R.load(miao.app);

		setTimeout(function(){
				fn.find('plug','event').addListener(cas.cas);
		},100);
		
	}
});

!function(){

miao.jsonp  = function(a){

    var callbackName = "miaojsonp" + miao.uid , cakname = a.cakname || 'callback';
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

fn.cC({

	className:'Ajax',
	extend:'mobj',
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
	set:Q.fn.set,
	constructor:function(a){

		this.xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		this.set(a);

	}
});



miao.ajax = function(){

	var xhr = {

		xhrPool:[miao('Ajax',{})],
		repay:function(a){
			if(a.idle)this.xhrPool.push(a);
			return a;
		},
		get:function(){
			var o;
			if(!this.xhrPool.some(function(m){if(m.idle)return o=m}))
			o = this.repay(miao('Ajax',{}));
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

miao.rm = function(num){return Math.round(Math.random()*num)};
miao.rmr = function(a,b){
	var ar = [],s = b,is= false;
	while(s){
		var ts = miao.rm(a);
		is= false;
		ar.forEach(function(m){
			if(ts==m)is=true;
		});

		if(!is){
			ar.push(ts);
			s--;
		}
	}
	return ar;
};


function miao( a , b ){
return fn.isS(a)?arguments.length==1?_g[a]:fn.cO(a,b):fn.cC(a,b)};
return miao;

}));
