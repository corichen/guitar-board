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
import chordsJason from "./GuitarChordLibrary";
import Location from '../GuitarPlayer/Location';  

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

    private slideChords : boolean = true;

    private loadChords() {

      let matchReg = new RegExp(this.keyword);

      this.chords = [];
      const names = ['C',"#C","D","bE","E","F","#F","G","bA","A","bB","B"];
      for(let i = 0 ; i < chordsJason.length; ++i) {
        let chordObj = chordsJason[i];
        let slideCount = 1;
        let slideFrom = 0;
        if(this.slideChords) {
          if(chordObj.slide != null && chordObj.slide > 1){
            slideCount = chordObj.slide + 1;
          }
          if(chordObj.slideFrom != null) {
            slideFrom = chordObj.slideFrom;
          }
        }
        let nameFromIndex = names.indexOf(chordObj.name[0]);
        for(let s = slideFrom ; s < slideCount; ++s){
          let chord = new Chord();
          chord.root = chordObj.root;
          chord.name = names[(nameFromIndex+s+names.length)%names.length]+chordObj.name.substring(1);
          for(let j = 0 ; j < chordObj.notes.length; ++j) {
            let ch = chordObj.notes[j];
            if(ch == 'x') {
              continue;
            }
            let loc = new Location();
            loc.str = 5-j;
            if(ch.charCodeAt(0) > 60) {
              loc.index = ch.charCodeAt(0) - 96 + 9 + s;
            } else {
              loc.index = parseInt(ch) + s;
            }
            chord.notes.push(loc);
          }

          if(matchReg.test(chord.name)){
            this.chords.push(chord);
          }
        }

      }
    }


    mounted() {
      this.loadChords();
    }
  }
  
  </script>
  
  <style scoped>
  
  </style>