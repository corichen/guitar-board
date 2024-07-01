import Tone from "../GuitarPlayer/Tone";
import Location from "../GuitarPlayer/Location";
import ChordType from "./ChordType";

class Chord {
    public name:string = "";
    public notes:Location[] = [];
    public slideable: boolean = false;
    public root:number = 4; // 根音所在的弦(0-5)
    public tone:Tone|null = null;
    public get rootNote() {
        for(let i = 0 ; i < this.notes.length; ++i) {
            if(this.notes[i].str == this.root) {
                return this.notes[i];
            }
        }
        return null;
    }

    public hasNoteInString(str:number) {
        for(let i = 0 ; i < this.notes.length; ++i) {
            if(this.notes[i].str == str) {
                return true;
            }
        }
        return false;
    }

    private getNoteIndex(location:Location) {
        if(location.str == 0) {
            return 4 + location.index;
        }
        if(location.str == 1) {
            return 11 + location.index;
        }
        if(location.str == 2) {
            return 7 + location.index;
        }
        if(location.str == 3) {
            return 2 + location.index;
        }
        if(location.str == 4) {
            return 9 + location.index;
        }
        return 4 + location.index;
    }

    public get isNatural() {
        let tone = this.tone;
        if(tone == null) {
            tone = Tone.C;
        }
        let naturalSet = [0,2,4,5,7,9,11];
        for(let i = 0 ; i < this.notes.length; ++i) {
            let note = this.notes[i];
            let noteIndex = this.getNoteIndex(note) + 12;
            let noteInTone = (noteIndex - tone) % 12;
            if(naturalSet.indexOf(noteInTone) < 0) {
                return false;
            }
        }
        return true;
    }

    public isType(type:ChordType) {
       return this.type == type;
    }

    public isInTypes(types:number) {
        return (1<<this.type) & types;
    }

    public get type() : ChordType {
        if(this.isChord_2) {
            return ChordType.interval;
        }
        if(this.isChord_3) {
            return ChordType.major;
        }
        if(this.isChord_m3) {
            return ChordType.minor;
        }
        let res = /^(#|b)?[A-G]([^\/]+)/.exec(this.name);
        if(res == null) {
            return ChordType.unkown;
        }
        return ChordType[res[2] as keyof typeof ChordType];
    }

    public get isChord_2() {
        return this.notes.length == 2;
    }

    public get isChord_3() {
        return /^(#|b)?[A-G](\/(#|b)?[A-G])?$/.test(this.name);
    }

    public get isChord_m3() {
        return /^(#|b)?[A-G]m$/.test(this.name);
    }

    public get isTransform() {
        let maxStr = 0;
        for(let i = 0 ; i < this.notes.length; ++i) {
            if(this.notes[i].str > maxStr) {
                maxStr = this.notes[i].str;
            }
        }
        return this.root != maxStr;
    }

    public get isAug() {
        return this.name.indexOf("aug") > 0;
    }

    public get isDim() {
        return this.name.indexOf("dim") > 0;
    }

    public get interval() {
        let minInterval = null;
        let maxInterval = null;
        for(let i = 0 ; i < this.notes.length; ++i) {
            let interval = this.getNoteInterval(this.notes[i].str,this.notes[i].index);
            if(minInterval == null || interval < minInterval) {
                minInterval = interval;
            }
            if(maxInterval == null || interval > maxInterval) {
                maxInterval = interval;
            }
        }
        if(minInterval == null || maxInterval == null) {
            return 0;
        }
        return maxInterval - minInterval;
    }

    public static getIntervalName(interval:number) {
        let number = 0;
        let style = "";
        let segCount = Math.floor(interval / 12);
        switch(interval%12) {
            case 0:style = "纯";number = 1;break;
            case 1:style = "小";number = 2;break;
            case 2:style = "大";number = 2;break;
            case 3:style = "小";number = 3;break;
            case 4:style = "大";number = 3;break;
            case 5:style = "纯";number = 4;break;
            case 6:style = "增";number = 4;break;
            case 7:style = "纯";number = 5;break;
            case 8:style = "小";number = 6;break;
            case 9:style = "大";number = 6;break;
            case 10:style = "小";number = 7;break;
            case 11:style = "大";number = 7;break;
            case 12:style = "纯";number = 8;break;
        }
        return style + Chord.number2Text(number+7*segCount) + "度";
    }

    // 只保证100以内正确
    private static number2Text(number:number) {
        let numberArr = ["零","一","二","三","四","五","六","七","八","九"];
        let units = ["个","十","百"];
        let text = "";
        let numberText = number.toString();
        for(let i = 0;i<numberText.length;i++) {
            text += numberArr[parseInt(numberText[i])] + (i<numberText.length-1?units[numberText.length-1-i]:"") ;
        }
	    text = text.replace(/^一十/,"十");
        text = text.replaceAll(/十零/g,"十");
        return text;
    }

    public getNoteInterval(str:number,index:number) {
        if(str==5) {
            return index - 8;
        }
        if(str==4) {
            return index - 3;
        }
        if(str==3) {
            return index + 2;
        }
        if(str==2) {
            return index + 7;
        }
        if(str==1) {
            return index + 11;
        }
        return index + 16;
    }

    public get indexInTone() {
        let toneIndex = 0;
        if(this.tone != null) {
            toneIndex = this.tone;
        }
        let baseName = this.name[0];
        if(baseName == "#" || baseName == "b") {
            baseName += this.name[1];
        }
        let names = ["C","#C","D","bE","E","F","#F","G","bA","A","bB","B"];
        let nameIndex = names.indexOf(baseName) + 12;
        
        let indexInTone = (nameIndex - toneIndex) % 12;
        return indexInTone;
    }

    public get nameInTone() {
        if(this.tone == null) {
            return this.name;
        }
        let baseName = this.name[0];
        let modName = this.name.substring(1);
        if(baseName == "#" || baseName == "b") {
            baseName += this.name[1];
            modName = this.name.substring(2);
        }
        let names = ["C","#C","D","bE","E","F","#F","G","bA","A","bB","B"];
        let nameIndex = names.indexOf(baseName) + 12;
        let toneIndex = this.tone;
        let indexInTone = (nameIndex - toneIndex) % 12;
        switch(indexInTone){
            case 0:
                return "1"+modName;
            case 1:
                return "#1"+modName;
            case 2:
                return "2"+modName;
            case 3:
                return "b3"+modName;
            case 4:
                return "3"+modName;
            case 5:
                return "4"+modName;
            case 6:
                return "#4"+modName;
            case 7:
                return "5"+modName;
            case 8:
                return "b6"+modName;
            case 9:
                return "6"+modName;
            case 10:
                return "b7"+modName;
            case 11:
                return "7"+modName;
        }
        return this.name;
    }
}

export default Chord;