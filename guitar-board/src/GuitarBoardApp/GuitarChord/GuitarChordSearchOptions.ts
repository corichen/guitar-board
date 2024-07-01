import Tone from "../GuitarPlayer/Tone"

class GuitarChordSearchOptions {
    baseTone:Tone = Tone.C; // 设置首调
    natural:boolean = false;// 顺阶和弦
    chordTypes: number = 0xFFFF; // 来自枚举ChordType的按位与或
    roots:number = 0xFF; // 指定根音在哪些弦. 从右至左按位与或。
    rootMin:number = 0; // 根音的最小品
    rootMax:number = 15;  // 根音的最大品
    levels:number = 0xFFFF; // 按位于或。从右至左的12个比特位对应1至12个音数。例如1级的音数是1，#1级的音数是2, 2级的音数是3，以此类推
    intervals:number = 0xFFFF; // 最低音到最高音的音程音数(半音为一个音数)。从右至左，按位与或。
}

export default GuitarChordSearchOptions;