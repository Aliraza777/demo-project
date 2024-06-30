// import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
// import * as firebase from 'firebase-admin';
// import { app, messaging } from 'firebase-admin';
// import { getStorage } from 'firebase-admin/storage';
// import Messaging = messaging.Messaging;
//
// @Injectable()
// export class FirebaseService implements OnModuleInit {
//   public static firebaseMessaging: Messaging;
//   public static firebaseBucket: any;
//   firebaseApp: app.App;
//
//   public static UPLOAD_TYPES = {
//     PROFILE: 'profile',
//     AUDIO: 'audio',
//   };
//
//   async onModuleInit() {
//     console.log('Initializing firebase...');
//     this.firebaseApp = firebase.initializeApp({
//       credential: firebase.credential.cert(
//         process.cwd() + '/firebase.config.json',
//       ),
//       storageBucket: process.env.FIREBASE_STORAGE_BUCKET_PATH,
//     });
//     FirebaseService.firebaseBucket = getStorage().bucket();
//     FirebaseService.firebaseMessaging = this.firebaseApp.messaging();
//   }
//
//   async createUserOnFireBase(email: string, password: string) {
//     try {
//       return await this.firebaseApp.auth().createUser({ email, password });
//     } catch (e) {
//       if (e.code === 'auth/email-already-exists') {
//         throw new BadRequestException('Email already exists');
//       } else if (e.code === 'auth/invalid-email') {
//         throw new BadRequestException('Invalid Email');
//       } else if (e.code === 'auth/weak-password') {
//         throw new BadRequestException('Weak Password');
//       } else {
//         throw new BadRequestException(e.message);
//       }
//     }
//   }
//
//   async generateVerificationEmailLink(email: string) {
//     try {
//       return await this.firebaseApp.auth().generateEmailVerificationLink(email);
//     } catch (e) {
//       throw e;
//     }
//   }
//
//   async updatePassword(uid, password) {
//     try {
//       const user = await this.firebaseApp.auth().getUser(uid);
//       if (user && user.providerData[0]?.providerId === 'password') {
//         return await this.firebaseApp.auth().updateUser(uid, {
//           password: password,
//         });
//       } else {
//         throw new BadRequestException(
//           'Customer Signed in as Social Login. Password cannot be updated',
//         );
//       }
//     } catch (e) {
//       if (e.code === 'auth/user-not-found') {
//         return;
//       }
//       throw e;
//     }
//   }
//
//   async ping() {
//     try {
//       await this.firebaseApp.auth().getUserByEmail('abc@xyz.com');
//     } catch (e) {
//       if (e.code === 'auth/user-not-found') {
//         return;
//       }
//       throw e;
//     }
//   }
//
//   public static getDefaultFileUrl(uploadType: string): string {
//     return process.env[
//       `FIREBASE_STORAGE_DEFAULT_${uploadType.toUpperCase()}_PATH`
//     ];
//   }
//
//   public static getUrlFromPath(path: string) {
//     return `${process.env.FIREBASE_STORAGE_BASE_PATH}${
//       process.env.FIREBASE_STORAGE_BUCKET_NAME
//     }/o/${path.replace(
//       /\//g,
//       '%2F',
//     )}?alt=media&timestamp=${new Date().toISOString()}`;
//   }
//   async getAllUsers() {
//     const listUsersResult = await this.firebaseApp.auth().listUsers();
//     return {
//       users: listUsersResult.users,
//       total: listUsersResult.users.length,
//     };
//   }
//   async getConversationCredits() {
//     try {
//       const remoteConfig = await this.firebaseApp.remoteConfig().getTemplate();
//       const credits = remoteConfig.parameters.credits.defaultValue['value'];
//       return parseInt(credits);
//     } catch (e) {
//       throw e;
//     }
//   }
//   async deleteUser(uid: string) {
//     try {
//       await this.firebaseApp.auth().deleteUser(uid);
//       return true;
//     } catch (e) {
//       console.log('error', e);
//       throw e;
//     }
//   }
//   // async isAnonymousUser(uid: string) {
//   //   try {
//   //     const user = await this.firebaseApp.auth().getUser(uid);
//   //     console.log('user', user.providerData);
//   //     return user.providerData[0]?.providerId === 'anonymous';
//   //   } catch (e) {
//   //     throw e;
//   //   }
//   // }
// }
