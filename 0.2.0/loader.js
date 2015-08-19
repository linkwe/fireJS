
!function(){

var arr = [] , resall = {} , fn = Q.fn,

DefImg = null,

loader = {

	getResall:function(a){

		return resall[a];

	},

	loadImage:function( _url , __ck , err , ty){

		if(ty === 'ajax'){
			Q.ajax({
				responseType:'blob',
				url:_url,
				done:function(a){
					var bl = fn.createURL(a),
					im = new Image();
					im.src = bl;
					im.onload = function(){
						fn.revokeURL(bl);
						__ck(im)
					}
				}
			});
		}else{
			var im = new Image();
			im.src = _url;
			im.onload = function(){
				__ck(im)
			}
		}
	},

	loadImages:function(a){ 
		if(!a.res.length)return;
		var _arr={},i=0,count=0,l=a.res.length,ts=this,pa;
		a.res.forEach(function(me){
			if(me.syn === false){
				// if(me.sprite){
				// 	_arr[me.name] = {
				// 		get:function(_n){
				// 			return this._obj[_n]||this._obj['def']
				// 		},
				// 		x:def.x,
				// 		y:def.y,
				// 		w:def.w,
				// 		h:def.h,
				// 		obj:def.obj,
				// 		_obj:{def:def.image}
				// 	}

				// 	count++;
				// 	a.caking&&a.caking(count,l,me.name,me.src);
				// 	count==l&&a.cak(_arr);

				// 	var rm = miao.uid , pa = me.sprite.split('/');
				// 	pa = pa.length>1 ? (pa.pop()&&pa.join('/')) + '/':'';

				// 	miao.require({src:me.sprite,cak:function(_me){
						
				// 		ts.loadImage(pa + _me.file,function(im){
				// 			var ss = _me.frames, _o = {},_i;
				// 			for(_i in ss)_o[_i] = {x:ss[_i].x,y:ss[_i].y,w:ss[_i].w,h:ss[_i].h,obj:im};
				// 			_arr[me.name]._obj = _o;
				// 		});

				// 	}});

				// }else{
					
					_arr[me.name] = DefImg;
					count++;
					a.caking&&a.caking(count,rLength,me.name,me.src);
					count==l&&a.cak(_arr);

					ts.loadImage(me.src,function(im){
						_arr[me.name] = im;
					});
				//}

			}else{

				// if(me.sprite){
					
				// 	rm = miao.uid;
				// 	pa = me.sprite.split('/');
				// 	pa = pa.length>1 ? (pa.pop()&&pa.join('/')) + '/':'';
				// 	miao.require({src:me.sprite,cak:function(_pa){

				// 		return function(_me){
				// 			ts.loadImage(_pa + _me.file,function(im){
				// 				var ss = _me.frames, _o = {},_i;
				// 				for(_i in ss)_o[_i] = {x:ss[_i].x,y:ss[_i].y,w:ss[_i].w,h:ss[_i].h,obj:im};
				// 				_arr[me.name] = _o;
				// 				count++;
				// 				a.caking&&a.caking(count,l,me.name,me.src);
				// 				count==l&&a.cak(_arr);
				// 			});
				// 		}
				// 	}(pa)});

				// }else{
					// console.log(ts);
					ts.loadImage(me.src,function(im){
						count++;
						_arr[me.name] = im;
						a.caking&&a.caking(count,l,me.name,me.src);
						count==l&&a.cak(_arr);

					});
				//}
			}
		});
	},

	loadAudio:function( _url , __ck , err , ty){
		
		Q.ajax({
			responseType:'blob',
			url:_url,
			done:function(a){

				
				var bl = fn.createURL(a),
				_im = new Audio(bl),im;
				if(Q.ios){
					im = {
						paused:true,play:function(){
						this.paused=false;
					},obj:_im};
				}else{im = _im;}
				__ck(im);
			}
		});

	},
	loadAudios:function(a){ 
		if(!a.res.length)return;
		var _arr={},i=0,count=0,l=a.res.length,ts=this,bf;
		a.res.forEach(function(me){
			ts.loadAudio(me.src,function(im){
				
				count++;
				a.caking&&a.caking(count,l,me.name,me.src);
				_arr[me.name] = im;
				if(count==l){

					if(Q.ios){
						bf = function(){
							for(var ii in _arr){
								_arr[ii].obj.play();
								if(_arr[ii].paused)_arr[ii].obj.pause();
								_arr[ii] = _arr[ii].obj;
							}
							window.removeEventListener('touchstart',bf);
						}
						window.addEventListener('touchstart',bf,false);
					}

					a.cak(_arr);
				}
			});
		});
	},

	loadRequires:function(a){


		if(!a.res.length)return;
		var _arr={},i=0,count=0,l=a.res.length,ts=this,bf;
		a.res.forEach(function(me){

			Q.require({src:me.src,cak:function(im){
				
				count++;
				a.caking&&a.caking(count,l,me.name,me.src);
				me.cak&&me.cak(im);
				if(count==l)a.cak(_arr);

			}});
		});
	},

	getImage:function(n){

		return resall.image&&resall.image[n];

	},

	getAudio:function(n){

		return resall.audio&&resall.audio[n]
	},

	ref:{image:'loadImages',audio:'loadAudios',require:'loadRequires'},

	loadRes:function( Res , cak , caking ,ty){
		var count = 0 , rLength = 0 , i , idx = 0, ts = this , jzs = [];

		for(i in Res)if(Res[i].length>0){
			rLength+=Res[i].length;
			if(this.ref[i])jzs.push(i);
		}

		console.log(1)


		if(rLength==0)return cak&&cak();

		console.log(2)

		!function lods(who){
			idx++;
			resall[who] = resall[who]||{};
			var fn = ts[ts.ref[who]],
				ops = {
					res:Res[who],
					cak:function(_arr){
						_arr&&Q.fn.coverOwn(resall[who],_arr);
						if(count==rLength)return cak&&cak(resall);
						lods(jzs[idx]);
					}
				};
				ops.caking = caking ? function(_count,_rLength,_name,src){
				count++;
				caking(count,rLength,_name,src);
			}:function(){count++};
			fn.call(ts,ops);
		}(jzs[idx]);
	}
};


Q.exports = loader;

}();
