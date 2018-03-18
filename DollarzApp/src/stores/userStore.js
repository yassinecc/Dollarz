import { observable, action } from 'mobx'
import { createUser, login } from 'DollarzApp/src/services/api';

class UserStore {

  @observable accessToken = null
  @observable user = null

  @action
  login(username, password) {
    return login(username, password)
    .then(data => {
      this.accessToken = data.accessToken
      this.user = username
    })
    .catch(console.log)
  }

  @action signup(username, password) {
    return createUser(username, password)
    .then(() => {
        return Promise.resolve('Authentication suceeded')
    })
    .catch(console.log)
  }

  @action
  logout() {
    this.accessToken = null
    this.user = null
    return Promise.resolve()
  }

}

const singleton = new UserStore()

export default singleton
