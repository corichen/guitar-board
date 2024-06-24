<template>
    <div style="white-space: nowrap;">
      <audio ref="rightAudio" :src="require('./assets/right.wav')" volume="0.3"></audio>
      <audio ref="wrongAudio" :src="require('./assets/wrong.wav')" volume="0.3"></audio>
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
      音程:<input type="checkbox" v-model.boolean="chordOptions.chord2" class="inputSpacing">
      三和弦:<input type="checkbox" v-model.boolean="chordOptions.chord3" class="inputSpacing">
      七和弦:<input type="checkbox" v-model.boolean="chordOptions.chord7" class="inputSpacing">
      挂留和弦:<input type="checkbox" v-model.boolean="chordOptions.sus" class="inputSpacing">
      增和弦:<input type="checkbox" v-model.boolean="chordOptions.aug" class="inputSpacing">
      减和弦:<input type="checkbox" v-model.boolean="chordOptions.dim" class="inputSpacing">
      转位和弦:<input type="checkbox" v-model.boolean="chordOptions.transform" class="inputSpacing"><br>
      根音最低品:<input type="range" v-model.number="chordOptions.rootMin" min="0" max="12" step="1" ><div style="display: inline-block;" class="inputSpacing">{{ chordOptions.rootMin }}</div>
      根音最高品:<input type="range" v-model.number="chordOptions.rootMax" min="3" max="15" step="1">{{ chordOptions.rootMax }}
      根音在6弦:<input type="checkbox" v-model.boolean="root5" class="inputSpacing">
      根音在5弦:<input type="checkbox" v-model.boolean="root4" class="inputSpacing">
      根音在4弦:<input type="checkbox" v-model.boolean="root3" class="inputSpacing">
      根音在3弦:<input type="checkbox" v-model.boolean="root2" class="inputSpacing">
      根音在2弦:<input type="checkbox" v-model.boolean="root1" class="inputSpacing">
    </div>
    <div style="padding:4px;margin-top:10px;border:1px dashed #000000;display:inline-block;">
      乐器:<input v-model.number="playDelay" type="radio" name="instrument" :value="1">钢琴 <input v-model.number="playDelay" type="radio" name="instrument" :value="2">吉他 <br>

      弹奏模式:<input v-model.number="playDelay" type="radio" name="playMode" :value="0">扫弦 <input v-model.number="playDelay" type="radio" name="playMode" :value="200">分解 <br>
    </div><br>
    <GuitarBoardView ref="guitarBoradView"></GuitarBoardView>
  
      <div style="margin-top: 10px;">
        <table>
          <tr v-for="level in 7">
            <td>{{level}}级</td>
            <td style="display: flex;flex-direction: row;flex-wrap:nowrap;">
              <template v-for="chord in chords.sort((a:Chord,b:Chord)=>{if(a.rootNote!=null && b.rootNote!=null)return a.rootNote.index-b.rootNote.index;return 0;})">
                <ChordView v-if="chord.levelInTone==level" :chord="chord" @chord-click="onChordClick(chord)" :style="{border:chord==this.selectedChord?'1px dashed #000':'none'}" ></ChordView>
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
import GuitarChordLibrary from "../GuitarChord/GuitarChordLibrary";
import Location from '../GuitarPlayer/Location';  
import Tone from '../GuitarPlayer/Tone';
import GuitarPlayer from '../GuitarPlayer/GuitarPlayer';
import GuitarChordSearchOptions from '../GuitarChord/GuitarChordSearchOptions';
import Instrument from '../GuitarPlayer/Instrument';


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
      }
    }
  })
  export default class GuitarChordPracticeView extends Vue {
    

    _instrument : Instrument = Instrument.Guitar;

    chords : Chord[] = [];

    selectedChord : Chord | null = null;

    chordOptions : GuitarChordSearchOptions = {
      baseTone: Tone.C,
      natural: false,
      chord2:true,
      chord3:false,
      chord7:false,
      sus:false,
      aug:false,
      dim:false,
      transform:false,
      roots:[5],
      rootMin:0,
      rootMax:15
    }

    set instrument(instrument:Instrument) {
      this._instrument = instrument;
      this.guitarPlayer.changeInstrument(instrument);
    }

    get instrument() {
      return this._instrument;
    }

    get root5(){
      return this.getRootN(5);
    }

    set root5(root) {
      this.setRootN(5,root);
    }

    get root4(){
      return this.getRootN(4);
    }

    set root4(root) {
      this.setRootN(4,root);
    }

    get root3(){
      return this.getRootN(3);
    }

    set root3(root) {
      this.setRootN(3,root);
    }

    get root2(){
      return this.getRootN(2);
    }

    set root2(root) {
      this.setRootN(2,root);
    }

    get root1(){
      return this.getRootN(1);
    }

    set root1(root) {
      this.setRootN(1,root);
    }

    private setRootN(n:number,root:boolean) {
      let oldValue = this.getRootN(n);
      if(oldValue == root) {
        return;
      }
      if(root) {
        this.chordOptions.roots.push(n);
      } else {
        let index = this.chordOptions.roots.indexOf(n);
        if(index >= 0) {
          this.chordOptions.roots.splice(index,1);
        }
      }
    }

    private getRootN(n:number) {
      return this.chordOptions.roots.indexOf(n) >= 0;
    }

    guitarPlayer : GuitarPlayer = new GuitarPlayer();

    playDelay : number = 0;

    public onChordClick(chord:Chord) {
      this.selectedChord = chord;
      this.guitarPlayer.playNotes(chord.notes,this.playDelay);
      this.guitarBoardView.setVisible(false);
      this.guitarBoardView.setVisible(true,this.guitarBoardView.getNaturalNotes());
      this.guitarBoardView.setVisible(true,chord.notes);
      this.guitarBoardView.setFocus(false);
      this.guitarBoardView.setFocus(true,chord.notes);
    }

    private loadChords() {
      let names = ["C","#C","D","bE","E","F","#F","G","bA","A","bB","B"];
      this.chords = GuitarChordLibrary.searchNaturalToneChords(names[this.chordOptions.baseTone],this.chordOptions);
      this.guitarBoardView.setTone(this.chordOptions.baseTone);
      this.guitarBoardView.setVisible(false);
      this.guitarBoardView.setVisible(true,this.guitarBoardView.getNaturalNotes());
      this.guitarBoardView.setFocus(false);
    }

    get guitarBoardView() {
      return this.$refs.guitarBoradView as GuitarBoardView;
    }

    mounted() {
      this.loadChords();
      (window as any)["a"] = this;
    }
  }
  
  </script>
  
  <style scoped>
  .inputSpacing {
    margin-right: 12px;
  }
  </style>