import Tone from "../GuitarPlayer/Tone"

class GuitarChordSearchOptions {
    baseTone:Tone = Tone.C; // 设置首调
    natural?:boolean;// 顺阶和弦
    chord2?:boolean; // 音程
    chord3?:boolean; // 三和弦
    aug?:boolean; // 增和弦
    dim?:boolean; // 渐和弦
    chord7?:boolean; // 七和弦
    sus?:boolean; // 挂二 挂四和弦
    transform?:boolean; // 转位和弦
    roots:number[] = [1,2,3,4,5]; // 指定根音在哪些弦
    rootMin?:number; // 根音的最小品
    rootMax?:number;  // 根音的最大品
    intervals:number[] = [1,2,3,4,5,6,7,8,9,10,11,12]; // 最低音到最高音的音程音数(半音为一个音数)
}

export default GuitarChordSearchOptions;