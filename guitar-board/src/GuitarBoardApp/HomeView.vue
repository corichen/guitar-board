<template>
  <div class="home">
    <GuitarBoardPracticeView></GuitarBoardPracticeView>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import GuitarBoardPracticeView from './GuitarBoardPracticeView.vue';

@Options({
  components: {
    GuitarBoardPracticeView
  },
})
export default class HomeView extends Vue {
  
}
</script>
