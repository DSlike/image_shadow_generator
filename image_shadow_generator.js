document.addEventListener('DOMContentLoaded', ()=>{
  const _getPixelsColor = (img) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    let ew = img.clientWidth/4*3;
    let eh = img.clientHeight/4*3;
    let sw = img.clientWidth/4;
    let sh = img.clientHeight/4;

    let colors = [
      [...context.getImageData(sw,sh,1,1).data],
      [...context.getImageData(ew,sh,1,1).data],
      [...context.getImageData(ew,eh,1,1).data],
      [...context.getImageData(sw,eh,1,1).data]
    ];

    return colors;
  }
  const _drawShadow = (img) => {
    let colors = _getPixelsColor(img);
    let cl = colors.map((c)=>{
      c[3]=0.3;
      return c;
    })
    
    const shadowBlur = img.clientWidth/5;
    const shadowSize = shadowBlur/10;
    const end = img.clientWidth-shadowSize;
    let shadow = [
      `0 0 ${shadowBlur}px -${shadowSize}px rgba(${colors[0]})`,
      `${shadowSize}px 0 ${shadowBlur}px -${shadowSize}px rgba(${colors[1]})`,
      `0 ${shadowSize}px ${shadowBlur}px -${shadowSize}px rgba(${colors[2]})`,
      `${shadowSize}px ${shadowSize}px ${shadowBlur}px -${shadowSize}px rgba(${colors[3]})`
    ];

    img.style.boxShadow = shadow.join(',');
  }
  let images = document.getElementsByClassName('_isg');

  Object.keys(images).forEach((i)=>{
    let img = images[i];
    img.style.transition = '.3s';
    img.addEventListener('load', _drawShadow(img))
  })
});
