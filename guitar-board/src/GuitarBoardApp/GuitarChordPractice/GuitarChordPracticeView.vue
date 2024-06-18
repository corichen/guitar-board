<template>
    <div style="white-space: nowrap;">
      <div >
      选调:
      <select v-model="chordOptions.baseTone" class="inputSpacing">
        <option value="0">C</option>
        <option value="1">#C</option>
        <option value="2">D</option>
        <option value="3">bE</option>
        <option value="4">E</option>
        <option value="5">F</option>
        <option value="6">#F</option>
        <option value="7">G</option>
        <option value="8">bA</option>
        <option value="9">A</option>
        <option value="10">bB</option>
        <option value="11">B</option>
      </select>
      顺阶和弦:<input type="checkbox" v-model.boolean="chordOptions.natural" class="inputSpacing">
      三和弦:<input type="checkbox" v-model.boolean="chordOptions.chord3" class="inputSpacing">
      七和弦:<input type="checkbox" v-model.boolean="chordOptions.chord7" class="inputSpacing">
      挂留和弦:<input type="checkbox" v-model.boolean="chordOptions.sus" class="inputSpacing">
      增和弦:<input type="checkbox" v-model.boolean="chordOptions.aug" class="inputSpacing">
      减和弦:<input type="checkbox" v-model.boolean="chordOptions.dim" class="inputSpacing">
      转位和弦:<input type="checkbox" v-model.boolean="chordOptions.transform" class="inputSpacing">
      根音最低品:<input type="range" v-model.number="chordOptions.rootMin" min="0" max="12" step="1" ><div style="display: inline-block;" class="inputSpacing">{{ chordOptions.rootMin }}</div>
      根音最高品:<input type="range" v-model.number="chordOptions.rootMax" min="3" max="15" step="1">{{ chordOptions.rootMax }}
    </div>
      <div style="margin-top: 10px;">
        <table>
          <tr v-for="level in 7">
            <td>{{level}}级</td>
            <td style="display: flex;flex-direction: row;flex-wrap:nowrap;">
              <template v-for="chord in chords.sort((a:Chord,b:Chord)=>{if(a.rootNote!=null && b.rootNote!=null)return a.rootNote.index-b.rootNote.index;return 0;})">
                <ChordView v-if="chord.levelInTone==level" :chord="chord"></ChordView>
              </template>
            </td>
          </tr>
        </table>
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
    },
    watch:{
      chordOptions: {
        handler(newValue){
          this.loadChords();
        },
        deep:true
      },
      searchTone(){
        this.loadChords();
      },
      showNumberName(){
        this.loadChords();
      }
    }
  })
  export default class GuitarChordPracticeView extends Vue {
    
    chords : Chord[] = [];

    chordOptions = {
      baseTone: Tone.C,
      natural: true,
      chord3:true,
      chord7:true,
      sus:true,
      aug:true,
      dim:true,
      transform:true,
      rootMin:0,
      rootMax:15
    }


    private loadChords() {
     // this.chords = GuitarChordLibrary.searchChords(new RegExp(this.keyword),false);
      let names = ["C","#C","D","bE","E","F","#F","G","bA","A","bB","B"];


      this.chords = GuitarChordLibrary.searchNaturalToneChords(names[this.chordOptions.baseTone],this.chordOptions);
    }

    mounted() {
      this.loadChords();
    }
  }
  
  </script>
  
  <style scoped>
  .inputSpacing {
    margin-right: 12px;
  }
  </style>