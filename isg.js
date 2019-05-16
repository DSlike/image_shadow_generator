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

    let ew = imgW*95/100;
    let eh = imgH*95/100;
    let sw = imgW*5/100;
    let sh = imgW*5/100;

    let colors = [
      [...ctx.getImageData(sw,sh,1,1).data],
      [...ctx.getImageData(ew/2,sh,1,1).data],
      [...ctx.getImageData(ew,sh,1,1).data],
      [...ctx.getImageData(ew,eh/2,1,1).data],
      [...ctx.getImageData(ew,eh,1,1).data],
      [...ctx.getImageData(ew/2,eh,1,1).data],
      [...ctx.getImageData(sw,eh,1,1).data],
      [...ctx.getImageData(sw,eh/2,1,1).data]
    ];
    return colors;
  }
  _drawShadow(img, hover) {
    const debug = false;
    let colors = this._getPixelsColor(img);
    let cl = colors.map((c)=>{
      c[3]= c[3]==0 ? 0 : .5;
      return c.slice(0,4);
    })

    let shadowPos = img.clientWidth/10;
    let shadowBlur = debug ? 0 : this.config.shadowBlur*img.clientWidth/100;

    if(hover) {
      shadowBlur = debug ? 0 : this.config.hoverBlurSize*img.clientWidth/100;
    }

    console.log(img.clientWidth, shadowBlur);

    let shadowSize = debug ? 0 : img.clientWidth/10;

    const spx = [
      shadowPos-this.config.offsetX,
      0+this.config.offsetX,
      shadowPos+this.config.offsetX,
      shadowPos+this.config.offsetX,
      shadowPos+this.config.offsetX,
      0+this.config.offsetX,
      shadowPos-this.config.offsetX,
      shadowPos-this.config.offsetX
    ];
    const spy = [
      shadowPos-this.config.offsetY,
      shadowPos+this.config.offsetY,
      shadowPos-this.config.offsetY,
      0+this.config.offsetY,
      shadowPos+this.config.offsetY,
      shadowPos+this.config.offsetY,
      shadowPos+this.config.offsetY,
      0+this.config.offsetY
    ];

    let shadow = [
      `-${spx[0]}px -${spy[0]}px ${shadowBlur}px -${shadowSize}px rgba(${cl[0]})`,
      `-${spx[1]}px -${spy[1]}px ${shadowBlur}px -${shadowSize}px rgba(${cl[1]})`,
      `${spx[2]}px -${spy[2]}px ${shadowBlur}px -${shadowSize}px rgba(${cl[2]})`,
      `${spx[3]}px -${spy[3]}px ${shadowBlur}px -${shadowSize}px rgba(${cl[3]})`,
      `${spx[4]}px ${spy[4]}px ${shadowBlur}px -${shadowSize}px rgba(${cl[4]})`,
      `${spx[5]}px ${spy[5]}px ${shadowBlur}px -${shadowSize}px rgba(${cl[5]})`,
      `-${spx[6]}px ${spy[6]}px ${shadowBlur}px -${shadowSize}px rgba(${cl[6]})`,
      `-${spx[7]}px ${spy[7]}px ${shadowBlur}px -${shadowSize}px rgba(${cl[7]})`
    ];

    return shadow;
  }

  _applyStyles(img, index) {
    const styles = this._drawShadow(img, false);
    let styleElement = document.getElementById('_isg-style');
    let hoverStyleSheet = ``;

    if(this.config.hover === true) {
      const hoverStyles = this._drawShadow(img, true);
      hoverStyleSheet = `
        .${this.config.imgClass}._isg-${index}:hover {
          box-shadow: ${hoverStyles.join(',')};
          -webkit-box-shadow: ${hoverStyles.join(',')};
          -moz--box-shadow: ${hoverStyles.join(',')};
        }
      `;
    }

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
        transition: .3s;
      }
      ${hoverStyleSheet}
    `;
  }

  constructor(config){
    this.config = {
      offsetX: 0,
      offsetY: 0,
      imgClass: '_isg',
      shadowBlur: 95,
      hoverBlurSize: 90,
      hover: true
    };

    if(config){
      Object.keys(config).forEach((key)=>{
        this.config[key] = config[key];
      })
    }

    console.log(this.config);

    let images = document.getElementsByClassName(this.config.imgClass);

    Object.keys(images).forEach((i)=>{
      let img = images[i];
      img.className = img.className+' _isg-'+i;
      if(img.tagName == 'IMG')
        img.addEventListener('load', ()=>{ this._applyStyles(img, i) }, false);
      else if(img.tagName == 'VIDEO')
        img.ontimeupdate = () => { this._applyStyles(img, i) };
    })
  }
}
