<template>
    <div>
      <GuitarBoardView></GuitarBoardView>
    </div>
</template>
  
  <script lang="ts">
  import {Options, Vue} from 'vue-class-component';
import GuitarPlayer from './GuitarPlayer/GuitarPlayer';
import GuitarBoardView from './components/GuitarBoardView.vue';
  
  @Options({
    components: {
      GuitarBoardView
    }
  })
  export default class GuitarBoardPracticeView extends Vue {
    guitarPlayer : GuitarPlayer = new GuitarPlayer();

    mounted() {
      this.guitarPlayer.playNote(0,0);
      this.guitarPlayer.playNote(1,0);
      this.guitarPlayer.playNote(2,0);
    }
  }
  
  </script>
  
  <style scoped>
  
  </style>