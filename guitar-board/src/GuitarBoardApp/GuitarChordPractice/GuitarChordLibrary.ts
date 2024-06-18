import Tone from "../GuitarBoard/Tone";
import Chord from "../GuitarChord/Chord";
import Location from "../GuitarPlayer/Location";

export default class GuitarChordLibrary {

    private static createRegex(noteName:string,types:string[]) {

    }

    public static searchNaturalToneChords(tone:string,options:{
        baseTone?:Tone, // 设置首调
        chord7?:boolean, // 七和弦
        sus?:boolean, // 挂二 挂四和弦
        transform?:boolean, // 转位和弦
        rootMin?:number, // 根音的最小品
        rootMax?:number   // 根音的最大品
    }) {
        let chords : Chord[] = [];
        const names = ['C',"#C","D","bE","E","F","#F","G","bA","A","bB","B"];
        let fromIndex = names.indexOf(tone);
        if(fromIndex < 0) {
            return chords;
        }

        let level1Chords = this.searchChords(new RegExp("^"+names[(fromIndex)%names.length]+`(${options.chord7?'maj7':''}|${options.sus?"sus2|sus4":""})?${options.transform?'(/.+)?':''}$`));
        let level2Chords = this.searchChords(new RegExp("^"+names[(fromIndex+2)%names.length]+`m${options.chord7?'(7)?':''}${options.transform?'(/.+)?':''}$`));
        let level3Chords = this.searchChords(new RegExp("^"+names[(fromIndex+4)%names.length]+`m${options.chord7?'(7)?':''}${options.transform?'(/.+)?':''}$`));
        let level4Chords = this.searchChords(new RegExp("^"+names[(fromIndex+5)%names.length]+`(${options.chord7?'maj7':''}|${options.sus?"sus2|sus4":""}|add6)?${options.transform?'(/.+)?':''}$`));
        let level5Chords = this.searchChords(new RegExp("^"+names[(fromIndex+7)%names.length]+`(${options.chord7?'7':''}|${options.sus?"sus2|sus4":""})?${options.transform?'(/.+)?':''}$`));
        let level6Chords = this.searchChords(new RegExp("^"+names[(fromIndex+9)%names.length]+`m${options.chord7?'(7)?':''}${options.transform?'(/.+)?':''}$`));
        let level7Chords = this.searchChords(new RegExp("^"+names[(fromIndex+11)%names.length]+`(dim|${options.chord7?'m7b5':''})${options.transform?'(/.+)?':''}$`));
        chords = chords.concat(level1Chords).concat(level2Chords).concat(level3Chords).concat(level4Chords).concat(level5Chords).concat(level6Chords).concat(level7Chords);
        
        if(options.baseTone != null) {
            chords.map((chord)=>{if(options.baseTone)chord.tone=options.baseTone;});
        }
        if(options.rootMin != null) {
            let min = options.rootMin;
            chords = chords.filter((chord)=>{if(chord.rootNote==null){return false;}return chord.rootNote.index >= min;});
        }
        if(options.rootMax != null) {
            let max = options.rootMax;
            chords = chords.filter((chord)=>{if(chord.rootNote==null){return false;}return chord.rootNote.index < max;});
        }
        return chords;
    }

    public static searchChords(namePattern:RegExp,slideChords:boolean=true) {
        let chords : Chord[] = [];
        let chordsJason = GuitarChordLibrary.chordSources;
        const names = ['C',"#C","D","bE","E","F","#F","G","bA","A","bB","B"];
        for(let i = 0 ; i < chordsJason.length; ++i) {
          let chordObj = chordsJason[i];
          let slideCount = 1;
          let slideFrom = 0;
          if(slideChords) {
            if(chordObj.slide != null && chordObj.slide > 1){
              slideCount = chordObj.slide + 1;
            }
            if(chordObj.slideFrom != null) {
              slideFrom = chordObj.slideFrom;
            }
          }
          let nameFromIndex = names.indexOf(chordObj.name[0]);
          for(let s = slideFrom ; s < slideCount + slideFrom; ++s){
            let chord = new Chord();
            chord.root = chordObj.root;
            chord.name = names[(nameFromIndex+s+names.length)%names.length]+chordObj.name.substring(1);
            for(let j = 0 ; j < chordObj.notes.length; ++j) {
              let ch = chordObj.notes[j];
              if(ch == 'x') {
                continue;
              }
              let loc = new Location();
              loc.str = 5-j;
              if(ch.charCodeAt(0) > 60) {
                loc.index = ch.charCodeAt(0) - 96 + 9 + s;
              } else {
                loc.index = parseInt(ch) + s;
              }
              chord.notes.push(loc);
            }
  
            if(namePattern == null || namePattern.test(chord.name)){
              chords.push(chord);
            }
          }
        }
        return chords;
      }

    static chordSources = [
        {
            name: "G",
            slide: 11,
            root: 5,
            notes: "320003"
        },
        {
            name: "E",
            slide: 12,
            root: 5,
            notes: "022100"
        },
        {
            name: "Gm",
            slide: 11,
            root: 5,
            notes: "3100x3"
        },
        {
            name: "Em",
            slide: 12,
            root: 5,
            notes: "022000"
        },
        {
            name: "Gsus2",
            slideFrom: -1,
            slide: 12,
            root: 5,
            notes: "3xx233"
        },
        {
            name: "Gsus4",
            slide: 11,
            root: 5,
            notes: "33xx13"
        },
        {
            name: "Gdim",
            slideFrom: -1,
            slide: 10,
            root: 5,
            notes: "3x532"
        },
        {
            name: "Gaug",
            slideFrom: -2,
            slide: 11,
            root: 5,
            notes: "3x544"
        },
        {
            name: "Cmaj7",
            slideFrom: -8,
            slide: 12,
            root: 5,
            notes: "8a99"
        },
        {
            name: "Cm7",
            slideFrom: -8,
            slide: 12,
            root: 5,
            notes: "8a88"
        },
        {
            name: "C7",
            slideFrom: -8,
            slide: 12,
            root: 5,
            notes: "8a89"
        },
       
        {
            name: "Gm7b5",
            slideFrom: -1,
            slide: 12,
            root: 5,
            notes: "3xx321"
        },


        {
            name: "C",
            slide: 11,
            root: 4,
            notes: "x3201"
        },
        {
            name: "A",
            slide: 9,
            root: 4,
            notes: "x0222"
        },
        {
            name: "Am",
            slide: 11,
            root: 4,
            notes: "x0221"
        },
        {
            name: "Csus2",
            slide: 11,
            root: 4,
            notes: "x30033"
        },
        {
            name: "Csus4",
            slide: 11,
            root: 4,
            notes: "x33011"
        },
        {
            name:"Caug",
            slide: 11,
            root: 4,
            notes: "x3211"
        },
        {
            name:"Cdim",
            slide: 11,
            root: 4,
            notes: "x3454"
        },
        {
            name: "Cmaj7",
            slide: 11,
            root: 4,
            notes: "x3200"
        },
        {
            name: "Cmaj7",
            slideFrom: -3,
            slide: 12,
            root: 4,
            notes: "x3545"
        },
        {
            name: "Cm7",
            slideFrom: -3,
            slide: 12,
            root: 4,
            notes: "x3534"
        },
        {
            name: "C7",
            slide: 9,
            root: 4,
            notes: "x3535"
        },
        {
            name: "Cm7b5",
            slideFrom: -3,
            slide: 13,
            root: 4,
            notes: "x3434"
        },
        {
            name:"E",
            slide:12,
            root: 3,
            notes:"xx2100"
        },
        {
            name:"D",
            slide:11,
            root: 3,
            notes:"xx0232"
        },
        {
            name:"Em",
            slide:12,
            root: 3,
            notes:"xx2000"
        },
        {
            name:"Dm",
            slide:11,
            root: 3,
            notes:"xx0231"
        },
        {
            name:"Dsus2",
            slide:11,
            root: 3,
            notes:"xx0230"
        },
        {
            name:"Dsus4",
            slide:11,
            root: 3,
            notes:"xx0233"
        },
        {
            name:"Daug",
            slide:11,
            root: 3,
            notes:"xx0332"
        },
        {
            name:"Faug",
            slide:11,
            root: 3,
            notes:"xx3221"
        },
        {
            name:"Ddim",
            slide:11,
            root: 3,
            notes:"xx0131"
        },
        {
            name: "G/B",
            slide: 11,
            root: 2,
            notes: "x20033"
        },
        {
            name:"Fmaj7",
            slide: 11,
            root: 3,
            notes:"xx3210"
        },
        {
            name:"Dmaj7",
            slide:12,
            root: 3,
            notes:"xx0222"
        },
        {
            name:"Dm7",
            slide:12,
            root: 3,
            notes:"xx0211"
        },
        {
            name:"D7",
            slide:12,
            root: 3,
            notes:"xx0212"
        },
        {
            name:"Dm7b5",
            slide:13,
            root: 3,
            notes:"xx0111"
        }
    ]
}


