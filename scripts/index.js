document.addEventListener('DOMContentLoaded', () => {
  const greenLampButton = document.querySelector('.green-lamp_button');

  greenLampButton.addEventListener('change', (event) => {
      if (event.target.checked) {
          setTimeout(() => {
              window.location.href = './pages/main.html';
          }, 1000);
      }
  });
});
