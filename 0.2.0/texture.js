!function(){
	
var _class =  Q.class , CONST = Q.CONST , utils = Q.utils ;


/**
 * 基础纹理
 *
 */
function BaseTexture(source, scaleMode, resolution)
{
    this.uuid = Q.uid;

    /**
     * 纹理的分辨率。
     */
    this.resolution = resolution || 1;

    /**
     * 基础纹理加载后的宽度
     */
    this.width = 100;

    /**
     * 基础纹理加载后的高度
     *
     */
    this.height = 100;

    /**
     * 实际宽度
     */
    this.realWidth = 100;
    /**
     * 实际高度
     */
    this.realHeight = 100;

    /**
     * 缩放模式
     *
     */
    this.scaleMode = scaleMode || CONST.SCALE_MODES.DEFAULT;

    /**
     * 纹理是否已经加载完成
     * 
     * @member {boolean}
     * @readOnly
     */
    this.hasLoaded = false;

    /**
     * 纹理是否在加载中
     *
     * @member {boolean}
     * @readonly
     */
    this.isLoading = false;

    /**
     * 纹理的源对象
     *
     * {Image|Canvas}
     */
    this.source = null; 

    /**
     * 如果控制RGB通道应预先乘以Alpha（WebGL有用）
     */
    this.premultipliedAlpha = true;
    this.imageUrl = null;

    /**
     * 纹理是否是2的幂（WebGL有用）
     */
    this.isPowerOfTwo = false;

 
    /**
     *如果要使用纹理映射，必须在使用前设置true，且纹理必须是2的幂
     */
    this.mipmap = false;

    /**
     * 对应的渲染器ID（WebGL有用）
     */
    this._glTextures = [];

    // 如果没有源，调用加载方法
    if (source)
    {
        this.loadSource(source);
    }

}
BaseTexture.prototype.constructor = BaseTexture;

BaseTexture.prototype.update = function ()
{
    this.realWidth = this.source.naturalWidth || this.source.width;
    this.realHeight = this.source.naturalHeight || this.source.height;

    this.width = this.realWidth / this.resolution;
    this.height = this.realHeight / this.resolution;

    this.isPowerOfTwo = utils.isPowerOfTwo(this.realWidth, this.realHeight);

    //触发updata，将调用所有使用该纹理的更新方法
    Q.message.trigger(this,'update',this);

};

/**
 * 加载资源
 */
BaseTexture.prototype.loadSource = function (source)
{
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

            Q.message.trigger(scope,'loaded',scope);
            
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

            Q.message.trigger(scope,'error',scope);
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
                    Q.message.trigger(scope,'loaded');
                }
            }
            else
            {
                if (wasLoading)
                {
                    Q.message.trigger(scope,'error');
                }
            }
        }
    }
};

BaseTexture.prototype._sourceLoaded = function ()
{
    this.hasLoaded = true;
    this.update();
};

/**
 * 销毁基础纹理
 *
 */
BaseTexture.prototype.destroy = function ()
{
    if (this.imageUrl)
    {
        delete Q.g.BaseTextureCache[this.imageUrl];
        delete Q.g.TextureCache[this.imageUrl];

        this.imageUrl = null;

        if (!navigator.isCocoonJS)
        {
            this.source.src = '';
        }
    }
    else if (this.source && this.source._pixiId)
    {
        delete Q.g.BaseTextureCache[this.source._pixiId];
    }

    this.source = null;

    this.dispose();
};

/**
 *从WebGL释放纹理，但不破坏纹理，后续还可以重复使用
 */
BaseTexture.prototype.dispose = function ()
{
    // this.emit('dispose', this);

    Q.message.trigger(this,'dispose');
    
    this._glTextures.length = 0;

};

/**
 *重新设置url加载资源
 */
BaseTexture.prototype.updateSourceImage = function (newSrc)
{
    this.source.src = newSrc;
    this.loadSource(this.source);
};

BaseTexture.fromImage = function (imageUrl, crossorigin, scaleMode)
{
    var baseTexture = Q.g.BaseTextureCache[imageUrl];

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
        canvas._pixiId = 'canvas_' + Q.uid;
    }

    var baseTexture = Q.g.BaseTextureCache[canvas._pixiId];

    if (!baseTexture)
    {
        baseTexture = new BaseTexture(canvas, scaleMode);
        Q.g.BaseTextureCache[canvas._pixiId] = baseTexture;
    }

    return baseTexture;
};

function TextureUvs()
{
    this.x0 = 0;
    this.y0 = 0;

    this.x1 = 1;
    this.y1 = 0;

    this.x2 = 1;
    this.y2 = 1;

    this.x3 = 0;
    this.y3 = 1;
}


TextureUvs.prototype.set = function (frame, baseFrame, rotate)
{
    var tw = baseFrame.width;
    var th = baseFrame.height;

    if(rotate)
    {
        this.x0 = (frame.x + frame.height) / tw;
        this.y0 = frame.y / th;

        this.x1 = (frame.x + frame.height) / tw;
        this.y1 = (frame.y + frame.width) / th;

        this.x2 = frame.x / tw;
        this.y2 = (frame.y + frame.width) / th;

        this.x3 = frame.x / tw;
        this.y3 = frame.y / th;
    }
    else
    {

        this.x0 = frame.x / tw;
        this.y0 = frame.y / th;

        this.x1 = (frame.x + frame.width) / tw;
        this.y1 = frame.y / th;

        this.x2 = (frame.x + frame.width) / tw;
        this.y2 = (frame.y + frame.height) / th;

        this.x3 = frame.x / tw;
        this.y3 = (frame.y + frame.height) / th;
    }
};


function VideoBaseTexture(source, scaleMode)
{
    if (!source)
    {
        throw new Error('No video source element specified.');
    }


    if ((source.readyState === source.HAVE_ENOUGH_DATA || source.readyState === source.HAVE_FUTURE_DATA) && source.width && source.height)
    {
        source.complete = true;
    }

    BaseTexture.call(this, source, scaleMode);

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
}

VideoBaseTexture.prototype = Object.create(BaseTexture.prototype);
VideoBaseTexture.prototype.constructor = VideoBaseTexture;


VideoBaseTexture.prototype._onUpdate = function ()
{
    if (this.autoUpdate)
    {
        window.requestAnimationFrame(this._onUpdate);
        this.update();
    }
};

VideoBaseTexture.prototype._onPlayStart = function ()
{
    if (!this.autoUpdate)
    {
        window.requestAnimationFrame(this._onUpdate);
        this.autoUpdate = true;
    }
};

VideoBaseTexture.prototype._onPlayStop = function ()
{
    this.autoUpdate = false;
};

VideoBaseTexture.prototype._onCanPlay = function ()
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

            Q.message.trigger(this,'loaded');
        }
    }
};

VideoBaseTexture.prototype.destroy = function ()
{
    if (this.source && this.source._pixiId)
    {
        delete Q.g.BaseTextureCache[ this.source._pixiId ];
        delete Q.g.source._pixiId;
    }

    BaseTexture.prototype.destroy.call(this);
};

VideoBaseTexture.fromVideo = function (video, scaleMode)
{
    if (!video._pixiId)
    {
        video._pixiId = 'video_' + Q.uid;
    }

    var baseTexture = Q.g.BaseTextureCache[video._pixiId];

    if (!baseTexture)
    {
        baseTexture = new VideoBaseTexture(video, scaleMode);
        Q.g.BaseTextureCache[video._pixiId ] = baseTexture;
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


function Texture(baseTexture, frame, crop, trim, rotate)
{

    /**
     * 表示是否有frame
     */
    this.noFrame = false;

    if (!frame)
    {
        this.noFrame = true;
        frame = new Q.class.Rectangle(0, 0, 1, 1);
    }

    if (baseTexture instanceof Texture)
    {
        baseTexture = baseTexture.baseTexture;
    }

    /**
     * 基础纹理
     */
    this.baseTexture = baseTexture;

    /**
     *指定该纹理的使用区域
      */
    this._frame = frame;

    /**
     * 该纹理的裁剪参数。
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
     */
    this._uvs = null;

    /**
     * 纹理的宽度
     */
    this.width = 0;

    /**
     * 纹理的高度
     */
    this.height = 0;

    /**
     *渲染时，实际渲染到 Canvas 或 WebGL 的区域 ,不被frame的值影响。
     */
    this.crop = crop || frame;

    /**
     * 表示该纹理是否旋转90°，部分打包器可能会使用。
     */
    this.rotate = !!rotate;

    if (baseTexture.hasLoaded)
    {
        if (this.noFrame)
        {
            frame = new Q.class.Rectangle(0, 0, baseTexture.width, baseTexture.height);
            Q.message.on( this , 'update' , this.onBaseTextureUpdated );
        }
        this.frame = frame;

    }else{
        
        Q.message.once(baseTexture,'loaded',this.onBaseTextureLoaded.bind(this));
    }
}

Texture.prototype.constructor = Texture;


Object.defineProperties(Texture.prototype, {
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

Texture.prototype.update = function ()
{
    this.baseTexture.update();
};

Texture.prototype.onBaseTextureLoaded = function (baseTexture)
{
    if (this.noFrame)
    {
        this.frame = new Q.class.Rectangle(0, 0, baseTexture.width, baseTexture.height);
    }
    else
    {
        this.frame = this._frame;
    }


    Q.message.trigger(this,'update');


};

Texture.prototype.onBaseTextureUpdated = function (baseTexture)
{
    this._frame.width = baseTexture.width;
    this._frame.height = baseTexture.height;
    Q.message.triggers(this,'update');

};

Texture.prototype.destroy = function (destroyBase)
{
    if (this.baseTexture)
    {
        if (destroyBase)
        {
            this.baseTexture.destroy();
        }

        Q.message.unall(this.baseTexture,'update');
        Q.message.unall(this.baseTexture,'loaded');

        this.baseTexture = null;
    }

    this._frame = null;
    this._uvs = null;
    this.trim = null;
    this.crop = null;

    this.valid = false;
};

Texture.prototype.clone = function ()
{
    return new Texture(this.baseTexture, this.frame, this.crop, this.trim, this.rotate);
};

Texture.prototype._updateUvs = function ()
{
    if (!this._uvs)
    {
        this._uvs = new TextureUvs();
    }

    this._uvs.set(this.crop, this.baseTexture, this.rotate);
};

Texture.fromImage = function (imageUrl, crossorigin, scaleMode)
{
    var texture = Q.g.TextureCache[imageUrl];

    if (!texture)
    {
        texture = new Texture(BaseTexture.fromImage(imageUrl, crossorigin, scaleMode));
        Q.g.TextureCache[imageUrl] = texture;
    }

    return texture;
};

Texture.fromFrame = function (frameId)
{
    var texture = Q.g.TextureCache[frameId];

    if (!texture)
    {
        throw new Error('The frameId "' + frameId + '" does not exist in the texture cache');
    }
    return texture;
};

Texture.fromCanvas = function (canvas, scaleMode)
{
    return new Texture(BaseTexture.fromCanvas(canvas, scaleMode));
};

Texture.fromVideo = function (video, scaleMode)
{
    if (typeof video === 'string')
    {
        return Texture.fromVideoUrl(video, scaleMode);
    }
    else
    {
        return new Texture(VideoBaseTexture.fromVideo(video, scaleMode));
    }
};

Texture.fromVideoUrl = function (videoUrl, scaleMode)
{
    return new Texture(VideoBaseTexture.fromUrl(videoUrl, scaleMode));
};

Texture.addTextureToCache = function (texture, id)
{
    Q.g.TextureCache[id] = texture;
};

Texture.removeTextureFromCache = function (id)
{
    var texture = Q.g.TextureCache[id];
    delete Q.g.TextureCache[id];
    delete Q.g.BaseTextureCache[id];
    return texture;
};

Texture.EMPTY = new Texture(new BaseTexture());

Q.exports = BaseTexture;        
Q.exports = TextureUvs;         
Q.exports = VideoBaseTexture;   
Q.exports = Texture;            


}();