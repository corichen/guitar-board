<template>
  <div style="user-select: none;" :style="{position:'relative',width:(width+marginLeft*2)+'px',height:(height+marginTop*2)+'px'}">
    <svg :width="width+marginLeft*2" :height="height+marginTop*2" style="border: #888 dashed 1px;position:absolute;">
      <defs>
        <linearGradient id="Gradient">
          <stop offset="0%" stop-color="#444" />
          <stop offset="100%" stop-color="#fff" />
        </linearGradient>
      </defs>
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
          <rect v-for="index in 15" :x="(index-1)*cellWidth" :y="0" :height="cellHeight*5" width="2" :fill="fretColor"></rect>
          <!-- strings -->
          <line v-for="index in 6" :x1="0" :y1="(index-1)*cellHeight" :x2="width" :y2="(index-1)*cellHeight" stroke-width="2" :stroke="stringColor"></line>
          <!-- header -->
          <rect :x="-4" :y="-1" :width="4" :height="cellHeight*5+2" :stroke="stringColor" :fill="stringColor"></rect>
        </g>

        <!-- notes -->
        <g>
          <template v-for="(strObj,str) in this.strings">
            <template v-for="(note,index) in strObj">
              <g v-show="note.visible" @click="onNoteClicked(str,index)" :transform="'translate('+getNoteCenterX(str,index)+','+getNoteCenterY(str,index)+')'">
                <circle cx="0" cy="0" :r="noteWidth/2" :fill="note.focus?'#07E':'#FFFFFF'" stroke="#888"></circle>
                <g v-show="note.nameVisible">
                  <text y="1" :fill="note.focus?'#FFF':'#000'" style="dominant-baseline: middle; text-anchor: middle; pointer-events: none;">{{ getNoteSimpleName(str,index) }}</text> 
                  <text v-show="isNoteUpper(str,index)" y="-2" x="-8" font-size="16" :fill="note.focus?'#FFF':'#000'" style="dominant-baseline: middle; text-anchor: middle; pointer-events: none;">♯</text>
                  <text v-show="isNoteLower(str,index)" y="-2" x="-8" font-size="16" :fill="note.focus?'#FFF':'#000'" style="dominant-baseline: middle; text-anchor: middle; pointer-events: none;">♭</text>
                </g>
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
import NoteEvent from './NoteEvent';
import Tone from '../GuitarPlayer/Tone';
import NoteStyle from './NoteStyle';
import Location from '../GuitarPlayer/Location';


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
  },
  emits: [
    "note-click"
  ]
})
export default class GuitarBoardView extends Vue {
  private guitarPlayer : GuitarPlayer = new GuitarPlayer();

  private strings : [Note[]] = [[]];

  private noteStyle: NoteStyle = NoteStyle.number_name;

  private tone : Tone = Tone.C;

  private cellWidth : number = 76;
  private cellHeight : number = 40;
  private noteWidth : number = 28;
  private marginLeft : number = 40;
  private marginTop : number = 20;
  private fretColor : string = "#000";
  private fretHintBackgroundColor : string = "#ddd";
  private fretHintPointColor : string = "#000";
  private stringColor : string = "#000";

  private static noteNames = ["C","#C","D","bE","E","F","#F","G","bA","A","bB","B"];
  private static numberNames = ["1","#1","2","b3","3","4","#4","5","b6","6","b7","7"];

  private onNoteClicked(str:number,index:number) {
    this.guitarPlayer.playNote(str,index);
    this.$emit("note-click",new NoteEvent(str,index));
  }

  public setNoteStyle(noteStyle:NoteStyle) {
    this.noteStyle = noteStyle;
  }

  public getNoteStyle() {
    return this.noteStyle;
  }

  public setTone(tone:Tone) {
    this.tone = tone;
  }

  public getTone() {
    return this.tone;
  }

  public setFocus(focus:boolean=true,locations:Location[]|null=null) {
    if(locations == null) {
      for(let i = 0 ; i < this.strings.length ; ++i) {
        for(let j = 0 ; j < this.strings[i].length; ++j) {
          this.strings[i][j].focus = focus;
        }
      }
      return;
    } else {
      for(let i = 0; i < locations.length; ++i) {
        this.strings[locations[i].str][locations[i].index].focus = focus;
      }
      return;
    }
  }

  public setVisible(visible:boolean=true,locations:Location[]|null=null) {
    if(locations == null) {
      for(let i = 0 ; i < this.strings.length ; ++i) {
        for(let j = 0 ; j < this.strings[i].length; ++j) {
          this.strings[i][j].visible = visible;
        }
      }
      return;
    } else {
      for(let i = 0; i < locations.length; ++i) {
        this.strings[locations[i].str][locations[i].index].visible = visible;
      }
      return;
    }
  }

  public setNameVisible(visible:boolean=true,locations:Location[]|null=null) {
    if(locations == null) {
      for(let i = 0 ; i < this.strings.length ; ++i) {
        for(let j = 0 ; j < this.strings[i].length; ++j) {
          this.strings[i][j].nameVisible = visible;
        }
      }
      return;
    } else {
      for(let i = 0; i < locations.length; ++i) {
        this.strings[locations[i].str][locations[i].index].nameVisible = visible;
      }
      return;
    }
  }

  public clearFocus() {
    this.setFocus(false);
  }

  private getNoteSimpleName(str:number,index:number) : string {
    let name = this.getNoteName(str,index);
    return name.substring(name.length-1);
  }

  private isNoteUpper(str:number,index:number) {
    return this.getNoteName(str,index).startsWith("#");
  }

  private isNoteLower(str:number,index:number) {
    return this.getNoteName(str,index).startsWith("b");
  }

  public getUnNaturalNotes():Location[] {
    let notes:Location[] = [];
    for(let i = 0 ; i < this.strings.length; i++) {
      for(let j = 0 ; j < this.strings[i].length; j++) {
        if(this.isNoteUpper(i,j) || this.isNoteLower(i,j)) {
          notes.push(new Location(i,j));
        }
      }
    }
    return notes;
  }

  public getNaturalNotes():Location[] {
    let notes:Location[] = [];
    for(let i = 0 ; i < this.strings.length; i++) {
      for(let j = 0 ; j < this.strings[i].length; j++) {
        if(this.isNoteUpper(i,j) || this.isNoteLower(i,j)) {
          continue;
        }
        notes.push(new Location(i,j));
      }
    }
    return notes;
  }

  private getNoteName(str:number,index:number) : string {
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

  private getNoteCenterX(str:number,index:number) : number {
    if(index == 0) {
      return -this.marginLeft / 2;
    }
    return this.cellWidth * (index-0.5);
  }

  private getNoteCenterY(str:number,index:number) : number {
    return str * this.cellHeight;
  }

  private get width() {
    return this.cellWidth * 14;
  }

  private get height() {
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