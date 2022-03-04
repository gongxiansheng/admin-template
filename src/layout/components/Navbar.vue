<template>
  <div class="navbar">
    <div class="navbar__left">
      <div class="logo-link">
        <h1
          class="title"
        >
          {{ title }}
        </h1>
      </div>
    </div>
    <div class="navbar__right">
      <el-dropdown
        class="avatar-container"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <avatar
            size="40"
            :user-name="username"
            :slice-number="3"
            class="user-avatar"
          />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu
          slot="dropdown"
          class="user-dropdown"
        >
          <el-dropdown-item
            divided
            @click.native="handleModifyPwd"
          >
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item
            divided
            @click.native="logout"
          >
            <span style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <modify-pwd-dialog :visible.sync="showModifyPwdDialog" />
  </div>
</template>

<script>
import ModifyPwdDialog from './ModifyPwdDialog'
import { mapState } from 'vuex'
import defaultSettings from '@/settings'
export default {
    name: 'Navbar',
    components: { ModifyPwdDialog },
    data() {
        return {
            title: defaultSettings.title,
            showModifyPwdDialog: false
        }
    },
    computed: { ...mapState({ username: state => state.user.name }) },
    methods: {
        handleModifyPwd() {
            this.showModifyPwdDialog = true
        },
        async logout() {
            await this.$store.dispatch('user/logout')
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        }
    }
}
</script>
