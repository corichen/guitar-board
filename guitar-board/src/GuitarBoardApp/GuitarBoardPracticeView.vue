<template>
    <div>
      <GuitarBoardView ref="guitarBoardView" @note-click="onNoteClick"></GuitarBoardView>
    </div>
</template>
  
  <script lang="ts">
  import {Options, Vue} from 'vue-class-component';
import GuitarBoardView from './GuitarBoardView/GuitarBoardView.vue';
import NoteEvent from './GuitarBoardView/NoteEvent';
  

  @Options({
    components: {
      GuitarBoardView
    }
  })
  export default class GuitarBoardPracticeView extends Vue {
    onNoteClick(e:NoteEvent){
     // this.guitarBoardView.setNoteStyle(NoteStyle.note_name);
      this.guitarBoardView.setFocus(true,[{str:0,index:0}]);
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