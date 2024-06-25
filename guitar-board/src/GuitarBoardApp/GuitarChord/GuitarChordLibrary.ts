import Tone from "../GuitarPlayer/Tone";
import Chord from "./Chord";
import Location from "../GuitarPlayer/Location";
import GuitarChordSearchOptions from "./GuitarChordSearchOptions";

export default class GuitarChordLibrary {

    private static createRegex(noteName:string,types:string[]) {

    }

    public static searchNaturalToneChords(tone:string,options:GuitarChordSearchOptions) {
        let chords : Chord[] = [];
        const names = ['C',"#C","D","bE","E","F","#F","G","bA","A","bB","B"];
        let fromIndex = names.indexOf(tone);
        if(fromIndex < 0) {
            return chords;
        }

        let level1Chords = this.searchChords(new RegExp("^"+names[(fromIndex)%names.length]+".*$"));
        let level2Chords = this.searchChords(new RegExp("^"+names[(fromIndex+2)%names.length]+".*$"));
        let level3Chords = this.searchChords(new RegExp("^"+names[(fromIndex+4)%names.length]+".*$"));
        let level4Chords = this.searchChords(new RegExp("^"+names[(fromIndex+5)%names.length]+".*$"));
        let level5Chords = this.searchChords(new RegExp("^"+names[(fromIndex+7)%names.length]+".*$"));
        let level6Chords = this.searchChords(new RegExp("^"+names[(fromIndex+9)%names.length]+".*$"));
        let level7Chords = this.searchChords(new RegExp("^"+names[(fromIndex+11)%names.length]+".*$"));
        chords = chords.concat(level1Chords).concat(level2Chords).concat(level3Chords).concat(level4Chords).concat(level5Chords).concat(level6Chords).concat(level7Chords);
        
        chords.map((chord)=>{
            if(options.baseTone != null) {
                chord.tone=options.baseTone;
            } else {
             chord.tone = null;
            } 
        });

        if(options.natural != null && options.natural) {
            chords = chords.filter((chord)=>chord.isNatural);
        }
        if(options.chord_2 != null && !options.chord_2) {
            chords = chords.filter((chord)=>!chord.isChord_2);
        }
        if(options.chord_3 != null && !options.chord_3) {
            chords = chords.filter((chord)=>!chord.isChord_3);
        }
        if(options.chord_m3 != null && !options.chord_m3) {
            chords = chords.filter((chord)=>!chord.isChord_m3);
        }
        if(options.chord_aug3 != null && !options.chord_aug3) {
            chords = chords.filter((chord)=>!chord.isChord_aug3);
        }
        if(options.chord_dim3 != null && !options.chord_dim3) {
            chords = chords.filter((chord)=>!chord.isChord_dim3);
        }
        if(options.chord_sus2 != null && !options.chord_sus2) {
            chords = chords.filter((chord)=>!chord.isChord_sus2);
        }
        if(options.chord_sus4 != null && !options.chord_sus4) {
            chords = chords.filter((chord)=>!chord.isChord_sus4);
        }
        if(options.chord_maj7 != null && !options.chord_maj7) {
            chords = chords.filter((chord)=>!chord.isChord_maj7);
        }
        if(options.chord_m7 != null && !options.chord_m7) {
            chords = chords.filter((chord)=>!chord.isChord_m7);
        }
        if(options.chord_m7b5 != null && !options.chord_m7b5) {
            chords = chords.filter((chord)=>!chord.isChord_m7b5);
        }
        if(options.chord_7 != null && !options.chord_7) {
            chords = chords.filter((chord)=>!chord.isChord_7);
        }
        if(options.chord_mM7 != null && !options.chord_mM7) {
            chords = chords.filter((chord)=>!chord.isChord_mM7);
        }
        
        if(options.roots != null) {
            chords = chords.filter((chord)=>{if(options.roots==null)return true;return options.roots.indexOf(chord.root)>=0;});
        }
        if(options.rootMin != null) {
            let min = options.rootMin;
            chords = chords.filter((chord)=>{if(chord.rootNote==null){return false;}return chord.rootNote.index >= min;});
        }
        if(options.rootMax != null) {
            let max = options.rootMax;
            chords = chords.filter((chord)=>{if(chord.rootNote==null){return false;}return chord.rootNote.index < max;});
        }
        if(options.intervals != null) {
            chords = chords.filter((chord)=>{if(options.intervals==null || chord.notes.length != 2)return true;return options.intervals.indexOf(chord.interval)>=0;});
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
          
          for(let s = slideFrom ; s < slideCount + slideFrom; ++s){
            let chord = new Chord();
            chord.slideable = slideCount > 1;
            chord.root = chordObj.root;
            let newname = "";
            for(let k = 0 ; k < chordObj.name.length; ++k) {
                let namec = chordObj.name[k];
                const nameRegex = /^(b|#)?[A-G]/;
                let match = nameRegex.exec(chordObj.name.substring(k));
                if(match != null) {
                    namec = match[0];
                    k+=namec.length-1;
                    let nameFromIndex = names.indexOf(namec);
                    let newnamec = names[(nameFromIndex+s+names.length)%names.length];
                    newname += newnamec;
                } else {
                    newname += namec;
                }
            }
            chord.name = newname;
            let str = 0;
            for(let j = 0 ; j < chordObj.notes.length; ++j) {
              let ch = chordObj.notes[j];
              if(ch == 'x') {
                str++;
                continue;
              }
              if(ch == '_') {
                if(chord.notes.length > 0) {
                    chord.notes[chord.notes.length-1].length++;
                }
                continue;
              }
              let loc = new Location();
              loc.str = 5-str;
              if(ch.charCodeAt(0) > 60) {
                loc.index = ch.charCodeAt(0) - 96 + 9 + s;
              } else {
                loc.index = parseInt(ch) + s;
              }
              chord.notes.push(loc);
              str++;
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
            name: "GA",
            slide: 11,
            root:5,
            notes:"30"
        },
        {
            name: "AbB",
            slideFrom: -1,
            slide: 10,
            root:5,
            notes:"51"
        },
        {
            name: "GbB",
            slideFrom: -1,
            slide: 12,
            root:5,
            notes:"31"
        },
        {
            name: "GB",
            slideFrom: -2,
            slide: 13,
            root:5,
            notes:"32"
        },
        {
            name: "GC",
            slideFrom: -3,
            slide: 14,
            root:5,
            notes:"33"
        },
        {
            name: "G#C",
            slideFrom: -3,
            slide: 13,
            root:5,
            notes:"34"
        },
        {
            name: "GD",
            slideFrom: -3,
            slide: 12,
            root:5,
            notes:"35"
        },
        {
            name: "GD",
            slideFrom: 0,
            slide: 11,
            root:5,
            notes:"3x0"
        },
        {
            name: "GbE",
            slideFrom: -3,
            slide: 11,
            root:5,
            notes:"36"
        },
        {
            name: "GbE",
            slideFrom: -1,
            slide: 12,
            root:5,
            notes:"3x1"
        },
        {
            name: "GE",
            slideFrom: -2,
            slide: 13,
            root:5,
            notes:"3x2"
        },
        {
            name: "G#F",
            slideFrom: -3,
            slide: 13,
            root:5,
            notes:"3x4"
        },
        {
            name: "GG",
            slideFrom: -3,
            slide: 12,
            root:5,
            notes:"3x5"
        },
        {
            name: "GG",
            slideFrom: 0,
            slide: 11,
            root:5,
            notes:"3xx0"
        },
        {
            name: "DbE",
            slideFrom: -1,
            slide: 9,
            root:4,
            notes:"x51"
        },
        {
            name: "CD",
            slideFrom: 0,
            slide: 11,
            root:4,
            notes:"x30"
        },
        {
            name: "CbE",
            slideFrom: -1,
            slide: 12,
            root:4,
            notes:"x31"
        },
        {
            name: "CE",
            slideFrom: -2,
            slide: 13,
            root:4,
            notes:"x32"
        },
        {
            name: "CF",
            slideFrom: -3,
            slide: 14,
            root:4,
            notes:"x33"
        },
        {
            name: "C#F",
            slideFrom: -3,
            slide: 13,
            root:4,
            notes:"x34"
        },
        {
            name: "DbE",
            slideFrom: -1,
            slide: 10,
            root:4,
            notes:"x51"
        },
        {
            name: "CG",
            slideFrom: -3,
            slide: 12,
            root:4,
            notes:"x35"
        },
        {
            name: "CG",
            slideFrom: 0,
            slide: 11,
            root:4,
            notes:"x3x0"
        },
        {
            name: "CbA",
            slideFrom: -3,
            slide: 11,
            root:4,
            notes:"x36"
        },
        {
            name: "CbA",
            slideFrom: -1,
            slide: 12,
            root:4,
            notes:"x3x1"
        },
        {
            name: "CA",
            slideFrom: -2,
            slide: 13,
            root:4,
            notes:"x3x2"
        },
        {
            name: "CbB",
            slideFrom: -3,
            slide: 14,
            root:4,
            notes:"x3x3"
        },
        {
            name: "CB",
            slideFrom: -3,
            slide: 13,
            root:4,
            notes:"x3x4"
        },
        {
            name: "CB",
            slideFrom: 0,
            slide: 11,
            root:4,
            notes:"x3xx0"
        },
        {
            name: "CC",
            slideFrom: -3,
            slide: 12,
            root:4,
            notes:"x3x5"
        },
        {
            name: "CC",
            slideFrom: -1,
            slide: 12,
            root:4,
            notes:"x3xx1"
        },
        {
            name:"GbA",
            slideFrom: -1,
            slide:10,
            root:3,
            notes:"xx51"
        },
        {
            name:"FG",
            slide:11,
            root:3,
            notes:"xx30"
        },
        {
            name:"FbA",
            slideFrom:-1,
            slide:12,
            root:3,
            notes:"xx31"
        },
        {
            name:"FA",
            slideFrom:-2,
            slide:13,
            root:3,
            notes:"xx32"
        },
        {
            name: "G",
            slide: 0,
            root: 5,
            notes: "320__003"
        },
        {
            name: "E",
            slide: 12,
            root: 5,
            notes: "0_____2_2100"
        },
        {
            name: "Em",
            slide: 12,
            root: 5,
            notes: "0_____22000"
        },
        {
            name: "Gsus2",
            slide: 0,
            root: 5,
            notes: "300033"
        },
        {
            name: "Gsus4",
            slide: 0,
            root: 5,
            notes: "330013"
        },
        {
            name: "Gsus4",
            slide: 0,
            root: 5,
            notes: "3_____5__5533"
        },
        {
            name: "Gdim",
            slideFrom: -2,
            slide: 11,
            root: 5,
            notes: "3x532"
        },
        {
            name: "Gaug",
            slideFrom: -3,
            slide: 12,
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


