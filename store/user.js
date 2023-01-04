import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js'

export const state = () => ({
  attrs: {},
  loading: true,
  idToken: '',
  refreshToken: '',
  isSignedIn: null,
  impersonating: '',
  impersonator: null,
})

export const mutations = {
  setAttrs(state, attrs) {
    state.attrs = {
      ...attrs,
      admin: attrs.admin === '1',
      role: attrs.role === 'false' ? '' : attrs.role,
    }
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  setIdToken(state, idToken) {
    state.idToken = idToken
  },
  setRefreshToken(state, refreshToken) {
    state.refreshToken = refreshToken
  },
  setIsSignedIn(state, isSignedIn) {
    state.isSignedIn = isSignedIn
  },
  setImpersonating(state, userId) {
    state.impersonating = userId
  },
  setImpersonator(state, attrs) {
    state.impersonator = attrs
  },
}

export const actions = {
  updateAttrs({ commit }) {
    const Pool = new CognitoUserPool({
      UserPoolId: this.$config.COGNITO_USER_POOL_ID,
      ClientId: this.$config.COGNITO_CLIENT_ID,
    })

    commit('setLoading', true)

    const cognitoUser = Pool.getCurrentUser()

    if (!cognitoUser) {
      commit('setAttrs', {})
      commit('setIsSignedIn', false)
      commit('setLoading', false)

      return
    }

    return new Promise((resolve, reject) => {
      cognitoUser.getSession((error, session) => {
        if (error) {
          commit('setLoading', false)

          return reject(error)
        }

        cognitoUser.getUserAttributes((error, attributes) => {
          if (error) {
            commit('setLoading', false)

            return reject(error)
          }

          const attrs = attributes.reduce((obj, { Name, Value }) => {
            obj[Name.replace(/custom:/, '')] = Value

            return obj
          }, {})

          commit('setAttrs', attrs)
          commit('setIdToken', session.getIdToken().getJwtToken())
          commit('setRefreshToken', session.getRefreshToken())
          commit('setIsSignedIn', attrs.email_verified === 'true')
          commit('setLoading', false)

          resolve()
        })
      })
    })
  },

  signUp(
    context,
    { username: Username, password: Password, recaptchaToken = '' }
  ) {
    const Pool = new CognitoUserPool({
      UserPoolId: this.$config.COGNITO_USER_POOL_ID,
      ClientId: this.$config.COGNITO_CLIENT_ID,
    })

    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: Username.toLowerCase().trim(),
      }),
    ]

    return new Promise((resolve, reject) => {
      Pool.signUp(
        Username.toLowerCase().trim(),
        Password,
        attributeList,
        [
          {
            Name: 'recaptchaToken',
            Value: recaptchaToken,
          },
        ],
        (error) => {
          if (error) {
            return reject(error)
          }

          resolve()
        }
      )
    })
  },

  verifySignUp(context, { username: Username, code }) {
    const Pool = new CognitoUserPool({
      UserPoolId: this.$config.COGNITO_USER_POOL_ID,
      ClientId: this.$config.COGNITO_CLIENT_ID,
    })

    const cognitoUser = new CognitoUser({
      Username: Username.toLowerCase().trim(),
      Pool,
    })

    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(code.trim(), true, (error, result) =>
        error ? reject(error) : resolve(result)
      )
    })
  },

  reverifySignUp(context, { username: Username }) {
    const Pool = new CognitoUserPool({
      UserPoolId: this.$config.COGNITO_USER_POOL_ID,
      ClientId: this.$config.COGNITO_CLIENT_ID,
    })

    const cognitoUser = new CognitoUser({
      Username: Username.toLowerCase().trim(),
      Pool,
    })

    return new Promise((resolve, reject) => {
      cognitoUser.resendConfirmationCode((error, result) =>
        error ? reject(error) : resolve(result)
      )
    })
  },

  signIn({ commit, dispatch }, { username: Username, password: Password }) {
    const Pool = new CognitoUserPool({
      UserPoolId: this.$config.COGNITO_USER_POOL_ID,
      ClientId: this.$config.COGNITO_CLIENT_ID,
    })

    commit('setLoading', true)

    const cognitoUser = new CognitoUser({
      Username: Username.toLowerCase().trim(),
      Pool,
    })

    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: Username.toLowerCase().trim(),
        Password,
      })

      cognitoUser.authenticateUser(authenticationDetails, {
        async onSuccess() {
          await dispatch('updateAttrs')

          resolve()
        },
        onFailure: (error) => {
          commit('setLoading', false)

          reject(error)
        },
      })
    })
  },

  verifySignIn({ commit, dispatch }, { code }) {
    const Pool = new CognitoUserPool({
      UserPoolId: this.$config.COGNITO_USER_POOL_ID,
      ClientId: this.$config.COGNITO_CLIENT_ID,
    })

    commit('setLoading', true)

    const cognitoUser = Pool.getCurrentUser()

    return new Promise((resolve, reject) => {
      cognitoUser.getSession((error) => {
        if (error) {
          commit('setLoading', false)

          return reject(error)
        }

        cognitoUser.verifyAttribute('email', code.trim(), {
          async onSuccess() {
            await dispatch('updateAttrs')

            resolve()
          },
          onFailure: reject,
        })
      })
    })
  },

  reverifySignIn() {
    const Pool = new CognitoUserPool({
      UserPoolId: this.$config.COGNITO_USER_POOL_ID,
      ClientId: this.$config.COGNITO_CLIENT_ID,
    })

    const cognitoUser = Pool.getCurrentUser()

    return new Promise((resolve, reject) => {
      cognitoUser.getSession((error) => {
        if (error) {
          return reject(error)
        }

        cognitoUser.getAttributeVerificationCode('email', {
          onSuccess: resolve,
          onFailure: reject,
          inputVerificationCode: resolve,
        })
      })
    })
  },

  async signOut({ dispatch }) {
    const Pool = new CognitoUserPool({
      UserPoolId: this.$config.COGNITO_USER_POOL_ID,
      ClientId: this.$config.COGNITO_CLIENT_ID,
    })

    const cognitoUser = Pool.getCurrentUser()

    if (cognitoUser) {
      cognitoUser.signOut()
    }

    await dispatch('updateAttrs')
  },

  refresh({ commit, state }) {
    const Pool = new CognitoUserPool({
      UserPoolId: this.$config.COGNITO_USER_POOL_ID,
      ClientId: this.$config.COGNITO_CLIENT_ID,
    })

    const cognitoUser = Pool.getCurrentUser()

    if (!cognitoUser) {
      return
    }

    const { refreshToken } = state

    return new Promise((resolve, reject) => {
      cognitoUser.refreshSession(refreshToken, (error, session) => {
        if (error) {
          reject(error)
        }

        commit('setIdToken', session.getIdToken().getJwtToken())
        commit('setRefreshToken', session.getRefreshToken())

        resolve()
      })
    })
  },

  reset(context, { username: Username }) {
    const Pool = new CognitoUserPool({
      UserPoolId: this.$config.COGNITO_USER_POOL_ID,
      ClientId: this.$config.COGNITO_CLIENT_ID,
    })

    const cognitoUser = new CognitoUser({
      Username: Username.toLowerCase().trim(),
      Pool,
    })

    return new Promise((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: resolve,
        onFailure: reject,
      })
    })
  },

  verifyReset(context, { username: Username, password, code }) {
    const Pool = new CognitoUserPool({
      UserPoolId: this.$config.COGNITO_USER_POOL_ID,
      ClientId: this.$config.COGNITO_CLIENT_ID,
    })

    const cognitoUser = new CognitoUser({
      Username: Username.toLowerCase().trim(),
      Pool,
    })

    return new Promise((resolve, reject) => {
      cognitoUser.confirmPassword(code.trim(), password, {
        onSuccess: resolve,
        onFailure: reject,
      })
    })
  },

  changePassword(context, { oldPassword, newPassword }) {
    const Pool = new CognitoUserPool({
      UserPoolId: this.$config.COGNITO_USER_POOL_ID,
      ClientId: this.$config.COGNITO_CLIENT_ID,
    })

    const cognitoUser = Pool.getCurrentUser()

    return new Promise((resolve, reject) => {
      cognitoUser.getSession((error) => {
        if (error) {
          return reject(error)
        }

        cognitoUser.changePassword(oldPassword, newPassword, (error, result) =>
          error ? reject(error) : resolve(result)
        )
      })
    })
  },

  async save({ state, commit, dispatch }, attributes) {
    await this.$axios.patch('user', attributes)

    if (state.impersonating) {
      const user = (await this.$axios.get('user')).data

      commit('setAttrs', user)
    } else {
      await dispatch('updateAttrs')
    }
  },

  async delete({ state, dispatch }) {
    if (state.impersonating) {
      return
    }

    const Pool = new CognitoUserPool({
      UserPoolId: this.$config.COGNITO_USER_POOL_ID,
      ClientId: this.$config.COGNITO_CLIENT_ID,
    })

    const cognitoUser = Pool.getCurrentUser()

    if (cognitoUser) {
      await new Promise((resolve, reject) => {
        cognitoUser.getSession((error) => {
          if (error) {
            return reject(error)
          }

          cognitoUser.deleteUser((error, result) =>
            error ? reject(error) : resolve(result)
          )
        })
      })
    }

    await dispatch('updateAttrs')
  },

  async disable({ state, commit, dispatch }) {
    if (state.impersonating && state.impersonator.admin) {
      await this.$axios.delete('user')

      const user = (await this.$axios.get('user')).data

      commit('setAttrs', user)
    } else {
      await dispatch('updateAttrs')
    }
  },

  async confirm({ state, commit, dispatch }) {
    if (state.impersonating && state.impersonator.admin) {
      await this.$axios.patch('user', { confirmed: true })

      const user = (await this.$axios.get('user')).data

      commit('setAttrs', user)
    } else {
      await dispatch('updateAttrs')
    }
  },

  async enable({ state, commit, dispatch }) {
    if (state.impersonating && state.impersonator.admin) {
      await this.$axios.patch('user', { disabled: false })

      const user = (await this.$axios.get('user')).data

      commit('setAttrs', user)
    } else {
      await dispatch('updateAttrs')
    }
  },
}
