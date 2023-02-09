import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import * as tus from "tus-js-client";
import { useTus } from "./useTus";

export const Uploader = () => {
  const { upload, setUpload, isSuccess, error, remove } = useTus();
  const [progress, setProgress] = useState(0);
  const handleSetUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files.item(0);

      if (!file) {
        return;
      }
      setUpload(file, {
        endpoint: 'http://localhost:1080/files/',
        metadata: {
          filename: file.name,
          filetype: file.type,
        },
        onProgress: (bytesSent, bytesTotal) => {
          setProgress(Number(((bytesSent / bytesTotal) * 100).toFixed(2)));
        },
      });
    },
    [setUpload]
  );

  const handleStart = useCallback(() => {
    if (!upload) {
      return;
    }
    upload.findPreviousUploads().then(function (previousUploads) {
      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0])
      }

      // Start the upload
      upload.start()
    })

  }, [upload]);

  return (
    <>
      <input type={"file"} onChange={handleSetUpload}/>
      <progress id="file" max="100" value={progress}> {progress}% </progress>
      <button type="button" onClick={handleStart}>
        Upload
      </button>
    </>
  );
};
