<template>
    <div>
      <GuitarBoardView ref="guitarBoardView" @note-click="onNoteClick"></GuitarBoardView>
      <input v-model="keyword">
      <div style="display: flex;flex-direction: row;flex-wrap: wrap;margin-top: 10px;">
        <template v-for="chord in chords">
          <ChordView :chord="chord"></ChordView>
        </template>
      </div>
      
    </div>
</template>
  
  <script lang="ts">
  import {Options, Vue} from 'vue-class-component';
import GuitarBoardView from '../GuitarBoard/GuitarBoardView.vue';
import NoteEvent from '../GuitarBoard/NoteEvent';
import ChordView from '../GuitarChord/ChordView.vue';
import Chord from '../GuitarChord/Chord';
import GuitarChordLibrary from "./GuitarChordLibrary";
import Location from '../GuitarPlayer/Location';  
import Tone from '../GuitarBoard/Tone';

  @Options({
    components: {
      GuitarBoardView,
      ChordView
    }
  })
  export default class GuitarChordPracticeView extends Vue {
    _keyword : string = "";

    set keyword(keyword) {
      this._keyword = keyword;
      this.loadChords();
    }

    get keyword() {
      return this._keyword;
    }
  
    chords : Chord[] = [];

    onNoteClick(e:NoteEvent){
     // this.guitarBoardView.setNoteStyle(NoteStyle.note_name);
      this.guitarBoardView.setFocus(true,[{str:0,index:0}]);
    }

    get guitarBoardView() : GuitarBoardView {
      return (this.$refs.guitarBoardView as GuitarBoardView);
    }

    private loadChords() {
      //this.chords = GuitarChordLibrary.searchChords(new RegExp(this.keyword),false);
      let tone = ["C","#C","D","bE","E","F","#F","G","bA","A","bB","B"].indexOf(this.keyword);
      this.chords = GuitarChordLibrary.searchNaturalToneChords(this.keyword,tone);
    }

    mounted() {
      this.loadChords();
    }
  }
  
  </script>
  
  <style scoped>
  
  </style>