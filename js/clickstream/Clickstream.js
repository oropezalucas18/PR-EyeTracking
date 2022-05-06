//import trackClickstream from "./modules/trackClickstream.js";
//import paintMouse from "./modules/paintMouse.js";
//import paintHeatmap from "./modules/paintHeatmap.js";
//import paintLive from "./modules/paintLive.js";
//import { postData, getData } from "./modules/server.js";
////////////////////IMPORT TRACK CLICK STREAM //////////////
//import normalizeFPS from "./normalizeFPS.js";
///////////// import normalize FPS ///////////
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

//export default normalizeFPS;
///////////////////////////////////////

const trackClickstream = () => {
  const data = [];

  const pushEventData = ({ pageX, pageY, type }) => {
    data.push({
      time: Date.now(),
      x: pageX,
      y: pageY,
      type,
    });
  };

  document.addEventListener("mousemove", normalizeFPS(pushEventData));
  document.addEventListener("click", pushEventData);

  return data;
};

//export default trackClickstream;

///////////////////////////////////////

///////////////IMPORT PAINT MOUSE ///////
/*const createMouseElement = () => {
  const mouse = document.createElement("div");
  mouse.style.cssText = `
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    top: 0px;
    left: 0px;
    transition: 0.1s;
    border: 2px solid rgba(0, 0, 0, 0.5);
    background: hsl(${360 * Math.random()}, 100%, 65%);
  `;
  document.body.appendChild(mouse);
  return mouse;
};

const onMove = (x, y, mouse) => {
  mouse.style.transform = `translate(${x}px, ${y}px)`;
};

const onClick = mouse => {
  mouse.style.boxShadow = `0 0 0 5px black`;
  setTimeout(() => {
    mouse.style.boxShadow = `0 0 0 0 black`;
  }, 100);
};

const paintMouse = data => {
  const mouse = createMouseElement();
  if (data.length) {
    const start = data[0].time;
    data.forEach(item => {
      setTimeout(() => {
        if (item.type === "mousemove") onMove(item.x, item.y, mouse);
        if (item.type === "click") onClick(mouse);
      }, item.time - start);
    });
  }
}; */

//export default paintMouse;
//////////////////////////////////////


//////////////PAINT HEATMAP////////////////////
/*const paintHeatmap = (data, max) => {
  const heatmap = h337.create({
    container: document.documentElement,
  });
  heatmap.setData({
    data,
    max,
  });
  return heatmap;
};

//export default paintHeatmap;*/
/////////////////////////////////

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

//export default paintLive;
////////////////////////////////////////////

///////////////////IMPORT GET AND POST//////////////
const postData = (url, data) => {
  const name = Date.now();
  fetch(`${url}/?name=${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const getData = async (url, total) => {
  const dataResponse = await fetch(url + "/");
  const dataJson = await dataResponse.json();

  const eachResponse = await Promise.all(
    dataJson.slice(Math.max(dataJson.length - total, 0)).map(name => fetch(`${url}/${name}`)),
  );
  const eachJson = await Promise.all(eachResponse.map(item => item.json()));
  return eachJson;
};

//export { postData, getData };

///////////////////////////////////////////////////////////

export default class Clickstream {
  constructor(url, total) {
    this.url = url;
    this.total = total;
  }
  track() {
    this.clickstream = trackClickstream();
  }
  post() {
    postData(this.url, this.clickstream);
  }
  async get() {
    return await getData(this.url, this.total);
  }
  /*async mouse() {
    this.data = await this.get();
    if (this.data.length) this.data.forEach(paintMouse);
  }
  async heatmap(max = 10) {
    this.data = await this.get();
    if (this.data.length) paintHeatmap(this.data.flat(), max);
  } */
  live(max = 5) {
    paintLive(this.clickstream, max);
  }
}
