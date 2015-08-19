function path9( x0, x1, x2, x3, y0, y1, y2, y3 , obj){

   var idx=[0,1,4,4,1,5,1,2,5,5,2,6,2,3,6,6,3,7,4,5,8,8,5,9,5,6,9,9,6,10,6,7,10,10,7,11,8,9,12,12,9,13,9,10,13,13,10,14,10,11,14,14,11,15];

   var  vs  = obj.vs  = obj.vs  ||  new Float32Array(16*2),
        uvs = obj.uvs = obj.uvs ||  new Float32Array(16*2),
        tex = obj.tex;

    var frame = tex._frame;
    var tw = tex.baseTexture.width;
    var th = tex.baseTexture.height;
    var aabb = obj.aabb;

    obj.idx = new Uint16Array(idx);

    uvs[0] = frame.x / tw;
    uvs[1] = frame.y / th;
    uvs[2] = (frame.x + aabb[3] ) / tw;
    uvs[3] = uvs[1];
    uvs[4] = (frame.x + frame.width - aabb[1] ) / tw;
    uvs[5] = uvs[1];
    uvs[6] = (frame.x + frame.width ) / tw;
    uvs[7] = uvs[1];


    uvs[8]  = uvs[0];
    uvs[9]  = (frame.y+aabb[0]) / th;
    uvs[10] = uvs[2];
    uvs[11] = uvs[9];
    uvs[12] = uvs[4];
    uvs[13] = uvs[9];
    uvs[14] = uvs[6];
    uvs[15] = uvs[9];


    uvs[16]  = uvs[0];
    uvs[17]  = (frame.y + frame.height - aabb[2]) / th;
    uvs[18] = uvs[2];
    uvs[19] = uvs[17];
    uvs[20] = uvs[4];
    uvs[21] = uvs[17];
    uvs[22] = uvs[6];
    uvs[23] = uvs[17];


    uvs[24]  = uvs[0];
    uvs[25]  = (frame.y+frame.height) / th;
    uvs[26] = uvs[2];
    uvs[27] = uvs[25];
    uvs[28] = uvs[4];
    uvs[29] = uvs[25];
    uvs[30] = uvs[6];
    uvs[31] = uvs[25];



    vs[0] = x0;
    vs[1] = y0;
    vs[2] = x1;
    vs[3] = y0;
    vs[4] = x2;
    vs[5] = y0;
    vs[6] = x3;
    vs[7] = y0;


    vs[8] = x0;
    vs[9] = y1;
    vs[10] = x1;
    vs[11] = y1;
    vs[12] = x2;
    vs[13] = y1;
    vs[14] = x3;
    vs[15] = y1;


    vs[16] = x0;
    vs[17] = y2;
    vs[18] = x1;
    vs[19] = y2;
    vs[20] = x2;
    vs[21] = y2;
    vs[22] = x3;
    vs[23] = y2;


    vs[24] = x0;
    vs[25] = y3;
    vs[26] = x1;
    vs[27] = y3;
    vs[28] = x2;
    vs[29] = y3;
    vs[30] = x3;
    vs[31] = y3;

    return obj;


}


Q('View',{
    name:'v1',
    backgroundColor:0xeeeeee,
    items:[
        {
            name:'bg',
            xtype:'Image',
            // visible:false,
            depth:15,
            x:200,
            y:100,
            width:300,
            height:300,
            // texture:Q('Texture',[
                    // new Q.class.BaseTexture(Q.R.getImage('photo1')),
                    // null,
                    // new Q.class.Rectangle(100,100,500,500),
                    // new Q.class.Rectangle(0,0,500,500),
                    // new Q.class.Rectangle(-20,0,500,500)
                    // Q('BaseTexture',[
                    // Q.R.getImage('photo1') , 
                    // Q('Rectangle',[0,0,100,100])
                // ]),
            image:'photo1',
            listener:{
                down:function(){
                    Q.app.go('v2',null,Q.Transitions.default);
                }
            }
        },
        {
            // name:'bg',
            // xtype:'Image',
            depth:14,
            // visible:false,
            x:0,
            y:0,
            width: 300,
            height:300,
            texture:Q('Texture',[
                    new Q.class.BaseTexture(Q.R.getImage('photo1')),
                    // null,
                    // new Q.class.Rectangle(10,10,400,400),
                    new Q.class.Rectangle(0,0,500,500),
                    // new Q.class.Rectangle(100,100,500,500)
                    // Q('BaseTexture',[
                    // Q.R.getImage('photo1') , 
                    // Q('Rectangle',[0,0,100,100])
                ]),
            // image:'photo1',
            listener:{
                down:function(){
                    Q.app.go('v2',null,Q.Transitions.default);
                }
            }
        }
    ],
    listener:{
        init:function (argument) {

            var tx = Q('Texture',[new Q.class.BaseTexture(Q.R.getImage('pp'))]);

        

           var vs = new Float32Array([
            0  , 0, 
            300, 0,
            300, 300,
            0  , 300]);

           var uvs =  new Float32Array([
            0, 0,
            1, 0,
            1, 1,
            0, 1]);
           var idx =  new Uint16Array([
            0, 1,
            2, 0,
            2, 3]);


           var obj = path9(0,50,350,400,0,50,350,400,{
                tex:tx,
                aabb:[10,10,10,10]
           });





            var a = new Q.class.Mesh(tx,obj.vs,obj.uvs,obj.idx,1);//.addTo(this);


           a.addTo(this);

           a.anchorY = .5;
           a.anchorX = .5;

           a.pivot = {x:.5,y:.5};

           // a.scaleX = .5;
           // a.scaleY = .5;

            a.x = 200;
            a.y = 500;

           console.log(a);

           var g = Q('bg');


           g.anchorY = .5;
           g.anchorX = .5;

        


            this.run = function(){
               
                g.rotation +=0.05;
                a.rotation +=0.05;
            }
            //a.width = 400;


            /*Q.class({

                className:'Meun',
                extend:'Container',
                constructor:function(_super,a){

                    _super.call(this);

                    this.imglist = ['aa','bb','cc','dd'];

                    this.__items = {};

                    // this.children = [];
                    // this.__listeners = {};
                    // this._items = {};
                    // this._width = 0;
                    // this._height = 0;
                    // if(this instanceof Container)this.set(a);
                        
                },

                initMenu:function(fn){
                    if(fn){

                        fn.call(this);

                    }else{

                        var item[i] = this.__items;



                        var obj = null;



                        for(var i =0,l=item.length;i<l;i++){

                            obj = new _class.Image(item[i]);
                            this.addChild(obj)
                           

                        }

                    }







                },


                items:function(a){

                    this.__items = a;
                },

                clear:function(width,height){


                },
                
                updateText:function(argument) {


                   

                    var ct = this.context;
                    var ca = this.canvas;

                    this.clear(this.width,this.height);



                    for(var i=0,l=this.textList.length;i<l;i++){
                        
                        ct.save();

                        ct.lineWidth = this.lineWidth;
                        ct.strokeStyle = this.scolor;

                        ct.strokeRect(this.lineWidth,i*this.lineWidth);

                    }
                   
                }


            });*/


        }
    }
});


