Q('View',{
    name:'v2',
    backgroundColor:0xeeeeee,
    items:[
        {
            name:'meun1',
            xtype:'Container',
            depth:14,
            items:[
                {
                    xtype:'Image',
                    width:'20w',
                    height:'20w',
                    image:'photo1'
                },{
                    xtype:'Image',
                    width:'20w',
                    height:'20w',
                    image:'photo2'
                },{
                    xtype:'Image',
                    width:'20w',
                    height:'20w',
                    image:'photo1'
                },{
                    xtype:'Image',
                    width:'20w',
                    height:'20w',
                    image:'photo2'
                },{
                    xtype:'Image',
                    width:'20w',
                    height:'20w',
                    image:'photo1'
                },{
                    xtype:'Image',
                    width:'20w',
                    height:'20w',
                    image:'photo2'
                }
            ]
        }
    ],
    listener:{
        init:function(){
            var c = Q('meun1');

            /**
             * 实现功能：对objs内的元素根据参数实现横向排列
             * 需要改变objs每个元素的xy
             * rect obj {x,y,width,height}     rect 有4个属性 x,y,width,height
             * objs [obj]  {x,y,width,height} objs是个数组，每个元素有x,y,width,height属性
             * aabb [number,number,number,number]  aabb 是个数组，代表padding，内边距。固定有4个元素，是上、右、下、左 的内边距
             * ops obj{space，direction}   
             *      space 是间隙，2个元素之间的间隙，如果没有则为0；
             *      direction，是方向，是字符串，可能是start 或者 end,代表从开始排列，还是结束排列
             */
            function a(rect,objs,aabb,ops){

            }

            a(c,c.children,[0,0,0,0],{
                direction:'start',
                space:10
            });

            /**
             * 实现功能：对objs内的元素根据参数实现纵向排列
             * 需要改变objs每个元素的xy
             * 
             * rect obj {x,y,width,height}     rect 有4个属性 x,y,width,height
             * objs [obj]  {x,y,width,height} objs是个数组，每个元素有x,y,width,height属性
             * aabb [number,number,number,number]  aabb 是个数组，代表padding，内边距。固定有4个元素，是上、右、下、左 的内边距
             * ops obj{space，direction}   
             *      space 是间隙，2个元素之间的间隙，如果没有则为0；
             *      direction，是方向，是字符串，可能是start 或者 end,代表从开始排列，还是结束排列
             */

            function b(rect,objs,aabb,ops){

            }

            b(c,c.children,[0,0,0,0],{
                direction:'start',
                space:10
            });

            /**
             * 实现功能：对objs内的元素根据参数横列，排版布局
             * 需要改变objs每个元素的x , y , width , height
             * 
             * rect obj  { x , y , width , height }     rect 有4个属性 x,y,width,height
             * objs [obj]  { x , y , width , height } objs是个数组，每个元素有x,y,width,height属性
             * aabb [ number , number , number , number ]  aabb 是个数组，代表padding，内边距。固定有4个元素，是上、右、下、左 的内边距
             * ops obj { spaceX , spaceY , col , row , idx }   
             *      spaceX 是X方向的间隙
             *      spaceY 是Y方向的间隙
             *      col 是列数，没有则为1
             *      row 是行数，没有则为0
             *      idx 是从数组的第几个元素开始排列，没有为0
             */
            function c(rect,objs,aabb,ops){

            }

            c(c,c.children,[0,0,0,0],{
                spaceX:10,
                space:10,
                space:10
            });

        }
    }
});
