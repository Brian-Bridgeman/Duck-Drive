<script setup>
    import { ref } from "vue";
    const emit = defineEmits(["login-success"]);

    const username = ref("");
    const password = ref("");
    const isRegistering = ref(false);
    const error = ref("");

    async function handleSubmit() {
        error.value = "";
        const endpoint = isRegistering.value? "/api/register" : "/api/login";
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username.value,
                    password: password.value,
                })
            });
            const data = await response.json();
            if (!response.ok) {
                error.value = data.error;
                return;
            }
            if (isRegistering.value) {
                error.value = 'Registrereing lyckades!';
                isRegistering.value = false;
            } else{
                emit("login-success", data.username);
            }
        } catch (err) {
            error.value = "Connection error";
        }
    }
</script>
<template>
    <div class="login-container">
        <div class="login-box">
            <h2>{{  isRegistering ? 'Register' : 'Login' }}</h2>

            <form @submit.prevent="handleSubmit">
                <input
                    v-model="username"
                    type="text"
                    placeholder="Username"
                    required
                />
                <input
                    v-model="password"
                    type="password"
                    placeholder="Password"
                    required
                />
                <button type="submit">
                    {{ isRegistering ? 'Register' : 'Login' }}
                </button>
            </form>
            <p v-if="error" class="error">{{ error }}</p>

            <button @click="isRegistering = !isRegistering" class="toggle">
                {{  isRegistering ? 'Har du redan ett konto? Logga in' : 'Inget konto? Registrera dig här' }}
            </button>
        </div>
    </div>
</template>
<style scoped>
    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #ffffff;
    }
    .login-box {
        background: white;
        padding: 40px;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        width: 300px;
    }
    h2{
        margin-bottom: 20px;
        text-align: center;
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    input{
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 1em;
    }
    button {
        padding: 10px;
        background-color: #8d8888;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1em;
    }
    button:hover{
        background-color: #7a7575;
    }
    .toggle{
        margin-top: 10px;
        background: none;
        color: #8d8888;
        text-decoration: underline;
    }
    .error {
        color: red;
        margin-top: 10px;
        text-align: center;
    }
</style>
            