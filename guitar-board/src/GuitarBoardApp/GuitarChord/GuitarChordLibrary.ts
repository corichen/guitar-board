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

        for(let interval = 0 ; interval < 12; ++interval) {
            if(options.levels & (1<<interval)) {
                chords = chords.concat(this.searchChords(new RegExp("^"+names[(fromIndex+interval)%names.length]+".*$")));
            }
        }

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
        if(options.chordTypes != null) {
            chords = chords.filter((chord)=>chord.isInTypes(options.chordTypes));
        }
        
        if(options.roots != null) {
            chords = chords.filter((chord)=>{if(options.roots==null)return true;return options.roots & (1<<chord.root);});
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
            chords = chords.filter((chord)=>{if(options.intervals==null || chord.notes.length != 2)return true;return options.intervals & (1<<chord.interval);});
        }
        return chords;
    }

    private static chords : Chord[] = [];

    public static searchChords(namePattern:RegExp) {
        let chords : Chord[] = this.buildChords();
        if(namePattern != null) {
            chords = chords.filter(chord=>namePattern.test(chord.name));
        }
        return chords;
      }


      private static buildChords() :Chord[]{
        let chords : Chord[] = GuitarChordLibrary.chords;
        if(chords.length > 0) {
            return chords;
        }
        let chordsJason = GuitarChordLibrary.chordSources;
        const names = ['C',"#C","D","bE","E","F","#F","G","bA","A","bB","B"];
        for(let i = 0 ; i < chordsJason.length; ++i) {
          let chordObj = chordsJason[i];
          let slideCount = 1;
          let slideFrom = 0;
            if(chordObj.slide != null && chordObj.slide > 1){
                slideCount = chordObj.slide + 1;
            }
            if(chordObj.slideFrom != null) {
                slideFrom = chordObj.slideFrom;
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
              if(/[A-E]/.test(ch)) {
                if(chord.notes.length > 0) {
                    chord.notes[chord.notes.length-1].finger = ch.charCodeAt(0) - 'A'.charCodeAt(0);
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
            chords.push(chord);
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
            notes: "3D2C0003E"
        },
        {
            name: "E",
            slide: 12,
            root: 5,
            notes: "0B_____2D_2E1C00"
        },
        {
            name: "C",
            slide: 11,
            root: 4,
            notes: "x3E2D0B__1C0"
        },
        {
            name: "A",
            slide: 9,
            root: 4,
            notes: "x0B____2C2D2E0"
        },
        {
            name:"E",
            slide:12,
            root: 3,
            notes:"xx2D1C0_B0"
        },
        {
            name:"D",
            slide:11,
            root: 3,
            notes:"xx0B___2C3E2D"
        },
        {
            name: "Em",
            slide: 12,
            root: 5,
            notes: "0_____22000"
        },
        {
            name: "Gm",
            slide: 11,
            root: 5,
            notes: "310_0"
        },
        {
            name: "Am",
            slide: 11,
            root: 4,
            notes: "x0____221"
        },
        {
            name:"Em",
            slide:12,
            root: 3,
            notes:"xx20__00"
        },
        {
            name:"Dm",
            slide:11,
            root: 3,
            notes:"xx0231"
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
            slideFrom: 0,
            slide: 1,
            root: 5,
            notes: "321003"
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
            slideFrom: -3,
            slide: 12,
            root: 4,
            notes: "x3454"
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
            name: "Cdom7",
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
            name: "Cdom7",
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
            name:"Ddom7",
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


