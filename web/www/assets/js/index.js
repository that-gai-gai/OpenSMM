import {
  getTwitterAccounts,
  postScheduledPost,
  getPosts,
  deletePost,
} from "./api.js";
import { popUp, closePopup } from "./modules/modal-popup.js";
import {
  dropDown,
  accordian,
  iconButton,
  multiAdd,
} from "./modules/buttons.js";
import { prompt, closePrompt } from "./modules/prompt.js";
//import Validate from "./validate.js";
import { popMsg } from "./modules/popup-message.js";
import { loading } from "./modules/loading.js";
import { gallery } from "./modules/gallery.js";
import { dot } from "./modules/tags.js";
import { changeTheme } from "./modules/themes.js";
import { rtk } from "./tasks.js";
import { nav } from "./nav.js";
nav('home')
changeTheme();

//const validate = new Validate();
loading();

// UI
let appScreen = document.getElementById("appScreen");
appScreen.className = "app-screen";

// add account button
let addBtn = document.createElement("button");
addBtn.className = "button1";
addBtn.innerText = "Add Account";
addBtn.addEventListener("click", async () => {
  choosePlatform();
});
appScreen.appendChild(addBtn);
let accounts = document.createElement("div");
accounts.className = "accounts";
appScreen.appendChild(accounts);

// accounts overview
let twitterAccount = document.createElement("div");
twitterAccount.className = "account";
twitterAccount.style.background = "#1DA1F2";
let accountIcon = document.createElement("ion-icon");
accountIcon.className = "icon";
accountIcon.name = "logo-twitter";
twitterAccount.appendChild(accountIcon);
accounts.appendChild(twitterAccount);
let accountCount = document.createElement("h1");
accountCount.className = "text";
accountCount.innerText = "0";
twitterAccount.appendChild(accountCount);

// schedule post button
let postBtn = document.createElement("button");
postBtn.className = "button1";
postBtn.innerText = "Schedule a Post";
postBtn.style.marginTop = "20px";
postBtn.style.marginBottom = "15px";
postBtn.addEventListener("click", async () => {
  newPost();
});
appScreen.appendChild(postBtn);

// posts view shows next
// UI

// functions
// get url parameters
function getUrlParams() {
  let vars = {};
  window.location.href.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function (m, key, value) {
      vars[key] = value;
    }
  );
  if (Object.keys(vars).length === 0) {
    return false;
  } else {
    return vars;
  }
}

// load params as prompt
async function loadMessage() {
  const params = getUrlParams();
  if (params) {
    let elem = document.createElement("div");
    elem.style.display = "flex";
    elem.style.flexDirection = "column";
    elem.style.alignItems = "center";
    let image = document.createElement("img");
    image.style.height = "80px";
    image.style.width = "80px";
    image.style.padding = "10px";
    let text = "Error!";
    image.src = "/assets/img/error.png";
    if ("success" == params["status"]) {
      text = "Success!";
      image.src = "/assets/img/success.png";
    }
    elem.appendChild(image);
    let message = document.createElement("p");
    message.style.color = "#fff";
    message.style.padding = "10px";
    message.innerText = decodeURIComponent(params["message"]);
    elem.appendChild(message);
    prompt(text, "notify", elem);
  }
}
async function choosePlatform() {
  let elem = document.createElement("div");
  elem.style.display = "flex";
  elem.style.flexDirection = "column";
  elem.style.alignItems = "center";
  const drop = dropDown("-- choose a platform --", ["Twitter"]);
  drop.style.marginTop = "20px";
  elem.appendChild(drop);
  let btnBox = document.createElement("div");
  btnBox.className = "button-box";
  elem.appendChild(btnBox);
  let goBtn = document.createElement("button");
  goBtn.className = "confirm";
  goBtn.innerText = "Add";
  goBtn.style.marginTop = "40px";
  goBtn.addEventListener("click", async () => {
    addAccount(drop.querySelector(".drop-btn").innerText);
    closePopup();
  });
  btnBox.appendChild(goBtn);
  let cancelBtn = document.createElement("button");
  cancelBtn.className = "cancel";
  cancelBtn.innerText = "Cancel";
  cancelBtn.style.marginTop = "40px";
  cancelBtn.addEventListener("click", async () => {
    closePopup();
  });
  btnBox.appendChild(cancelBtn);
  popUp("Add Account", elem);
}

async function addAccount(platform) {
  if ("Twitter" === platform){
    window.open(`/twitter/login/${await rtk()}`, "_self");
  }
}

async function newPost() {
  let container = document.createElement("div");
  container.classList.add("post-info-container");
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  let postInfo = document.createElement("div");
  postInfo.classList.add("post-info");
  let col1 = document.createElement("div");
  col1.classList.add("post-info-col1");
  postInfo.appendChild(col1);
  let col2 = document.createElement("div");
  col2.classList.add("post-info-col2");
  postInfo.appendChild(col2);

  // text label
  let textLabel = document.createElement("label");
  textLabel.htmlFor = "postText";
  textLabel.innerText = "Text";
  col2.appendChild(textLabel);

  // text
  let postText = document.createElement("textarea");
  postText.className = "text-area";
  postText.name = "postText";
  col2.appendChild(postText);

  // date time selection
  let dateSelector = document.createElement("div");
  dateSelector.classList.add("date-selector");
  // dateSelector.style.display = "flex";
  // dateSelector.style.flexDirection = "row";
  // dateSelector.style.padding = "20px";
  let dateLabel = document.createElement("label");
  dateLabel.innerText = "Scheduled Date: ";
  dateLabel.htmlFor = "scheduledDate";
  dateSelector.appendChild(dateLabel);
  let dateInput = document.createElement("input");
  dateInput.type = "datetime-local";
  //dateInput.value = new Date().toString;
  dateInput.style.marginLeft = "10px";
  dateSelector.appendChild(dateInput);
  col2.appendChild(dateSelector);

  // accounts
  let accountsLabel = document.createElement("label");
  accountsLabel.innerText = "Post to";
  col1.appendChild(accountsLabel);

  // accounts view
  let accountsView = document.createElement("div");
  accountsView.classList.add("accounts-view");
  col1.appendChild(accountsView);

  // account selection
  let accountSelection = document.createElement("div");
  accountSelection.classList.add("account-selection");
  let twitterChk = document.createElement("input");
  twitterChk.className = "checkbox";
  twitterChk.type = "checkbox";
  const result = await getTwitterAccounts();
  const twitterAccounts = result.data;
  // const twitterAccounts = ["sintelli_tech", "mindglowingart"]; // debug !!!
  let options = [];
  twitterAccounts.forEach((item) => {
    let opt = document.createElement("div");
    opt.className = "option";
    opt.style.display = "flex";
    opt.style.flexDirection = "row";
    opt.style.padding = "10px";
    opt.style.justifyContent = "space-between";
    let optText = document.createElement("div");
    optText.style.display = "flex";
    optText.style.flexDirection = "row";
    optText.style.marginLeft = "80px";
    let optTextPre = document.createElement("h2");
    optTextPre.style.fontSize = "14px";
    optTextPre.style.fontWeight = "300";
    optTextPre.innerText = "@";
    optText.appendChild(optTextPre);
    let optItem = document.createElement("h3");
    optItem.style.fontSize = "14px";
    optItem.style.fontWeight = "300";
    optItem.innerText = item;
    optText.appendChild(optItem);
    opt.appendChild(optText);
    let chk = document.createElement("input");
    chk.type = "checkbox";
    chk.className = "checkbox";
    chk.addEventListener("click", async () => {
      toggleChkChild(twitterChk, chk);
    });
    opt.appendChild(chk);
    options.push(opt);
  });
  let twitterAccountSelections = accordian(
    "Twitter",
    options,
    '<i class="fa-brands fa-twitter"></i>',
    twitterChk
  );
  accountSelection.appendChild(twitterAccountSelections);
  twitterChk.addEventListener("click", async () => {
    toggleChkMaster(twitterChk, twitterAccountSelections);
  });
  let selectedAccounts = {
    twitter: [],
  };
  let accountSelectionButton = document.createElement("button");
  accountSelectionButton.innerText = "Choose Accounts";
  accountSelectionButton.classList.add("button1");
  col1.appendChild(accountSelectionButton);
  accountSelectionButton.addEventListener("click", () => {
    prompt("Choose Accounts", "confirm", accountSelection, () => {
      selectedAccounts = {
        twitter: [],
      };
      twitterAccountSelections.querySelectorAll(".option").forEach((opt) => {
        if (true == opt.querySelector(".checkbox").checked) {
          selectedAccounts.twitter.push(opt.querySelector("h3").innerText);
        }
      });
      accountsView.innerHTML = "";
      for (const key in selectedAccounts) {
        selectedAccounts[key].forEach((acc) => {
          let account = document.createElement("div");
          account.classList.add("selected-account");
          // user images are not yet implemented in the api
          // let img = document.createElement("img");
          // img.src=`/${key}/attachments/userimg`;
          // account.appendChild(img);
          let accTypeBadge = document.createElement("i");
          accTypeBadge.className = `fa-brands fa-${key}`;
          account.appendChild(accTypeBadge);
          let username = document.createElement("p");
          username.innerText = acc;
          account.appendChild(username);
          accountsView.appendChild(account);
        });
      }
    });
  });

  // poll settings
  let pollSettings = document.createElement("div");
  pollSettings.style.display = "flex";
  pollSettings.style.flexDirection = "column";
  pollSettings.style.alignItems = "center";
  pollSettings.style.padding = "15px";
  let pollDuration = document.createElement("div");
  pollDuration.style.display = "flex";
  pollDuration.style.flexDirection = "row";
  pollDuration.style.padding = "10px";
  let pollDurationLabel = document.createElement("label");
  pollDurationLabel.innerText = "Duration: ";
  pollDurationLabel.htmlFor = "pollDuration";
  pollDuration.appendChild(pollDurationLabel);
  let pollDurationMins = document.createElement("input");
  pollDurationMins.name = "pollDuration";
  pollDurationMins.type = "number";
  pollDurationMins.min = "1";
  pollDurationMins.style.height = "18px";
  pollDurationMins.style.width = "60px";
  pollDuration.appendChild(pollDurationMins);
  let pollDurationText = document.createElement("p");
  pollDurationText.innerText = "minutes";
  pollDuration.appendChild(pollDurationText);
  pollSettings.appendChild(pollDuration);
  let pollOpts = document.createElement("div");
  pollOpts.style.display = "flex";
  pollOpts.style.flexDirection = "column";
  pollOpts.style.alignItems = "center";
  pollOpts.style.padding = "15px";
  let pollOptsLabel = document.createElement("label");
  pollOptsLabel.innerText = "Poll Options";
  pollOpts.appendChild(pollOptsLabel);
  multiAdd(pollOpts, "newpolloption");
  pollSettings.appendChild(pollOpts);

  // post options
  let postOptions = document.createElement("div");
  postOptions.className = "post-options";

  let post = {};
  // poll options button
  let pOBtn = document.createElement("button");
  pOBtn.className = "button1";
  pOBtn.innerText = "Poll Settings";
  pOBtn.addEventListener("click", () => {
    prompt("Poll Settings(Optional)", "confirm", pollSettings, () => {
      let pollDuration = pollDurationMins.value || null;
      let pollOptions = [];
      let pollOptElems = document.querySelectorAll(".newpolloption");
      pollOptElems.forEach((elem) => {
        pollOptions.push(elem.value);
      });
      if (pollOptions.length < 1) {
        pollOptions = null;
        pollDuration = null;
      }
      if (pollDuration && pollOptions) {
        post["pollDuration"] = pollDuration;
        post["pollOptions"] = pollOptions;
      }
    });
  });
  postOptions.appendChild(pOBtn);

  // add attachment button
  let attachBtn = document.createElement("button");
  attachBtn.className = "button1";
  attachBtn.innerText = "Attach Media";
  attachBtn.addEventListener("click", async () => {
    let gal = await gallery("/files", (filename) => {
      post["attachment"] = filename;
      closePrompt();
      dot("#3260a8", attachBtn);
    });
    prompt("Attach Media", "floating", gal);
  });
  postOptions.appendChild(attachBtn);

  col2.appendChild(postOptions);

  // schedule button
  let scheduleBtn = document.createElement("button");
  scheduleBtn.className = "button1";
  scheduleBtn.innerText = "Schedule Post";
  scheduleBtn.addEventListener("click", async () => {
    post["accounts"] = selectedAccounts;
    post["text"] = postText.value;
    post["datetime"] = dateInput.value;
    closePopup();
    loading();
    const res = await postScheduledPost(post);
    closePrompt();
    popDash();
    if ("success" == res.status) {
      popMsg("var(--green)", "#fff", res.message);
    } else if ("error" == res.status) {
      popMsg("var(--red)", "#fff", res.message);
    }
  });
  container.appendChild(postInfo);
  container.appendChild(scheduleBtn);
  popUp("New Post", container);
}

// showPosts() // debug !!!

async function showPosts() {
  let outerContainer = document.createElement("div");
  outerContainer.className = "posts-container";
  const result = await getPosts();
  const posts = result.data;
  // const date = new Date(); // debug !!!
  // const posts = [ // debug !!!
  //   {
  //     _id: "12345",
  //     text: "some post text",
  //     datetime: date,
  //     data: {
  //       twitter: {
  //         status: "pending",
  //       },
  //     },
  //   },
  //   {
  //     _id: "56345",
  //     text: "some post text",
  //     datetime: date,
  //     data: {
  //       twitter: {
  //         status: "posted",
  //       },
  //     },
  //   },
  //   {
  //     _id: "12346453465",
  //     text: "some post text",
  //     datetime: date,
  //     data: {
  //       twitter: {
  //         status: "error",
  //       },
  //     },
  //   },
  // ];
  posts.forEach((post) => {
    let container = document.createElement("div");
    container.className = "post";
    let postText = document.createElement("p");
    postText.innerText = post.text;
    container.appendChild(postText);
    let datetime = document.createElement("p");
    datetime.style.fontWeight = "400";
    datetime.innerText = new Date(post.datetime).toLocaleString();
    container.appendChild(datetime);
    let deletePostBtn = iconButton(
      `<i class="fa-solid fa-trash-can"></i>`,
      null,
      "var(--red)"
    );
    deletePostBtn.addEventListener("click", async () => {
      let delText = document.createElement("p");
      delText.style.fontWeight = "300";
      delText.innerHTML =
        "This won't delete the post from social media,<br> only from the database and/or schedule.";
      prompt("Are you sure?", "confirm", delText, () => {
        deletePost(post._id);
        popDash();
      });
    });
    container.appendChild(deletePostBtn);
    outerContainer.appendChild(container);
    if ("pending" == post.data.twitter.status) {
      container.style.borderRightColor = "var(--neutral-blue)";
    } else if ("posted" == post.data.twitter.status) {
      container.style.borderRightColor = "var(--green)";
    } else if ("error" == post.data.twitter.status) {
      container.style.borderRightColor = "var(--red)";
    }
  });
  appScreen.appendChild(outerContainer);

  // Post Legend

  let postLegend = document.createElement("div");
  postLegend.classList.add("post-legend");
  let postLegendList = document.createElement("ul");
  appScreen.appendChild(postLegend);
  postLegend.appendChild(postLegendList);

  // Pending
  let pendingPostLegendListItem = document.createElement("li");
  let pendingPostLegend = document.createElement("p");
  pendingPostLegend.innerHTML = "Pending:";
  let pendingPostLegendBox = document.createElement("div");
  pendingPostLegendBox.classList.add("pending-legend-box");
  pendingPostLegendBox.classList.add("post-legend-box");

  postLegendList.appendChild(pendingPostLegendListItem);
  pendingPostLegendListItem.appendChild(pendingPostLegend);
  pendingPostLegendListItem.appendChild(pendingPostLegendBox);

  // Posted
  let postedPostLegendListItem = document.createElement("li");
  let postedPostLegend = document.createElement("p");
  postedPostLegend.innerHTML = "Posted:";
  let postedPostLegendBox = document.createElement("div");
  postedPostLegendBox.classList.add("posted-legend-box");
  postedPostLegendBox.classList.add("post-legend-box");

  postLegendList.appendChild(postedPostLegendListItem);
  postedPostLegendListItem.appendChild(postedPostLegend);
  postedPostLegendListItem.appendChild(postedPostLegendBox);

  // Error
  let errorPostLegendListItem = document.createElement("li");
  let errorPostLegend = document.createElement("p");
  errorPostLegend.innerHTML = "Error:";
  let errorPostLegendBox = document.createElement("div");
  errorPostLegendBox.classList.add("error-legend-box");
  errorPostLegendBox.classList.add("post-legend-box");

  postLegendList.appendChild(errorPostLegendListItem);
  errorPostLegendListItem.appendChild(errorPostLegend);
  errorPostLegendListItem.appendChild(errorPostLegendBox);
}

async function popDash() {
  const result = await getTwitterAccounts();
  accountCount.innerText = `${result.data.length}`;
  const posts = document.querySelectorAll(".posts-container");
  posts.forEach((post) => {
    post.remove();
  });
  await showPosts();
}

async function toggleChkMaster(master, elem) {
  const chkBoxes = elem.querySelectorAll(".checkbox");
  chkBoxes.forEach((chk) => {
    if (true == master.checked) {
      chk.checked = true;
    } else {
      chk.checked = false;
    }
  });
}

async function toggleChkChild(master, child) {
  if (false == child.checked) {
    master.checked = false;
  }
}
// functions

window.addEventListener("DOMContentLoaded", () => {
  popDash();
  closePrompt();
  loadMessage();
});

// popMsg() // debug !!!
