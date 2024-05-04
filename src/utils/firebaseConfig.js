
const admin = require('firebase-admin');
const serviceAccount = require('./../../bnh-notifications-firebase-adminsdk-21crv-051433ee21.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const message = {
    notification: {
      title: 'Tiêu đề thông báo',
      body: 'Nội dung thông báo',
    },
  };
  
  admin.messaging().sendToTopic('topicName', message)
    .then((response) => {
      console.log('Thông báo đã được gửi:', response);
    })
    .catch((error) => {
      console.log('Lỗi khi gửi thông báo:', error);
    });
   