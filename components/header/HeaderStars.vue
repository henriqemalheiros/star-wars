<template>
  <div class="relative aspect-w-1 aspect-h-1">
    <canvas
      ref="canvas"
      class="absolute block w-full h-full"
    />
  </div>
</template>

<script>
/* eslint-disable no-param-reassign */

const STARS = 1500;
const DEPTH = 1000;
const DEPTH_SENSITIVITY = 1 / DEPTH;

const mapRange = (value, x1, y1, x2, y2) => (
  (((value - x1) * (y2 - x2)) / (y1 - x1)) + x2
);

const randomPointInCircle = (radius) => {
  const r = radius * Math.sqrt(Math.random());
  const a = 2 * Math.PI * Math.random();

  return {
    x: Math.round(r * Math.cos(a)),
    y: Math.round(r * Math.sin(a)),
    z: DEPTH,
  };
};

export default {
  name: 'HeaderStars',
  mounted() {
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();

    this.animate();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    animate() {
      let prevTime;
      let stars = [];

      const { canvas } = this.$refs;
      const context = canvas.getContext('2d');

      const tick = (time) => {
        const elapsed = time - prevTime;
        prevTime = time;

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        const edge = canvas.width / 2;
        const threshold = edge * 0.75;

        if (!stars.length) {
          stars = [...new Array(STARS).keys()].map(() => ({
            ...randomPointInCircle(edge),
            z: DEPTH,
          }));
        }

        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);

        stars = stars.map((star) => {
          star.z = Math.max(0, star.z - (elapsed * 0.4));

          const x = cx + star.x / (star.z * DEPTH_SENSITIVITY);
          const y = cy + star.y / (star.z * DEPTH_SENSITIVITY);

          const distanceFromCenter = Math.sqrt((cx - x) * (cx - x) + (cy - y) * (cy - y));

          const thresholdFadeout = distanceFromCenter > threshold ? mapRange(distanceFromCenter - threshold, 0, edge - threshold, 0, 1) : 0;
          const depthFadeout = star.z / DEPTH;

          const brightness = 255 * Math.max(0, 1 - thresholdFadeout - (depthFadeout * depthFadeout));

          context.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
          context.fillRect(x, y, 1, 1);

          if (distanceFromCenter > edge) {
            return {
              ...randomPointInCircle(edge),
              z: DEPTH,
            };
          }

          return star;
        });

        requestAnimationFrame(tick);
      };

      requestAnimationFrame((time) => {
        prevTime = time;
        requestAnimationFrame(tick);
      });
    },
    onWindowResize() {
      const { width, height } = this.$el.getBoundingClientRect();

      this.$refs.canvas.width = width;
      this.$refs.canvas.height = height;
    },
  },
};
</script>
