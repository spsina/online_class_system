<template>
    <v-app id="inspire" class="login">
        <v-main>
            <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="8" md="4">
                        <v-alert :value="authStatus === 'error'" type="error">نام کاربری یا کلمه عبور اشتباه است</v-alert>

                        <v-alert :value="authStatus === 'loggedIn'" type="success">شما وارد سیستم هستید</v-alert>

                        <v-alert :value="authStatus === 'networkError'" type="warning">ارتباط با سرور برقرار نشد</v-alert>

                        <v-card class="elevation-12">
                            <v-toolbar color="grey" dark flat>
                                <v-toolbar-title>ورود به سیستم</v-toolbar-title>
                                <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-card-text>
                                <v-form @submit.prevent="doLogin" id="login-form">
                                    <v-text-field
                                            label="نام کاربری"
                                            name="login"
                                            v-model="credentials.username"
                                            prepend-icon="mdi-account"
                                            type="text"
                                    ></v-text-field>


                                    <v-text-field
                                            id="password"
                                            label="کلمه عبور"
                                            name="password"
                                            v-model="credentials.password"
                                            prepend-icon="mdi-lock"
                                            type="password"
                                    ></v-text-field>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                        @click="doLogin"
                                        color="success"
                                        type="submit"
                                        form="login-form"
                                        :disabled="authStatus === 'loggingIn'"
                                        :loading="authStatus === 'loggingIn'"
                                >
                                    <span>ورود</span>
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
    import { mapGetters, mapActions } from "vuex";

    export default {
        computed: {
            ...mapGetters(["isLoggedIn", "authStatus"]),
        },
        methods: {
            ...mapActions(["login"]),

            doLogin() {
                if (
                    this.credentials.username !== "" &&
                    this.credentials.password !== ""
                ) {
                    this.login(this.credentials).then(() => {
                        this.$router.push({ name: "Home" });
                    });
                }
            },
        },
        data() {
            return {
                credentials: {
                    username: "",
                    password: "",
                },
            };
        },
    };
</script>

<style lang="scss" scoped>

    .login {
        background-image: url('https://i.pinimg.com/originals/f1/32/15/f13215a3276ab6f25339d39221caa4aa.jpg');
        background-size: cover;
        overflow: hidden;
    }

</style>