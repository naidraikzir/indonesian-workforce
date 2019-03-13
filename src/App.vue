<template>
  <div>
    <h4>Persentase Tenaga Kerja Formal 2015 - 2018 Per Provinsi</h4>
    <Map :loadCallback="onMapLoad" />
    <select v-model="selectedYear">
      <option
        v-for="(year, y) of years"
        :key="y"
        :value="year"
      >
        Tahun {{ year }}
      </option>
    </select>
    <div
      class="loader"
      v-if="isLoading"
    >
      <ball-scale-multiple-loader
        size="10em"
        color="rgba(255, 255, 255, 0.75)"
      />
    </div>
  </div>
</template>

<script>
import Papa from 'papaparse';
import 'vue-loaders/dist/vue-loaders.css';
import { BallScaleMultipleLoader } from 'vue-loaders';
import Map from '@/components/Map';
import workforce from '@/assets/workforce.csv';

const GEOJSON = 'https://raw.githubusercontent.com/ans-4175/peta-indonesia-geojson/master/indonesia-prov.geojson';
const LAYERID = 'province-extrusion';

export default {
  name: 'app',

  components: {
    Map,
    BallScaleMultipleLoader,
  },

  data: () => ({
    years: [
      '2015',
      '2016',
      '2017',
      '2018',
    ],
    selectedYear: '2018',
    geo: {},
    data: [],
    mapLoaded: false,
    dataBuilt: false,
    isLoading: true,
  }),

  computed: {
    readyToDraw() {
      return this.mapLoaded && this.dataBuilt;
    },
  },

  watch: {
    readyToDraw(val) {
      if (val) {
        this.isLoading = false;
        this.flyTo(this.addExtrusions);
      }
    },
    selectedYear(val) {
      this.map.setPaintProperty(
        LAYERID,
        'fill-extrusion-color',
        [
          'rgb',
          ['-', 255, ['*', 255, ['/', ['get', val], 100]]],
          ['*', 255, ['/', ['get', val], 100]],
          0,
        ],
      );
      this.map.setPaintProperty(
        LAYERID,
        'fill-extrusion-height',
        ['*', 2500, ['get', val]],
      );
    },
  },

  async mounted() {
    await this.getGeo();
    this.getData();
  },

  methods: {
    async getGeo() {
      const res = await fetch(GEOJSON);
      this.geo = await res.json();
    },
    getData() {
      Papa.parse(`${location.origin}${workforce}`, {
        download: true,
        dynamicTyping: true,
        header: true,
        complete: ({ data }) => {
          this.data = data.filter(
            row => this.years.every(
              year => Object.keys(row).includes(year),
            ),
          );
          this.geo.features.map(feature => {
            this.data.map(row => {
              if (row.Provinsi === feature.properties.Propinsi) {
                const { Provinsi, ...yearsData } = row;
                feature.properties = {
                  ...feature.properties,
                  ...yearsData,
                };
              }
            });
            return feature;
          });
          this.dataBuilt = true;
        },
      });
    },
    onMapLoad(map) {
      this.map = map;
      this.mapLoaded = true;
    },
    flyTo(callback) {
      this.map.on('moveend', callback);
      this.map.flyTo({
        center: {
          lat: -1,
          lon: 119,
        },
        pitch: 45,
        zoom: 4.5,
        easing: t => t < 0.5
          ? 8 * t * t * t * t
          : 1 - 8 * (--t) * t *  t * t,
      });
    },
    addExtrusions() {
      this.map.addLayer({
        id: LAYERID,
        type: 'fill-extrusion',
        source: {
          type: 'geojson',
          data: this.geo,
        },
        paint: {
          'fill-extrusion-color': [
            'rgb',
            ['-', 255, ['*', 255, ['/', ['get', this.selectedYear], 100]]],
            ['*', 255, ['/', ['get', this.selectedYear], 100]],
            0,
          ],
          'fill-extrusion-height': ['*', 2500, ['get', this.selectedYear]],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.9,
        },
      });
    },
  },
};
</script>

<style lang="scss">
html {
  box-sizing: border-box;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

h4 {
  position: fixed;
  left: 50%;
  top: 1em;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.9);
  color: #555;
  font-weight: bold;
  border-radius: 0.5em;
  box-shadow: 0 0.25em 1em -0.25em rgba(0, 0, 0, 0.5);
  padding: 0.5em 1em;
  z-index: 1;
}

select {
  position: fixed;
  left: 50%;
  bottom: 1em;
  z-index: 1;
  box-shadow: 0 0.25em 1em -0.25em rgba(0, 0, 0, 0.5);
  border: 0;
  font-size: 1em;
  transform: translateX(-50%);
}

.loader {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
