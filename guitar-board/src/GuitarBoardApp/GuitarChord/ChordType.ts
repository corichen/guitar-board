enum ChordType {
    unkown,
    interval, // 两个音组成的音程
    major, // 大三和弦
    minor, // 小三和弦
    aug, // 增三和弦
    dim, // 减三和弦
    sus2, // 挂二和弦
    sus4, // 挂四和弦
    maj7, // 大七和弦
    m7, // 小七和弦
    dom7, // 属七和弦
    mM7, // 小大七和弦
    m7b5, // 半减七和弦
    dim7 // 减七和弦
}

export default ChordType;