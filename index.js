const admin = require('firebase-admin');
const apn = require('apn');
const fs = require('fs');

// Firebase project configuration
const serviceAccountKey = require('./config/onerestaurant-firebase-adminsdk.json');

// APNs configuration
const apnOptions = {
    token: {
        key: './config/AuthKey_VVZB2QVW34.p8',
        keyId: "VVZB2QVW34",
        teamId: "DGC4823S4P"
    },
    production: false
};

// Initialize Firebase app
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
});

// Function to send notification using FCM
function sendFCMNotification(registrationToken, message) {
    const messaging = admin.messaging();

    // Construct the message object with registration token and payload
    const fcmMessage = {
        token: registrationToken,
        android: message
    };

    // Use the recommended send method from HTTP v1 API
    messaging.send(fcmMessage)
        .then((response) => {
            console.log('Successfully sent FCM message:', response);
        })
        .catch((error) => {
            console.error('Error sending FCM message:', error);
        });
}

// Function to send notification using APNs
function sendAPNNotification(deviceToken, message) {
    const apnProvider = new apn.Provider(apnOptions);
    const notification = new apn.Notification({
        alert: message,
        sound: 'default',
        // 'badge' is supported on iOS.
        badge: 1,
        topic: 'com.segwik.onerestaurant'
    });

    apnProvider.send(notification, deviceToken)
        .then((result) => {
            console.log('Sent APNs notification to device:---', result);
        })
        .catch((error) => {
            console.error('Failed to send APNs notification:', error);
        });
}

// FCM notification
const androidRegistrationToken = 'fvp_0LdaQsexoYdvE4aSYr:APA91bGvn2NFR2WQXBVLU1DbAwhMT_k-ST4uPYnbQ5J_eTs7jlDqRG3xd1714mfu2ZCMFt5wNJcdf4OBULCCHM3_TZps2bG49LwtMzdbmiokHe68QG8-u2iZy5DJWKbjSevEuhSW75Vs';
const message = {
    title: "Breaking News!",
    body: "This is test body additional data."
};

// Send FCM notification
sendFCMNotification(androidRegistrationToken,
    {
        notification: {
            title: "Breaking News!",
            body: "This is test body additional data."
        },
        data: {
            message: "Inside data message 1."
        }
    });

const iosDeviceToken = '80271c021c04aff92fa889df701d2a32bc03e4889d3ef1cb9b2a598f69436cd0abf6b8ca750edfb3db7b95952cbfd5dca8db5a6ba25cc37123e28f7df60642845222d3f0cb7891a2bfef9a30f6c5e20a';
// Send APNs notification
sendAPNNotification(iosDeviceToken, message);

console.log('Notifications sent!');
