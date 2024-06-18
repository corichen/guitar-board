import Tone from "../GuitarBoard/Tone";
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