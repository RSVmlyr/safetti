const nodeNotification = (text) => {
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.textContent = text;
  const body = document.querySelector('body')
  body.insertAdjacentElement('afterend', notification);
  const notificationDiv = document.querySelector('.notification')
  setTimeout(() => {
    notificationDiv.remove()
  }, 10000);
}

export default nodeNotification