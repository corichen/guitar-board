<template>
  <div style="background-color: white;padding:20px 20px;display:flex;flex-direction:column;width:600px;">
    <div style="font-weight: bold;font-size: 18px;">请选择你所听到和弦的级数和{{isChord2?'音程':'色彩'}}?</div>
    <audio ref="rightSound" :src="require('./assets/right.wav')"/>
    <audio ref="wrongSound" :src="require('./assets/wrong.wav')"/> 
    <table style="margin-top:10px;">
      <tr v-if="typeProp&(1<<0)">
        <td class="itemTitle"><label style="font-weight: bold;">级数:</label></td>
        <td>
          <Selector :selected="answer_level_index!=null?(1<<answer_level_index):0" @select="this.answer_level_index=$event.options[0]" :mutiple="false" :options="levelOptions.map(item=>item.name)"></Selector>
        </td>
        <td>
          <img v-if="answer_level_result" style="width:32px;height:32px;" :src="require('./assets/right.svg')">
          <img v-if="answer_level_result!=null&&!answer_level_result" style="width:32px;height:32px;" :src="require('./assets/wrong.svg')">
        </td>
      </tr>
      <tr v-if="isChord2 && (typeProp&(1<<1))">
        <td class="itemTitle"><label style="font-weight: bold;">音程:</label></td>
        <td>
          <Selector :selected="answer_interval_index!=null?(1<<answer_interval_index):0" @select="answer_interval_index=$event.options[0]" :mutiple="false" :options="intervalOptions.map(item=>item.name)"></Selector>
        </td>
        <td>
          <img v-if="answer_interval_result" style="width:32px;height:32px;" :src="require('./assets/right.svg')">
          <img v-if="answer_interval_result!=null&&!answer_interval_result" style="width:32px;height:32px;" :src="require('./assets/wrong.svg')">
        </td>
      </tr>
      <tr v-else-if="typeProp&(1<<2)">
        <td class="itemTitle"><label style="font-weight: bold;">色彩:</label></td>
        <td>
          <Selector :mutiple="false" @select="answer_type_index=$event.options[0]" :selected="answer_type_index!=null?(1<<answer_type_index):0" :options="typeOptions.map(item=>item.name)"></Selector>
        </td>
        <td>
          <img v-if="answer_type_result" style="width:32px;height:32px;" :src="require('./assets/right.svg')">
          <img v-if="answer_type_result!=null&&!answer_type_result" style="width:32px;height:32px;" :src="require('./assets/wrong.svg')">
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
import ChordType from '../GuitarChord/ChordType';
import Selector from './components/Selector.vue';
import PracticeType from './PracticeType';

@Options({
  components: {
    Selector
  },
  props: ["chords","playDelay","type"]
})
export default class GuitarChordPracticeView extends Vue {
  mounted() { 
    this.onNext();
  }

  get typeProp() {
    return (this as any).type as PracticeType;
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
    GuitarChordPracticeView.guitarPlayer.playNotes(this.currentChord.notes,(this as any).playDelay);
  }

  onConfirm() {
    if(this.currentChord == null) {
      return;
    }
    let fullRight = true;
    if(this.typeProp & (1<<PracticeType.level)) {
      this.answer_level_result = this.answer_level == this.currentChord.indexInTone;
      if(!this.answer_level_result) {
        fullRight = false;
      }
    } 
    if(this.isChord2) {
      if(this.typeProp & (1<<PracticeType.interval)) {
        this.answer_interval_result = this.answer_interval == this.currentChord.interval;
        if(!this.answer_interval_result) {
          fullRight = false;
        }
      }
    } else {
      if(this.typeProp & (1<<PracticeType.color)) {
        this.answer_type_result = this.answer_type == null ? false : this.currentChord.isType(this.answer_type);
        if(!this.answer_type_result) {
          fullRight = false;
        }
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
    this.answer_type_result = null;
    this.answer_interval_result = null;
    this.answer_type_index = null;
    this.answer_interval_index = null;
    this.answer_level_index = null;
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

  answer_level_index : number|null = null;
  answer_type_index : number|null = null;
  answer_interval_index : number|null = null;

  answer_level_result : boolean | null = null;
  answer_type_result : boolean | null = null;
  answer_interval_result : boolean | null = null;

  get answer_level() {
    if(this.answer_level_index == null) {
      return null;
    }
    return this.levelOptions[this.answer_level_index].index;
  }

  get answer_type() {
    if(this.answer_type_index == null) {
      return null;
    }
    return this.typeOptions[this.answer_type_index].type;
  }

  get answer_interval() {
    if(this.answer_interval_index == null) {
      return null;
    }
    return this.intervalOptions[this.answer_interval_index].interval;
  }

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
    options.sort((left,right)=>{
      return left.interval - right.interval;
    })
    return options; 
  }

  get typeOptions() {
    let set = new Set();
    let options = [];
    for(let i = 0 ; i < this.allChords.length; ++i) {
      if(set.has(this.allChords[i].type)) {
        continue;
      }
      set.add(this.allChords[i].type);
      options.push({
        type:this.allChords[i].type,
        name:ChordType[this.allChords[i].type]
      });
    }
    options.sort((left,right)=>left.type-right.type);
    return options;
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
    levelOptions.sort((left,right)=>{
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

.itemTitle {
  vertical-align: top;
  text-align: right;
  padding-top: 8px;
  padding-right: 6px;
  width: 60px;
}

</style>