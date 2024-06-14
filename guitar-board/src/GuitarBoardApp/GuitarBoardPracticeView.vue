<template>
    <div>
      <GuitarBoardView ref="guitarBoardView" @note-click="onNoteClick"></GuitarBoardView>
    </div>
</template>
  
  <script lang="ts">
  import {Options, Vue} from 'vue-class-component';
import GuitarPlayer from './GuitarPlayer/GuitarPlayer';
import GuitarBoardView from './GuitarBoardView/GuitarBoardView.vue';
import NoteEvent from './GuitarBoardView/NoteEvent';
import Tone from './GuitarBoardView/Tone';
import NoteStyle from './GuitarBoardView/NoteStyle';
  

  @Options({
    components: {
      GuitarBoardView
    }
  })
  export default class GuitarBoardPracticeView extends Vue {
    guitarPlayer : GuitarPlayer = new GuitarPlayer();

    onNoteClick(e:NoteEvent){
      this.guitarBoardView.setNoteStyle(NoteStyle.note_name);

    }

    get guitarBoardView() : GuitarBoardView {
      return (this.$refs.guitarBoardView as GuitarBoardView);
    }

    mounted() {
      
    }
  }
  
  </script>
  
  <style scoped>
  
  </style>