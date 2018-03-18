import { observable, action } from 'mobx'
import { createUser, login } from 'DollarzApp/src/services/api';

class UserStore {

  @observable accessToken = null
  @observable user = null

  @action
  login(username, password) {
    return login(username, password)
    .then(res => {
      console.log(res)
      if (res.status === 200) {
        res.json()
      }
    })
    .then(console.log)
    .catch(console.log)
  }

  @action signup(username, password) {
    return createUser(username, password)
    .then(res => {
      if (res.status === 200) {
        this.user = username
        this.accessToken = res.accessToken
      }
    })
    .catch(console.log)
  }

  @action
  resetIdentity() {
    this.accessToken = null
    this.user = null
  }

}

const singleton = new UserStore()

export default singleton
