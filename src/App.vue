<template>
<div>
  <v-app>

    <v-navigation-drawer 
      v-model="drawer"  
      right
    >
    <v-list-item two-line class="mx-1">
        <v-list-item-content>
        </v-list-item-content>
    </v-list-item>

    <v-list dense v-for="section in sections" :key="section.title" >
        <v-subheader> 
          <v-icon small class="mx-1">{{ section.icon }}</v-icon> {{ section.title }}
          </v-subheader>

        <v-list-item
          v-for="item in section.items"
          :key ="item.title"
          link
        >
          {{ item.title }}
        </v-list-item>

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
           {'title': 'مشاهده کلاس ها', 'icon': 'list'},
           {'title': 'اضاف کردن کلاس', 'icon': 'create'},
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