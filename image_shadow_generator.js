document.addEventListener('DOMContentLoaded', ()=>{
  const _getPixelsColor = (img) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);

    let ew = img.clientWidth-20;
    let eh = img.clientHeight-20;
    let sw = 20;//img.clientWidth/4;
    let sh = 20;//img.clientHeight/4;

    let colors = [
      [...context.getImageData(sw,sh,1,1).data],
      [...context.getImageData(ew,sh,1,1).data],
      [...context.getImageData(ew,eh,1,1).data],
      [...context.getImageData(sw,eh,1,1).data]
    ];

    console.log(colors);
    return colors;
  }
  const _drawShadow = (img) => {
    let colors = _getPixelsColor(img);
    let cl = colors.map((c)=>{
      c[3]=.5;
      return c;
    })

    const shadowBlur = img.clientWidth/5;
    const shadowSize = img.clientWidth/10;

    let shadow = [
      `-${shadowSize}px -${shadowSize}px ${0}px -${0}px rgba(${cl[0]})`,
      `${shadowSize}px -${shadowSize}px ${0}px -${0}px rgba(${cl[1]})`,
      `${shadowSize}px ${shadowSize}px ${0}px -${0}px rgba(${cl[2]})`,
      `-${shadowSize}px ${shadowSize}px ${0}px -${0}px rgba(${cl[3]})`
    ];

    img.style.boxShadow = shadow.join(',');
    // document.getElementById('block').style.boxShadow = shadow.join(',');
  }
  let images = document.getElementsByClassName('_isg');

  Object.keys(images).forEach((i)=>{
    let img = images[i];
    img.onload = ()=>{ _drawShadow(img) };
  })
});
