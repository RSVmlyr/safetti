const nodeNotification = (text) => {
  const notificationDiv = document.querySelector('.notification')
  if (notificationDiv) {
    notificationDiv.remove()
  }
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.textContent = text;
  const body = document.querySelector('body')
  body.insertAdjacentElement('afterend', notification);
  
  setTimeout(() => {
    if (notification) {
      notification.remove()
    }
  }, 2000);
}

export default nodeNotification