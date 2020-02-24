class ImageShadowGenerator {
  _getPixelsColor(img) {
    img.crossOrigin = "Anonymous";
    const canvas = document.createElement('canvas');
    const imgW = img.clientWidth;
    const imgH = img.clientHeight;
    canvas.width = imgW;
    canvas.height = imgH;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.clientWidth, imgH);

    let ew = imgW * 95 / 100;
    let eh = imgH * 95 / 100;
    let sw = imgW * 5 / 100;
    let sh = imgW * 5 / 100;

    let colors = [
      [...ctx.getImageData(sw, sh, 1, 1).data],
      [...ctx.getImageData(ew / 2, sh, 1, 1).data],
      [...ctx.getImageData(ew, sh, 1, 1).data],
      [...ctx.getImageData(ew, eh / 2, 1, 1).data],
      [...ctx.getImageData(ew, eh, 1, 1).data],
      [...ctx.getImageData(ew / 2, eh, 1, 1).data],
      [...ctx.getImageData(sw, eh, 1, 1).data],
      [...ctx.getImageData(sw, eh / 2, 1, 1).data]
    ];
    return colors;
  }
  _drawShadow(img, hover) {
    const debug = this.config.debug;
    let offX = this.config.offsetX;
    let offY = this.config.offsetY;

    let colors = this._getPixelsColor(img);
    let cl = colors.map((c) => {
      c[3] = c[3] == 0 ? 0 : .5;
      return c.slice(0, 4);
    })

    let shadowPos = img.clientWidth / 10;
    let shadowBlur = debug ? 0 : this.config.shadowBlur * img.clientWidth / 100;

    if (hover) {
      shadowBlur = debug ? 0 : this.config.hoverBlurSize * img.clientWidth / 100;
    }

    let shadowSize = debug ? 0 : img.clientWidth / 10;

    if (debug && hover) {
      offX = 0;
      offY = 0;
    }

    const spx = [
      shadowPos - offX,
      0 + offX,
      shadowPos + offX,
      shadowPos + offX,
      shadowPos + offX,
      0 + offX,
      shadowPos - offX,
      shadowPos - offX,
    ];

    const spy = [
      shadowPos - offY,
      shadowPos - offY,
      shadowPos - offY,
      0 + offY,
      shadowPos + offY,
      shadowPos + offY,
      shadowPos + offY,
      0 + offY
    ];

    let shadow = [
      `-${Math.abs(spx[0])}px -${Math.abs(spy[0])}px ${Math.abs(shadowBlur)}px -${Math.abs(shadowSize)}px rgba(${cl[0]})`,
      `${Math.abs(spx[1])}px -${Math.abs(spy[1])}px ${Math.abs(shadowBlur)}px -${Math.abs(shadowSize)}px rgba(${cl[1]})`,
      `${Math.abs(spx[2])}px -${Math.abs(spy[2])}px ${Math.abs(shadowBlur)}px -${Math.abs(shadowSize)}px rgba(${cl[2]})`,
      `${Math.abs(spx[3])}px ${Math.abs(spy[3])}px ${Math.abs(shadowBlur)}px -${Math.abs(shadowSize)}px rgba(${cl[3]})`,
      `${Math.abs(spx[4])}px ${Math.abs(spy[4])}px ${Math.abs(shadowBlur)}px -${Math.abs(shadowSize)}px rgba(${cl[4]})`,
      `${Math.abs(spx[5])}px ${Math.abs(spy[5])}px ${Math.abs(shadowBlur)}px -${Math.abs(shadowSize)}px rgba(${cl[5]})`,
      `-${Math.abs(spx[6])}px ${Math.abs(spy[6])}px ${Math.abs(shadowBlur)}px -${Math.abs(shadowSize)}px rgba(${cl[6]})`,
      `-${Math.abs(spx[7])}px ${Math.abs(spy[7])}px ${Math.abs(shadowBlur)}px -${Math.abs(shadowSize)}px rgba(${cl[7]})`
    ];

    return shadow;
  }

  _applyStyles(img, index) {
    const styles = this._drawShadow(img, false);
    let styleElement = document.getElementById('_isg-style');
    let hoverStyleSheet = ``;

    if (this.config.hover === true) {
      const hoverStyles = this._drawShadow(img, true);
      hoverStyleSheet = `
        .${this.config.imgClass}._isg-${index}:hover {
          box-shadow: ${hoverStyles.join(',')};
          -webkit-box-shadow: ${hoverStyles.join(',')};
          -moz--box-shadow: ${hoverStyles.join(',')};
        }
      `;
    }

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.setAttribute('id', '_isg-style');
      document.head.appendChild(styleElement);
    }

    styleElement.innerHTML = `${styleElement.innerHTML}
      .${this.config.imgClass}._isg-${index} {
        box-shadow: ${styles.join(',')};
        -webkit-box-shadow: ${styles.join(',')};
        -moz--box-shadow: ${styles.join(',')};
        transition: .3s;
      }
      ${hoverStyleSheet}
    `;
    styleElement.innerHTML = styleElement.innerHTML.replace(/\n/g, '');
  }
  _processConfigs(config) {
    this.config = {
      offsetX: 0,
      offsetY: 50,
      imgClass: '_isg',
      shadowBlur: 40,
      hoverBlurSize: 90,
      hover: false,
      debug: false
    };

    if (config) {
      Object.keys(config).forEach((key) => {
        this.config[key] = config[key];
      })
    }

    if (this.config.debug == true) this.config.hover = true;

    this.config.offsetX = (this.config.offsetX * 30) / 100;
    this.config.offsetY = (this.config.offsetY * 30) / 100;
  }

  constructor(config) {
    this._processConfigs(config);

    let images = document.getElementsByClassName(this.config.imgClass);
    Object.keys(images).forEach((i) => {
      let img = images[i];
      img.className = img.className + ' _isg-' + i;
      if (img.tagName == 'IMG')
        img.addEventListener('load', () => { this._applyStyles(img, i) }, false);
      else if (img.tagName == 'VIDEO')
        img.ontimeupdate = () => { this._applyStyles(img, i) };
    })
  }
}
