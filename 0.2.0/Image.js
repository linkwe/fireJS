!function(){

var _class =  Q.class , DEF_IMG_SRC = '' , CONST = Q.CONST ;

function _Image( a )
{
    a = a || {} ;

    _class.DisplayObject.call(this);

    this._width = 0;

    this._height = 0;

    this.tint = 0xFFFFFF;

    this.blendMode = CONST.BLEND_MODES.NORMAL;

    this.shader = null;

    this.cachedTint = 0xFFFFFF;

    this._image = null;

    this._texture = null;

    this.adapt = '';

    if(a.texture){

        this.texture = a.texture;

        a.texture = null;
        delete a.texture;

    }else{

        if(a.image){

            this.texture = new _class.Texture(new _class.BaseTexture(a.image));
            a.image = null;
            delete a.image;

        }else{

            this.texture = new _class.Texture(new _class.BaseTexture(new Image()));
            this.load(a.src||DEF_IMG_SRC);
        }
    }

    this.set(a);

};

_Image.prototype = Object.create(_class.DisplayObject.prototype);

_Image.prototype.constructor = _Image;

Object.defineProperties(_Image.prototype,{ 

    width: {

        get: function () {

            return this.scale.x * this.texture._frame.width;

        },

        set: function (value) {
            this.scale.x = value / this.texture._frame.width;
            this._width = value;
        }
    },

    height: {
        get: function ()
        {
            return  this.scale.y * this.texture._frame.height;
        },
        set: function ( value )
        {
            this.scale.y = value / this.texture._frame.height;
            this._height = value;
        }
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
                    Q.message.once(value,'update',this._onTextureUpdate.bind(this));
                }
            }
        }
    },

   
    image:{
        get:function(){

            return this._texture.baseTexture.source;

        },
        set:function(v){
            this._texture.baseTexture.loadSource(v);
        }
    }
});

_Image.prototype.load = _class.Sprite.prototype.load;


_Image.prototype.horizontal = function(a){

    var x = Q.fn.horizontal(this,this.parent,'center');

    this.x = x;

    return this;


}





_Image.prototype.auto = _class.Sprite.prototype.auto;

_Image.prototype._onTextureUpdate = function ()
{
   
    if (this._width)
    {
        this.scale.x = this._width / this.texture.frame.width;
    }

    if (this._height)
    {
        this.scale.y = this._height / this.texture.frame.height;
    }

};

_Image.prototype.getBounds = _class.Sprite.prototype.getBounds;

_Image.prototype.getLocalBounds = _class.Sprite.prototype.getLocalBounds;

_Image.prototype.containsPoint = _class.Sprite.prototype.containsPoint;


_Image.prototype._renderWebGL = function (renderer)
{
    renderer.setObjectRenderer(renderer.plugins.sprite);
    renderer.plugins.sprite.render(this);
};

_Image.prototype.renderWebGL = function (renderer)
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
};

_Image.prototype._renderCanvas = function (renderer)
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
};

_Image.prototype.renderCanvas = function (renderer)
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
};

Q.exports = _Image;

}();