import React, { useState } from 'react';
import { Button } from "@material-ui/core";
import { storage, db } from "./firebase";
import firebase from "firebase";

function Uploader({ username, photoURL }){

    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
        // e.target.files[0] ? (
        //     setImage(e.target.files[0])
        // ) : (
        //     setImage(null)
        // )
    }
    const handleUpload = () => {
        const uploadItem = storage.ref(`images/${image.name}`).put(image)

        uploadItem.on("state_changed",
        (snapshot) => {
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
            },
            err => console.log(err),
            () => {
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageURL: url,
                        username: username,
                        photoURL: photoURL
                    });
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                })
            }
            )
        }

    return (
        <div>

            <progress
            value={progress}
            max="100"
            />

            <input 
            type="text" 
            placeholder="Enter a caption... (140 characters)"
            onChange={e => setCaption(e.target.value)}
            />

            <input
            type="file" 
            onChange={handleChange}
            />

            <Button onClick={handleUpload}> Upload </Button>
        </div>
    )
}

export default Uploader; 