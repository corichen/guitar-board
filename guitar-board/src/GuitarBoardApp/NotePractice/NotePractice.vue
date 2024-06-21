<template>
  <div style="position: fixed;width:100%;height:100%;display:flex;align-items: center;justify-content: center;">
    <audio ref="rightAudio" :src="require('./assets/right.wav')" volume="0.3"></audio>
    <audio ref="wrongAudio" :src="require('./assets/wrong.wav')" volume="0.3"></audio>
    <div style="border: 1px dashed #000;padding:10px 20px;font-size: 20px;position:relative;">
      <div style="font-weight: bold;font-size: 24px;margin-bottom:10px;">单音听辨</div>
      你听到的第一个音的唱名的1，请按顺序输入你所听到的音符唱名。<br>
      <div style="position:absolute;right:10px;top:10px"><label v-if="remainCount>0">剩余题目:{{ this._totalQuestionCount-(this._rightCount+this._wrongCount) }}</label> <label v-if="remainCount == 0">正确:{{this._rightCount}} 错误:{{ this._wrongCount }} 分数:<font style="color:#FF0000;font-size:24px;">{{ Math.floor(this._rightCount*100/this._totalQuestionCount) }}</font>分 </label></div>

      <button @click="onPlay()" style="margin-top:10px;">播放题目</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import GuitarPlayer from '../GuitarPlayer/GuitarPlayer';
import Location from '../GuitarPlayer/Location';


@Options({
  props:[],
  components: {
  }
})
export default class NotePractice extends Vue {

  guitarPlayer : GuitarPlayer = new GuitarPlayer();

  answering : boolean = true;

  answer : string = "1";

  question : Location[] = [];

  _noteCount : number = 1;

  _totalQuestionCount : number = 20;
  _rightCount : number = 0;
  _wrongCount : number = 0;
  _wrong : boolean = false;

  get remainCount() {
    return this._totalQuestionCount - (this._rightCount + this._wrongCount);
  }

  playRightSound() {
    (this.$refs.rightAudio as any).currentTime = 0;
    (this.$refs.rightAudio as any).play();
  }

  playWrongSound() {
    (this.$refs.wrongAudio as any).currentTime = 0;
    (this.$refs.wrongAudio as any).play();
  }

  onPlay() {
    if(this.question.length == 0) {
      this.createRandomQuestion(this._noteCount);
    }
    this.guitarPlayer.playNotes(this.question,800);
  }

  createRandomQuestion(noteCount:number) {
    this.question = [];
    let notes : Location[] = [
      {str:4,index:3},{str:3,index:0},{str:3,index:2},{str:3,index:3},
      {str:3,index:5},{str:3,index:7},{str:2,index:4},{str:2,index:5},
      {str:2,index:7},{str:1,index:5},{str:1,index:6},{str:1,index:8},
      {str:0,index:5},{str:0,index:7},{str:0,index:8}
    ]
    this.question.push(notes.splice(7,1)[0])
    for(let i = 0 ; i < noteCount && notes.length > 0 ; ++i) {
      this.question.push(notes.splice(Math.floor(notes.length*Math.random()),1)[0]);
    }
  }

  keydownHandler : any;



  mounted() { 
    document.addEventListener("keydown",this.keydownHandler = (e:KeyboardEvent)=>{
      if(!/[1-7]/.test(e.key) || this.answer.length >= this.question.length) {
        return;
      }
      this.answer+=e.key;
      if(this.answer.length >= this.question.length) {
        this.checkAnswer();
      }
    });
  }

  nextQuestion() {
    if(this._rightCount + this._wrongCount >= this._totalQuestionCount) {
      return;
    }
    this.answer = "1";
    this._wrong = false;
    this.createRandomQuestion(this._noteCount);
    setTimeout(()=>{
      this.onPlay();
    },1000);
  }

  checkAnswer() {
    let questions = this.question;
    let d1 = questions[0];
    for(let i = 0 ; i < questions.length; ++i) {
      let qIndex = this.indexByLocation(questions[i]) % 12;
      let d1Index = this.indexByLocation(d1) % 12;
      let qIndexByD1 = (qIndex + 12 - d1Index) % 12;
      let qA = "1";
      switch(qIndexByD1) {
          case 0:
            qA = "1";break;
          case 2:
            qA = "2";break;
          case 4:
            qA = "3";break;
          case 5:
            qA = "4";break;
          case 7:
            qA = "5";break;
          case 9:
            qA = "6";break;
          case 11:
            qA = "7";break;
      }
      if(qA != this.answer[i]) {
        this.playWrongSound();
        this._wrong = true;
        this.answer = this.answer.substring(0,this.answer.length-1);
        return;
      }
    }
    this.playRightSound();
    if(this._wrong) {
      this._wrongCount++;
    } else {
      this._rightCount++;
    }
    setTimeout(()=>{
        this.nextQuestion();
      },1000);
  }

  indexByLocation(loc:Location) {
    if(loc.str == 0) {
      return loc.index + 4;
    }
    if(loc.str == 1) {
      return loc.index + 11;
    }
    if(loc.str == 2) {
      return loc.index + 7;
    }
    if(loc.str == 3) {
      return loc.index + 2;
    }
    if(loc.str == 4) {
      return loc.index + 9;
    }
    return loc.index + 4;
  }

  unmounted() {
    document.removeEventListener("keydown",this.keydownHandler);
  }
}
</script>

<style scoped>
button {
  padding: 6px 12px;
  margin: 6px 6px;
  font-size: 18px;
}
</style>
