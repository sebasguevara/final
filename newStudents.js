let db = firebase.firestore()

firebase.auth().onAuthStateChanged(async function(user) {
    if (user) {
      document.querySelector('.sign-in-or-sign-out').innerHTML = `
      <div class="sm:flex items-center mx-4 my-1 bg-white">
      <div class="sm:w-1/2 text-left flex items-center">
        <div class="mx-2 home"><img src="assets/Vinco_Logo1.webp" alt="Vinco" width="40" height="40"/></div>
        <div class="text-left text-gray-400 text-4xl">Vinco</div>
      </div>
  
      <div class="text-left sm:w-1/2 sm:text-right">
      <div class="w-full text-gray-600">Signed in as <strong>${user.displayName}</strong>
      <button class="w-full text-gray-600 underline sign-out text-left sm:text-right">Sign Out</button>
      </div>
    </div>`

      document.querySelector('.sign-out').addEventListener('click', function(event) {
        console.log('sign out clicked')
        firebase.auth().signOut()
        document.location.href = 'index.html'
      })

      document.querySelector('.home').addEventListener('click', function(event) {
        document.location.href = 'index.html'
      })

    
      let response = await fetch('/.netlify/functions/unassigned_students')
      let students = await response.json()
      if (students.length>0) {
        document.querySelector('.welcome').classList.add('text-left')
        document.querySelector('.welcome').classList.remove('text-center')
        document.querySelector('.welcome').classList.add('text-lg')
        document.querySelector('.welcome').classList.remove('text-2xl') 
        document.querySelector('.welcome').classList.add('ml-2')   
        document.querySelector('.welcome').classList.add('mt-2') 
        document.querySelector('.welcome').innerHTML = `
        <div class="sm:flex items-center text-green-500 px-1 mx-4 py-1">
          <div class="sm:w-3/4"><strong class="text-gray-600">${user.displayName}</strong>, these are the newly registered students that have not been assigned: </div>
          <div class="sm:w-1/4 text-center text-gray-100 text-md bg-gray-500 hover:bg-gray-600 px-2 py-1 m-auto returnToMain rounded">
            <button>Return to Main Page</button>
          </div>
        </div>
        
        `
        document.querySelector('.returnToMain').addEventListener('click', function(event) {
          document.location.href = `index.html`,'_blank'
        })

        for (i = 0; i<students.length; i++) {
          printStudent(students[i]) 
          let currentStudent = students[i]
          document.querySelector(`.contact-${students[i].studentId}`).addEventListener('click', async function(event) {
            // assign student to coach NEEED TO EDIT BELOW
            
            // console.log(currentStudent)
            let response = await fetch('/.netlify/functions/assign_coach', {
              method: 'POST',
              body: JSON.stringify({
                coach: user.uid,
                student: currentStudent.studentId
              }
              )
            })
            document.location.href = 'newStudents.html'
          })
        }
        
      
      } else {
        printBlank()
      }
      
    } else {
        document.location.href = 'index.html'
    }

})

async function printStudent(student) {
  
  // let date = 1000*student.created;
  // // Hours part from the timestamp
  // let hours = date.getHours();
  // // Minutes part from the timestamp
  // let minutes = "0" + date.getMinutes();
  // // Seconds part from the timestamp
  // let seconds = "0" + date.getSeconds();

  // // Will display time in 10:30:23 format
  // let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  // let date = student.created.toDate()


  document.querySelector('.main-body').insertAdjacentHTML('beforeend', `
  <div class = "sm:flex text-gray-500 border-2 border-green-500 mt-4 px-4 mx-4 py-2 rounded items-center">
    <div class="w-full sm:w-1/2">  
      <div> <strong>Name:</strong> ${student.studentName} </div>
      <div> <strong>e-mail:</strong> ${student.studentEmail} </div>
      <div> <strong>Company:</strong> ${student.company} </div>
      <div> <strong>Desired Program:</strong> ${student.program} </div>
      <div> <strong>Registered:</strong> ${student.created} </div>
    </div>
    <div class="w-full sm:w-1/2 my-1 items-center"> 
      <button class="w-full text-gray-100 text-xl bg-green-500 hover:bg-green-600 px-4 py-2 m-auto rounded contact contact-${student.studentId}"> Assign to me </button>
    </div>
  </div>
    `
  )
  


}

function printBlank() {
  document.querySelector('.main-body').insertAdjacentHTML('beforeend', `
  <div class = "sm:flex text-gray-500 border-2 border-green-500 mt-4 px-4 mx-4 pt-10 pb-6 rounded">
    <div class="w-full text-center text-3xl">  
      <div> There are currently <strong>no students</strong> waiting to be unassigned </div>
      <div class="text-lg mt-2"> Come back at a later time for newly registered students! </div>
     
    </div>

  </div>
    `
  )
}