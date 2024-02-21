const categories = document.getElementById("category_div");
const video_div = document.getElementById("video_div");

function get() {
  fetch("https://openapi.programming-hero.com/api/videos/categories")
    .then((res) => res.json())
    .then((doc) => {
      doc.data.forEach((element, index) => {
        const categoryDiv = document.createElement("button");
        categoryDiv.className = "category";
        if (index === 0) {
          categoryDiv.classList.add("active");
        }
        categoryDiv.addEventListener("click", () => {
          loadData(element.category_id);
          document.querySelectorAll(".category").forEach((btn) => {
            btn.classList.remove("active");
          });
          categoryDiv.classList.add("active");
        });

        categoryDiv.innerHTML = `
            <div id="cat" class="bg-gray-300 px-2 py-1 rounded">
                ${element.category}
            </div>`;

        categories.appendChild(categoryDiv);
      });
    });
}
get();

const globaldata = [];

const loadData = (id) => {
  console.log(id);
  fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      globaldata.length = 0;
      globaldata.push(...data.data);

      displayData(globaldata);
    });
};

const displayData = (data) => {
  video_div.innerHTML = "";

  if (data.length === 0) {
    const noVideosMessage = document.createElement("div");
    noVideosMessage.innerHTML = `
         <div class="text-center flex flex-col justify-center items-center place-items-center">
         <img src="./Icon.png" alt="No videos available">
         <h3>Oops!!Sorry,There is no<br>content here..</h3>
         </div>
     `;
    video_div.appendChild(noVideosMessage);
  } else {
    data.forEach((data) => {
      const card = document.createElement("div");
      const isVerified = data.authors[0].verified;
      card.innerHTML = `
        <div class="">
          <div class="flex justify-center relative rounded-lg overflow-hidden h-52">
            <div class="transition-transform duration-500 transform ease-in-out hover:scale-110 w-full">
              <div class="absolute inset-0 bg-black opacity-90">
              <img src=${data.thumbnail} alt="">
              </div>
            </div>
            ${
              data.others.posted_date != ""
                ? `
                <span class="absolute bottom-2 right-5 inline-flex mt-3 ml-3 px-3 py-1 rounded-lg z-10 bg-black text-sm font-medium text-white select-none">
                <small class="block">
            ${
              msToTime(parseInt(data.others.posted_date))[0] != 0
                ? msToTime(parseInt(data.others.posted_date))[0] + " hours "
                : ""
            }
            ${
              msToTime(parseInt(data.others.posted_date))[1] != 0
                ? msToTime(parseInt(data.others.posted_date))[0] + " minutes "
                : ""
            }
            ${
              msToTime(parseInt(data.others.posted_date))[2] != 0
                ? msToTime(parseInt(data.others.posted_date))[2] + " seconds "
                : ""
            }
            ago
            </small></span>`
                : ""
            }
            
          </div>
          <div class="grid grid-cols-2 mt-1">
            <div class="flex items-center">
              <div class="relative">
                <div class="rounded-full w-6 h-6 md:w-8 md:h-8">
                    <img class="rounded-full w-8 h-8" src=${
                      data.authors[0]?.profile_picture
                    } alt="profile image">
                </div>
                <span class="absolute top-0 right-0 inline-block w-3 h-3 bg-primary-red rounded-full"></span>
              </div>
             
              <p class="ml-2 font-bold text-gray-800 line-clamp-1">
                ${data?.title}
              </p>
              ${isVerified ? "<img class='w-5 h-5' src='./verify.png'>" : ""}
            </div>
          </div>
          <div class="ml-10">
          <p class="text-xs">${data.authors[0].profile_name}</p>
          <p class="text-gray-500 text-xs mt-2">${data.others.views} views</p>
          </div>
        </div>
          
            `;
      video_div.appendChild(card);
    });
  }
};

loadData(1000);
let dec = true;
const sortByView = () => {
  if (dec) {
    globaldata.sort(
      (a, b) => parseFloat(b.others.views) - parseFloat(a.others.views)
    );
    dec = false;
  } else {
    globaldata.sort(
      (a, b) => parseFloat(a.others.views) - parseFloat(b.others.views)
    );
    dec = true;
  }

  displayData(globaldata);
};

function msToTime(s) {
  function get(n, z) {
    z = z || 2;
    return ("00" + n).slice(-z);
  }
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return [get(hrs), get(mins), get(secs), get(s, 3)];
}
