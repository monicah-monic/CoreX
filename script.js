document.addEventListener("DOMContentLoaded", () => {
  const registerButton = document.querySelector(".register");
  const modal = document.querySelector(".modal");
  const modalForm = modal.querySelector("form");

  // Show registration modal
  registerButton.addEventListener("click", (event) => {
    event.preventDefault();
    modal.style.display = "block";
  });

  modalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    //  user inputs
    const firstName = document.getElementById("first_name").value;
    const lastName = document.getElementById("last_name").value;
    const email = document.getElementById("email").value;
    const gender = document.getElementById("gender").value;
    const description = document.getElementById("description").value;
    const workout = document.getElementById("workout").value;

    if (firstName && lastName && email && gender && description && workout) {
      const newUser = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        gender:gender,
        description: description,
        workout: workout,
      };

      // Send POST request to JSON server
      fetch("http://localhost:3000/trainers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(
            `Thank you for registering, ${data.first_name} ${data.last_name}!`
          );
          modal.style.display = "none"; // Hide the modal
        })
        .catch((err) => {
          console.error("Error registering user:", err);
          alert("Failed to register. Please try again.");
        });
    } else {
      alert("You havent registered yet.");
    }
  }); 
});

//handle book now
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector(".booking-modal");
  const closeModalButton = modal.querySelector(".close");
  const bookingForm = document.getElementById("bookingForm");

  // Handle "Book Now" button click
  fetch("http://localhost:3000/trainers")
    .then((res) => res.json())
    .then((trainers) => {
      const container = document.querySelector(".trainers");
      trainers.forEach((trainer) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const image = document.createElement("img");
        image.src = "assets/pilates.jpeg";
        image.alt = `Trainer ${trainer.first_name}`;
        card.appendChild(image);

        const title = document.createElement("h3");
        title.textContent = trainer.first_name + " " + trainer.last_name;
        card.appendChild(title);

        const workout = document.createElement("p");
        workout.textContent = `Workout: ${trainer.workout}`;
        card.appendChild(workout);

        const description = document.createElement("p");
        description.textContent = trainer.description;
        card.appendChild(description);

        const trainerButton = document.createElement("button");
        trainerButton.className = "btn book-now";
        trainerButton.textContent = "Book Now";

        // Open modal and set trainer data
        trainerButton.addEventListener("click", () => {
          modal.style.display = "block";
          bookingForm.dataset.trainerId = trainer.id; // Store trainer ID in form
          bookingForm.dataset.trainerName = `${trainer.first_name} ${trainer.last_name}`;
        });

        card.appendChild(trainerButton);
        container.appendChild(card);
      });
    })
    .catch((err) => console.error("Error fetching trainers:", err));


  // Submit booking and update trainer's booking count
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Collect user and trainer details
    const trainerId = bookingForm.dataset.trainerId;
    const trainerName = bookingForm.dataset.trainerName;
    const firstName = document.getElementById("booking_first_name").value;
    const lastName = document.getElementById("booking_last_name").value;
    const contact = document.getElementById("booking_contact").value;

    if (firstName && lastName && contact) {
      // POST booking to db.json
      const booking = {
        trainer: trainerName,
        first_name: firstName,
        last_name: lastName,
        contact: contact,
      };

      

      fetch("http://localhost:3000/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(booking),
      })
        .then(() => {
          // Retrieve current booking count, increment, and update
          fetch(`http://localhost:3000/trainers/${trainerId}`)
            .then((res) => res.json())
            .then((trainer) => {
              const updatedCount = trainer.bookings + 1;

              // PATCH request to update the bookings count
              fetch(`http://localhost:3000/trainers/${trainerId}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ bookings: updatedCount }),
              })
                .then((res) => res.json())
                .then((updatedTrainer) => {
                  alert(
                    `You have successfully booked ${updatedTrainer.first_name} ${updatedTrainer.last_name}`
                  );
                  modal.style.display = "none"; // Hide modal
                  bookingForm.reset(); // Reset form
                })
                .catch((err) => {
                  console.error("Error updating bookings:", err);
                  alert("Failed to update trainer bookings. Please try again.");
                });
            })
            .catch((err) => {
              console.error("Error retrieving trainer data:", err);
              alert("Failed to retrieve trainer details. Please try again.");
            });
        })
        
    } 
  });
});

// about us
document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const content = document.querySelector(".btns-info");
      content.innerHTML = "";
      if (button.textContent === "About Us") {
        content.innerHTML = `
  <h3>We are CoreX</>
  <P>Welcome to our gym.Here we offer both physical and mental wellness so you can keep fit all round.
  We are very passionate about helping people achieve their goals.Choose you always.Viva!</P>
  `;
      } else if (button.textContent === "Contact") {
        content.innerHTML = `
  <h3>Contact Us</h3>
  <p><strong>0711274935</strong></p>
  <p><strong>core.x@gmail.com</strong></p>
  `;
      }
    });
  });
});
