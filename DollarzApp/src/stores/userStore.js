import { observable, action } from 'mobx'
import { login } from 'DollarzApp/src/services/api'

class UserStore {

  @observable accessToken = null
  @observable user = null

  @action
  login(username, password) {
    return login(username, password)
    .then(res => {
      if (res.status === 200) {
        this.user = username
        this.accessToken = res.accessToken
      }
    })
  }

  @action
  resetIdentity() {
    this.accessToken = null
    this.user = null
  }

}

export default UserStore
