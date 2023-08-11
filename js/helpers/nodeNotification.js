// const nodeNotification = (text) => {
//   let notificationDiv
//   notificationDiv = document.querySelector('.notification')
//   if (notificationDiv) {
//     notificationDiv.remove()
//   }
//   const notification = document.createElement('div');
//   notification.classList.add('notification');

//   const notificationContent = document.createElement("div");
//   notificationContent.classList.add('notification--content');
  
//   const notificationText = document.querySelector("h2");
//   notificationText.classList.add('notification--content__text');
//   notificationText.textContent = text;
//   notificationContent.appendChild(notificationText);

//   notification.appendChild(notificationContent);

//   const body = document.querySelector('body');
//   body.appendChild(notification)
//   // body.insertAdjacentElement('afterend', notification);
  
//   notificationDiv = document.querySelector('.notification')
  
//   notification.addEventListener("click", close);

//   // setTimeout(() => {
//   //   notificationDiv.remove()
//   // }, 5000);
// }

// const close = (e) => {
//   const notification = e.target;
//   notification.style.display = 'none'
  
//   console.log(notification.type);
//   if(notification.type === 'submit') {
//     notification.parentElement.parentElement.style.display = 'none'
//   }
// }


// export default nodeNotification

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
    if (notificationDiv) {
      notificationDiv.remove()
    }
  }, 10000);
}

export default nodeNotification