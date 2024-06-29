<template>
  <div>
   <div v-if="visible" style="position: fixed;left:0;top:0;width:100%;height:100%;display:flex;flex-direction: column;align-items: center;justify-content: center;background-color: #00000088;">
      <div style="background-color: #FFFFFF;padding:40px 0px 0px 0px;position:relative;">
        <div style="position: absolute;left:0;top:0;width:100%;height:40px;background-color:#EEE;">
          <div style="position: absolute;left:0;height:100%;display:flex;flex-direction: row;align-items: center;padding-left:20px;color:#444">{{ title }}</div>
          <div style="position: absolute;bottom:0;width:100%;height:1px;background-color:#CCC;"></div>
          <div @click="onClose()" class="button" style="position: absolute;right:10px;width:40px;height:40px;display:flex;flex-direction: row;align-items: center;justify-content: center;">
            <svg width="20" height="20">
              <line x1="5" y1="5" x2="15" y2="15" stroke-width="2" stroke="#444"/>
              <line x1="5" y1="15" x2="15" y2="5" stroke-width="2" stroke="#444"/> 
            </svg>
          </div>
        </div>
        <slot></slot> 
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {
  },
  props:["title","visible"],
  emits:["close"],
  watch: {
    visible() {
      this._visible = (this as any).visible;
    }
  }
})
export default class Dialog extends Vue {
  mounted() { 
  }
  onClose() {
    this.$emit('close');
  }
}
</script>

<style scoped>
.button {}

.button:hover {
  background-color: #CCC;
}

</style>
