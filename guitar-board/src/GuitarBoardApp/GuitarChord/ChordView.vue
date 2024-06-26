<template>
  <div style="user-select: none;">
    <div>
      <svg @contextmenu.prevent="onRightClick" @click="onClick" :width="width" :height="height">
        <g :transform="'translate('+marginLeft+','+marginTop+')'">
          <rect v-if="baseIndex==1" x="-0.5" y="-2" :width="cellWidth*5+1" :height="3" fill="#000"></rect>
          <line v-for="row in (rowCount+1)" x1="0" :x2="cellWidth*5" :y1="cellHeight*(row-1)" :y2="cellHeight*(row-1)" stroke="#000"></line>
          <line v-for="column in 6" :x1="cellWidth*(column-1)" :x2="cellWidth*(column-1)" y1="0" :y2="cellHeight*rowCount" stroke="#000"></line>
          <g v-for="note in chordProp.notes" :transform="'translate('+(5-note.str)*cellWidth+','+(note.index==0?-7:(note.index-baseIndex+0.5)*cellHeight)+')'">
           
            <rect :x="-cellWidth*0.4" :y="-cellWidth*0.4" :width="cellWidth*(note.length-1)+cellWidth*0.4*2" :height="cellWidth*0.4*2" :rx="cellWidth*0.4" :fill="'#00000044'"></rect>
            <circle cx="0" cy="0" :r="cellWidth*0.4" :fill="note.str==chordProp.root?'#aa0000':'#000'" ></circle>
          </g>
          <!-- x -->
          <g v-for="index in 6"  :transform="'translate('+(index-1)*cellWidth+',-7)'">
            <template v-if="!chordProp.hasNoteInString(6-index)">
              <line x1="-3" y1="-3" x2="3" y2="3" stroke="#000" stroke-width="1"/>
              <line x1="3" y1="-3" x2="-3" y2="3" stroke="#000" stroke-width="1"/>
            </template>
          </g>
        </g>
        <text :x="width/2" :y="height-12" :fill="'#000'" font-weight="bold" style="dominant-baseline: middle; text-anchor: middle; pointer-events: none;">{{ chordProp.name }}</text>
        <text v-if="baseIndex!=1" :x="marginLeft-5" :y="marginTop+cellHeight/2" :fill="'#000'" font-size="11" font-weight="bold" style="dominant-baseline: middle; text-anchor: end; pointer-events: none;">{{ baseIndex }}</text>
        
        <g v-if="chordProp.slideable" :transform="'translate('+(marginLeft-8)+','+(marginTop+20)+')'">
          <line x1="-3" y1="5" x2="0" y2="0" stroke="#000" stroke-width="1"/>
          <line x1="3" y1="5" x2="0" y2="0" stroke="#000" stroke-width="1"/>
          <line x1="-3" y1="8" x2="0" y2="13" stroke="#000" stroke-width="1"/>
          <line x1="3" y1="8" x2="0" y2="13" stroke="#000" stroke-width="1"/>
        </g>
     
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Chord from './Chord';

@Options({
  emits: ["chord-click","chord-right-click"]
  ,
  components: {
  },
  props: {
    chord: {
      type: Chord
    }
  }
})
export default class ChordView extends Vue {
  cellWidth = 10;
  cellHeight = 18;
  marginLeft = 20;
  marginRight = 6;
  marginTop = 12;
  marginBottom = 26;

  onRightClick() {
    this.$emit("chord-right-click");
  }

  onClick(){
    this.$emit("chord-click");
  }
  get width() {
    return this.cellWidth * 5 + this.marginLeft + this.marginRight;
  }
  get baseIndex() {
    let minIndex = null;
    for(let i = 0 ; i < this.chordProp.notes.length; ++i) {
      if(minIndex == null) {
        minIndex = this.chordProp.notes[i].index;
      } else if(this.chordProp.notes[i].index < minIndex) {
        minIndex = this.chordProp.notes[i].index;
      }
    }
    if(minIndex == null || minIndex == 0) {
      return 1;
    }
    return minIndex;
  }

  get rowCount() {
    let minIndex = null;
    let maxIndex = null;
    for(let i = 0 ; i < this.chordProp.notes.length; ++i) {
      if(minIndex == null) {
        minIndex = this.chordProp.notes[i].index;
      } else if(this.chordProp.notes[i].index < minIndex) {
        minIndex = this.chordProp.notes[i].index;
      }
      if(maxIndex == null) {
        maxIndex = this.chordProp.notes[i].index;
      } else if(this.chordProp.notes[i].index > maxIndex) {
        maxIndex = this.chordProp.notes[i].index;
      }
    }
    if(minIndex == null || maxIndex == null) {
      return 4;
    }
    let count = maxIndex;
    if(minIndex > 0) {
      count = maxIndex - minIndex + 1;
    }
    return count < 3 ? 3 : count;
  }

  get height() {
    return this.rowCount * this.cellHeight + this.marginTop + this.marginBottom;
  }

  mounted() { 
  }

  get chordProp() {
    return (this as any).chord as Chord;
  }
}
</script>
