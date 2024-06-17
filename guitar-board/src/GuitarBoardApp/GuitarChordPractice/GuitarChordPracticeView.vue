<template>
    <div>
      <GuitarBoardView ref="guitarBoardView" @note-click="onNoteClick"></GuitarBoardView>
      <div style="display: flex;flex-direction: row;flex-wrap: wrap;">
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

  
    chords : Chord[] = [];

    onNoteClick(e:NoteEvent){
     // this.guitarBoardView.setNoteStyle(NoteStyle.note_name);
      this.guitarBoardView.setFocus(true,[{str:0,index:0}]);
    }

    get guitarBoardView() : GuitarBoardView {
      return (this.$refs.guitarBoardView as GuitarBoardView);
    }

    private slideChords : boolean = false;

    private loadChords() {
      this.chords = [];
      const names = ['C',"#C","D","bE","E","F","#F","G","bA","A","bB","B"];
      for(let i = 0 ; i < chordsJason.length; ++i) {
        let chordObj = chordsJason[i];
        let slideCount = 1;
        if(this.slideChords && chordObj.slide != null && chordObj.slide > 1) {
          slideCount = chordObj.slide + 1;
        }
        let nameFromIndex = names.indexOf(chordObj.name[0]);
        for(let s = 0 ; s < slideCount; ++s){
          let chord = new Chord();
          this.chords.push(chord);
          chord.root = chordObj.root;
          chord.name = names[(nameFromIndex+s)%names.length]+chordObj.name.substring(1);
          for(let j = 0 ; j < chordObj.notes.length; ++j) {
            let ch = chordObj.notes[j];
            if(ch == 'x') {
              continue;
            }
            let loc = new Location();
            loc.str = 5-j;
            loc.index = parseInt(ch) + s;
            chord.notes.push(loc);
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