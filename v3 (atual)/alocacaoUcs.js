let csvData;

fetch('HorarioDeExemplo.csv')
  .then(response => response.text())
  .then(data => {
    // Store CSV data in the variable
    csvData = data;

    // Parse CSV data into an array of objects
    const classSchedule = csvData.split('\n').map(row => {
      const [name, subject, code, group, capacity, day, startTime, endTime, date, room, location] = row.split(';');
      return { name, subject, code, group, capacity, day, startTime, endTime, date, room, location };
    });

    // You can use `classSchedule` array for further processing
    const form = document.getElementById('classAllocationForm');
    const suggestionsDiv = document.getElementById('suggestions');

    form.addEventListener('submit', function(event) {
      event.preventDefault();

      const className = form.elements['className'].value;

      // Find available slots for the specified class name
      const availableSlots = findAvailableSlots(className, classSchedule);

      // Display suggestions
      displaySuggestions(availableSlots);
    });
  })
  .catch(error => {
    console.error('Error fetching CSV file:', error);
  });

function findAvailableSlots(className, classSchedule) {
  // Logic to find available slots based on the existing class schedule
  // For simplicity, let's say we're suggesting any slot that's not already occupied
  const occupiedSlots = new Set(classSchedule.map(classEntry => classEntry.day + classEntry.startTime));
  const availableSlots = [];

  // Assuming a schedule runs from 08:00 to 20:00 with 30-minute slots
  const hours = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
  const minutes = ['00', '30'];

  for (const hour of hours) {
    for (const minute of minutes) {
      const slot = hour + ':' + minute;
      if (!occupiedSlots.has(slot)) {
        availableSlots.push(slot);
      }
    }
  }

  return availableSlots;
}

function displaySuggestions(slots) {
  const suggestionsDiv = document.getElementById('suggestions');
  suggestionsDiv.innerHTML = '';

  if (slots.length === 0) {
    suggestionsDiv.textContent = 'No available slots found.';
  } else {
    const ul = document.createElement('ul');
    slots.forEach(slot => {
      const li = document.createElement('li');
      li.textContent = slot;
      ul.appendChild(li);
    });
    suggestionsDiv.appendChild(ul);
  }
}
