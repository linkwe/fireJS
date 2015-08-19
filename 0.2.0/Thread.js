!function(){

function Thread(){

    this.source = a.source||null;

    this.src = a.src || null;

    this.worker = null;

}

Thread.prototype = {

    constructor:Thread,

    run:function(){

        if(this.worker|| (!this.src&&!this.source) ) return this;

        var createURL = (URL && URL.createObjectURL.bind(URL))|| (webkitURL &&  
                    webkitURL.createObjectURL.bind(webkitURL))|| createObjectURL;

        this.src = this.src || createURL(new Blob([this.source]));

        this.worker = new Worker(this.src);

        return this;

    },

    close:function(){

        if(this.worker) this.worker.terminate();

    },

    onMes:function(cak){

        if(this.worker && cak instanceof Function) this.worker.onmessage = cak;
        return this;

    },

    postMes:function(message){

        if(this.worker) this.worker.postMessage(message);
        return this;
    }
};

Q.exports = Thread;

}();