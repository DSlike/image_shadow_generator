class ImageShadowGenerator{
  _getPixelsColor(img) {
    img.crossOrigin = "Anonymous";
    const canvas = document.createElement('canvas');
    const imgW = img.clientWidth;
    const imgH = img.clientHeight;
    canvas.width = imgW;
    canvas.height = imgH;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.clientWidth, imgH);

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
  _drawShadow(img) {
    const debug = false;
    let colors = this._getPixelsColor(img);
    let cl = colors.map((c)=>{
      c[3]=.5;
      return c.slice(0,4);
    })

    let shadowPos = img.clientWidth/10;
    let shadowBlur = debug ? 0 : img.clientWidth/5;
    let shadowSize = debug ? 0 : img.clientWidth/10;

    const spx = [
      shadowPos-this.config.offsetX,
      shadowPos+this.config.offsetX,
      shadowPos+this.config.offsetX,
      shadowPos-this.config.offsetX
    ];
    const spy = [
      shadowPos-this.config.offsetY,
      shadowPos-this.config.offsetY,
      shadowPos+this.config.offsetY,
      shadowPos+this.config.offsetY
    ];

    let shadow = [
      `-${spx[0]}px -${spy[0]}px ${shadowBlur}px -${shadowSize}px rgba(${cl[0]})`,
      `${spx[1]}px -${spy[1]}px ${shadowBlur}px -${shadowSize}px rgba(${cl[1]})`,
      `${spx[2]}px ${spy[2]}px ${shadowBlur}px -${shadowSize}px rgba(${cl[2]})`,
      `-${spx[3]}px ${spy[3]}px ${shadowBlur}px -${shadowSize}px rgba(${cl[3]})`
    ];

    return shadow;
  }

  _applyStyles(img, index) {
    const styles = this._drawShadow(img);
    let styleElement = document.getElementById('_isg-style');

    if(!styleElement){
      styleElement = document.createElement('style');
      styleElement.setAttribute('id', '_isg-style');
      document.head.appendChild(styleElement);
    }

    styleElement.innerHTML = `
      .${this.config.imgClass}._isg-${index} {
        box-shadow: ${styles.join(',')};
        -webkit-box-shadow: ${styles.join(',')};
        -moz--box-shadow: ${styles.join(',')};
      }
    `;
  }

  constructor(config){
    this.config = {
      offsetX: 0,
      offsetY: 0,
      imgClass: '_isg'
    };

    if(config){
      this.offsetX = config.offsetX | 0;
      this.offsetY = config.offsetY | 0;
      this.imgClass = config.imgClass | '_isg';
    }

    let images = document.getElementsByClassName(this.config.imgClass);

    Object.keys(images).forEach((i)=>{
      let img = images[i];
      img.className = img.className+' _isg-'+i;
      img.addEventListener('load', ()=>{ this._applyStyles(img, i) }, false);
    })
  }
}
