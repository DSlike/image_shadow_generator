const _getPixelsColor = (img) => {
    const canvas = document.createElement('canvas');
    const imgW = img.clientWidth;
    const imgH = img.clientHeight;
    canvas.width = imgW;
    canvas.height = imgH;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.clientWidth, imgH);
    // document.body.appendChild(canvas);

    let ew = imgW*90/100;
    let eh = imgH*90/100;
    let sw = 30;
    let sh = 30;

    let colors = [
      [...ctx.getImageData(sw,sh,1,1).data],
      [...ctx.getImageData(ew,sh,1,1).data],
      [...ctx.getImageData(ew,eh,1,1).data],
      [...ctx.getImageData(sw,eh,1,1).data]
    ];

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
      `-${shadowSize}px -${shadowSize}px ${shadowBlur}px -${shadowSize}px rgba(${cl[0]})`,
      `${shadowSize}px -${shadowSize}px ${shadowBlur}px -${shadowSize}px rgba(${cl[1]})`,
      `${shadowSize}px ${shadowSize}px ${shadowBlur}px -${shadowSize}px rgba(${cl[2]})`,
      `-${shadowSize}px ${shadowSize}px ${shadowBlur}px -${shadowSize}px rgba(${cl[3]})`
    ];

    img.style.boxShadow = shadow.join(',');
  }
  let images = document.getElementsByClassName('_isg');

  Object.keys(images).forEach((i)=>{
    let img = images[i];
    img.crossOrigin = "Anonymous";
    img.onload = ()=>{ _drawShadow(img) };
  })
