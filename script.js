/*global h337*/
/*eslint-env es6*/
//import webgazer from "./webgazer.js"
////////////////////////////////
const normalizeFPS = callback => {
  let ticking = true;
  const update = () => {
    if (ticking) requestAnimationFrame(update);
    ticking = true;
  };
  return event => {
    if (ticking) {
      callback(event);
      update();
		
    }
    ticking = false;  
  };
	
};
//////////////////webgazer/////////////////////
/*webgazer.setGazeListener(function(data, elapsedTime) {
    if (data == null) {
        return;
    }
    var xprediction = data.x; //these x coordinates are relative to the viewport
    var yprediction = data.y; //these y coordinates are relative to the viewport
    //console.log(elapsedTime); //elapsed time is based on time since begin was called
}).begin();*/

///////////////////////////////////////
const trackClickstream = () => {
  const data = [];
	
/*var prediction = webgazer.getCurrentPrediction();
if (prediction) {
    var x = prediction.x;
    var y = prediction.y;
}
	console.log(prediction)*/

  const pushEventData = ({ pageX, pageY, type }) => {
    data.push({
      time: Date.now(),
      x:pageX,
      y:pageY,
      type,			
    }); 
	  console.log(data);
  };

  document.addEventListener("mousemove", normalizeFPS(pushEventData));
  document.addEventListener("click", pushEventData);

  return data;
};
///////////////////IMPORT PAINT LIVE ////////////
const paintLive = (data, max) => {
  const heatmap = h337.create({
    container: document.documentElement,
  }); 
  const update = () => {
    heatmap.setData({
      max,
      data,
    });
    requestAnimationFrame(update);
  };
  update();
};
////////////////////////////////////////////

class Clickstream {
  track() {
    this.clickstream = trackClickstream();
  }
	//max por default = 5;
    live(max = 7) {
    paintLive(this.clickstream, max);
  }
}
///////////////////////////////////////////
const clickstream = new Clickstream("http://127.0.0.1:3001/api", 10);

clickstream.track();
clickstream.live();
