
const firebaseConfig = {
    apiKey: "AIzaSyB0GgklCc8-Rz3g_sV00AsuArezoQ0PVi4",
    authDomain: "exalt-technologies-task-2.firebaseapp.com",
    databaseURL: "https://exalt-technologies-task-2-default-rtdb.firebaseio.com",
    projectId: "exalt-technologies-task-2",
    storageBucket: "exalt-technologies-task-2.appspot.com",
    messagingSenderId: "838333644662",
    appId: "1:838333644662:web:9c52b38901989dda940457",
    measurementId: "G-EBLPZHVFQZ"
  };


  // initialize firebase
firebase.initializeApp(firebaseConfig)

  // reference for DB
const contactFromDB = firebase.database().ref('event');


const clickButton = () => {
        const name = document.getElementById("event-name").value;
        const desc = document.getElementById("description").value;
        const date = document.getElementById("date").value;
    
        const urlParams = new URLSearchParams(window.location.search);
        const title = urlParams.get('title');
    
        if (!title)
            saveEvent(name, desc, date)
        else{
            const oldName = decodeURIComponent(urlParams.get('name'));
            update(oldName, name, desc, date)
        }




}

const checkInputs = () => {
    const eventNameInput = document.getElementById("event-name");
    const dateInput = document.getElementById("date");
    const addButton = document.getElementById("add-button");
    addButton.disabled = (eventNameInput.value === "" || dateInput.value === "") ? true : false;
}



const saveEvent = (name, desc, date) => {
    const newEvent =  contactFromDB.push();

    newEvent.set({
        name: name,
        desc: desc,
        date: date
    })
    
    window.location.href = "index.html";

}

const cancelEvent = () => {
    window.location.href = "index.html";
}




const writeDBValues = () => {
    document.getElementById("list-link").style.color = "blue";


    contactFromDB.once('value')
    .then((snapshot) => {
      const data = snapshot.val();
      for (const element of Object.values(data)) {
        const {name, desc, date} = element;

        const nameElement = document.createElement("label");
        const nameElementText = document.createTextNode(name);
        nameElement.appendChild(nameElementText);
        const dateElement = document.createElement("label");
        const dateElementText = document.createTextNode(date);
        dateElement.appendChild(dateElementText);
        nameElement.style.fontFamily = `"Lucida Console", "Courier New", monospace`
        dateElement.style.fontFamily = `"Lucida Console", "Courier New", monospace`
        nameElement.style.fontSize = "16px";
        dateElement.style.fontSize = "12px";

        const divElement = document.createElement("div");

        const recivedDate = new Date(date), currDate = new Date();

        divElement.style.borderRadius = "5px";
        divElement.style.borderStyle = "solid";
        divElement.style.borderWidth = "5px";
        divElement.style.width = "0px";
        divElement.style.height = "0px";

        if (recivedDate == currDate)
            divElement.style.borderColor = "#179BAE";
        else if(recivedDate < currDate)
            divElement.style.borderColor = "#FF7F3E";
        else
            divElement.style.borderColor = "#7776B3";

        divElement.addEventListener("click", (e) => {
            const encodedName = encodeURIComponent(name);
            const encodedDesc = encodeURIComponent(desc);
            const encodedDate = encodeURIComponent(date);
            window.location.href = `form.html?title=Edit Event&name=${encodedName}&desc=${encodedDesc}&date=${encodedDate}`;
        })

        document.getElementById("main").appendChild(divElement);

        new Promise((resolve) => {
            let id = null;
            let pos = 0;
            clearInterval(id);
            id = setInterval(frame, 5);
            function frame() {
              if (pos == 120) {
                clearInterval(id);
                resolve();
              } else {
                pos++; 
                divElement.style.width = pos + "px"; 
                divElement.style.height = pos + "px"; 
              }
            }
        }).then(() => {
            divElement.appendChild(nameElement);
            divElement.appendChild(dateElement);    
        })
    }
    })
    .catch((error) => {
      console.error("Error reading data: ", error);
    });  
}


const formChanger = () => {
    
    document.getElementById("form-link").style.color = "blue";


    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');
    const name = decodeURIComponent(urlParams.get('name'));
    const desc = decodeURIComponent(urlParams.get('desc'));
    const date = decodeURIComponent(urlParams.get('date'));

    if (title) {
        const addButton = document.getElementById("add-button");
        addButton.disabled = false;
        addButton.innerHTML = "Save";
    
        document.getElementById("main-title").innerHTML = title;
        document.getElementById("event-name").value = name;
        document.getElementById("description").value = desc;
        document.getElementById("date").value = date;
    }

}


const update = (name, eventName, newDesc, newDate) => {
    contactFromDB.orderByChild('name').equalTo(name).once('value')
    .then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                childSnapshot.ref.update({
                    name: eventName,
                    desc: newDesc,
                    date: newDate
                })
                .then(() => {
                    window.location.href = "index.html";
                })
            });
    })
    .catch((error) => {
        console.error('Error querying events:', error);
    });

}
