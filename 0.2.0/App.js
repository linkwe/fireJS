!function(){

var utils = Q.utils , CONST = Q.CONST,_class = Q.class;

function App(a){

    if(Q.app)return Q.app;

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

    this.GUI = new _class.Container();

    var container = new _class.Container();

    container.addChild(this.atyView);

    container.addChild(this.GUI);

    this.container =container;

    if(a.listener){
        for(var i in a.listener){
            if(Q.fn.isF(a.listener[i]))
            Q.message.on(this,i,a.listener[i]);
        }
    }
    Q.message.trigger(this,'advance',this._init.bind(this,a));
    

   // this._init(a);
   
}

App.prototype = {

    constructor:App,

    update:function(){

        this.atyView.run();
        this.renderer.render(this.container);
       
    },

    _init:function(a){

        Q.message.inj(this,'down',function(){
            Q.message.trigger(this.atyView,'down');
        });

        Q.message.inj(this,'move',function(){
            //console.log('mo')
            Q.message.trigger(this.atyView,'move');
        });

        Q.message.inj(this,'up',function(){
            Q.message.trigger(this.atyView,'up');
        });

        utils.setRenderer(this);

        this.renderer.backgroundColor = 0x112233;

        Q.pulse.setHand(this.update.bind(this));

        if(!Q.pulse.sw)Q.pulse.start();

        if(a.R){
            Q.R.loadRes(a.R,function(){

                Q.message.trigger(Q.app,'init');
            },function(a,b,c,d){
                
                Q.message.trigger(Q.app,'loading',{i:a,length:b,name:c,src:d});
            });
        }else{
            Q.message.trigger(this,'init');
        }

    },

    backView:function(a,b){
        if(this._lastView)this.go(this._lastView,a,b);
        return this;
    },

    getView:function(a){
        if(!a){
            return this.atyView;
        }else if(Q.g.viewsCache[a]){
            return Q.g.viewsCache[a];
        }
    },

    go:function(a,b,c){

        var  acy;

        if(Q.fn.isS(a)){

          acy = this.getView(a);
          if(!acy)return;

        }else if( Q.fn.inof(a,'View') ) {

          acy = a;

        }else{return}

        acy.parent = this.container;
        this.container.children[0] = acy;

        var now = this._lastView = this.atyView;

        if(now){
            Q.message.trigger(now,'unload');
            now.visible = false;
        }

        //'advance'

        acy.visible = true; 
        this.atyView = acy;
        acy.renderer = this.renderer;
        Q.message.trigger(acy,'init',b);
        Q.message.trigger(acy,'toggle',b);

        
    }
};

Q.exports = App;

}();