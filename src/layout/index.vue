<template>
  <div class="app-container">
    <navbar />
    <div class="main-container">
      <div
        v-if="isSuperAdmin"
        class="aside"
        :class="classObj"
      >
        <hamburger
          :is-active="sidebar.opened"
          class="hamburger-container"
          @toggleClick="toggleSideBar"
        />
        <sidebar :routes="routes" />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, AppMain } from './components'
import Hamburger from '@/components/Hamburger'
import Sidebar from '@/components/Sidebar'
import { mapState } from 'vuex'
import { ROLE_TYPE } from '@/lib'
export default {
    name: 'Layout',
    components: {
        Navbar,
        AppMain,
        Sidebar,
        Hamburger
    },
    computed: {
        ...mapState({
            roleCode: state => state.user.roleCode,
            sidebar: state => state.app.sidebar
        }),
        isSuperAdmin() {
            return this.roleCode.indexOf(ROLE_TYPE.superAdmin) > -1
        },
        routes() {
            const systemRoutes = this.$router.options.routes
            return systemRoutes
        },
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation
            }
        }
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar')
        }
    }
}
</script>
