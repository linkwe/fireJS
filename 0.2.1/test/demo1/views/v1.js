Q('View',{
    name:'v1',
    backgroundColor:0xeeeeee,
    
    items:[
        {
            name:'a',
            xtype:'Image',
            depth:15,
            width:'30w',
            height:'30w',
            image:'photo1',
            listener:{
                down:function(){
                    // console.log('aaaa')
                    Q.app.go('v2',null,Q.Transitions.default);
                }
            }
            ,
            mask:Q('Rect',{
                depth:16,
                // x:1000,
                // y:1000,
                width: '20w',
                height:'20w'
            })
            
        },
        {
            name:'aa',
            xtype:'Image',
            depth:11,
            y:'50h',
            width:'50w',
            height:'50h',
            // image:'photo1'
        },
        {
            name:'b',
            xtype:'ImageP',
            depth:17,
            aabb:[10,10,10,10],
            x:'40w',
            y:'40w',
            anchorX:.5,
            anchorY:.5,
            width: '20w',
            height:'20w',
            image:'pp',
            listener:{
                down:function(){
                    console.log('bbbb')
                }
            }
            
        },
        {
            name:'c',
            xtype:'Rect',
            depth:16,
            x:'40w',
            y:'40w',
            width: '20w',
            height:'20w'
        }
    ],
    listener:{
        init:function (argument) {

            // this.cacheAsBitmap = true;
            // var the = this;

            // this.run = function (argument) {
            //     the.rotation +=0.1;
            // }


            

            // var rt = new Q.class.RenderTexture(Q.app.renderer,Q.app.width,Q.app.height);

            // rt.render(this,false,true);

            // Q('aa').texture = rt;

            // console.log(Q.app._listener.down);


            // Q.message.on(Q.app,'down',function() {
            //     console.log('app1');
            // });

            // console.log(Q.app._listener.down);


            Q('b').mask = Q('c');

        }
    }
});


