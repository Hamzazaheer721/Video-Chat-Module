

const videoGrid = document.getElementById('video-grid')
const socket = io('/');
var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443',    //changing from 3030 to 443 during deployment 
  // when you are running on your local server
  // change this port to 3030
}); 

const myVideo = document.createElement('video');
// myVideo.muted = true;
myVideo.setAttribute('muted', '');



let myVideoStream;

var constraints = { video: true, audio: true };

navigator.mediaDevices.getUserMedia(constraints)
  .then(stream => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream);

        peer.on('call', (call) => {
          console.log('guss gaya call mein')
          call.answer(stream);
          const video = document.createElement('video');
          call.on('stream', userVideoStream => {
              console.log("user stream" ,userVideoStream);
              addVideoStream(video, userVideoStream)
          })
        })

        socket.on('user-connected', userId => {
          console.log("got it")
          console.log(userId)
          connecToNewUser(userId, stream);
        })
    })
  .catch(e => console.error(e));
  

peer.on ('open', id =>{
  socket.emit('join-room', ROOM_ID, id);  // calling the function in server.js with arguement
})





// stream of other user
const connecToNewUser = (userId, stream) => {
  let call = peer.call(userId, stream);
  let video = document.createElement('video');
  call.on('stream', userVideoStream => {  
    addVideoStream(video, userVideoStream)
  })   
}



const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=>{
        video.play();
    })
    console.log("agaya")
    videoGrid.append(video);
}

let text = $('input');
console.log("hey" ,text)

$('html').keydown(e => {
  if(e.which == 13 && text.val().length !==0){
    // console.log(text)
    console.log(text.val())
    socket.emit('message', text.val());
    text.val('');
  }
})

//receiving message we sent to server in jquery function

socket.on('createMessage', message => {
  // console.log('this is coming from server')
  $('ul').append(`<li class = "message">
      <b>user</b>
      <br/>
      ${message}
  </li>`);
  scrollToBottom();
})

const scrollToBottom = () => {
  let d = $('.main_chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}

// Mute your video
const muteUnmute = () =>{
  let enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled){
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  }
  else{
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}
const setMuteButton = () => {
  const html = `
  <i class="fas fa-microphone"></i>
  <span>Mute</span>
  `;
  document.querySelector('.main_mute_button').innerHTML = html;
}
const setUnmuteButton = () => {
  const html = `
  <i class="unmute fas fa-microphone-slash"></i>
  <span>Unmute</span>
  `;
  document.querySelector('.main_mute_button').innerHTML = html;
}


const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled; 
  if (enabled){
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  }
  else{
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setStopVideo = () =>{
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `;
  document.querySelector('.main_video_button').innerHTML = html;
}

const setPlayVideo = () =>{
  const html = `
    <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `;
  document.querySelector('.main_video_button').innerHTML = html;
}