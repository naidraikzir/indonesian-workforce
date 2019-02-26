<template>
  <div
    class="map"
    ref="map"
  />
</template>

<script>
import mapboxgl from 'mapbox-gl';

export default {
  props: {
    center: {
      type: Object,
      default: () => ({
        latitude: 0,
        longitude: 0,
      }),
      validator: value =>
        value.hasOwnProperty('latitude') && value.hasOwnProperty('longitude'),
    },
    pitch: {
      type: Number,
      default: 0,
    },
    zoom: {
      type: Number,
      default: 3,
    },
  },

  data: () => ({
    map: null,
  }),

  mounted() {
    this.mountMap();
  },

  beforeUpdate() {
    this.destroy();
  },

  beforeDestroy() {
    this.destroy();
  },

  methods: {
    mountMap() {
      const { latitude, longitude } = this.center;
      mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
      this.map = new mapboxgl.Map({
        container: this.$refs.map,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude, latitude],
        pitch: this.pitch,
        zoom: this.zoom,
      });
      this.map.addControl(new mapboxgl.NavigationControl());
      this.addBuildingsHeight();
    },
    addBuildingsHeight() {
      this.map.on('load', () => {
        // Insert the layer beneath any symbol layer.
        const layers = this.map.getStyle().layers;

        let labelLayerId;
        for (let i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
          }
        }

        this.map.addLayer({
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa',

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height'],
            ],
            'fill-extrusion-opacity': 0.6,
          },
        }, labelLayerId);
      });
    },
    destroy() {
      this.map = this.$options.data.map;
    },
  },
};
</script>

<style lang="scss" scoped>
.map {
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
}
</style>
