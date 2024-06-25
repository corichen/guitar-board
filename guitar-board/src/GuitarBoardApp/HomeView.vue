<template>
  <div class="home">
    <GuitarChordSearchView></GuitarChordSearchView>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import GuitarChordSearchView from './GuitarChordPractice/GuitarChordSearchView.vue';

@Options({
  components: {
    GuitarChordSearchView: GuitarChordSearchView
  },
})
export default class HomeView extends Vue {
  
}
</script>
