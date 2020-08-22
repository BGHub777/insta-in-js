import React, { useState, useEffect } from 'react';
import './Post.css';
import Avatar from "@material-ui/core/Avatar";
import { db } from './firebase'
import firebase from 'firebase'

function Post({ postId, user, caption, imageURL, username, photoURL }) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('')


    useEffect(() => {
        let unsubscribe;
        if (postId){
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'asc')
                .onSnapshot((snapshot)=> {
                    setComments(snapshot.docs.map((doc) => doc.data()))
                })
        }
        return () => {
            unsubscribe();
        };
    }, [postId])

    console.log(photoURL)

    const postComment = (e) => {
        e.preventDefault()

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" alt="Username" src={photoURL} />
                <h3>{username}</h3>
            </div>

            <img className="post__image" src={imageURL} alt="" />

            <h4 className="post__text"><strong>{username}:</strong> {caption}</h4>


                <div className="post__comments">
                    {comments.map(item =>  (
                            <div> <strong>{item.username}</strong> {item.text} </div>
                    ))}
                    
                </div>
        {user && (
            <form className="post__commentBox">
                <input 
                    className="post__input"
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{flex:"1", padding: "10px", border:"none", borderTop:"1px solid lightgray"}}
                />
                <button 
                    className="post__button"
                    disabled={!comment}
                    type="submit"
                    onClick={postComment}
                    style={{flex:"0", border:"none", borderTop:"1px solid lightgray", color:"#6082a3", backgroundColor:"transparent"}}
                > Post </button>
            </form>
        )}

        </div>
    )
}

export default Post