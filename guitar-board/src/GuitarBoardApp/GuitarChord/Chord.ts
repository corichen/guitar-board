import Location from "../GuitarPlayer/Location";

class Chord {
    public name:string = "";
    public notes:Location[] = [];
    public root:number = 4; // 根音所在的弦(0-5)
}

export default Chord;