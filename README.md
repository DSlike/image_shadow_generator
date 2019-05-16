# image_shadow_generator
An plugin for automatically generate box-shadow for image based on image colors.

![Demo GIF](https://raw.githubusercontent.com/DSlike/image_shadow_generator/master/demo.gif "Example image")

### Usage:
 - Connect script file to your page
 - Initialize plugin
 ```javascript  
 const _isg = new ImageShadowGenerator()
 ```
 - Enjoy!

### Initialize Example
```javascript
  const _isg = new ImageShadowGenerator({
    imgClass: 'myImageClass',
    offsetX: 10
  })
```

### Configs

| Setting | Description | Default |
---|---|---|
offsetX| Offset for x coordinate of shadow in percents | 0 |
offsetY| Offset for y coordinate of shadow in percents | 0 |
imgClass | className of img elements which need to be glowed | _isg |
