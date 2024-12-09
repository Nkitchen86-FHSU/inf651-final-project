function createElemWithText(sName, tContent, cName) {
    this.stringName = "p";
    this.textContent = "";
    this.className = "";

    if (sName !== undefined)
        this.stringName = sName;
    if (tContent !== undefined)
        this.textContent = tContent;
    if (cName !== undefined)
        this.className = cName;

    const newElem = document.createElement(this.stringName);
    newElem.textContent = this.textContent;
    if (this.className !== "")
        newElem.className = this.className;

    return newElem;
}

function createSelectOptions(data) {
    if (!data)
        return;

    const arr = data.map((user) => {
        const optionElem = document.createElement("option");
        optionElem.value = user.id;
        optionElem.textContent = user.name;
        return optionElem;
    });

    return arr;
}

function toggleCommentSection(postId) {
    if (!postId)
        return;
    const sectionElem = document.querySelector(`section[data-post-id="${postId}"]`);
    if (!sectionElem)
        return null;
    sectionElem.classList.toggle('hide');
    return sectionElem;
}

function toggleCommentButton(postId) {
    if (!postId)
        return;
    const buttonElem = document.querySelector(`button[data-post-id="${postId}"]`);
    if (!buttonElem)
        return null;
    if (buttonElem.textContent === "Show Comments")
        buttonElem.textContent = "Hide Comments";
    else
        buttonElem.textContent = "Show Comments";
    return buttonElem
}

function deleteChildElements(parentElement) {
    if (!(parentElement instanceof HTMLElement))
        return;
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement;
}

function addButtonListeners() {
    const main = document.querySelector("main");
    const buttonArr = main.querySelectorAll("button");
    if (buttonArr === null)
        return buttonArr;
    for (const button of buttonArr){
        const postId = button.dataset.postId;
        if (postId) {
            button.addEventListener("click", function(e) {
                toggleComments(e, postId);
            });
        }
    }
    return buttonArr;
}

function removeButtonListeners() {
    const main = document.querySelector("main");
    const buttonArr = main.querySelectorAll("button");
    if (buttonArr.length === null)
        return buttonArr;
    for (const button of buttonArr) {
        const postId = button.dataset.id;
        if (postId) {
            button.removeEventListener("click", function(e) {
                toggleComments(e, postId);
            });
        }
    }
    return buttonArr;
}

function createComments(data) {
    if (!data)
        return;
    const fragmentElem = document.createDocumentFragment();
    for (const comment of data) {
        const articleElem = document.createElement("article");
        const h3Elem = createElemWithText("h3", comment.name, "");
        const pBodyElem = createElemWithText("p", comment.body, "");
        const pEmailElem = createElemWithText("p", `From: ${comment.email}`, "");
        articleElem.append(h3Elem);
        articleElem.append(pBodyElem);
        articleElem.append(pEmailElem);
        fragmentElem.append(articleElem);
    }
    return fragmentElem;
}

function populateSelectMenu(data) {
    if (!data)
        return;
    const selectMenu = document.getElementById("selectMenu")
    const optionArr = createSelectOptions(data);
    for (const option of optionArr) {
        selectMenu.append(option);
    }
    return selectMenu;
}

async function getUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const jsonUserData = await response.json();
        return jsonUserData;
    }
    catch {
        return;
    }
}

async function getUserPosts(userId) {
    if (!userId)
        return;
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const jsonPostData = await response.json();
        const posts = jsonPostData.filter(post => post.userId === Number(userId));
        return posts;
    }
    catch {
        return;
    }
}

async function getUser(userId) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const jsonUserData = await response.json();
        const user = jsonUserData.find((user) => {
            if (user.id === userId)
                return user;
        })
        return user;
    }
    catch {
        return;
    }
}

async function getPostComments(postId) {
    if (!postId)
        return;
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/comments');
        const jsonCommentData = await response.json();
        const comments = jsonCommentData.filter((comment) => {
            if (comment.postId === postId)
                return comment;
        })
        return comments;
    }
    catch {
        return;
    }
}

async function displayComments(postId) {
    if (!postId)
        return;
    const sectionElem = document.createElement("section");
    sectionElem.dataset.postId = postId;
    sectionElem.classList.add("comments");
    sectionElem.classList.add("hide");
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    sectionElem.append(fragment)
    return sectionElem;
}

async function createPosts(data) {
    if (!data)
        return;
    const fragmentElem = document.createDocumentFragment();
    for (const post of data) {
        const articleElem = document.createElement("article");
        const h2Elem = document.createElement("h2");
        h2Elem.textContent = post.title;
        const pElemPostBody = document.createElement("p");
        pElemPostBody.textContent = post.body;
        const pElemPostId = document.createElement("p");
        pElemPostId.textContent = `Post ID: ${post.id}`;
        const author = await getUser(post.userId);
        const pElemAuthor = document.createElement("p");
        pElemAuthor.textContent = `Author: ${author.name} with ${author.company.name}`;
        const pElemCompanyPhrase = document.createElement("p");
        pElemCompanyPhrase.textContent = author.company.catchPhrase;
        const button = document.createElement("button");
        button.textContent = "Show Comments";
        button.dataset.postId = post.id;
        const section = await displayComments(post.id);
        articleElem.append(h2Elem, pElemPostBody, pElemPostId, pElemAuthor, pElemCompanyPhrase, button, section);
        fragmentElem.append(articleElem);
    }
    return fragmentElem;
}

async function displayPosts(data) {
    const mainElem = document.querySelector("main");
    let element;
    if (data){
        element = await createPosts(data);
    }
    else{
        element = document.createElement("p");
        element.textContent = "Select an Employee to display their posts.";
        element.classList.add("default-text");
    }
    mainElem.append(element);
    return element;

}

function toggleComments(event, postId) {
    if (!event && !postId)
        return;
    event.target.listener = true;
    const arr = [];
    arr.push(toggleCommentSection(postId));
    arr.push(toggleCommentButton(postId));
    return arr;
}

async function refreshPosts(data) {
    if (!data)
        return;
    const arr = [];
    arr.push(removeButtonListeners());
    arr.push(deleteChildElements(document.querySelector("main")));
    arr.push(await displayPosts(data));
    arr.push(addButtonListeners());
    return arr;
}

async function selectMenuChangeEventHandler(event) {
    if (!event?.target || event.type !== "change")
        return;
    let userId = event?.target?.value || 1;
    if (event.target.value === "Employees")
      userId = 1;
    event.target.disabled = true;
    const posts = await getUserPosts(userId);
    const refreshPostsArr = await refreshPosts(posts);
    event.target.disabled = false;
    return [userId, posts, refreshPostsArr];
}

async function initPage() {
    const arr = [];
    const users = await getUsers();
    arr.push(users);
    arr.push(populateSelectMenu(users));
    return arr;
}

async function initApp() {
    await initPage();
    const selectMenu = document.getElementById("selectMenu");
    selectMenu.addEventListener("change", selectMenuChangeEventHandler);
}

document.addEventListener("DOMContentLoaded", initApp);