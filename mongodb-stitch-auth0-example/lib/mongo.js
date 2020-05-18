import {
  Stitch,
  RemoteMongoClient,
  CustomCredential
} from 'mongodb-stitch-server-sdk';

const client = Stitch.hasAppClient(process.env.MONGO_APPLICATION_ID)
  ? Stitch.getAppClient(process.env.MONGO_APPLICATION_ID)
  : Stitch.initializeAppClient(process.env.MONGO_APPLICATION_ID);

class MongoClient {
  constructor() {
    this.serviceClient = null;
  }

  async loginWithToken(token) {
    const credential = new CustomCredential(token);

    await client.auth.loginWithCredential(credential);
    return client.auth.activeUserAuthInfo;
  }

  async refreshAccessToken() {
    await client.auth.refreshAccessToken();
    return client.auth.activeUserAuthInfo;
  }

  getAccessToken() {
    const { accessToken } = client.auth.activeUserAuthInfo;
    return accessToken;
  }

  connect() {
    this.serviceClient = client.getServiceClient(
      RemoteMongoClient.factory,
      process.env.MONGO_SERVICE_NAME
    );
  }

  getClient() {
    return client;
  }

  getCollection(name) {
    return this.serviceClient.db(process.env.MONGO_DATABASE).collection(name);
  }
}

export default new MongoClient();
