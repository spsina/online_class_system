<template>
<div>
  <v-app>

    <v-navigation-drawer 
      v-model="drawer"  
      right
    >
    <v-list >
      <v-list-item two-line class="mx-1">
        <v-list-item-content>
        </v-list-item-content>
      </v-list-item>
      <v-list-group v-for="section in sections" :key="section.title">

        <template v-slot:activator>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>{{ section.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ section.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-list-item
          v-for="item in section.items"
          :key ="item.title"
          link
        >
        
        <v-list-item-icon>
          <v-icon>mdi-{{home}}</v-icon>
        </v-list-item-icon>

          {{ item.title }}
        </v-list-item>
      </v-list-group>
    </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>
          {{ title }}
        </v-toolbar-title>
        
    </v-app-bar>

  </v-app>
</div>  
</template>

<script>
export default {
  data () {
    return {
      title: 'پلتفرم آموزش آنلاین',
      drawer: false,

      sections: [
       {
         title: 'کلاس ها',
         icon: 'class',
         items: [
           {'title': 'مشاهده کلاس ها'},
           {'title': 'اضاف کردن کلاس'},
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
  }
}
</script>