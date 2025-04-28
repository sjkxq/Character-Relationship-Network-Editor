// 项目配置项
const config = {
    width: 1000,                 // 总画布svg的宽,单位为px,默认为容器的宽
    height: 800,                // 高，默认为容器的高
    isHighLight: true,        // 是否启动 鼠标 hover 到节点上高亮与节点有关的节点，其他无关节点透明的功能
    isScale: true,              // 是否启用缩放平移zoom功能
    scaleExtent: [0.5, 1.5],    // 缩放的比例尺
    chargeStrength: -300,        // 万有引力
    collide: 100,                 // 碰撞力的大小 （节点之间的间距）
    nodeWidth: 160,             // 每个node节点所占的宽度，正方形
    margin: 20,                 // node节点距离父亲div的margin
    alphaDecay: 0.0228,          // 控制力学模拟衰减率
    r: 45,                      // 头像的半径 [30 - 45]
    relFontSize: 12,           // 关系文字字体大小
    linkSrc: 30,                // 划线时候的弧度
    linkColor: '#bad4ed',        // 链接线默认的颜色
    strokeColor: '#7ecef4',     // 头像外围包裹的颜色
    strokeWidth: 3,             // 头像外围包裹的宽度
};

// 确保config对象在全局可用
window.config = config;