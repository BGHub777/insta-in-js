import React, { useState } from 'react';
import { Button } from "@material-ui/core";
import { storage, db } from "./firebase";
import firebase from "firebase";
import './Uploader.css'

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
        <center style={{display:"flex", justifyContent:"center", alignContent:"center", alignItems:"center", justifyItems:"center"}}>
        <div style={{display:"flex", flexDirection:"column", border:"1px solid lightgray", padding:"10px"}}>

            <center>
                <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="insta-logo" style={{margin:"15px 0 15px 0"}}/>
            </center>

                <input
                type="file" 
                onChange={handleChange}
                style={{margin: "0 0 0 15%"}}
                />


            <input 
            type="text" 
            placeholder="Enter a caption... (140 characters)"
            onChange={e => setCaption(e.target.value)}
            style={{padding:"10px 0 10px 0", margin:"10px 0 10px 0", alignContent:"center"}}
            />

            <progress
            value={progress}
            max="100"
            className="uploader__progress"
            style={{height: "50px"}}
            placeholder="test..."
            />

            <Button onClick={handleUpload} style={{fontSize:"1rem", border:"1px solid orange", margin:"10px 0 5px 0"}}> POST! </Button>
        </div>
        </center>
    )
}

export default Uploader; 