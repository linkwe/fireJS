Q.exports = {
   
    VERSION:'m-0-2-1-p-3-0-6',

    PI2: Math.PI * 2,

   
    L18PI: 180 / Math.PI,

  
    PI18: Math.PI/180,

    //每毫秒帧率
    TARGET_FPMS: 0.06,

    //标识渲染器类型
    RENDERER_TYPE: {
        UNKNOWN:    0,
        WEBGL:      1,
        CANVAS:     2
    },

    //默认需要绑定的事件
    DEF_EV:['down','move','up'],

    /**
     * 混合模式
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
     * 支持的缩放模式
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
        transparent: false,
        backgroundColor: 0x000000,
        clearBeforeRender: true,
        preserveDrawingBuffer: false
    },

    /**
     * 标识形状
     */
    SHAPES: {
        POLY: 0,
        RECT: 1,
        CIRC: 2,
        ELIP: 3,
        RREC: 4
    },

    // 批渲染池大小
    SPRITE_BATCH_SIZE: 2000
};