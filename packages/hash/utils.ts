import SparkMD5 from "spark-md5";
import { createMD5 } from "hash-wasm";

/**
 * 获取文件的hash值，即md5值
 * @param file 要分割的文件对象
 * @param chunkSize 分片大小，默认每片大小为为3M
 * @returns
 */
const hashFile = (file: File, chunkSize: number = 3 * 1024 * 1024) => {
  const blobSlice = File.prototype.slice;
  return new Promise((resolve, reject) => {
    const chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();

    function loadNext() {
      const start = currentChunk * chunkSize;
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }

    fileReader.onload = (e) => {
      if (e.target && e.target.result) {
        spark.append(e.target.result as ArrayBuffer); // Append array buffer
        currentChunk += 1;
        if (currentChunk < chunks) {
          loadNext();
        } else {
          const result = spark.end();
          // 如果单纯的使用result 作为hash值的时候, 如果文件内容相同，而名称不同的时候
          // 想保留两个文件无法保留。所以把文件名称加上。
          const sparkMd5 = new SparkMD5();
          sparkMd5.append(result);
          sparkMd5.append(file.name);
          const hexHash = sparkMd5.end();
          resolve(hexHash);
        }
      }
    };

    fileReader.onerror = (err) => {
      reject(err);
    };
    loadNext();
  }).catch((err) => {
    console.log(err);
  });
};

const hashFileByWasm = (file: File, chunkSize: number = 3 * 1024 * 1024) => {
  const blobSlice = File.prototype.slice;
  return new Promise(async (resolve, reject) => {
    const chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    const md5 = await createMD5();
    md5.init();
    const fileReader = new FileReader();

    function loadNext() {
      const start = currentChunk * chunkSize;
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }

    fileReader.onload = (e) => {
      if (e.target && e.target.result) {
        const view = new Uint8Array(e.target.result as ArrayBuffer);
        md5.update(view);
        currentChunk += 1;
        if (currentChunk < chunks) {
          loadNext();
        } else {
          const result = md5.digest();
          resolve(result);
        }
      }
    };

    fileReader.onerror = (err) => {
      reject(err);
    };
    loadNext();
  }).catch((err) => {
    console.log(err);
  });
};

const hashFileByWebWorker = (file: File, chunkSize: number = 2 * 1024 * 1024) => {
  let chunks: any[] = [];
  let cur = 0;
  while (cur < file.size) {
    chunks.push(file.slice(cur, cur + chunkSize));
    cur += chunkSize;
  }

  return new Promise((resolve) => {
    // web-worker 防止卡顿主线程
    const workder = new Worker(new URL("./hashWorker.ts", import.meta.url));
    workder.postMessage({ chunks });
    workder.onmessage = (e) => {
      const { progress, hash } = e.data;
      if (hash) {
        resolve({ hashValue: hash, progress });
      }
    };
  });
};

/**
 *
 * @param startByte 分片起始位置
 * @param endByte 分片结束位置
 * @returns
 */
const blobSlice = (startByte: number, endByte: number) => {
  const blob = new Blob();
  if (blob.slice) {
    return blob.slice(startByte, endByte);
  }
  return null;
};

export { hashFile, blobSlice, hashFileByWebWorker, hashFileByWasm };
