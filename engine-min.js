!function t(e,i,s){function o(r,h){if(!i[r]){if(!e[r]){var a="function"==typeof require&&require;if(!h&&a)return a(r,!0);if(n)return n(r,!0);throw new Error("Cannot find module '"+r+"'")}var c=i[r]={exports:{}};e[r][0].call(c.exports,function(t){var i=e[r][1][t];return o(i||t)},c,c.exports,t,e,i,s)}return i[r].exports}for(var n="function"==typeof require&&require,r=0;r<s.length;r++)o(s[r]);return o}({1:[function(t,e,i){var s=(i=e.exports=function(t){if(t&&"object"==typeof t){var e=t.which||t.keyCode||t.charCode;e&&(t=e)}if("number"==typeof t)return r[t];var i=String(t),n=s[i.toLowerCase()];return n||((n=o[i.toLowerCase()])||(1===i.length?i.charCodeAt(0):void 0))}).code=i.codes={backspace:8,tab:9,enter:13,shift:16,ctrl:17,alt:18,"pause/break":19,"caps lock":20,esc:27,space:32,"page up":33,"page down":34,end:35,home:36,left:37,up:38,right:39,down:40,insert:45,delete:46,command:91,"left command":91,"right command":93,"numpad *":106,"numpad +":107,"numpad -":109,"numpad .":110,"numpad /":111,"num lock":144,"scroll lock":145,"my computer":182,"my calculator":183,";":186,"=":187,",":188,"-":189,".":190,"/":191,"`":192,"[":219,"\\":220,"]":221,"'":222},o=i.aliases={windows:91,"⇧":16,"⌥":18,"⌃":17,"⌘":91,ctl:17,control:17,option:18,pause:19,break:19,caps:20,return:13,escape:27,spc:32,pgup:33,pgdn:34,ins:45,del:46,cmd:91};for(n=97;n<123;n++)s[String.fromCharCode(n)]=n-32;for(var n=48;n<58;n++)s[n-48]=n;for(n=1;n<13;n++)s["f"+n]=n+111;for(n=0;n<10;n++)s["numpad "+n]=n+96;var r=i.names=i.title={};for(n in s)r[s[n]]=n;for(var h in o)s[h]=o[h]},{}],2:[function(t,e,i){function s(t,e){this._state="readyToStart",this._onTick=t,this._render=e}s.prototype.start=function(){if("readyToStart"===this._state){var t;this._state="running",t=function(){"running"===this._state?(this._onTick(),"stopping"!=this._state&&this._render(),requestAnimationFrame(t)):this._state="readyToStart"}.bind(this),setTimeout(t,0)}else"stopping"===this._state&&setTimeout(start,10)},s.prototype.stop=function(){"running"!==this._state&&"readyToStart"!==this._state||(this._state="stopping",this._render())},e.exports=s},{}],3:[function(t,e,i){function s(t,e){this.pool=[],this.io=t,this.debugMode=e||!1}function o(t,e,i,s){i.x&&i.y&&(t?t.touched(i.x,i.y)&&(e.call(t),s&&console.log("Just fired a click handler on a sprite! ("+JSON.stringify(i)+")")):(e(),s&&console.log("Just fired a click handler on stage! ("+JSON.stringify(i)+")")))}function n(t,e,i,s){i[t]&&(e(),s&&console.log("Just fired a keydown handler on: "+key))}function r(t,e,i,s){for(var o,n=0;o=i[n];n++)t.touched(o)&&(e.call(t,o),s&&console.log({event:"Touch",sprite:t,target:o}))}s.prototype.traverse=function(){for(var t=this.pool,e=this.io,i=this.debugMode,s=0;s<t.length;s++)t[s].sprite&&t[s]._deleted?t.splice(s--,1):"click"==t[s].event?o(t[s].sprite,t[s].handler,e.clicked,i):"mousedown"==t[s].event?o(t[s].sprite,t[s].handler,e.mousedown,i):"mouseup"==t[s].event?o(t[s].sprite,t[s].handler,e.mouseup,i):"keydown"==t[s].event?n(t[s].key,t[s].handler,e.keydown,i):"keyup"==t[s].event?n(t[s].key,t[s].handler,e.keyup,i):"holding"==t[s].event?n(t[s].key,t[s].handler,e.holding,i):"touch"==t[s].event&&r(t[s].sprite,t[s].handler,t[s].targets,i);e.clearEvents()},s.prototype.clear=function(){this.pool=[]},s.prototype.register=function(){var t=arguments[0],e={event:t,handler:arguments[arguments.length-1]};"touch"===t?(e.sprite=arguments[1],arguments[2].constructor===Array?e.targets=arguments[2]:e.targets=[arguments[2]]):["keydown","keyup","holding"].includes(t)?e.key=arguments[1]||"any":["mousedown","mouseup","click"].includes(t)?e.sprite=arguments[1]:"listen"===t&&(e.message=arguments[1],e.sprite=arguments[2]),this.pool.push(e)},s.prototype.emit=function(t){for(var e=0;e<this.pool.length;e++){var i=this.pool[e];"listen"==i.event&&i.message==t&&i.handler.call(i.sprite)}},e.exports=s},{}],4:[function(t,e,i){var s=t("./sprite"),o=t("./sprites"),n=t("./event-list"),r=t("./inspector"),h=t("./clock"),a=t("./renderer"),c=t("./sound"),u=t("./loader"),d=t("./io"),l=t("./pen");window.Engine=function(t,e){function i(t,e,i,s,o){z.path=t,z.x=e,z.y=i,z.w=s,z.h=o}function p(t,e,i){["keydown","keyup","mousedown","mouseup","holding","click"].includes(t)&&("function"==typeof e?S.register(t,null,e):S.register(t,e,i))}function f(t){w.updateFunctions.push(t)}var y=document.getElementById(t),g=y.getContext("2d"),m=document.createElement("canvas"),x=m.getContext("2d");m.width=y.width,m.height=y.height;var w={width:y.width,height:y.height,zoom:1,updateFunctions:[]},v=!0,_=new u,k=new o,T=new r,N=new d(y,w,e),S=new n(N,e),C=new a(g,w,_.images,e),b=new c(_,e),M=new l(g),I=new h(function(){S.traverse();for(var t=0;t<w.updateFunctions.length;t++)w.updateFunctions[t]();k.removeDeletedSprites(),k.runOnTick(),T.updateFPS()},function(){v&&(C.drawBackdrop(z.path,z.x,z.y,z.w,z.h),M.drawShapes(),C.drawSprites(k),M.drawTexts())});s.prototype._sprites=k,s.prototype._eventList=S,s.prototype._settings=w,s.prototype._renderer=C,s.prototype._hitTester=x;var z={path:"#ffffff"};e=e||!1;var F={createSprite:function(t){return new s(t)},Sprite:s,print:function(t,e,i,s,o,n){M.print(t,e,i,s,o,n)},setBackground:i,setBackdrop:i,cursor:N.cursor,key:N.holding,inspector:T,when:p,on:p,set:function(t){return t.width&&(m.width=y.width=w.width=t.width),t.height&&(m.height=y.height=w.height=t.height),t.zoom&&(w.zoom=t.zoom,y.style.width=y.width*w.zoom+"px",y.style.height=y.height*w.zoom+"px"),w.update=t.update||w.update,this},stop:function(){I.stop(),b.stop()},stopRendering:function(){v=!1,M.drawingMode="instant"},start:function(){I.start()},forever:f,update:f,always:f,clear:function(){C.clear()},preload:function(t,e,i){_.preload(t,e,i)},sound:b,broadcast:S.emit.bind(S),pen:M,drawBackdrop:C.drawBackdrop,drawBackground:C.drawBackdrop,drawSprites:C.drawSprites};return e&&(F.eventList=S),F}},{"./clock":2,"./event-list":3,"./inspector":5,"./io":6,"./loader":7,"./pen":8,"./renderer":9,"./sound":11,"./sprite":12,"./sprites":13}],5:[function(t,e,i){function s(){this.fps=0,this._lastFrameUpdatedTime=(new Date).getTime()}s.prototype.updateFPS=function(){var t=(new Date).getTime();this.fps=Math.round(1e3/(t-this._lastFrameUpdatedTime)),this._lastFrameUpdatedTime=t},e.exports=s},{}],6:[function(t,e,i){function s(t,e,i){function s(i){return{x:(i.pageX-t.offsetLeft)/e.zoom,y:(i.pageY-t.offsetTop)/e.zoom}}var n=this.cursor={x:0,y:0,isDown:!1,left:!1,right:!1},r=this.clicked={x:null,y:null},h=this.mousedown={x:null,y:null},a=this.mouseup={x:null,y:null},c=this.keyup={any:!1},u=this.keydown={any:!1},d=this.holding={any:!1,count:0};i=i||!1,t.setAttribute("tabindex","1"),t.style.outline="none",t.oncontextmenu=function(){return!1},t.addEventListener("mousedown",function(t){1==t.which&&(n.left=!0),3==t.which&&(n.right=!0),n.isDown=!0,h.x=t.offsetX/e.zoom,h.y=t.offsetY/e.zoom}),t.addEventListener("mouseup",function(t){1==t.which&&(n.left=!1),3==t.which&&(n.right=!1),n.isDown=n.left||n.right,a.x=t.offsetX/e.zoom,a.y=t.offsetY/e.zoom}),t.addEventListener("mousemove",function(t){n.x=t.offsetX/e.zoom,n.y=t.offsetY/e.zoom}),t.addEventListener("touchstart",function(t){n.isDown=!0;var e=s(t.changedTouches[0]);n.x=h.x=e.x,n.y=h.y=e.x}),t.addEventListener("touchend",function(t){n.isDown=!1;var e=s(t.changedTouches[0]);n.x=a.x=e.x,n.y=a.y=e.x}),t.addEventListener("touchmove",function(t){var e=s(t.changedTouches[0]);n.x=e.x,n.y=e.x}),t.addEventListener("click",function(t){r.x=t.offsetX/e.zoom,r.y=t.offsetY/e.zoom,i&&console.log("Clicked! cursor:"+JSON.stringify(n))}),t.addEventListener("keydown",function(t){var e=o(t.keyCode);d[e]||(d.any=(d.count+=1)>0),u.any=!0,u[e]=!0,d[e]=!0,i&&console.log("Keydown! key:"+e)}),t.addEventListener("keyup",function(t){var e=o(t.keyCode);d.any=(d.count-=1)>0,c.any=!0,c[e]=!0,d[e]=!1,i&&console.log("Keyup! key:"+e)})}var o=t("keycode");s.prototype.clearEvents=function(){this.clicked.x=null,this.clicked.y=null,this.mousedown.x=null,this.mousedown.y=null,this.mouseup.x=null,this.mouseup.y=null;for(var t in this.keydown)this.keydown[t]=!1,this.keyup[t]=!1},e.exports=s},{keycode:1}],7:[function(t,e,i){function s(){this.context=new(window.AudioContext||window.webkitAudioContext),this.loaded=0,this.paths=[],this.sounds={},this.images={},this.completeFunc,this.progressFunc}s.prototype={preload:function(t,e,i){if(0===t.length)return e();this.paths=t,this.completeFunc=e,this.progressFunc=i;for(var s=0;s<t.length;s++){var o=t[s],n=o.split(".").pop();["jpg","jpeg","png","gif","svg"].includes(n)&&this._loadImage(o),["mp3","ogg","wav","midi"].includes(n)&&this._loadSound(o)}},_loadImage:function(t){var e=this,i=new Image;i.src=t,i.onload=function(){e._loaded()},this.images[t]=i},_loadSound:function(t){var e=this;this._xhrLoad(t,function(i){var s=i.response;e.context.decodeAudioData(s,function(i){e.sounds[t]=i,e._loaded()})})},_loaded:function(){this.loaded+=1,this.progressFunc&&this.progressFunc(this.loaded,this.paths.length),this.loaded>=this.paths.length&&this.completeFunc&&this.completeFunc()},_xhrLoad:function(t,e){var i=new XMLHttpRequest;i.open("GET",t,!0),i.responseType="arraybuffer",i.onload=function(){e(i)},i.onerror=function(){console.error(i)},i.send()}},e.exports=s},{}],8:[function(e,i,s){function o(t,e){this.ctx=t,this.size=1,this.color="black",this.fillColor=null,this.drawingMode="onTick",this.shapes=[],this.texts=[]}o.prototype={drawShapes:function(){for(var t,e=this.ctx,i=0;i<this.shapes.length;i++)t=this.shapes[i],e.lineWidth=t.size,e.strokeStyle=t.color,e.fillStyle=t.fillColor,"text"==t.type?this._drawText(t.t,t.x,t.y):"line"==t.type?this._drawLine(t.x1,t.y1,t.x2,t.y2):"circle"==t.type?this._drawCircle(t.x,t.y,t.r):"triangle"==t.type?this._drawTriangle(t.x1,t.y1,t.x2,t.y2,t.x3,t.y3):"rect"==t.type?this._drawRect(t.x,t.y,t.w,t.h):"polygon"==t.type&&this._drawPolygon.apply(this,t.points);this.shapes=[]},drawTexts:function(){this.ctx;for(var e=0;e<this.texts.length;e++)t=this.texts[e],this._drawText(t.text,t.x,t.y,t.color,t.size,t.font);this.texts=[]},print:function(t,e,i,s,o,n){if(e=void 0==e?10:e,i=void 0==i?10:i,s=s||"black",o=o||16,n=n||"Arial","instant"==this.drawingMode)return this._drawText(t,e,i,s,o,n);this._addText({text:t,x:e,y:i,color:s,size:o,font:n})},drawLine:function(t,e,i,s){if("instant"==this.drawingMode)return this._drawLine(t,e,i,s);var o={};o.x1=t,o.y1=e,o.x2=i,o.y2=s,o.type="line",this._addShape(o)},drawCircle:function(t,e,i){if("instant"==this.drawingMode)return this._drawCircle(t,e,i);var s={};s.x=t,s.y=e,s.r=i,s.type="circle",this._addShape(s)},drawTriangle:function(t,e,i,s,o,n){if("instant"==this.drawingMode)return this._drawTriangle(t,e,i,s,o,n);var r={};r.x1=t,r.y1=e,r.x2=i,r.y2=s,r.x3=o,r.y3=n,r.type="triangle",this._addShape(r)},drawRect:function(t,e,i,s){if("instant"==this.drawingMode)return this._drawRect(t,e,i,s);var o={};o.x=t,o.y=e,o.w=i,o.h=s,o.type="rect",this._addShape(o)},drawPolygon:function(){if("instant"==this.drawingMode)return this._drawPolygon.apply(this,arguments);var t={};t.points=Array.prototype.slice.call(arguments),t.type="polygon",this._addShape(t)},_drawText:function(t,e,i,s,o,n){"instant"==this.drawingMode&&this._setPenAttr(),this.ctx.textBaseline="top",this.ctx.font=o+"px "+n,this.ctx.fillStyle=s,this.ctx.fillText(t,e,i)},_drawLine:function(t,e,i,s){"instant"==this.drawingMode&&this._setPenAttr(),this.ctx.beginPath(),this.ctx.moveTo(t,e),this.ctx.lineTo(i,s),this.ctx.closePath(),this.size&&this.ctx.stroke(),this.fillColor&&this.ctx.fill()},_drawCircle:function(t,e,i){"instant"==this.drawingMode&&this._setPenAttr(),this.ctx.beginPath(),this.ctx.arc(t,e,i,0,2*Math.PI),this.ctx.closePath(),this.size&&this.ctx.stroke(),this.fillColor&&this.ctx.fill()},_drawTriangle:function(t,e,i,s,o,n){"instant"==this.drawingMode&&this._setPenAttr(),this.ctx.beginPath(),this.ctx.moveTo(t,e),this.ctx.lineTo(i,s),this.ctx.lineTo(o,n),this.ctx.closePath(),this.size&&this.ctx.stroke(),this.fillColor&&this.ctx.fill()},_drawRect:function(t,e,i,s){"instant"==this.drawingMode&&this._setPenAttr(),this.ctx.beginPath(),this.ctx.moveTo(t,e),this.ctx.lineTo(t+i,e),this.ctx.lineTo(t+i,e+s),this.ctx.lineTo(t,e+s),this.ctx.closePath(),this.size&&this.ctx.stroke(),this.fillColor&&this.ctx.fill()},_drawPolygon:function(){"instant"==this.drawingMode&&this._setPenAttr();var t=Array.prototype.slice.call(arguments);this.ctx.beginPath(),this.ctx.moveTo(t[0],t[1]);for(var e=2;e<t.length;e+=2)this.ctx.lineTo(t[e],t[e+1]);this.ctx.closePath(),this.size&&this.ctx.stroke(),this.fillColor&&this.ctx.fill()},_setPenAttr:function(){this.ctx.lineWidth=this.size,this.ctx.strokeStyle=this.color,this.ctx.fillStyle=this.fillColor},_addShape:function(t){t.size=this.size,t.color=this.color,t.fillColor=this.fillColor,this.shapes.push(t)},_addText:function(t){this.texts.push(t)}},i.exports=o},{}],9:[function(t,e,i){function s(t){var e=t.length,i=!0;for(let s=0;s<e&&i;s++){i=!1;for(let o=0;o<e-1-s;o++)t[o].layer>t[o+1].layer&&([t[o],t[o+1]]=[t[o+1],t[o]],i=!0)}return t}var o=t("./util");e.exports=function(t,e,i,n){function r(t){var e=h[t];return e||((e=new Image).src=t,h[t]=e),e}var h=i,a=this;this.autoRender=!1,this.clear=function(){t.clearRect(0,0,e.width,e.height)},this.drawSprites=function(e){s(e._sprites),e.each(function(e){a.drawInstance(e,t)})},this.drawInstance=function(t,e){if(!t.hidden){var i=r(t.getCurrentCostume());if(t.width=i.width*t.scale,t.height=i.height*t.scale,s=o.degreeToRad(t.direction-90),e.globalAlpha=t.opacity,"flipped"===t.rotationStyle){if(t.direction>180)return e.translate(2*t.x,0),e.scale(-1,1),e.drawImage(i,t.x-t.width/2,t.y-t.height/2,t.width,t.height),e.scale(-1,1),e.translate(2*-t.x,0),void(e.globalAlpha=1);s=0}if("fixed"===t.rotationStyle)var s=0;e.translate(t.x,t.y),e.rotate(s),e.drawImage(i,-t.width/2,-t.height/2,t.width,t.height),e.rotate(-s),e.translate(-t.x,-t.y),e.globalAlpha=1}},this.getImgFromCache=r,this.drawBackdrop=function(i,s,o,n,r){if(i.includes(".")){var a=h[i];a||((a=new Image).src=i,h[i]=a),t.drawImage(a,s||0,o||0,n||a.width,r||a.height)}else i&&(t.fillStyle=i,t.fillRect(0,0,e.width,e.height))}}},{"./util":14}],10:[function(t,e,i){function s(t){this.volume=1,this.source=t.createBufferSource(),this.gainNode=t.createGain(),this.source.connect(this.gainNode),this.gainNode.connect(t.destination)}s.prototype={setVolume:function(t){if(t<0)return console.error("無效的音量值");this.volume=t,this.gainNode.gain.value=t},setBufferData:function(t){this.source.buffer=t},setLoop:function(t){this.source.loop=t},mute:function(t){this.gainNode.gain.value=t?0:this.volume},pause:function(){this.source.playbackRate.value=Number.MIN_VALUE},resume:function(){this.source.playbackRate.value=1},play:function(){this.source.start(0)},stop:function(){this.source.stop()}},e.exports=s},{}],11:[function(t,e,i){function s(t,e){this.context=new(window.AudioContext||window.webkitAudioContext),this.soundNodes=[],this.loader=t,this.sounds=t.sounds,this.muted=!1}var o=t("./sound-node");s.prototype={play:function(t,e){e=void 0!==e&&e;var i=new o(this.context);if(this.sounds[t]){var s=this.sounds[t];i.setBufferData(s),i.setLoop(e),this.soundNodes.push(i),i.play()}else{var n=this;this.loader.preload([t],function(){var s=n.sounds[t];i.setBufferData(s),i.setLoop(e),n.soundNodes.push(i),i.play()})}return i},setVolume:function(t){if(t<0)return console.error("無效的音量值");for(var e=0;e<this.soundNodes.length;e++)this.soundNodes[e].setVolume(t)},mute:function(t){for(var e=0;e<this.soundNodes.length;e++)this.soundNodes[e].mute(t)},pause:function(){this.context.suspend()},resume:function(){this.context.resume()},stop:function(){for(var t=0;t<this.soundNodes.length;t++)this.soundNodes[t].stop()}},e.exports=s},{"./sound-node":10}],12:[function(t,e,i){function s(t){t.constructor!==String&&t.constructor!==Array||(t={costumes:[].concat(t)}),this.x=o.isNumeric(t.x)?t.x:this._settings.width/2,this.y=o.isNumeric(t.y)?t.y:this._settings.height/2,this.width=1,this.height=1,this.direction=o.isNumeric(t.direction)?t.direction:90,this.rotationStyle=t.rotationStyle||"full",this.scale=t.scale||1,this.costumes=[].concat(t.costumes),this.hidden=t.hidden||!1,this.layer=o.isNumeric(t.layer)?t.layer:0,this.opacity=o.isNumeric(t.opacity)?t.opacity:1,this.costumeId=0,this._onTickFuncs=[],this._deleted=!1,this._animation={frames:[],rate:5,timer:0},this._sprites._sprites.push(this)}var o=t("./util");s.prototype.update=function(){this._updateDirection(),this._updateFrames();for(var t=0;t<this._onTickFuncs.length;t++)this._onTickFuncs[t].call(this)},s.prototype._updateDirection=function(){this.direction=this.direction%360,this.direction<0&&(this.direction+=360)},s.prototype._updateFrames=function(){var t=this._animation;if(t.frames.length>0){var e=(new Date).getTime();e>=t.timer+1e3/t.rate&&(t.timer=e,this.costumeId=t.frames.shift(),t.frames.length<=0&&t.callback&&t.callback())}},s.prototype.moveTo=function(){if(o.isNumeric(arguments[0].x)&&o.isNumeric(arguments[0].y))this.x=arguments[0].x,this.y=arguments[0].y;else{if(!o.isNumeric(arguments[0])||!o.isNumeric(arguments[1]))throw"請傳入角色(Sprite, Cursor)或是 X, Y 座標值";this.x=arguments[0],this.y=arguments[1]}},s.prototype.move=function(t,e){this.x+=t,this.y+=e},s.prototype.stepForward=function(t){var e=o.degreeToRad(this.direction);this.x+=Math.sin(e)*t,this.y-=Math.cos(e)*t},s.prototype.bounceEdge=function(){this.x<0&&(this.x=0,this.direction>180&&this.direction>0&&(this.direction=-this.direction)),this.x>this._settings.width&&(this.x=this._settings.width,this.direction<180&&(this.direction=-this.direction)),this.y<0&&(this.y=0,(this.direction<90||this.direction>270)&&(this.direction=180-this.direction)),this.y>this._settings.height&&(this.y=this._settings.height,(this.direction>90||this.direction<270)&&(this.direction=180-this.direction))},s.prototype.toward=function(){var t,e,i,s,n;if(o.isNumeric(arguments[0].x)&&o.isNumeric(arguments[0].y))t=arguments[0].x,e=arguments[0].y;else{if(!o.isNumeric(arguments[0])||!o.isNumeric(arguments[1]))throw"請傳入角色(Sprite)或是 X, Y 坐標值";t=arguments[0],e=arguments[1]}i=t-this.x,s=e-this.y,n=Math.atan2(i,-s),this.direction=o.radToDegree(n)},s.prototype.touched=function(){if(arguments[0].constructor===Array){for(var t=0;t<arguments[0].length;t++)if(this._isTouched(arguments[0][t]))return!0;return!1}return this._isTouched.apply(this,arguments)},s.prototype.distanceTo=function(){if(o.isNumeric(arguments[0].x)&&o.isNumeric(arguments[0].y))return o.distanceBetween(this,arguments[0]);if(o.isNumeric(arguments[0])&&o.isNumeric(arguments[1]))return o.distanceBetween(this.x,this.y,arguments[0],arguments[1]);throw"請傳入角色(Sprite)、{x:x, y:y}，或是 X, Y 坐標值"},s.prototype.always=s.prototype.forever=function(t){this._onTickFuncs.push(t)},s.prototype.when=s.prototype.on=function(){var t=arguments[0],e=this._eventList;return"listen"==t?e.register(t,arguments[1],this,arguments[2]):["mousedown","mouseup","click"].includes(t)?e.register(t,this,arguments[1]):"touch"==t?e.register(t,this,arguments[1],arguments[2]):(console.log('Sprite.on() does only support "listen", "click" and "touch" events'),!1)},s.prototype.destroy=function(){this._deleted=!0},s.prototype.getCurrentCostume=function(){var t=this.costumeId;return this.costumes[t]},s.prototype.animate=function(t,e,i){this._animation={frames:t,rate:e||5,callback:i,timer:0}},s.prototype.nextCostume=function(){this.costumeId+=1,this.costumeId>=this.costumes.length&&(this.costumeId=0)},s.prototype._isTouched=function(){if(this.hidden||this._deleted)return!1;if(arguments[0]instanceof s){var t=arguments[0];if(t.hidden||t._deleted||t===this)return!1}var e,i;if(e=Math.sqrt(Math.pow(this.width/2,2)+Math.pow(this.height/2,2)),i=arguments[0]instanceof s?Math.sqrt(Math.pow(t.width/2,2)+Math.pow(t.height/2,2)):1,this.distanceTo.apply(this,arguments)>e+i)return!1;if(2*e<1||2*i<1)return!1;if(this._hitTester.clearRect(0,0,this._settings.width,this._settings.height),this._hitTester.globalCompositeOperation="source-over",arguments[0]instanceof s){n=arguments[0].opacity;arguments[0].opacity=1,this._renderer.drawInstance(arguments[0],this._hitTester),arguments[0].opacity=n}else if(o.isNumeric(arguments[0].x)&&o.isNumeric(arguments[0].y))this._hitTester.fillRect(arguments[0].x,arguments[0].y,1,1);else{if(!o.isNumeric(arguments[0])||!o.isNumeric(arguments[1]))throw"請傳入角色(Sprite)、{x:x, y:y}，或是 X, Y 坐標值";this._hitTester.fillRect(arguments[0],arguments[1],1,1)}this._hitTester.globalCompositeOperation="source-in";var n=this.opacity;this.opacity=1,this._renderer.drawInstance(this,this._hitTester),this.opacity=n;var r;arguments[0]instanceof s?r=e<i?this._hitTester.getImageData(this.x-e,this.y-e,2*e,2*e).data:this._hitTester.getImageData(t.x-i,t.y-i,2*i,2*i).data:o.isNumeric(arguments[0].x)&&o.isNumeric(arguments[0].y)?r=this._hitTester.getImageData(arguments[0].x,arguments[0].y,1,1).data:o.isNumeric(arguments[0])&&o.isNumeric(arguments[1])&&(r=this._hitTester.getImageData(arguments[0],arguments[1],1,1).data);for(var h=r.length,a=0;a<h;a+=4)if(r[a+3]>0)return!0;return!1},e.exports=s},{"./util":14}],13:[function(t,e,i){function s(){this._sprites=[]}s.prototype.runOnTick=function(){this.each(function(){this.update()})},s.prototype.each=function(t){for(var e=this._sprites,i=0;i<e.length;i++)t.call(e[i],e[i])},s.prototype.removeDeletedSprites=function(){for(var t=this._sprites,e=0;e<t.length;e++)t[e]._deleted&&t.splice(e,1)},s.prototype.clear=function(){this._sprites=[]},e.exports=s},{}],14:[function(t,e,i){var s={};s.isNumeric=function(t){return!isNaN(parseFloat(t))&&isFinite(t)},s.radToDegree=function(t){return(t%=2*Math.PI)<0&&(t+=2*Math.PI),180*t/Math.PI},s.degreeToRad=function(t){return(t%=360)<0&&(t+=360),t/180*Math.PI},s.distanceBetween=function(){var t={x:0,y:0},e={x:0,y:0};if(s.isNumeric(arguments[0].x)&&s.isNumeric(arguments[0].y)&&s.isNumeric(arguments[1].x)&&s.isNumeric(arguments[1].y))t.x=arguments[0].x,t.y=arguments[0].y,e.x=arguments[1].x,e.y=arguments[1].y;else{if(!(s.isNumeric(arguments[0])&&s.isNumeric(arguments[1])&&s.isNumeric(arguments[2])&&s.isNumeric(arguments[3])))throw"請傳入角色(Sprite)或是 X, Y 坐標值";t.x=arguments[0],t.y=arguments[1],e.x=arguments[2],e.y=arguments[3]}return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))},e.exports=s},{}]},{},[4]);