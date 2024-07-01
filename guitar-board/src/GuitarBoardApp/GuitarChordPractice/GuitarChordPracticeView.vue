<template>
  <div style="background-color: white;padding:20px 20px;display:flex;flex-direction:column;width:600px;">
    <div style="font-weight: bold;font-size: 18px;">请选择你所听到和弦的级数和{{isChord2?'音程':'色彩'}}?</div>
    <audio ref="rightSound" :src="require('./assets/right.wav')"/>
    <audio ref="wrongSound" :src="require('./assets/wrong.wav')"/> 
    <table style="margin-top:10px;">
      <tr>
        <td><label style="font-weight: bold;">级数:</label></td>
        <td>
          <div style="white-space: wrap;">
            <div v-for="level in levelOptions" style="display:inline-block;white-space: nowrap;">
              {{ level.name }}级<input type="radio" name="level" @click="answer_level=level.index" :checked="answer_level==level.index" style="margin-right: 15px;">
            </div>
          </div>
         
        </td>
        <td>
          <img v-if="answer_level_result" style="width:32px;height:32px;" :src="require('./assets/right.svg')">
          <img v-if="answer_level_result!=null&&!answer_level_result" style="width:32px;height:32px;" :src="require('./assets/wrong.svg')">
        </td>
      </tr>
      <tr v-if="isChord2">
        <td><label style="font-weight: bold;">音程:</label></td>
        <td>
          <div style="display: inline-block;white-space:wrap;margin-top:10px;">
            <div v-for="item in intervalOptions" style="display:inline-block;white-space:nowrap;">
              {{ item.name }}<input type="radio" name="interval" @click="answer_interval=item.interval" @checked="answer_interval==item.interval" :value="item.interval" style="margin-right: 10px;">
            </div>
          </div>
        </td>
        <td>
          <img v-if="answer_interval_result" style="width:32px;height:32px;" :src="require('./assets/right.svg')">
          <img v-if="answer_interval_result!=null&&!answer_interval_result" style="width:32px;height:32px;" :src="require('./assets/wrong.svg')">
        </td>
      </tr>
      <tr v-else>
        <td><label style="font-weight: bold;">色彩:</label></td>
        <td>
          <div style="white-space: wrap;">
            <div v-for="item in colorOptions" style="display:inline-block;white-space:nowrap;">
              {{ item }}<input type="radio" name="color" @click="answer_color=item" :checked="answer_color==item" :value="item" style="margin-right: 15px;">
            </div>
          </div>
        </td>
        <td>
          <img v-if="answer_color_result" style="width:32px;height:32px;" :src="require('./assets/right.svg')">
          <img v-if="answer_color_result!=null&&!answer_color_result" style="width:32px;height:32px;" :src="require('./assets/wrong.svg')">
        </td>
      </tr>
    </table>

    <div style="display:flex;flex-direction: row;justify-content:end;margin:10px 0px 10px 0px;">
      <button @click="onPlayDo()">听do</button>
      <button @click="onReplay()">重听</button>
      <button v-if="confirm_visible" @click="onConfirm()">确定</button>
      <button v-if="next_visible" @click="onNext()">下一题</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Chord from '../GuitarChord/Chord';
import GuitarPlayer from '../GuitarPlayer/GuitarPlayer';

@Options({
  components: {
  },
  props: ["chords"]
})
export default class GuitarChordPracticeView extends Vue {
  mounted() { 
    this.onNext();
  }

  async onPlayDo() {
    if(this.currentChord == null || this.currentChord.tone == null) {
      return;
    }
    let toneNote = GuitarPlayer.getToneNote(this.currentChord.tone);
    GuitarChordPracticeView.guitarPlayer.playNote(toneNote.str,toneNote.index);
  }

  async onReplay() {
    if(this.currentChord == null || this.currentChord.tone == null) {
      return;
    }
    GuitarChordPracticeView.guitarPlayer.playNotes(this.currentChord.notes,20);
  }

  onConfirm() {
    if(this.currentChord == null) {
      return;
    }
    let fullRight = true;
    this.answer_level_result = this.answer_level == this.currentChord.indexInTone;
    if(!this.answer_level_result) {
      fullRight = false;
    }
    if(this.isChord2) {
      this.answer_interval_result = this.answer_interval == this.currentChord.interval;
      if(!this.answer_interval_result) {
        fullRight = false;
      }
    } else {
      this.answer_color_result = this.answer_color == null ? false : this.currentChord.isColor(this.answer_color);
      if(!this.answer_color_result) {
        fullRight = false;
      }
    }

    if(fullRight) {
      this.playRightSound();
      this.confirm_visible = false;
      this.next_visible = true;
    } else {
      this.playWrongSound();
    }
  }

  onNext() {
    this.confirm_visible = true;
    this.next_visible = false;
    this.answer_level_result = null;
    this.answer_color_result = null;
    this.answer_interval_result = null;
    this.answer_color = null;
    this.answer_interval = null;
    this.answer_level = null;
    this._currentIndex = Math.floor(Math.random()*this.allChords.length);

    this.onReplay();
  }

  playRightSound() {
    (this.$refs.rightSound as any).currentTime = 0;
    (this.$refs.rightSound as any).play();
  }

  playWrongSound() {
    (this.$refs.wrongSound as any).currentTime = 0;
    (this.$refs.wrongSound as any).play();
  }


  confirm_visible : boolean = true;
  next_visible : boolean = false;


  static guitarPlayer = new GuitarPlayer();

  answer_level : number|null = null;
  answer_color : string|null = null;
  answer_interval : number|null = null;

  answer_level_result : boolean | null = null;
  answer_color_result : boolean | null = null;
  answer_interval_result : boolean | null = null;

  get intervalOptions() {
    let intervalSet = new Set<number>();
    for(let i = 0 ; i < this.allChords.length; ++i) {
      intervalSet.add(this.allChords[i].interval);
    }
    let intervals = Array.from(intervalSet);

    let options = [];
    for(let i = 0 ; i < intervals.length; ++i) {
      options.push({
        interval : intervals[i],
        name: Chord.getIntervalName(intervals[i])
      });
    }
    return options; 
  }

  get colorOptions() {
    let set = new Set();
    for(let i = 0 ; i < this.allChords.length; ++i) {
      set.add(this.allChords[i].color);
    }
    return set;
  }

  get levelOptions() {
    let set = new Set();
    for(let i = 0 ; i < this.allChords.length; ++i) {
      set.add(this.allChords[i].indexInTone);
    }
    let names = ["1","#1","2","b3","3","4","#4","5","b6","6","b7","7"];
    let indexes = Array.from(set) as number[];
    let levelOptions = [];
    for(let i = 0 ; i < indexes.length; ++i) {
      levelOptions.push({
        name : names[indexes[i]%12],
        index : indexes[i]
      })
    }
    levelOptions.sort((left:{name:string,index:number},right:{name:string,index:number})=>{
      return left.index - right.index;
    })
    return levelOptions;
    
  }

  _currentIndex : number = 0;
  
  get allChords() {
    return  ((this as any).chords as Chord[]);
  }

  get currentChord() {
    if(this.allChords == null) {
      return null;
    }
    if(this._currentIndex < 0 || this._currentIndex > this.allChords.length - 1) {
      return null;
    }
    return this.allChords[this._currentIndex];
  }

  get isChord2() {
    if(this.currentChord == null) {
      return false;
    }
    return this.currentChord.isChord_2;
  }
}
</script>

<style scoped>

button {
  margin: 0px 3px;
}

</style>