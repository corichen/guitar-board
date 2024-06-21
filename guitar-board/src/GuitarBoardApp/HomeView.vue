<template>
  <div class="home">
    <GuitarChordPracticeView></GuitarChordPracticeView>
    <!-- <NotePractice></NotePractice> -->
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import GuitarChordPracticeView from './GuitarChordPractice/GuitarChordPracticeView.vue';
import NotePractice from './NotePractice/NotePractice.vue';

@Options({
  components: {
    GuitarChordPracticeView,
    NotePractice
  },
})
export default class HomeView extends Vue {
  
}
</script>
