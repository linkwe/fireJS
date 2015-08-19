Q('View',{
    name:'v2',
    backgroundColor:0xeeeeee,
    items:[
        {
            name:'bg',
            xtype:'Image',
            depth:15,
            x:0,
            y:0,
            width:'100w',
            height:'100h',
            image:'photo2',
            listener:{
                down:function(){
                    Q.app.go('v1',null,Q.Transitions.default);
                }
            }
        }
    ]
});


