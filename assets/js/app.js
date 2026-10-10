const cl = console.log;
const backdrop = document.getElementById("backdrop");
const addBtn = document.getElementById("addBtn");
const form = document.getElementById("form");
const closeBtn = document.getElementById("closeBtn");
const spinner = document.getElementById("spinner");
const userContainer = document.getElementById("userContainer");
const nameControl = document.getElementById("name");
const emailControl = document.getElementById("email");
const roleControl = document.getElementById("role");
const statusControl = document.getElementById("status");
const  addUser = document.getElementById("addUser");
const updateUser = document.getElementById("updateUser");


function onToggle(){
    backdrop.classList.toggle("active");
    form.classList.toggle("active");
    if(!form.classList.contains("active")){
        addUser.classList.remove("d-none");
        updateUser.classList.add("d-none");
        form.reset();
    }
}
//url
let BASE_URL = "https://fetch-api-crud-e52ad-default-rtdb.asia-southeast1.firebasedatabase.app"
let USER_URL = `${BASE_URL}/user.json`

//spinner 
function toggleSpinner(){
spinner.classList.toggle("d-none");
}
//snackbar
function  showSnackbar(msg, icon){
Swal.fire({
    text:msg,
    icon:icon,
    timer:2000,
})
}
//state 
const state ={
    userArr:[],
    edit_id :null
}
//indexno 
function setIndex(){
    let td = document.querySelectorAll("#userContainer tr td:child");
    td.forEach((ele, i)=>{
        td.innerHTML = i+1;
    })
}
//status
function statusClass(status) {

    if (status === "active") {
        return "bg-primary";
    }

    if (status === "inactive") {
        return "bg-danger";
    }

}
//nested obj to arrry of obj 
function convertObjToArr(obj) {
    state.userArr = [];

    if (!obj) return;

    Object.entries(obj).forEach(ele => {
        ele[1].id = ele[0];
        state.userArr.push(ele[1]);
    });
}
//read
function showUser(){
  toggleSpinner()
  fetch(USER_URL,{
    method:"GET",
    body: null,
    headers:{
      "Content-Type":"application/json",
    } 
  })
  .then((res)=>{
  if(!res.ok){
    throw new Error("Something went wrong")
  }
  return res.json();
  })
  .then((data)=>{
   cl(data);
    convertObjToArr(data);
    cl(state.userArr);
    templeting(state.userArr);
   showSnackbar("User data fetched successfully", "success");
  })
  .catch((err)=>{
    showSnackbar("Error fetching user data", "error");
  })
  .finally(()=>{
  toggleSpinner()
  })
}
showUser();

function templeting(arr){
    let result = ``;
    arr.forEach((ele,i) => {
        result += `<tr id="${ele.id}">
                            <td>${i+1}</td>
                            <td>${ele.name}</td>
                            <td>${ele.email}</td>
                            <td>${ele.role}</td>
                            <td>
                               <span class="badge ${statusClass(ele.status)}"> ${ele.status}</span>
                            </td>
                            <td>
                                <button onclick="onEdit(this)" class="btn btn-sm btn-primary">Edit</button>
                                <button onclick="onRemove(this)" class="btn btn-sm btn-danger">Delete</button>
                            </td>
                        </tr>`
    });
 userContainer.innerHTML = result;
}

//create
function onAddUser(eve){
    eve.preventDefault();
    let newObj = {
        name:nameControl.value,
        email:emailControl.value,
        role:roleControl.value,
        status:statusControl.value,
    }
    toggleSpinner();
    fetch(USER_URL,{
   method:"POST",
   body:JSON.stringify(newObj),
   headers:{
    "content-type" : "application/json",
    "authentication" :"JWT token"
   }
    })
  .then((res)=>{
    if(!res.ok){
    throw new Error("Something went wrong")
  }
  return res.json();
  })
  .then((data)=>{
  cl(data);
  newObj.id = data.name;
  state.userArr.push(newObj);
  let tr = document.createElement("tr");
  tr.id = data.name;
  tr.innerHTML =`<td>${state.userArr.length}</td>
                            <td>${newObj.name}</td>
                            <td>${newObj.email}</td>
                            <td>${newObj.role}</td>
                            <td>
                               <span class="badge ${statusClass(newObj.status)}"> ${newObj.status}</span>
                            </td>
                            <td>
                                <button onclick="onEdit(this)" class="btn btn-sm btn-primary">Edit</button>
                                <button onclick="onRemove(this)" class="btn btn-sm btn-danger">Delete</button>
                            </td>`
                            userContainer.append(tr);
       onToggle();
       form.reset();
      showSnackbar("user added successfully!!!","success")
  })
  .catch((err)=>{
     showSnackbar("Error fetching user data", "error"); 
  })
  .finally(()=>{
    toggleSpinner();
  })
}
//edit
function onEdit(ele){
    let EDIT_ID = ele.closest("tr").id;
    state.edit_id = EDIT_ID;
    let editObj = state.userArr.find((ele)=>ele.id === EDIT_ID);
    nameControl.value = editObj.name;
    emailControl.value = editObj.email;
    roleControl.value = editObj.role;
    statusControl.value = editObj.status;
  addUser.classList.add("d-none");
  updateUser.classList.remove("d-none");
  onToggle();
}
//update
function onUpdateUser(eve){
    let update_Id = state.edit_id;
    let updateUrl = `${BASE_URL}/user/${update_Id}.json`;
    let updateObj = {
        name:nameControl.value,
        email:emailControl.value,
        role:roleControl.value,
        status:statusControl.value,
        id:update_Id
    }
    toggleSpinner();
    fetch(updateUrl,{
        method:"PATCH",
        body:JSON.stringify(updateObj),
        headers:{
            "content-type" : "application/json",
            "authentication" :"JWT token"
        }
    })
    .then((res)=>{
        if(!res.ok){
            throw new Error("Something went wrong")
        }
        return res.json();
    })
    .then((data)=>{
        cl(data);
        let updateIndex = state.userArr.findIndex((ele)=>ele.id === update_Id);
        state.userArr[updateIndex] = updateObj;
        let tr = document.getElementById(update_Id);
        tr.innerHTML = `<td>${updateIndex+1}</td>
                            <td>${updateObj.name}</td>
                            <td>${updateObj.email}</td> 
                            <td>${updateObj.role}</td>
                            <td>
                              <span class="badge ${statusClass(updateObj.status)}">
                                      ${updateObj.status}
                             </span>
                            </td>
                            <td>
                                <button onclick="onEdit(this)" class="btn btn-sm btn-primary">Edit</button>
                                <button onclick="onRemove(this)" class="btn btn-sm btn-danger">Delete</button>
                            </td>`
           onToggle();
          form.reset();
          addUser.classList.remove("d-none");
          updateUser.classList.add("d-none");
          showSnackbar("User data updated successfully", "success");
    })
    .catch((err)=>{
        showSnackbar("Error updating user data", "error");
    })
    .finally(()=>{
        toggleSpinner();
    })
}
//delete
function onRemove(ele){
Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){
 let REMOVE_ID  = ele.closest("tr").id;
    let remove_url = `${BASE_URL}/user/${REMOVE_ID}.json`
    toggleSpinner()
    fetch(remove_url,{
        method:"DELETE",
        body:null,
        headers:{
            "content-type":"application/jon",
            "authrization":"JWT token"
        }
    })
     .then((res)=>{
        if(!res.ok){
            throw new Error("Something went wrong")
        }
        return res.json();
    })
    .then((data)=>{
     cl(data);
     let getIndex = state.userArr.findIndex(obj=> obj.id === REMOVE_ID);
     state.userArr.splice(getIndex, 1);
     ele.closest("tr").remove();
     setIndex();
    })
     .catch((err)=>{
        showSnackbar("Error updating user data", "error");
    })
    .finally(()=>{
        toggleSpinner();
    })
Swal.fire({
    title: "Deleted!",
    text: "Your file has been deleted.",
    icon: "success"
  });
  } 
});    
}

updateUser.addEventListener("click",onUpdateUser)
closeBtn.addEventListener("click",onToggle);
backdrop.addEventListener("click",onToggle);
addBtn.addEventListener("click",onToggle);
form.addEventListener("submit",onAddUser);