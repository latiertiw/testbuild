block=document.querySelector('.search-result-block .searched-videos');
button=document.querySelector('.search-block .search-button');
outBlock=document.querySelector('.video-block .output-video-block');
searchInput=document.querySelector('.search-block .search-input');
pageRight=document.querySelector('.page-switcher .page-right');
pageLeft=document.querySelector('.page-switcher .page-left');
numberOfPages=document.querySelector('.page-switcher .current-page');

let baseUrl ="https://www.googleapis.com/youtube/v3/search?key=AIzaSyC0vey-MWqac8d52xu5VWF1r6q3e59xI0Q&type=video&part=snippet&maxResults=8";
let baseSUrl='https://www.googleapis.com/youtube/v3/videos?key=AIzaSyC0vey-MWqac8d52xu5VWF1r6q3e59xI0Q&id=';
let Url;


let bufferedVideos=[];
let pages=[];
let loadedCount=0;
let nextPageToken='';
let lastSearch;
let currentPage=0;



button.addEventListener("click", search);
window.addEventListener('resize', resize);

function load(){
    Url=baseUrl+'&pageToken='+nextPageToken+'&q='+lastSearch;
    fetch(Url)
    .then(res => res.text())
    .then(res=>{    
       let answer=JSON.parse(res);
       nextPageToken=answer.nextPageToken;
       for(let loadQuerry=0;loadQuerry<8;loadQuerry++){

        let card=new Object();

        card.imageSource=answer.items[loadQuerry].snippet.thumbnails.medium.url
        card.channelTitle=answer.items[loadQuerry].snippet.channelTitle;
        card.videoDescription=answer.items[loadQuerry].snippet.description;
        card.videoTitle=answer.items[loadQuerry].snippet.title;
        card.publishedTime=answer.items[loadQuerry].snippet.publishedAt;
        card.videoId=answer.items[loadQuerry].id.videoId;
        
            Url=baseSUrl+card.videoId+'&part=snippet,statistics';
            fetch(Url)
            .then(res => res.text())
            .then(res => {
                let answer=JSON.parse(res);
            
                card.viewCount=answer.items[0].statistics.viewCount;
                card.likeCount=answer.items[0].statistics.likeCount;
                card.dislikeCount=answer.items[0].statistics.dislikeCount;

                bufferedVideos.push(card);
        })
        
        loadedCount++;
       }
       setTimeout(function(){resize()},1000);
       console.log('load waw loaded');
    })
}

function search(){
    pageRight.addEventListener("click", nextPage);
    pageLeft.addEventListener("click", prevPage);
    bufferedVideos=[];
    nextPageToken='';
    lastSearch=searchInput.value;
    Url=baseUrl+'&pageToken='+nextPageToken+'&q='+searchInput.value;
    fetch(Url)
    .then(res => res.text())
    .then(res=>{    
       let answer=JSON.parse(res);
       nextPageToken=answer.nextPageToken;
       for(let loadQuerry=0;loadQuerry<8;loadQuerry++){

        let card=new Object();

        card.imageSource=answer.items[loadQuerry].snippet.thumbnails.medium.url
        card.channelTitle=answer.items[loadQuerry].snippet.channelTitle;
        card.videoDescription=answer.items[loadQuerry].snippet.description;
        card.videoTitle=answer.items[loadQuerry].snippet.title;
        card.publishedTime=answer.items[loadQuerry].snippet.publishedAt;
        card.videoId=answer.items[loadQuerry].id.videoId;
        
            Url=baseSUrl+card.videoId+'&part=snippet,statistics';
            fetch(Url)
            .then(res => res.text())
            .then(res => {
                let answer=JSON.parse(res);
            
                card.viewCount=answer.items[0].statistics.viewCount;
                card.likeCount=answer.items[0].statistics.likeCount;
                card.dislikeCount=answer.items[0].statistics.dislikeCount;

                bufferedVideos.push(card);
        })
        
        loadedCount++;
       }
       setTimeout(function(){resize()},1000);
       console.log('search was loaded')
    })
   
    
    

}



function cleanSearchBlock(){
    while(block.firstChild){
        block.removeChild(block.firstChild);
    }
}

function createPages(size){
    let pagesCount=Math.ceil(bufferedVideos.length/size);
    pages=[];
    
    let placed=0;
    for(let i=0;i<pagesCount;i++){
        pages[i]=[];
        for(let j=0; j<size;j++){
            if(placed<bufferedVideos.length){
                pages[i].push(bufferedVideos[placed]);
                placed++;
            }
        }
    }
    console.log('Create pages was created');
}

function renderPage(number){
    let urlVideoBase='https://www.youtube.com/embed/';
   // console.log('start');
    for (let i=0;i<pages[number].length;i++){
        item=document.createElement('img');
        item.className='searched-video';
        
        item.alt=urlVideoBase+ pages[number][i].videoId;
        item.src=pages[number][i].imageSource;
            item.addEventListener("click", select);
        block.appendChild(item);
    }
  //  console.log('end');
}

function nextPage(){
    currentPage += 1;
    if(currentPage>=pages.length){
        load();
    }
    //setTimeout(function(){resize()},1000);
    resize()
}

function prevPage(){
    if(currentPage !==0 ){
        currentPage -= 1;
    }
    //setTimeout(function(){resize()},1000);
    resize()
}

function resize(){
     cleanSearchBlock();
     console.log(pages.length)
     numberOfPages.textContent=currentPage+1;
     if(document.body.clientWidth>1000){
         createPages(8);
         renderPage(currentPage);
     }
     else if(document.body.clientWidth>800){
         createPages(6);
         renderPage(currentPage);
    }
     else if(document.body.clientWidth>730){
         createPages(4);
         renderPage(currentPage);
    }
     else if(document.body.clientWidth>550){
         createPages(3)
         renderPage(currentPage);
        }
     else{
         createPages(2);
         renderPage(currentPage);
        }
}

function select(){
    outBlock.src=this.alt;
}