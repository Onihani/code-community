class CheckerPaint {
  // method
  paint (ctx, geom, styleMap) {
    const colors = ["#f15278", "#5b0e2d"] // #f15278 "#5b0e2d", #282f39 #dededc 
    const size = 32

    for (let y = 0; y < geom.height / size; y++) {
      for (let x = 0; x < geom.width / size; x++) {
        const color = colors[(x + y) % colors.length];
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.rect(x * size, y * size, size, size);
        ctx.fill();
      }
    }
  }
}

class DarkCheckerPaint {
  // method
  paint (ctx, geom, styleMap) {
    const colors = ["#282f39", "#dededc"] // #f15278 "#5b0e2d", #282f39 #dededc 
    const size = 32

    for (let y = 0; y < geom.height / size; y++) {
      for (let x = 0; x < geom.width / size; x++) {
        const color = colors[(x + y) % colors.length];
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.rect(x * size, y * size, size, size);
        ctx.fill();
      }
    }
  }
}

registerPaint('checker', CheckerPaint)
registerPaint('darkChecker', DarkCheckerPaint)