<template>
  <div class="home">
    <GuitarChordPracticeView></GuitarChordPracticeView>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import GuitarChordPracticeView from './GuitarChordPractice/GuitarChordPracticeView.vue';

@Options({
  components: {
    GuitarChordPracticeView
  },
})
export default class HomeView extends Vue {
  
}
</script>
