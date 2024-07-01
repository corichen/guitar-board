import Tone from "../GuitarPlayer/Tone"

class GuitarChordSearchOptions {
    baseTone:Tone = Tone.C; // 设置首调
    natural:boolean = false;// 顺阶和弦
    chord_2:boolean = false; // 音程
    chord_m3:boolean = false; // 小三和弦
    chord_3:boolean = true; // 大三和弦
    chord_dim3:boolean = false; // 减三和弦
    chord_aug3:boolean = false; // 增三和弦
    chord_sus2:boolean = false; // 挂二和弦
    chord_sus4:boolean = false; // 挂四和弦
    chord_m7:boolean = false; // 小七和弦
    chord_maj7:boolean = false; // 大七和弦
    chord_7:boolean = false; // 属七和弦
    chord_m7b5:boolean = false; // 半减七和弦
    chord_dim7:boolean = false; // 减七和弦
    chord_mM7:boolean = false; // 小大七和弦
    chord_maj9:boolean = false; // 大九和弦
    chord_min9:boolean = false; // 小九和弦
    chord_9:boolean = false; // 属九和弦
    chord_aug9:boolean = false; // 增九和弦
    chord_dim9:boolean = false; // 减九和弦
    chord_9sus4:boolean = false; // 属九挂四
    chord_69:boolean = false; // 六九和弦
    chord_m69:boolean = false; // 小六九和弦
    roots:number = 0xFF; // 指定根音在哪些弦. 从右至左按位与或。
    rootMin:number = 0; // 根音的最小品
    rootMax:number = 15;  // 根音的最大品
    levels:number = 0xFFFF; // 按位于或。从右至左的12个比特位对应1至12个音数。例如1级的音数是1，#1级的音数是2, 2级的音数是3，以此类推
    intervals:number = 0xFFFF; // 最低音到最高音的音程音数(半音为一个音数)。从右至左，按位与或。
}

export default GuitarChordSearchOptions;