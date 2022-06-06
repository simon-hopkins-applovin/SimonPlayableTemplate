/**
 * CustomLoader.
 * @param game 
 */
function CustomLoader(game) {
    Phaser.Loader.call(this, game);
}

/** @type Phaser.Loader */
var CustomLoader_proto = Object.create(Phaser.Loader.prototype);
CustomLoader.prototype = CustomLoader_proto;
CustomLoader.prototype.constructor = CustomLoader;

//new method to load Global.webfonts
//this follows the structure of all of the file assets loading methods
CustomLoader.prototype.webfont = function (key, fontName, overwrite) {
    //if (typeof overwrite === 'undefined') { overwrite = false; }

    // here fontName will be stored in file's `url` property
    // after being added to the file list
    this.addToFileList('webfont', key, fontName);
    return this;
};

CustomLoader.prototype.loadFile = function (t) {
	
	if(Global.PLATFORM != PORT.FACEBOOK){
	    Phaser.Loader.prototype.loadFile.call(this, t);
	}else{
		// If Facebook port, must do this type of loading of the files.
		switch (t.type) {
        	case "packfile":
            	this.xhrLoad(t, this.transformUrl(t.url, t), "text", this.fileComplete);
            	break;
			case "textureatlas":
			
				t.atlasURL = t.atlasURL.replace("data:text/json;base64,", "");
				//for (var e = window.atob(t.atlasURL), i = e.length, s = new Uint8Array(i), n = 0; n < i; n++) s[n] = e.charCodeAt(n);

				t.atlasData = window.atob(t.atlasURL);

				this.loadImageTag(t);


				this.fileComplete(t, null);
            	break;
        	case "image":
        	case "spritesheet":
        	case "bitmapfont":
            	this.loadImageTag(t);
            	break;
        	case "audio":
            	if (t.url = this.getAudioURL(t.url), t.url = t.url.replace("data:audio/mp3;base64,", ""), t.url)
                	if (this.game.sound.usingWebAudio) {
                    	for (var e = window.atob(t.url), i = e.length, s = new Uint8Array(i), n = 0; n < i; n++) s[n] = e.charCodeAt(n);
                    	this.fileComplete(t, s.buffer);
                	} else this.game.sound.usingAudioTag && this.loadAudioTag(t);
            	else this.fileError(t, null, "No supported audio URL specified or device does not have audio playback support");
            	break;
        	case "video":
            	t.url = this.getVideoURL(t.url), t.url ? t.asBlob ? this.xhrLoad(t, this.transformUrl(t.url, t), "blob", this.fileComplete) : this.loadVideoTag(t) : this.fileError(t, null, "No supported video URL specified or device does not have video playback support");
            	break;
        	case "json":
        	
				t.url = t.url.replace("data:text/json;base64,", "");
        		this.fileComplete(t, null);
            	break;
        	case "xml":
            	this.xhrLoad(t, this.transformUrl(t.url, t), "text", this.xmlLoadComplete);
            	break;
        	case "tilemap":
            	t.format === Phaser.Tilemap.TILED_JSON ? this.xhrLoad(t, this.transformUrl(t.url, t), "text", this.jsonLoadComplete) : t.format === Phaser.Tilemap.CSV ? this.xhrLoad(t, this.transformUrl(t.url, t), "text", this.csvLoadComplete) : this.asyncComplete(t, "invalid Tilemap format: " + t.format);
            	break;
        	case "text":
        	case "script":
        	case "shader":
        	case "physics":
				// physics
			
			
				t.url = t.url.replace("data:text/json;base64,", "");
				
				// text file
				t.url = t.url.replace("data:text/text;base64,", "");
			
				// script
				t.url = t.url.replace("data:text/js;base64,", "");

				// atlas for Spine
					t.url = t.url.replace("data:text/atlas;base64,", "");
			
            	this.fileComplete(t, null);
            	break;
        	case "texture":
        		"truecolor" === t.key.split("_").pop() ? this.loadImageTag(t) : this.xhrLoad(t, this.transformUrl(t.url, t), "arraybuffer", this.fileComplete);
            	break;
        	case "binary":
        		this.xhrLoad(t, this.transformUrl(t.url, t), "arraybuffer", this.fileComplete)
		}
		
	}
	

    // we need to call asyncComplete once the file has loaded
    if (t.type === 'webfont') {
        var _this = this;
        // note: file.url contains font name
        var font = new FontFaceObserver(t.url);
        font.load(null, 10000).then(function () {
            _this.asyncComplete(t);
        }, function ()  {
            _this.asyncComplete(t, 'Error loading font ' + t.url);
            this.game.add.text(35, 35, 'ERROR LOADING FONT', {	// If you get an error here check if you are referencing non-existing fonts in Global.js -> webfonts array
                font: '60px monospace',
                fill: '#fff',
            }).anchor.setTo(0.5);
        });
    }
};


// overload the loader FileComplete to finalize putting content into the cache.
// t is the object, e is the XHR response if applicable
CustomLoader.prototype.fileComplete = function(t, e){
	if(Global.PLATFORM != PORT.FACEBOOK){
		Phaser.Loader.prototype.fileComplete.call(this, t, e);
		return;
	}
    var i = !0;
    switch (t.type) {
        case "packfile":
            var s = JSON.parse(e.responseText);
            t.data = s || {};
            break;
        case "texture":
            var n = /\.([^.]+)$/.exec(t.url.split("?", 1)[0])[1].toLowerCase();
            null !== t.data ? this.cache.addCompressedTextureMetaData(t.key, t.url, n, t.data) : this.cache.addCompressedTextureMetaData(t.key, t.url, n, e.response);
            break;
        case "image":
            this.cache.addImage(t.key, t.url, t.data);
            break;
        case "spritesheet":
            this.cache.addSpriteSheet(t.key, t.url, t.data, t.frameWidth, t.frameHeight, t.frameMax, t.margin, t.spacing, t.skipFrames);
            break;
			
		case "json":
			
			this.cache.addJSON(t.key, t.url, JSON.parse(window.atob(t.url)));
			break;
			
        case "textureatlas":



		this.cache.addTextureAtlas(t.key, t.url, t.data, JSON.parse(t.atlasData), t.format);
		
		
            /*if (null == t.atlasURL) this.cache.addTextureAtlas(t.key, t.url, t.data, t.atlasData, t.format);
            else if (i = !1, t.format === Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY || t.format === Phaser.Loader.TEXTURE_ATLAS_JSON_HASH || t.format === Phaser.Loader.TEXTURE_ATLAS_JSON_PYXEL) this.xhrLoad(t, this.transformUrl(t.atlasURL, t), "text", this.jsonLoadComplete);
            else {
                if (t.format !== Phaser.Loader.TEXTURE_ATLAS_XML_STARLING) throw new Error("Phaser.Loader. Invalid Texture Atlas format: " + t.format);
                this.xhrLoad(t, this.transformUrl(t.atlasURL, t), "text", this.xmlLoadComplete)
            }*/
            break;
        case "bitmapfont":
			console.log(t);
			
			t.atlasURL = t.atlasURL.replace("data:text/fnt;base64,", "");
			
			t.atlasData = window.atob(t.atlasURL);
			
			parser = new DOMParser();
			t.atlasData = parser.parseFromString(t.atlasData, "text/xml");
			
			this.cache.addBitmapFont(t.key, t.url, t.data, t.atlasData, t.atlasType, t.xSpacing, t.ySpacing);
			/*
            t.atlasURL ? (i = !1, this.xhrLoad(t, this.transformUrl(t.atlasURL, t), "text", function(t, e) {
                var i;
                try {
                    i = JSON.parse(e.responseText)
                } catch (t) {}
                i ? (t.atlasType = "json", this.jsonLoadComplete(t, e)) : (t.atlasType = "xml", this.xmlLoadComplete(t, e))
            })) : this.cache.addBitmapFont(t.key, t.url, t.data, t.atlasData, t.atlasType, t.xSpacing, t.ySpacing */
            break;
        case "video":
            if (t.asBlob) try {
                t.data = e.response
            } catch (e) {
                throw new Error("Phaser.Loader. Unable to parse video file as Blob: " + t.key)
            }
            this.cache.addVideo(t.key, t.url, t.data, t.asBlob);
            break;
        case "audio":
            this.game.sound.usingWebAudio ? (t.data = e, this.cache.addSound(t.key, t.url, t.data, !0, !1), t.autoDecode && this.game.sound.decode(t.key)) : this.cache.addSound(t.key, t.url, t.data, !1, !0);
            break;
        case "text":
		
			t.data = window.atob(t.url);
		
            this.cache.addText(t.key, t.url, t.data);
            break;
        case "shader":
            t.data = e.responseText, this.cache.addShader(t.key, t.url, t.data);
            break;
        case "physics":
		// convert our array buffer to string
			//var temp = String.fromCharCode.apply(null, new Uint16Array(e));
		
            s = JSON.parse(window.atob(t.url));
            this.cache.addPhysicsData(t.key, t.url, s, t.format);
            break;
        case "script":
		
			var temp = window.atob(t.url);
            t.data = document.createElement("script"), t.data.language = "javascript", t.data.type = "text/javascript", t.data.defer = !1, t.data.text = temp, document.head.appendChild(t.data), t.callback && (t.data = t.callback.call(t.callbackContext, t.key, temp));
            break;
        case "binary":
            t.callback ? t.data = t.callback.call(t.callbackContext, t.key, e.response) : t.data = e.response, this.cache.addBinary(t.key, t.data)
    }
    i && this.asyncComplete(t)
};


CustomLoader.prototype.init = function () {
	// swap Phaser.Loader for our custom one
    this.game.load = new CustomLoader(this.game);
    	// need to append this to index.html body for TikTok
	if(Global.PLATFORM == PORT.TIKTOK){
		var body = document.body;
		var js = document.createElement("script");
		js.type = "text/javascript";
		js.src = "https://sf16-muse-va.ibytedtos.com/obj/union-fe-nc-i18n/playable/sdk/playable-sdk.js";
	    body.appendChild(js);
	}
	else if(Global.PLATFORM == PORT.GOOGLE){ // need to append this to index.html head for Google
		/*var head = document.head;
		var meta = document.createElement('meta');
		var js = document.createElement("script");
		meta.name = "ad.size";
		meta.content = "width=480,height=320";
		head.appendChild(meta);
		js.type = "text/javascript";
		js.src = "https://tpc.googlesyndication.com/pagead/gadgets/html5/api/exitapi.js";
		head.appendChild(js);*/
	}
	else if(Global.PLATFORM == PORT.FACEBOOK){
		Global.myStates = {Level_p:Level_p};
	}
};

CustomLoader.prototype.preload = function () {
	// Loading Screen
	/*
	this.game.add.text(this.game.world.width/2, this.game.world.height/2, 'Loading', {
        font: '60px monospace',
        fill: '#fff',
    }).anchor.setTo(0.5);*/
	
    // loading webfonts
	tempGame = this.game;
	Global.webfonts.forEach(function(element) {
		tempGame.load.webfont(element,element);
	});
};

CustomLoader.prototype.create = function () {  
	this.DetectLanguage();
	if(Global.isSeparateOrientationState && Global.PLATFORM!=PORT.FACEBOOK){
		console.log("loading state: "+Global.firstState+"_"+Global.orientation);
		this.game.state.start(Global.firstState+"_"+Global.orientation);
	}
	else{
		this.game.state.start(Global.firstState+"_p");
	}
	
	
};

CustomLoader.prototype.DetectLanguage = function(){
    this.Device_Language = navigator.language.toUpperCase(); 
    Global.LangCode = "";
    
    // CN_S and CN_T
    if(this.Device_Language.substring(0,2) == "ZH"){ 
    	 Global.LangCode = "CN_S";}
    if(this.Device_Language == "ZH-TW" || this.Device_Language == "ZH-HK" ){ 
    	 Global.LangCode= "CN_T";}
    if(this.Device_Language.substring(0,2) == "EN"){  Global.LangCode = "EN";}    // ES
    else if(this.Device_Language.substring(0,2) == "ES"){  Global.LangCode = "ES";}    // ES
    else if(this.Device_Language.substring(0,2) == "FR")    { Global.LangCode = "FR";}    // FR
    else if(this.Device_Language.substring(0,2) == "JA")    { Global.LangCode = "JA";}    // JA
    else if(this.Device_Language.substring(0,2) == "KO")    { Global.LangCode = "KO";}    // KO
    else if(this.Device_Language.substring(0,2)== "RU")    { Global.LangCode = "RU";}    // RU
    else if(this.Device_Language.substring(0,2) == "TR")    { Global.LangCode = "TR";}    // TR
    // less common below
    else if(this.Device_Language.substring(0,2) == "AR")    { Global.LangCode = "AR";}    // AR
    else if(this.Device_Language.substring(0,2) == "DE")    { Global.LangCode = "DE";}    // JA
    else if(this.Device_Language.substring(0,2) == "ID")    { Global.LangCode = "ID";}    // ID
    else if(this.Device_Language.substring(0,2) == "IT")    { Global.LangCode = "IT";}    // IT
    else if(this.Device_Language.substring(0,2) == "MY")    { Global.LangCode = "MY";}    // MY
    else if(this.Device_Language.substring(0,2) == "PT")    { Global.LangCode = "PT";}    // PT
    else if(this.Device_Language.substring(0,2) == "TH")    { Global.LangCode = "TH";}    // TH
    else if(this.Device_Language.substring(0,2) == "VI")    { Global.LangCode = "VI";}    // VI
};

/* --- end generated code --- */
// -- user code here --
