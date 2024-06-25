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
      音程:<input type="checkbox" v-model.boolean="chordOptions.chord_2" class="inputSpacing">
      大三和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_3" class="inputSpacing">
      小三和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_m3" class="inputSpacing">
      增三和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_aug3" class="inputSpacing">
      减三和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_dim3" class="inputSpacing">
      挂二和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_sus2" class="inputSpacing">
      挂四和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_sus4" class="inputSpacing">
      大七和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_maj7" class="inputSpacing">
      小七和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_m7" class="inputSpacing">
      属七和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_7" class="inputSpacing">
      小大七和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_mM7" class="inputSpacing">
      半减七和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_m7b5" class="inputSpacing">
      减七和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_dim7" class="inputSpacing">

      <br>

      根音最低品:<input type="range" v-model.number="chordOptions.rootMin" min="0" max="12" step="1" ><div style="display: inline-block;" class="inputSpacing">{{ chordOptions.rootMin }}</div>
      根音最高品:<input type="range" v-model.number="chordOptions.rootMax" min="3" max="15" step="1">{{ chordOptions.rootMax }}
      <template v-for="index in [5,4,3,2,1]">
        根音在{{ index+1 }}弦:<input type="checkbox" @change="setRootN(index,($event.target as any).checked)" :checked="getRootN(index)"  class="inputSpacing">
      </template>
      <br>
      音程跨度:
      <template v-for="index in 21">
        {{ getIntervalName(index) }}<input type="checkbox" @change="setIntervalOn(index,($event.target as any).checked)" :checked="getIntervalOn(index)" class="inputSpacing">
      </template>
 
    </div>
    <div style="padding:4px;margin-top:10px;border:1px dashed #000000;display:inline-block;">
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
  export default class GuitarChordSearchView extends Vue {
    

    chords : Chord[] = [];

    selectedChord : Chord | null = null;

    chordOptions : GuitarChordSearchOptions = new GuitarChordSearchOptions();

    private getIntervalName(interval:number) {
      switch(interval){
        case 1:return "小二度";
        case 2:return "大二度";
        case 3:return "小三度";
        case 4:return "大三度";
        case 5:return "纯四度";
        case 6:return "增四度";
        case 7:return "纯五度";
        case 8:return "小六度";
        case 9:return "大六度";
        case 10:return "小七度";
        case 11:return "大七度";
        case 12:return "纯八度";
        case 13:return "小九度";
        case 14:return "大九度";
        case 15:return "小十度";
        case 16:return "大十度";
        case 17:return "纯十一度";
        case 18:return "增十一度";
        case 19:return "纯十二度";
        case 20:return "小十三度";
        case 21:return "大十三度";
      }
      return "未知音程";
    }

    private setIntervalOn(interval:number,on:boolean) {
      let oldValue = this.getIntervalOn(interval);
      if(oldValue == on) {
        return;
      }
      if(on) {
        this.chordOptions.intervals.push(interval);
      } else {
        let index = this.chordOptions.intervals.indexOf(interval);
        if(index >= 0) {
          this.chordOptions.intervals.splice(index,1);
        }
      }
    }

    private getIntervalOn(interval:number) {
      return this.chordOptions.intervals.indexOf(interval) >= 0;
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