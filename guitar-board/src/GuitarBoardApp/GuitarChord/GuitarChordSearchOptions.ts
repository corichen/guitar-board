import Tone from "../GuitarPlayer/Tone"

class GuitarChordSearchOptions {
    baseTone:Tone = Tone.C; // 设置首调
    natural:boolean = true;// 顺阶和弦
    chord_2:boolean = false; // 音程
    chord_m3:boolean = true; // 小三和弦
    chord_3:boolean = true; // 大三和弦
    chord_dim3:boolean = true; // 减三和弦
    chord_aug3:boolean = true; // 增三和弦
    chord_sus2:boolean = true; // 挂二和弦
    chord_sus4:boolean = true; // 挂四和弦
    chord_m7:boolean = true; // 小七和弦
    chord_maj7:boolean = true; // 大七和弦
    chord_7:boolean = true; // 属七和弦
    chord_m7b5:boolean = true; // 半减七和弦
    chord_dim7:boolean = true; // 减七和弦
    chord_mM7:boolean = true; // 小大七和弦
    chord_maj9:boolean = true; // 大九和弦
    chord_min9:boolean = true; // 小九和弦
    chord_9:boolean = true; // 属九和弦
    chord_aug9:boolean = true; // 增九和弦
    chord_dim9:boolean = true; // 减九和弦
    chord_9sus4:boolean = true; // 属九挂四
    chord_69:boolean = true; // 六九和弦
    chord_m69:boolean = true; // 小六九和弦
    roots:number[] = [1,2,3,4,5]; // 指定根音在哪些弦
    rootMin:number = 0; // 根音的最小品
    rootMax:number = 15;  // 根音的最大品
    intervals:number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]; // 最低音到最高音的音程音数(半音为一个音数)
}

export default GuitarChordSearchOptions;