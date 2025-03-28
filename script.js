
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
      alert("Please fill in all the fields.");
    }
  });

  //  Fetch trainers 
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
        trainerButton.addEventListener("click", () => {
          alert(
            `You have booked ${trainer.first_name} for the ${trainer.workout} workout.`
          );
        });

        card.appendChild(trainerButton);
        container.appendChild(card);
      });
    })
    .catch((err) => console.error("Error fetching trainers:", err));
});
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".trainers");

  //fetch 
  fetch("http://localhost:3000/trainers")
    .then((res) => res.json())
    .then((trainers) => {
      trainers.forEach((trainer) => {
        // Create a card for each trainer
        const card = document.createElement("div");
        card.classList.add("card");

        const title = document.createElement("h3");
        title.textContent = trainer.first_name + " " + trainer.last_name;
        card.appendChild(title);

        const workout = document.createElement("p");
        workout.textContent = `Workout: ${trainer.workout}`;
        card.appendChild(workout);

        const description = document.createElement("p");
        description.textContent = trainer.description;
        card.appendChild(description);

        //book button
        const trainerButton = document.createElement("button");
        trainerButton.className = "btn book-now";
        trainerButton.textContent = "Book Now";
        trainerButton.addEventListener("click", () => {
          const bookingData = {
            trainer_id: trainer.id,
            trainer_name: trainer.first_name + " " + trainer.last_name,
            workout: trainer.workout
          };

          // Send POST request to save booking
          fetch("http://localhost:3000/bookings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(bookingData)
          })
            .then((res) => res.json())
            .then((data) => {
              alert(`You have successfully booked ${data.trainer_name} for the ${data.workout} workout.`);
            })
            .catch((err) => {
              console.error("Error saving booking:", err);
              alert("Failed to book. Please try again.");
            });
        });

        card.appendChild(trainerButton);
        container.appendChild(card);
      });
    })
    .catch((err) => console.error("Error fetching trainers:", err));
});


