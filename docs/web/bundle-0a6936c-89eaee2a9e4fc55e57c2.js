(()=>{"use strict";self.onmessage=function(a){var e,s=a.data,r=s.name,t=s.frameSize,f=s.imageData,m=s.state,i=s.imageDimensions,n=(new Date).toISOString(),x={name:r,meta:{version:1,created:n,updated:n,author:"",homepage:""},size:[t.width,t.height],frames:[m.frames.x,m.frames.y],layers:[],pixels:[]},h=m.frames.x*m.frames.y;for(e=1;e<=h;e++)x.layers.push([e,e,"Layer ".concat(e),0,100,1]);var o=1,y={canvas:{x:1,y:1},frame:{x:1,y:1}};for(e=0;e<f.data.length;e+=4){var d=f.data[e],v=f.data[e+1],c=f.data[e+2];if(parseFloat((f.data[e+3]/255).toFixed(2))>0){var g=[o,y.frame.x,y.frame.y,d,v,c];x.pixels.push(g)}if(y.frame.x===t.width?(o++,y.frame.x=1):y.frame.x++,y.canvas.x===i.width){var l=Math.floor(y.canvas.y/(i.height/m.frames.y));o=1+m.frames.x*l,y.frame.x=1,y.canvas.y%(i.height/m.frames.y)==0?y.frame.y=1:y.frame.y++,y.canvas.x=1,y.canvas.y++}else y.canvas.x++}self.postMessage(x)}})();