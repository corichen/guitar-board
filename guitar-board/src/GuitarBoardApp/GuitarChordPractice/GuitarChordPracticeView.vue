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
      三和弦:<input type="checkbox" v-model.boolean="chordOptions.chord3" class="inputSpacing">
      七和弦:<input type="checkbox" v-model.boolean="chordOptions.chord7" class="inputSpacing">
      挂留和弦:<input type="checkbox" v-model.boolean="chordOptions.sus" class="inputSpacing">
      增和弦:<input type="checkbox" v-model.boolean="chordOptions.aug" class="inputSpacing">
      减和弦:<input type="checkbox" v-model.boolean="chordOptions.dim" class="inputSpacing">
      转位和弦:<input type="checkbox" v-model.boolean="chordOptions.transform" class="inputSpacing">
      根音最低品:<input type="range" v-model.number="chordOptions.rootMin" min="0" max="12" step="1" ><div style="display: inline-block;" class="inputSpacing">{{ chordOptions.rootMin }}</div>
      根音最高品:<input type="range" v-model.number="chordOptions.rootMax" min="3" max="15" step="1">{{ chordOptions.rootMax }}
    </div>
    <div style="padding:4px;margin-top:10px;border:1px dashed #000000;display:inline-block;">
      听力练习:<br>
      弹奏模式:<input v-model.number="playDelay" type="radio" name="playMode" :value="20">扫弦 <input v-model.number="playDelay" type="radio" name="playMode" :value="160">分解 <br>
      练习模式:<input v-model.number="practiceMode" type="radio" name="mode" :value="3">练习 <input v-model.number="practiceMode" type="radio" name="mode" :value="0">听级数 <input v-model.number="practiceMode" type="radio" name="mode" :value="1">听色彩 <input v-model.number="practiceMode" type="radio" name="mode" :value="2">听和弦 <br>
      <button @click="playPracticeChord()">出题</button><button style="margin-left: 10px;" @click="playLevel1()">听一级</button>
    </div><br>
    <div style="border: 1px dashed #000000;display:inline-block;margin-top:4px;">
      听力作答:<br>
      <div v-if="practiceMode == 0" style="display:flex;flex-direction: row;padding:6px;">
        <button @click="onChooseLevel(level)" v-for="level in 7" style="margin-left:4px;margin-right:4px;">{{level}}级</button>
      </div>
      <div v-if="practiceMode == 1" style="display:flex;flex-direction: row;padding:6px;">
        <button v-for="color in ['大三','小三','增三','减三','大七','小七','属七','半减七']" style="margin-left:4px;margin-right:4px;">{{color}}</button>
      </div>
    </div><br>

      <div style="margin-top: 10px;">
        <table>
          <tr v-for="level in 7">
            <td>{{level}}级</td>
            <td style="display: flex;flex-direction: row;flex-wrap:nowrap;">
              <template v-for="chord in chords.sort((a:Chord,b:Chord)=>{if(a.rootNote!=null && b.rootNote!=null)return a.rootNote.index-b.rootNote.index;return 0;})">
                <ChordView v-if="chord.levelInTone==level" :chord="chord" @chord-click="onChordClick(chord)"></ChordView>
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
import GuitarPlayer from '../GuitarPlayer/GuitarPlayer';


enum PracticeMode {
  Level,
  Color,
  Chord,
  Practive
}



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

    practiceMode : PracticeMode = PracticeMode.Level;

    guitarPlayer : GuitarPlayer = new GuitarPlayer();

    playDelay : number = 20;

    public onChooseLevel(level:number) {
      if(this.randomChord == null) {
        return;
      }
      if(this.randomChord.levelInTone == level) {
        this.changePracticeChord();  
        (this.$refs.rightAudio as any).currentTime = 0;
        (this.$refs.rightAudio as any).play();
        setTimeout(()=>{
          this.playPracticeChord();
        },1500);
      } else {
        (this.$refs.wrongAudio as any).currentTime = 0;
        (this.$refs.wrongAudio as any).play();
      }
    }

    public onChordClick(chord:Chord) {
      if(this.practiceMode == PracticeMode.Practive) {
        this.guitarPlayer.playNotes(chord.notes,this.playDelay);
        return;
      }
    }

    playLevel1() {
      let names = ["C","#C","D","bE","E","F","#F","G","bA","A","bB","B"];
      let baseName = names[this.chordOptions.baseTone];
      let chords = GuitarChordLibrary.searchChords(new RegExp(`^${baseName}$`));
      this.guitarPlayer.playNotes(chords[0].notes,this.playDelay);
    }

    private changePracticeChord() {
      let randomIndex = Math.floor(Math.random() * this.chords.length);
      this.randomChord = this.chords[randomIndex];
    }

    public playPracticeChord() {
      if(this.chords.length == 0) {
        return;
      }
      if(this.randomChord == null) {
        let randomIndex = Math.floor(Math.random() * this.chords.length);
        this.randomChord = this.chords[randomIndex]; 
      }
      this.guitarPlayer.playNotes(this.randomChord.notes,this.playDelay);
    }

    private randomChord : Chord | null = null;

    private loadChords() {
     // this.chords = GuitarChordLibrary.searchChords(new RegExp(this.keyword),false);
      let names = ["C","#C","D","bE","E","F","#F","G","bA","A","bB","B"];


      this.chords = GuitarChordLibrary.searchNaturalToneChords(names[this.chordOptions.baseTone],this.chordOptions);
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