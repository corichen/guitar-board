class GuitarPlayer {
    constructor() {
        this.noteIndex = [
            {
                string: 5,
                index: 0,
                offset: -8,
                begin:0,
                duration:3.8
            },
            {
                string: 4,
                index: 0,
                offset: -3,
                begin:3.8,
                duration: 3.9
            },
            {
                string: 3,
                index: 0,
                offset: 2,
                begin:7.7,
                duration: 3.2
            },
            {
                string: 2,
                index: 0,
                offset: 7,
                begin:10.9,
                duration: 3.1
            },
            {
                string: 1,
                index: 0,
                offset: 11,
                begin: 14,
                duration: 2.8
            },
            {
                string: 0,
                index: 0,
                offset: 16,
                begin: 16.8,
                duration: 2.6
            },
            {
                string: 5,
                index: 7,
                offset: -1,
                begin: 19.4,
                duration: 2.4
            },
            {
                string: 4,
                index: 7,
                offset: 4,
                begin: 21.8,
                duration: 2.6
            }
            ,
            {
                string: 3,
                index: 7,
                offset: 9,
                begin: 24.4,
                duration: 2.6
            },
            {
                string: 2,
                index: 7,
                offset: 14,
                begin: 27,
                duration: 2.2
            },
            {
                string: 1,
                index: 7,
                offset: 18,
                begin: 29.2,
                duration: 2.2
            },
            {
                string: 0,
                index: 7,
                offset: 23,
                begin: 31.4,
                duration: 2.5
            }

        ];
        this.initAudio();
    }
    initAudio() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext({latencyHint:0});
        let xml = new XMLHttpRequest();
        xml.responseType = 'arraybuffer';
        xml.open('GET', 'media/guitar.mp3', true);
        xml.onload = ()=>{
            this.audioContext.decodeAudioData(
                xml.response,
                (_data) => {
                    this.audioData = _data;
                    this.playSilence();
                },
                function(e) {
                    alert(e.err);
                }
            );
        };
        xml.send();
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
    playNote(string,index) {
        if(this.audioData == null) {
            return;
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

        bufferSource.start(0,sampleNote.begin,sampleNote.duration);
    }
}