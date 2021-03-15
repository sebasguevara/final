let db = firebase.firestore()

firebase.auth().onAuthStateChanged(async function(user) {
    if (user) {
      document.querySelector('.sign-in-or-sign-out').innerHTML = `
      <div class="sm:flex items-center mx-4 my-1 bg-white">
      <div class="w-1/2 text-left flex items-center">
        <div class="mx-2 home"><img src="assets/Vinco_Logo1.webp" alt="Vinco" width="40" height="40"/></div>
        <div class="text-left text-gray-400 text-4xl">Vinco</div>
      </div>
  
      <div class="w-1/2 text-right">
      <div class="w-full text-gray-600">Signed in as <strong>${user.displayName}</strong>
      <button class="w-full text-gray-600 underline sign-out text-right">Sign Out</button>
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
      let response = await fetch('/.netlify/functions/assigned_students', {
        method: 'POST',
        body: JSON.stringify({
          coach: user.uid,
        }
        )
      })
      

      
      let students = await response.json()
      if (students.length>0) {
        document.querySelector('.welcome').classList.add('text-left')
        document.querySelector('.welcome').classList.remove('text-center')
        document.querySelector('.welcome').classList.add('text-lg')
        document.querySelector('.welcome').classList.remove('text-2xl') 
        document.querySelector('.welcome').classList.add('ml-4')   
        document.querySelector('.welcome').classList.add('mt-2') 
        document.querySelector('.welcome').innerHTML = `
        <div class="sm:flex items-center text-green-500 px-4 mx-4 py-1">
          <div class="sm:w-3/4"><strong class="text-gray-600">${user.displayName}</strong>, these are your assigned students: </div>
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
          document.querySelector(`.view-${currentStudent.studentId}`).addEventListener('click', function(event) {
            document.location.href = `studentSummary.html#${currentStudent.studentId}`
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
    let newNumber = `${student.number.substring(0,3)}-${student.number.substring(3,6)}-${student.number.substring(6,10)}`
    document.querySelector('.main-body').insertAdjacentHTML('beforeend', `
    <div class = "sm:flex text-gray-500 border-2 border-green-500 mt-4 px-4 mx-4 py-2 rounded items-center">
      <div class="w-full sm:w-1/2">  
        <div> <strong>Name:</strong> ${student.studentName} </div>
        <div> <strong>e-mail:</strong> ${student.studentEmail} </div>
        <div> <strong>Number:</strong> ${newNumber} </div>
        <div> <strong>Company:</strong> ${student.company} </div>
        <div> <strong>Desired Program:</strong> ${student.program} </div>
        <div> <strong>Registered:</strong> ${student.created} </div>
        <div> <strong>Assigned:</strong> ${student.assigned} </div>
      </div>
      <div class="w-full sm:w-1/2 my-1 items-center"> 
        <button class="w-full text-gray-100 text-xl bg-green-500 hover:bg-green-600 px-4 py-2 m-auto rounded view view-${student.studentId}"> View Student </button>
      </div>
    </div>
    <div>
      `
)}

function printBlank() {
    document.querySelector('.main-body').insertAdjacentHTML('beforeend', `
    <div class = "sm:flex text-gray-500 border-2 border-green-500 mt-4 px-4 mx-4 pt-10 pb-6 rounded">
      <div class="w-full text-center text-3xl">  
        <div> There are currently <strong>no students</strong> assigned to you </div>
        <div class="text-lg mt-2"> Go to the <strong href="newStudents.html"> unassigned students </strong> section to select students! </div>
       
      </div>
  
    </div>
      `
    )
  }


  