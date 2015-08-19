Q('View',{

    name:'v2',

    items:[

        {
            
            xtype:'Container',
            name:'c1',
            scaleY:.5,
            items:[
                {
                    name:'i1',
                    xtype:'Image',
                    width: Q.app.width*.5,
                    height:Q.app.height*.5,
                    x:1,
                    y:1,
                    image:'a1',
                    listener:{
                        down:function(){
                            console.log(222)
                        }
                    }
                }
            ]
        }
      
        
    ],
    listener:{
        toggle:function(){
            console.log('v2v2v2v2v');
            console.log(Q('c1'),this);
        },
        init:function(){

         
        }
    }
});//.init();


