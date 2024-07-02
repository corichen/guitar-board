<template>
  <div style="display: flex;width:fit-content;flex-direction: row;flex-wrap: wrap;user-select: none;">
    <div v-for="(option,index) in _options" @click="onOptionClicked(index)" style="display: flex;flex-direction: row;margin:4px 0px;" :style="{backgroundColor:option.selected?this.selectedBackgroundColor:'#FFF',border:`1px solid ${borderColor}`}">
      <div  style="padding: 4px 10px;">{{ option.name }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {
  },
  props : {
    options : {
      type: [String]
    },
    mutiple : {
      type: Boolean,
      default: true
    },
    selected : {
      type: Number,
      default: (1<<0)
    }
  },
  watch: {
    options() {
      this.onOptionsChanged();
    }
  },
  emits : ["select"]
})
export default class Selector extends Vue {

  borderColor = "#333";
  selectedBackgroundColor = "#FF3";

  _options:{name:string,selected:boolean}[] = [];

  get optionsProp() : string[] {
    return (this as any).options as string[];
  }

  get mutipleProp() {
    return (this as any).mutiple as boolean;
  }


  onOptionClicked(index:number) {
    if(!this.mutipleProp) {
      this._options[index].selected = true;
      for(let i = 0 ; i < this._options.length; ++i) {
        if(i != index) {
          this._options[i].selected = false;
        }
      }
    } else {
      this._options[index].selected = !this._options[index].selected;
    }

    let selected = 0;
    let options = [];
    for(let i = 0 ; i < this._options.length; ++i) {
      if(this._options[i].selected) {
        selected |= (1<<i);
        options.push(i);
      } 
    }
    this.$emit("select",{
      selected,
      options
    });
  }

  onOptionsChanged() {
    this._options = [];
    for(let i = 0 ; i < this.optionsProp.length ; ++i) {
      this._options.push({
        name : this.optionsProp[i],
        selected :( (this as any).selected & (1<<i) ) != 0
      })
    }
  }

  mounted() { 
    this.onOptionsChanged();
  }
}
</script>
