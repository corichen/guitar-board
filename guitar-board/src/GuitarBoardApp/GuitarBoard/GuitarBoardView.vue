<template>
  <div style="user-select: none;" :style="{position:'relative',width:(width+style.marginLeft*2)+'px',height:(height+style.marginTop*2)+'px'}">
    <svg :width="width+style.marginLeft*2" :height="height+style.marginTop*2">
      <defs>
        <pattern id="stringbg3" x="0" y="0" :width="3/width" height="1">
          <image :href="require('./assets/string-1-h.png')" x="0" y="0" width="3" height="3" preserveAspectRatio="none"></image>
        </pattern>
        <pattern id="stringbg4" x="0" y="0" :width="4/width" height="1">
          <image :href="require('./assets/string-2-h.png')" x="0" y="0" width="4" height="4" preserveAspectRatio="none"></image>
        </pattern>
        <pattern id="stringbg6" x="0" y="0" :width="6/width" height="1">
          <image :href="require('./assets/string-3-h.png')" x="0" y="0" width="6" height="6" preserveAspectRatio="none"></image>
        </pattern>
        <pattern id="fret" x="0" y="0" width="1" :height="1/(style.cellHeight*6)">
          <image :href="require('./assets/fret-h.png')" x="0" y="0" width="7" height="1" preserveAspectRatio="none"></image>
        </pattern>
      </defs>
      <g :transform="'translate('+style.marginLeft+','+style.marginTop+')'">
        <!-- guitar board background -->
        <g>
          <rect x="0" :y="-style.cellHeight/2" :width="width" :height="height+style.cellHeight" :fill="style.backgroundColor"></rect>

          <!-- 3 5 7 9 12 -->
          <template v-for="index in [2,4,6,8,11]">
            <rect :x="index*style.cellWidth" :y="-style.paddingTop" :width="style.cellWidth" :height="style.cellHeight*5+(style.paddingTop+style.paddingBottom)" :fill="style.fretHintBackgroundColor"></rect>
          </template>

          <template v-for="index in [2,4,6,8]">
            <circle :cx="index*style.cellWidth+style.cellWidth/2" :cy="style.cellHeight*2.5" :r="6" :fill="style.fretHintPointColor"></circle>
          </template>

          <template v-for="index in [1,5]">
            <circle :cx="11*style.cellWidth+style.cellWidth/2" :cy="index*style.cellHeight-style.cellHeight/2" :r="6" :fill="style.fretHintPointColor"></circle>
          </template>

          <!-- frets -->
          <rect v-for="index in 14" :x="(index)*style.cellWidth-style.fretWidth/2" :y="-style.paddingTop" :height="style.cellHeight*5+(style.paddingTop+style.paddingBottom)" :width="style.fretWidth" :fill="style.fretColor"></rect>
          <!-- strings -->
          <rect v-for="index in 6" :x="0" :y="(index-1)*style.cellHeight-style.stringWidths[index-1]/2" :width="width" :height="style.stringWidths[index-1]" :fill="style.stringColors[index-1]" ></rect>
          <!-- header -->
          <rect :x="-4" :y="-style.paddingTop" :width="8" :height="style.cellHeight*5+(style.paddingTop+style.paddingBottom)" stroke="#000" fill="#000"></rect>
        </g>

        <!-- notes -->
        <g>
          <!-- note length bg -->
          <template v-for="(strObj,str) in this.strings">
            <template v-for="(note,index) in strObj">
              <g v-show="note.visible && note.length > 1" :transform="'translate('+getNoteCenterX(str,index)+','+getNoteCenterY(str,index)+')'">
                <rect :x="-style.noteWidth/2" :y="-style.noteWidth/2-(note.length-1)*style.cellHeight" :width="style.noteWidth" :height="(note.length-1)*style.cellHeight+style.noteWidth" :rx="style.noteWidth/2" fill="#ff800088"/>
              </g>
            </template>
          </template>

          <!-- notes -->
          <template v-for="(strObj,str) in this.strings">
            <template v-for="(note,index) in strObj">
              <g v-show="note.visible" @click="onNoteClicked(str,index)" :transform="'translate('+getNoteCenterX(str,index)+','+getNoteCenterY(str,index)+')'">
                <circle cx="0" cy="0" :r="style.noteWidth/2" :fill="getNoteBackground(note)" stroke="#333"></circle>
                <g v-show="note.nameVisible">
                  <text y="1" :fill="getNoteTextColor(note)" style="dominant-baseline: middle; text-anchor: middle; pointer-events: none;">{{ getNoteSimpleName(str,index) }}</text> 
                  <text v-show="isNoteUpper(str,index)" y="-2" x="-8" font-size="16" :fill="getNoteTextColor(note)" style="dominant-baseline: middle; text-anchor: middle; pointer-events: none;">♯</text>
                  <text v-show="isNoteLower(str,index)" y="-2" x="-8" font-size="16" :fill="getNoteTextColor(note)" style="dominant-baseline: middle; text-anchor: middle; pointer-events: none;">♭</text>
                </g>

                <!-- finger -->
                <g v-if="fingerVisible && note.finger >= 0" transform="translate(8,-2) scale(0.15,0.15)">
                  <path stroke-width="10" stroke="#000" fill="#FFF"  d="M5.92,94.34c6.17-5.69,15.26-6.21,21.43-.51l17.64,16.28c4.59,4.23,10.13,4.24,13.36,.72,2.14-2.33,1.3-9.52,.7-14.08L50.2,29.61c-.79-6,3.84-11.79,10.34-12.52,6.5-.73,12.41,3.88,13.2,9.88l9.76,52.73c.51,1.31,1.6,1.54,1.73-.23l3.32-68.53c0-6.04,5.31-10.94,11.86-10.94s11.86,4.9,11.86,10.94l.23,69.04c-.06,.8,.68,1.02,.81,.11l10.55-53.89c1.16-5.94,7.33-10.24,13.77-9.16,6.44,1.07,10.72,7.1,9.56,13.05l-9.39,63.07c0,1.12,.4,1.76,.98,.32l14.01-34.58c2.19-5.69,8.97-9.01,15.14-6.99,6.17,2.02,9.4,8.62,7.2,14.31l-24.56,74.07c-.13,.41-.26,.81-.4,1.22l-.05,.15s-.01,.02-.01,.03c-6.8,19.33-26.48,33.3-49.69,33.3-14.86,0-30.3-4.84-42.05-13.15h0c-12.69-7.05-53.35-47.4-53.35-47.4-6.17-5.69-5.25-14.41,.92-20.11Z"/>
                  <path v-if="note.finger == 0" stroke-width="6" stroke="#000" fill="#F00" d="M44.99,110.1s-8.33-7.53-19.95-18.04S-8.16,101.11,3.22,112.46s22.25,21.69,22.25,21.69l19.52-24.05Z"/>
                  <path v-if="note.finger == 1" stroke-width="6" stroke="#000" fill="#F00"  d="M57.69,86.46s-6.27-45.49-7.49-56.85c-1.74-12.63,16.62-19.36,23.09-4.56,3.72,19.6,10.21,54.65,10.21,54.65l-25.8,6.77Z"/>
                  <path v-if="note.finger == 2" stroke-width="6" stroke="#000" fill="#F00"  d="M85.22,79.47c5.98,.19,27.26-.72,27.26-.72-.06-20.19,0-62.12-.38-69.56-.76-9.19-19.15-14.88-23.41,0-1,11.05-2.93,62.2-3.47,70.28Z"/>
                  <path v-if="note.finger == 3" stroke-width="6" stroke="#000" fill="#F00"  d="M113.59,78.64l24.49,12.62s7.46-48.34,9.11-61.17c1.65-13.46-16.8-18.78-23.58-5.47-2.57,12.96-10.02,54.02-10.02,54.02Z"/>
                  <path v-if="note.finger == 4" stroke-width="6" stroke="#000" fill="#F00"  d="M139.2,92.42l22.07,15.58s10.75-32.22,14.4-43.79-17.01-18.98-21.99-7.12-14.49,35.33-14.49,35.33Z"/>
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
  public focus : number = 0; // 0 普通，1 一级聚焦，2 二级聚焦
  // 横按长度
  public length: number = 1;
  // 手指
  public finger: number = -1;
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

  private fingerVisible: boolean = true;

  private tone : Tone = Tone.C;

  public static STYLE_REAL = {
    cellWidth : 104,
    cellHeight : 36,
    noteWidth : 28,
    marginLeft : 40,
    marginTop : 20,
    paddingTop : 18,
    paddingBottom : 18,
    fretColor : "url(#fret)",
    fretHintBackgroundColor : "#ddd3",
    fretHintPointColor: "#fff",
    backgroundColor: "#333333",
    stringWidths : [3,3,4,4,6,6],
    stringColors : ["url(#stringbg3)","url(#stringbg3)","url(#stringbg4)","url(#stringbg4)","url(#stringbg6)","url(#stringbg6)"],
    fretWidth : 7
  }

  public static STYLE_LOGIC = {
    cellWidth : 90,
    cellHeight : 36,
    noteWidth : 28,
    marginLeft : 40,
    marginTop : 20,
    paddingTop : 0,
    paddingBottom : 0,
    fretColor : "#000",
    fretHintBackgroundColor : "#0003",
    fretHintPointColor: "#000",
    backgroundColor: "#FFF",
    stringWidths : [1,1,1,1,1,1],
    stringColors : ["#000","#000","#000","#000","#000","#000"],
    fretWidth : 1
  }

  private style = GuitarBoardView.STYLE_LOGIC;

  public setStyle(style:number) {
    if(style == 0) {
      this.style = GuitarBoardView.STYLE_LOGIC;
      return;
    }
    this.style = GuitarBoardView.STYLE_REAL;
  }

  private static noteNames = ["C","#C","D","bE","E","F","#F","G","bA","A","bB","B"];
  private static numberNames = ["1","#1","2","b3","3","4","#4","5","b6","6","b7","7"];

  private onNoteClicked(str:number,index:number) {
    this.guitarPlayer.playNote(str,index);
    this.$emit("note-click",new NoteEvent(str,index));
  }

  private getNoteBackground(note:Note) {
    if(note.focus == 0) {
      return "#FFFFFF";
    }
    if(note.focus == 1) {
      return '#ff8000'
    }
    return "#FF0000";
  }

  private getNoteTextColor(note:Note) {
    if(note.focus == 0) {
      return "#000";
    }
    if(note.focus == 1) {
      return '#000'
    }
    return "#FFF";
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

  public setFingerVisible(visible:boolean) {
    this.fingerVisible = visible;
  }

  public isFingerVisible() {
    return this.fingerVisible;
  }

  public setFocus(focus:number=1,locations:Location[]|null=null) {
    if(locations == null) {
      for(let i = 0 ; i < this.strings.length ; ++i) {
        for(let j = 0 ; j < this.strings[i].length; ++j) {
          this.strings[i][j].focus = focus;
        }
      }
      return;
    } else {
      for(let i = 0; i < locations.length; ++i) {
        if(locations[i].index > this.strings[locations[i].str].length - 1) {
          continue;
        }
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
          this.strings[i][j].length = 1;
          this.strings[i][j].finger = -1;
        }
      }
      return;
    } else {
      for(let i = 0; i < locations.length; ++i) {
        if(locations[i].index > this.strings[locations[i].str].length - 1) {
          continue;
        }
        this.strings[locations[i].str][locations[i].index].visible = visible;
        this.strings[locations[i].str][locations[i].index].length = locations[i].length;
        this.strings[locations[i].str][locations[i].index].finger = locations[i].finger;
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
        if(locations[i].index > this.strings[locations[i].str].length - 1) {
          continue;
        }
        this.strings[locations[i].str][locations[i].index].nameVisible = visible;
      }
      return;
    }
  }

  public clearFocus() {
    this.setFocus(0);
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
      return -this.style.marginLeft / 2;
    }
    return this.style.cellWidth * (index-0.5);
  }

  private getNoteCenterY(str:number,index:number) : number {
    return str * this.style.cellHeight;
  }

  private get width() {
    return this.style.cellWidth * 14;
  }

  private get height() {
    return this.style.cellHeight * 5;
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