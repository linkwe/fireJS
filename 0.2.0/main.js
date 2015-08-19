 Q('App' , {
    resolution:0.5,

    R:{
        image:[
            {name:'a1',src:'img/a.jpg'},
            {name:'a2',src:'img/chai.png'}
        ],
        audio:[
            {name:'bg1',src:'img/bg.mp3'}
        ],
        require:[
            {src:'view/v1.js',syn:true}
        ]
    },
    element:Q.fn.$('view'),
    listener:{
        init:function(){
            this.go('v1');
        },
        loading:function(a){
            console.log('load:'+a.name+'--'+a.i+ '/' +a.length);
        }
    }
});




