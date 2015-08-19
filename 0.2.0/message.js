//message 消息模块
!function(){


function E(a){

    this.ev = a.ev||null;
    this.ij = a.ij||null;
    this.ty = 0 ;  
    //  &1      是否只执行一次 
    //  &2      是否有注入 
    //  &4      注入在前还是后 
    //  &8      是否执行注入 
    //  &16     是否是队列 
    

}

E.prototype = {
    constructor:E,
    destroy:function(){
        this.ev = null;
        this.ij = null;
        this.ty = null;

    }
}

var /*mid = 0 , _g = {},*/ fn = Q.fn ,

message = {

    fns:[],

    on:function(a,b,c,d){

        if(!fn.isS(b)||!fn.isF(c))return;

        var ls = a._listener = a._listener || {};

        if(!ls[b]){

            ls[b] = new E({ev:c});

        }else{
            if(d){
                ls[b].ev = c;
            }else if(fn.isA(ls[b].ev)){

                ls[b].ty = ls[b].ty|16;
                ls[b].ev.push(c);

            }else{
                ls[b].ty = ls[b].ty|16;
                ls[b].ev = [ls[b].ev,c];
            }
        }
    },

    un:function(a,b){

       if(a._listener&&a._listener[b]){

            a._listener[b].ev = null;
            a._listener[b].ty = (a._listener[b].ty ^ 16 ) ^ 1;
          
        }

    },

    once:function(a,b,c){
        // console.log(a,b)

        // console.trace();

        if(!fn.isS(b)||!fn.isF(c))return;
        var ls = a._listener = a._listener || {};
        message.on(a,b,c);

        ls[b].ty = ls[b].ty|1;


    },

    unall:function(a,b){

        if(a._listener&&a._listener[b]){

            a._listener[b] = null;
            delete a._listener[b];
          
        }



    },

    trigger:function(a,b,c){

        //  &1      是否只执行一次 
        //  &32     是否you
        //  &2      是否有注入 
        //  &4      注入在前还是后,0在前，1在后
        //  &8      是否执行注入 
        //  &16     是否是队列 
     

        if( !a || !a._listener || !a._listener[b] )return;
        var ls = a._listener[b] , ty = a._listener[b].ty,ret;


        if( (ty&2) && (ty&8)){
            if(ty&4){
                if(ls.ev)
                if(ty&16){
                    for(var i=0;i<ls.ev.length;i++){
                        if(ls.ev[i].call(a,c)){
                            ret= true;
                            break;
                        }       
                    }
                    
                }else{if(ls.ev.call(a,c))ret= true};

                if(!ret&&ls.ij.call(a,c))ret = true;

            }else{

                if(ls.ij.call(a,c))ret = true ;
                if(!ret&&ls.ev)
                if(ty&16){
                    for(var i=0;i<ls.ev.length;i++){
                        if(ls.ev[i].call(a,c)){
                            ret= true;
                            break;
                        }       
                    }
                }else{
                    if(ls.ev.call(a,c))ret= true
                };
            }
        }else if(ls.ev){

           if(ty&16){
                for(var i=0;i<ls.ev.length;i++){
                    if(ls.ev[i].call(a,c)){
                        ret= true;
                        break;
                    }       
                }
            }else{
                if(ls.ev.call(a,c))ret= true
            };
        }
        if(ty&1)message.unall(a,b);
        return ret;
    },

    //如果D为true，注入的函数在前执行
    inj:function(a,b,c,d){

        if(!fn.isS(b)||!fn.isF(c))return;
        var ls = a._listener = a._listener || {};

        if(!ls[b]){

            ls[b] = new E({ij:c});

        }else{

            ls[b].ij = c;
        }

        ls[b].ty = d ? ls[b].ty | 14 : ls[b].ty | 10 ;

        //  &1      是否只执行一次 
        //  &2      是否有注入 
        //  &4      注入在前还是后,0在前，1在后
        //  &8      是否执行注入 
        //  &16     是否是队列 
        
    },

    uinj:function(a,b){

        if(a._listener&&a._listener[b]){
            a._listener[b].ij = null;
            a._listener[b].ty =  a._listener[b].ty ^ 14 ;
        }

    },

    bind:function(a,n,b){

        if(!a._listener||!a._listener[n]||!b||!b.__listeners)return;
        var ars = (b.__listeners[n]||(b.__listeners[n]=[])) , idx;
        if(ars.indexOf(a)==-1){
            if(a.depth!==undefined&&ars.some(function(m,i,arr){
                if(m.depth<=a.depth)return idx=i;
            })){
                ars.splice(idx,0,a);
            }else{
                ars.unshift(a);
            }
        }
    },

    unbind:function(a,n,b){

        if(!a._listener||!a._listener[n]||!b.__listeners||!b.__listeners[n])return;
        var idx;
        (idx=b.__listeners[n].indexOf(a))!=-1&&b.__listeners[n].splice(idx,1);

    }
}

Q.exports = message;

}();