class Location {
    public str:number = 0;
    public index:number = 0;
    public length:number = 1;
    public finger:number = -1; // 0大拇指 1食指 2中指 3无名指 4小指
    constructor(str:number=0,index:number=0) {
        this.str = str;
        this.index = index;
    }
}

export default Location;