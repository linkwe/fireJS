!function(){

var utils = Q.utils , CONST = Q.CONST,_class = Q.class;

function View(a){

    a=a||{};

    _class.Container.call(this);

    if(a.name){

        Q.g.viewsCache[a.name] = this;
        
    }

    this.backgroundColor = null;

    this.root = null ;

    this.__listeners = {};

    this._width = a.width || Q.app.width;
    this._height = a.height || Q.app.height;

    Q.message.once(this,'init',this._init);


    this.set(a);

}

View.prototype = Object.create(_class.Container.prototype);


View.prototype.destroy = function (destroyBaseTexture){

    this.context = null;
    this.canvas = null;
    this._style = null;
    this._texture.destroy(destroyBaseTexture === undefined ? true : destroyBaseTexture);

};

View.prototype.run = function(){};


Object.defineProperties(View.prototype, {
   
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

View.prototype._init = function (n){

   Q.message.inj(this,'up',function(e){
        var ax,obj;
        if(this.__listeners&&(ax=this.__listeners['up']))
        for(var i = ax.length-1;i>=0;i--){
            obj = this.children[i];
            if(obj.enabled&&obj.containsPoint(Q.event.now)&&
            Q.message.trigger(obj,'up'))return true;
        }
    });

    Q.message.inj(this,'down',function(e){
        
        var ax,obj;
        if(this.__listeners&&(ax=this.__listeners['down']))
        for(var i = ax.length-1;i>=0;i--){
            obj = this.__listeners['down'][i];
            if(obj.enabled&&obj.containsPoint(Q.event.now))
            {
                if(Q.message.trigger(obj,'down'))return true;
            }
            
        }
    });

    Q.message.inj(this,'move',function(e){
        //console.log(1,'mo')
        var ax,obj;
        if(this.__listeners&&(ax=this.__listeners['move']))
        for(var i = ax.length-1;i>=0;i--){
            obj = this.__listeners['move'][i];
            if(obj.enabled&&obj.containsPoint(Q.event.now)&&
            Q.message.trigger(obj,'move'))return true;
        }
    });

};

Q.exports = View;


}();