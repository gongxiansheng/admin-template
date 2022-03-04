<template>
  <div class="login">
    <div class="container">
      <div class="login-form">
        <p class="title">
          {{ systemName }}
        </p>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="form"
          auto-complete="on"
          label-position="top"
        >
          <el-form-item
            prop="username"
            :class="[focusItem === 'username' && 'is-focus']"
          >
            <el-input
              ref="username"
              v-model.trim="loginForm.username"
              placeholder="Username"
              name="username"
              type="text"
              tabindex="1"
              @focus="handleFocus('username')"
              @blur="handleBlur"
              @keyup.native.enter="handleLogin"
            >
              <i
                slot="prefix"
                class="el-input__icon fa fa-user-o"
              />
            </el-input>
          </el-form-item>

          <el-form-item
            prop="password"
            :class="[focusItem === 'password' && 'is-focus']"
          >
            <el-input
              :key="passwordType"
              ref="password"
              v-model.trim="loginForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              auto-complete="on"
              @focus="handleFocus('password')"
              @blur="handleBlur"
              @keyup.native.enter="handleLogin"
            >
              <i
                slot="prefix"
                class="el-input__icon el-icon-lock"
              />
            </el-input>
            <span
              class="show-pwd"
              @click="showPwd"
            >
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              class="submit-btn"
              round
              size="small"
              @click.native.prevent="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
const defaultSettings = require('../../settings.js')

export default {
    name: 'Login',
    data() {
        const validateUsername = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入用户名'))
            } else {
                callback()
            }
        }
        const validatePassword = (rule, value, callback) => {
            if (!value.length) {
                callback(new Error('请输入密码'))
            } else {
                callback()
            }
        }
        return {
            loginForm: {
                username: '',
                password: ''
            },
            loginRules: {
                username: [{ required: false, trigger: 'blur', validator: validateUsername }],
                password: [{ required: false, trigger: 'blur', validator: validatePassword }]
            },
            systemName: defaultSettings.title,
            loading: false,
            passwordType: 'password',
            redirect: undefined,
            focusItem: ''
        }
    },
    watch: {
        $route: {
            handler: function(route) {
                this.redirect = route.query && route.query.redirect
            },
            immediate: true
        }
    },
    methods: {
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true
                    this.$store
                        .dispatch('user/login', this.loginForm)
                        .then(() => {
                            this.$router.push({ path: this.redirect || '/' })
                            this.loading = false
                        })
                        .catch(() => {
                            this.loading = false
                        })
                } else {
                    return false
                }
            })
        },
        handleFocus(focusItem) {
            this.focusItem = focusItem
        },
        handleBlur() {
            this.focusItem = ''
        }
    }
}
</script>
