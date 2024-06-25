<template>
  <div class="home">
    <GuitarChordSearchView></GuitarChordSearchView>
    <!-- <NotePractice></NotePractice> -->
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import GuitarChordSearchView from './GuitarChordPractice/GuitarChordSearchView.vue';
import NotePractice from './NotePractice/NotePractice.vue';

@Options({
  components: {
    GuitarChordSearchView: GuitarChordSearchView,
    NotePractice
  },
})
export default class HomeView extends Vue {
  
}
</script>
