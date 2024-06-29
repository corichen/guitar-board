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
          <template v-for="(strObj,str) in this.strings">
            <template v-for="(note,index) in strObj">
              <g v-show="note.visible" @click="onNoteClicked(str,index)" :transform="'translate('+getNoteCenterX(str,index)+','+getNoteCenterY(str,index)+')'">
                <circle cx="0" cy="0" :r="style.noteWidth/2" :fill="getNoteBackground(note)" stroke="#333"></circle>
                <g v-show="note.nameVisible">
                  <text y="1" :fill="getNoteTextColor(note)" style="dominant-baseline: middle; text-anchor: middle; pointer-events: none;">{{ getNoteSimpleName(str,index) }}</text> 
                  <text v-show="isNoteUpper(str,index)" y="-2" x="-8" font-size="16" :fill="getNoteTextColor(note)" style="dominant-baseline: middle; text-anchor: middle; pointer-events: none;">♯</text>
                  <text v-show="isNoteLower(str,index)" y="-2" x="-8" font-size="16" :fill="getNoteTextColor(note)" style="dominant-baseline: middle; text-anchor: middle; pointer-events: none;">♭</text>
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
        }
      }
      return;
    } else {
      for(let i = 0; i < locations.length; ++i) {
        this.strings[locations[i].str][locations[i].index].visible = visible;
        this.strings[locations[i].str][locations[i].index].length = locations[i].length;
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