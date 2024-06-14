<template>
  <div>
    <svg :width="width+marginLeft*2" :height="height+marginTop*2" style="border: #888 dashed 1px;">
      <g :transform="'translate('+marginLeft+','+marginTop+')'">
        <!-- guitar board background -->
        <g>
          <!-- 3 5 7 9 12 -->
          <template v-for="index in [2,4,6,8,11]">
            <rect :x="index*cellWidth" :y="0" :width="cellWidth" :height="cellHeight*5" :fill="fretHintBackgroundColor"></rect>
          </template>

          <template v-for="index in [2,4,6,8]">
            <circle :cx="index*cellWidth+cellWidth/2" :cy="cellHeight*2.5" :r="4" :fill="fretHintPointColor"></circle>
          </template>

          <template v-for="index in [1,5]">
            <circle :cx="11*cellWidth+cellWidth/2" :cy="index*cellHeight-cellHeight/2" :r="4" :fill="fretHintPointColor"></circle>
          </template>

          <!-- frets -->
          <line v-for="index in 15" :x1="(index-1)*cellWidth" :x2="(index-1)*cellWidth" :y1="0" :y2="cellHeight*5" stroke-width="2" :stroke="fretColor"></line>
          <!-- strings -->
          <line v-for="index in 6" :x1="0" :y1="(index-1)*cellHeight" :x2="width" :y2="(index-1)*cellHeight" stroke-width="2" :stroke="stringColor"></line>
          <!-- header -->
          <rect :x="-4" :y="-1" :width="4" :height="cellHeight*5+2" :stroke="stringColor" :fill="stringColor"></rect>
        </g>

        <!-- notes -->
        <g>
          <template v-for="(strObj,str) in this.strings">
            <template v-for="(note,index) in strObj">
              <g :transform="'translate('+getNoteCenterX(str,index)+','+getNoteCenterY(str,index)+')'">
                <circle cx="0" cy="0" :r="noteWidth/2" :fill="note.focus?'#07E':'#FFFFFF'" stroke="#888"></circle>
                <text y="1" :fill="note.focus?'#FFF':'#000'" style="dominant-baseline: middle; text-anchor: middle; pointer-events: none;">{{ getNoteSimpleName(str,index) }}</text> 
                <text v-show="isNoteUpper(str,index)" y="2" x="-12" font-size="16" :fill="note.focus?'#FFF':'#000'">♯</text>
                <text v-show="isNoteLower(str,index)" y="2" x="-12" font-size="16" :fill="note.focus?'#FFF':'#000'">♭</text>
              </g>
            </template>
          </template>
        </g>
      </g>


      
    </svg>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import GuitarPlayer from '../GuitarPlayer/GuitarPlayer';


enum Tone {
  C,
  sC,
  D,
  bE,
  E,
  F,
  sF,
  G,
  bA,
  A,
  bB,
  B
}

enum NoteStyle {
  number_name, // 唱名
  note_name    // 音名
}

class Note {
  // 是否显示
  public visible : boolean = true;
  // 是否展示名称
  public nameVisible : boolean = true;
  // 是否高亮
  public focus : boolean = false;                              
}




@Options({
  components: {
  },
  props: {
  }
})
export default class GuitarBoardView extends Vue {


  private guitarPlayer : GuitarPlayer = new GuitarPlayer();

  private strings : [Note[]] = [[]];

  noteStyle: NoteStyle = NoteStyle.number_name;

  tone : Tone = Tone.C;

  cellWidth : number = 76;
  cellHeight : number = 40;
  noteWidth : number = 28;
  marginLeft : number = 40;
  marginTop : number = 20;
  fretColor : string = "#888";
  fretHintBackgroundColor : string = "#00000011";
  fretHintPointColor : string = "#666";
  stringColor : string = "#000000";

  static noteNames = ["C","sC","D","bE","E","F","sF","G","bA","A","bB","B"];
  static numberNames = ["1","s1","2","b3","3","4","s4","5","b6","6","b7","7"];

  getNoteSimpleName(str:number,index:number) : string {
    let name = this.getNoteName(str,index);
    return name.substring(name.length-1);
  }

  isNoteUpper(str:number,index:number) {
    return this.getNoteName(str,index).startsWith("s");
  }

  isNoteLower(str:number,index:number) {
    return this.getNoteName(str,index).startsWith("b");
  }

  getNoteName(str:number,index:number) : string {
    if(this.noteStyle == NoteStyle.note_name) {
      if(str == 1) {
        return GuitarBoardView.noteNames[(index+11)%12];
      } else if(str == 2) {
        return GuitarBoardView.noteNames[(index+7)%12];
      } else if(str == 3) {
        return GuitarBoardView.noteNames[(index+2)%12];
      } else if(str == 4) {
        return GuitarBoardView.noteNames[(index+9)%12];
      } else {
        return GuitarBoardView.noteNames[(index+4)%12];
      }
    } else {
      // 移调
      index+=12;
      index-=this.tone;
      if(str == 1) {
        return GuitarBoardView.numberNames[(index+11)%12];
      } else if(str == 2) {
        return GuitarBoardView.numberNames[(index+7)%12];
      } else if(str == 3) {
        return GuitarBoardView.numberNames[(index+2)%12];
      } else if(str == 4) {
        return GuitarBoardView.numberNames[(index+9)%12];
      } else {
        return GuitarBoardView.numberNames[(index+4)%12];
      }
    }
    return "5";
  }

  getNoteCenterX(str:number,index:number) : number {
    if(index == 0) {
      return -this.marginLeft / 2;
    }
    return this.cellWidth * (index-0.5);
  }

  getNoteCenterY(str:number,index:number) : number {
    return str * this.cellHeight;
  }

  get width() {
    return this.cellWidth * 14;
  }

  get height() {
    return this.cellHeight * 5;
  }

  mounted() {
    for(let str = 0 ; str < 6; ++str) {
      this.strings[str] = [];
      for(let index = 0 ; index < 15;++index) {
        this.strings[str].push(new Note());
      }
    }

    (window as any)['app'] = this;
  }
 
}

</script>

<style scoped>

</style>