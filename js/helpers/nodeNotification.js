const nodeNotification = (text) => {
  let notificationDiv
  notificationDiv = document.querySelector('.notification')
  if (notificationDiv) {
    notificationDiv.remove()
  }
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.textContent = text;
  const body = document.querySelector('body')
  body.insertAdjacentElement('afterend', notification);
  notificationDiv = document.querySelector('.notification')
  setTimeout(() => {
    notificationDiv.remove()
  }, 5000);
}

export default nodeNotification