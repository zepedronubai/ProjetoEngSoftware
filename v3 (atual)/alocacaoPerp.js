let csvData; // Variable to store CSV data

fetch('HorarioDeExemplo.csv')
  .then(response => response.text())
  .then(data => {
    // Store CSV data in the variable
    csvData = data;

    function suggestSlots() {
      const form = document.getElementById('classForm');
      const subject = form.elements.subject.value;
      const duration = parseInt(form.elements.duration.value);
      const preferredDays = Array.from(form.elements.preferredDays.selectedOptions).map(option => option.value);
      const startTime = form.elements.startTime.value;
      const endTime = form.elements.endTime.value;

      const suggestedSlots = [];

      // Split the CSV data by lines
      const rows = csvData.split('\n');

      rows.forEach(row => {
        const [, rowSubject, , , , rowDay, rowStartTime, rowEndTime, rowDate, rowRoom] = row.split(';');
        if (rowSubject === subject) return;

        const rowDuration = new Date(`1970-01-01T${rowEndTime}`) - new Date(`1970-01-01T${rowStartTime}`);
        if (rowDuration / 1000 / 60 !== duration) return;

        if (!preferredDays.includes(rowDay)) return;

        const rowStartDate = new Date(`${rowDate}T${rowStartTime}`);
        const rowEndDate = new Date(`${rowDate}T${rowEndTime}`);
        const newStartDate = new Date(`${rowDate}T${startTime}`);
        const newEndDate = new Date(`${rowDate}T${endTime}`);

        if (newStartDate >= rowStartDate && newEndDate <= rowEndDate) {
          suggestedSlots.push({
            day: rowDay,
            date: rowDate,
            startTime: rowStartTime,
            endTime: rowEndTime,
            room: rowRoom
          });
        }
      });

      const suggestedSlotsContainer = document.getElementById('suggestedSlots');
      suggestedSlotsContainer.innerHTML = '';

      if (suggestedSlots.length === 0) {
        suggestedSlotsContainer.textContent = 'No suitable slots found.';
      } else {
        suggestedSlots.forEach(slot => {
          const slotElement = document.createElement('div');
          slotElement.textContent = `Day: ${slot.day}, Date: ${slot.date}, Time: ${slot.startTime} - ${slot.endTime}, Room: ${slot.room}`;
          suggestedSlotsContainer.appendChild(slotElement);
        });
      }
    }
  });