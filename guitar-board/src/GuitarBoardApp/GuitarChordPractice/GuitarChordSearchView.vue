<template>
    <div style="white-space: nowrap;">
      <audio ref="rightAudio" :src="require('./assets/right.wav')" volume="0.3"></audio>
      <audio ref="wrongAudio" :src="require('./assets/wrong.wav')" volume="0.3"></audio>

      <div style="border-radius: 4px; background-color: #333;display:inline-block;padding:6px 10px;">
        <div @click="optionsVisible=true" style="display: flex; flex-direction: row;align-items: center;color:white;">
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            width="17px" height="17px" viewBox="0 0 17 17" enable-background="new 0 0 17 17" xml:space="preserve">
          <path id="Path_2" fill="#fff" d="M16.4,7.37l-1.8-0.26c-0.16-0.69-0.43-1.35-0.81-1.95l1.09-1.46c0.2-0.27,0.18-0.66-0.07-0.9
            l-0.63-0.63c-0.24-0.24-0.63-0.27-0.9-0.06L11.84,3.2c-0.6-0.38-1.26-0.65-1.95-0.81l-0.26-1.8C9.58,0.25,9.28,0,8.94,0H8.06
            C7.71,0,7.42,0.25,7.37,0.59l-0.26,1.8C6.42,2.55,5.76,2.82,5.16,3.2L3.7,2.11c-0.27-0.2-0.66-0.18-0.9,0.06L2.18,2.8
            C1.93,3.05,1.91,3.43,2.11,3.7L3.2,5.16c-0.38,0.6-0.65,1.26-0.81,1.95l-1.8,0.26C0.25,7.42,0,7.71,0,8.06v0.88
            c0,0.34,0.25,0.64,0.59,0.68l1.8,0.26c0.16,0.69,0.43,1.35,0.81,1.95l-1.09,1.46c-0.2,0.27-0.18,0.66,0.07,0.9l0.63,0.63
            c0.24,0.24,0.63,0.27,0.9,0.07l1.46-1.09c0.6,0.38,1.26,0.65,1.95,0.81l0.26,1.8C7.42,16.75,7.71,17,8.06,17h0.88
            c0.34,0,0.64-0.25,0.68-0.59l0.26-1.8c0.69-0.16,1.35-0.43,1.95-0.81l1.46,1.09c0.27,0.2,0.66,0.18,0.9-0.07l0.63-0.63
            c0.24-0.24,0.27-0.63,0.07-0.9l-1.09-1.46c0.38-0.6,0.65-1.26,0.81-1.95l1.8-0.26C16.74,9.58,17,9.28,17,8.94V8.06
            C17,7.71,16.74,7.42,16.4,7.37z M8.5,12.38c-2.14,0-3.88-1.74-3.88-3.88c0-2.14,1.74-3.88,3.88-3.88c2.14,0,3.88,1.74,3.88,3.88
            C12.38,10.64,10.64,12.38,8.5,12.38L8.5,12.38z"/>
          </svg>
          <div style="margin-left: 6px;">
            选项
          </div>
        </div>
      </div>

      <div style="border-radius: 4px; background-color: #333;display:inline-block;padding:6px 10px;margin-left:8px;">
        <div @click="practiceEnable=true" style="display: flex; flex-direction: row;align-items: center;color:white;">
          <svg t="1719629105261" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1558" width="17" height="17"><path d="M920.8 600.5V491c0-55.7-11-109.8-32.7-160.9-20.9-49.3-50.9-93.6-88.9-131.6-38.1-38.1-82.4-68-131.6-88.9-51.1-21.7-105.2-32.7-160.9-32.7s-109.8 11-160.9 32.7c-49.3 20.9-93.6 50.9-131.6 88.9-38.1 38.1-68 82.4-88.9 131.6-21.9 51.1-32.9 105.2-32.9 160.9v109.5c-21.7 33.2-33.2 73.2-33.2 115.6 0 42.6 11.6 82.7 33.4 116 17.8 27.2 41.7 47.9 68.5 59.8 9.6 32.2 39.5 55.7 74.7 55.7H265c43 0 78-35 78-78v-307c0-43-35-78-78-78h-29.2c-35.2 0-65.1 23.5-74.7 55.7-4.3 1.9-8.6 4.1-12.8 6.5V491c0-48.1 9.5-94.9 28.2-139 18.1-42.6 44-81 77-113.9 33-33 71.3-58.9 113.9-77 44.1-18.7 90.9-28.2 139-28.2 48.1 0 94.9 9.5 139 28.2 42.6 18.1 81 44 113.9 77 33 33 58.9 71.3 77 113.9 18.7 44.1 28.2 90.9 28.2 139v55.8c-4.2-2.4-8.4-4.6-12.8-6.5-9.6-32.2-39.5-55.7-74.7-55.7h-29.2c-43 0-78 35-78 78v307c0 43 35 78 78 78H777c35.2 0 65.1-23.5 74.7-55.7 26.8-12 50.7-32.7 68.5-59.8 21.9-33.3 33.4-73.4 33.4-116 0.4-42.4-11.1-82.3-32.8-115.6z" fill="#fff" p-id="1559"></path></svg>
          <div style="margin-left: 6px;">
            练耳
          </div>
        </div>
      </div>
      
    
    <GuitarBoardView ref="guitarBoradView" style="margin-top: 10px;"></GuitarBoardView>
  
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

      <Dialog :visible="optionsVisible" @close="optionsVisible=false" title="选项">
        <table style="margin:20px 20px 40px 20px;">
            <tr >
              <td class="setting_title">首调</td>
              <td class="setting_row">
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
              </td>
            </tr>
            <tr>
              <td class="setting_title">顺接和弦</td>
              <td class="setting_row">
                <input type="checkbox" v-model.boolean="chordOptions.natural" class="inputSpacing"> <br>
              </td>
            </tr>
            <tr>
              <td class="setting_title">和弦类型</td>
              <td class="setting_row">
                <div class="nowrap">音程:<input type="checkbox" v-model.boolean="chordOptions.chord_2" class="inputSpacing"></div>
                <div class="nowrap">大三和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_3" class="inputSpacing"></div>
                <div class="nowrap">小三和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_m3" class="inputSpacing"></div>
                <div class="nowrap">增三和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_aug3" class="inputSpacing"></div>
                <div class="nowrap">减三和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_dim3" class="inputSpacing"></div>
                <div class="nowrap">挂二和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_sus2" class="inputSpacing"></div>
                <div class="nowrap">挂四和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_sus4" class="inputSpacing"></div>
                <div class="nowrap">大七和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_maj7" class="inputSpacing"></div>
                <div class="nowrap">小七和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_m7" class="inputSpacing"></div>
                <div class="nowrap">属七和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_7" class="inputSpacing"></div>
                <div class="nowrap">小大七和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_mM7" class="inputSpacing"></div>
                <div class="nowrap">半减七和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_m7b5" class="inputSpacing"></div>
                <div class="nowrap">减七和弦:<input type="checkbox" v-model.boolean="chordOptions.chord_dim7" class="inputSpacing"></div>
              </td>
            </tr>
            <tr v-if="chordOptions.chord_2">
              <td class="setting_title">
                音程:
              </td>
              <td class="setting_row">
                <div style="white-space:wrap;">
                  <template v-for="index in 21">
                  <div style="display:inline-block;white-space: nowrap;">
                    {{ getIntervalName(index) }}<input type="checkbox" @change="setIntervalOn(index,($event.target as any).checked)" :checked="getIntervalOn(index)" class="inputSpacing">
                  </div>
                  </template>
                </div>
              </td>
            </tr>
            <tr>
              <td class="setting_title">
              根音范围
              </td>
              <td class="setting_row">
                最低品:<input type="range" v-model.number="chordOptions.rootMin" min="0" max="12" step="1" ><div style="display: inline-block;" class="inputSpacing">{{ chordOptions.rootMin }}</div>
                最高品:<input type="range" v-model.number="chordOptions.rootMax" min="3" max="15" step="1">{{ chordOptions.rootMax }}
                <br>
                <template v-for="index in [5,4,3,2,1]">
                  根音在{{ index+1 }}弦:<input type="checkbox" @change="setRootN(index,($event.target as any).checked)" :checked="getRootN(index)"  class="inputSpacing">
                </template>
              </td>
            </tr>
            <tr>
              <td class="setting_title">弹奏模式</td>
              <td class="setting_row">
                <input v-model.number="playDelay" type="radio" name="playMode" :value="10">扫弦 <input v-model.number="playDelay" type="radio" name="playMode" :value="200">分解
              </td>
            </tr>
            <tr>
              <td class="setting_title">显示指板音</td>
              <td class="setting_row">
                <input v-model.boolean="this.naturalNotesVisible" type="checkbox">
              </td>
            </tr>
            <tr>
              <td class="setting_title">指板样式</td>
              <td class="setting_row">
                逻辑<input v-model.number="boardStyle" type="radio" name="boardStyle" :value="0"> 写实<input v-model.number="boardStyle" type="radio" name="boardStyle" :value="1">
              </td>
            </tr>
            <tr>
              <td class="setting_title">显示指法</td>
              <td class="setting_row">
                <input v-model.boolean="this.fingerVisible" type="checkbox">
              </td>
            </tr>
          </table> 
      </Dialog>

      <Dialog :title="'练耳'" :visible="practiceEnable" @close="practiceEnable=false">
        <GuitarChordPracticleView ref="p" :chords="chords"></GuitarChordPracticleView>
      </Dialog>

      <!--  -->
      

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
import GuitarChordPracticleView from "./GuitarChordPracticeView.vue";
import Dialog from "./components/Dialog.vue";

  @Options({
    components: {
      GuitarBoardView,
      ChordView,
      GuitarChordPracticleView,
      Dialog
    },
    watch:{
      chordOptions: {
        handler(newValue){
          this.loadChords();
        },
        deep:true
      },
      naturalNotesVisible(){
        this.updateNotes();
      },
      boardStyle() {
        this.guitarBoardView.setStyle(this.boardStyle);
      },
      fingerVisible(newValue) {
        this.guitarBoardView.setFingerVisible(newValue);
      }
    }
  })
  export default class GuitarChordSearchView extends Vue {
    
    practiceEnable : boolean = false;

    boardStyle : number = 0;

    naturalNotesVisible:boolean = false;

    fingerVisible: boolean = true;

    optionsVisible:boolean = false;

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

    playDelay : number = 10;

    public onChordClick(chord:Chord) {
      this.selectedChord = chord;
      this.guitarPlayer.playNotes(chord.notes,this.playDelay);
      this.updateNotes();
    }

    private loadChords() {
      let names = ["C","#C","D","bE","E","F","#F","G","bA","A","bB","B"];
      this.chords = GuitarChordLibrary.searchNaturalToneChords(names[this.chordOptions.baseTone],this.chordOptions);
      this.guitarBoardView.setTone(this.chordOptions.baseTone);
      this.updateNotes();
    }

    private updateNotes() {
      this.guitarBoardView.setVisible(false);
      this.guitarBoardView.setFocus(0);

      if(this.naturalNotesVisible){
        this.guitarBoardView.setVisible(true,this.guitarBoardView.getNaturalNotes());
      }
      if(this.selectedChord != null) {
        this.guitarBoardView.setVisible(true,this.selectedChord.notes);  
        this.guitarBoardView.setFocus(1,this.selectedChord.notes);
        let rootNote = this.selectedChord.rootNote;
        if(rootNote != null) {
          this.guitarBoardView.setFocus(2,[rootNote]);
        }
      }
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

  .setting_row {
    padding: 10px 0;
    width: 600px;
    white-space: wrap;
  }

  .setting_title {
    font-weight: bold;
    text-align: right;
    padding: 0px 10px;
  }

  .nowrap {
    white-space: nowrap;
    display: inline-block;
  }


  </style>