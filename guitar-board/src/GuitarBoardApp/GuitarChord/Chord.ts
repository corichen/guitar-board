import Tone from "../GuitarPlayer/Tone";
import Location from "../GuitarPlayer/Location";

class Chord {
    public name:string = "";
    public notes:Location[] = [];
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

    public get isChord_2() {
        return this.notes.length == 2;
    }

    public get isChord_3() {
        return /^(#|b)?[A-G](\/(#|b)?[A-G])?$/.test(this.name);
    }

    public get isChord_m3() {
        return /^(#|b)?[A-G]m$/.test(this.name);
    }

    public get isChord_aug3() {
        return /^(#|b)?[A-G]aug$/.test(this.name);
    }

    public get isChord_dim3() {
        return /^(#|b)?[A-G]dim$/.test(this.name);
    }

    public get isChord_sus2() {
        return /^(#|b)?[A-G]sus2$/.test(this.name);
    }

    public get isChord_sus4() {
        return /^(#|b)?[A-G]sus4$/.test(this.name);
    }

    public get isChord_maj7() {
        return  /^(#|b)?[A-G]maj7$/.test(this.name);
    }

    public get isChord_m7() {
        return  /^(#|b)?[A-G]m7$/.test(this.name);
    }

    public get isChord_m7b5() {
        return  /^(#|b)?[A-G]m7b5$/.test(this.name);
    }

    public get isChord_7() {
        return  /^(#|b)?[A-G]7$/.test(this.name);
    }

    public get isChord_mM7() {
        return  /^(#|b)?[A-G]mM7$/.test(this.name);
    }

    public get isSus() {
        return this.name.indexOf("sus") > 0;
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

    public get levelInTone() {
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
        switch(indexInTone){
            case 0:case 1:
                return 1;
            case 2:
                return 2;
            case 3:case 4:
                return 3;
            case 5:case 6:
                return 4;
            case 7:
                return 5;
            case 8:case 9:
                return 6;
            case 10:case 11:
                return 7;
        }
        return 0;
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