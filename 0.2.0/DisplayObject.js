!function(){

var utils = Q.utils , CONST = Q.CONST,_class = Q.class;

function DisplayObject(a)
{
    a = a || {};

    this._id = null;

    this.uid = Q.uid;

    this.name = null;

    this.position = new _class.Point();

    this.anchor = new _class.Point();

    this.scale = new _class.Point(a.x||1,a.y||1);

    this.pivot = new _class.Point(0, 0);

    this.rotation = 0;

    this.alpha = 1;

    this.visible = true;

    this.renderable = true;

    this.enabled = true;

    this.depth = 0 ;
   
    this.parent = null;

    this.worldAlpha = 1;

    this.worldTransform = new _class.Matrix();

    this.filterArea = null;

    this._sr = 0;

    this._cr = 1;
  
    this._bounds = new _class.Rectangle(0, 0, 1, 1);

    this._currentBounds = null;

    this._mask = null;

    this._cacheAsBitmap = false;

    this._cachedObject = null;
    
}

DisplayObject.prototype.constructor = DisplayObject;

Object.defineProperties(DisplayObject.prototype, {
     id: {
        get: function ()
        {
            return this._id;
        },
        set: function (value)
        {
            this._id = value;
            Q.g.objCache[value]=this;
        }
    },
  
    x: {
        get: function ()
        {
            return this.position.x;
        },
        set: function (value)
        {
            this.position.x = value;
        }
    },

    y: {
        get: function ()
        {
            return this.position.y;
        },
        set: function (value)
        {
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


DisplayObject.prototype.updateTransform = function ()
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
};

DisplayObject.prototype.displayObjectUpdateTransform = DisplayObject.prototype.updateTransform;

DisplayObject.prototype.set = Q.fn.set;
DisplayObject.prototype.init = function(a){
Q.message.trigger(this,'init',a);
return this;
};

DisplayObject.prototype.horizontal = function(a){
    return Q.fn.horizontal.call(this,a);
};

DisplayObject.prototype.vertical = function(a){
    return Q.fn.horizontal.call(this,a);
};

DisplayObject.prototype.autoPosition = function(a){

    if(a.horizontal){
        Q.fn.horizontal.call(this,a.horizontal);
    }

    if(a.vertical){
        Q.fn.vertical.call(this,a.vertical);
    }
    return this;
    
};


DisplayObject.prototype.animate = function( a , b ){

    this._animate = this._animate||{};
    var arr = [],hok=null,tem;

    if(Q.fn.isA(a)){
        for(var i = a.length-1; i>=0;i--){
            a[i].obj = this;
            tem = Q.Tween.create(a[i]);
            if(hok)tem.chain(hok);
            hok = tem;
        }
    }else{
        a.obj = this;
        tem = Q.Tween.create(a);
    }
    this._animate[b||Q.uid] = tem;
    tem.start();
    return;

};

DisplayObject.prototype.stop = function( a ){

    if(!this._animate)return;
    if(a&&this._animate[a]){
         this._animate[a].stop();
         this._animate[a] = null;
    }else{
        for(var i in this._animate)this._animate[i].stop();
        this._animate = null;
    }
    return this;
    
}

DisplayObject.prototype.bind = function(n,b) {

    if(!this._listener[n])return;

    var root , i ;

   if(b){

        if(!b.__listeners)return;
        root = b;

    }else{

        if(!this.parent)return;

        !function cha(_n){

            if( _n.__listeners ){ 

                 root = _n;

            }else{

                cha( _n.parent );

            }
        }(this.parent);

    }

    Q.message.bind(this,n,root);

    return this;

};

DisplayObject.prototype.unbind = function(n) {

   
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

    Q.message.unbind(this,n,root);

    return this;

};


DisplayObject.prototype.addTo = function(v) {

    v.addChild(this);

    return this;

}



DisplayObject.prototype.removeTo = function(v) {

    v.removeChild(this);

    if(this._listener)
    for(var j in this._listener)
    if(CONST.DEF_EV.indexOf(j)!=-1)this.unbind(j);
    return this;
    
}

DisplayObject.prototype.on = function(n,b){

    Q.message.on(this,n,b);
    if(this._listener)
    for(var j in this._listener)
    if(CONST.DEF_EV.indexOf(j)!=-1)this.bind(j);

    return this;

}

DisplayObject.prototype.once = function(n,b){

    Q.message.once(this,n,b);
    if(this._listener)
    for(var j in this._listener)
    if(CONST.DEF_EV.indexOf(j)!=-1)this.bind(j);
    return this;
    
}

DisplayObject.prototype.un = function(n){

    Q.message.un(this,n);
    if(this._listener&&CONST.DEF_EV.indexOf(n)!=-1)
    this.bind(n);
    return this;
}

DisplayObject.prototype.inj = function(n,b){
    Q.message.inj(this,n,b);
    return this;
}

DisplayObject.prototype.uninj = function(n){
    Q.message.uinj(this,n);
    return this;
}

DisplayObject.prototype.listener = function(a){
    for(var i in a)this.on(i,a[i]);
    return this;
        
}



DisplayObject.prototype.getBounds = function (matrix) // jshint unused:false
{
    return Rectangle.EMPTY;
};


DisplayObject.prototype.getLocalBounds = function ()
{
    return this.getBounds(Matrix.IDENTITY);
};


DisplayObject.prototype.toGlobal = function (position)
{
    // don't need to update the lot
    this.displayObjectUpdateTransform();
    return this.worldTransform.apply(position);
};


DisplayObject.prototype.toLocal = function (position, from)
{
    if (from)
    {
        position = from.toGlobal(position);
    }

    // don't need to update the lot
    this.displayObjectUpdateTransform();
    return this.worldTransform.applyInverse(position);
};


DisplayObject.prototype.renderWebGL = function (renderer){};

DisplayObject.prototype.renderCanvas = function (renderer){};


DisplayObject.prototype.generateTexture = function (renderer, scaleMode, resolution)
{
    var bounds = this.getLocalBounds();

    var renderTexture = new RenderTexture(renderer, bounds.width | 0, bounds.height | 0, scaleMode, resolution);

    _tempMatrix.tx = -bounds.x;
    _tempMatrix.ty = -bounds.y;

    renderTexture.render(this, _tempMatrix);

    return renderTexture;
};


DisplayObject.prototype.destroy = function ()
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
};


Q.exports = DisplayObject;
// Q.exports = Container;
// Q.exports = Sprite;
// Q.exports = View;
// Q.exports = App;

}();