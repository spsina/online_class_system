<template>
  <v-app>

      <v-navigation-drawer
              v-model="drawer"
              :clipped="$vuetify.breakpoint.lgAndUp"
              app
              right
      >

          <v-list dense v-for="section in sections" :key="section.title" >
              <v-subheader>
                  <v-icon small class="mx-1">{{ section.icon }}</v-icon> {{ section.title }}
              </v-subheader>

              <v-list-item
                      v-for="item in section.items"
                      :key ="item.title"
                      :to ="item.to"
                      link
              >
                  {{ item.title }}
              </v-list-item>

          </v-list>

          <template v-slot:append>
              <v-container>
                  <v-row justify="space-between">
                      <v-col cols="3">
                          <v-tooltip top>
                              <template v-slot:activator="{on, attrs}">
                                   <span v-bind="attrs" v-on="on">
                                       <v-btn icon :to="{ name: 'Home'}">
                                       <v-icon>mdi-home</v-icon>
                                       </v-btn>
                                   </span>
                              </template>
                              <span>
                                    خانه
                              </span>
                          </v-tooltip>
                      </v-col>
                      <v-col cols="3">
                          <v-tooltip top>
                              <template v-slot:activator="{on, attrs}">
                                   <span v-bind="attrs" v-on="on">
                                       <v-btn icon @click="toggleDarkMode"
                                       ><v-icon v-if="$vuetify.theme.dark">brightness_high</v-icon>
                                       <v-icon v-else>brightness_medium</v-icon>
                                       </v-btn>
                                   </span>
                              </template>
                              <span>
                                    تغییر روشنایی
                              </span>
                          </v-tooltip>
                      </v-col>
                      <v-col cols="3">
                          <v-tooltip top>
                              <template v-slot:activator="{on, attrs}">
                                   <span v-bind="attrs" v-on="on">
                                       <v-btn icon><v-icon>mdi-logout</v-icon></v-btn>
                                   </span>
                              </template>
                              <span>
                                خروج
                               </span>
                          </v-tooltip>
                      </v-col>

                  </v-row>
              </v-container>
          </template>
      </v-navigation-drawer>
    
    <v-app-bar 
      :clipped-right="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        {{ title }}
      </v-toolbar-title>
        
    </v-app-bar>

      <v-main>
          <v-container fluid>
              <router-view></router-view>
          </v-container>
      </v-main>

  </v-app>
</template>

<script>
export default {
    data () {
    return {
      title: 'پلتفرم آموزش آنلاین',
      drawer: null,

      sections: [
       {
         title: 'کلاس ها',
         icon: 'class',
         items: [
           {'title': 'مشاهده کلاس ها', 'icon': 'list', 'to': {name: 'Class-List'}},
           {'title': 'اضاف کردن کلاس', 'icon': 'create', 'to': { name: 'Class-Add' }},
         ]
       }, 
       {
         title: 'کاربران',
         icon: 'account_box',
         items: [
           {'title': 'مدیریت کاربران'},
           {'title': 'اضافه کردن کاربر'},
         ]
       },
       {
         title: 'امتحانات',
         icon: 'assignment',
         items: [
           {'title': 'اضاف کردن امتحان'},
           {'title': 'لیست امتحانات'},
         ]
       }
      ]

    }
  },
    methods:{
        toggleDarkMode() {
            this.$vuetify.theme.dark=!this.$vuetify.theme.dark;
            console.log("before set ", this.$vuetify.theme.dark);
            localStorage.setItem('darkMode', this.$vuetify.theme.dark)
            console.log("after set ",  localStorage.getItem('darkMode'));

        }
    },
    mounted() {
        let darkMode = localStorage.getItem('darkMode');
        this.$vuetify.theme.dark = darkMode === 'true';
    }
}
</script>