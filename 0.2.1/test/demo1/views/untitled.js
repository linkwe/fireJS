function path9( x0, x1, x2, x3, y0, y1, y2, y3 , obj){

               var idx=[0,1,4,4,1,5,1,2,5,5,2,6,2,3,6,6,3,7,4,5,8,8,5,9,5,6,9,9,6,10,6,7,10,10,7,11,8,9,12,12,9,13,9,10,13,13,10,14,10,11,14,14,11,15];


               var  vs  = obj.vs  = obj.vs  ||  new Float32vs(16*2),
                    uvs = obj.uvs = obj.uvs ||  new Float32vs(16*2),
                    tex = obj.tex;

                var frame = tex._frame;
                var tw = tex.baseTexture.width;
                var th = tex.baseTexture.height;
                var aabb = obj.aabb;

                obj.idx = new Uint16vs(idx),

                uvs[0] = frame.x / tw;
                uvs[1] = frame.y / th;
                uvs[2] = (frame.x + aabb[3] ) / tw;
                uvs[3] = uvs[1];
                uvs[4] = (frame.x + aabb[1] ) / tw;
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
                uvs[17]  = (frame.y+aabb[2]) / th;
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



            
            }