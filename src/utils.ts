import { storage, TaskEvent, TaskState } from './firebase';

export function compressImage(
    file: File,
    maxSize?: { width: number, height: number },
): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const img = document.createElement('img');

    return new Promise((resolve, reject) => {
        img.onload = () => {
            let width = img.width;
            let height = img.height;

            if (maxSize !== undefined) {
                if (width > height) {
                    if (width > maxSize.width) {
                        height = Math.round((height *= maxSize.width / width));
                        width = maxSize.width;
                    }
                } else {
                    if (height > maxSize.height) {
                        width = Math.round((width *= maxSize.height / height));
                        height = maxSize.height;
                    }
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                resolve(blob!);
            }, 'image/jpeg', 0.7);
        };
        img.onerror = (err) => {
            reject(err);
        };
        img.src = window.URL.createObjectURL(file);
    });
}

export function uploadFile(
    file: File | Blob,
    path: string,
    progressCallback: (progress: number) => void,
): Promise<string> {
    const storageRef = storage.ref();
    const fileRef = storageRef.child(path);
    const uploadTask = fileRef.put(file);

    return new Promise((resolve, reject) => {
        uploadTask.on(TaskEvent.STATE_CHANGED,
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('File upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case TaskState.PAUSED:
                        console.log('File upload is paused');
                        break;
                    case TaskState.RUNNING:
                        console.log('File upload is running');
                        break;
                }
                progressCallback(progress);
            }, (err) => {
                reject(err);
            }, () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log('File available at', downloadURL);

                    resolve(downloadURL);
                });
            },
        );
    });
}

export function deleteFileFromDownloadURL(downloadURL: string): Promise<void> {
    const ref = storage.refFromURL(downloadURL);
    return ref.delete();
}

export function randomImgSrc(seed: string, blur: number = 0): string {
    return `https://picsum.photos/seed/${seed}/640/360?blur=${blur} `
}