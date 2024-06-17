import ILocation from "./ILocation";

export default class GuitarPlayer {

    private noteIndex : any = null;
    private audioContext : any = null;
    private audioData : any = null;

    constructor() {
        this.noteIndex = [
            {
                string: 5,
                index: 0,
                offset: -8,
                begin:0,
                end:3.8
            },
            {
                string: 4,
                index: 0,
                offset: -3,
                begin:3.96,
                end:7.7
            },
            {
                string: 3,
                index: 0,
                offset: 2,
                begin:7.79,
                end:10.9
            },
            {
                string: 2,
                index: 0,
                offset: 7,
                begin:11,
                end:14
            },
            {
                string: 1,
                index: 0,
                offset: 11,
                begin: 14.04,
                end: 16.8
            },
            {
                string: 0,
                index: 0,
                offset: 16,
                begin: 16.8,
                end: 19.4
            },
            {
                string: 5,
                index: 7,
                offset: -1,
                begin: 19.4,
                end:21.8
            },
            {
                string: 4,
                index: 7,
                offset: 4,
                begin: 21.9,
                end: 24.4
            }
            ,
            {
                string: 3,
                index: 7,
                offset: 9,
                begin: 24.55,
                end: 27
            },
            {
                string: 2,
                index: 7,
                offset: 14,
                begin: 27.06,
                end: 29.2
            },
            {
                string: 1,
                index: 7,
                offset: 18,
                begin: 29.35,
                end: 31.4
            },
            {
                string: 0,
                index: 7,
                offset: 23,
                begin: 31.48,
                end: 33.9
            }

        ];
    }
    private async init() {
        window.AudioContext = window.AudioContext;
        this.audioContext = new AudioContext({latencyHint:0});
        return new Promise((resolve,reject)=>{
            let xml = new XMLHttpRequest();
            xml.responseType = 'arraybuffer';
            xml.open('GET', require("./assets/guitar.mp3"), true);
            xml.onload = ()=>{
                this.audioContext.decodeAudioData(
                    xml.response,
                    (_data:any) => {
                        this.audioData = _data;
                        this.playSilence();
                        resolve(this);
                    },
                    function(e:any) {
                        alert(e.err);
                        reject(e);
                    }
                );
            };
            xml.send();
        })
    }
    playSilence() {
        // 播放一个听不见的声音，避免正常播放时缺少音头。
        let bufferSource;
        bufferSource = this.audioContext.createBufferSource();
        bufferSource.buffer = this.audioData;
        bufferSource.playbackRate.value = 1;
        bufferSource.loop = true;
        bufferSource.loopStart = 0;
        bufferSource.loopEnd = 1;

        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = 0.01;

        bufferSource.connect(gainNode);

        gainNode.connect(this.audioContext.destination);

        bufferSource.start(0);
    }
    private async wait(time:number) {
        return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve(1);
            },time);
        });
    }
    public async playNotes(notes:ILocation[],delay:number=0){
        for(let i = 0 ; i < notes.length; ++i) {
            if(notes[i].str < 0 || notes[i].str > 5) {
                continue;
            }
            await this.playNote(notes[i].str,notes[i].index);
            await this.wait(delay);
        }
    }
    public async playNote(string:number,index:number) {
        if(this.audioData == null) {
            await this.init();
        }

        let sampleNotes = [];
        for(let i = 0 ; i < this.noteIndex.length; ++i) {
            if(this.noteIndex[i].string == string) {
                sampleNotes.push(this.noteIndex[i]);
            }
        }
        sampleNotes.sort((left,right)=>{
            let leftDistance = Math.abs(left.index-index);
            let rightDistance = Math.abs(right.index-index);
            if(leftDistance < rightDistance) {
                return -1;
            }
            if(leftDistance > rightDistance) {
                return 1;
            }
            return 0;
        });

        let sampleNote = sampleNotes[0];
        let frequencyRatioTempered = 1.059463;
        let superRate = index-sampleNote.index;
        let frequencyRatio = Math.pow(frequencyRatioTempered,superRate);

        let bufferSource;
        bufferSource = this.audioContext.createBufferSource();
        bufferSource.buffer = this.audioData;
        bufferSource.playbackRate.value = frequencyRatio;

        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = 3;

        bufferSource.connect(gainNode);

        gainNode.connect(this.audioContext.destination);

        bufferSource.start(0,sampleNote.begin,sampleNote.end-sampleNote.begin);
    }
}