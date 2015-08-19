
!function(){

Q.exports  = function(a){

    var callbackName = "miaojsonp" + Q.uid , cakname = a.cakname || 'callback';
    callback , sc = window[callbackName+"Element"] = document.createElement("script");  

    window[callbackName] = function(data) 
    {
        window[callbackName+"Element"].remove();
        delete window[callbackName];
        a.cak&&a.cak(data);
    }

	sc.src = url.indexOf('?')!=-1 ? url + cakname +'='+ callbackName : 
	url+'?'+cakname+'=' + callbackName;
    document.body.appendChild(sc); 
}


Q.class({

	className:'Ajax',
	extend:'Mobj',
	type:'GET',
	responseType:null,
	url:'',
	syn:true,
	header:null,
	idle:true,
	setRequestHeader:function(a){
		this.xhr.setRequestHeader(a.ty,a.vl);
		return this;
	},
	load:function(cak,change){
		if(!(this.idle&&this.url))return;
		this.idle = false;
		
		var xhr = this.xhr,ts = this;
		xhr.open(this.type,this.url,this.syn);
		if(this.responseType)xhr.responseType = this.responseType; 
		if(this.header)this.setRequestHeader(this.header); 
		xhr.onreadystatechange = change ? function(){
			ts.idle = true;
			change(xhr);
			
		} : function () {
		
			if(xhr.readyState == 4 && xhr.status == 200){
				ts.idle = true;

				if(xhr.getResponseHeader('Content-Type').match(/^text/))
				{
					cak&&cak(xhr.responseText)
				}else{
					cak&&cak(xhr.response);
				}
				
			}
		}
		xhr.send(null);     
	},
	set:Q.fn.set,
	constructor:function(a){

		this.xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		this.set(a);

	}
});

/*
function Ajax(a){

	this.xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
	this.set(a);

}

Ajax.prototype  = {
	constructor:Ajax,
	type:'GET',
	responseType:null,
	url:'',
	syn:true,
	header:null,
	idle:true,
	load:function(cak,change){

		if(!(this.idle&&this.url))return;
		this.idle = false;
		
		var xhr = this.xhr,ts = this;
		xhr.open(this.type,this.url,this.syn);
		if(this.responseType)xhr.responseType = this.responseType; 
		if(this.header)this.setRequestHeader(this.header); 
		xhr.onreadystatechange = change ? function(){
			ts.idle = true;
			change(xhr);
			
		} : function () {
		
			if(xhr.readyState == 4 && xhr.status == 200){
				ts.idle = true;

				if(xhr.getResponseHeader('Content-Type').match(/^text/))
				{
					cak&&cak(xhr.responseText)
				}else{
					cak&&cak(xhr.response);
				}
				
			}
		}
		xhr.send(null);     



	},
	setRequestHeader:function(a){

		this.xhr.setRequestHeader(a.ty,a.vl);
		return this;

	}


}*/




Q.exports = function(){

	var xhr = {

		xhrPool:[new Q.class.Ajax],
		repay:function(a){
			if(a.idle)this.xhrPool.push(a);
			return a;
		},
		get:function(){
			var o;
			if(!this.xhrPool.some(function(m){if(m.idle)return o=m}))
			o = this.repay(new Q.class.Ajax);
			return o;
		}
	};
	return  function( op ){
		var _xhr = xhr.get();

		_xhr.set(op).load(function(res){
			xhr.repay(_xhr);
			op.done&&op.done(res);
		});
	}
}();

}();
