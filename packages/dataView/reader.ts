import { data } from "./bigArray";

var buffer = new ArrayBuffer(4);
var uint8Array = new Uint8Array(buffer);
uint8Array[0] = 131;
uint8Array[1] = 190;
uint8Array[2] = 225;
uint8Array[3] = 64;

// // 使用Float32Array读取为32位浮点数
// var float32Array = new Float32Array(buffer);
// var value = float32Array[0];

// console.log(value); // 输出原始的浮点数值



var buffer = new ArrayBuffer(1497800);

let view = new Uint8Array(buffer,196,data.length);

for (let i = 0; i < data.length; i++) {
    view[i] = data[i];
}

const v = new DataView(view.buffer, view.byteOffset, view.byteLength)
console.log(v)

//小端序
console.log(v.getFloat32(0, true));
